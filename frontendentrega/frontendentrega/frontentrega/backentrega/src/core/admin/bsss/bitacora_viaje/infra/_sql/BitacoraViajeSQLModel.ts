export type BitacoraViajeSQLModelData = {    
    semana: number;    
    fid_area : string;
    fid_vehiculo: string;
    fid_usuario : string;
};

export class BitacoraViajeSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("bitacora_viaje", {
            id       : { type: Sequelize.UUID, primaryKey: true },
            semana   : { type: Sequelize.INTEGER() },           
        });

         MODEL.associate = (models: any) => {
            const AREA                = models.area;
            const USUARIO             = models.usuario;
            const VEHICULO            = models.vehiculo;
            const BITACORA_VIAJE      = models.bitacora_viaje;
           
            BITACORA_VIAJE.belongsTo(AREA, {
                as: "area",
                foreignKey: { name: "fid_area",  targetKey: "id" },
                constraints: false,
            });

            BITACORA_VIAJE.belongsTo(VEHICULO, {
                as: "vehiculo",
                foreignKey: { name: "fid_vehiculo",  targetKey: "id" },
                constraints: false,
            });

            BITACORA_VIAJE.belongsTo(USUARIO, {
                as: "usuario",
                foreignKey: { name: "fid_usuario", targetKey: "id" },
                constraints: false,
            });                

         };

        return MODEL;
    }
}
