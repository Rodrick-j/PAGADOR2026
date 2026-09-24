import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../../base/types/Result";
import EscalaDestinoView from "..";
import { EscalaDestinoFormDataResponse } from "../EscalaDestinoView";
import  EscalaDestinoService  from "../../../../../core/admin/conta_viatico/escala_destino";
import { EscalaDestinoProps } from "../../../../../core/admin/conta_viatico/escala_destino/EscalaDestinoEntity";

export class EscalaDestinoViewController extends BaseHttpController {
    public async getEscalaDestinosTable(req: Request, res: Response): Promise<Response<any>> {
        const escala_destino = await EscalaDestinoView.getEscalaDestinosTable(req.query);
        if (escala_destino.isFailure) return this.fail(res, "Falló al obtener la tabla de EscalaDestino");
        return this.ok<any>(res, escala_destino.getValue());
    }

    public async getEscalaDestinoFormData(req: Request, res: Response): Promise<any> {
        const formData = await EscalaDestinoView.getEscalaDestinoFormDataView(req.params.escala_destino_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<EscalaDestinoFormDataResponse>(res, formData.getValue());
    }    

    public async createOrUpdateEscalaDestino(req: Request, res: Response): Promise<any> {
        const data = req.body;      
     
        const ID_ESCALA_DESTINO = data.id;
       
        const props: EscalaDestinoProps = {
                tipoPCP              : data.tipo_pcp,  
                destino              : data.destino,   
                escalaExterior       : data.escala_exterior,
                provincia            : data.provincia,
                modalidad            : data.modalidad,
                pasajeMinimo         : data.pasaje_minimo,
                pasajeMaximo         : data.pasaje_maximo,
                            
        };
        
        let result = null;
        if (ID_ESCALA_DESTINO) {
            result = await EscalaDestinoService.update(ID_ESCALA_DESTINO, props);
            if (result.isFailure) return this.fail(res, String(result.error));
            return this.ok(res, result);
        }
        result = await EscalaDestinoService.create(props);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async destroyEscalaDestino(req: Request, res: Response): Promise<any> {
        const ID_ESCALA_DESTINO_KEY = req.params.escala_destino_id;
        const escala_destinoR = await EscalaDestinoService.getById(ID_ESCALA_DESTINO_KEY);
        if (escala_destinoR.isFailure) return this.fail(res, String(escala_destinoR.error));

        const result = await EscalaDestinoService.delete(ID_ESCALA_DESTINO_KEY);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    //aumentando nuevo metos all a vehiculos
    public async getAllEscalaDestino(req: Request, res: Response): Promise<any> {
        const result = await EscalaDestinoView.getAllEscalaDestino();
        return this.ok<any>(res, result.getValue());
    }

     //aumentando nuevo metos all a Paises
     public async getAllPaises(req: Request, res: Response): Promise<any> {
        const result = await EscalaDestinoView.getAllPaises();
        return this.ok<any>(res, result.getValue());
    }

     //aumentando nuevo metos all a Comunidades
     public async getAllComunidades(req: Request, res: Response): Promise<any> {
        const result = await EscalaDestinoView.getAllComunidades();
        return this.ok<any>(res, result.getValue());
    }

     //aumentando nuevo metos all a Comunidades
     public async getAllModalidades(req: Request, res: Response): Promise<any> {
        const result = await EscalaDestinoView.getAllModalidades();
        return this.ok<any>(res, result.getValue());
    }
     //aumentando nuevo metodos all a pasajes
     public async getAllPasajes(req: Request, res: Response): Promise<any> {         
        const result = await EscalaDestinoView.getAllPasajes(req.params.destino);      
       return this.ok<any>(res, result.getValue());       
    }
}
