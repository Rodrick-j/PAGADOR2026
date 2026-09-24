import { BaseService } from "../../../../base/domain/BaseService";
import { InformeGeneralEntity, InformeGeneralProps } from "./InformeGeneralEntity";
import { Result } from "../../../../base/types/Result";

export class InformeGeneralService extends BaseService<InformeGeneralEntity, InformeGeneralProps> {
    public async factory(props: InformeGeneralProps, id?: string): Promise<Result<InformeGeneralEntity>> {
        return InformeGeneralEntity.create(props, id);
    }
}
