export type DestinoSQLModelData = {
    nombre   : string;
    distancia: number;
    litros   : number;
    estado   : boolean;
};

export class DestinoSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("destino", {
            id       : { type: Sequelize.UUID, primaryKey: true },
            nombre   : { type: Sequelize.STRING() },
            distancia: { type: Sequelize.DOUBLE(), defaultValue: 0 },
            litros   : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            estado   : { type: Sequelize.BOOLEAN() },
        });

        MODEL.associate = () => ({});

        return MODEL;
    }
}
