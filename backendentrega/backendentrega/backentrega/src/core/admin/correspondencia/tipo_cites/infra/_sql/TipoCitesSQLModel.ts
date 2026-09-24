export type TipoCitesSQLModelData = {
       /*Tabla apertura General*/
    tipo_documento           : string;
    nombre_documento         : string;  
    sigla_documento          : string; 
    estado                   : string;    
   
};

export class TipoCitesSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("tipo_cites", {
            id                             : { type: Sequelize.UUID, primaryKey: true },
            tipo_documento                 : { type: Sequelize.STRING() },  
            nombre_documento               : { type: Sequelize.STRING() },
            sigla_documento                : { type: Sequelize.STRING() },
            estado                         : { type: Sequelize.STRING() },              
                    
        });

         MODEL.associate = () => ({});

        return MODEL;
    }
}
