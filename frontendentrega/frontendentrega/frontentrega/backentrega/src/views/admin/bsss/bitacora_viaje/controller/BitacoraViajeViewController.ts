import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../../base/types/Result";
import BitacoraViajeView from "..";
import { BitacoraViajeFormDataResponse, GetBitacoraViajesTableResponse } from "../BitacoraViajeView";
import BitacoraViajeService from "../../../../../core/admin/bsss/bitacora_viaje";
import { BitacoraViajeProps } from "../../../../../core/admin/bsss/bitacora_viaje/BitacoraViajeEntity";
import PersonalService from "../../../../../core/rrhh/personal";
import { AuthUser } from "../../../../../base/types/AuthUser";

export class BitacoraViajeViewController extends BaseHttpController {
    public async getBitacoraViajesTable(req: Request, res: Response): Promise<Response<any>> {
        const AUTH_USER: AuthUser = req.authUser;        
        const data = await BitacoraViajeView.getBitacoraViajesTable(req.query, AUTH_USER);
        if (data.isFailure) {
            return this.fail(res, data.error as string);
        }
        return this.ok<GetBitacoraViajesTableResponse>(res, data.getValue());
    }

    public async getBitacoraViajeFormData(req: Request, res: Response): Promise<any> {
        const formData = await BitacoraViajeView.getBitacoraViajeFormDataView(req.params.bitacora_viaje_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<BitacoraViajeFormDataResponse>(res, formData.getValue());
    }

    public async getAllBitacoraViajes(req: Request, res: Response): Promise<any> {
        const result = await BitacoraViajeView.getAllBitacoraViajes();
        return this.ok<any>(res, result.getValue());
    }

    public async createOrUpdateBitacoraViaje(req: Request, res: Response): Promise<any> {
        const data = req.body;
        const usuarioId = req.authId;
        console.log("🚀 ~ BitacoraViajeViewController ~ createOrUpdateBitacoraViaje ~ usuarioId:", usuarioId)

        const personalResult = await PersonalService.getAll();
        if (personalResult.isFailure) return this.fail(res, String(personalResult.error));

        const ID_AREA = personalResult.getValue().find((p) => p.props.usuarioId === usuarioId)?.props.areaId || "";
        console.log("🚀 ~ BitacoraViajeViewController ~ createOrUpdateBitacoraViaje ~ ID_AREA:", ID_AREA)
     
        const ID_BITACORA_VIAJE = data.id;
        const props: BitacoraViajeProps = {
            semana   : data.semana, 
            areaId   : ID_AREA,
            vehiculoId: data.vehiculo_id,
            usuarioId : usuarioId,

        };
        let result = null;
        if (ID_BITACORA_VIAJE) {
            result = await BitacoraViajeService.update(ID_BITACORA_VIAJE, props);
            if (result.isFailure) return this.fail(res, String(result.error));
            return this.ok(res, result);
        }
        result = await BitacoraViajeService.create(props);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async destroyBitacoraViaje(req: Request, res: Response): Promise<any> {
        const ID_ROLE = req.params.bitacora_viaje_id;
        const BitacoraViajeR = await BitacoraViajeService.getById(ID_ROLE);
        if (BitacoraViajeR.isFailure) return this.fail(res, String(BitacoraViajeR.error));

        const result = await BitacoraViajeService.delete(ID_ROLE);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

}
