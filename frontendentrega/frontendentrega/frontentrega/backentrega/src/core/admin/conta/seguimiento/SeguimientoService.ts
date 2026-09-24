import { BaseService } from "../../../../base/domain/BaseService";
import { SeguimientoEntity, SeguimientoProps } from "./SeguimientoEntity";
import { Result } from "../../../../base/types/Result";

export class SeguimientoService extends BaseService<SeguimientoEntity, SeguimientoProps> {
    public async factory(props: SeguimientoProps, id?: string): Promise<Result<SeguimientoEntity>> {
        return SeguimientoEntity.create(props, id);
    }

    public async eliminaSeguimiento(id: string): Promise<Result<boolean>> {
        return super.delete(id);
    }
}
