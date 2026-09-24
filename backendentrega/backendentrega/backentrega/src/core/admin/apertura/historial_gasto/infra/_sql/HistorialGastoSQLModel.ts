export type HistorialGastoSQLModelData = {
       /*Tabla apertura viatico*/
       fecha                : Date;
       descripcion          : string;
       debe                 : number;
       haber                : number;
       saldo                : number;
       estado               : string; 
       fid_ap_gen           : string;
       fid_detalle_ap       : string;     
};

export class HistorialGastoSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("historial_gasto_ap", {
            id                             : { type: Sequelize.UUID, primaryKey: true },
            fecha                          : { type: Sequelize.DATE() },
            descripcion                    : { type: Sequelize.STRING() },
            debe                           : { type: Sequelize.DOUBLE() },
            haber                          : { type: Sequelize.DOUBLE() },
            saldo                          : { type: Sequelize.DOUBLE() },         
            estado                         : { type: Sequelize.STRING() },           
        });

        MODEL.associate = (models: any) => {
            const HISTORIALGASTO   = models.historial_gasto_ap;
            const HISTORIALAPERTURA = models.historial_detalle_ap;
            const APERTURAGENERAL  = models.apertura_general;

            HISTORIALGASTO.belongsTo(HISTORIALAPERTURA, {
                as: "historial_detalle_ap",
                foreignKey: { name: "fid_detalle_ap", targetKey: "id" },
                constraints: false,
            });

            HISTORIALGASTO.belongsTo(APERTURAGENERAL, {
                as: "apertura_general",
                foreignKey: { name: "fid_ap_gen", targetKey: "id" },
                constraints: false,
            });
        };

        return MODEL;
    }
}
