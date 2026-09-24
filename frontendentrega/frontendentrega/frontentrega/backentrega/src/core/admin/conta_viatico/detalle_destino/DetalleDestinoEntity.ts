import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type DetalleDestinoProps = {
    
    tipoVehiculoOP         : string;
    objetivoViaje          : string;
    destinoReg             : string;
    fechaDia               : Date;
    horaInicio             : string;
    horaFin                : string;
    pernocte               : string;
    pasajeIda              : number;
    pasajeRetorno          : number;
    totalPasajedia         : number;
    tipoVehiculoOPIda      : string;
    tipoVehiculoOPVuelta   : string;
    estado                 : string;
    modificacion           : boolean;
    observacion            : string;
    estadoObservacion      : string;
    memorandumId           : string;
    viaticoId              : string;
    vehiculoId             : string;
    destinoId              : string;
    destinoId2              : string;

};

export class DetalleDestinoEntity extends Entity<DetalleDestinoProps>{
    public static create(props : DetalleDestinoProps,id?: string):Result<DetalleDestinoEntity>{
        return Result.ok<DetalleDestinoEntity>(new DetalleDestinoEntity(props,id));
    }
}

