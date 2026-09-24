import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../../base/types/Result";
import ActaRecepcionView from "..";
import ActaRecepcionService from "../../../../../core/admin/archivo/acta_recepcion";
import { ActaRecepcionProps } from "../../../../../core/admin/archivo/acta_recepcion/ActaRecepcionEntity";
import { 
    ActaRecepcionDetalleFormDataResponse, 
    ActaRecepcionFormDataResponse, 
    GetActaRecepcionDetalleTableResponse, 
    GetActaRecepcionsTableResponse 
} from "../ActaRecepcionView";
import { Report2 } from '../../../../../tools/Report2';
import { ActaRecepcionDetalleProps } from "../../../../../core/admin/archivo/acta_recepcion_detalle/ActaRecepcionDetalleEntity";
import ActaRecepcionDetalleService from "../../../../../core/admin/archivo/acta_recepcion_detalle";
import DocumentoService from "../../../../../core/admin/archivo/documento";
import { DocumentoProps } from "../../../../../core/admin/archivo/documento/DocumentoEntity";

export type DocumentoRecepcionProps = {
    nro        : string;
    tipo       : string;
    descripcion: string;
    docAdjunto : string;
    gestion    : string;
    fecha      : Date;
    hojasRuta  : string;
    grupoGasto : string;
    estado     : string;
    nrofolio   : string;
};

type DocumentoRecepcionItem = {
    nro        : number;
    tipo       : string;
    gestion    : string;
    nrofolio   : string;
    descripcion: string;
};

const DOCUMENTO_RECEPCION_DUPLICADO_MSG = "No se puede guardar porque ya existe un documento con el mismo nro documento, tipo y gestion.";

function parseNroDocumentos(nrodoc: unknown): { nros: number[]; error?: string } {
    const values = String(nrodoc || "")
        .split(",")
        .map((nro) => nro.trim())
        .filter((nro) => nro.length > 0);

    if (values.length === 0) return { nros: [], error: "Debe ingresar al menos un nro documento." };

    const nros = values.map((value) => Number(value));
    if (nros.some((nro) => !Number.isInteger(nro) || nro < 0)) {
        return { nros: [], error: "El campo nro documento solo acepta numeros enteros separados por coma." };
    }

    const duplicated = nros.find((nro, index) => nros.indexOf(nro) !== index);
    if (duplicated !== undefined) {
        return { nros: [], error: `El nro documento ${duplicated} esta repetido en el formulario.` };
    }

    return { nros };
}

function formatNroDocumentos(nros: number[]): string {
    return nros.join(",");
}

function buildDocumentoRecepcionItems(data: {
    nrodoc: unknown;
    tipo: unknown;
    gestion: unknown;
    nrofolio: unknown;
    descripcion: unknown;
}): { documentos: DocumentoRecepcionItem[]; nrodoc: string; tipo: string; gestion: string; error?: string } {
    const tipo = String(data.tipo || "").trim();
    const gestion = String(data.gestion || "").trim();

    if (!tipo || !gestion) {
        return { documentos: [], nrodoc: "", tipo, gestion, error: "Debe completar tipo y gestion." };
    }

    const parsed = parseNroDocumentos(data.nrodoc);
    if (parsed.error) {
        return { documentos: [], nrodoc: "", tipo, gestion, error: parsed.error };
    }

    return {
        documentos: parsed.nros.map((nro) => ({
            nro,
            tipo,
            gestion,
            nrofolio: String(data.nrofolio || "").trim(),
            descripcion: String(data.descripcion || "").trim(),
        })),
        nrodoc: formatNroDocumentos(parsed.nros),
        tipo,
        gestion,
    };
}

