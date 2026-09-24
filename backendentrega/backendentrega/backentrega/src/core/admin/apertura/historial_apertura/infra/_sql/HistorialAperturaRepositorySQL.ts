import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { HistorialAperturaEntity } from "../../HistorialAperturaEntity";
import { IHistorialAperturaRepository } from "../IHistorialAperturaRepository";
import { Result } from "../../../../../../base/types/Result";
import { HistorialAperturaSQLModelData } from "./HistorialAperturaSQLModel";

export class HistorialAperturaRepositorySQL extends BaseSQLRepository<HistorialAperturaEntity, HistorialAperturaSQLModelData> implements IHistorialAperturaRepository {
    fromSQLModelData(data: HistorialAperturaSQLModelData, id: string): Result<HistorialAperturaEntity> {
        return HistorialAperturaEntity.create(
            {
                
                /*tabla apertura viatico*/
                titulo                        : data.titulo,
                descripcion                   : data.descripcion,
                gasto                         : data.gasto,  
                estado                        : data.estado,
                debeHaber                    : data.debe_haber,
                fecha                         : data.fecha,                                           
                aperturaId                    : data.fid_ap_gen,               
            },
            id,
        );
    }
    toSQLModelData(entity: HistorialAperturaEntity): HistorialAperturaSQLModelData {
        return {
          
            /**Tabla original apertura viatico*/
            titulo                        : entity.props.titulo,
            descripcion                   : entity.props.descripcion,
            gasto                         : entity.props.gasto,   
            estado                        : entity.props.estado,
            debe_haber                    : entity.props.debeHaber,
            fecha                         : entity.props.fecha,                                           
            fid_ap_gen                    : entity.props.aperturaId,        
        };
    }
}
