import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../../base/types/Result";
import GeneralView from "..";
import { GeneralFormDataResponse } from "../GeneralView";
import GeneralService from "../../../../../core/admin/contra/general";
import { GeneralProps } from "../../../../../core/admin/contra/general/GeneralEntity";

export class GeneralViewController extends BaseHttpController {
    public async getGeneralsTable(req: Request, res: Response): Promise<Response<any>> {
        const general = await GeneralView.getGeneralsTable(req.query);
        if (general.isFailure) return this.fail(res, "Falló al obtener la tabla de general");
        return this.ok<any>(res, general.getValue());
    }

    public async getGeneralFormData(req: Request, res: Response): Promise<any> {
        const formData = await GeneralView.getGeneralFormDataView(req.params.general_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<GeneralFormDataResponse>(res, formData.getValue());
    }    

    public async createOrUpdateGeneral(req: Request, res: Response): Promise<any> {
        const data = req.body;
     
        const ID_GENERAL = data.id;
        const props: GeneralProps = {
            nombre   : data.nombre,
            tiempo   : data.tiempo,
            tipo     : data.tipo,
            paso     : data.paso,
            usuarioId: data.usuario_id,
        };
        let result = null;
        if (ID_GENERAL) {
            result = await GeneralService.update(ID_GENERAL, props);
            if (result.isFailure) return this.fail(res, String(result.error));
            return this.ok(res, result);
        }
        result = await GeneralService.create(props);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async destroyGeneral(req: Request, res: Response): Promise<any> {
        const ID_ROLE = req.params.general_id;
        const generalR = await GeneralService.getById(ID_ROLE);
        if (generalR.isFailure) return this.fail(res, String(generalR.error));

        const result = await GeneralService.delete(ID_ROLE);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }
}
