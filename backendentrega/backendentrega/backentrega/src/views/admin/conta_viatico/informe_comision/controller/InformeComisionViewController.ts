import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../../base/types/Result";
import InformeComisionView from "..";
import { InformeComisionFormDataResponse } from "../InformeComisionView";
import  InformeComisionService  from "../../../../../core/admin/conta_viatico/informe_comision";
import { InformeComisionProps } from "../../../../../core/admin/conta_viatico/informe_comision/InformeComisionEntity";

export class InformeComisionViewController extends BaseHttpController {
    public async getInformeComisionsTable(req: Request, res: Response): Promise<Response<any>> {
        const informeComision = await InformeComisionView.getInformeComisionsTable(req.query);
        if (informeComision.isFailure) return this.fail(res, "Falló al obtener la tabla de InformeComision");
        return this.ok<any>(res, informeComision.getValue());
    }

    public async getInformeComisionFormData(req: Request, res: Response): Promise<any> {
        const formData = await InformeComisionView.getInformeComisionFormDataView(req.params.informe_comision_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<InformeComisionFormDataResponse>(res, formData.getValue());
    }    

    public async createOrUpdateInformeComision(req: Request, res: Response): Promise<any> {
        const data = req.body;
     
        const ID_INFORME_COMISION = data.id;
        const props: InformeComisionProps = {
            ida                   :data.ida,
            retorno               :data.retorno,
            objetoViaje           :data.objeto_viaje,
            desarrollo            :data.desarrollo,
            conclusion            :data.conclusion,
            imagenUno             :data.imagen_uno,
            descripcionUno        :data.descripcion_uno,
            imagenDos             :data.imagen_dos,
            descripcionDos        :data.descripcion_dos,
            imagenTres            :data.imagen_tres,
            descripcionTres       :data.descripcion_tres,
            vehiculoId            :data.fid_vehiculo,
            vehiculoPublicoId     :data.fid_vehiculo_publico,
            memorandumId          :data.fid_memorandum,
        };
        let result = null;
        if (ID_INFORME_COMISION) {
            result = await InformeComisionService.update(ID_INFORME_COMISION, props);
            if (result.isFailure) return this.fail(res, String(result.error));
            return this.ok(res, result);
        }

        // Guardia de idempotencia: un memorandum solo puede tener un informe de comision.
        if (data.fid_memorandum) {
            const posiblesDuplicados = await InformeComisionService.getAll({ fid_memorandum: data.fid_memorandum });
            if (posiblesDuplicados.isSuccess && posiblesDuplicados.getValue().length > 0) {
                return this.fail(res, "Ya existe un informe de comision registrado para este memorandum.");
            }
        }

        result = await InformeComisionService.create(props);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async destroyInformeComision(req: Request, res: Response): Promise<any> {
        const ID_INFO_COMI = req.params.informe_comision_id;
        const informeComisionR = await InformeComisionService.getById(ID_INFO_COMI);
        if (informeComisionR.isFailure) return this.fail(res, String(informeComisionR.error));

        const result = await InformeComisionService.delete(ID_INFO_COMI);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }
}
