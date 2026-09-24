export type GeneralSQLModelData = {
    nombre     : string;
    tiempo     : string;
    tipo       : string;
    paso       : number;
    fid_usuario: string;
};

export class GeneralSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("general", {
            id    : { type: Sequelize.UUID, primaryKey: true },
            nombre: { type: Sequelize.STRING() },
            tiempo: { type: Sequelize.STRING() },
            tipo  : { type: Sequelize.STRING() },
            paso  : { type: Sequelize.INTEGER(), defaultValue: 0 },
        });

        MODEL.associate = (models: any) => {
            const USUARIO   = models.usuario;
            const GENERAL   = models.general;

            GENERAL.belongsTo(USUARIO, {
                as: "usuario",
                foreignKey: { name: "fid_usuario", targetKey: "id" },
                constraints: false,
            });
        };

        return MODEL;
    }
}
