import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type AperturaGeneralProps = {
   
    /*tabla especifica de Apertura viatico*/
    aperturaProgramatica          : string;
    ue                            : number;
    codFte                        : number;
    codOrg                        : number;     
    presupuestoInicial            : number;
    presupuestoRestante           : number;
    modAprobada                   : number;
    presupuestoVigente            : number;
    pagado                        : number;
    saldoEjecutar                 : number;
    estadoActivo                  : boolean;
    estado                        : string;
    sisin                         : string;
    gestion                       : Date;
    objetoId                      : string;
    tipoArea                      : string;
    areaHijoId                    : string;
    areaId                        : string;    
};

export class AperturaGeneralEntity extends Entity<AperturaGeneralProps>{
    public static create(props : AperturaGeneralProps, id?: string):Result<AperturaGeneralEntity>{
        return Result.ok<AperturaGeneralEntity>(new AperturaGeneralEntity(props,id));
    } 
}

