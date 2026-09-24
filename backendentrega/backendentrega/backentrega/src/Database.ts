import { Sequelize } from "sequelize";
import { DATABASE } from "./config/app-config";
//@SYSTEM
import { UsuarioSQLModel } from "./core/system/autenticacion/usuario/infra/_sql/UsuarioSQLModel";
import { AccesoSQLModel } from "./core/system/autenticacion/acceso/infra/_sql/AccesoSQLModel";
import { RoleSQLModel } from "./core/system/autenticacion/role/infra/_sql/RoleSQLModel";
import { RutaSQLModel } from "./core/system/autenticacion/ruta/infra/_sql/RutaSQLModel";
import { BitacoraSQLModel } from "./core/system/auditoria/bitacora/infra/_sql/BitacoraSQLModel";
//@ADMIN
//RRHH
import { PersonalSQLModel } from "./core/rrhh/personal/infra/_sql/PersonalSQLModel";
import { CargoSQLModel } from "./core/rrhh/cargo/infra/_sql/CargoSQLModel";
import { VacacionSQLModel } from "./core/rrhh/vacacion/infra/_sql/VacacionSQLModel";
import { AreaSQLModel } from "./core/rrhh/area/infra/_sql/AreaSQLModel";

//BSSS
import { AsignacionSQLModel } from "./core/admin/bsss/asignacion/infra/_sql/AsignacionSQLModel";
import { DestinoSQLModel } from "./core/admin/bsss/destino/infra/_sql/DestinoSQLModel";
import { ValeSQLModel } from "./core/admin/bsss/vale/infra/_sql/ValeSQLModel";
import { VehiculoSQLModel } from "./core/admin/bsss/vehiculo/infra/_sql/VehiculoSQLModel";
//CONTA
import { CuentaSQLModel } from "./core/admin/conta/cuenta/infra/_sql/CuentaSQLModel";
import { DeudaSQLModel } from "./core/admin/conta/deuda/infra/_sql/DeudaSQLModel";
import { SeguimientoSQLModel } from "./core/admin/conta/seguimiento/infra/_sql/SeguimientoSQLModel";
import { HistorialSQLModel } from "./core/admin/conta/historial/infra/_sql/HistorialSQLModel";
//CONTRA
import { ProcesoSQLModel } from "./core/admin/contra/proceso/infra/_sql/ProcesoSQLModel";
import { ActividadSQLModel } from "./core/admin/contra/actividad/infra/_sql/ActividadSQLModel";
import { GeneralSQLModel } from "./core/admin/contra/general/infra/_sql/GeneralSQLModel";
//ARCHIVO
import { DocumentoSQLModel } from "./core/admin/archivo/documento/infra/_sql/DocumentoSQLModel";
import { ActaSQLModel } from "./core/admin/archivo/acta/infra/_sql/ActaSQLModel";
import { ActaRecepcionSQLModel } from "./core/admin/archivo/acta_recepcion/infra/_sql/ActaRecepcionSQLModel";
import { ActaRecepcionDetalleSQLModel } from "./core/admin/archivo/acta_recepcion_detalle/infra/_sql/ActaRecepcionDetalleSQLModel";
//CONTA_VIATICO
import { DescargoSQLModel } from "./core/admin/conta_viatico/descargo/infra/_sql/DescargoSQLModel";
import { DetalleDestinoSQLModel } from "./core/admin/conta_viatico/detalle_destino/infra/_sql/DetalleDestinoSQLModel";
import { EscalaSQLModel } from "./core/admin/conta_viatico/escala/infra/_sql/EscalaSQLModel";
import { InformeComisionSQLModel } from "./core/admin/conta_viatico/informe_comision/infra/_sql/InformeComisionSQLModel";
import { InformeGeneralSQLModel } from "./core/admin/conta_viatico/informe_general/infra/_sql/InformeGeneralSQLModel";
import { MemorandumSQLModel } from "./core/admin/conta_viatico/memorandum/infra/_sql/MemorandumSQLModel";
import { VehiculoPublicoSQLModel } from "./core/admin/conta_viatico/vehiculo_publico/infra/_sql/VehiculoPublicoSQLModel";
import { ViaticoSQLModel } from "./core/admin/conta_viatico/viatico/infra/_sql/ViaticoSQLModel";
import { AperturaViaticoSQLModel } from "./core/admin/conta_viatico/apertura_viatico/infra/_sql/AperturaViaticoSQLModel";
import { EscalaDestinoSQLModel } from "./core/admin/conta_viatico/escala_destino/infra/_sql/EscalaDestinoSQLModel";
//APERTURA
import { AperturaGeneralSQLModel } from "./core/admin/apertura/apertura_general/infra/_sql/AperturaGeneralSQLModel";
import { HistorialAperturaSQLModel } from "./core/admin/apertura/historial_apertura/infra/_sql/HistorialAperturaSQLModel";
import { ObjetoGastoSQLModel } from "./core/admin/apertura/objeto_gasto/infra/_sql/ObjetoGastoSQLModel";
import {HistorialGastoSQLModel} from "./core/admin/apertura/historial_gasto/infra/_sql/HistorialGastoSQLModel"
import { MemorandumrrhhSQLModel } from "./core/rrhh/memorandum_rrhh/infra/_sql/MemorandumrrhhSQLModel";
import { DetalleDestinorrhhSQLModel } from "./core/rrhh/detalle_destino_rrhh/infra/_sql/DetalleDestinorrhhSQLModel";
//CITES
import { CitesSQLModel } from "./core/admin/correspondencia/cites/infra/_sql/CitesSQLModel";
import { TipoCitesSQLModel } from "./core/admin/correspondencia/tipo_cites/infra/_sql/TipoCitesSQLModel";
import { BitacoraDetalleSQLModel } from "./core/admin/bsss/bitacora_detalle/infra/_sql/BitacoraDetalleSQLModel";
import { BitacoraViajeSQLModel } from "./core/admin/bsss/bitacora_viaje/infra/_sql/BitacoraViajeSQLModel";

