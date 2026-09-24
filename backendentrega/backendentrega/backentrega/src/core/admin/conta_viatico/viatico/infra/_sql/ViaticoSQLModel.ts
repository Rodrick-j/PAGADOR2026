export type ViaticoSQLModelData = {
    nume_recibo           : number;
    fecha_pago_viatico    : Date;
    suma_pasaje_ida       : number;
    suma_pasaje_retorno   : number;
    tipo_pasaje_gd        : string;
    total_pasajes         : number;
    total_viatico         : number;
    liquido_pagable       : number;
    estado_pago           : string;
    estado_recibo         : string;
    fecha_anulacion       : Date;
    notificacion_viatico  : string;
    fid_memorandum        : string | null;
    fid_escala            : string | null;
};

export class ViaticoSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("viatico", {
            id                    : { type: Sequelize.UUID, primaryKey: true },
            nume_recibo           : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            fecha_pago_viatico    : { type: Sequelize.DATE() },
            suma_pasaje_ida       : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            suma_pasaje_retorno   : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            tipo_pasaje_gd        : { type: Sequelize.STRING() },
            total_pasajes         : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            total_viatico         : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            liquido_pagable       : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            estado_pago           : { type: Sequelize.STRING() },
            estado_recibo         : { type: Sequelize.STRING() },
            fecha_anulacion       : { type: Sequelize.DATE() },
            notificacion_viatico  : { type: Sequelize.STRING() },

        });

        MODEL.associate = (models: any) => {
            const MEMORANDUM            = models.memorandum;
            const VIATICO               = models.viatico;
            const ESCALA_DESTINO        = models.escala_destino;
           

            VIATICO.belongsTo(MEMORANDUM, {
                as: "memorandum",
                foreignKey: { name: "fid_memorandum",  targetKey: "id" },
                constraints: false,
            });            
            VIATICO.belongsTo(ESCALA_DESTINO, {
                as: "escala_destino",
                foreignKey: { name: "fid_escala",  targetKey: "id" },
                constraints: false,
            });    
        };

        return MODEL;
    }
}
