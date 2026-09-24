import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type DeudaProps = {
    codActivo    : string;
    titulo       : string;
    descripcion  : string;
    estado       : boolean;
    gestionDeuda : string;
    montoDeuda   : number;
    cuentaId     : string;
};

export class DeudaEntity extends Entity<DeudaProps> {
    public static create(props: DeudaProps, id?: string): Result<DeudaEntity> {
        return Result.ok<DeudaEntity>(new DeudaEntity(props, id));
    }
}
