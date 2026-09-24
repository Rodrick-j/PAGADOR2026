import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { EscalaDestinoEntity } from "../../EscalaDestinoEntity";
import { IEscalaDestinoRepository } from "../IEscalaDestinoRepository";
import { Result } from "../../../../../../base/types/Result";
import { EscalaDestinoSQLModelData } from "./EscalaDestinoSQLModel";

export class EscalaDestinoRepositorySQL extends BaseSQLRepository<EscalaDestinoEntity, EscalaDestinoSQLModelData> implements IEscalaDestinoRepository {
    fromSQLModelData(data: EscalaDestinoSQLModelData, id: string): Result<EscalaDestinoEntity> {
        return EscalaDestinoEntity.create(
            {

                tipoPCP              : data.tipo_pcp,  
                escalaExterior       : data.escala_exterior,
                destino              : data.destino,     
                provincia            : data.provincia,
                modalidad            : data.modalidad,
                pasajeMinimo         : data.pasaje_minimo,
                pasajeMaximo         : data.pasaje_maximo,
                        
            },
            id,
        );
    }
    toSQLModelData(entity: EscalaDestinoEntity): EscalaDestinoSQLModelData {
        return {

            tipo_pcp             :  entity.props.tipoPCP,
            escala_exterior      : entity.props.escalaExterior,
            destino              : entity.props.destino,
            provincia            : entity.props.provincia,
            modalidad            : entity.props.modalidad,
            pasaje_minimo        : entity.props.pasajeMinimo,
            pasaje_maximo        : entity.props.pasajeMaximo,
            
                      
              };
    }
}
