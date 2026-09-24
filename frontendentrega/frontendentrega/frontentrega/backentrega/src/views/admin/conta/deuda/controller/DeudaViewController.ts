import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../../base/types/Result";
import DeudaView from "..";
import { DetalleDeudaDataResponse, DeudaFormDataResponse, GetDeudasTableResponse, GetHistorialTableResponse } from "../DeudaView";
import DeudaService from "../../../../../core/admin/conta/deuda";
import { DeudaProps } from "../../../../../core/admin/conta/deuda/DeudaEntity";
import HistorialService from "../../../../../core/admin/conta/historial";
import { HistorialProps } from "../../../../../core/admin/conta/historial/HistorialEntity";
import { Report2 } from "../../../../../tools/Report2";
import  CuentaService  from "../../../../../core/admin/conta/cuenta";
import { CuentaProps } from "../../../../../core/admin/conta/cuenta/CuentaEntity";

export class DeudaViewController extends BaseHttpController {
    public async getDeudasTable(req: Request, res: Response): Promise<Response<any>> {    
        const data = await DeudaView.getDeudasTable(req.query);
		
        if (data.isFailure) {
            return this.fail(res, data.error as string);
        }
        return this.ok<GetDeudasTableResponse>(res, data.getValue());
    }
    
    public async getHistorialTable(req: Request, res: Response): Promise<Response<any>> {
        const data = await DeudaView.getHistorialTable(req.query);
        if (data.isFailure) {
            return this.fail(res, data.error as string);
        }
        return this.ok<GetHistorialTableResponse>(res, data.getValue());
    }

