import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../../base/types/Result";
import InformeGeneralView from "..";
import { InformeGeneralFormDataResponse } from "../InformeGeneralView";
import  InformeGeneralService  from "../../../../../core/admin/conta_viatico/informe_general";
import { InformeGeneralProps } from "../../../../../core/admin/conta_viatico/informe_general/InformeGeneralEntity";

export class InformeGeneralViewController extends BaseHttpController {
    public async getInformeGeneralsTable(req: Request, res: Response): Promise<Response<any>> {
        const informeGeneral = await InformeGeneralView.getInformeGeneralsTable(req.query);
        if (informeGeneral.isFailure) return this.fail(res, "Falló al obtener la tabla de InformeGeneral");
        return this.ok<any>(res, informeGeneral.getValue());
    }

    public async getInformeGeneralFormData(req: Request, res: Response): Promise<any> {
        const formData = await InformeGeneralView.getInformeGeneralFormDataView(req.params.informe_general_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<InformeGeneralFormDataResponse>(res, formData.getValue());
    }    

    public async createOrUpdateInformeGeneral(req: Request, res: Response): Promise<any> {
        const data = req.body;
     
        const ID_INFORME_GENERAL = data.id;
        const props: InformeGeneralProps = {
                reciboPagoViatico     : data.recibo_pago_viatico,
                memorandum            : data.memorandum,
                informeComision       : data.informe_comision,
                facturasViaje         : data.facturas_viaje,
                actaVisitaReunion     : data.acta_visita_reunion,
                reporteFotografico    : data.reporte_fotografico,
                certificadoAsistencia : data.certificado_asistencia,
                boletaDeposito        : data.boleta_deposito,
                descargoId            : data.fid_descargo,
        };
        let result = null;
        if (ID_INFORME_GENERAL) {
            result = await InformeGeneralService.update(ID_INFORME_GENERAL, props);
            if (result.isFailure) return this.fail(res, String(result.error));
            return this.ok(res, result);
        }
        result = await InformeGeneralService.create(props);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async destroyInformeGeneral(req: Request, res: Response): Promise<any> {
        const ID_INF_GEN = req.params.informe_general_id;
        const informeGeneralR = await InformeGeneralService.getById(ID_INF_GEN);
        if (informeGeneralR.isFailure) return this.fail(res, String(informeGeneralR.error));

        const result = await InformeGeneralService.delete(ID_INF_GEN);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }
}
