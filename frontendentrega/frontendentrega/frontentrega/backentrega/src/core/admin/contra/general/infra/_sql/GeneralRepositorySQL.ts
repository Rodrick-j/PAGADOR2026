import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { GeneralEntity } from "../../GeneralEntity";
import { IGeneralRepository } from "../IGeneralRepository";
import { Result } from "../../../../../../base/types/Result";
import { GeneralSQLModelData } from "./GeneralSQLModel";

export class GeneralRepositorySQL extends BaseSQLRepository<GeneralEntity, GeneralSQLModelData> implements IGeneralRepository {
    fromSQLModelData(data: GeneralSQLModelData, id: string): Result<GeneralEntity> {
        return GeneralEntity.create(
            {
                nombre   : data.nombre,
                tiempo   : data.tiempo,
                tipo     : data.tipo,
                paso     : data.paso,
                usuarioId: data.fid_usuario,
            },
            id,
        );
    }
    toSQLModelData(entity: GeneralEntity): GeneralSQLModelData {
        return {
            nombre     : entity.props.nombre,
            tiempo     : entity.props.tiempo,
            tipo       : entity.props.tipo,
            paso       : entity.props.paso,
            fid_usuario: entity.props.usuarioId,
        };
    }
}
