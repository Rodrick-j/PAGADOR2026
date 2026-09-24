export type RoleSQLModelData = {
    nombre: string;
    tipo: string;
    permisos: string;
    modulos: string[];
};

export class RoleSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("role", {
            id: { type: Sequelize.UUID, primaryKey: true },
            nombre: { type: Sequelize.STRING() },
            tipo: { type: Sequelize.STRING() },
            permisos: { type: Sequelize.STRING() },
            modulos: { type: Sequelize.JSON(), defaultValue: [] },
        });

        MODEL.associate = () => ({});

        return MODEL;
    }
}
