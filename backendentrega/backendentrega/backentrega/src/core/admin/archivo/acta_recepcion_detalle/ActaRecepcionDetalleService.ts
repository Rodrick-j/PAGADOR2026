import { BaseService } from "../../../../base/domain/BaseService";
import { ActaRecepcionDetalleEntity, ActaRecepcionDetalleProps } from "./ActaRecepcionDetalleEntity";
import { Result } from "../../../../base/types/Result";

export class ActaRecepcionDetalleService extends BaseService<ActaRecepcionDetalleEntity, ActaRecepcionDetalleProps> {
    public async factory(props: ActaRecepcionDetalleProps, id?: string): Promise<Result<ActaRecepcionDetalleEntity>> {
        return ActaRecepcionDetalleEntity.create(props, id);
    }

    public async eliminaActaRecepcionDetalle(id: string): Promise<Result<boolean>> {
        return super.delete(id);
    }
}
