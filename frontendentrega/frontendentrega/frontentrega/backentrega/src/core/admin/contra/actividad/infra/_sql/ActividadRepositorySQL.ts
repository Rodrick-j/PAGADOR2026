import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { ActividadEntity } from "../../ActividadEntity";
import { IActividadRepository } from "../IActividadRepository";
import { Result } from "../../../../../../base/types/Result";
import { ActividadSQLModelData } from "./ActividadSQLModel";

export class ActividadRepositorySQL extends BaseSQLRepository<ActividadEntity, ActividadSQLModelData> implements IActividadRepository {
    fromSQLModelData(data: ActividadSQLModelData, id: string): Result<ActividadEntity> {
        return ActividadEntity.create(
            {
                titulo                  : data.titulo,
                descripcion             : data.descripcion,
                paso                    : data.paso,
                tiempo                  : data.tiempo,
                notificacion            : data.notificacion,
                notificacionSolicitante: data.notificacion_solicitante,
                observacion             : data.observacion,
                observacion2             : data.observacion2,
                fecha                   : data.fecha,
                fechaLimite             : data.fecha_limite,
                fechaEnvio              : data.fecha_envio || null,
                estado                  : data.estado,
                usuariosId              : data.usuarios_id,
                procesoId               : data.fid_proceso,
            },
            id,
        );
    }
    toSQLModelData(entity: ActividadEntity): ActividadSQLModelData {
        return {
            titulo                  : entity.props.titulo,
            descripcion             : entity.props.descripcion,
            paso                    : entity.props.paso,
            tiempo                  : entity.props.tiempo,
            notificacion            : entity.props.notificacion,
            notificacion_solicitante: entity.props.notificacionSolicitante,
            observacion             : entity.props.observacion,
            observacion2            : entity.props.observacion2,
            fecha                   : entity.props.fecha,
            fecha_limite            : entity.props.fechaLimite,
            fecha_envio             : entity.props.fechaEnvio || null,
            estado                  : entity.props.estado,
            usuarios_id             : entity.props.usuariosId,
            fid_proceso             : entity.props.procesoId,
        };
    }
}
