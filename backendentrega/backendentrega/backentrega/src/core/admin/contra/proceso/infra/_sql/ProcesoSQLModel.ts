export type ProcesoSQLModelData = {
    objeto_contratacion     : string;
    modalidad_descripcion   : string;
    modalidad_sigla         : string;
    codigo_interno_entidad  : string;
    cuce                    : string;
    hoja_ruta               : string;
    fecha_registro          : Date;
    gestion                 : string;
    estado                  : string;
    paso                    : string | null;
    fid_usuario             : string;
    fid_usuario_solicitante : string | null;
    fid_usuario_solicitante2: string | null;
    fid_usuario_solicitante3 : string | null;
    estado_activo           :string | null;
    fid_area                : string | null;
};

export class ProcesoSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("proceso", {
            id                    : { type: Sequelize.UUID, primaryKey: true },
            objeto_contratacion   : { type: Sequelize.TEXT() },
            modalidad_descripcion : { type: Sequelize.STRING() },
            modalidad_sigla       : { type: Sequelize.STRING() },
            codigo_interno_entidad: { type: Sequelize.STRING() },
            cuce                  : { type: Sequelize.STRING() },
            hoja_ruta             : { type: Sequelize.STRING() },
            fecha_registro        : { type: Sequelize.DATE() },
            gestion               : { type: Sequelize.STRING() },
            estado                : { type: Sequelize.ENUM("PENDIENTE", "ATENDIDO", "EN_PROCESO", "ATRASADO"), defaultValue: "PENDIENTE" },
            estado_activo         : { type: Sequelize.STRING()},
        });

        MODEL.associate = (models: any) => {
            const USUARIO   = models.usuario;
            const PROCESO   = models.proceso;
            const AREA      = models.area;

            PROCESO.belongsTo(USUARIO, {
                as: "usuario",
                foreignKey: { name: "fid_usuario",  targetKey: "id" },
                constraints: false,
            });

            PROCESO.belongsTo(USUARIO, {
                as: "usuario_solicitante",
                foreignKey: { name: "fid_usuario_solicitante", targetKey: "id" },
                constraints: false,
            });

            PROCESO.belongsTo(USUARIO, {
                as: "usuario_solicitante2",
                foreignKey: { name: "fid_usuario_solicitante2", targetKey: "id" },
                constraints: false,
            });
            PROCESO.belongsTo(USUARIO, {
                as: "usuario_solicitante3",
                foreignKey: { name: "fid_usuario_solicitante3", targetKey: "id" },
                constraints: false,
            });

            PROCESO.belongsTo(AREA, {
                as: "area",
                foreignKey: { name: "fid_area", targetKey: "id" },
                constraints: false,
            });
        };

        return MODEL;
    }
}
