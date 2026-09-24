import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { CitesEntity } from "../../CitesEntity";
import { ICitesRepository } from "../ICitesRepository";
import { Result } from "../../../../../../base/types/Result";
import { CitesSQLModelData } from "./CitesSQLModel";

export class CitesRepositorySQL extends BaseSQLRepository<CitesEntity, CitesSQLModelData> implements ICitesRepository {
    fromSQLModelData(data: CitesSQLModelData, id: string): Result<CitesEntity> {
        return CitesEntity.create(
            {
                
                /*tabla apertura apertura*/
                fechaRegistro           : data.fecha_registro,             
                nombreUsuario           : data.nombre_usuario,  
                nombreAreaSolicitante   : data.area_solicitante,
                nombreAreaDestino       : data.area_destino,                   
                citeCompleto            : data.cite_completo,
                referencia              : data.referencia,
                tipoDocumento           : data.tipo_documento,
                dias                    : data.dias,
                gestion                 : data.gestion,
                actividad               : data.actividad,
                nombreProceso           : data.nombre_proceso,
                cuce                    : data.cuce, //
                empresaAdjudicada       : data.empresa_adjudicada, 
                observacion             : data.observacion,  /*fecha de la gestión*/ 
                hojaRuta                : data.hoja_ruta,
                fechaCierre             : data.fecha_cierre,
                estado                  : data.estado,
                estadoActivo            : data.estado_activo,
                numeroPaginas           : data.numero_paginas,
                usuarioId               : data.fid_usuario,     
                tipoCiteId              : data.fid_tipo_cite,
                
            },
            id,
        );
    }
    toSQLModelData(entity: CitesEntity): CitesSQLModelData {
        return {
          
            /**Tabla original apertura*/
            fecha_registro                 : entity.props.fechaRegistro,
            nombre_usuario                 : entity.props.nombreUsuario,        
            area_solicitante               : entity.props.nombreAreaSolicitante,
            area_destino                   : entity.props.nombreAreaDestino,                     
            cite_completo                  : entity.props.citeCompleto,
            referencia                     : entity.props.referencia,
            tipo_documento                 : entity.props.tipoDocumento,
            dias                           : entity.props.dias,
            gestion                        : entity.props.gestion,
            actividad                      : entity.props.actividad,
            nombre_proceso                 : entity.props.nombreProceso,
            cuce                           : entity.props.cuce, //
            empresa_adjudicada             : entity.props.empresaAdjudicada,
            observacion                    : entity.props.observacion,  /*fecha de la gestión*/
            hoja_ruta                      : entity.props.hojaRuta,
            fecha_cierre                   : entity.props.fechaCierre,
            estado                         : entity.props.estado,
            estado_activo                  : entity.props.estadoActivo,
            numero_paginas                 : entity.props.numeroPaginas,
            fid_usuario                    : entity.props.usuarioId,     
            fid_tipo_cite                  : entity.props.tipoCiteId,
            
        };
    }
}
