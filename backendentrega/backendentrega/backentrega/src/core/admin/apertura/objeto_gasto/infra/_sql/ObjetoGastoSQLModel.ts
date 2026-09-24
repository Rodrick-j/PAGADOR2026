export type ObjetoGastoSQLModelData = {
       /*Tabla apertura viatico*/
    objeto                         : string;
    descripcion_objeto_gasto       : string; 
    observacion                    : string;    
    estado                         : boolean;
};

export class ObjetoGastoSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("objeto_gasto", {
            id                             : { type: Sequelize.UUID, primaryKey: true },
            objeto                         : { type: Sequelize.STRING() },
            descripcion_objeto_gasto       : { type: Sequelize.STRING() },           
            observacion                    : { type: Sequelize.STRING() },
            estado                         : { type: Sequelize.BOOLEAN() },
        });

        MODEL.associate = () => ({});
        return MODEL;
    }
}
