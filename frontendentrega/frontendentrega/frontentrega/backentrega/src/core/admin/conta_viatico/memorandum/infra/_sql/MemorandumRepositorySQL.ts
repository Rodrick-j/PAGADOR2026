import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { MemorandumEntity } from "../../MemorandumEntity";
import { IMemorandumRepository } from "../IMemorandumRepository";
import { Result } from "../../../../../../base/types/Result";
import { MemorandumSQLModelData } from "./MemorandumSQLModel";

export class MemorandumRepositorySQL extends BaseSQLRepository<MemorandumEntity, MemorandumSQLModelData> implements IMemorandumRepository {
    fromSQLModelData(data: MemorandumSQLModelData, id: string): Result<MemorandumEntity> {
        return MemorandumEntity.create(
            {
                codDepartMemo        : data.cod_depart_memo,
                autorizadoPor        : data.autorizado_por,
            //    cargoJefeUnidad      : data.cargo_jefe_unidad,
                fechaMemoRegistro    : data.fecha_memo_registro,
                tipoComisionIDP      : data.tipo_comision_idp,
                fechaInicioViaje     : data.fecha_inicio_viaje,
                fechaFinViaje        : data.fecha_fin_viaje,
                cantidadDias         : data.cantidad_dias,
                tipoMemoRepo         : data.tipo_memo_repo,
                tipoTransporte       : data.tipo_transporte,
                observacion          : data.observacion,
                estadoMemorandum     : data.estado_memorandum,
                notificacionMemo     : data.notificacion_memo,
                diasHabiles          : data.dias_habiles,
                aperturaViaticoId    : data.fid_apertura_viatico,
                aperturaPasajeId     : data.fid_apertura_pasaje,
                usuarioId            : data.fid_usuario,

                modificacion         : data.modificacion,
                obsModificacion     :  data.obs_modificacion,
                fechaCambio          : data.fecha_cambio,
                estadoModificacion   : data.estado_modificacion,    
                justificacion        : data.justificacion,   
                aprobacionRRHHconta  : data.aprobacion_rrhh_conta,
                tiempoAprobacionUsuario : data.tiempo_aprobacion_usuario,         
            },
            id,
        );
    }
    toSQLModelData(entity: MemorandumEntity): MemorandumSQLModelData {
        return {
            cod_depart_memo        : entity.props.codDepartMemo,
            autorizado_por         : entity.props.autorizadoPor,
           // cargo_jefe_unidad      : entity.props.cargoJefeUnidad,
            fecha_memo_registro    : entity.props.fechaMemoRegistro,
            tipo_comision_idp      : entity.props.tipoComisionIDP,
            fecha_inicio_viaje     : entity.props.fechaInicioViaje,
            fecha_fin_viaje        : entity.props.fechaFinViaje,
            cantidad_dias          : entity.props.cantidadDias,
            tipo_memo_repo         : entity.props.tipoMemoRepo,
            tipo_transporte        : entity.props.tipoTransporte,
            observacion            : entity.props.observacion,
            estado_memorandum      : entity.props.estadoMemorandum,
            notificacion_memo      : entity.props.notificacionMemo,
            dias_habiles           : entity.props.diasHabiles,
            fid_apertura_viatico   : entity.props.aperturaViaticoId,
            fid_apertura_pasaje    : entity.props.aperturaPasajeId,
            fid_usuario            : entity.props.usuarioId,
            
            modificacion           : entity.props.modificacion,
            obs_modificacion       : entity.props.obsModificacion,
            fecha_cambio           : entity.props.fechaCambio,
            estado_modificacion    : entity.props.estadoModificacion,
            justificacion          : entity.props.justificacion, 
            aprobacion_rrhh_conta  : entity.props.aprobacionRRHHconta,
            tiempo_aprobacion_usuario : entity.props.tiempoAprobacionUsuario,
        };
    }
}
