import BaseSQLRepository from "../../../../../base/infra/_sql/BaseSQLRepository";
import { VacacionEntity } from "../../VacacionEntity";
import { IVacacionRepository } from "../IVacacionRepository";
import { Result } from "../../../../../base/types/Result";
import { VacacionSQLModelData } from "./VacacionSQLModel";

export class VacacionRepositorySQL
    extends BaseSQLRepository<VacacionEntity, VacacionSQLModelData>
    implements IVacacionRepository
{
    fromSQLModelData(data: VacacionSQLModelData, id: string): Result<VacacionEntity> {
        return VacacionEntity.create(
            {
                fechaRegistro: data.fecha_registro,
                tipoVacacion : data.tipo_vacacion,
                fechaIni     : data.fecha_ini,
                fechaFin     : data.fecha_fin,
                estado       : data.estado,
                usuarioId    : data.fid_usuario,
                jefeId       : data.fid_jefe,
                areaId       : data.fid_area,
            },
            id,
        );
    }
    toSQLModelData(entity: VacacionEntity): VacacionSQLModelData {
        const props = entity.props;
        return {
            fecha_registro: props.fechaRegistro,
            tipo_vacacion : props.tipoVacacion,
            fecha_ini     : props.fechaIni,
            fecha_fin     : props.fechaFin,
            estado        : props.estado,
            fid_usuario   : props.usuarioId,
            fid_jefe      : props.jefeId,
            fid_area      : props.areaId,
        };
    }
}
