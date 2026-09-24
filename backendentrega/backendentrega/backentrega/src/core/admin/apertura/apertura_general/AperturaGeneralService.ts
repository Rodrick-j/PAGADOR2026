import { BaseService } from "../../../../base/domain/BaseService";
import { AperturaGeneralEntity, AperturaGeneralProps } from "./AperturaGeneralEntity";
import { Result } from "../../../../base/types/Result";

export class AperturaGeneralService extends BaseService<AperturaGeneralEntity, AperturaGeneralProps> {
    public async factory(props: AperturaGeneralProps, id?: string): Promise<Result<AperturaGeneralEntity>> {
        return AperturaGeneralEntity.create(props, id);
    }

    public async setPurgeAll(): Promise<Result<boolean>> {
        return super.purgeAll();
    }
}
