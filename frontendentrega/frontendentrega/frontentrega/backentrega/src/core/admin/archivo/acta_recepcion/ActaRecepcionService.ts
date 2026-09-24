import { BaseService } from "../../../../base/domain/BaseService";
import { ActaRecepcionEntity, ActaRecepcionProps } from "./ActaRecepcionEntity";
import { Result } from "../../../../base/types/Result";

export class ActaRecepcionService extends BaseService<ActaRecepcionEntity, ActaRecepcionProps> {
    public async factory(props: ActaRecepcionProps, id?: string): Promise<Result<ActaRecepcionEntity>> {
        return ActaRecepcionEntity.create(props, id);
    }

    public async eliminaActaRecepcion(id: string): Promise<Result<boolean>> {
        return super.delete(id);
    }
}
