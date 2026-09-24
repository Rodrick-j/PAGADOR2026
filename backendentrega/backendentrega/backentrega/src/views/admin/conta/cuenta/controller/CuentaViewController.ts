import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../../base/types/Result";

import CuentaService from "../../../../../core/admin/conta/cuenta";
import HistorialService from "../../../../../core/admin/conta/historial";
import { CuentaProps } from "../../../../../core/admin/conta/cuenta/CuentaEntity";
import { HistorialProps } from "../../../../../core/admin/conta/historial/HistorialEntity";
import { DeudaProps } from "../../../../../core/admin/conta/deuda/DeudaEntity";
import DeudaService from "../../../../../core/admin/conta/deuda";

import { CuentaFormDataResponse, GetCuentasTableResponse, GetSeguimientoTableResponse, SeguimientoFormDataResponse } from "../CuentaView";
import CuentaView from "..";

import { Report2 } from "../../../../../tools/Report2";
import SeguimientoService from "../../../../../core/admin/conta/seguimiento";
import { SeguimientoProps } from "../../../../../core/admin/conta/seguimiento/SeguimientoEntity";

export class CuentaViewController extends BaseHttpController {
    public async getCuentasTable(req: Request, res: Response): Promise<Response<any>> {
        const data = await CuentaView.getCuentasTable(req.query);
        if (data.isFailure) {
            return this.fail(res, data.error as string);
        }
        return this.ok<GetCuentasTableResponse>(res, data.getValue());
    }

    public async getSeguimientolTable(req: Request, res: Response): Promise<Response<any>> {
        const data = await CuentaView.getSeguimientolTable(req.query);
        if (data.isFailure) {
            return this.fail(res, data.error as string);
        }
        return this.ok<GetSeguimientoTableResponse>(res, data.getValue());
    }

