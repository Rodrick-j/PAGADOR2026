import { BaseService } from "../../../../base/domain/BaseService";
import { GeneralEntity, GeneralProps } from "./GeneralEntity";
import { Result } from "../../../../base/types/Result";

export class GeneralService extends BaseService<GeneralEntity, GeneralProps> {
    public async factory(props: GeneralProps, id?: string): Promise<Result<GeneralEntity>> {
        return GeneralEntity.create(props, id);
    }
}
