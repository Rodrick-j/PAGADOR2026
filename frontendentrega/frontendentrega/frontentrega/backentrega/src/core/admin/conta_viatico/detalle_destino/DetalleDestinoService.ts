import { BaseService } from "../../../../base/domain/BaseService";
import { DetalleDestinoEntity, DetalleDestinoProps } from "./DetalleDestinoEntity";
import { Result } from "../../../../base/types/Result";

export  class DetalleDestinoService extends BaseService<DetalleDestinoEntity, DetalleDestinoProps> {
    public async factory(props: DetalleDestinoProps, id?: string): Promise<Result<DetalleDestinoEntity>> {
        return DetalleDestinoEntity.create(props, id);
    }

    public async setPurgeAll(): Promise<Result<boolean>> {
        return super.purgeAll();
    }

}
