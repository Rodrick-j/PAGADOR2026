import { DeviceInfo } from "../../../../../../base/types/DeviceInfo";

export type AccesoSQLModelData = {
    fecha: Date;
    device: DeviceInfo;
    fid_usuario: string;
};

export class AccesoSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("acceso", {
            id: { type: Sequelize.UUID, primaryKey: true },
            fecha: { type: Sequelize.DATE() },
            device: { type: Sequelize.JSON() },
        });

        MODEL.associate = (models: any) => {
            const ACCESO = models.acceso;
            const USUARIO = models.usuario;

            ACCESO.belongsTo(USUARIO, {
                as: "usuario",
                foreignKey: { name: "fid_usuario", targetKey: "id" },
                constraints: false,
            });
        };

        return MODEL;
    }
}
