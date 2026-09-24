import { BaseService } from "../../../base/domain/BaseService";
import { DetalleDestinorrhhEntity, DetalleDestinorrhhProps } from "./DetalleDestinorrhhEntity";
import { Result } from "../../../base/types/Result";

export  class DetalleDestinorrhhService extends BaseService<DetalleDestinorrhhEntity, DetalleDestinorrhhProps> {
    public async factory(props: DetalleDestinorrhhProps, id?: string): Promise<Result<DetalleDestinorrhhEntity>> {
        return DetalleDestinorrhhEntity.create(props, id);
    }

    public async setPurgeAll(): Promise<Result<boolean>> {
        return super.purgeAll();
    }

}
