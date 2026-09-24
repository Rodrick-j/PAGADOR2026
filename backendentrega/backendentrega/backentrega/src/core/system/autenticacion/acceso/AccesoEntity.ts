import { Entity } from "../../../../base/domain/Entity";
import { DeviceInfo } from "../../../../base/types/DeviceInfo";
import { Result } from "../../../../base/types/Result";

export type AccesoProps = {
    fecha: Date;
    device: DeviceInfo;
    usuarioId: string;
};

export class AccesoEntity extends Entity<AccesoProps> {
    public static create(props: AccesoProps, id?: string): Result<AccesoEntity> {
        return Result.ok<AccesoEntity>(new AccesoEntity(props, id));
    }
}
