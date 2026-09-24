import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../../base/types/Result";
import BitacoraView from "..";
import { BitacoraFormDataResponse, BitacoraTableResponse } from "../BitacoraView";

export class BitacoraViewController extends BaseHttpController {
    public async getBitacoraTable(req: Request, res: Response): Promise<Response<any>> {
        const result: Result<BitacoraTableResponse> = await BitacoraView.getBitacoraTable(req.query);
        if (result.isFailure) return this.fail(res, "Falló al obtener la tabla de bitácora");
        return this.ok<BitacoraTableResponse>(res, result.getValue());
    }

    public async getBitacoraFormData(req: Request, res: Response): Promise<any> {
        const formData = await BitacoraView.getBitacoraFormDataView(req.params.bitacora_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<BitacoraFormDataResponse>(res, formData.getValue());
    }
}
