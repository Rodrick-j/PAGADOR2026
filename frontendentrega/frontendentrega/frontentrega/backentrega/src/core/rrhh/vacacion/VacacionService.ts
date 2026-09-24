import { BaseService } from "../../../base/domain/BaseService";
import { VacacionEntity, VacacionProps } from "./VacacionEntity";
import { Result } from "../../../base/types/Result";

export class VacacionService extends BaseService<VacacionEntity, VacacionProps> {
    public async factory(props: VacacionProps, id?: string): Promise<Result<VacacionEntity>> {
        return VacacionEntity.create(props, id);
    }

    public async eliminaVacacion(id: string): Promise<Result<boolean>> {
        return super.delete(id);
    }
}
