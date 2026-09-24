import { BaseService } from "../../../../base/domain/BaseService";
import { ViaticoEntity, ViaticoProps } from "./ViaticoEntity";
import { Result } from "../../../../base/types/Result";

export class ViaticoService extends BaseService<ViaticoEntity, ViaticoProps> {
    public async factory(props: ViaticoProps, id?: string): Promise<Result<ViaticoEntity>> {
        return ViaticoEntity.create(props, id);
    }

    public async setPurgeAll(): Promise<Result<boolean>> {
        return super.purgeAll();
    }
}
