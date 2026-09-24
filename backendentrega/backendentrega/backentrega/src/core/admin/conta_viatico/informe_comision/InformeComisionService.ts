import { BaseService } from "../../../../base/domain/BaseService";
import { InformeComisionEntity, InformeComisionProps } from "./InformeComisionEntity";
import { Result } from "../../../../base/types/Result";

export class InformeComisionService extends BaseService<InformeComisionEntity, InformeComisionProps> {
    public async factory(props: InformeComisionProps, id?: string): Promise<Result<InformeComisionEntity>> {
        return InformeComisionEntity.create(props, id);
    }
}
