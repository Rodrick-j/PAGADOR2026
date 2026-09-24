export type AsignacionSQLModelData = {
    observacion         : string;
    estado              : boolean;
    saldo               : number;
    fid_apertura_general: string | null;
    fid_usuario         : string | null;
    contrato            : string;
};

export class AsignacionSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("asignacion", {
            id          : { type: Sequelize.UUID, primaryKey: true },
            observacion : { type: Sequelize.TEXT(), allowNull: true },
            saldo       : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            estado      : { type: Sequelize.BOOLEAN(), defaultValue: true },
            contrato    : { type: Sequelize.TEXT() },
        });

        MODEL.associate = (models: any) => {
            const ASIGNACION = models.asignacion;
            const APERTURA_GENERAL   = models.apertura_general;
            const USUARIO    = models.usuario;

            ASIGNACION.belongsTo(APERTURA_GENERAL, {
                as: "apertura_general",
                foreignKey: { name: "fid_apertura_general", targetKey: "id" },
                constraints: false,
            });
            ASIGNACION.belongsTo(USUARIO, {
                as: "usuario",
                foreignKey: { name: "fid_usuario", targetKey: "id" },
                constraints: false,
            });
        };

        return MODEL;
    }
}
