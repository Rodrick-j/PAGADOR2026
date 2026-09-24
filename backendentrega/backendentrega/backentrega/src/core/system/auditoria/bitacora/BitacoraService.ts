import { BaseService } from "../../../../base/domain/BaseService";
import { BitacoraEntity, BitacoraProps } from "./BitacoraEntity";
import { Result } from "../../../../base/types/Result";
import moment from "moment";

export type BitacoraRegisterParams = {
    usuarioId: string;
    ruta     : string;
    metodo   : string;
    ip       : string;
    rol      : string;
    modulo  ?: string | null;
    fecha   ?: Date;
};

export class BitacoraService extends BaseService<BitacoraEntity, BitacoraProps> {
    public async factory(props: BitacoraProps, id?: string): Promise<Result<BitacoraEntity>> {
        return BitacoraEntity.create(props, id);
    }

    public async setPurgeAll(): Promise<Result<boolean>> {
        return super.purgeAll();
    }

    /**
     * Registro estructurado de actividad de usuario
     */
    public async register(params: BitacoraRegisterParams): Promise<Result<void>> {
        const {
            usuarioId,
            rol,
            ruta,
            metodo,
            ip,
            modulo = null,
            fecha = moment().toDate(),
        } = params;

        const result = await super.create({
            fecha,
            usuarioId,
            rol,
            ruta,
            metodo,
            ip,
            modulo,
        });

        if (result.isFailure) {
            return Result.fail<void>(result.errorValue());
        }

        return Result.ok<void>();
    }
}
