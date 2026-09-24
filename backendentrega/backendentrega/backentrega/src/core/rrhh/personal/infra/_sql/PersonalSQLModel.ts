export type PersonalSQLModelData = {
    nombres               : string;
    apellido_paterno      : string;
    apellido_materno      : string;
    apellido_casada       : string;
    ci                    : string;
    expedicion            : string;
    sexo                  : string;
    fecha_nacimiento      : Date;
    fecha_ingreso         : Date;
    estado_civil          : string;
    profesion             : string;
    telefono              : string;
    direccion             : string;
    activo                : boolean;
    afp                   : string;
    rentista              : boolean;
    fecha_presentacion_cas: Date | null;
    anhos_antiguedad_gador: number | null;
    anhos_antiguedad_cas  : number | null;
    meses_antiguedad_cas  : number | null;
    dias_antiguedad_cas   : number | null;
    fid_usuario           : string | null;
    fid_cargo             : string | null;
    fid_area              : string | null;
};

export class PersonalSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("personal", {
            id                    : { type: Sequelize.UUID, primaryKey: true },
            nombres               : { type: Sequelize.STRING() },
            apellido_paterno      : { type: Sequelize.STRING() },
            apellido_materno      : { type: Sequelize.STRING() },
            apellido_casada       : { type: Sequelize.STRING() },
            ci                    : { type: Sequelize.STRING() },
            expedicion            : { type: Sequelize.STRING() },
            sexo                  : { type: Sequelize.ENUM("MASCULINO", "FEMENINO") },
            fecha_nacimiento      : { type: Sequelize.DATE() },
            fecha_ingreso         : { type: Sequelize.DATE(), defaultValue: null, allowNull: true },
            estado_civil          : { type: Sequelize.ENUM("CASADO(A)", "SOLTERO(A)", "DIVORCIADO(A)", "VIUDO(A)") },
            profesion             : { type: Sequelize.STRING() },
            telefono              : { type: Sequelize.STRING() },
            direccion             : { type: Sequelize.STRING() },
            activo                : { type: Sequelize.BOOLEAN() },
            afp                   : { type: Sequelize.STRING() },
            rentista              : { type: Sequelize.BOOLEAN() },
            fecha_presentacion_cas: { type: Sequelize.DATE(), allowNull: true  },
            anhos_antiguedad_gador: { type: Sequelize.INTEGER(), allowNull: true  },
            anhos_antiguedad_cas  : { type: Sequelize.INTEGER(), allowNull: true  },
            meses_antiguedad_cas  : { type: Sequelize.INTEGER(), allowNull: true  },
            dias_antiguedad_cas   : { type: Sequelize.INTEGER(), allowNull: true  },
        });

        MODEL.associate = (models: any) => {
            const PERSONAL = models.personal;
            const USUARIO = models.usuario;
            const CARGO = models.cargo;
            const AREA = models.area;

            PERSONAL.belongsTo(USUARIO, {
                as: "usuario",
                foreignKey: { name: "fid_usuario", targetKey: "id", allowNull: true },
                constraints: false,
            });
            
            PERSONAL.belongsTo(CARGO, {
                as: "cargo",
                foreignKey: { name: "fid_cargo", targetKey: "id", allowNull: true },
                constraints: false,
            });

            PERSONAL.belongsTo(AREA, {
                as: "area",
                foreignKey: { name: "fid_area", targetKey: "id", allowNull: true },
                constraints: false,
            });
        };

        return MODEL;
    }
}
