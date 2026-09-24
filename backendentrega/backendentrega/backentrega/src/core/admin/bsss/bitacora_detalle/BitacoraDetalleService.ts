import { BaseService } from "../../../../base/domain/BaseService";
import { BitacoraDetalleEntity, BitacoraDetalleProps } from "./BitacoraDetalleEntity";
import { Result } from "../../../../base/types/Result";

export class BitacoraDetalleService extends BaseService<BitacoraDetalleEntity, BitacoraDetalleProps> {
    public async factory(props: BitacoraDetalleProps, id?: string): Promise<Result<BitacoraDetalleEntity>> {
        return BitacoraDetalleEntity.create(props, id);
    }
}
