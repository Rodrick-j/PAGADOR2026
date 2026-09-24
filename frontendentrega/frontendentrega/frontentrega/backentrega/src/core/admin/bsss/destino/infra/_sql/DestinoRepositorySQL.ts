import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { DestinoEntity } from "../../DestinoEntity";
import { IDestinoRepository } from "../IDestinoRepository";
import { Result } from "../../../../../../base/types/Result";
import { DestinoSQLModelData } from "./DestinoSQLModel";

export class DestinoRepositorySQL extends BaseSQLRepository<DestinoEntity, DestinoSQLModelData> implements IDestinoRepository {
    fromSQLModelData(data: DestinoSQLModelData, id: string): Result<DestinoEntity> {
        return DestinoEntity.create(
            {
                nombre   : data.nombre,
                distancia: data.distancia,
                litros   : data.litros,
                estado   : data.estado,
            },
            id,
        );
    }
    toSQLModelData(entity: DestinoEntity): DestinoSQLModelData {
        return {
            nombre   : entity.props.nombre,
            distancia: entity.props.distancia,
            litros   : entity.props.litros,
            estado   : entity.props.estado,
        };
    }
}
