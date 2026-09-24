import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type AsignacionProps = {
    estado          : boolean;
    observacion     : string | null;
    saldo           : number;
    partidaGeneralId: string | null;
    usuarioId       : string | null;
    contrato        : string;
};

export class AsignacionEntity extends Entity<AsignacionProps> {
    public static create(props: AsignacionProps, id?: string): Result<AsignacionEntity> {
        return Result.ok<AsignacionEntity>(new AsignacionEntity(props, id));
    }
}
