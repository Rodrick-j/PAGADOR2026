import { BaseHttpController } from "../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import VacacionView from "..";
import { VacacionProps } from "../../../../core/rrhh/vacacion/VacacionEntity";
import VacacionService from "../../../../core/rrhh/vacacion";
import { AuthUser } from "../../../../base/types/AuthUser";
import { VacacionFormDataResponse } from "../VacacionView";

export class VacacionViewController extends BaseHttpController {
    public async getTableVacacion(req: Request, res: Response): Promise<any> {
        const AUTH_USER: AuthUser = req.authUser;
        const vacacions = await VacacionView.getTableVacacion(AUTH_USER, req.query);
        if (vacacions.isFailure) return this.fail(res, "Falló al obtener la tabla de vacacions");
        return this.ok<any>(res, vacacions.getValue());
    }

    public async getVacacionFormData(req: Request, res: Response): Promise<any> {
        const formData = await VacacionView.getVacacionFormDataView(req.params.vacacion_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<VacacionFormDataResponse>(res, formData.getValue());
    }

    public async getIdVacacionByIdUsuario(req: Request, res: Response): Promise<any> {
        const formData = await VacacionView.getIdVacacionByIdUsuario(req.params.usuario_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<VacacionFormDataResponse>(res, formData.getValue());
    }

    public async getAllVacacion(req: Request, res: Response): Promise<any> {
        const AUTH_USER: AuthUser = req.authUser;
        const result = await VacacionView.getAllVacacion(AUTH_USER);
        return this.ok<any>(res, result.getValue());
    }

    public async createOrUpdateVacacion(req: Request, res: Response): Promise<any> {
        const data = req.body;
        const authUser: AuthUser = req.authUser;
        const ID_USUARIO = authUser.uid;
        
        const props: VacacionProps = {
            fechaRegistro: data.fecha_registro,
            tipoVacacion : data.tipo_vacacion,
            fechaIni     : data.fecha_ini,
            fechaFin     : data.fecha_fin,
            estado       : data.estado,
            usuarioId    : ID_USUARIO,
            jefeId       : data.jefe_id,
            areaId       : data.area_id,
        };
        
        const ID_VACACION = req.body.id;
        let result = null;

        if (ID_VACACION) {
            result = await VacacionService.update(ID_VACACION, props);
            if (result.isFailure) return this.fail(res, "Falló al modificar la vacacion");
            return this.ok<any>(res, result);
        }
        result = await VacacionService.create(props, ID_VACACION);
        if (result.isFailure) return this.fail(res, "Falló al crear la vacacion");
        return this.ok<any>(res, result);
    }

    public async changeState(req: Request, res: Response): Promise<any> {
        const vacacionId = req.params.vacacion_id;
        const baja = Boolean(req.body.baja);

        const result = await VacacionService.update(vacacionId, { baja });
        if (result.isFailure) return this.fail(res, "Falló al cambiar estado");
        return this.ok(res);
    }

    public async destroyVacacion(req: Request, res: Response): Promise<any> {
        const ID_VACACION = req.params.vacacion_id;
        const result = await VacacionService.eliminaVacacion(ID_VACACION);
        if (result.isFailure) {
            return this.fail(res, "Error al eliminar el vacacion");
        }
        return this.ok<any>(res);
    }
}
