import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../../base/types/Result";
import AsignacionView from "..";
import { AsignacionFormDataResponse } from "../AsignacionView";
import AsignacionService from "../../../../../core/admin/bsss/asignacion";
import { AsignacionProps } from "../../../../../core/admin/bsss/asignacion/AsignacionEntity";
import { AuthUser } from "../../../../../base/types/AuthUser";
import  AperturaGeneralService  from "../../../../../core/admin/apertura/apertura_general";

export class AsignacionViewController extends BaseHttpController {
    public async getAsignacionsTable(req: Request, res: Response): Promise<Response<any>> {
        const asignacion = await AsignacionView.getAsignacionsTable(req.query);
        if (asignacion.isFailure) return this.fail(res, "Falló al obtener la tabla de asignacion");
        return this.ok<any>(res, asignacion.getValue());
    }

    public async getAsignacionFormData(req: Request, res: Response): Promise<any> {
        const formData = await AsignacionView.getAsignacionFormDataView(req.params.asignacion_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<AsignacionFormDataResponse>(res, formData.getValue());
    }

    public async getAllAsignacions(req: Request, res: Response): Promise<any> {
        const AUTH_USER: AuthUser = req.authUser;
        const result = await AsignacionView.getAllAsignacions(AUTH_USER);
        return this.ok<any>(res, result.getValue());
    }

    public async getByIdAsignacion(req: Request, res: Response): Promise<any> {
        const result = await AsignacionView.getByIdAsignacion(req.params.asignacion_id);
        if (result.isFailure) return this.fail(res, "Falló al obtener el item asignacion");
        return this.ok<any>(res, result.getValue());
    }

    public async createOrUpdateAsignacion(req: Request, res: Response): Promise<any> {
        const data = req.body;

         // Busqueda de apertura general
         const aperturaGeneral = await AperturaGeneralService.getById(data.apertura_id);
        if (aperturaGeneral.isFailure) return Result.fail("Falló al obtener la Apertura general del ID");
        const aperturaGeneralResult = aperturaGeneral.getValue();		
        const presupuestoRestante = aperturaGeneralResult.props.presupuestoInicial; 
         
        //Fin busqueda apertura general   
     
        const ID_ASIGNACION = data.id;
        const props: AsignacionProps = {
            observacion     : data.observacion,
            saldo           : ID_ASIGNACION ? data.saldo : presupuestoRestante,
            estado          : data.estado,
            contrato        : data.contrato,
            partidaGeneralId: data.apertura_id,
            usuarioId       : data.usuario_id
        };

        let result = null;
        if (ID_ASIGNACION) {
            result = await AsignacionService.update(ID_ASIGNACION, props);
            if (result.isFailure) return this.fail(res, String(result.error));
            return this.ok(res, result);
        }
        
          // Creacion asignacion de vale 
        result = await AsignacionService.create(props);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async destroyAsignacion(req: Request, res: Response): Promise<any> {
        const asignacionId = req.params.asignacion_id;
        const asignacionResult = await AsignacionService.getById(asignacionId);
        if (asignacionResult.isFailure) return this.fail(res, String(asignacionResult.error));

        const result = await AsignacionService.delete(asignacionId);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async changeState(req: Request, res: Response): Promise<any> {
        const asignacionId = req.params.asignacion_id;
        const estado = Boolean(req.body.estado);

        const result = await AsignacionService.update(asignacionId, { estado });
        if (result.isFailure) return this.fail(res, "Falló al cambiar estado");
        return this.ok(res);
    }
}
