export type MemorandumrrhhSQLModelData = {
    cod_depart_memo        : string;
    tipo_memorandum        : string;
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
    fid_usuario            : string | null;
    modificacion           : boolean; 
    obs_modificacion       : string | null;
    fecha_cambio           : string;
    estado_modificacion    : string;
};

export class MemorandumrrhhSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("memorandum_rrhh", {
            id                     : { type: Sequelize.UUID, primaryKey: true },
            cod_depart_memo        : { type: Sequelize.STRING() },
            tipo_memorandum        : { type: Sequelize.STRING() },
            autorizado_por         : { type: Sequelize.JSON(), defaultValue: [] },         
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
        });

        MODEL.associate = (models: any) => {
            const USUARIO             = models.usuario;            
            const MEMORANDUM          = models.memorandum_rrhh;
            
            MEMORANDUM.belongsTo(USUARIO, {
                as: "usuario",
                foreignKey: { name: "fid_usuario", targetKey: "id" },
                constraints: false,
            });             

         };

        return MODEL;
    }
}
