import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../../base/types/Result";
import HistorialAperturaView from "..";
import { GetHistorialAperturasTableResponse, GetHistorialGastoTableModel, HistorialAperturaFormDataResponse } from "../HistorialAperturaView";
import { HistorialAperturaProps } from "../../../../../core/admin/apertura/historial_apertura/HistorialAperturaEntity";

import HistorialAperturaService  from "../../../../../core/admin/apertura/historial_apertura";
import { HistorialGastoProps } from "../../../../../core/admin/apertura/historial_gasto/HistorialGastoEntity";
import  HistorialGastoService  from "../../../../../core/admin/apertura/historial_gasto";
import AperturaGeneralService from "../../../../../core/admin/apertura/apertura_general";
import { AperturaReport } from "../../../../../tools/AperturaReport";
import  AperturaViaticoService  from "../../../../../core/admin/conta_viatico/apertura_viatico";
import  ObjetoGastoService  from "../../../../../core/admin/apertura/objeto_gasto";
import { CON_PRESUPUESTO, ENUM_EGRESO, ENUM_PASAJE, ENUM_VIATICO, SIN_PRESUPUESTO } from "../../../../../base/constants/enum";

type HistorialAperturaDetalleTableModel = {     

    id                            : string; 
    titulo                        : string;
    descripcion                   : string;
    gasto                         : number;
    estado                        : string;
    debe_haber                    : string;
    apertura_id                   : string; 
};

/*type AperturaPresupuestoRestanteTableModel = {        
    presupuesto_restante          : number;
};*/

export class HistorialAperturaViewController extends BaseHttpController {
    public async getHistorialAperturasTable(req: Request, res: Response): Promise<Response<any>> {
        const aperturaGeneral = await HistorialAperturaView.getHistorialAperturasTable(req.query);
        if (aperturaGeneral.isFailure) return this.fail(res, "Falló al obtener la tabla de HistorialApertura");
        return this.ok<any>(res, aperturaGeneral.getValue());
    }

