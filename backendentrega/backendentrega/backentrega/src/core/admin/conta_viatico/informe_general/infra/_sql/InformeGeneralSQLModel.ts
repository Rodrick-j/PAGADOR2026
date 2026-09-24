import { FileItem } from "../../../../../../base/types/FileItem";

export type InformeGeneralSQLModelData = {
    recibo_pago_viatico     : FileItem[];
    memorandum              : FileItem[];
    informe_comision        : FileItem[];
    facturas_viaje          : FileItem[];
    acta_visita_reunion     : FileItem[];
    reporte_fotografico     : FileItem[];
    certificado_asistencia  : FileItem[];
    boleta_deposito         : FileItem[];
    fid_descargo            : string | null;
};

export class InformeGeneralSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("informe_general", {
            id                      : { type: Sequelize.UUID, primaryKey: true },
            recibo_pago_viatico     : { type: Sequelize.JSON(), defaultValue: [] },
            memorandum              : { type: Sequelize.JSON(), defaultValue: [] },
            informe_comision        : { type: Sequelize.JSON(), defaultValue: [] },
            facturas_viaje          : { type: Sequelize.JSON(), defaultValue: [] },
            acta_visita_reunion     : { type: Sequelize.JSON(), defaultValue: [] },
            reporte_fotografico     : { type: Sequelize.JSON(), defaultValue: [] },
            certificado_asistencia  : { type: Sequelize.JSON(), defaultValue: [] },
            boleta_deposito         : { type: Sequelize.JSON(), defaultValue: [] },
			
        });

        MODEL.associate = (models: any) => {
            const DESCARGO         = models.descargo;
            const INFORMEGENERAL   = models.informe_general;
     

            INFORMEGENERAL.belongsTo(DESCARGO, {
                as: "descargo",
                foreignKey: { name: "fid_descargo",  targetKey: "id" },
                constraints: false,
            });            
        };

        return MODEL;
    }
}
