import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type EscalaDestinoProps = {
    tipoPCP              : string;  
    escalaExterior      : string;
    destino              : string; 
    provincia            : string;
    modalidad            : string;
    pasajeMinimo         : number;
    pasajeMaximo         : number;
  };


export class EscalaDestinoEntity extends Entity<EscalaDestinoProps>{
    public static create(props: EscalaDestinoProps, id?: string): Result<EscalaDestinoEntity>{
        return Result.ok<EscalaDestinoEntity>(new EscalaDestinoEntity(props, id));
    }
}

