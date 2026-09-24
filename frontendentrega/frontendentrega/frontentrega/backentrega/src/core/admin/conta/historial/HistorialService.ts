import { BaseService } from "../../../../base/domain/BaseService";
import { HistorialEntity, HistorialProps } from "./HistorialEntity";
import { Result } from "../../../../base/types/Result";

export class HistorialService extends BaseService<HistorialEntity, HistorialProps> {
    public async factory(props: HistorialProps, id?: string): Promise<Result<HistorialEntity>> {
        return HistorialEntity.create(props, id);
    }

    public async eliminaHistorial(id: string): Promise<Result<boolean>> {
        return super.delete(id);
    }
}
