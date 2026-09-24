import BaseSQLRepository from "../../../../../base/infra/_sql/BaseSQLRepository";
import { DetalleDestinorrhhEntity } from "../../DetalleDestinorrhhEntity";
import { IDetalleDestinorrhhRepository } from "../IDetalleDestinorrhhRepository";
import { Result } from "../../../../../base/types/Result";
import { DetalleDestinorrhhSQLModelData } from "./DetalleDestinorrhhSQLModel";

export class DetalleDestinorrhhRepositorySQL extends BaseSQLRepository<DetalleDestinorrhhEntity, DetalleDestinorrhhSQLModelData> implements IDetalleDestinorrhhRepository {
    fromSQLModelData(data: DetalleDestinorrhhSQLModelData, id: string): Result<DetalleDestinorrhhEntity> {
        return DetalleDestinorrhhEntity.create(
            {
                tipoVehiculoOP              : data.tipo_vehiculo_op,
                objetivoViaje               : data.objetivo_viaje,
                destinoReg                  : data.destino_reg,
                fechaDia                    : data.fecha_dia,
                horaInicio                  : data.hora_inicio,
                horaFin                     : data.hora_fin,
                pernocte                    : data.pernocte,
                estado                      : data.estado,
                modificacion                : data.modificacion,
                observacion                 : data.observacion,
                estadoObservacion           : data.estado_observacion,
                memorandumrrhhId            : data.fid_memorandum_rrhh,               
                vehiculoId                  : data.fid_vehiculo,
                destinoId                   : data.fid_destino,
                destinoId2                  : data.fid_destino2,                           
            },
            id,
        );
    }
    toSQLModelData(entity: DetalleDestinorrhhEntity): DetalleDestinorrhhSQLModelData {
        return {
                tipo_vehiculo_op         : entity.props.tipoVehiculoOP,
                objetivo_viaje           : entity.props.objetivoViaje,
                destino_reg              : entity.props.destinoReg,
                fecha_dia                : entity.props.fechaDia,
                hora_inicio              : entity.props.horaInicio,
                hora_fin                 : entity.props.horaFin,
                pernocte                 : entity.props.pernocte,                
                estado                   : entity.props.estado,
                modificacion             : entity.props.modificacion,
                observacion              : entity.props.observacion,
                estado_observacion       : entity.props.estadoObservacion,
                fid_memorandum_rrhh       : entity.props.memorandumrrhhId,               
                fid_vehiculo             : entity.props.vehiculoId,
                fid_destino              : entity.props.destinoId,
                fid_destino2              : entity.props.destinoId2,
        };
    }
}
