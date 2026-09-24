import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type BitacoraViajeProps = {
    semana   : number; 
    areaId   : string;
    vehiculoId: string;
    usuarioId : string;
};

export class BitacoraViajeEntity extends Entity<BitacoraViajeProps> {
    public static create(props: BitacoraViajeProps, id?: string): Result<BitacoraViajeEntity> {
        return Result.ok<BitacoraViajeEntity>(new BitacoraViajeEntity(props, id));
    }
}