    public async getHistorialAperturaFormData(req: Request, res: Response): Promise<any> {
        const formData = await HistorialAperturaView.getHistorialAperturaFormDataView(req.params.apertura_general_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<HistorialAperturaFormDataResponse>(res, formData.getValue());
    }    

    public async createOrUpdateHistorialApertura(req: Request, res: Response): Promise<any> {
        const data = req.body;
     
        const ID_HISTORIAL_APERTURA = data.id;
        const props: HistorialAperturaProps = {
           
            titulo                        : data.titulo,
            descripcion                   : data.descripcion,
            gasto                         : data.gasto,
            debeHaber                     : data.debe_haber,  //añadido
            estado                        : data.estado,
            fecha                         : data.fecha, 
            aperturaId                    : data.fid_ap_gen,                   
            
        };
        let result = null;
        if (ID_HISTORIAL_APERTURA) {
            result = await HistorialAperturaService.update(ID_HISTORIAL_APERTURA, props);
            if (result.isFailure) return this.fail(res, String(result.error));
            return this.ok(res, result);
        }
        result = await HistorialAperturaService.create(props);
        if (result.isFailure) return Result.fail(result.error);       
                
        return this.ok<any>(res, result);
    }



    public async destroyHistorialApertura(req: Request, res: Response): Promise<any> {
        const ID_APERTURA = req.params.apertura_general_id;
        const aperturaGeneralR = await HistorialAperturaService.getById(ID_APERTURA);
        if (aperturaGeneralR.isFailure) return this.fail(res, String(aperturaGeneralR.error));

        const result = await HistorialAperturaService.delete(ID_APERTURA);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    //aumentando nuevo metos all a Aperturas
    public async getAllHistorialApertura(req: Request, res: Response): Promise<any> {
        const result = await HistorialAperturaView.getAllHistorialApertura();
        return this.ok<any>(res, result.getValue());
    }

//METODOS HISTORIL APERTURA DETALLE
    public async getTableHistorialAperturaDetalle(req: Request, res: Response): Promise<Response<any>> {    
        const data = await HistorialAperturaView.getTableHistorialAperturaDetalle(req.query);		
        if (data.isFailure) {
            return this.fail(res, data.error as string);        }
        return this.ok<GetHistorialAperturasTableResponse>(res, data.getValue());
    }

    public async createOrUpdateHistorialAperturaDetalle(req: Request, res: Response): Promise<any> {
       
        const data = req.body;
	
        const ID_HISTORIAL_APERTURA = data.id;	
        const props: HistorialAperturaProps = {        
           
            titulo     : data.titulo,
            descripcion: data.descripcion,
            gasto      : data.gasto,
            debeHaber  : data.debe_haber,
            estado     : data.estado,
            fecha      : new Date(),
            aperturaId   : data.apertura_id,
        };

        // Busqueda de apertura general
         const aperturaGeneral = await AperturaGeneralService.getById(data.apertura_id);
        if (aperturaGeneral.isFailure) return Result.fail("Falló al obtener la HistorialApertura del ID");
        const aperturaGeneralResult = aperturaGeneral.getValue();		
        const objetoGastoID = aperturaGeneralResult.props.objetoId;
    
        const objeto = await ObjetoGastoService.getById(objetoGastoID);
        if(objeto.isFailure) return Result.fail("Fallo al obtener el Objeto Gasto");
        const objetoResult = objeto.getValue();
        
        const objetoDescripcion = objetoResult.props.descripcionObjetoGasto;		
        //Fin busqueda apertura general     
        let result = null;
        if (ID_HISTORIAL_APERTURA) {
    
            result = await HistorialAperturaService.update(ID_HISTORIAL_APERTURA, props);
            if (result.isFailure) return this.fail(res, String(result.error));
            return this.ok(res, result);
        }
    
        result = await HistorialAperturaService.create(props);
        if (result.isFailure) return Result.fail(result.error);
        
        //Actualizacion de gastos 
        const dataHistorialApertura = result.getValue();
	
       if (result.isSuccess) {
       
        const ID_APERTURA = data.apertura_id;
        const ID_HISTORIAL_APERTURA2 = dataHistorialApertura.id;
	
       const historialGasto = await HistorialGastoService.getAll();
       if (historialGasto.isFailure) return Result.fail("Falló al obtener la historial de gasto");
       const historialResult = historialGasto.getValue().filter((h) => h.props.aperturaId === ID_APERTURA);
                      
       const lastElementHistorial = historialResult.reduce(      
           (elementoAnterior, elementoActual) =>
             elementoActual.props.fecha > elementoAnterior.props.fecha
               ? elementoActual
               : elementoAnterior
       );
       const saldo_anterior = lastElementHistorial?lastElementHistorial.props.saldo:0;       
       
       let debe = 0;  let haber = 0 ;   let saldo = 0;  let propsHistorialGasto: HistorialGastoProps ; let estado ="";
       if(data.debe_haber === ENUM_EGRESO){
         debe = data.gasto;
         haber = 0 ;
         saldo = Number(saldo_anterior) - Number(debe);
          propsHistorialGasto = {
			
            fecha      : new Date(),
            descripcion: data.titulo,
            debe       : data.gasto,
            haber      : Number(haber),
            saldo      : Number(saldo), 
            estado     : "",
            historialAperturaId   : ID_HISTORIAL_APERTURA2,
            aperturaId           : data.apertura_id,        
          
        };

       }else{// Caso del INGRESO
        debe = 0;
        haber = data.gasto;
        saldo = Number(saldo_anterior) + Number(haber);
          propsHistorialGasto = {           
			
            fecha      : new Date(),
            descripcion: data.titulo,
            debe       : Number(debe),
            haber      : data.gasto,
            saldo      : Number(saldo), 
            estado     : "",
            historialAperturaId   : ID_HISTORIAL_APERTURA2,
            aperturaId           : data.apertura_id,           
          
        };
       }     
       
        const resultHistorial = await HistorialGastoService.create(propsHistorialGasto);
        if (resultHistorial.isFailure) return this.fail(res, String(result.error));
       //Actualizacion de valor restante en apertura
      
       const presupuestoRestante = saldo;     
       if(objetoDescripcion.includes(ENUM_VIATICO)){
           if(presupuestoRestante < 200){//PRESUPUESTO A MODIFICAR considerado minimo
                estado = SIN_PRESUPUESTO;
           }else{
                estado = CON_PRESUPUESTO;
           } 
       }    
       if(objetoDescripcion.includes(ENUM_PASAJE)){
           if(presupuestoRestante < 100){//PRESUPUESTO A MODIFICAR considerado minimo
                estado = SIN_PRESUPUESTO;
           }else{
                estado = CON_PRESUPUESTO;
           } 
       }      
       const resultApertura = await AperturaGeneralService.update(ID_APERTURA, {presupuestoRestante, estado});    
       if (resultApertura.isFailure) return this.fail(res, String(resultApertura.error));   
      
      //Actualizando Apertura Viatico en caso de Ingreso y Egreso
         
       if(objetoDescripcion.includes(ENUM_VIATICO) || objetoDescripcion.includes(ENUM_PASAJE)){
                   
            const aperturaViatico = await AperturaViaticoService.getAll();
            if (aperturaViatico.isFailure) return Result.fail("Falló al obtener la Apertura Viatico");
            const aperturaViaticoResult = aperturaViatico.getValue();
            
            const aperturaViaticoIdV = aperturaViaticoResult.find((c)=>c.props.aperturaGeneralId ===ID_APERTURA)?.id||"";                
            const resultAperturaViatico = await AperturaViaticoService.update(aperturaViaticoIdV, {presupuestoRestante , estado});    
            if (resultAperturaViatico.isFailure) return this.fail(res, String(resultAperturaViatico.error));  
       }
    }
    
        //Creacion       
        return this.ok<any>(res, result);
    }
    
    public async getHistorialAperturaDetalleFormData(req: Request, res: Response): Promise<any> {
        const formData = await HistorialAperturaView.getHistorialAperturaDetalleFormData(req.params.historial_apertura_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<HistorialAperturaDetalleTableModel>(res, formData.getValue());
    }
    // PARA Historial Apertura Detalle
    public async destroyHistorialAperturaDetalle(req: Request, res: Response): Promise<any> {
        const ID_HISTORIAL_APERTURA = req.params.historial_apertura_id;
		const historialApeR = await HistorialAperturaService.getById(ID_HISTORIAL_APERTURA);
        if (historialApeR.isFailure) return this.fail(res, String(historialApeR.error));
		
        const result = await HistorialAperturaService.delete(ID_HISTORIAL_APERTURA);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async getTableHistorialGasto(req: Request, res: Response): Promise<Response<any>> {     
        const data = await HistorialAperturaView.getTableHistorialGasto(req.query);
        if (data.isFailure) {
            return this.fail(res, data.error as string);
        }
        return this.ok<GetHistorialGastoTableModel>(res, data.getValue());
    }

    public async destroyHistorialGasto(req: Request, res: Response): Promise<any> {
		
        const ID_HISTORIAL_GASTO = req.params.historial_gasto_id;
        
        const historialGasto = await HistorialGastoService.getById(ID_HISTORIAL_GASTO);
        if (historialGasto.isFailure) return this.fail(res, String(historialGasto.error));

        const historialGastoResult = historialGasto.getValue();
        const ID_HISTORIAL_APERTURA =historialGastoResult.props.historialAperturaId;
        const ID_APERTURA =historialGastoResult.props.aperturaId;
	
        const resultGasto = await HistorialGastoService.delete(ID_HISTORIAL_GASTO);
        if (resultGasto.isFailure) return Result.fail(resultGasto.error);

        const resultDetalle= await HistorialAperturaService.delete(ID_HISTORIAL_APERTURA);
        if (resultDetalle.isFailure) return Result.fail(resultDetalle.error);

         //Actualizacion de valor restante en apertura
         const historialGastoAll = await HistorialGastoService.getAll();
         if (historialGastoAll.isFailure) return Result.fail("Falló al obtener la historial de gasto");
         const historialResult = historialGastoAll.getValue().filter((h) => h.props.aperturaId === ID_APERTURA);        
                        
         const lastElementHistorial = historialResult.reduce(          
             (elementoAnterior, elementoActual) =>
               elementoActual.props.fecha > elementoAnterior.props.fecha
                 ? elementoActual
                 : elementoAnterior
         );

         const saldo_anterior = lastElementHistorial?lastElementHistorial.props.saldo:0;     

       const presupuestoRestante = saldo_anterior;          
       const resultApertura = await AperturaGeneralService.update(ID_APERTURA, {presupuestoRestante});    
       if (resultApertura.isFailure) return this.fail(res, String(resultApertura.error));

          // Busqueda de apertura general
         const aperturaGeneral = await AperturaGeneralService.getById(ID_APERTURA);
        if (aperturaGeneral.isFailure) return Result.fail("Falló al obtener la HistorialApertura del ID");
        const aperturaGeneralResult = aperturaGeneral.getValue();		
        const objetoGastoID = aperturaGeneralResult.props.objetoId;
         
        const objeto = await ObjetoGastoService.getById(objetoGastoID);
        if(objeto.isFailure) return Result.fail("Fallo al obtener el Objeto Gasto");
        const objetoResult = objeto.getValue();
        
        const objetoDescripcion = objetoResult.props.descripcionObjetoGasto;
        //Fin busqueda apertura general   
      
       //Actualizando Apertura Viatico
        if(objetoDescripcion.includes(ENUM_VIATICO) || objetoDescripcion.includes(ENUM_PASAJE)){
                const aperturaViatico = await AperturaViaticoService.getAll();
                if (aperturaViatico.isFailure) return Result.fail("Falló al obtener la Apertura Viatico");
                const aperturaViaticoResult = aperturaViatico.getValue();
                
                const aperturaViaticoIdV = aperturaViaticoResult.find((c)=>c.props.aperturaGeneralId ===ID_APERTURA)?.id||"";                
                const resultAperturaViatico = await AperturaViaticoService.update(aperturaViaticoIdV, {presupuestoRestante});    
                if (resultAperturaViatico.isFailure) return this.fail(res, String(resultAperturaViatico.error));  
         }
        return this.ok<any>(res, {});
    }   
   
    public async getHistorialAperturaPDFReporte(req: Request, res: Response): Promise<any> {
        const id: string = req.body.id;        		
        const aperturaResult = await HistorialAperturaView.getHistorialAperturaPDFReporte(req.authUser, id);	
        if (aperturaResult.isFailure) return this.fail(res, String(aperturaResult.error));
    
        const result = aperturaResult.getValue();
        return AperturaReport.creaPDF(result, 'apertura', res);
    }   

}
