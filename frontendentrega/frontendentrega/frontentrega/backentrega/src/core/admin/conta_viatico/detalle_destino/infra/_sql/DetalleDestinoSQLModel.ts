export type DetalleDestinoSQLModelData = {
    
    tipo_vehiculo_op         : string;
    objetivo_viaje           : string;
    destino_reg              : string;
    fecha_dia                : Date;
    hora_inicio              : string;
    hora_fin                 : string;
    pernocte                 : string;
    pasaje_ida               : number;
    pasaje_retorno           : number;
    total_pasaje_dia         : number;
    tipo_vehiculo_opvida     : string;
    tipo_vehiculo_opvuelta   : string;
    estado                   : string;
    modificacion             : boolean;
    observacion              : string;
    estado_observacion       : string;
    fid_memorandum           : string;
    fid_viatico              : string;
    fid_vehiculo             : string;
    fid_destino              : string;
    fid_destino2              : string;
};

export class DetalleDestinoSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("detalle_destino", {
            id                       : { type: Sequelize.UUID, primaryKey: true },
            tipo_vehiculo_op         : { type: Sequelize.STRING() },
            objetivo_viaje           : { type: Sequelize.STRING() },
            destino_reg              : { type: Sequelize.STRING() },
            fecha_dia                : { type: Sequelize.DATE() },
            hora_inicio              : { type: Sequelize.STRING() },
            hora_fin                 : { type: Sequelize.STRING() },
            pernocte                 : { type: Sequelize.STRING()},
            pasaje_ida               : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            pasaje_retorno           : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            total_pasaje_dia         : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            tipo_vehiculo_opvida     : { type: Sequelize.STRING() },
            tipo_vehiculo_opvuelta   : { type: Sequelize.STRING() },
            estado                   : { type: Sequelize.STRING() },     
            modificacion             : { type: Sequelize.BOOLEAN() },
            observacion              : { type: Sequelize.STRING() },     
            estado_observacion       : { type: Sequelize.STRING() },     
        });

        MODEL.associate = (models: any) => {
            const MEMORANDUM      = models.memorandum;
            const VIATICO         = models.viatico;
            const VEHICULO        = models.vehiculo;
            const ESCALA_DESTINO  = models.escala_destino;           
            const DETALLEDESTINO  = models.detalle_destino;

            DETALLEDESTINO.belongsTo(MEMORANDUM, {
                as: "memorandum",
                foreignKey: { name: "fid_memorandum",  targetKey: "id" },
                constraints: false,
            });

            DETALLEDESTINO.belongsTo(VIATICO, {
                as: "viatico",
                foreignKey: { name: "fid_viatico", targetKey: "id" },
                constraints: false,
            });

            DETALLEDESTINO.belongsTo(VEHICULO, {
                as: "vehiculo",
                foreignKey: { name: "fid_vehiculo", targetKey: "id" },
                constraints: false,
            });

            DETALLEDESTINO.belongsTo(ESCALA_DESTINO, {
                as: "escala_destino",
                foreignKey: { name: "fid_destino", targetKey: "id" },
                constraints: false,
            });
            //REvisar este aspecto 
            DETALLEDESTINO.belongsTo(ESCALA_DESTINO, {
                as: "escala_destino2",
                foreignKey: { name: "fid_destino2", targetKey: "id" },
                constraints: false,
            });
        };

        return MODEL;
    }
}
