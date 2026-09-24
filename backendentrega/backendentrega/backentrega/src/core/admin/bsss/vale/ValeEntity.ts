import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type ValeProps = {
    codVale       : string;
    fechaEmision  : Date;
    fechaValidez  : Date;
    litros        : number;
    concepto      : string;
    distancia     : number;
    precioUnitario: number;
    precioTotal   : number;
    observaciones : string;
    destino       : string;
    otroVehiculo  : boolean;
    estado?       : string;
    destinos      : string;
    usuarioId     : string | null;
    vehiculoId    : string | null;
    asignacionId  : string | null;
    gestion?      : string | null;
    numeroRecibo? : number;

    litrosReales?: number;
    precioReal?  : number;
    numeroFactura?: number;
    fechaFactura?: Date;
    estadoEjecutado?: string;  

    preAsignacion? : number;
};

export class ValeEntity extends Entity<ValeProps> {
    public static create(props: ValeProps, id?: string): Result<ValeEntity> {
        return Result.ok<ValeEntity>(new ValeEntity(props, id));
    }
}
