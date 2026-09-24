import { BaseService } from "../../../../base/domain/BaseService";
import { AperturaViaticoEntity, AperturaViaticoProps } from "./AperturaViaticoEntity";
import { Result } from "../../../../base/types/Result";

export class AperturaViaticoService extends BaseService<AperturaViaticoEntity, AperturaViaticoProps> {
    public async factory(props: AperturaViaticoProps, id?: string): Promise<Result<AperturaViaticoEntity>> {
        return AperturaViaticoEntity.create(props, id);
    }

    public async setPurgeAll(): Promise<Result<boolean>> {
        return super.purgeAll();
    }
}
