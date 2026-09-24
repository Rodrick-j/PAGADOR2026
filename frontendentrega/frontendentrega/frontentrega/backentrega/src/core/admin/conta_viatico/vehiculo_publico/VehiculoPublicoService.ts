import { BaseService } from "../../../../base/domain/BaseService";
import { VehiculoPublicoEntity, VehiculoPublicoProps } from "./VehiculoPublicoEntity";
import { Result } from "../../../../base/types/Result";

export class VehiculoPublicoService extends BaseService<VehiculoPublicoEntity, VehiculoPublicoProps> {
    public async factory(props: VehiculoPublicoProps, id?: string): Promise<Result<VehiculoPublicoEntity>> {
        return VehiculoPublicoEntity.create(props, id);
    }
}
