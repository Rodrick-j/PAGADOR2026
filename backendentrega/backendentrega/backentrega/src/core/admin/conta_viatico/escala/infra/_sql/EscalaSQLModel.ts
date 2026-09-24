export type EscalaSQLModelData = {
    categoria             : string;
    tipo_comision_idp     : string;
    escala                : string;    
    viatico_por_dia       : number;
    moneda               : string;
    bolivianos            : number;
    fid_cargo             : string;
    
}

export class EscalaSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("escala", {
            id                    : { type: Sequelize.UUID, primaryKey: true },
            categoria             : { type: Sequelize.STRING() },
            tipo_comision_idp     : { type: Sequelize.STRING() },
            escala                : { type: Sequelize.STRING() },
            viatico_por_dia       : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            moneda                : { type: Sequelize.STRING() },
            bolivianos            : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            
        });

        MODEL.associate = (models: any) => {
            const ESCALA = models.escala;
            const CARGO  = models.cargo;
           
            ESCALA.belongsTo(CARGO, {
                as: "cargo",
                foreignKey: { name: "fid_cargo", targetKey: "id" },
                constraints: false,
            });  
        };
        
        return MODEL;
    }
}