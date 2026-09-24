import { BaseService } from "../../../../base/domain/BaseService";
import { DestinoEntity, DestinoProps } from "./DestinoEntity";
import { Result } from "../../../../base/types/Result";

export class DestinoService extends BaseService<DestinoEntity, DestinoProps> {
    public async factory(props: DestinoProps, id?: string): Promise<Result<DestinoEntity>> {
        return DestinoEntity.create(props, id);
    }
}
