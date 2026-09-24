import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { InformeGeneralEntity } from "../../InformeGeneralEntity";
import { IInformeGeneralRepository } from "../IInformeGeneralRepository";
import { Result } from "../../../../../../base/types/Result";
import { InformeGeneralSQLModelData } from "./InformeGeneralSQLModel";

export class InformeGeneralRepositorySQL extends BaseSQLRepository<InformeGeneralEntity, InformeGeneralSQLModelData> implements IInformeGeneralRepository {
    fromSQLModelData(data: InformeGeneralSQLModelData, id: string): Result<InformeGeneralEntity> {
        return InformeGeneralEntity.create(
            {
                reciboPagoViatico     : data.recibo_pago_viatico,
                memorandum            : data.memorandum,
                informeComision       : data.informe_comision,
                facturasViaje         : data.facturas_viaje,
                actaVisitaReunion     : data.acta_visita_reunion,
                reporteFotografico    : data.reporte_fotografico,
                certificadoAsistencia : data.certificado_asistencia,
                boletaDeposito        : data.boleta_deposito,
                descargoId            : data.fid_descargo,
            },
            id,
        );
    }
    toSQLModelData(entity: InformeGeneralEntity): InformeGeneralSQLModelData {
        return {
            recibo_pago_viatico     : entity.props.reciboPagoViatico,
            memorandum              : entity.props.memorandum,
            informe_comision        : entity.props.informeComision,
            facturas_viaje          : entity.props.facturasViaje,
            acta_visita_reunion     : entity.props.actaVisitaReunion,
            reporte_fotografico     : entity.props.reporteFotografico,
            certificado_asistencia  : entity.props.certificadoAsistencia,
            boleta_deposito         : entity.props.boletaDeposito,
            fid_descargo            : entity.props.descargoId,
        };
    }
}
