import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../../base/types/Result";
import BitacoraDetalleView from "..";
import { BitacoraDetalleFormDataResponse, GetBitacoraDetallesTableResponse } from "../BitacoraDetalleView";
import BitacoraDetalleService from "../../../../../core/admin/bsss/bitacora_detalle";
import { BitacoraDetalleProps } from "../../../../../core/admin/bsss/bitacora_detalle/BitacoraDetalleEntity";

export class BitacoraDetalleViewController extends BaseHttpController {
    public async getBitacoraDetallesTable(req: Request, res: Response): Promise<Response<any>> {
        const data = await BitacoraDetalleView.getBitacoraDetallesTable(req.query);
        if (data.isFailure) {
            return this.fail(res, data.error as string);
        }
        return this.ok<GetBitacoraDetallesTableResponse>(res, data.getValue());
    }

    public async getBitacoraDetalleFormData(req: Request, res: Response): Promise<any> {
        const formData = await BitacoraDetalleView.getBitacoraDetalleFormDataView(req.params.bitacora_detalle_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<BitacoraDetalleFormDataResponse>(res, formData.getValue());
    }

    public async getAllBitacoraDetalles(req: Request, res: Response): Promise<any> {
        const result = await BitacoraDetalleView.getAllBitacoraDetalles();
        return this.ok<any>(res, result.getValue());
    }

    public async createOrUpdateBitacoraDetalle(req: Request, res: Response): Promise<any> {
        const data = req.body;
     
        const ID_cuenta = data.id;
        const props: BitacoraDetalleProps = {
            fechaSalida      : data.fecha_salida,
            fechaRetorno     : data.fecha_retorno,
            horaSalida       : data.hora_salida,
            horaRetorno      : data.hora_retorno,
            destinoSalida    : data.destino_salida,
            destinoLlegada   : data.destino_llegada,
            kmSalida         : data.km_salida,
            kmLlegada        : data.km_llegada,
            kmEstimados      : data.km_estimados,
            cantidadPersonas : data.cantidad_personas,
            estado           : data.estado,
            bitacoraViajeId  : data.fid_bitacora_viaje,
        };
        let result = null;
        if (ID_cuenta) {
            result = await BitacoraDetalleService.update(ID_cuenta, props);
            if (result.isFailure) return this.fail(res, String(result.error));
            return this.ok(res, result);
        }
        result = await BitacoraDetalleService.create(props);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async destroyBitacoraDetalle(req: Request, res: Response): Promise<any> {
        const ID_ROLE = req.params.bitacora_detalle_id;
        const bitacora_detalleR = await BitacoraDetalleService.getById(ID_ROLE);
        if (bitacora_detalleR.isFailure) return this.fail(res, String(bitacora_detalleR.error));

        const result = await BitacoraDetalleService.delete(ID_ROLE);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

}
