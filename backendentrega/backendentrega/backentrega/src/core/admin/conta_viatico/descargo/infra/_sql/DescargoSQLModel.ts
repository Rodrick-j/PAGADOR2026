export type DescargoSQLModelData ={
    fecha_descargo         : Date;
    estado_descargo        : string;
    viatico_pasaje_real    : number;
    monto_despositado      : number;
    monto_descargo         : number;
    saldo_descargo         : number;
    presenta_informe       : string;
    viatico_real           : number;
    observacion_estado     : string;
    observacion_descargo   : string;
    prorroga               : string;
    tiempo_descargo        : number;
    notificacion_descargo  : string;
    fid_viatico            : string;
};

export class DescargoSQLModel{
    static define(sequelize:any, Sequelize:any){
        const MODEL = sequelize.define("descargo", {
            id                     : {type:Sequelize.UUID, primaryKey:true},
            fecha_descargo         : Sequelize.DATE,
            estado_descargo        : Sequelize.STRING,
            viatico_pasaje_real    : Sequelize.FLOAT,
            monto_despositado      : Sequelize.FLOAT,
            monto_descargo         : Sequelize.FLOAT,
            saldo_descargo         : Sequelize.FLOAT,
            presenta_informe       : Sequelize.STRING,
            viatico_real           : Sequelize.FLOAT,
            observacion_estado     : Sequelize.STRING,
            observacion_descargo   : Sequelize.STRING,
            prorroga               : Sequelize.STRING,
            tiempo_descargo        : Sequelize.FLOAT,
            notificacion_descargo  : Sequelize.STRING,
            fid_viatico            : Sequelize.STRING,

        });

        MODEL.associate = (models: any) => {
            const VIATICO    = models.viatico;
            const DESCARGO   = models.descargo;

            DESCARGO.belongsTo(VIATICO, {
                as: "viatico",
                foreignKey: { name: "fid_viatico", targetKey: "id" },
                constraints: false,
            });
        };

        return MODEL;
    }
}