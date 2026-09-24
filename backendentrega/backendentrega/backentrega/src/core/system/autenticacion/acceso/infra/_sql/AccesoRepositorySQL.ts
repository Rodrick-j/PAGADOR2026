import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { AccesoEntity } from "../../AccesoEntity";
import { IAccesoRepository } from "../IAccesoRepository";
import { Result } from "../../../../../../base/types/Result";
import { AccesoSQLModelData } from "./AccesoSQLModel";

export class AccesoRepositorySQL
    extends BaseSQLRepository<AccesoEntity, AccesoSQLModelData>
    implements IAccesoRepository
{
    fromSQLModelData(data: AccesoSQLModelData, id: string): Result<AccesoEntity> {
        return AccesoEntity.create(
            {
                fecha: data.fecha,
                device: data.device,
                usuarioId: data.fid_usuario,
            },
            id,
        );
    }
    toSQLModelData(entity: AccesoEntity): AccesoSQLModelData {
        return {
            fecha: entity.props.fecha,
            device: entity.props.device,
            fid_usuario: entity.props.usuarioId,
        };
    }
}
