import { IRepository } from "../IRepository";
import { Result } from "../../types/Result";
import { Entity } from "../../domain/Entity";
import { Database } from "../../../Database";

const DEFAULT_QUERY_LIMIT = 5;

export abstract class BaseSQLRepository<T extends Entity<any>, D> implements IRepository<T> {
    protected entities: T[] = [];
    protected db: any = {};
    protected model: any;

    constructor(model: any) {
        this.entities = [];
        this.db = Database.getInstance();
        this.model = model;
    }

    abstract fromSQLModelData(data: D, id: string): Result<T>;
    abstract toSQLModelData(entity: T): D;

    // Atributos mínimos para listados rápidos; los repos concretos pueden sobreescribir
    protected listAttributes(): string[] | undefined {
        // Por defecto: no forzamos columnas (compatibilidad); en cada repo puedes overridear y devolver ["id", "nro", ...]
        return undefined;
    }

    private ensureIdAttr(attrs?: string[] | undefined): string[] | undefined {
        if (!attrs) return attrs;
        return attrs.includes("id") ? attrs : [...attrs, "id"];
    }

    // Obtiene el nombre real de la tabla asociada al modelo
    protected getTableName(): string {
        const t = (this.model as any).getTableName?.();
        return typeof t === "string" ? t : t?.tableName ?? (this.model as any).tableName ?? "";
    }

    /* async getById(id: string): Promise<Result<T>> {
        let dbError = false;
        let errMsg = "";
        const modelInstance = await this.model
            .findOne({
                where: {
                    id: id,
                },
            })
            .catch((error: any) => {
                errMsg = this.buildErrMsg(error);
                dbError = true;
            });
        if (dbError) {
            return Result.fail<T>(errMsg || "Error al obtener la entidad de la base de datos");
        }

        if (modelInstance) {
            return this.fromSQLModelData(modelInstance.dataValues, modelInstance.id);
        }
        return Result.fail<T>(`No existe "${this.model.tableName}" con id = "${id}"`);
    } */

       public async getById(id: string | number): Promise<Result<T>> {
           // Validación
           const idStr = `${id ?? ""}`.trim();
           if (idStr.length === 0) {
               return Result.fail<T>("'id' es requerido");
           }

           // Atributos: detalle > lista (normalizando undefined/null)
           const detailAttrsMaybe =
               typeof (this as any).detailAttributes === "function"
                   ? ((this as any).detailAttributes() as string[] | null | undefined)
                   : null;

           const listAttrsMaybe =
               typeof this.listAttributes === "function"
                   ? (this.listAttributes() as string[] | null | undefined)
                   : null;

           const attrsInput = detailAttrsMaybe ?? listAttrsMaybe ?? null;

           // 🔧 FIX: pasar undefined (no null) a ensureIdAttr
           const attrs = this.ensureIdAttr(attrsInput ?? undefined); // ← aquí se corrige el error

           // Opciones rápidas (datos planos)
           const qopts: { raw: boolean; nest: boolean; attributes?: string[] } = {
               raw: true,
               nest: false,
               ...(attrs ? { attributes: attrs } : {}),
           };

           try {
               // Buscar por PK (usa índice primario)
               const row: any | null = await(this.model as any).findByPk(idStr, qopts);

               if (!row) {
                   const tbl = String((this.model as any).tableName ?? (this.model as any).name ?? "entidad");
                   return Result.fail<T>(`No existe "${tbl}" con id = "${idStr}"`);
               }

               const idVal = String(row?.id ?? idStr);
               const mapped = this.fromSQLModelData(row, idVal);

               if (mapped.isFailure) {
                   return Result.fail<T>(mapped.error || "Datos inválidos en la entidad");
               }

               return mapped;
           } catch (error: unknown) {
               const errMsg = this.buildErrMsg?.(error) ?? "Error al obtener la entidad de la base de datos";
               return Result.fail<T>(errMsg);
           }
       }

