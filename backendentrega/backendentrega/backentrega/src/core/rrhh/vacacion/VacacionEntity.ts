import { Entity } from "../../../base/domain/Entity";
import { Result } from "../../../base/types/Result";

export interface VacacionProps {
    fechaRegistro: Date;
    tipoVacacion : string;
    fechaIni     : Date;
    fechaFin     : Date;
    estado       : string;
    usuarioId    : string;
    jefeId       : string;
    areaId       : string;
}

export class VacacionEntity extends Entity<VacacionProps> {
    public static create(props: VacacionProps, id?: string): Result<VacacionEntity> {
        return Result.ok<VacacionEntity>(new VacacionEntity(props, id));
    }
}
