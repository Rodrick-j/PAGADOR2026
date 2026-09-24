export type CargoSQLModelData = {
    nombre          : string;
    item            : string;
    gestion_creacion: string;
    tipo            : string;
    salario         : number;
    privilegio      : boolean;
    libre           : boolean;
    nivel           : number;
    activo          : boolean;
};

export class CargoSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("cargo", {
            id              : { type: Sequelize.UUID, primaryKey: true },
            nombre          : { type: Sequelize.STRING() },
            item            : { type: Sequelize.STRING() },
            gestion_creacion: { type: Sequelize.STRING() },
            tipo            : { type: Sequelize.STRING() },
            salario         : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            libre           : { type: Sequelize.BOOLEAN() },
            privilegio      : { type: Sequelize.BOOLEAN() },
            nivel           : { type: Sequelize.INTEGER(), defaultValue: 0 },
            activo          : { type: Sequelize.BOOLEAN() },
        });

        MODEL.associate = () => ({});

        return MODEL;
    }
}
