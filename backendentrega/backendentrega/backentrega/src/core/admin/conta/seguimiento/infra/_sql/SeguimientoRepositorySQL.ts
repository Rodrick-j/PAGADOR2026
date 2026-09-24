import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { SeguimientoEntity } from "../../SeguimientoEntity";
import { ISeguimientoRepository } from "../ISeguimientoRepository";
import { Result } from "../../../../../../base/types/Result";
import { SeguimientoSQLModelData } from "./SeguimientoSQLModel";

export class SeguimientoRepositorySQL extends BaseSQLRepository<SeguimientoEntity, SeguimientoSQLModelData> implements ISeguimientoRepository {
    fromSQLModelData(data: SeguimientoSQLModelData, id: string): Result<SeguimientoEntity> {
        return SeguimientoEntity.create(
            {                
                fecha      : data.fecha,
                descripcion: data.descripcion,
                observacion: data.observacion,
                dias       : data.dias,
                estado     : data.estado,
                enviado    : data.enviado,
                adjuntos   : data.adjuntos,
                cuentaId   : data.fid_cuenta,
            },
            id,
        );
    }
    toSQLModelData(entity: SeguimientoEntity): SeguimientoSQLModelData {
        return {
            fecha      : entity.props.fecha,
            descripcion: entity.props.descripcion,
            observacion: entity.props.observacion,
            dias       : entity.props.dias,
            estado     : entity.props.estado,
            enviado    : entity.props.enviado,
            adjuntos   : entity.props.adjuntos,
            fid_cuenta : entity.props.cuentaId,
        };
    }
}
