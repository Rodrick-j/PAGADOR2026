import { BaseService } from "../../../../base/domain/BaseService";
import { BitacoraViajeEntity, BitacoraViajeProps } from "./BitacoraViajeEntity";
import { Result } from "../../../../base/types/Result";

export class BitacoraViajeService extends BaseService<BitacoraViajeEntity, BitacoraViajeProps> {
    public async factory(props: BitacoraViajeProps, id?: string): Promise<Result<BitacoraViajeEntity>> {
        return BitacoraViajeEntity.create(props, id);
    }
}
