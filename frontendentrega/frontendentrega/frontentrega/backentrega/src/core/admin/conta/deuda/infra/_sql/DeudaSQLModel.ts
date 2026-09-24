export type DeudaSQLModelData = {
    titulo     : string;
    descripcion: string;
    cod_activo : string;
    estado     : boolean;
    gestion_deuda :string;
    monto_deuda   :number;
    fid_cuenta    : string;
};

export class DeudaSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("deuda", {
            id         : { type: Sequelize.UUID, primaryKey: true },
            titulo     : { type: Sequelize.STRING() },            
            cod_activo : { type: Sequelize.STRING() },            
            descripcion: { type: Sequelize.TEXT() },
            estado     : { type: Sequelize.BOOLEAN() },
            gestion_deuda : { type: Sequelize.STRING() },
            monto_deuda   : { type: Sequelize.FLOAT() },           
            
        });

        MODEL.associate = (models: any) => {
            const DEUDA = models.deuda;
            const CUENTA = models.cuenta;

            DEUDA.belongsTo(CUENTA, {
                as: "cuenta",
                foreignKey: { name: "fid_cuenta", targetKey: "id" },
                constraints: false,
            });
        };

        return MODEL;
    }
}
