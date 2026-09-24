import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { AsignacionEntity } from "../../AsignacionEntity";
import { IAsignacionRepository } from "../IAsignacionRepository";
import { Result } from "../../../../../../base/types/Result";
import { AsignacionSQLModelData } from "./AsignacionSQLModel";

export class AsignacionRepositorySQL extends BaseSQLRepository<AsignacionEntity, AsignacionSQLModelData> implements IAsignacionRepository {
    fromSQLModelData(data: AsignacionSQLModelData, id: string): Result<AsignacionEntity> {
        return AsignacionEntity.create(
            {
                estado          : data.estado,
                observacion     : data.observacion,
                saldo           : data.saldo,
                contrato        : data.contrato,
                partidaGeneralId: data.fid_apertura_general,
                usuarioId       : data.fid_usuario,
               
            },
            id,
        );
    }
    toSQLModelData(entity: AsignacionEntity): AsignacionSQLModelData {
        return {
            estado              : entity.props.estado,
            observacion         : entity.props.observacion || "",
            saldo               : entity.props.saldo,
            contrato            : entity.props.contrato,
            fid_apertura_general: entity.props.partidaGeneralId,
            fid_usuario         : entity.props.usuarioId,
        };
    }
}
