export type VacacionSQLModelData = {
    fecha_registro: Date;
    tipo_vacacion : string;
    fecha_ini     : Date;
    fecha_fin     : Date;
    estado        : string;
    fid_usuario   : string;
    fid_jefe      : string;
    fid_area      : string;
};

export class VacacionSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("vacacion", {
            id             : { type: Sequelize.UUID, primaryKey: true },
            fecha_registro: { type: Sequelize.DATE() },
            fecha_ini     : { type: Sequelize.DATE(), default: null, allowNull: true },
            fecha_fin     : { type: Sequelize.DATE(), default: null, allowNull: true },
            tipo_vacacion  : { type: Sequelize.ENUM("COMPLETO", "MEDIO", "HORAS"), defaultValue: "COMPLETO" },
            estado        : { type: Sequelize.ENUM("PENDIENTE", "APROBADO_JEFE", "APROBADO_RRHH", "RECHAZADO"), defaultValue: "PENDIENTE" },
        });

        MODEL.associate = (models: any) => {
            const VACACION = models.vacacion;
            const AREA = models.area;
            const USUARIO = models.usuario;
            const USUARIO2 = models.usuario;

            VACACION.belongsTo(USUARIO, {
                as: "usuario",
                foreignKey: { name: "fid_usuario", targetKey: "id" },
                constraints: false,
            });

            VACACION.belongsTo(USUARIO2, {
                as: "usuario3",
                foreignKey: { name: "fid_jefe", targetKey: "id" },
                constraints: false,
            });

            VACACION.belongsTo(AREA, {
                as: "area",
                foreignKey: { name: "fid_area", targetKey: "id", allowNull: true },
                constraints: false,
            });
        };

        return MODEL;
    }
}
