import { BaseService } from "../../../../base/domain/BaseService";
import { ActaEntity, ActaProps } from "./ActaEntity";
import { Result } from "../../../../base/types/Result";

export class ActaService extends BaseService<ActaEntity, ActaProps> {
    public async factory(props: ActaProps, id?: string): Promise<Result<ActaEntity>> {
        return ActaEntity.create(props, id);
    }

    public async eliminaActa(id: string): Promise<Result<boolean>> {
        return super.delete(id);
    }
}
