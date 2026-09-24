import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type ActaRecepcionDetalleProps = {   
    nrodoc         : string;
    tipo           : string;
    nrofolio       : string;
    gestion        : string;
    descripcion    : string;
    actaRecepcionId: string;
};

export class ActaRecepcionDetalleEntity extends Entity<ActaRecepcionDetalleProps> {
    public static create(props: ActaRecepcionDetalleProps, id?: string): Result<ActaRecepcionDetalleEntity> {
        return Result.ok<ActaRecepcionDetalleEntity>(new ActaRecepcionDetalleEntity(props, id));
    }
}
