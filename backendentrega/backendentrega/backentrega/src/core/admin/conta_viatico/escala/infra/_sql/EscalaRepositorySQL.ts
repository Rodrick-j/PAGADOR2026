import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { EscalaEntity } from "../../EscalaEntity";
import { IEscalaRepository } from "../IEscalaRepository";
import { Result } from "../../../../../../base/types/Result";
import { EscalaSQLModelData } from "./EscalaSQLModel";

export class EscalaRepositorySQL extends BaseSQLRepository<EscalaEntity, EscalaSQLModelData> implements IEscalaRepository {
    fromSQLModelData(data: EscalaSQLModelData, id: string): Result<EscalaEntity> {
        return EscalaEntity.create(
            {
                categoria             : data.categoria,
                tipoComisionIdp       : data.tipo_comision_idp,  
                escala                : data.escala,
                viaticoPorDia         : data.viatico_por_dia,
                moneda                : data.moneda,
                bolivianos            : data.bolivianos,
                cargoId               : data.fid_cargo,
            },
            id,
        );
    }
    toSQLModelData(entity: EscalaEntity): EscalaSQLModelData {
        return {
             categoria             : entity.props.categoria,    
             tipo_comision_idp     : entity.props.tipoComisionIdp,        
             escala                : entity.props.escala,
             viatico_por_dia       : entity.props.viaticoPorDia,
             moneda                : entity.props.moneda,
             bolivianos            : entity.props.bolivianos,
             fid_cargo             : entity.props.cargoId,
              };
    }
}
