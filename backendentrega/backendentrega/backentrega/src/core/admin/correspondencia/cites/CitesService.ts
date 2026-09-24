import { BaseService } from "../../../../base/domain/BaseService";
import { CitesEntity, CitesProps } from "./CitesEntity";
import { Result } from "../../../../base/types/Result";

export class CitesService extends BaseService<CitesEntity, CitesProps> {
    public async factory(props: CitesProps, id?: string): Promise<Result<CitesEntity>> {
        return CitesEntity.create(props, id);
    }
}
