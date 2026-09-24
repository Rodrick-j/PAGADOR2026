import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type ActaRecepcionProps = {
    fechaRegistro: Date;
    codActa      : string;
    estado       : boolean;
    sellado      : boolean;
    observacion  : string;
    documentosId : string[];
    areaId       : string;
    personalId   : string;
};

export class ActaRecepcionEntity extends Entity<ActaRecepcionProps> {
    public static create(props: ActaRecepcionProps, id?: string): Result<ActaRecepcionEntity> {
        return Result.ok<ActaRecepcionEntity>(new ActaRecepcionEntity(props, id));
    }
}
