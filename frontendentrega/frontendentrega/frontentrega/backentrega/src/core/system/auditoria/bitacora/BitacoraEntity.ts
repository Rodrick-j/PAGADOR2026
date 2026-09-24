import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type BitacoraProps = {
    fecha    : Date;
    usuarioId: string;
    ruta     : string;
    metodo   : string;
    ip       : string;
    rol      : string;
    modulo  ?: string | null;
};

export class BitacoraEntity extends Entity<BitacoraProps> {
    public static create(props: BitacoraProps, id?: string): Result<BitacoraEntity> {
        return Result.ok<BitacoraEntity>(new BitacoraEntity(props, id));
    }
}
