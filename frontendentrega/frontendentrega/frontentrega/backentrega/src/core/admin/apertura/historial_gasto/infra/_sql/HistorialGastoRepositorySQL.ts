import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { HistorialGastoEntity } from "../../HistorialGastoEntity";
import { IHistorialGastoRepository } from "../IHistorialGastoRepository";
import { Result } from "../../../../../../base/types/Result";
import { HistorialGastoSQLModelData } from "./HistorialGastoSQLModel";

export class HistorialGastoRepositorySQL extends BaseSQLRepository<HistorialGastoEntity, HistorialGastoSQLModelData> implements IHistorialGastoRepository {
    fromSQLModelData(data: HistorialGastoSQLModelData, id: string): Result<HistorialGastoEntity> {
        return HistorialGastoEntity.create(
            {
                
                /*tabla apertura viatico*/
                fecha                : data.fecha,
                descripcion          : data.descripcion,
                debe                 : data.debe,
                haber                : data.haber,
                saldo                : data.saldo,
                estado               : data.estado,
                historialAperturaId  : data.fid_detalle_ap,
                aperturaId           : data.fid_ap_gen,               
            },
            id,
        );
    }
    toSQLModelData(entity: HistorialGastoEntity): HistorialGastoSQLModelData {
        return {
          
            /**Tabla original apertura viatico*/
            fecha                : entity.props.fecha,
            descripcion          : entity.props.descripcion,
            debe                 : entity.props.debe,
            haber                : entity.props.haber,
            saldo                : entity.props.saldo,
            estado               : entity.props.estado,
            fid_detalle_ap       : entity.props.historialAperturaId,
            fid_ap_gen           : entity.props.aperturaId,
        };
    }
}