async function findDocumentosExistentes(documentos: DocumentoRecepcionItem[]): Promise<{ nros: number[]; error?: string }> {
    if (documentos.length === 0) return { nros: [] };

    const groups = documentos.reduce<Record<string, DocumentoRecepcionItem[]>>((acc, documento) => {
        const key = `${documento.tipo}|${documento.gestion}`;
        acc[key] = acc[key] || [];
        acc[key].push(documento);
        return acc;
    }, {});

    const existing: number[] = [];
    for (const group of Object.values(groups)) {
        const nros = group.map((documento) => documento.nro);
        const first = group[0];
        const result = await DocumentoService.getAll({
            _limit: nros.length,
            _page: 1,
            _attributes: ["id", "nro", "tipo", "gestion"],
            nro: nros,
            tipo: first.tipo,
            gestion: first.gestion,
        });

        if (result.isFailure) return { nros: [], error: String(result.error) };

        result.getValue().forEach((documento) => {
            const nro = Number(documento.props.nro);
            if (!existing.includes(nro)) existing.push(nro);
        });
    }

    return { nros: existing };
}

async function findDocumentosRepetidosEnActa(
    documentos: DocumentoRecepcionItem[],
    actaRecepcionId?: string | null,
    detalleActualId?: string,
): Promise<{ nros: number[]; error?: string }> {
    if (!actaRecepcionId || documentos.length === 0) return { nros: [] };

    const detalles = await ActaRecepcionDetalleService.getAll();
    if (detalles.isFailure) return { nros: [], error: String(detalles.error) };

    const currentNros = new Set(documentos.map((documento) => documento.nro));
    const first = documentos[0];
    const repeated: number[] = [];

    detalles.getValue()
        .filter((detalle) => detalle.id !== String(detalleActualId || ""))
        .filter((detalle) => detalle.props.actaRecepcionId === actaRecepcionId)
        .filter((detalle) => String(detalle.props.tipo || "").trim() === first.tipo)
        .filter((detalle) => String(detalle.props.gestion || "").trim() === first.gestion)
        .forEach((detalle) => {
            const parsed = parseNroDocumentos(detalle.props.nrodoc);
            parsed.nros.forEach((nro) => {
                if (currentNros.has(nro) && !repeated.includes(nro)) repeated.push(nro);
            });
        });

    return { nros: repeated };
}

function findDocumentosRepetidosEnLista(documentos: DocumentoRecepcionItem[]): number[] {
    const seen = new Set<string>();
    const repeated: number[] = [];

    documentos.forEach((documento) => {
        const key = `${documento.nro}|${documento.tipo}|${documento.gestion}`;
        if (seen.has(key) && !repeated.includes(documento.nro)) repeated.push(documento.nro);
        seen.add(key);
    });

    return repeated;
}

function isDocumentoDuplicadoPersistenceError(error: unknown): boolean {
    const message = String(error || "").toLowerCase();
    return message.includes("documento_nro_tipo_gestion_unique") || message.includes("validation error");
}

export class ActaRecepcionViewController extends BaseHttpController {
    public async getActaRecepcionsTable(req: Request, res: Response): Promise<Response<any>> {
        const data = await ActaRecepcionView.getActaRecepcionsTable(req.query);
        if (data.isFailure) {
            return this.fail(res, data.error as string);
        }
        return this.ok<GetActaRecepcionsTableResponse>(res, data.getValue());
    }
        
    public async getActaRecepcionDetalleTable(req: Request, res: Response): Promise<Response<any>> {
        const data = await ActaRecepcionView.getActaRecepcionDetalleTable(req.query);
        if (data.isFailure) {
            return this.fail(res, data.error as string);
        }
        return this.ok<GetActaRecepcionDetalleTableResponse>(res, data.getValue());
    }       

