import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../../base/types/Result";
import ObjetoGastoView from "..";
import { ObjetoGastoFormDataResponse } from "../ObjetoGastoView";
import { ObjetoGastoProps } from "../../../../../core/admin/apertura/objeto_gasto/ObjetoGastoEntity";
import ObjetoGastoService  from "../../../../../core/admin/apertura/objeto_gasto";

export class ObjetoGastoViewController extends BaseHttpController {
    public async getObjetoGastosTable(req: Request, res: Response): Promise<Response<any>> {
        const objetoGasto = await ObjetoGastoView.getObjetoGastosTable(req.query);
        if (objetoGasto.isFailure) return this.fail(res, "Falló al obtener la tabla de ObjetoGasto");
        return this.ok<any>(res, objetoGasto.getValue());
    }

    public async getObjetoGastoFormData(req: Request, res: Response): Promise<any> {
        const formData = await ObjetoGastoView.getObjetoGastoFormDataView(req.params.objeto_gasto_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<ObjetoGastoFormDataResponse>(res, formData.getValue());
    }    
    
    public async getObjetoGastoApiData(req: Request, res: Response): Promise<any> {
        const formData = await ObjetoGastoView.getObjetoGastoDataView(req.params.objeto_gasto_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<ObjetoGastoFormDataResponse>(res, formData.getValue());
    }    

    public async createOrUpdateObjetoGasto(req: Request, res: Response): Promise<any> {
        const data = req.body;     
        const ID_OBJETO_GASTO = data.id;
        const props: ObjetoGastoProps = {         
            
            objeto                        : data.objeto,
            descripcionObjetoGasto        : data.descripcion_objeto_gasto,              
            observacion                   : data.observacion,
            estado                        : true, // Campos adicionales
           
        };
        let result = null;
        if (ID_OBJETO_GASTO) {
            result = await ObjetoGastoService.update(ID_OBJETO_GASTO, props);
            if (result.isFailure) return this.fail(res, String(result.error));
            return this.ok(res, result);
        }
        result = await ObjetoGastoService.create(props);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async destroyObjetoGasto(req: Request, res: Response): Promise<any> {
        const ID_OBJETO_GASTO = req.params.objeto_gasto_id;
        const objetoGastoR = await ObjetoGastoService.getById(ID_OBJETO_GASTO);
        if (objetoGastoR.isFailure) return this.fail(res, String(objetoGastoR.error));

        const result = await ObjetoGastoService.delete(ID_OBJETO_GASTO);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    //aumentando nuevo metos all a Aperturas
    public async getAllObjetoGasto(req: Request, res: Response): Promise<any> {
        const result = await ObjetoGastoView.getAllObjetoGasto();
        return this.ok<any>(res, result.getValue());
    }


    public async getObjetoGastoData(req: Request, res: Response): Promise<any> {
        const codigo     = req.params.codigo;      
        const objetos = await ObjetoGastoService.getAll();		
        if (objetos.isFailure) return this.fail(res, "Documento no encontrado");
        const objetosResult = objetos.getValue()		
                                            .filter((d) => d.props.objeto===codigo)
                                            .map((dd) => dd.props.objeto);      
        
        return this.ok<any>(res, {objeto: objetosResult.length > 0});
    }

    public async getFindObjetoGastoData(req: Request, res: Response): Promise<any> {
        const ID_OBJETO_GASTO     = req.params.id;      		
        const objetos = await ObjetoGastoService.getById(ID_OBJETO_GASTO);		
        if (objetos.isFailure) return Result.fail<ObjetoGastoFormDataResponse>("Objeto Gasto no encontrado");        
        const props = objetos.getValue().props;
        
        const result: ObjetoGastoFormDataResponse = {
					
                    id                             : objetos.getValue().id,                  
                    objeto                         : props.objeto,
                    descripcion_objeto_gasto       : props.descripcionObjetoGasto,            
                    observacion                    : props.observacion, 
                    estado                         : props.estado,  // Campos adicionales                         
        };     
        
        return this.ok<any>(res, result);
		
    }

    public async changeState(req: Request, res: Response): Promise<any> {
        const objetoGastoId = req.params.objeto_gasto_id;		
        const estado = Boolean(req.body.estado);

        const result = await ObjetoGastoService.update(objetoGastoId, { estado });
        if (result.isFailure) return this.fail(res, "Falló al cambiar estado de Objeto de Gasto");
        return this.ok(res);
    }

}
