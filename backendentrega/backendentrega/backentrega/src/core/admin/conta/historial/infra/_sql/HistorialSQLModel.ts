import { FileItem } from "../../../../../../base/types/FileItem";

export type HistorialSQLModelData = {
    fecha      : Date;
    descripcion: string;
    debe       : number;
    haber      : number;
    saldo      : number;
    estado     : boolean;
    adjuntos   : FileItem[];
    deudas_id  : string[];
    fid_cuenta : string;
};

export class HistorialSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("historial", {
            id         : { type: Sequelize.UUID, primaryKey: true },
            fecha      : { type: Sequelize.DATE() },
            descripcion: { type: Sequelize.TEXT() },
            debe       : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            haber      : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            saldo      : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            estado     : { type: Sequelize.BOOLEAN(), defaultValue: true },
            adjuntos   : { type: Sequelize.JSON(), defaultValue: [] },
            deudas_id  : { type: Sequelize.JSON(), defaultValue: [] },
        });

        MODEL.associate = (models: any) => {
            const HISTORIAL = models.historial;
            const CUENTA = models.cuenta;

            HISTORIAL.belongsTo(CUENTA, {
                as: "cuenta",
                foreignKey: { name: "fid_cuenta", targetKey: "id" },
                constraints: false,
            });
        };

        return MODEL;
    }
}
