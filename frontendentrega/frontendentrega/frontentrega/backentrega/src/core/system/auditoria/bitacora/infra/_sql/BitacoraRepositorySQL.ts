import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { BitacoraEntity } from "../../BitacoraEntity";
import { IBitacoraRepository } from "../IBitacoraRepository";
import { Result } from "../../../../../../base/types/Result";
import { BitacoraSQLModelData } from "./BitacoraSQLModel";

export class BitacoraRepositorySQL
    extends BaseSQLRepository<BitacoraEntity, BitacoraSQLModelData>
    implements IBitacoraRepository
{
    public fromSQLModelData(data: BitacoraSQLModelData, id: string): Result<BitacoraEntity> {
        return BitacoraEntity.create(
            {
                fecha    : data.fecha,
                ruta     : data.ruta,
                metodo   : data.metodo,
                ip       : data.ip,
                modulo   : data.modulo,
                rol      : data.rol,
                usuarioId: data.fid_usuario,
            },
            id,
        );
    }

    public toSQLModelData(entity: BitacoraEntity): BitacoraSQLModelData {
        return {
            fecha      : entity.props.fecha,
            ruta       : entity.props.ruta,
            metodo     : entity.props.metodo,
            rol        : entity.props.rol,
            ip         : entity.props.ip,
            modulo     : entity.props.modulo ?? null,
            fid_usuario: entity.props.usuarioId,
        };
    }
}
