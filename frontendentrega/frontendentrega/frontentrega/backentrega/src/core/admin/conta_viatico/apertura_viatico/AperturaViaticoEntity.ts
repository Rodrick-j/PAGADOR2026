import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type AperturaViaticoProps = {
   
    /*tabla especifica de Apertura viatico*/
    aperturaProgramatica          : string;
    codFte                        : string;
    codOrg                        : string;
    objeto                        : string;
    descripcionObjetoGasto        : string;
    presupuestoInicial            : number;
    presupuestoRestante           : number;
    estado                        : string;
    sisin                         : string;
    gestion                       : Date;
    areaId                        : string;    
    aperturaGeneralId             : string;
    estadoActivo                  : boolean;
};

export class AperturaViaticoEntity extends Entity<AperturaViaticoProps>{
    public static create(props : AperturaViaticoProps, id?: string):Result<AperturaViaticoEntity>{
        return Result.ok<AperturaViaticoEntity>(new AperturaViaticoEntity(props,id));
    } 
}

