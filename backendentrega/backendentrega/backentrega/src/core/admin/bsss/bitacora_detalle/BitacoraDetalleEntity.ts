import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type BitacoraDetalleProps = {
    fechaSalida      : Date;
    fechaRetorno     : Date;
    horaSalida       : string;
    horaRetorno      : string;
    destinoSalida    : string;
    destinoLlegada   : string;
    kmSalida         : number;
    kmLlegada        : number;
    kmEstimados      : number;
    cantidadPersonas : number;
    estado           : string;
    bitacoraViajeId  : string;
};

export class BitacoraDetalleEntity extends Entity<BitacoraDetalleProps> {
    public static create(props: BitacoraDetalleProps, id?: string): Result<BitacoraDetalleEntity> {
        return Result.ok<BitacoraDetalleEntity>(new BitacoraDetalleEntity(props, id));
    }
}
