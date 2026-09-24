import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { ObjetoGastoEntity } from "../../ObjetoGastoEntity";
import { IObjetoGastoRepository } from "../IObjetoGastoRepository";
import { Result } from "../../../../../../base/types/Result";
import { ObjetoGastoSQLModelData } from "./ObjetoGastoSQLModel";

export class ObjetoGastoRepositorySQL extends BaseSQLRepository<ObjetoGastoEntity, ObjetoGastoSQLModelData> implements IObjetoGastoRepository {
    fromSQLModelData(data: ObjetoGastoSQLModelData, id: string): Result<ObjetoGastoEntity> {
        return ObjetoGastoEntity.create(
            {             
                objeto                        : data.objeto,
                descripcionObjetoGasto        : data.descripcion_objeto_gasto,            
                observacion                   : data.observacion,  /*fecha de la gestión*/
                estado                         : data.estado,  /*estado del objeto gasto*/
                
            },
            id,
        );
    }
    toSQLModelData(entity: ObjetoGastoEntity): ObjetoGastoSQLModelData {
        return {
          
            /**Tabla original apertura viatico*/
            objeto                         : entity.props.objeto,
            descripcion_objeto_gasto       : entity.props.descripcionObjetoGasto,            
            observacion                    : entity.props.observacion,  /*fecha de la gestión*/  
            estado                         : entity.props.estado,  /*estado del objeto gasto*/       
        };
    }
}
