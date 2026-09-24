import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { ProcesoEntity } from "../../ProcesoEntity";
import { IProcesoRepository } from "../IProcesoRepository";
import { Result } from "../../../../../../base/types/Result";
import { ProcesoSQLModelData } from "./ProcesoSQLModel";

export class ProcesoRepositorySQL extends BaseSQLRepository<ProcesoEntity, ProcesoSQLModelData> implements IProcesoRepository {
    fromSQLModelData(data: ProcesoSQLModelData, id: string): Result<ProcesoEntity> {
        return ProcesoEntity.create(
            {
                objetoContratacion   : data.objeto_contratacion,
                modalidadDescripcion : data.modalidad_descripcion,
                modalidadSigla       : data.modalidad_sigla,
                codigoInternoEntidad : data.codigo_interno_entidad,
                cuce                 : data.cuce,
                fechaRegistro        : data.fecha_registro,
                gestion              : data.gestion,
                hojaRuta             : data.hoja_ruta,
                estado               : data.estado,
                paso                 : data.paso,
                usuarioId            : data.fid_usuario,
                usuarioSolicitanteId : data.fid_usuario_solicitante,
                usuarioSolicitante2Id: data.fid_usuario_solicitante2,
                usuarioSolicitante3Id: data.fid_usuario_solicitante3,
                estadoActivo         : data.estado_activo,
                areaId               : data.fid_area,
            },
            id,
        );
    }
    toSQLModelData(entity: ProcesoEntity): ProcesoSQLModelData {
        return {
            objeto_contratacion     : entity.props.objetoContratacion,
            modalidad_descripcion   : entity.props.modalidadDescripcion,
            modalidad_sigla         : entity.props.modalidadSigla,
            codigo_interno_entidad  : entity.props.codigoInternoEntidad,
            cuce                    : entity.props.cuce,
            fecha_registro          : entity.props.fechaRegistro,
            gestion                 : entity.props.gestion,
            hoja_ruta               : entity.props.hojaRuta,
            estado                  : entity.props.estado,
            paso                    : entity.props.paso || null,
            fid_usuario             : entity.props.usuarioId,
            fid_usuario_solicitante : entity.props.usuarioSolicitanteId,
            fid_usuario_solicitante2: entity.props.usuarioSolicitante2Id,
            fid_usuario_solicitante3: entity.props.usuarioSolicitante3Id,
            estado_activo           : entity.props.estadoActivo,            
            fid_area                : entity.props.areaId,
        };
    }
}
