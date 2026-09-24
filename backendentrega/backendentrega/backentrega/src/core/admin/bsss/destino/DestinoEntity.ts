import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type DestinoProps = {
    nombre   : string;
    distancia: number;
    litros   : number;
    estado   : boolean;
};

export class DestinoEntity extends Entity<DestinoProps> {
    public static create(props: DestinoProps, id?: string): Result<DestinoEntity> {
        return Result.ok<DestinoEntity>(new DestinoEntity(props, id));
    }
}
