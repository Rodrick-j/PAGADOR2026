import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type DescargoProps = {
    fechaDescargo         : Date;
    estadoDescargo        : string;
    viaticoPasajeReal     : number;
    montoDespositado      : number;
    montoDescargo         : number;
    saldoDescargo         : number;
    presentaInforme       : string;
    viaticoReal           : number;
    observacionEstado     : string;
    observacionDescargo   : string;
    prorroga              : string;
    tiempoDescargo        : number;
    notificacionDescargo  : string;
    viaticoId             : string;
};

export class DescargoEntity extends Entity<DescargoProps>{
    public static create(props : DescargoProps, id?: string):Result<DescargoEntity>{
        return Result.ok<DescargoEntity>(new DescargoEntity(props,id));
    } 
}