    public async getDeudaFormData(req: Request, res: Response): Promise<any> {
        const formData = await DeudaView.getDeudaFormDataView(req.params.deuda_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<DeudaFormDataResponse>(res, formData.getValue());
    }

    public async createOrUpdateDeuda(req: Request, res: Response): Promise<any> {
        const data = req.body;     
        const ID_DEUDA = data.id;
        
        const props: DeudaProps = {
            codActivo  : data.cod_activo,
            titulo     : data.titulo,
            descripcion: data.descripcion,
            estado     : true,
            gestionDeuda: data.gestion_deuda,
            montoDeuda : data.monto_deuda,
            cuentaId   : data.cuenta_id,
        };
        
     
        //Se actualiza la deuda
        let result = null;
        if (ID_DEUDA) {
            result = await DeudaService.update(ID_DEUDA, props);
            if (result.isFailure) return this.fail(res, String(result.error));
            this.listarDeudas(req,res);
            console.log("metodo update");
            return this.ok(res, result);
        }
        result = await DeudaService.create(props);
        if (result.isFailure) return Result.fail(result.error);
        this.listarDeudas(req,res);
        console.log("metodo create");
        return this.ok<any>(res, result);
    }

    public async listarDeudas ( req: Request, res: Response){
        const data = req.body;
         //listando deudas       
         const deuda = await DeudaService.getAll();
         if (deuda.isFailure) return Result.fail("Falló al obtener la deuda");
         const deudaResult = deuda.getValue().filter((d) => d.props.cuentaId === data.cuenta_id);
         const listaGestiones:string[]=[data.gestion_deuda]; 
         
               
         deudaResult.forEach((item) => {
             const gestion = item.props.gestionDeuda;            
             if (gestion !=  null && !listaGestiones.includes(gestion)) {                 
                 listaGestiones.push(gestion);				             
             }
         });
 
         const arrayAnhos: string[] = listaGestiones;        
         const anhosOrdenados = arrayAnhos.sort((a, b) => {					
             return Number(a) - Number(b);
         });                
         // Convertir el array en una cadena
         const detalleGestiones = anhosOrdenados.join('-');	 
         const propsCuenta: CuentaProps = {
            
             
             ci                     : data.ci,
             nombreDeudor           : data.nombre_deudor,
             tipoCuenta             : data.tipo_cuenta,
             gestionGeneracionDeuda : data.gestion_generacion_deuda,
             documentacionRespaldo  : data.documentacion_respaldo,
             direccionDomicilio     : data.direccion_domicilio,
             telefonoCelular        : data.telefono_celular,
             motivoDeuda            : data.motivo_deuda,
             confirmacion           : data.confirmacion,
             descripcionConfirmacion: data.descripcion_confirmacion,
             incrementoDeuda        : data.incremento_deuda,
             montoIncrementoDeuda   : data.monto_incremento_deuda,
             depositosRealizados    : data.depositos_realizados,
             observacion            : data.observacion,
             saldo                  : data.saldo,
             adjuntos               : data.adjuntos && JSON.parse(data.adjuntos),
             estado                 : true,
             descripcionDeuda       : data.descripcion_deuda,
             estadoProceso          : data.estado_proceso,
             detalleGestionDeuda     : detalleGestiones,
         };
         
         const resultCuenta = await CuentaService.update(data.cuenta_id, propsCuenta);		        
         if (resultCuenta.isFailure) return this.fail(res, String(resultCuenta.error));
        // this.ok(res, resultCuenta);
        
       //  return this.ok<any>(res, result);

    }

    public async destroyDeuda(req: Request, res: Response): Promise<any> {
        const data = req.body;   
        const ID_DEUDA = req.params.deuda_id;			        
        const deudaR = await DeudaService.getById(ID_DEUDA);	
        if (deudaR.isFailure) return this.fail(res, String(deudaR.error));
        const ID_CUENTA = deudaR.getValue().props.cuentaId;
		
        /* const cuenta = await CuentaService.getAll();
        if (cuenta.isFailure) return Result.fail("Falló al obtener la Cuenta");
        const cuentaResult = cuenta.getValue();
        //ELiminacion de la gestion a eliminar
        const detalleGestionDeuda = cuentaResult.find((c) => c.id=== ID_CUENTA)?.props.detalleGestionDeuda|| "-";
		
        const regex = new RegExp(`\\b${deudaR.getValue().props.gestionDeuda.concat('-')}\\b`, 'gi'); 
	
        const detalleGestion = detalleGestionDeuda!=''? 		
        (detalleGestionDeuda.includes(deudaR.getValue().props.gestionDeuda)?detalleGestionDeuda.replace(regex,'').trim().replace(/\s+/g, ' '):
        detalleGestionDeuda.concat('')):
        detalleGestionDeuda.concat('');	 */ 
        
        //Aquie viene eliminar  
        const result = await DeudaService.delete(ID_DEUDA);	
        if (result.isFailure) return Result.fail(result.error);
        // actualizamos la gestion de la deuda
        const deuda = await DeudaService.getAll();
        if (deuda.isFailure) return Result.fail("Falló al obtener la deuda");
        const deudaResult = deuda.getValue().filter((d) => d.props.cuentaId === ID_CUENTA);
		
        const cadenaAnhos :string []=[];
        deudaResult.forEach((item) => {
            if(item.props.gestionDeuda!=null && !cadenaAnhos.includes(item.props.gestionDeuda)){
               cadenaAnhos.push(item.props.gestionDeuda);
             }
        });      	       
        const anhosOrdenados = cadenaAnhos.sort((a, b) => {	
            return Number(a) - Number(b);
        });                     
        // Convertir el array en una cadena
        const detalleGestiones = anhosOrdenados.join('-');			     	

        const propsCuenta: CuentaProps = {
            ci                     : data.ci,
            nombreDeudor           : data.nombre_deudor,
            tipoCuenta             : data.tipo_cuenta,
            gestionGeneracionDeuda : data.gestion_generacion_deuda,
            documentacionRespaldo  : data.documentacion_respaldo,
            direccionDomicilio     : data.direccion_domicilio,
            telefonoCelular        : data.telefono_celular,
            motivoDeuda            : data.motivo_deuda,
            confirmacion           : data.confirmacion,
            descripcionConfirmacion: data.descripcion_confirmacion,
            incrementoDeuda        : data.incremento_deuda,
            montoIncrementoDeuda   : data.monto_incremento_deuda,
            depositosRealizados    : data.depositos_realizados,
            observacion            : data.observacion,
            saldo                  : data.saldo,
            adjuntos               : data.adjuntos && JSON.parse(data.adjuntos),
            estado                 : true,
            descripcionDeuda       : data.descripcion_deuda,
            estadoProceso          : data.estado_proceso,
            detalleGestionDeuda     : detalleGestiones,
        };          
       
        const resultCuenta = await CuentaService.update(deudaR.getValue().props.cuentaId, propsCuenta);		
        if (resultCuenta.isFailure) return this.fail(res, String(resultCuenta.error));
       
        return this.ok<any>(res, result);
    }

    public async destroyHistorial(req: Request, res: Response): Promise<any> {
        const ID_HISTORIAL = req.params.historial_id;
        const historial = await HistorialService.getById(ID_HISTORIAL);
        if (historial.isFailure) return this.fail(res, String(historial.error));
        const historialResult = historial.getValue();
        
        const deudaIds = historialResult.props.deudasId;

        let resultDeudas = null;
        for( const item of deudaIds ){ 
            const estado = true;
            resultDeudas = await DeudaService.update(item, { estado });
            if (resultDeudas.isFailure) return this.fail(res, String(resultDeudas.error));            
        } 
        const result = await HistorialService.delete(ID_HISTORIAL);
        if (result.isFailure) return Result.fail(result.error);

        return this.ok<any>(res, {});
    }

    public async setDeudaHistorial(req: Request, res: Response): Promise<any> {
        const ID_CUENTA = req.params.cuenta_id;
        const data = req.body;
        
         const historial = await HistorialService.getAll();
        if (historial.isFailure) return Result.fail("Falló al obtener la historial");
        const historialResult = historial.getValue().filter((h) => h.props.cuentaId === ID_CUENTA);
                
        const lastElementHistorial = historialResult.reduce(
            (elementoAnterior, elementoActual) =>
              elementoActual.props.fecha > elementoAnterior.props.fecha
                ? elementoActual
                : elementoAnterior
        );

        const saldo_anterior = lastElementHistorial?lastElementHistorial.props.saldo:0;
        const deudaIds: any[] = data.data1;		     

        const deuda = await DeudaService.getById(data.data1);
        if (deuda.isFailure) return Result.fail("Falló al obtener la Deuda");
        const deudaTitulo = deuda.getValue().props.titulo;		
                
        for( const item of deudaIds ){ 
            const estado = false;
            const result = await DeudaService.update(item, { estado });
            if (result.isFailure) return this.fail(res, String(result.error));            
        } 
        const debe = 0;
        const haber = Number(data.data2.monto);
        const saldo = saldo_anterior + debe - haber;

        const propsHistorial: HistorialProps = {
            fecha      : new Date(),
            descripcion: deudaTitulo.concat(" : ").concat(data.data2.descripcion),
            debe,
            haber,
            saldo, 
            estado     : true,
            adjuntos   : data.data2.adjuntos && JSON.parse(data.data2.adjuntos),  
            deudasId   : deudaIds,
            cuentaId   : ID_CUENTA,
        };

        const resultHistorial = await HistorialService.create(propsHistorial);
        if (resultHistorial.isFailure) return this.fail(res, String(resultHistorial.error));
        return this.ok(res);
    }

    public async changeState(req: Request, res: Response): Promise<any> {
        const deudaId = req.params.deuda_id;
        const estado = Boolean(req.body.estado);

        const result = await DeudaService.update(deudaId, { estado });
        if (result.isFailure) return this.fail(res, "Falló al cambiar estado");
        return this.ok(res);
    }

    public async getDeudaDetalle(req: Request, res: Response): Promise<any> {
        const formData = await DeudaView.getDeudaDetalleView(req.params.deuda_id);		
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<DetalleDeudaDataResponse>(res, formData.getValue());
    }
  
    public async getPDFDeudor(req: Request, res: Response): Promise<any> {
        const id: string = req.body.id;        
        const formData = await DeudaView.getPDFDeudor(id);
        if (formData.isFailure) return this.fail(res, String(formData.error));
    
        const result = formData.getValue();
        return Report2.creaPDF(result, 'deudor', res);
    }

    
}
