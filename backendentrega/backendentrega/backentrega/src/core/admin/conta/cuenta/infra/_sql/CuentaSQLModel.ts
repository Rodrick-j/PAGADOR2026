import { FileItem } from "../../../../../../base/types/FileItem";

export type CuentaSQLModelData = {
    tipo_cuenta             : string;
    nombre_deudor           : string;
    ci                      : string;
    gestion_generacion_deuda: string;
    documentacion_respaldo  : string;
    direccion_domicilio     : string;
    telefono_celular        : string;
    confirmacion            : string;
    descripcion_confirmacion: string;
    motivo_deuda            : string[];
    incremento_deuda        : string;
    monto_incremento_deuda  : number;
    depositos_realizados    : string;
    observacion             : string;
    saldo                   : number | string;
    adjuntos                : FileItem[];
    estado                  : boolean;
    descripcion_deuda       : string;
    estado_proceso          : string;
    detalle_gestion_deuda    : string;
};

export class CuentaSQLModel {
    static define(sequelize: any, Sequelize: any) {
        const MODEL = sequelize.define("cuenta", {
            id                      : { type: Sequelize.UUID, primaryKey: true },
            tipo_cuenta             : { type: Sequelize.STRING() },
            nombre_deudor           : { type: Sequelize.STRING() },
            ci                      : { type: Sequelize.STRING() },
            gestion_generacion_deuda: { type: Sequelize.STRING() },
            documentacion_respaldo  : { type: Sequelize.STRING() },
            direccion_domicilio     : { type: Sequelize.STRING() },
            telefono_celular        : { type: Sequelize.STRING() },
            motivo_deuda            : { type: Sequelize.JSON(), defaultValue: [] },
            confirmacion            : { type: Sequelize.ENUM("SI", "NO", "OTRO") },
            descripcion_confirmacion: { type: Sequelize.TEXT() },
            incremento_deuda        : { type: Sequelize.TEXT() },
            monto_incremento_deuda  : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            depositos_realizados    : { type: Sequelize.TEXT() },
            observacion             : { type: Sequelize.TEXT() },
            saldo                   : { type: Sequelize.DOUBLE(), defaultValue: 0 },
            estado                  : { type: Sequelize.BOOLEAN() },
            adjuntos                : { type: Sequelize.JSON(), defaultValue: [] },
            descripcion_deuda       : { type: Sequelize.STRING() },
            estado_proceso          : { type: Sequelize.STRING() },
            detalle_gestion_deuda    : { type: Sequelize.STRING() },
        });

        MODEL.associate = () => ({});

        return MODEL;
    }
}
