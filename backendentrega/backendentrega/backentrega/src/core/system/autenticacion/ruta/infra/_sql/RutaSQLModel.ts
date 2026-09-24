export type RutaSQLModelData = {
    name        : string;
    path        : string;
    title       : string;
    descripcion?: string;
    icon        : string;
    color       : string;
    is_client   : boolean | null;
};

export class RutaSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("ruta", {
            id         : { type: Sequelize.UUID, primaryKey: true },
            name       : { type: Sequelize.STRING() },
            path       : { type: Sequelize.STRING() },
            title      : { type: Sequelize.STRING() },
            descripcion: { type: Sequelize.TEXT(), allowNull: true },
            icon       : { type: Sequelize.STRING() },
            color      : { type: Sequelize.STRING() },
            is_client  : { type: Sequelize.BOOLEAN(), default: null, allowNull: true },
        });

        MODEL.associate = () => ({});

        return MODEL;
    }
}
