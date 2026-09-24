export type BitacoraSQLModelData = {
    fecha      : Date;
    ruta       : string;
    metodo     : string;
    ip         : string;
    modulo    ?: string | null;
    rol        : string;
    fid_usuario: string;
};

export class BitacoraSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("bitacora", {
            id    : { type: Sequelize.UUID, primaryKey: true },
            fecha : { type: Sequelize.DATE() },
            ruta  : { type: Sequelize.STRING() },
            metodo: { type: Sequelize.STRING(10) },
            ip    : { type: Sequelize.STRING() },
            rol   : { type: Sequelize.STRING() },
            modulo: { type: Sequelize.STRING() },
        });

        MODEL.associate = (models: any) => {
            const BITACORA = models.bitacora;
            const USUARIO  = models.usuario;

            BITACORA.belongsTo(USUARIO, {
                as        : "usuario",
                foreignKey: { name: "fid_usuario", targetKey: "id" },
                constraints: false,
            });
        };

        return MODEL;
    }
}