    public async getActaRecepcionFormData(req: Request, res: Response): Promise<any> {
        const formData = await ActaRecepcionView.getActaRecepcionFormDataView(req.params.acta_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<ActaRecepcionFormDataResponse>(res, formData.getValue());
    }
    
    public async getActaRecepcionDetalleFormData(req: Request, res: Response): Promise<any> {
        const formData = await ActaRecepcionView.getActaRecepcionDetalleFormDataView(req.params.acta_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<ActaRecepcionDetalleFormDataResponse>(res, formData.getValue());
    }
    
    public async changeActaRecepcionSellar(req: Request, res: Response): Promise<any> {
        const ID_ACTA = req.params.acta_id;
        const sellado = true;

        const actaR = await ActaRecepcionDetalleService.getAll();
        if (actaR.isFailure) return this.fail(res, String(actaR.error));
        const actaRecepcionDetalleResult = actaR.getValue().filter((ad) => ad.props.actaRecepcionId===ID_ACTA);

        const ID_DOCUMENTOS: string[] = [];
        const documentArray: DocumentoRecepcionItem[] = [];

        for (const ar of actaRecepcionDetalleResult) {
            const build = buildDocumentoRecepcionItems({
                nrodoc: ar.props.nrodoc,
                tipo: ar.props.tipo,
                gestion: ar.props.gestion,
                nrofolio: ar.props.nrofolio,
                descripcion: ar.props.descripcion,
            });

            if (build.error) return this.badRequest(res, build.error);
            documentArray.push(...build.documentos);
        }

        const repetidosEnActa = findDocumentosRepetidosEnLista(documentArray);
        if (repetidosEnActa.length > 0) {
            return this.conflict(res, `El acta tiene nros documento repetidos: ${repetidosEnActa.join(", ")}.`);
        }

        const documentosExistentes = await findDocumentosExistentes(documentArray);
        if (documentosExistentes.error) return this.fail(res, "Error al verificar documentos existentes");
        if (documentosExistentes.nros.length > 0) {
            return this.conflict(res, `${DOCUMENTO_RECEPCION_DUPLICADO_MSG} Nros: ${documentosExistentes.nros.join(", ")}.`);
        }
        
        for(let i=0; i<documentArray.length; i++) {
            const props_: DocumentoProps = {
                nro        : documentArray[i].nro,
                tipo       : documentArray[i].tipo,
                gestion    : documentArray[i].gestion,
                nrofolio   : documentArray[i].nrofolio,
                descripcion: documentArray[i].descripcion,
                fecha      : new Date(),
                estado     : '-',
                permiso    : "NORMAL",
                monto      : 0,
                adjuntos   : []
            };
            const result_ = await DocumentoService.create(props_);
            if(result_.isFailure && isDocumentoDuplicadoPersistenceError(result_.error)) return this.conflict(res, DOCUMENTO_RECEPCION_DUPLICADO_MSG);
            if(result_.isFailure) return this.fail(res, String(result_.error));
            const documentoResultId = result_.getValue().id;
            if(result_.isSuccess) ID_DOCUMENTOS.push(documentoResultId);
        }
        
        const documentosId: string[] = ID_DOCUMENTOS;
        const result = await ActaRecepcionService.update(ID_ACTA,{ sellado, documentosId });
        if (result.isFailure) return this.fail(res, "Falló al cambiar sellado");
        
        return this.ok(res);        
    }

    public async createOrUpdateActaRecepcion(req: Request, res: Response): Promise<any> {
        const data = req.body;

        const ID_ACTA = data.id;
                
        let codigo = data.cod_acta;
        if (ID_ACTA===undefined){           
            const actarecepcion = await ActaRecepcionService.getAll();
            if (actarecepcion.isFailure) return this.fail(res, "Acta Recepcion no encontrado");
            const actarecepcionResult = actarecepcion.getValue();
            
            /* //-- proceso de asignacion de codigo de acta correlativo */
            const actasRecepcionCodigo = actarecepcionResult.map((vr) => parseInt(vr.props.codActa.match(/\d+/)?.[0] || "0", 10))
                                                .slice().sort((a, b) => b - a);        
            const nro_acta = actasRecepcionCodigo.length > 0 ? actasRecepcionCodigo[0] + 1: 1;
            codigo = nro_acta.toString().padStart(5, '0')+"ACT_REC";
            /* --// proceso de asignacion de codigo de acta correlativo */
        }

        const props: ActaRecepcionProps = {
            fechaRegistro     : new Date(),
            codActa           : codigo,
            observacion       : data.observacion,
            documentosId      : data.documentosId,
            areaId            : data.area_id,
            personalId        : data.personal_id,
            estado            : true,
            sellado           : false
        };
               
        let result = null;
        if (ID_ACTA) result = await ActaRecepcionService.update(ID_ACTA, props);
        else result = await ActaRecepcionService.create(props);      

        if (result.isFailure) return this.fail(res, String(result.error));

        return this.ok(res, result);
    }

    public async createOrUpdateActaRecepcionDetalle(req: Request, res: Response): Promise<any> {
        const data = req.body;

        const ID_ACTA = data.id;
        const build = buildDocumentoRecepcionItems({
            nrodoc: data.nrodoc,
            tipo: data.tipo,
            gestion: data.gestion,
            nrofolio: data.nrofolio,
            descripcion: data.descripcion,
        });

        if (build.error) return this.badRequest(res, build.error);

        const documentosExistentes = await findDocumentosExistentes(build.documentos);
        if (documentosExistentes.error) return this.fail(res, "Error al verificar documentos existentes");
        if (documentosExistentes.nros.length > 0) {
            return this.conflict(res, `${DOCUMENTO_RECEPCION_DUPLICADO_MSG} Nros: ${documentosExistentes.nros.join(", ")}.`);
        }

        const repetidosEnDetalle = await findDocumentosRepetidosEnActa(
            build.documentos,
            data.acta_recepcion_id,
            ID_ACTA,
        );
        if (repetidosEnDetalle.error) return this.fail(res, "Error al verificar documentos repetidos en el acta");
        if (repetidosEnDetalle.nros.length > 0) {
            return this.conflict(res, `El acta ya tiene registrados estos nros documento: ${repetidosEnDetalle.nros.join(", ")}.`);
        }
        
        const props: ActaRecepcionDetalleProps = {
            nrodoc         : build.nrodoc,
            tipo           : build.tipo,
            nrofolio       : String(data.nrofolio || "").trim(),
            gestion        : build.gestion,
            descripcion    : String(data.descripcion || "").trim(),
            actaRecepcionId: data.acta_recepcion_id
        };
        

        let result = null;
        if (ID_ACTA) result = await ActaRecepcionDetalleService.update(ID_ACTA, props);
        else result = await ActaRecepcionDetalleService.create(props);      

        if (result.isFailure) return this.fail(res, String(result.error));

        return this.ok(res, result);
    }

    public async getPDFActa(req: Request, res: Response): Promise<any> {
        const id: string = req.body.id;        
        const formData = await ActaRecepcionView.getPDFActa(req.authUser, id);
        if (formData.isFailure) return this.fail(res, String(formData.error));
    
        const result = formData.getValue();
        return Report2.creaPDF(result, 'actarecepcion', res);
    }


    public async destroyActaRecepcion(req: Request, res: Response): Promise<any> {
        const ID_ACTA = req.params.acta_id;
        const actaR = await ActaRecepcionService.getById(ID_ACTA);
        if (actaR.isFailure) return this.fail(res, String(actaR.error));

        const result = await ActaRecepcionService.delete(ID_ACTA);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async destroyActaRecepcionDetalle(req: Request, res: Response): Promise<any> {
        const ID_ACTA = req.params.acta_id;
        const actaR = await ActaRecepcionDetalleService.getById(ID_ACTA);
        if (actaR.isFailure) return this.fail(res, String(actaR.error));

        const result = await ActaRecepcionDetalleService.delete(ID_ACTA);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async changeState(req: Request, res: Response): Promise<any> {
        const actaId = req.params.acta_id;
        const estado = Boolean(req.body.estado);

        const result = await ActaRecepcionService.update(actaId, { estado });
        if (result.isFailure) return this.fail(res, "Falló al cambiar estado");
        return this.ok(res);
    }    
}
