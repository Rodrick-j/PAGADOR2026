import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { HistorialEntity } from "../../HistorialEntity";
import { IHistorialRepository } from "../IHistorialRepository";
import { Result } from "../../../../../../base/types/Result";
import { HistorialSQLModelData } from "./HistorialSQLModel";

export class HistorialRepositorySQL extends BaseSQLRepository<HistorialEntity, HistorialSQLModelData> implements IHistorialRepository {
    fromSQLModelData(data: HistorialSQLModelData, id: string): Result<HistorialEntity> {
        return HistorialEntity.create(
            {                
                fecha      : data.fecha,
                descripcion: data.descripcion,
                debe       : data.debe,
                haber      : data.haber,
                saldo      : data.saldo,
                estado     : data.estado,
                adjuntos   : data.adjuntos,
                deudasId   : data.deudas_id,
                cuentaId   : data.fid_cuenta,
            },
            id,
        );
    }
    toSQLModelData(entity: HistorialEntity): HistorialSQLModelData {
        return {
            fecha      : entity.props.fecha,
            descripcion: entity.props.descripcion,
            debe       : entity.props.debe,
            haber      : entity.props.haber,
            saldo      : entity.props.saldo,
            estado     : entity.props.estado,
            adjuntos   : entity.props.adjuntos,
            deudas_id  : entity.props.deudasId,
            fid_cuenta  : entity.props.cuentaId,
        };
    }
}
