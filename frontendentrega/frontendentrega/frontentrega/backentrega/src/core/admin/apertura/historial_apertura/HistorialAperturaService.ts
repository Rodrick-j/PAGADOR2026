import { BaseService } from "../../../../base/domain/BaseService";
import { HistorialAperturaEntity, HistorialAperturaProps } from "./HistorialAperturaEntity";
import { Result } from "../../../../base/types/Result";

export class HistorialAperturaService extends BaseService<HistorialAperturaEntity, HistorialAperturaProps> {
    public async factory(props: HistorialAperturaProps, id?: string): Promise<Result<HistorialAperturaEntity>> {
        return HistorialAperturaEntity.create(props, id);
    }

    public async setPurgeAll(): Promise<Result<boolean>> {
        return super.purgeAll();
    }
}
