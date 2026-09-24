export type BitacoraDetalleSQLModelData = {
    fecha_salida      : Date;
    fecha_retorno     : Date;
    hora_salida       : string;
    hora_retorno      : string;
    destino_salida    : string;
    destino_llegada   : string;
    km_salida         : number;
    km_llegada        : number;
    km_estimados      : number;
    cantidad_personas : number;
    estado           : string;
    fid_bitacora_viaje: string;
};

export class BitacoraDetalleSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("bitacora_detalle", {
            id                   : { type: Sequelize.UUID, primaryKey: true },
            fecha_salida         : { type: Sequelize.DATE() },
            fecha_retorno        : { type: Sequelize.DATE() },
            hora_salida          : { type: Sequelize.STRING() },
            hora_retorno         : { type: Sequelize.STRING() },
            destino_salida       : { type: Sequelize.STRING() },
            destino_llegada      : { type: Sequelize.STRING() },
            km_salida            : { type: Sequelize.INTEGER() },
            km_llegada           : { type: Sequelize.INTEGER() },
            km_estimados         : { type: Sequelize.INTEGER() },
            cantidad_personas    : { type: Sequelize.INTEGER() },
            estado               : { type: Sequelize.STRING() },           
        });

        MODEL.associate = (models: any) => {
            const BITACORA_VIAJE      = models.bitacora_viaje;           
            const BITACORA_DETALLE    = models.bitacora_detalle;
          

            BITACORA_DETALLE.belongsTo(BITACORA_VIAJE, {
                as: "bitacora_viaje",
                foreignKey: { name: "fid_bitacora_viaje",  targetKey: "id" },
                constraints: false,
            });           
         };

        return MODEL;
    }
}
