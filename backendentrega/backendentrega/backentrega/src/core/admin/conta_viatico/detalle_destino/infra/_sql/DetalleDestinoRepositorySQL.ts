import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { DetalleDestinoEntity } from "../../DetalleDestinoEntity";
import { IDetalleDestinoRepository } from "../IDetalleDestinoRepository";
import { Result } from "../../../../../../base/types/Result";
import { DetalleDestinoSQLModelData } from "./DetalleDestinoSQLModel";

export class DetalleDestinoRepositorySQL extends BaseSQLRepository<DetalleDestinoEntity, DetalleDestinoSQLModelData> implements IDetalleDestinoRepository {
    fromSQLModelData(data: DetalleDestinoSQLModelData, id: string): Result<DetalleDestinoEntity> {
        return DetalleDestinoEntity.create(
            {
                tipoVehiculoOP              : data.tipo_vehiculo_op,
                objetivoViaje               : data.objetivo_viaje,
                destinoReg                  : data.destino_reg,
                fechaDia                    : data.fecha_dia,
                horaInicio                  : data.hora_inicio,
                horaFin                     : data.hora_fin,
                pernocte                    : data.pernocte,
                pasajeIda                   : data.pasaje_ida,
                pasajeRetorno               : data.pasaje_retorno,
                totalPasajedia              : data.total_pasaje_dia,
                tipoVehiculoOPIda           : data.tipo_vehiculo_opvida,
                tipoVehiculoOPVuelta        : data.tipo_vehiculo_opvuelta,
                estado                      : data.estado,
                modificacion                : data.modificacion,
                observacion                 : data.observacion,
                estadoObservacion           : data.estado_observacion,
                memorandumId                : data.fid_memorandum,
                viaticoId                   : data.fid_viatico,
                vehiculoId                  : data.fid_vehiculo,
                destinoId                   : data.fid_destino,
                destinoId2                  : data.fid_destino2,                           
            },
            id,
        );
    }
    toSQLModelData(entity: DetalleDestinoEntity): DetalleDestinoSQLModelData {
        return {
                tipo_vehiculo_op         : entity.props.tipoVehiculoOP,
                objetivo_viaje           : entity.props.objetivoViaje,
                destino_reg              : entity.props.destinoReg,
                fecha_dia                : entity.props.fechaDia,
                hora_inicio              : entity.props.horaInicio,
                hora_fin                 : entity.props.horaFin,
                pernocte                 :entity.props.pernocte,
                pasaje_ida               : entity.props.pasajeIda,
                pasaje_retorno           : entity.props.pasajeRetorno,
                total_pasaje_dia         : entity.props.totalPasajedia,
                tipo_vehiculo_opvida     : entity.props.tipoVehiculoOPIda,
                tipo_vehiculo_opvuelta   : entity.props.tipoVehiculoOPVuelta,
                estado                   : entity.props.estado,
                modificacion             : entity.props.modificacion,
                observacion              : entity.props.observacion,
                estado_observacion       : entity.props.estadoObservacion,
                fid_memorandum           : entity.props.memorandumId,
                fid_viatico              : entity.props.viaticoId,
                fid_vehiculo             : entity.props.vehiculoId,
                fid_destino              : entity.props.destinoId,
                fid_destino2              : entity.props.destinoId2,
        };
    }
}
