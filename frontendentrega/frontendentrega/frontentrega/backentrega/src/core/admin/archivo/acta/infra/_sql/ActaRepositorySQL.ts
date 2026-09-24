import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { ActaEntity } from "../../ActaEntity";
import { IActaRepository } from "../IActaRepository";
import { Result } from "../../../../../../base/types/Result";
import { ActaSQLModelData } from "./ActaSQLModel";

export class ActaRepositorySQL extends BaseSQLRepository<ActaEntity, ActaSQLModelData> implements IActaRepository {
    fromSQLModelData(data: ActaSQLModelData, id: string): Result<ActaEntity> {
        return ActaEntity.create(
            {
                codActa           : data.cod_acta,
                fechaRegistro     : data.fecha_registro,
                fechaDevolucion   : data.fecha_devolucion,
                dias              : data.dias,
                tipo              : data.tipo,
                descripcion       : data.descripcion,
                estado            : data.estado,
                externo           : data.externo,
                descripcionExterno: data.descripcion_externo,
                documentosId      : data.documentos_id,
                adjuntos          : data.adjuntos,
                areaId            : data.fid_area,
                personalId        : data.fid_personal,
            },
            id,
        );
    }
    toSQLModelData(entity: ActaEntity): ActaSQLModelData {
        return {
            fecha_registro     : entity.props.fechaRegistro,
            fecha_devolucion   : entity.props.fechaDevolucion || null,
            dias               : entity.props.dias,
            cod_acta           : entity.props.codActa,
            tipo               : entity.props.tipo,
            descripcion        : entity.props.descripcion,
            estado             : entity.props.estado,
            externo            : entity.props.externo,
            descripcion_externo: entity.props.descripcionExterno,
            documentos_id      : entity.props.documentosId,
            adjuntos           : entity.props.adjuntos,
            fid_area           : entity.props.areaId,
            fid_personal       : entity.props.personalId,
        };
    }
    protected listAttributes() { 
        return [ "id", "cod_acta", "fecha_registro", "fecha_devolucion", "dias", "tipo", "descripcion", "estado", "externo", "descripcion_externo", "documentos_id", "adjuntos", "fid_area", "fid_personal" ]; 
    }
}
