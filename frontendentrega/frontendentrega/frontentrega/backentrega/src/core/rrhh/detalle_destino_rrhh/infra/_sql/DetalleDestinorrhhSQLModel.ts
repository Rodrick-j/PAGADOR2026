export type DetalleDestinorrhhSQLModelData = {
    
    tipo_vehiculo_op         : string;
    objetivo_viaje           : string;
    destino_reg              : string;
    fecha_dia                : Date;
    hora_inicio              : string;
    hora_fin                 : string;
    pernocte                 : string;    
    estado                   : string;
    modificacion             : boolean;
    observacion              : string;
    estado_observacion       : string;
    fid_memorandum_rrhh       : string;    
    fid_vehiculo             : string;
    fid_destino              : string;
    fid_destino2              : string;
};

export class DetalleDestinorrhhSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("detalle_destino_rrhh", {
            id                       : { type: Sequelize.UUID, primaryKey: true },
            tipo_vehiculo_op         : { type: Sequelize.STRING() },
            objetivo_viaje           : { type: Sequelize.STRING() },
            destino_reg              : { type: Sequelize.STRING() },
            fecha_dia                : { type: Sequelize.DATE() },
            hora_inicio              : { type: Sequelize.STRING() },
            hora_fin                 : { type: Sequelize.STRING() },
            pernocte                 : { type: Sequelize.STRING()},           
            estado                   : { type: Sequelize.STRING() },     
            modificacion             : { type: Sequelize.BOOLEAN() },
            observacion              : { type: Sequelize.STRING() },     
            estado_observacion       : { type: Sequelize.STRING() },     
        });

        MODEL.associate = (models: any) => {
            const MEMORANDUM_RRHH      = models.memorandum_rrhh;          
            const VEHICULO        = models.vehiculo;
            const ESCALA_DESTINO  = models.escala_destino;           
            const DETALLEDESTINO  = models.detalle_destino_rrhh;

            DETALLEDESTINO.belongsTo(MEMORANDUM_RRHH, {
                as: "memorandum_rrhh",
                foreignKey: { name: "fid_memorandum_rrhh",  targetKey: "id" },
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
