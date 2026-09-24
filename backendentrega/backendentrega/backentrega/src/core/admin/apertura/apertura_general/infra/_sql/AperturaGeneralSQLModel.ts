export type AperturaGeneralSQLModelData = {
       /*Tabla apertura General*/
    apertura_programatica          : string;
    ue                             : number;
    cod_fte                        : number;
    cod_org                        : number; 
    presupuesto_inicial            : number;
    presupuesto_restante           : number;
    mod_aprobada                   : number;
    presupuesto_vigente            : number;
    pagado                         : number;
    saldo_ejecutar                 : number;
    estado                         : string;
    estado_activo                  : boolean;
    sisin                          : string;
    gestion                        : Date;
    tipo_area                      : string;
    fid_area_hijo                    : string;
    fid_objeto                     : string;
    fid_area                       : string;  
   
    
};

export class AperturaGeneralSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("apertura_general", {
            id                             : { type: Sequelize.UUID, primaryKey: true },
            ue                             : { type: Sequelize.DOUBLE()},  
            apertura_programatica          : { type: Sequelize.STRING() },
            cod_fte                        : { type: Sequelize.DOUBLE() },
            cod_org                        : { type: Sequelize.DOUBLE() },              
            presupuesto_inicial            : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            presupuesto_restante           : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            mod_aprobada                   : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            presupuesto_vigente            : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            pagado                         : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            saldo_ejecutar                 : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            estado                         : { type: Sequelize.STRING() },
            estado_activo                  : { type: Sequelize.BOOLEAN() },
            sisin                          : { type: Sequelize.STRING() },
            gestion                        : { type: Sequelize.DATE() },
            tipo_area                      : { type: Sequelize.STRING() },           
        });

        MODEL.associate = (models: any) => {
            const APERTURAGENERAL   = models.apertura_general;
            const AREA              = models.area;
            const OBJETO            = models.objeto_gasto;

            APERTURAGENERAL.belongsTo(AREA, {
                as: "area",
                foreignKey: { name: "fid_area", targetKey: "id" },
                constraints: false,
            });

            APERTURAGENERAL.belongsTo(OBJETO, {
                as: "objeto_gasto",
                foreignKey: { name: "fid_objeto", targetKey: "id" },
                constraints: false,
            });

            APERTURAGENERAL.belongsTo(AREA, {
                as: "area_hijo",
                foreignKey: { name: "fid_area_hijo", targetKey: "id" },
                constraints: false,
            });
        };

        return MODEL;
    }
}
