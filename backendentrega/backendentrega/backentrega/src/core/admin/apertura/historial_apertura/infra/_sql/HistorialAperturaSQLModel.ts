export type HistorialAperturaSQLModelData = {
       /*Tabla apertura viatico*/
       titulo                        : string;
       descripcion                   : string;
       gasto                         : number; 
       debe_haber                    : string;            
       estado                        : string;
       fecha                         : Date;
       fid_ap_gen                    : string; 
};

export class HistorialAperturaSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("historial_detalle_ap", {
            id                             : { type: Sequelize.UUID, primaryKey: true },
            titulo                         : { type: Sequelize.STRING() },
            descripcion                    : { type: Sequelize.STRING() },
            gasto                          : { type: Sequelize.NUMBER() },   
            fecha                          : { type: Sequelize.DATE() },      //relacion con la tabla apertura general  
            estado                         : { type: Sequelize.STRING() },
            debe_haber                     : { type: Sequelize.STRING() },           
           
        });

        MODEL.associate = (models: any) => {
            const APERTURAGENERAL   = models.apertura_general;
            const HISTORIALAPERTURA = models.historial_detalle_ap;

            HISTORIALAPERTURA.belongsTo(APERTURAGENERAL, {
                as: "apertura_general",
                foreignKey: { name: "fid_ap_gen", targetKey: "id" },
                constraints: false,
            });
        };

        return MODEL;
    }
}
