import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type CitesProps = {
   
    /*tabla especifica de Apertura viatico*/
    fechaRegistro           : Date;
    nombreUsuario          : string;  
    nombreAreaSolicitante   : string;
    nombreAreaDestino       : string;
    citeCompleto            : string;
    referencia              : string;
    tipoDocumento           : string;
    dias                    : number;
    gestion                 : string;    
    actividad               : string;            
    nombreProceso           : string;
    cuce                    : string;
    empresaAdjudicada       : string;
    observacion             : string;     
    hojaRuta                : string;
    fechaCierre             : Date;    
    estado                  : string; 
    estadoActivo            : boolean;
    usuarioId               : string;
    tipoCiteId              : string; 
    numeroPaginas?          : number;
};

export class CitesEntity extends Entity<CitesProps>{
    public static create(props : CitesProps, id?: string):Result<CitesEntity>{
        return Result.ok<CitesEntity>(new CitesEntity(props,id));
    } 
}

