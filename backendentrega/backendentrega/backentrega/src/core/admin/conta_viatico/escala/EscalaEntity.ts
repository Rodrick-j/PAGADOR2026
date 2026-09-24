import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type EscalaProps = {
    categoria             : string;  
    tipoComisionIdp     : string;
    escala                : string;
    viaticoPorDia         : number;
    moneda                : string;
    bolivianos            : number;
    cargoId               : string;
  };


export class EscalaEntity extends Entity<EscalaProps>{
    public static create(props: EscalaProps, id?: string): Result<EscalaEntity>{
        return Result.ok<EscalaEntity>(new EscalaEntity(props, id));
    }
}

