import { BaseService } from "../../../../base/domain/BaseService";
import { RutaEntity, RutaProps } from "./RutaEntity";
import { Result } from "../../../../base/types/Result";

export class RutaService extends BaseService<RutaEntity, RutaProps> {
    public async factory(props: RutaProps, id?: string): Promise<Result<RutaEntity>> {
        return RutaEntity.create(props, id);
    }
}
