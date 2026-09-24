import { Entity } from "../../../base/domain/Entity";
import { Result } from "../../../base/types/Result";

export interface AreaProps {
    sigla : string;
    nombre: string;
    indice : string;
    padre : boolean;
    areaId: string | null;
    activo: boolean;
}

export class AreaEntity extends Entity<AreaProps> {
    public static create(props: AreaProps, id?: string): Result<AreaEntity> {
        return Result.ok<AreaEntity>(new AreaEntity(props, id));
    }
}