    public async getCuentaFormData(req: Request, res: Response): Promise<any> {
        const formData = await CuentaView.getCuentaFormDataView(req.params.cuenta_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<CuentaFormDataResponse>(res, formData.getValue());
    }

    public async getSeguimientoFormData(req: Request, res: Response): Promise<any> {
        const formData = await CuentaView.getSeguimientoFormDataView(req.params.cuenta_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<SeguimientoFormDataResponse>(res, formData.getValue());
    }

    public async createOrUpdateCuenta(req: Request, res: Response): Promise<any> {
        const data = req.body;
     
        const ID_CUENTA = data.id;
   
        const props: CuentaProps = {
			
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
            detalleGestionDeuda     : data.gestion_generacion_deuda,
        };
      
        let result = null;
        if (ID_CUENTA) {
            result = await CuentaService.update(ID_CUENTA, props);			
            if (result.isFailure) return this.fail(res, String(result.error));            
            /* const dataCuenta = result.getValue();*/
            //Actualizando el campo historial cuando se edita el campo saldo
            if (result.isSuccess) {
                const historial = await HistorialService.getAll();			
                if (historial.isFailure) return Result.fail("Falló al obtener la cuenta");
                const historialResult = historial.getValue().find((h) =>   h.props.cuentaId === ID_CUENTA &&
                                                                          // h.props.saldo=== data.saldo &&
                                                                           h.props.descripcion.includes('INICIAL')
                                                                    );                                                                          
                const ID_HISTORIAL = historialResult?.id || "";			
                const propsHistorial = {					
                    debe       : Number(data.saldo),
                    saldo      : Number(data.saldo),
                    adjuntos   : data.adjuntos && JSON.parse(data.adjuntos), 
                    cuentaId   : ID_CUENTA,
                };             
                const resultHistorial = await HistorialService.update(ID_HISTORIAL, propsHistorial);				
                if (resultHistorial.isFailure) return this.fail(res, String(result.error));
            } 
            
            return this.ok(res, result);
        }
        
        result = await CuentaService.create(props);        
        
        if (result.isFailure) return Result.fail(result.error);

        const dataCuenta = result.getValue();
		
        
        if (result.isSuccess) {
            const ID_CUENTA_2 = dataCuenta.id;			
            const deudaProps: DeudaProps = {
				
                codActivo  : '',
                titulo     : 'DEUDA INICIAL',
                descripcion: 'DEUDA INICIAL',
                estado     : true,
                gestionDeuda: data.gestion_generacion_deuda,
                montoDeuda : data.saldo,
                cuentaId   : ID_CUENTA_2,
            };
           
            const resultDeuda = await DeudaService.create(deudaProps);
            if (resultDeuda.isFailure) return this.fail(res, String(result.error));
            const dataDeuda = resultDeuda.getValue();
		
            
            if (resultDeuda.isSuccess) {
                const ID_DEUDA = dataDeuda.id;
				
                const deudasString: any[] = [];
                deudasString.push(ID_DEUDA);
                const propsHistorial: HistorialProps = {
					
                    fecha      : new Date(),
                    descripcion: 'DEUDA INICIAL',
                    debe       : Number(dataCuenta.props.saldo),
                    haber      : 0,
                    saldo      : Number(dataCuenta.props.saldo), 
                    estado     : true,
                    adjuntos   : data.adjuntos && JSON.parse(data.adjuntos), 
                    deudasId   : deudasString,
                    cuentaId   : ID_CUENTA_2,
                };
           
                const resultHistorial = await HistorialService.create(propsHistorial);
                if (resultHistorial.isFailure) return this.fail(res, String(result.error));
            }
        } 

        return this.ok<any>(res, result);
    }

    public async createOrUpdateSeguimiento(req: Request, res: Response): Promise<any> {
        const data = req.body;     
        const ID_SEGUIMIENTO = data.id;
        
        const props: SeguimientoProps = {
            fecha      : data.fecha,
            descripcion: data.descripcion,
            observacion: data.observacion,
            dias       : data.dias,
            estado     : data.estado,
            adjuntos   : data.adjuntos && JSON.parse(data.adjuntos),
            cuentaId   : data.cuenta_id,
        };        
     
        //Se actualiza la deuda
        let result = null;
        if (ID_SEGUIMIENTO) {
            result = await SeguimientoService.update(ID_SEGUIMIENTO, props);
            if (result.isFailure) return this.fail(res, String(result.error));
            return this.ok(res, result);
        }
        result = await SeguimientoService.create(props);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async destroyCuenta(req: Request, res: Response): Promise<any> {
        const ID_cuenta = req.params.cuenta_id;
        const cuentaR = await CuentaService.getById(ID_cuenta);
        if (cuentaR.isFailure) return this.fail(res, String(cuentaR.error));

        const result = await CuentaService.delete(ID_cuenta);
        if (result.isFailure) return this.fail(res, String(result.error));
        return this.ok<any>(res, result);
    }

    public async changeActive(req: Request, res: Response): Promise<any> {
        const ID_CUENTA = req.params.cuenta_id;
        const estado = Boolean(req.body.estado);
       
        const result = await CuentaService.update(ID_CUENTA,{ estado });
        if (result.isFailure) return this.fail(res, "Falló al cambiar estado");
        return this.ok(res);
    }

    public async getPDFCuenta(req: Request, res: Response): Promise<any> {
        const queryString = req.body.qs;        
        const formData = await CuentaView.getPDFCuenta(req.authUser, queryString);
        if (formData.isFailure) return this.fail(res, String(formData.error));
    
        const result = formData.getValue();
        return Report2.creaPDF(result, 'cuenta', res);
    }

    public async getPDFSeguimientoEnvio(req: Request, res: Response): Promise<any> {
        const id: string = req.body.id;        
        const formData = await CuentaView.getPDFSeguimientoEnvio(id);
        if (formData.isFailure) return this.fail(res, String(formData.error));
    
        const result = formData.getValue();
        return Report2.creaPDF(result, 'seguimiento', res);
    }

    public async getSeguimientoImpresion(req: Request, res: Response): Promise<any> {
        const formData = await CuentaView.getSeguimientoView(req.params.id, req.params.input);
        if (formData.isFailure) return this.fail(res, String(formData.error));
    
        const result = formData.getValue();
        return this.ok<any>(res, result);
    }
    
}
