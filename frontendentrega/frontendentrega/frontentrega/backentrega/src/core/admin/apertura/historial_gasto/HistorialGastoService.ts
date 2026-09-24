import { BaseService } from "../../../../base/domain/BaseService";
import { HistorialGastoEntity, HistorialGastoProps } from "./HistorialGastoEntity";
import { Result } from "../../../../base/types/Result";

export class HistorialGastoService extends BaseService<HistorialGastoEntity, HistorialGastoProps> {
    public async factory(props: HistorialGastoProps, id?: string): Promise<Result<HistorialGastoEntity>> {
        return HistorialGastoEntity.create(props, id);
    }

    public async setPurgeAll(): Promise<Result<boolean>> {
        return super.purgeAll();
    }
}