export class Database {
    private static instance: Database;

    private _sequelize: any;
    private _models: any;

    private constructor() {
        console.log("[database] preparando base de datos...");
        this._sequelize = new Sequelize(DATABASE.database, DATABASE.username, DATABASE.password, DATABASE.params);
        this._models = this._loadModels();
        console.log("\x1b[92m[database] Base de datos configurada exitosamente. :)\x1b[0m");

        if (process.env.CREATE_DATABASE) {
            this._syncDatabase(this._sequelize, this._models);
        }
    }

    _loadModels(): { [key: string]: any } {
        const models: any = {};

        // models definition
        console.log("[database] cargando modelos...");
        //@SYSTEM
        models.usuario  = UsuarioSQLModel.define(this._sequelize, Sequelize);
        models.role     = RoleSQLModel.define(this._sequelize, Sequelize);
        models.acceso   = AccesoSQLModel.define(this._sequelize, Sequelize);
        models.ruta     = RutaSQLModel.define(this._sequelize, Sequelize);
        models.bitacora = BitacoraSQLModel.define(this._sequelize, Sequelize);
        //@ADMIN
        //RRHH        
        models.personal             = PersonalSQLModel.define(this._sequelize, Sequelize);
        models.cargo                = CargoSQLModel.define(this._sequelize, Sequelize);
        models.area                 = AreaSQLModel.define(this._sequelize, Sequelize);
        models.vacacion             = VacacionSQLModel.define(this._sequelize, Sequelize);
        models.memorandum_rrhh      = MemorandumrrhhSQLModel.define(this._sequelize, Sequelize);
        models.detalle_destino_rrhh = DetalleDestinorrhhSQLModel.define(this._sequelize, Sequelize);
        //BSSS
        models.asignacion = AsignacionSQLModel.define(this._sequelize, Sequelize);
        models.destino    = DestinoSQLModel.define(this._sequelize, Sequelize);
        models.vale       = ValeSQLModel.define(this._sequelize, Sequelize);
        models.vehiculo   = VehiculoSQLModel.define(this._sequelize, Sequelize);
        models.bitacora_viaje   = BitacoraViajeSQLModel.define(this._sequelize, Sequelize);
        models.bitacora_detalle = BitacoraDetalleSQLModel.define(this._sequelize, Sequelize);
        //CONTA
        models.cuenta      = CuentaSQLModel.define(this._sequelize, Sequelize);
        models.deuda       = DeudaSQLModel.define(this._sequelize, Sequelize);
        models.historial   = HistorialSQLModel.define(this._sequelize, Sequelize);
        models.seguimiento = SeguimientoSQLModel.define(this._sequelize, Sequelize);
        //CONTRA
        models.proceso   = ProcesoSQLModel.define(this._sequelize, Sequelize);
        models.actividad = ActividadSQLModel.define(this._sequelize, Sequelize);
        models.general   = GeneralSQLModel.define(this._sequelize, Sequelize); 
        //ARCHIVO
        models.documento              = DocumentoSQLModel.define(this._sequelize, Sequelize);
        models.acta                   = ActaSQLModel.define(this._sequelize, Sequelize);
        models.acta_recepcion         = ActaRecepcionSQLModel.define(this._sequelize, Sequelize);
        models.acta_recepcion_detalle = ActaRecepcionDetalleSQLModel.define(this._sequelize, Sequelize);
        //CONTA_VIATICO
        models.descargo         = DescargoSQLModel.define(this._sequelize, Sequelize);
        models.detalle_destino  = DetalleDestinoSQLModel.define(this._sequelize, Sequelize);
        models.escala           = EscalaSQLModel.define(this.sequelize, Sequelize);
        models.informe_comision = InformeComisionSQLModel.define(this._sequelize, Sequelize);
        models.informe_general  = InformeGeneralSQLModel.define(this._sequelize, Sequelize);
        models.memorandum       = MemorandumSQLModel.define(this._sequelize, Sequelize);
        models.vehiculo_publico = VehiculoPublicoSQLModel.define(this._sequelize, Sequelize);
        models.viatico          = ViaticoSQLModel.define(this._sequelize, Sequelize);
        models.apertura_viatico = AperturaViaticoSQLModel.define(this._sequelize, Sequelize);
        models.escala_destino   = EscalaDestinoSQLModel.define(this.sequelize, Sequelize);
        // APERTURA
        models.apertura_general     = AperturaGeneralSQLModel.define(this.sequelize, Sequelize);
        models.historial_detalle_ap = HistorialAperturaSQLModel.define(this.sequelize, Sequelize);    
        models.objeto_gasto         = ObjetoGastoSQLModel.define(this.sequelize, Sequelize);       
        models.historial_gasto_ap   = HistorialGastoSQLModel.define(this.sequelize, Sequelize); 
        //CITES
        models.cites              = CitesSQLModel.define(this.sequelize, Sequelize);       
        models.tipo_cites         = TipoCitesSQLModel.define(this.sequelize, Sequelize); 
        // create associations
        console.log("[database] asociando modelos...");
        Object.keys(models).forEach((key) => {
            if ("associate" in models[key]) {
                models[key].associate(models);
            }
            _updateForeignKeys(models, models[key]);
        });

        return models;
    }

