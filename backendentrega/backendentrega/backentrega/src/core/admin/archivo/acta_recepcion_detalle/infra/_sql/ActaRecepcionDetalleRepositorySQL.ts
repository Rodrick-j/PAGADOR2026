import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { ActaRecepcionDetalleEntity } from "../../ActaRecepcionDetalleEntity";
import { Result } from "../../../../../../base/types/Result";
import { ActaRecepcionDetalleSQLModelData } from "./ActaRecepcionDetalleSQLModel";
import { IActaRecepcionDetalleRepository } from "../IActaRecepcionDetalleRepository";

export class ActaRecepcionDetalleRepositorySQL extends BaseSQLRepository<ActaRecepcionDetalleEntity, ActaRecepcionDetalleSQLModelData> implements IActaRecepcionDetalleRepository {
    fromSQLModelData(data: ActaRecepcionDetalleSQLModelData, id: string): Result<ActaRecepcionDetalleEntity> {
        return ActaRecepcionDetalleEntity.create(
            {
                nrodoc         : data.nrodoc,
                tipo           : data.tipo,
                nrofolio       : data.nrofolio,
                gestion        : data.gestion,
                descripcion    : data.descripcion,
                actaRecepcionId: data.fid_acta_recepcion,
            },
            id,
        );
    }
    toSQLModelData(entity: ActaRecepcionDetalleEntity): ActaRecepcionDetalleSQLModelData {
        return {
            nrodoc            : entity.props.nrodoc,
            tipo              : entity.props.tipo,
            nrofolio          : entity.props.nrofolio,
            gestion           : entity.props.gestion,
            descripcion       : entity.props.descripcion,
            fid_acta_recepcion: entity.props.actaRecepcionId,
        };
    }
}
