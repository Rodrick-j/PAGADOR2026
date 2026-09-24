import { BaseService } from "../../../../base/domain/BaseService";
import { RoleEntity, RoleProps } from "./RoleEntity";
import { Result } from "../../../../base/types/Result";

export class RoleService extends BaseService<RoleEntity, RoleProps> {
    public async factory(props: RoleProps, id?: string): Promise<Result<RoleEntity>> {
        return RoleEntity.create(props, id);
    }
}
