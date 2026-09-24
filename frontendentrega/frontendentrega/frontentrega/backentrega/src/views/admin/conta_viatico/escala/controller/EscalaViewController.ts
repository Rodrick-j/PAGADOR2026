import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../../base/types/Result";
import EscalaView from "..";
import { EscalaFormDataResponse } from "../EscalaView";
import  EscalaService  from "../../../../../core/admin/conta_viatico/escala";
import { EscalaProps } from "../../../../../core/admin/conta_viatico/escala/EscalaEntity";

export class EscalaViewController extends BaseHttpController {
    public async getEscalasTable(req: Request, res: Response): Promise<Response<any>> {
        const escala = await EscalaView.getEscalasTable(req.query);
        if (escala.isFailure) return this.fail(res, "Falló al obtener la tabla de Escala");
        return this.ok<any>(res, escala.getValue());
    }

    public async getEscalaFormData(req: Request, res: Response): Promise<any> {
        const formData = await EscalaView.getEscalaFormDataView(req.params.escala_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<EscalaFormDataResponse>(res, formData.getValue());
    }    

    public async createOrUpdateEscala(req: Request, res: Response): Promise<any> {
        const data = req.body;
     
        const ID_ESCALA = data.id;
        const props: EscalaProps = {
                categoria             : data.categoria, 
                tipoComisionIdp       : data.tipo_comision_idp,               
                escala                : data.escala,
                viaticoPorDia         : data.viatico_por_dia,
                moneda                : data.moneda,
                bolivianos            : data.bolivianos,
                cargoId               : data.cargo_id,
        };
        let result = null;
        if (ID_ESCALA) {
            result = await EscalaService.update(ID_ESCALA, props);
            if (result.isFailure) return this.fail(res, String(result.error));
            return this.ok(res, result);
        }
        result = await EscalaService.create(props);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async destroyEscala(req: Request, res: Response): Promise<any> {
        const ID_ESCALA_KEY = req.params.escala_id;
        const escalaR = await EscalaService.getById(ID_ESCALA_KEY);
        if (escalaR.isFailure) return this.fail(res, String(escalaR.error));

        const result = await EscalaService.delete(ID_ESCALA_KEY);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }


     //aumentando nuevo metos all a escalas
     public async getAllEscala(req: Request, res: Response): Promise<any> {
        const result = await EscalaView.getAllEscala();
        return this.ok<any>(res, result.getValue());
    }

    //aumentando nuevo metodos all a pasajes
    public async getEscalaCategoriaIDP(req: Request, res: Response): Promise<any> {            
        const result = await EscalaView.getEscalaCategoriaIDP(req.params.cargo,req.params.tipo_comision_idp, req.params.usuario_id);      
       return this.ok<any>(res, result.getValue());       
    }  

}
