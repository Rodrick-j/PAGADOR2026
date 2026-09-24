import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type ViaticoProps ={
    numeRecibo           : number;
    fechaPagoViatico     : Date;
    sumaPasajeIda        : number;
    sumaPasajeRetorno    : number;
    tipoPasajeGD         : string;
    totalPasajes         : number;
    totalViatico         : number;
    liquidoPagable       : number;
    estadoPago           : string;
    estadoRecibo         : string;
    fechaAnulacion       : Date;
    notificacionViatico  : string;
    memorandumId         : string | null;
    escalaId             : string | null;
    
};

export class ViaticoEntity extends Entity<ViaticoProps>{
    public static create(props : ViaticoProps, id? : string):Result<ViaticoEntity>{
        return Result.ok<ViaticoEntity>(new ViaticoEntity(props, id));
    }
}
