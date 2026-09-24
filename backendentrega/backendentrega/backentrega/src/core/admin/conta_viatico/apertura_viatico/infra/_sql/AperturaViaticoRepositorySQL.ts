import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { AperturaViaticoEntity } from "../../AperturaViaticoEntity";
import { IAperturaViaticoRepository } from "../IAperturaViaticoRepository";
import { Result } from "../../../../../../base/types/Result";
import { AperturaViaticoSQLModelData } from "./AperturaViaticoSQLModel";

export class AperturaViaticoRepositorySQL extends BaseSQLRepository<AperturaViaticoEntity, AperturaViaticoSQLModelData> implements IAperturaViaticoRepository {
    fromSQLModelData(data: AperturaViaticoSQLModelData, id: string): Result<AperturaViaticoEntity> {
        return AperturaViaticoEntity.create(
            {
                
                /*tabla apertura viatico*/
                aperturaProgramatica          : data.apertura_programatica,
                codFte                        : data.cod_fte,
                codOrg                        : data.cod_org,
                objeto                        : data.objeto,
                descripcionObjetoGasto        : data.descripcion_objeto_gasto,  
                presupuestoInicial            : data.presupuesto_inicial,
                presupuestoRestante           : data.presupuesto_restante,
                estado                        : data.estado,
                sisin                         : data.sisin,
                gestion                       : data.gestion,  /*fecha de la gestión*/
                areaId                        : data.fid_area,   
                aperturaGeneralId             : data.fid_apertura_general,
                estadoActivo                  : data.estado_activo,
                
            },
            id,
        );
    }
    toSQLModelData(entity: AperturaViaticoEntity): AperturaViaticoSQLModelData {
        return {
          
            /**Tabla original apertura viatico*/
            apertura_programatica          : entity.props.aperturaProgramatica,
            cod_fte                        : entity.props.codFte,
            cod_org                        : entity.props.codOrg,
            objeto                         : entity.props.objeto,
            descripcion_objeto_gasto       : entity.props.descripcionObjetoGasto,          
            presupuesto_inicial            : entity.props.presupuestoInicial,
            presupuesto_restante           : entity.props.presupuestoRestante,
            estado                         : entity.props.estado,
            sisin                          : entity.props.sisin,
            gestion                        : entity.props.gestion,  /*fecha de la gestión*/
            fid_area                       : entity.props.areaId,
            fid_apertura_general           : entity.props.aperturaGeneralId,     
            estado_activo                  : entity.props.estadoActivo,
        };
    }
}
