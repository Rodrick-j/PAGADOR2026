import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type HistorialGastoProps = {
   
    /*tabla especifica de Apertura viatico*/
    fecha                : Date;
    descripcion          : string;
    debe                 : number;
    haber                : number;
    saldo                : number;
	estado               : string;
    historialAperturaId   : string;
    aperturaId           : string;	
};

export class HistorialGastoEntity extends Entity<HistorialGastoProps>{
    public static create(props : HistorialGastoProps, id?: string):Result<HistorialGastoEntity>{
        return Result.ok<HistorialGastoEntity>(new HistorialGastoEntity(props,id));
    } 
}