    _syncDatabase(sequelize: Sequelize, models: any) {
        console.log("[database] Sincronizando base de datos...");
        sequelize
            .sync({ force: true })
            .then(async () => {
                console.log("[database] tablas creadas exitosamente");
                console.log("[database] Ejecutando seeders...\n");
                await _createSeed("usuario", models);
                await _createSeed("role", models);
                await _createSeed("ruta", models);

                console.log("\n\x1b[92m[database] BASE DE DATOS CREADA EXITOSAMENTE. :)\x1b[0m\n\n");
                process.exit(0);
            })
            .catch((e) => {
                console.log(e);
            });
    }

    get sequelize() {
        return this._sequelize;
    }

    get models() {
        return this._models;
    }

    static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

function _updateForeignKeys(models: any, MODEL: any) {
    Object.keys(MODEL.rawAttributes).forEach((fieldName) => {
        const FIELD = MODEL.rawAttributes[fieldName];
        if (FIELD.references) {
            const F_TARGET = FIELD.targetKey;
            const F_MODEL = FIELD.references.model;
            let F_MODEL_INSTANCE;
            if (typeof F_MODEL === "string") {
                F_MODEL_INSTANCE = models[F_MODEL];
            } else {
                const F_TABLE = FIELD.references.model.tableName;
                F_MODEL_INSTANCE = models[F_TABLE];
            }
            FIELD.validate = F_MODEL_INSTANCE.rawAttributes[F_TARGET].validate;
            FIELD.comment = FIELD.comment || F_MODEL_INSTANCE.rawAttributes[F_TARGET].comment;
            FIELD.example = FIELD.example || F_MODEL_INSTANCE.rawAttributes[F_TARGET].example;
        }
    });
}

async function _createSeed(modelName: string, models: any): Promise<void> {
    console.log(`[seed] ${modelName} ...`);
    await models[modelName].bulkCreate((await import(`./seeders/${modelName}`)).default);
}
