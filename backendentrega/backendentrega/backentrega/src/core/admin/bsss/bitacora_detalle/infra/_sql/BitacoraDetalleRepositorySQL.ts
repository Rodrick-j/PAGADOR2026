import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { BitacoraDetalleEntity } from "../../BitacoraDetalleEntity";
import { IBitacoraDetalleRepository } from "../IBitacoraDetalleRepository";
import { Result } from "../../../../../../base/types/Result";
import { BitacoraDetalleSQLModelData } from "./BitacoraDetalleSQLModel";

export class BitacoraDetalleRepositorySQL extends BaseSQLRepository<BitacoraDetalleEntity, BitacoraDetalleSQLModelData> implements IBitacoraDetalleRepository {
    fromSQLModelData(data: BitacoraDetalleSQLModelData, id: string): Result<BitacoraDetalleEntity> {
        return BitacoraDetalleEntity.create(
            {
                fechaSalida      : data.fecha_salida,
                fechaRetorno     : data.fecha_retorno,
                horaSalida       : data.hora_salida,
                horaRetorno      : data.hora_retorno,
                destinoSalida    : data.destino_salida,
                destinoLlegada   : data.destino_llegada,
                kmSalida         : data.km_salida,
                kmLlegada        : data.km_llegada,
                kmEstimados      : data.km_estimados,
                cantidadPersonas : data.cantidad_personas,
                estado           : data.estado,
                bitacoraViajeId  : data.fid_bitacora_viaje,
            },
            id,
        );
    }
    toSQLModelData(entity: BitacoraDetalleEntity): BitacoraDetalleSQLModelData {
        return {                                             
            fecha_salida       : entity.props.fechaSalida,  
            fecha_retorno      : entity.props.fechaRetorno,  
            hora_salida        : entity.props.horaSalida,  
            hora_retorno       : entity.props.horaRetorno,  
            destino_salida     : entity.props.destinoSalida,  
            destino_llegada    : entity.props.destinoLlegada,  
            km_salida          : entity.props.kmSalida,  
            km_llegada         : entity.props.kmLlegada,  
            km_estimados       : entity.props.kmEstimados,  
            cantidad_personas  : entity.props.cantidadPersonas,  
            estado             : entity.props.estado,  
            fid_bitacora_viaje : entity.props.bitacoraViajeId,
        };
    }
}
