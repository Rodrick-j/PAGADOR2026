import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../../base/types/Result";
import DestinoView from "..";
import { DestinoFormDataResponse, GetDestinosTableResponse } from "../DestinoView";
import DestinoService from "../../../../../core/admin/bsss/destino";
import { DestinoProps } from "../../../../../core/admin/bsss/destino/DestinoEntity";

export class DestinoViewController extends BaseHttpController {
    public async getDestinosTable(req: Request, res: Response): Promise<Response<any>> {
        const data = await DestinoView.getDestinosTable(req.query);
        if (data.isFailure) {
            return this.fail(res, data.error as string);
        }
        return this.ok<GetDestinosTableResponse>(res, data.getValue());
    }

    public async getDestinoFormData(req: Request, res: Response): Promise<any> {
        const formData = await DestinoView.getDestinoFormDataView(req.params.destino_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<DestinoFormDataResponse>(res, formData.getValue());
    }

    public async getAllDestinos(req: Request, res: Response): Promise<any> {
        const result = await DestinoView.getAllDestinos();
        return this.ok<any>(res, result.getValue());
    }

    public async createOrUpdateDestino(req: Request, res: Response): Promise<any> {
        const data = req.body;
     
        const ID_cuenta = data.id;
        const props: DestinoProps = {
            nombre   : data.nombre,
            distancia: data.distancia,
            litros   : data.litros,
            estado   : true,
        };
        let result = null;
        if (ID_cuenta) {
            result = await DestinoService.update(ID_cuenta, props);
            if (result.isFailure) return this.fail(res, String(result.error));
            return this.ok(res, result);
        }
        result = await DestinoService.create(props);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async destroyDestino(req: Request, res: Response): Promise<any> {
        const ID_ROLE = req.params.destino_id;
        const destinoR = await DestinoService.getById(ID_ROLE);
        if (destinoR.isFailure) return this.fail(res, String(destinoR.error));

        const result = await DestinoService.delete(ID_ROLE);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

}
