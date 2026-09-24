import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type TipoCitesProps = {
   
    /*tabla especifica de Apertura viatico*/
    tipoDocumento           : string;
    nombreDocumento         : string;  
    siglaDocumento          : string; 
    estado                  : string;    
};

export class TipoCitesEntity extends Entity<TipoCitesProps>{
    public static create(props : TipoCitesProps, id?: string):Result<TipoCitesEntity>{
        return Result.ok<TipoCitesEntity>(new TipoCitesEntity(props,id));
    } 
}

