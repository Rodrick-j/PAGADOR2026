import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type RutaProps = {
    name        : string;
    path        : string;
    title       : string;
    descripcion?: string;
    icon        : string;
    color       : string;
    isClient    : boolean | null;
};

export class RutaEntity extends Entity<RutaProps> {
    public static create(props: RutaProps, id?: string): Result<RutaEntity> {
        return Result.ok<RutaEntity>(new RutaEntity(props, id));
    }
}
