import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import VehiculoView from "..";
import { VehiculoProps } from "../../../../../core/admin/bsss/vehiculo/VehiculoEntity";
import VehiculoService from "../../../../../core/admin/bsss/vehiculo";
import { VehiculoFormDataResponse } from "../VehiculoView";
import { AuthUser } from "../../../../../base/types/AuthUser";

export class VehiculoViewController extends BaseHttpController {
    public async getTableVehiculo(req: Request, res: Response): Promise<any> {
        const authUser: AuthUser = req.authUser;
        const vehiculos = await VehiculoView.getTableVehiculo(req.query, authUser);
        if (vehiculos.isFailure) return this.fail(res, "Falló al obtener la tabla de vehiculos");
        return this.ok<any>(res, vehiculos.getValue());
    }

    public async getAllVehiculo(req: Request, res: Response): Promise<any> {
        const authUser: AuthUser = req.authUser;
        const params = req.params.id;
        const result = await VehiculoView.getAllVehiculo(authUser, params );
        if (result.isFailure) return this.fail(res, String(result.error));
        return this.ok<any>(res, result.getValue());
    }

    public async getByIdVehiculo(req: Request, res: Response): Promise<any> {
        const result = await VehiculoView.getByIdVehiculo(req.params.vehiculo_id);
        if (result.isFailure) return this.fail(res, "No existe Vehiculo Asociado a esta Apertura, Consulte a A.T.I.");
        return this.ok<any>(res, result.getValue());
    }

    public async getVehiculoFormData(req: Request, res: Response): Promise<any> {
        const formData = await VehiculoView.getVehiculoFormDataView(req.params.vehiculo_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<VehiculoFormDataResponse>(res, formData.getValue());
    }

    public async createOrUpdateVehiculo(req: Request, res: Response): Promise<any> {
        const data = req.body;
        const props: VehiculoProps = {
            codActivo  : data.cod_activo,
            numPlaca   : data.num_placa,
            tipo       : data.tipo,
            marca      : data.marca,
            carga      : data.carga,
            observacion: data.observacion,
            estado     : data.estado,
            personalId : data.personal_id,
            areaId     : data.area_id,
        };
        const ID_VEHICULO = req.body.id;
        let result = null;

        if (ID_VEHICULO) {
            result = await VehiculoService.update(ID_VEHICULO, props);
            if (result.isFailure) return this.fail(res, "Falló al modificar la vehiculo");
            return this.ok<any>(res, result);
        }
        result = await VehiculoService.create(props, ID_VEHICULO);
        if (result.isFailure) return this.fail(res, "Falló al crear la vehiculo");
        return this.ok<any>(res, result);
    }

    public async changeState(req: Request, res: Response): Promise<any> {
        const vehiculoId = req.params.vehiculo_id;
        const estado = Boolean(req.body.activo);

        const result = await VehiculoService.update(vehiculoId, { estado });
        if (result.isFailure) return this.fail(res, "Falló al cambiar estado");
        return this.ok(res);
    }

    public async destroyVehiculo(req: Request, res: Response): Promise<any> {
        const ID_VEHICULO = req.params.vehiculo_id;
        const result = await VehiculoService.eliminaVehiculo(ID_VEHICULO);
        if (result.isFailure) return this.fail(res, "Error al eliminar el vehiculo");
        return this.ok<any>(res);
    }

    //aumentando nuevo metos all a vehiculos
    public async getAllVehiculos(req: Request, res: Response): Promise<any> {
        const result = await VehiculoView.getAllVehiculos();
        return this.ok<any>(res, result.getValue());
    }
   
}
