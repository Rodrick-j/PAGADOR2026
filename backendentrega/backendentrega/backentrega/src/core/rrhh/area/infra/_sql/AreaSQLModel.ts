export type AreaSQLModelData = {
    sigla   : string;
    nombre  : string;
    indice   : string;
    padre   : boolean;
    activo  : boolean;
    fid_area: string | null;
};

export class AreaSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("area", {
            id    : { type: Sequelize.UUID, primaryKey: true },
            sigla : { type: Sequelize.STRING() },
            nombre: { type: Sequelize.STRING() },
            indice : { type: Sequelize.STRING() },
            padre : { type: Sequelize.BOOLEAN() },
            activo: { type: Sequelize.BOOLEAN() },            
        });

        MODEL.associate = (models: any) => {
            const AREA = models.area;
            const AREA2 = models.area;

            AREA.belongsTo(AREA2, {
                as: "area",
                foreignKey: { name: "fid_area", targetKey: "id", allowNull: true },
                constraints: false,
            });
        };

        return MODEL;
    }
}
