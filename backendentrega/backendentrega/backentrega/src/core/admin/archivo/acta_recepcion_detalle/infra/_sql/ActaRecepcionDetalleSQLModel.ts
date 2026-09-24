export type ActaRecepcionDetalleSQLModelData = {    
    nrodoc            : string;
    tipo              : string;
    nrofolio          : string;
    gestion           : string;
    descripcion       : string;
    fid_acta_recepcion: string;
};

export class ActaRecepcionDetalleSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("acta_recepcion_detalle", {
            id              : { type: Sequelize.UUID, primaryKey: true },
            nrodoc          : { type: Sequelize.STRING() },
            tipo            : { type: Sequelize.STRING() },
            nrofolio        : { type: Sequelize.STRING() },
            gestion         : { type: Sequelize.STRING() },
            descripcion     : { type: Sequelize.TEXT() },            
        });

        MODEL.associate = (models: any) => {
            const ACTA_RECEPCION_DETALLE = models.acta_recepcion_detalle;            
            const ACTA_RECEPCION      = models.acta_recepcion;

            ACTA_RECEPCION_DETALLE.belongsTo(ACTA_RECEPCION, {
                as: "acta_recepcion",
                foreignKey: { name: "fid_acta_recepcion", targetKey: "id" },
                constraints: false,
            });
        };

        return MODEL;
    }
}
