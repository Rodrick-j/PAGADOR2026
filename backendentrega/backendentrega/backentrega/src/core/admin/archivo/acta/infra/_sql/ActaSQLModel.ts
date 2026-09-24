import { FileItem } from "../../../../../../base/types/FileItem";

export type ActaSQLModelData = {
    tipo               : string;
    fecha_devolucion   : Date | null;
    fecha_registro     : Date;
    dias               : number;
    descripcion        : string;
    cod_acta           : string;
    estado             : boolean;
    externo            : boolean;
    descripcion_externo: string;
    documentos_id      : string[];
    adjuntos           : FileItem[];
    fid_area           : string;
    fid_personal       : string;
};

export class ActaSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("acta", {
            id                 : { type: Sequelize.UUID, primaryKey: true },
            fecha_registro     : { type: Sequelize.DATE() },
            fecha_devolucion   : { type: Sequelize.DATE(), allowNull: true },
            dias               : { type: Sequelize.INTEGER() },
            tipo               : { type: Sequelize.STRING() },
            cod_acta           : { type: Sequelize.STRING() },
            descripcion        : { type: Sequelize.TEXT() },
            estado             : { type: Sequelize.BOOLEAN() },
            externo            : { type: Sequelize.BOOLEAN() },
            descripcion_externo: { type: Sequelize.TEXT() },
            documentos_id      : { type: Sequelize.JSON(), defaultValue: [] },
            adjuntos           : { type: Sequelize.JSON(), defaultValue: [] },
        });

        MODEL.associate = (models: any) => {
            const ACTA = models.acta;
            
            const AREA      = models.area;
            const PERSONAL  = models.personal;

            ACTA.belongsTo(PERSONAL, {
                as: "personal",
                foreignKey: { name: "fid_personal", targetKey: "id" },
                constraints: false,
            });

            ACTA.belongsTo(AREA, {
                as: "area",
                foreignKey: { name: "fid_area", targetKey: "id" },
                constraints: false,
            });
        };

        return MODEL;
    }
}
