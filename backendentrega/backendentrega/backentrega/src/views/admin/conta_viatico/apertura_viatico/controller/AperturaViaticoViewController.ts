import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../../base/types/Result";
import AperturaViaticoView from "..";
import { AperturaViaticoFormDataResponse } from "../AperturaViaticoView";
import  AperturaViaticoService  from "../../../../../core/admin/conta_viatico/apertura_viatico";
import { AperturaViaticoProps } from "../../../../../core/admin/conta_viatico/apertura_viatico/AperturaViaticoEntity";
import  AperturaGeneralService  from "../../../../../core/admin/apertura/apertura_general";

export class AperturaViaticoViewController extends BaseHttpController {
    public async getAperturaViaticosTable(req: Request, res: Response): Promise<Response<any>> {
        const aperturaViatico = await AperturaViaticoView.getAperturaViaticosTable(req.query);
        if (aperturaViatico.isFailure) return this.fail(res, "Falló al obtener la tabla de AperturaViatico");
        return this.ok<any>(res, aperturaViatico.getValue());
    }

    public async getAperturaViaticoFormData(req: Request, res: Response): Promise<any> {
        const formData = await AperturaViaticoView.getAperturaViaticoFormDataView(req.params.apertura_viatico_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<AperturaViaticoFormDataResponse>(res, formData.getValue());
    }    

    public async createOrUpdateAperturaViatico(req: Request, res: Response): Promise<any> {
        const data = req.body;
     
        const ID_APERTURA_VIATICO = data.id;
        const props: AperturaViaticoProps = {
           
            aperturaProgramatica          : data.apertura_programatica,
            codFte                        : data.cod_fte,
            codOrg                        : data.cod_org,
            objeto                        : data.objeto,
            descripcionObjetoGasto        : data.descripcion_objeto_gasto,           
            presupuestoInicial            : data.presupuesto_inicial,
            presupuestoRestante           : data.presupuesto_restante,
            estado                        : data.estado,
            sisin                         : data.sisin,
            gestion                       : new Date(),
            areaId                        : data.area_id, 
            aperturaGeneralId             : data.apertura_general_id,
            estadoActivo                  : data.estado_activo,
           
        };
        let result = null;
        if (ID_APERTURA_VIATICO) {
            result = await AperturaViaticoService.update(ID_APERTURA_VIATICO, props);
            if (result.isFailure) return this.fail(res, String(result.error));
            return this.ok(res, result);
        }
        result = await AperturaViaticoService.create(props);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async changeState(req: Request, res: Response): Promise<any> {
        const aperturaId = req.params.apertura_viatico_id;			
        const estadoActivo = Boolean(req.body.estado_activo);		
		
        const result = await AperturaViaticoService.update(aperturaId, { estadoActivo });
        if (result.isFailure) return this.fail(res, "Falló al cambiar estado de la Apertura Viatico");

         const aperturaViatico = await AperturaViaticoService.getAll();
       if(aperturaViatico.isFailure) return Result.fail("Fallo al obtener el aperturaViatico");
       const aperturaViaticoResult = aperturaViatico.getValue();

        const idAperturaGeneral = aperturaViaticoResult.find((c)=> c.id === aperturaId)?.props.aperturaGeneralId|| "-";		
		const resultGeneral = await AperturaGeneralService.update(idAperturaGeneral, { estadoActivo });		
		
        if (resultGeneral.isFailure) return this.fail(res, "Falló al cambiar estado de la Apertura General");

        return this.ok(res);
    }

    public async destroyAperturaViatico(req: Request, res: Response): Promise<any> {
        const ID_APERTURA = req.params.apertura_viatico_id;
        const aperturaViaticoR = await AperturaViaticoService.getById(ID_APERTURA);
        if (aperturaViaticoR.isFailure) return this.fail(res, String(aperturaViaticoR.error));

        const result = await AperturaViaticoService.delete(ID_APERTURA);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    //aumentando nuevo metos all a Aperturas
    public async getAllAperturaViatico(req: Request, res: Response): Promise<any> {
        const result = await AperturaViaticoView.getAllAperturaViatico();
        return this.ok<any>(res, result.getValue());
    }


     //Se agrega para la busqueda de apertura
 public async getAperturaByUser(req: Request, res: Response): Promise<any> {
    const aperturaUsuario = await AperturaViaticoView.getAperturaByUser();	
    if (aperturaUsuario.isFailure) return this.fail(res, 'Falló al obtener el usuario de la Apertura');
    return this.ok<any>(res, aperturaUsuario.getValue());
  }

  public async getAperturaByUserPasaje(req: Request, res: Response): Promise<any> {
    const aperturaUsuario = await AperturaViaticoView.getAperturaByUserPasaje();	
    if (aperturaUsuario.isFailure) return this.fail(res, 'Falló al obtener el usuario de la Apertura');
    return this.ok<any>(res, aperturaUsuario.getValue());
  }
}
