export type CitesSQLModelData = {
       /*Tabla apertura General*/
    fecha_registro           : Date;
    nombre_usuario          : string;   
    area_solicitante         : string;
    area_destino             : string;
    cite_completo            : string;
    referencia               : string;
    tipo_documento           : string;
    dias                     : number;
    gestion                  : string;    
    actividad                : string;            
    nombre_proceso           : string;
    cuce                     : string;
    empresa_adjudicada       : string;
    observacion              : string;
    hoja_ruta                : string;
    fecha_cierre             : Date;
    estado                   : string; 
    estado_activo            : boolean;
    numero_paginas?          : number;
    fid_usuario              : string;
    fid_tipo_cite            : string; 
   
};

export class CitesSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("cites", {
            id                             : { type: Sequelize.UUID, primaryKey: true },
            fecha_registro                 : { type: Sequelize.DATE()},  
            nombre_usuario                 : { type: Sequelize.STRING() },            
            area_solicitante               : { type: Sequelize.STRING() },
            area_destino                   : { type: Sequelize.STRING() },              
            cite_completo                  : { type: Sequelize.STRING() },
            referencia                     : { type: Sequelize.STRING() },
            tipo_documento                 : { type: Sequelize.STRING() },
            dias                           : { type: Sequelize.DOUBLE() },
            gestion                        : { type: Sequelize.STRING() },
            actividad                      : { type: Sequelize.STRING() },
            nombre_proceso                 : { type: Sequelize.STRING() },
            cuce                           : { type: Sequelize.STRING() },
            empresa_adjudicada             : { type: Sequelize.STRING() },
            observacion                    : { type: Sequelize.STRING() },
            hoja_ruta                      : { type: Sequelize.STRING() },
            fecha_cierre                   : { type: Sequelize.DATE()}, 
            estado                         : { type: Sequelize.STRING() },           
            estado_activo                  : { type: Sequelize.BOOLEAN() },           
            numero_paginas                 : { type: Sequelize.DOUBLE() },           
        });

        MODEL.associate = (models: any) => {
            const Cites   = models.cites;
            const USUARIO              = models.usuario;
            const TIPO_CITES            = models.tipo_cites;

            Cites.belongsTo(USUARIO, {
                as: "usuario",
                foreignKey: { name: "fid_usuario", targetKey: "id" },
                constraints: false,
            });

            Cites.belongsTo(TIPO_CITES, {
                as: "tipo_cites",
                foreignKey: { name: "fid_tipo_cite", targetKey: "id" },
                constraints: false,
            });         
        };

        return MODEL;
    }
}
