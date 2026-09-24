import { BaseService } from "../../../../base/domain/BaseService";
import { TipoCitesEntity, TipoCitesProps } from "./TipoCitesEntity";
import { Result } from "../../../../base/types/Result";

export class TipoCitesService extends BaseService<TipoCitesEntity, TipoCitesProps> {
    public async factory(props: TipoCitesProps, id?: string): Promise<Result<TipoCitesEntity>> {
        return TipoCitesEntity.create(props, id);
    }
}
