import { BaseService } from "../../../../base/domain/BaseService";
import { AsignacionEntity, AsignacionProps } from "./AsignacionEntity";
import { Result } from "../../../../base/types/Result";

export class AsignacionService extends BaseService<AsignacionEntity, AsignacionProps> {
    public async factory(props: AsignacionProps, id?: string): Promise<Result<AsignacionEntity>> {
        return AsignacionEntity.create(props, id);
    }

    public async setPurgeAll(): Promise<Result<boolean>> {
        return super.purgeAll();
    }
}
