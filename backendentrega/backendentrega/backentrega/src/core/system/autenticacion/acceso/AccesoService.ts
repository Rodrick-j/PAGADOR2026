import { BaseService } from "../../../../base/domain/BaseService";
import { AccesoEntity, AccesoProps } from "./AccesoEntity";
import { Result } from "../../../../base/types/Result";

export class AccesoService extends BaseService<AccesoEntity, AccesoProps> {
    public async factory(props: AccesoProps, id?: string): Promise<Result<AccesoEntity>> {
        return AccesoEntity.create(props, id);
    }

    public async setPurgeAll(): Promise<Result<boolean>> {
        return super.purgeAll();
    }
}
