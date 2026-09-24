import { BaseService } from "../../../../base/domain/BaseService";
import { EscalaDestinoEntity, EscalaDestinoProps } from "./EscalaDestinoEntity";
import { Result } from "../../../../base/types/Result";

export class EscalaDestinoService extends BaseService<EscalaDestinoEntity, EscalaDestinoProps> {
    public async factory(props: EscalaDestinoProps, id?: string): Promise<Result<EscalaDestinoEntity>> {
        return EscalaDestinoEntity.create(props, id);
    }
}
