import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../../base/types/Result";
import RutaView from "..";
import { GetRutaFormDataResponse, GetRutasTableResponse } from "../RutaView";
import RutaService from "../../../../../core/system/autenticacion/ruta";
import { RutaProps } from "../../../../../core/system/autenticacion/ruta/RutaEntity";

export class RutaViewController extends BaseHttpController {
    public async getRutasTable(req: Request, res: Response): Promise<Response<any>> {
        const data = await RutaView.getRutasTable(req.query);
        if (data.isFailure) {
            return this.fail(res, data.error as string);
        }
        return this.ok<GetRutasTableResponse>(res, data.getValue());
    }

    public async getRutaFormData(req: Request, res: Response): Promise<any> {
        const formData = await RutaView.getRutaFormDataView(req.params.ruta_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<GetRutaFormDataResponse>(res, formData.getValue());
    }

    public async getAllRutas(req: Request, res: Response): Promise<any> {
        const result = await RutaView.getAllRutas();
        return this.ok<any>(res, result.getValue());
    }
    public async createOrUpdateRuta(req: Request, res: Response): Promise<any> {
        const data = req.body;
        const ID_RUTA = data.id;
        const props: RutaProps = {
            name       : data.name,
            path       : data.path,
            title      : data.title,
            descripcion: data.descripcion,
            icon       : data.icon,
            color      : data.color,
            isClient   : data.is_client,
        };

        let result = null;
        if (ID_RUTA) {
            result = await RutaService.update(ID_RUTA, props);
            if (result.isFailure) return this.fail(res, String(result.error));
            return this.ok(res, result);
        }
        result = await RutaService.create(props);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async destroyRuta(req: Request, res: Response): Promise<any> {
        const ID_RUTA = req.params.ruta_id;
        const ruta = await RutaService.getById(ID_RUTA);
        if (ruta.isFailure) return this.fail(res, String(ruta.error));

        const result = await RutaService.delete(ID_RUTA);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }
}
