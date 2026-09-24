import { BaseService } from "../../../../base/domain/BaseService";
import { DescargoEntity,DescargoProps } from "./DescargoEntity";
import { Result } from "../../../../base/types/Result";

export class DescargoService extends BaseService<DescargoEntity, DescargoProps> {
    public async factory(props: DescargoProps, id?: string): Promise<Result<DescargoEntity>> {
        return DescargoEntity.create(props, id);
    }

    public async setPurgeAll(): Promise<Result<boolean>> {
        return super.purgeAll();
    }
}
