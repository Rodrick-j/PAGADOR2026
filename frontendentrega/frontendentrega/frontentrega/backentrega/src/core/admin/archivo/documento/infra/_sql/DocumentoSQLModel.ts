import { DocumentoAdjunto } from "../../DocumentoEntity";

export type DocumentoSQLModelData = {
    nro        : number;
    tipo       : string;
    gestion    : string;
    fecha      : Date;
    descripcion: string;
    doc_adjunto: string;
    hojas_ruta : string;
    grupo_gasto: string;
    estado     : string;
    permiso    : string;
    ubicacion  : string;
    nrofolio   : string;
    monto      : number;
    adjuntos   : DocumentoAdjunto[];
};

export class DocumentoSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("documento", {
            id         : { type: Sequelize.UUID, primaryKey: true },
            nro        : { type: Sequelize.INTEGER() },
            tipo       : { type: Sequelize.STRING() },
            nrofolio   : { type: Sequelize.STRING(), allowNull: true },
            gestion    : { type: Sequelize.STRING() },
            fecha      : { type: Sequelize.DATE() },
            estado     : { type: Sequelize.STRING() },
            permiso    : { type: Sequelize.ENUM('NORMAL', 'EDITAR', 'ELIMINAR'), defaultValue: "NORMAL" },         
            descripcion: { type: Sequelize.TEXT(), allowNull: true },
            doc_adjunto: { type: Sequelize.TEXT(), allowNull: true },
            hojas_ruta : { type: Sequelize.TEXT(), allowNull: true },
            grupo_gasto: { type: Sequelize.TEXT(), allowNull: true },
            ubicacion  : { type: Sequelize.STRING(), allowNull: true },
            monto      : { type: Sequelize.DOUBLE(), defaultValue: 0 },   
            adjuntos   : { type: Sequelize.JSON(), defaultValue: [] },
        }, {
            indexes: [
                {
                    unique: true,
                    fields: ["nro", "tipo", "gestion"],
                    name: "documento_nro_tipo_gestion_unique",
                },
            ],
        });

        MODEL.associate = () => ({});

        return MODEL;
    }
}