    /* async getAll(): Promise<Result<T[]>> {
        let dbError = false;
        let errMsg = "";
        const rows = await this.model.findAll().catch((error: any) => {
            errMsg = this.buildErrMsg(error);
            dbError = true;
        });
        if (dbError) {
            return Result.fail<T[]>(errMsg || "Error al obtener las entidades");
        }

        const result = rows.map(
            (
                r: any, // los modelos estan sin tipos eso debe arreglarse
            ) => {
                return this.fromSQLModelData(r.dataValues, r.id);
            },
        );

        if (result.find((r: Result<T>) => r.isFailure)) {
            return Result.fail<T[]>("Datos invalidos en la entidad");
        }

        return Result.ok<T[]>(result.map((r: Result<T>) => r.getValue()));
    } */

    public async getAll(query?: Record<string, unknown>): Promise<Result<T[]>> {
        const noQueryArg: boolean = typeof query === "undefined";
        const q: Record<string, unknown> = query ?? {};

        // 1) Armar opciones
        const qopts: any = this.buildQueryOptions(q);

        // 2) Forzar modo rápido
        qopts.raw = true;
        qopts.nest = false;
        qopts.subQuery = false;

        // 3) Límite/offset por defecto SOLO si el caller pasó query
        if (!noQueryArg) {
            if (typeof qopts.limit !== "number" || qopts.limit <= 0) qopts.limit = DEFAULT_QUERY_LIMIT;
            if (typeof qopts.offset !== "number" || qopts.offset < 0) qopts.offset = 0;
        } else {
            // Si no se pasó query, NO limitar
            if ("limit" in qopts) delete qopts.limit;
            if ("offset" in qopts) delete qopts.offset;
        }

        // 4) Orden por defecto (usa índice). Si tu entidad define listOrder(), úsala
        if (!qopts.order || !Array.isArray(qopts.order) || qopts.order.length === 0) {
            qopts.order = [["id", "DESC"]];
        }

        // 5) Asegurar columnas (sin pisar _attributes explícito)
        const attrs: string[] | undefined = this.ensureIdAttr(this.listAttributes());
        if (attrs && !qopts.attributes) qopts.attributes = attrs;
        
        try {
            const rows: unknown = await (this.model as any).findAll(qopts);

            if (!Array.isArray(rows)) {
                return Result.fail<T[]>("Respuesta inesperada del ORM al listar entidades");
            }

            const mapped: Result<T>[] = (rows as any[]).map((r: any) => {
                const row: any = r?.dataValues ?? r;
                const idVal: unknown = row?.id ?? (r as any)?.id;
                if (idVal == null) {
                    return Result.fail<T>("Falta columna 'id' en el SELECT; inclúyela en listAttributes()/_attributes");
                }
                return this.fromSQLModelData(row, String(idVal));
            });

            const bad = mapped.find((m) => m.isFailure);
            if (bad) return Result.fail<T[]>("Datos inválidos en la entidad");
            
            let rowsFiltered = mapped.map((m) => m.getValue());
            if(q?.q ?? ""){ 
                const qLower = String(q?.q ?? "").toLowerCase();
                rowsFiltered = rowsFiltered.filter((row: T) => {
                    return Object.keys(row.props).some((key) => {
                        const value = (row.props as Record<string, any>)[key];
                        return typeof value === "string" && value.toLowerCase().includes(qLower);
                    });
                });
            }
            return Result.ok<T[]>(rowsFiltered);
        } catch (error: any) {
            const errMsg: string = this.buildErrMsg?.(error) ?? "Error al obtener las entidades";
            return Result.fail<T[]>(errMsg);
        }
    }
    
    async exists(entity: T): Promise<Result<boolean>> {
        const foundEntity = this.entities.find((u) => u.equals(entity));
        return Result.ok<boolean>(!!foundEntity);
    }

    async save(entity: T): Promise<Result<T>> {
        let dbError = false;
        let errMsg = "";
        const values = this.toSQLModelData(entity);
        await this.model
            .findOne({
                where: {
                    id: entity.id,
                },
            })
            .then((instance: any) => {
                if (instance) {
                    return instance.update(values);
                }
                return this.model.create({ id: entity.id, ...values });
            })
            .catch((error: any) => {
                errMsg = this.buildErrMsg(error);
                dbError = true;
            });
        if (dbError) {
            return Result.fail<T>(errMsg || "Error al guardar la entidad");
        }
        return Result.ok<T>(entity);
    }

