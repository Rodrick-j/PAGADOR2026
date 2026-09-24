import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type ObjetoGastoProps = {
    /*tabla especifica de Objeto Gasto*/   
    objeto                        : string;
    descripcionObjetoGasto        : string;     
    observacion                   : string;
    estado                        : boolean;
};

export class ObjetoGastoEntity extends Entity<ObjetoGastoProps>{
    public static create(props : ObjetoGastoProps, id?: string):Result<ObjetoGastoEntity>{
        return Result.ok<ObjetoGastoEntity>(new ObjetoGastoEntity(props,id));
    } 
}

