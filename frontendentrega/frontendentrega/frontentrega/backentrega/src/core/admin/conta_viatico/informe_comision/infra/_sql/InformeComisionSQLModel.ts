import { FileItem } from "../../../../../../base/types/FileItem";

export type InformeComisionSQLModelData = {
    ida                   :boolean;
    retorno               :boolean;
    objeto_viaje          :string;
    desarrollo            :string;
    conclusion            :string;
    imagen_uno            :FileItem[];
    descripcion_uno       :string;
    imagen_dos            :FileItem[];
    descripcion_dos       :string;
    imagen_tres           :FileItem[];
    descripcion_tres      :string;
    fid_vehiculo          :string;
    fid_vehiculo_publico  :string;
    fid_memorandum        :string; 
};

export class InformeComisionSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("informe_comision", {
            id                    :{ type: Sequelize.UUID, primaryKey: true },
            ida                   :{ type: Sequelize.BOOLEAN() },
            retorno               :{ type: Sequelize.BOOLEAN() },
            objeto_viaje          :{ type: Sequelize.STRING() },
            desarrollo            :{ type: Sequelize.STRING() },
            conclusion            :{ type: Sequelize.STRING() },
            imagen_uno            :{ type: Sequelize.JSON(), defaultValue: [] },
            descripcion_uno       :{ type: Sequelize.STRING() },
            imagen_dos            :{ type: Sequelize.JSON(), defaultValue: [] },
            descripcion_dos       :{ type: Sequelize.STRING() },
            imagen_tres           :{ type: Sequelize.JSON(), defaultValue: [] },
            descripcion_tres      :{ type: Sequelize.STRING() },
            
        });

        MODEL.associate = (models: any) => {
            const VEHICULO          = models.vehiculo;
            const VEHICULOPUBLICO   = models.vehiculo_publico;
            const MEMORANDUM        = models.memorandum;
            const INFORMECOMISION   = models.informe_comision;

            INFORMECOMISION.belongsTo(VEHICULO, {
                as: "vehiculo",
                foreignKey: { name: "fid_vehiculo",  targetKey: "id" },
                constraints: false,
            });

            INFORMECOMISION.belongsTo(VEHICULOPUBLICO, {
                as: "vehiculo_publico",
                foreignKey: { name: "fid_vehiculo_publico", targetKey: "id" },
                constraints: false,
            });

            INFORMECOMISION.belongsTo(MEMORANDUM, {
                as: "memorandum",
                foreignKey: { name: "fid_memorandum", targetKey: "id" },
                constraints: false,
            });

        };

        return MODEL;
    }
}
