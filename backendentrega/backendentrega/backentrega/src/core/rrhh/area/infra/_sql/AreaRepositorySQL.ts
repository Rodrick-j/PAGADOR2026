import BaseSQLRepository from "../../../../../base/infra/_sql/BaseSQLRepository";
import { AreaEntity } from "../../AreaEntity";
import { IAreaRepository } from "../IAreaRepository";
import { Result } from "../../../../../base/types/Result";
import { AreaSQLModelData } from "./AreaSQLModel";

export class AreaRepositorySQL extends BaseSQLRepository<AreaEntity, AreaSQLModelData> implements IAreaRepository {
    fromSQLModelData(data: AreaSQLModelData, id: string): Result<AreaEntity> {
        return AreaEntity.create(
            {
                sigla : data.sigla,
                nombre: data.nombre,
                indice : data.indice,
                padre : data.padre,
                areaId: data.fid_area,
                activo: data.activo,
            },
            id,
        );
    }
    toSQLModelData(entity: AreaEntity): AreaSQLModelData {
        return {
            sigla   : entity.props.sigla,
            nombre  : entity.props.nombre,
            padre   : entity.props.padre,
            indice   : entity.props.indice,
            fid_area: entity.props.areaId,
            activo  : entity.props.activo,
        };
    }
}
