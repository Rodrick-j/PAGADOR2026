export type EscalaDestinoSQLModelData = {
    tipo_pcp              : string; 
    escala_exterior      : string;  
    destino               : string;
    provincia             : string;
    modalidad             : string;
    pasaje_minimo         : number;
    pasaje_maximo         : number;

    
}

export class EscalaDestinoSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("escala_destino", {
            id                    : { type: Sequelize.UUID, primaryKey: true },
            tipo_pcp              : { type: Sequelize.STRING() },
            escala_exterior       : { type: Sequelize.STRING() },
            destino               : { type: Sequelize.STRING(), defaultValue: 0 },
            provincia             : { type: Sequelize.STRING(), defaultValue: 0 },
            modalidad             : { type: Sequelize.STRING(), defaultValue: 0 },
            pasaje_minimo         : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            pasaje_maximo         : { type: Sequelize.DOUBLE(), defaultValue: 0 },          
            
        });

        MODEL.associate = () => ({});
        
        return MODEL;
    }
}