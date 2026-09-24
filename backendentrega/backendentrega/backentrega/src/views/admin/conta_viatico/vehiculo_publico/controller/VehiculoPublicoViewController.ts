import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../../base/types/Result";
import VehiculoPublicoView from "..";
import { VehiculoPublicoFormDataResponse } from "../VehiculoPublicoView";
import  VehiculoPublicoService  from "../../../../../core/admin/conta_viatico/vehiculo_publico";
import { VehiculoPublicoProps } from "../../../../../core/admin/conta_viatico/vehiculo_publico/VehiculoPublicoEntity";

export class VehiculoPublicoViewController extends BaseHttpController {
    public async getVehiculoPublicosTable(req: Request, res: Response): Promise<Response<any>> {
        const vehiculoPublico = await VehiculoPublicoView.getVehiculoPublicosTable(req.query);
        if (vehiculoPublico.isFailure) return this.fail(res, "Falló al obtener la tabla de VehiculoPublico");
        return this.ok<any>(res, vehiculoPublico.getValue());
    }

    public async getVehiculoPublicoFormData(req: Request, res: Response): Promise<any> {
        const formData = await VehiculoPublicoView.getVehiculoPublicoFormDataView(req.params.vehiculo_publico_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<VehiculoPublicoFormDataResponse>(res, formData.getValue());
    }    

    public async createOrUpdateVehiculoPublico(req: Request, res: Response): Promise<any> {
        const data = req.body;
     
        const ID_VEHICULO_PUBLICO= data.id;
        const props: VehiculoPublicoProps = {
            razonSocial          : data.razon_social,
            numBoleto            : data.num_boleto,
            placa                : data.placa,
            tipoVehiculo         : data.tipo_vehiculo,
            precioBoleto         : data.precio_boleto,
        };
        let result = null;
        if (ID_VEHICULO_PUBLICO) {
            result = await VehiculoPublicoService.update(ID_VEHICULO_PUBLICO, props);
            if (result.isFailure) return this.fail(res, String(result.error));
            return this.ok(res, result);
        }
        result = await VehiculoPublicoService.create(props);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async destroyVehiculoPublico(req: Request, res: Response): Promise<any> {
        const ID_VEHI_PUBLI = req.params.vehiculo_publico_id;
        const vehiculoPublicoR = await VehiculoPublicoService.getById(ID_VEHI_PUBLI);
        if (vehiculoPublicoR.isFailure) return this.fail(res, String(vehiculoPublicoR.error));

        const result = await VehiculoPublicoService.delete(ID_VEHI_PUBLI);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }
}
