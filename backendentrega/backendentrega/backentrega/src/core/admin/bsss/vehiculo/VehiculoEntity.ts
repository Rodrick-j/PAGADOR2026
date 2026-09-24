import { Entity } from "../../../../base/domain/Entity";
import { Result } from "../../../../base/types/Result";

export type VehiculoProps = {
    codActivo  : string;
    numPlaca   : string;
    tipo       : string;
    marca      : string;
    carga      : string;
    observacion: string;
    estado     : boolean;
    personalId : string;
    areaId     : string;
};

export class VehiculoEntity extends Entity<VehiculoProps> {
    public static create(props: VehiculoProps, id?: string): Result<VehiculoEntity> {
        return Result.ok<VehiculoEntity>(new VehiculoEntity(props, id));
    }
}
