export type VehiculoPublicoSQLModelData = {
    razon_social          : string;
    num_boleto            : number;
    placa                 : string;
    tipo_vehiculo         : string;
    precio_boleto         : number;
};

export class VehiculoPublicoSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("vehiculo_publico", {
            id                    : { type: Sequelize.UUID, primaryKey: true },
            razon_social          : { type: Sequelize.STRING() },
            num_boleto            : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            placa                 : { type: Sequelize.STRING() },
            tipo_vehiculo         : { type: Sequelize.STRING() },
            precio_boleto         : { type: Sequelize.DOUBLE(), defaultValue: 0 },

        });
       
        MODEL.associate = () => ({});

        return MODEL;
    }
}
