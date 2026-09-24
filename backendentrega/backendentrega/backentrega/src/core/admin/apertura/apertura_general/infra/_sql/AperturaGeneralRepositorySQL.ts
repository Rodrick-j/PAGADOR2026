import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { AperturaGeneralEntity } from "../../AperturaGeneralEntity";
import { IAperturaGeneralRepository } from "../IAperturaGeneralRepository";
import { Result } from "../../../../../../base/types/Result";
import { AperturaGeneralSQLModelData } from "./AperturaGeneralSQLModel";

export class AperturaGeneralRepositorySQL extends BaseSQLRepository<AperturaGeneralEntity, AperturaGeneralSQLModelData> implements IAperturaGeneralRepository {
    fromSQLModelData(data: AperturaGeneralSQLModelData, id: string): Result<AperturaGeneralEntity> {
        return AperturaGeneralEntity.create(
            {
                
                /*tabla apertura apertura*/
                aperturaProgramatica          : data.apertura_programatica,
                ue                            : data.ue,
                codFte                        : data.cod_fte,
                codOrg                        : data.cod_org,                   
                presupuestoInicial            : data.presupuesto_inicial,
                presupuestoRestante           : data.presupuesto_restante,
                modAprobada                   : data.mod_aprobada,
                presupuestoVigente            : data.presupuesto_vigente,
                pagado                        : data.pagado,
                saldoEjecutar                 : data.saldo_ejecutar,
                estado                        : data.estado,
                estadoActivo                  : data.estado_activo, //
                sisin                         : data.sisin, 
                gestion                       : data.gestion,  /*fecha de la gestión*/ 
                tipoArea                      : data.tipo_area,
                objetoId                      : data.fid_objeto,
                areaId                        : data.fid_area,     
                areaHijoId                    : data.fid_area_hijo,
                
            },
            id,
        );
    }
    toSQLModelData(entity: AperturaGeneralEntity): AperturaGeneralSQLModelData {
        return {
          
            /**Tabla original apertura*/
            apertura_programatica          : entity.props.aperturaProgramatica,
            ue                             : entity.props.ue,
            cod_fte                        : entity.props.codFte,
            cod_org                        : entity.props.codOrg,                     
            presupuesto_inicial            : entity.props.presupuestoInicial,
            presupuesto_restante           : entity.props.presupuestoRestante,
            mod_aprobada                   : entity.props.modAprobada,
            presupuesto_vigente            : entity.props.presupuestoVigente,
            pagado                         : entity.props.pagado,
            saldo_ejecutar                 : entity.props.saldoEjecutar,
            estado                         : entity.props.estado,
            estado_activo                  : entity.props.estadoActivo, //
            sisin                          : entity.props.sisin,
            gestion                        : entity.props.gestion,  /*fecha de la gestión*/
            tipo_area                      :entity.props.tipoArea,
            fid_objeto                     : entity.props.objetoId,
            fid_area                       : entity.props.areaId,     
            fid_area_hijo                  : entity.props.areaHijoId,
            
        };
    }
}
