import { BaseService } from "../../../../base/domain/BaseService";
import { DeudaEntity, DeudaProps } from "./DeudaEntity";
import { Result } from "../../../../base/types/Result";

export class DeudaService extends BaseService<DeudaEntity, DeudaProps> {
    public async factory(props: DeudaProps, id?: string): Promise<Result<DeudaEntity>> {
        return DeudaEntity.create(props, id);
    }

    public async eliminaDeuda(id: string): Promise<Result<boolean>> {
        return super.delete(id);
    }
}
