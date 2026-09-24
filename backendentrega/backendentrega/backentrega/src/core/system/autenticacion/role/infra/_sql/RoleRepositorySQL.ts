import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { RoleEntity } from "../../RoleEntity";
import { IRoleRepository } from "../IRoleRepository";
import { Result } from "../../../../../../base/types/Result";
import { RoleSQLModelData } from "./RoleSQLModel";

export class RoleRepositorySQL extends BaseSQLRepository<RoleEntity, RoleSQLModelData> implements IRoleRepository {
    fromSQLModelData(data: RoleSQLModelData, id: string): Result<RoleEntity> {
        return RoleEntity.create(
            {
                nombre: data.nombre,
                tipo: data.tipo,
                permisos: data.permisos,
                modulos: data.modulos,
            },
            id,
        );
    }
    toSQLModelData(entity: RoleEntity): RoleSQLModelData {
        return {
            nombre: entity.props.nombre,
            tipo: entity.props.tipo,
            permisos: entity.props.permisos,
            modulos: entity.props.modulos,
        };
    }
}
