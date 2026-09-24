import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { DocumentoEntity } from "../../DocumentoEntity";
import { IDocumentoRepository } from "../IDocumentoRepository";
import { Result } from "../../../../../../base/types/Result";
import { DocumentoSQLModelData } from "./DocumentoSQLModel";

export class DocumentoRepositorySQL extends BaseSQLRepository<DocumentoEntity, DocumentoSQLModelData> implements IDocumentoRepository {
    fromSQLModelData(data: DocumentoSQLModelData, id: string): Result<DocumentoEntity> {
        return DocumentoEntity.create(
            {
                nro        : data.nro,
                tipo       : data.tipo,
                descripcion: data.descripcion,
                docAdjunto : data.doc_adjunto,
                gestion    : data.gestion,
                fecha      : data.fecha,
                hojasRuta  : data.hojas_ruta,
                grupoGasto : data.grupo_gasto,
                estado     : data.estado,
                permiso    : data.permiso,
                ubicacion  : data.ubicacion,
                nrofolio   : data.nrofolio,
                monto      : data.monto,
                adjuntos   : data.adjuntos,
            },
            id,
        );
    }
    toSQLModelData(entity: DocumentoEntity): DocumentoSQLModelData {
        return {
            nro        : entity.props.nro,
            tipo       : entity.props.tipo,
            gestion    : entity.props.gestion,
            fecha      : entity.props.fecha,
            estado     : entity.props.estado,
            permiso    : entity.props.permiso,
            nrofolio   : entity.props.nrofolio,
            descripcion: entity.props.descripcion || '',
            doc_adjunto: entity.props.docAdjunto || '',
            hojas_ruta : entity.props.hojasRuta || '',
            grupo_gasto: entity.props.grupoGasto || '',
            ubicacion  : entity.props.ubicacion || '',
            monto      : entity.props.monto || 0,
            adjuntos   : entity.props.adjuntos
        };
    }

    protected listAttributes() { 
        return ["id","nro","tipo","fecha","gestion","estado","permiso","nrofolio","descripcion","doc_adjunto","hojas_ruta","grupo_gasto","ubicacion","monto","adjuntos"]; 
    }
}
