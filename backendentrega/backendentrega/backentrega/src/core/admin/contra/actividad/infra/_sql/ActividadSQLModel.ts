export type ActividadSQLModelData = {
    titulo                   : string;
    descripcion              : string;
    paso                     : number;
    tiempo                   : string;
    notificacion             : boolean;
    notificacion_solicitante?: boolean;
    observacion              : string;
    observacion2?            : string;
    fecha                    : Date;
    fecha_limite             : Date;
    fecha_envio              : Date | null;
    estado                   : string;
    usuarios_id              : string[];
    fid_proceso              : string;
};

export class ActividadSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("actividad", {
            id                      : { type: Sequelize.UUID, primaryKey: true },
            titulo                  : { type: Sequelize.STRING() },
            descripcion             : { type: Sequelize.STRING() },
            paso                    : { type: Sequelize.INTEGER(), defaultValue: 0 },
            tiempo                  : { type: Sequelize.STRING() },
            notificacion            : { type: Sequelize.BOOLEAN() },
            notificacion_solicitante: { type: Sequelize.BOOLEAN(), defaultValue: false },
            observacion             : { type: Sequelize.TEXT() },
            observacion2             : { type: Sequelize.TEXT(), allowNull: true },
            fecha                   : { type: Sequelize.DATE() },
            fecha_limite            : { type: Sequelize.DATE() },
            fecha_envio             : { type: Sequelize.DATE(), allowNull: true },
            usuarios_id             : { type: Sequelize.JSON(), defaultValue: [] },
            estado                  : { type: Sequelize.ENUM("PENDIENTE", "ATENDIDO", "EN_PROCESO", "ATRASADO","SUSPENDIDO","ATENDIDO_CON_RETRASO"), defaultValue: "PENDIENTE" },
        });

        MODEL.associate = (models: any) => {
            const ACTIVIDAD = models.actividad;
            const PROCESO   = models.proceso;
            
            ACTIVIDAD.belongsTo(PROCESO, {
                as: "proceso",
                foreignKey: { name: "fid_proceso", targetKey: "id" },
                constraints: false,
            });
        };

        return MODEL;
    }
}
