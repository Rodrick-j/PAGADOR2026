import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type GeneralProps = {    
    nombre   : string;
    tiempo   : string;
    tipo     : string;
    paso     : number;
    usuarioId: string;
};

export class GeneralEntity extends Entity<GeneralProps> {
    public static create(props: GeneralProps, id?: string): Result<GeneralEntity> {
        return Result.ok<GeneralEntity>(new GeneralEntity(props, id));
    }
}
