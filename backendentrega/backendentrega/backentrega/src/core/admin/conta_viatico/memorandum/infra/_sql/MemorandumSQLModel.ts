export type MemorandumSQLModelData = {
    cod_depart_memo        : string;
    autorizado_por         : string[];
   // cargo_jefe_unidad      : string;
    fecha_memo_registro    : Date;
    tipo_comision_idp      : string;
    fecha_inicio_viaje     : Date;
    fecha_fin_viaje        : Date;
    cantidad_dias          : number;
    tipo_memo_repo         : string;
    tipo_transporte        : string;
    observacion            : string;
    estado_memorandum      : string;
    notificacion_memo      : string;
    dias_habiles           : string;
    fid_apertura_viatico   : string | null;
    fid_apertura_pasaje    : string | null;
    fid_usuario            : string | null;
    modificacion           : boolean; 
    obs_modificacion       : string | null;
    fecha_cambio           : string;
    estado_modificacion    : string;
    justificacion        : string;  
    aprobacion_rrhh_conta  : string[];
    tiempo_aprobacion_usuario : string[];
};

export class MemorandumSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("memorandum", {
            id                     : { type: Sequelize.UUID, primaryKey: true },
            cod_depart_memo        : { type: Sequelize.STRING() },
            autorizado_por         : { type: Sequelize.JSON(), defaultValue: [] },
            aprobacion_rrhh_conta  : { type: Sequelize.JSON(), defaultValue: [] },
            tiempo_aprobacion_usuario : { type: Sequelize.JSON(), defaultValue: [] },
          // cargo_jefe_unidad      : { type: Sequelize.STRING() },
            fecha_memo_registro    : { type: Sequelize.DATE() },
            tipo_comision_idp      : { type: Sequelize.STRING() },
            fecha_inicio_viaje     : { type: Sequelize.DATE() },
            fecha_fin_viaje        : { type: Sequelize.DATE() },
            cantidad_dias          : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            tipo_memo_repo         : { type: Sequelize.STRING() },
            tipo_transporte        : { type: Sequelize.STRING() },
            observacion            : { type: Sequelize.STRING() },
            estado_memorandum      : { type: Sequelize.STRING() },
            notificacion_memo      : { type: Sequelize.STRING() },
            dias_habiles           : { type: Sequelize.STRING() },
            modificacion           : { type: Sequelize.BOOLEAN()},
            obs_modificacion       : { type: Sequelize.STRING()},
            fecha_cambio           : { type: Sequelize.STRING()},
            estado_modificacion    : { type: Sequelize.STRING()},
            justificacion          : { type: Sequelize.STRING()},
            
        });

        MODEL.associate = (models: any) => {
            const APERTURAVIATICO     = models.apertura_viatico;
            const USUARIO             = models.usuario;
            const VEHICULO            = models.vehiculo;
            const MEMORANDUM          = models.memorandum;
            const CARGO               = models.cargo;

            MEMORANDUM.belongsTo(APERTURAVIATICO, {
                as: "apertura_viatico",
                foreignKey: { name: "fid_apertura_viatico",  targetKey: "id" },
                constraints: false,
            });

            MEMORANDUM.belongsTo(APERTURAVIATICO, {
                as: "apertura_pasaje",
                foreignKey: { name: "fid_apertura_pasaje",  targetKey: "id" },
                constraints: false,
            });

            MEMORANDUM.belongsTo(USUARIO, {
                as: "usuario",
                foreignKey: { name: "fid_usuario", targetKey: "id" },
                constraints: false,
            });

            /*MEMORANDUM.belongsTo(VEHICULO, {
                as: "vehiculo",
                foreignKey: { name: "fid_vehiculo", targetKey: "id" },
                constraints: false,
            });
            MEMORANDUM.belongsTo(CARGO, {
                as: "cargo",
                foreignKey: { name: "fid_cargo", targetKey: "id" },
                constraints: false,
            });*/            

         };

        return MODEL;
    }
}