    async bulkSave(entities: T[]): Promise<Result<T>> {
        let dbError = false;
        let errMsg = "";
        const allValues = [];
        for (const i in entities) {
            const entity = entities[i];
            const values = this.toSQLModelData(entity);
            allValues.push({ id: entity.id, ...values });
        }
        await this.model
            .bulkCreate(allValues)
            .then(() => ({}))
            .catch((error: any) => {
                errMsg = this.buildErrMsg(error);
                dbError = true;
            });
        if (dbError) {
            return Result.fail<T>(errMsg || "Error al guardar en bulk las entidades");
        }
        return Result.ok<T>();
    }

    public async findAll(query: any): Promise<Result<{ rows: T[]; count: number }>> {
        console.log(query);
        const result: { rows: T[]; count: number } = {
            rows: this.entities,
            count: this.entities.length,
        };
        return Result.ok<{ rows: T[]; count: number }>(result);
    }

    public async destroy(id: string): Promise<Result<boolean>> {
        let dbError = false;
        let errMsg = "";
        await this.model
            .destroy({
                where: {
                    id: id,
                },
                individualHooks: true,
            })
            .catch((error: any) => {
                errMsg = this.buildErrMsg(error);
                dbError = true;
            });

        if (dbError) {
            return Result.fail<boolean>(errMsg || "Error al borrar la entidad");
        }
        return Result.ok<boolean>(true);
    }

    public async purgeAll(): Promise<Result<boolean>> {
        let dbError = false;
        let errMsg = "";
        await this.model
            .destroy({
                where: {}, // Sin condiciones para eliminar todos los registros
                truncate: true, // Optimizar eliminación
                cascade: true, // Eliminar con dependencias si hay claves foráneas
                force: true, // Ignorar paranoid y borrar físicamente
            })
            .catch((error: any) => {
                errMsg = this.buildErrMsg(error);
                dbError = true;
            });

        if (dbError) {
            return Result.fail<boolean>(errMsg || "Error al purgar los registros");
        }
        return Result.ok<boolean>(true);
    }

    public buildQueryOptions = (query: any) => {
        const limit = query._limit ? parseInt(query._limit, 10) : DEFAULT_QUERY_LIMIT;
        const page = query._page ? parseInt(query._page, 10) : 1;

        const opts: any = {
            limit,
            offset: page >= 1 ? (page - 1) * limit : 0,
        };

        if (query._sort) {
            const dir = (query._order || "ASC").toString().toUpperCase() === "DESC" ? "DESC" : "ASC";
            opts.order = [[query._sort, dir]];
        }

        if (query._attributes) {
            try {
                const attrs = Array.isArray(query._attributes) ? query._attributes : JSON.parse(query._attributes);
                if (Array.isArray(attrs) && attrs.length) opts.attributes = attrs;
            } catch {
                /* ignore */
            }
        }

        const reserved = new Set(["_limit", "_page", "_sort", "_order", "_attributes", "_seek", "_count", "_distinct", "q"]);
        for (const k of Object.keys(query || {})) {
            if (reserved.has(k)) continue;
            const v = query[k];
            if (v === undefined || v === null || v === "") continue;
            opts.where = opts.where || {};
            opts.where[k] = v;
        }

        // Permitido sólo explícito
        if (query._distinct === "1") {
            opts.distinct = true;
            opts.col = "id";
        }

        return opts;
    };

    private buildErrMsg(error: any) {
        let errMsg = error.message;
        if (error.parent && error.parent.code && error.parent.code === "ECONNREFUSED") {
            errMsg = "Error de conexión con la base de datos";
        }
        console.log(error);
        return errMsg;
    }

    public async countAllExact(query?: any): Promise<number> {
        try {
            // Reutiliza tu buildQueryOptions para obtener el WHERE normalizado
            const qopts = this.buildQueryOptions(query ?? {});
            const where = (qopts as any).where;

            // El count NO debe llevar limit/offset/order
            const total = await (this.model as any).count(where ? { where } : {});
            return typeof total === "number" ? total : 0;
        } catch {
            return 0;
        }
    }
}

export default BaseSQLRepository;
