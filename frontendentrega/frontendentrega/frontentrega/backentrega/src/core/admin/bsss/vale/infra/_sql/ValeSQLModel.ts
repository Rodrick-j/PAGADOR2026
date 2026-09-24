export type ValeSQLModelData = {
    cod_vale       : string;
    fecha_emision  : Date;
    fecha_validez  : Date;
    litros         : number;
    concepto       : string;
    distancia      : number;
    precio_unitario: number;
    precio_total   : number;
    observaciones  : string;
    destino        : string;
    destinos       : string;
    otro_vehiculo  : boolean;
    estado         : string;
    fid_usuario    : string | null;
    fid_vehiculo   : string | null;
    fid_asignacion : string | null;
    gestion?       : string | null;
    numero_recibo? : number;  

    litros_reales?: number;
    precio_real?  : number;
    numero_factura?: number;
    fecha_factura?: Date;
    estado_ejecutado?: string; 
    pre_asignacion?  : number; 
};

export class ValeSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("vale", {
            id             : { type: Sequelize.UUID, primaryKey: true },
            cod_vale       : { type: Sequelize.STRING() },
            fecha_emision  : { type: Sequelize.DATE() },
            fecha_validez  : { type: Sequelize.DATE() },
            litros         : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            concepto       : { type: Sequelize.STRING() },
            distancia      : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            precio_unitario: { type: Sequelize.DOUBLE(), defaultValue: 0 },
            precio_total   : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            observaciones  : { type: Sequelize.TEXT() },
            destino        : { type: Sequelize.STRING() },
            otro_vehiculo  : { type: Sequelize.BOOLEAN(), defaultValue: false },
            estado         : { type: Sequelize.ENUM('PENDIENTE', 'ANULADO', 'APROBADO', 'RECHAZADO'), defaultValue: "PENDIENTE" },
            destinos       : { type: Sequelize.TEXT() },
            gestion        : { type: Sequelize.STRING(), allowNull: true },
            numero_recibo  : { type: Sequelize.DOUBLE(), defaultValue: 0 },     
            litros_reales   : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            precio_real     : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            numero_factura  : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            fecha_factura   : { type: Sequelize.DATE() },
            estado_ejecutado: { type: Sequelize.STRING() },   
            pre_asignacion  : { type: Sequelize.DOUBLE(), defaultValue: 0 },
        });

        MODEL.associate = (models: any) => {
            const VALE       = models.vale;
            const USUARIO    = models.usuario;
            const VEHICULO   = models.vehiculo;
            const ASIGNACION = models.asignacion;

            VALE.belongsTo(USUARIO, {
                as: "usuario",
                foreignKey: { name: "fid_usuario", targetKey: "id" },
                constraints: false,
            });
            VALE.belongsTo(VEHICULO, {
                as: "vehiculo",
                foreignKey: { name: "fid_vehiculo", targetKey: "id" },
                constraints: false,
            });
            VALE.belongsTo(ASIGNACION, {
                as: "asignacion",
                foreignKey: { name: "fid_asignacion", targetKey: "id" },
                constraints: false,
            });
        };

        return MODEL;
    }
}
