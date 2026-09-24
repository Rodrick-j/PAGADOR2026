import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type HistorialAperturaProps = {
   
    /*tabla especifica de Apertura viatico*/
    titulo                        : string;
    descripcion                   : string;
    gasto                         : number;
    debeHaber                     : string;
    estado                        : string;
    fecha                         : Date;
    aperturaId                    : string;  
};

export class HistorialAperturaEntity extends Entity<HistorialAperturaProps>{
    public static create(props : HistorialAperturaProps, id?: string):Result<HistorialAperturaEntity>{
        return Result.ok<HistorialAperturaEntity>(new HistorialAperturaEntity(props,id));
    } 
}

