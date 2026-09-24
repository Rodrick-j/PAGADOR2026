import { Entity } from "../../../base/domain/Entity";
import { Result } from "../../../base/types/Result";

export type DetalleDestinorrhhProps = {
    
    tipoVehiculoOP         : string;
    objetivoViaje          : string;
    destinoReg             : string;
    fechaDia               : Date;
    horaInicio             : string;
    horaFin                : string;
    pernocte               : string;
    estado                 : string;
    modificacion           : boolean;
    observacion            : string;
    estadoObservacion      : string;
    memorandumrrhhId       : string;    
    vehiculoId             : string;
    destinoId              : string;
    destinoId2              : string;

};

export class DetalleDestinorrhhEntity extends Entity<DetalleDestinorrhhProps>{
    public static create(props : DetalleDestinorrhhProps,id?: string):Result<DetalleDestinorrhhEntity>{
        return Result.ok<DetalleDestinorrhhEntity>(new DetalleDestinorrhhEntity(props,id));
    }
}

