import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { TipoCitesEntity } from "../../TipoCitesEntity";
import { ITipoCitesRepository } from "../ITipoCitesRepository";
import { Result } from "../../../../../../base/types/Result";
import { TipoCitesSQLModelData } from "./TipoCitesSQLModel";

export class TipoCitesRepositorySQL extends BaseSQLRepository<TipoCitesEntity, TipoCitesSQLModelData> implements ITipoCitesRepository {
    fromSQLModelData(data: TipoCitesSQLModelData, id: string): Result<TipoCitesEntity> {
        return TipoCitesEntity.create(
            {    
                tipoDocumento           : data.tipo_documento,
                nombreDocumento         : data.nombre_documento,
                siglaDocumento          : data.sigla_documento,
                estado                  : data.estado,         
            },
            id,
        );
    }
    toSQLModelData(entity: TipoCitesEntity): TipoCitesSQLModelData {
        return {
          
            /**Tabla original */
            tipo_documento               : entity.props.tipoDocumento,
            nombre_documento             : entity.props.nombreDocumento,
            sigla_documento              : entity.props.siglaDocumento,
            estado                       : entity.props.estado,                     
            
            
        };
    }
}
