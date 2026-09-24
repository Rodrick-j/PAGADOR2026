import { Result } from "../../../../base/types/Result";
import { findAndCountResult } from "../../../../tools/util";
import  InformeGeneralService from "../../../../core/admin/conta_viatico/informe_general";

type InformeGeneralTableModel = {
    
    id                      : string;
    recibo_pago_viatico     : string;
    memorandum              : string;
    informe_comision        : string;
    facturas_viaje          : string;
    acta_visita_reunion     : string;
    reporte_fotografico     : string;
    certificado_asistencia  : string;
    boleta_deposito         : string;
    descargo_id             : string | null;  
};

export type GetInformeGeneralsTableResponse = {
    rows: InformeGeneralTableModel[];
    count: number;
};

export type InformeGeneralFormDataResponse = {
    id                      : string;
    recibo_pago_viatico     : string;
    memorandum              : string;
    informe_comision        : string;
    facturas_viaje          : string;
    acta_visita_reunion     : string;
    reporte_fotografico     : string;
    certificado_asistencia  : string;
    boleta_deposito         : string;
    descargo_id             : string | null;  
};

/*export type InformeGeneralsOptionsFormModel = {
    id: string;
    nombre: string;
    concepto: string;
};*/

export class InformeGeneralView {
    public async getInformeGeneralsTable(query: any): Promise<Result<{ rows: InformeGeneralTableModel[] }>> {
            const informeGeneral = await InformeGeneralService.getAll();
            if (informeGeneral.isFailure) return Result.fail("Falló al obtener la InformeGeneral");
            const InformeGeneralResult = informeGeneral.getValue();
                               
            const result: InformeGeneralTableModel[] = InformeGeneralResult.map((item) => {
               
                return {
                    id                      : String(item.id),
                    recibo_pago_viatico     : `${JSON.stringify(item.props.reciboPagoViatico)}`,
                    memorandum              : `${JSON.stringify(item.props.memorandum)}`,
                    informe_comision        : `${JSON.stringify(item.props.informeComision)}`,
                    facturas_viaje          : `${JSON.stringify(item.props.facturasViaje)}`,
                    acta_visita_reunion     : `${JSON.stringify(item.props.actaVisitaReunion)}`,
                    reporte_fotografico     : `${JSON.stringify(item.props.reporteFotografico)}`,
                    certificado_asistencia  : `${JSON.stringify(item.props.certificadoAsistencia)}`,
                    boleta_deposito         : `${JSON.stringify(item.props.boletaDeposito)}`,
                    descargo_id             : item.props.descargoId,
                };
            });
            
            const response = findAndCountResult(result, query);
            return Result.ok(response);
    }

    public async getInformeGeneralFormDataView(id_informe_general: string): Promise<Result<InformeGeneralFormDataResponse>> {
        const informeGeneral = await InformeGeneralService.getById(id_informe_general);
        if (informeGeneral.isFailure) return Result.fail<InformeGeneralFormDataResponse>("InformeGeneral no encontrado");
        
        const props = informeGeneral.getValue().props;

        const result: InformeGeneralFormDataResponse = {
            id                      : informeGeneral.getValue().id,
            recibo_pago_viatico     : props.reciboPagoViatico ? JSON.stringify(props.reciboPagoViatico) : '[]',
            memorandum              : props.memorandum ? JSON.stringify(props.memorandum) : '[]',
            informe_comision        : props.informeComision ? JSON.stringify(props.informeComision) : '[]',
            facturas_viaje          : props.facturasViaje ? JSON.stringify(props.facturasViaje) : '[]',
            acta_visita_reunion     : props.actaVisitaReunion ? JSON.stringify(props.actaVisitaReunion) : '[]',
            reporte_fotografico     : props.reporteFotografico ? JSON.stringify(props.reporteFotografico) : '[]',
            certificado_asistencia  : props.certificadoAsistencia ? JSON.stringify(props.certificadoAsistencia) : '[]',
            boleta_deposito         : props.boletaDeposito ? JSON.stringify(props.boletaDeposito) : '[]',
            descargo_id             : props.descargoId,
        };

        return Result.ok(result);
    }
}