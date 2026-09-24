import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { ActaRecepcionEntity } from "../../ActaRecepcionEntity";
import { IActaRecepcionRepository } from "../IActaRecepcionRepository";
import { Result } from "../../../../../../base/types/Result";
import { ActaRecepcionSQLModelData } from "./ActaRecepcionSQLModel";

export class ActaRecepcionRepositorySQL extends BaseSQLRepository<ActaRecepcionEntity, ActaRecepcionSQLModelData> implements IActaRecepcionRepository {
    fromSQLModelData(data: ActaRecepcionSQLModelData, id: string): Result<ActaRecepcionEntity> {
        return ActaRecepcionEntity.create(
            {
                fechaRegistro: data.fecha_registro,
                codActa      : data.cod_acta,
                estado       : data.estado,
                sellado      : data.sellado,
                observacion  : data.observacion,
                documentosId : data.documentos_id,
                areaId       : data.fid_area,
                personalId   : data.fid_personal,
            },
            id,
        );
    }
    toSQLModelData(entity: ActaRecepcionEntity): ActaRecepcionSQLModelData {
        return {
            fecha_registro: entity.props.fechaRegistro,
            cod_acta      : entity.props.codActa,
            observacion   : entity.props.observacion,
            estado        : entity.props.estado,
            sellado       : entity.props.sellado,
            documentos_id : entity.props.documentosId,
            fid_area      : entity.props.areaId,
            fid_personal  : entity.props.personalId,
        };
    }
}
