export type ActaRecepcionSQLModelData = {
    fecha_registro: Date;
    cod_acta      : string;
    observacion   : string;
    estado        : boolean;
    documentos_id : string[];
    fid_area      : string;
    fid_personal  : string;
    sellado       : boolean;
};

export class ActaRecepcionSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("acta_recepcion", {
            id              : { type: Sequelize.UUID, primaryKey: true },
            fecha_registro  : { type: Sequelize.DATE() },
            cod_acta        : { type: Sequelize.STRING() },
            observacion     : { type: Sequelize.TEXT() },
            estado          : { type: Sequelize.BOOLEAN() },
            documentos_id   : { type: Sequelize.JSON(), defaultValue: [] },
            sellado         : { type: Sequelize.BOOLEAN(), defaultValue: false },
        });

        MODEL.associate = (models: any) => {
            const ACTA = models.acta_recepcion;
            
            const AREA      = models.area;
            const PERSONAL  = models.personal;

            ACTA.belongsTo(PERSONAL, {
                as: "personal",
                foreignKey: { name: "fid_personal", targetKey: "id" },
                constraints: false,
            });

            ACTA.belongsTo(AREA, {
                as: "area",
                foreignKey: { name: "fid_area", targetKey: "id" },
                constraints: false,
            });
        };

        return MODEL;
    }
}
