import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { DescargoEntity } from "../../DescargoEntity";
import { IDescargoRepository } from "../IDescargoRepository";
import { Result } from "../../../../../../base/types/Result";
import { DescargoSQLModelData } from "./DescargoSQLModel";

export class DescargoRepositorySQL extends BaseSQLRepository<DescargoEntity, DescargoSQLModelData> implements IDescargoRepository {
    fromSQLModelData(data: DescargoSQLModelData, id: string): Result<DescargoEntity> {
        return DescargoEntity.create(
            {
                fechaDescargo         : data.fecha_descargo,
                estadoDescargo        : data.estado_descargo,
                viaticoPasajeReal     : data.viatico_pasaje_real,
                montoDespositado      : data.monto_despositado,
                montoDescargo         : data.monto_descargo,
                saldoDescargo         : data.saldo_descargo,
                presentaInforme       : data.presenta_informe,
                viaticoReal           : data.viatico_real,
                observacionEstado     : data.observacion_estado,
                observacionDescargo   : data.observacion_descargo,           
                prorroga              : data.prorroga,
                tiempoDescargo        : data.tiempo_descargo,
                notificacionDescargo  : data.notificacion_descargo,
                viaticoId             : data.fid_viatico,    
                
            },
            id,
        );
    }
    toSQLModelData(entity: DescargoEntity): DescargoSQLModelData {
        return {
            
            fecha_descargo         : entity.props.fechaDescargo,
            estado_descargo        : entity.props.estadoDescargo,
            viatico_pasaje_real    : entity.props.viaticoPasajeReal,
            monto_despositado      : entity.props.montoDespositado,
            monto_descargo         : entity.props.montoDescargo,
            saldo_descargo         : entity.props.saldoDescargo,
            presenta_informe       : entity.props.presentaInforme,
            viatico_real           : entity.props.viaticoReal,
            observacion_estado     : entity.props.observacionEstado,
            observacion_descargo   : entity.props.observacionDescargo,                        
            prorroga               : entity.props.prorroga,
            tiempo_descargo        : entity.props.tiempoDescargo,
            notificacion_descargo  : entity.props.notificacionDescargo,
            fid_viatico            : entity.props.viaticoId,         
            
        };
    }
}
