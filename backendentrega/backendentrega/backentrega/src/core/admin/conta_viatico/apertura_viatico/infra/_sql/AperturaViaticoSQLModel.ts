export type AperturaViaticoSQLModelData = {
       /*Tabla apertura viatico*/
    apertura_programatica          : string;
    cod_fte                        : string;
    cod_org                        : string;
    objeto                         : string;
    descripcion_objeto_gasto       : string;  
    presupuesto_inicial            : number;
    presupuesto_restante           : number;
    estado                         : string;
    sisin                          : string;
    gestion                        : Date;
    fid_area                       : string;
    fid_apertura_general           : string;
    estado_activo                  : boolean;
};

export class AperturaViaticoSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("apertura_viatico", {
            id                             : { type: Sequelize.UUID, primaryKey: true },
            apertura_programatica          : { type: Sequelize.STRING() },
            cod_fte                        : { type: Sequelize.STRING() },
            cod_org                        : { type: Sequelize.STRING() },
            objeto                         : { type: Sequelize.STRING() },
            descripcion_objeto_gasto       : { type: Sequelize.STRING() },         
            presupuesto_inicial            : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            presupuesto_restante           : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            estado                         : { type: Sequelize.STRING() },
            sisin                          : { type: Sequelize.STRING() },
            gestion                        : { type: Sequelize.DATE() },
            estado_activo                  : { type: Sequelize.BOOLEAN() },
        });

        MODEL.associate = (models: any) => {
            const APERTURAVIATICO   = models.apertura_viatico;
            const APERTURAGENERAL   = models.apertura_general;
            const AREA              = models.area;

            APERTURAVIATICO.belongsTo(AREA, {
                as: "area",
                foreignKey: { name: "fid_area", targetKey: "id" },
                constraints: false,
            });
            APERTURAVIATICO.belongsTo(APERTURAGENERAL, {
                as: "apertura_general",
                foreignKey: { name: "fid_apertura_general", targetKey: "id" },
                constraints: false,
            });
        };

        return MODEL;
    }
}
