import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { ViaticoEntity } from "../../ViaticoEntity";
import { IViaticoRepository } from "../IViaticoRepository";
import { Result } from "../../../../../../base/types/Result";
import { ViaticoSQLModelData } from "./ViaticoSQLModel";

export class ViaticoRepositorySQL extends BaseSQLRepository<ViaticoEntity, ViaticoSQLModelData> implements IViaticoRepository {
    fromSQLModelData(data: ViaticoSQLModelData, id: string): Result<ViaticoEntity> {
        return ViaticoEntity.create(
            {
                numeRecibo           : data.nume_recibo,
                fechaPagoViatico     : data.fecha_pago_viatico,
                sumaPasajeIda        : data.suma_pasaje_ida,
                sumaPasajeRetorno    : data.suma_pasaje_retorno,
                tipoPasajeGD         : data.tipo_pasaje_gd,
                totalPasajes         : data.total_pasajes,
                totalViatico         : data.total_viatico,
                liquidoPagable       : data.liquido_pagable,
                estadoPago           : data.estado_pago,
                estadoRecibo         : data.estado_recibo,
                fechaAnulacion       : data.fecha_anulacion,
                notificacionViatico  : data.notificacion_viatico,
                memorandumId         : data.fid_memorandum,
                escalaId             : data.fid_escala,
            },
            id,
        );
    }
    toSQLModelData(entity: ViaticoEntity): ViaticoSQLModelData {
        return {
            nume_recibo           : entity.props.numeRecibo,
            fecha_pago_viatico    : entity.props.fechaPagoViatico,
            suma_pasaje_ida       : entity.props.sumaPasajeIda,
            suma_pasaje_retorno   : entity.props.sumaPasajeRetorno,
            tipo_pasaje_gd        : entity.props.tipoPasajeGD,
            total_pasajes         : entity.props.totalPasajes,
            total_viatico         : entity.props.totalViatico,
            liquido_pagable       : entity.props.liquidoPagable,
            estado_pago           : entity.props.estadoPago,
            estado_recibo         : entity.props.estadoRecibo,
            fecha_anulacion       : entity.props.fechaAnulacion,
            notificacion_viatico  : entity.props.notificacionViatico,
            fid_memorandum        : entity.props.memorandumId,
            fid_escala            : entity.props.escalaId,
        };
    }
}
