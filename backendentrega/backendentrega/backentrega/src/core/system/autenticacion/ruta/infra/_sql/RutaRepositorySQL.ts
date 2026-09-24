import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { RutaEntity } from "../../RutaEntity";
import { IRutaRepository } from "../IRutaRepository";
import { Result } from "../../../../../../base/types/Result";
import { RutaSQLModelData } from "./RutaSQLModel";

export class RutaRepositorySQL extends BaseSQLRepository<RutaEntity, RutaSQLModelData> implements IRutaRepository {
    fromSQLModelData(data: RutaSQLModelData, id: string): Result<RutaEntity> {
        return RutaEntity.create(
            {
                name       : data.name,
                path       : data.path,
                title      : data.title,
                descripcion: data.descripcion,
                icon       : data.icon,
                color      : data.color,
                isClient   : data.is_client,
            },
            id,
        );
    }
    toSQLModelData(entity: RutaEntity): RutaSQLModelData {
        return {
            name       : entity.props.name,
            path       : entity.props.path,
            title      : entity.props.title,
            descripcion: entity.props.descripcion,
            icon       : entity.props.icon,
            color      : entity.props.color,
            is_client  : entity.props.isClient,
        };
    }
}
