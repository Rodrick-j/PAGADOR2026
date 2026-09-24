import { BaseService } from "../../../../base/domain/BaseService";
import { ObjetoGastoEntity, ObjetoGastoProps } from "./ObjetoGastoEntity";
import { Result } from "../../../../base/types/Result";

export class ObjetoGastoService extends BaseService<ObjetoGastoEntity, ObjetoGastoProps> {
    public async factory(props: ObjetoGastoProps, id?: string): Promise<Result<ObjetoGastoEntity>> {
        return ObjetoGastoEntity.create(props, id);
    }
}
