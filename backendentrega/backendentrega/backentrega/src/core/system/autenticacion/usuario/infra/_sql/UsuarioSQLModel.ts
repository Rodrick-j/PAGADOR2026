import { DeviceInfo } from "../../../../../../base/types/DeviceInfo";
import bcrypt from "bcryptjs";

export type UsuarioSQLModelData = {
    username         : string;
    password         : string;
    fullname         : string;
    nombre           : string;
    primer_apellido  : string;
    segundo_apellido : string;
    ci               : string;
    email            : string;
    direccion        : string;
    celular          : string;
    genero           : string;
    is_jefe         ?: boolean;
    activo           : boolean;
    estado           : string;
    avatar          ?: string;
    fid_role         : string;
    devices         ?: DeviceInfo[];
};

export class UsuarioSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("usuario", {
            id              : { type: Sequelize.UUID, primaryKey: true },
            username        : { type: Sequelize.STRING() },
            password        : { type: Sequelize.STRING() },
            fullname        : { type: Sequelize.STRING(), defaultValue: "" },
            nombre          : { type: Sequelize.STRING() },
            primer_apellido : { type: Sequelize.STRING() },
            segundo_apellido: { type: Sequelize.STRING() },
            ci              : { type: Sequelize.STRING() },
            email           : { type: Sequelize.STRING() },
            direccion       : { type: Sequelize.STRING() },
            celular         : { type: Sequelize.STRING() },
            genero          : { type: Sequelize.ENUM("MASCULINO", "FEMENINO", "NINGUNO") },
            is_jefe         : { type: Sequelize.BOOLEAN(), defaultValue: false },
            activo          : { type: Sequelize.BOOLEAN() },
            estado          : { type: Sequelize.ENUM("ACTIVO", "INACTIVO", "ELIMINADO") },
            avatar          : { type: Sequelize.STRING() },
            devices         : { type: Sequelize.JSON(), defaultValue: [] },
        });

        MODEL.associate = (models: any) => {
            const USUARIO = models.usuario;
            const ROLE = models.role;

            USUARIO.belongsTo(ROLE, {
                as: "role",
                foreignKey: { name: "fid_role", targetKey: "id" },
                constraints: false,
            });
        };

        MODEL.beforeCreate(async (usuario: any) => {
            if (usuario.password) {
                const salt = await bcrypt.genSalt(10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        });

        MODEL.beforeUpdate(async (usuario: any) => {
            if (usuario.changed("password")) {
                const salt = await bcrypt.genSalt(10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        });

        return MODEL;
    }
}
