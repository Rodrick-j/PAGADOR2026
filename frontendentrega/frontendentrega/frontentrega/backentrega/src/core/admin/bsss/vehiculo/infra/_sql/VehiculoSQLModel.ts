export type VehiculoSQLModelData = {
    cod_activo  : string;
    num_placa   : string;
    tipo        : string;
    marca       : string;
    carga       : string;
    observacion : string;
    estado      : boolean;
    fid_personal: string;
    fid_area    : string;
};

export class VehiculoSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("vehiculo", {
            id         : { type: Sequelize.UUID, primaryKey: true },
            cod_activo : { type: Sequelize.STRING() },
            num_placa  : { type: Sequelize.STRING() },
            tipo       : { type: Sequelize.STRING() },
            marca      : { type: Sequelize.STRING() },
            carga      : { type: Sequelize.STRING() },
            observacion: { type: Sequelize.STRING() },
            estado     : { type: Sequelize.BOOLEAN() },
        });

        MODEL.associate = (models: any) => {
            const VEHICULO = models.vehiculo;
            const PERSONAL = models.personal;
            const AREA = models.area;

            VEHICULO.belongsTo(PERSONAL, {
                as: "personal",
                foreignKey: { name: "fid_personal", targetKey: "id" },
                constraints: false,
            });
            
            VEHICULO.belongsTo(AREA, {
                as: "area",
                foreignKey: { name: "fid_area", targetKey: "id" },
                constraints: false,
            });
        };

        return MODEL;
    }
}
