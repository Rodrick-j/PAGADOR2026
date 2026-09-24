import { FileItem } from "../../../../../../base/types/FileItem";

export type SeguimientoSQLModelData = {
    fecha      : Date;
    dias       : number;
    descripcion: string;
    observacion: string;
    estado     : boolean;
    enviado?   : boolean;
    adjuntos   : FileItem[];
    fid_cuenta : string;
};

export class SeguimientoSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("seguimiento", {
            id         : { type: Sequelize.UUID, primaryKey: true },
            fecha      : { type: Sequelize.DATE() },
            descripcion: { type: Sequelize.TEXT() },
            observacion: { type: Sequelize.TEXT() },
            dias       : { type: Sequelize.INTEGER(), defaultValue: 0 },
            estado     : { type: Sequelize.BOOLEAN(), defaultValue: true },
            enviado    : { type: Sequelize.BOOLEAN(), defaultValue: false },
            adjuntos   : { type: Sequelize.JSON(), defaultValue: [] },
        });

        MODEL.associate = (models: any) => {
            const SEGUIMIENTO = models.seguimiento;
            const CUENTA = models.cuenta;

            SEGUIMIENTO.belongsTo(CUENTA, {
                as: "cuenta",
                foreignKey: { name: "fid_cuenta", targetKey: "id" },
                constraints: false,
            });
        };

        return MODEL;
    }
}
