import { BaseService } from "../../../../base/domain/BaseService";
import { EscalaEntity, EscalaProps } from "./EscalaEntity";
import { Result } from "../../../../base/types/Result";

export class EscalaService extends BaseService<EscalaEntity, EscalaProps> {
    public async factory(props: EscalaProps, id?: string): Promise<Result<EscalaEntity>> {
        return EscalaEntity.create(props, id);
    }
}
