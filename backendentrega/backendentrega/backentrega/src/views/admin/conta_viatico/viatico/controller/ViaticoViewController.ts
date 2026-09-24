import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../../base/types/Result";
import ViaticoView from "..";
import { ViaticoFormDataResponse } from "../ViaticoView";
import  ViaticoService  from "../../../../../core/admin/conta_viatico/viatico";
import { ViaticoProps } from "../../../../../core/admin/conta_viatico/viatico/ViaticoEntity";
import { ViaticoReport } from "../../../../../tools/ViaticoReport";
import { DescargoProps } from "../../../../../core/admin/conta_viatico/descargo/DescargoEntity";
import  DescargoService from "../../../../../core/admin/conta_viatico/descargo";
import  DetalleDestinoService  from "../../../../../core/admin/conta_viatico/detalle_destino";
import { DetalleDestinoFormDataResponse } from "../../detalle_destino/DetalleDestinoView";
import MemorandumService  from "../../../../../core/admin/conta_viatico/memorandum";
import  AperturaViaticoService from "../../../../../core/admin/conta_viatico/apertura_viatico";
import  HistorialAperturaService from "../../../../../core/admin/apertura/historial_apertura";
import  HistorialGastoService from "../../../../../core/admin/apertura/historial_gasto";
import { HistorialAperturaProps } from "../../../../../core/admin/apertura/historial_apertura/HistorialAperturaEntity";
import AperturaGeneralService  from "../../../../../core/admin/apertura/apertura_general";
import { CON_PRESUPUESTO, ENUM_ANULADO, ENUM_REPORTE_PARA_RRHH, SIN_PRESUPUESTO } from "../../../../../base/constants/enum";
import ExcelJS from 'exceljs';
import { MemorandumView } from "../../memorandum/MemorandumView";



export class ViaticoViewController extends BaseHttpController {
    public async getViaticosTable(req: Request, res: Response): Promise<Response<any>> {
        let viatico;
        if(req.query.tipo_reporte === "REPORTE_PARA_RRHH"){
            const newQuery = { ...req.query };
            delete newQuery.tipo_reporte;
             viatico = await ViaticoView.getViaticosTable(newQuery);            
        }else{        
             viatico = await ViaticoView.getViaticosTable(req.query);
        }      		
        if (viatico.isFailure) return this.fail(res, "Falló al obtener la tabla de Viatico");
        return this.ok<any>(res, viatico.getValue());
    }

    public async getViaticoFormData(req: Request, res: Response): Promise<any> {
        const formData = await ViaticoView.getViaticoFormDataView(req.params.viatico_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<ViaticoFormDataResponse>(res, formData.getValue());
    }    

    public async createOrUpdateViatico(req: Request, res: Response): Promise<any> {
        const data = req.body;				
        const [dia, mes, año, hora, minuto] = data.fecha_anulacion.split(/[\s/:]+/);

    // Creando el formato YYYY-MM-DDTHH:mm:ss para que sea válido para 
        const fechaISO = `${año}-${mes}-${dia}T${hora}:${minuto}:00`;		
        const fechaAnulacion = new Date(fechaISO);    
	
        
        const ID_VIATICO = data.id;
        const props: ViaticoProps = {
            numeRecibo           : data.nume_recibo,
            fechaPagoViatico     : data.fecha_pago_viatico,
            sumaPasajeIda        : data.suma_pasaje_ida,
            sumaPasajeRetorno    : data.suma_pasaje_retorno,
            tipoPasajeGD         : data.tipo_pasaje_gd,
            totalPasajes         : data.total_pasajes,
            totalViatico         : data.total_viatico,
            liquidoPagable       : data.liquido_pagable,
            estadoPago           : data.estado_pago,
            estadoRecibo         : data.estado_recibo,
            fechaAnulacion       : fechaAnulacion,//data.fecha_anulacion,		
            notificacionViatico  : data.notificacion_viatico,
            memorandumId         : data.memorandum_id,
            escalaId             : data.escala_id,
        };
        let result = null;
        if (ID_VIATICO) {
            result = await ViaticoService.update(ID_VIATICO, props);
            if (result.isFailure) return this.fail(res, String(result.error));
            return this.ok(res, result);
        }

        // Guardia de idempotencia: un memorandum solo puede generar un viatico activo.
        // Evita pagos duplicados si el cliente reenvia la peticion (mala señal, doble clic).
        if (data.memorandum_id && data.memorandum_id !== "-") {
            const posiblesDuplicados = await ViaticoService.getAll({ fid_memorandum: data.memorandum_id });
            if (posiblesDuplicados.isSuccess) {
                const yaExisteActivo = posiblesDuplicados
                    .getValue()
                    .some((v) => v.props.estadoPago !== ENUM_ANULADO);
                if (yaExisteActivo) {
                    return this.fail(res, "Ya existe un viatico registrado para este memorandum.");
                }
            }
        }

        result = await ViaticoService.create(props);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async destroyViatico(req: Request, res: Response): Promise<any> {
        const ID_VIATICO_KEY = req.params.viatico_id;
        const viaticoR = await ViaticoService.getById(ID_VIATICO_KEY);
        if (viaticoR.isFailure) return this.fail(res, String(viaticoR.error));

        const result = await ViaticoService.delete(ID_VIATICO_KEY);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }
    public async getNroReciboData(req: Request, res: Response): Promise<any> {
        const nro = Number(req.params.nro);        
      //  const recibo = req.params.recibo;        
        const recibos = await ViaticoService.getAll();
        if (recibos.isFailure) return this.fail(res, "Viatico no encontrado");
        const recibosResult = recibos.getValue().filter((d) => d.props.numeRecibo===nro).map((dd) => dd.props.numeRecibo);        
        return this.ok<any>(res, {nro: recibosResult.length > 0});
    }
   //cambio de estado a aprobado
public async changeApprove(req: Request, res: Response): Promise<any> {
    const ID_VIATICO = req.params.viatico_id;
    const estadoPago = req.body.aprobado;   
	
    if(estadoPago === ENUM_ANULADO) {
        const fechaAnulacion = new Date();		
        //
        const result = await ViaticoService.update(ID_VIATICO, { fechaAnulacion });
        if (result.isFailure) return this.fail(res, "Falló al cambiar fecha Anulacion estado en Viatico");
    }
    if(estadoPago === "APROBADO") {
        //cuando el viatico se encuentra aprobado se crea la fila en viaticos para editar los valores
        const viaticoAprove = await ViaticoService.getById(ID_VIATICO);
        if (viaticoAprove.isFailure) return this.fail(res,  String(viaticoAprove.error));
        //detalle destino  debemos verificar que los destinos esten aprobados 
        const detalleDestino = await DetalleDestinoService.getAll();
        if (detalleDestino.isFailure) return Result.fail("Falló al obtener la Detalle Destino");
        // const detalleDestinoResult = detalleDestino.getValue();                  
        //apertura viatico  debemos verificar que los destinos esten aprobados 
        const aperturaViatico = await AperturaViaticoService.getAll();
        if (aperturaViatico.isFailure) return Result.fail("Falló al obtener la apertura viatico");
        const aperturaViaticoResult = aperturaViatico.getValue();  
        //memorandum 
        const memorandum = await MemorandumService.getAll();
        if (memorandum.isFailure) return Result.fail("Falló al obtener la Memorandum");
        const memorandumResult = memorandum.getValue();
          
          
         //Tenemos toda la lista de destinos 
        const listaDestinos: DetalleDestinoFormDataResponse[] = detalleDestino
        .getValue()
        .map((item) => {
         
            return {
                id: item.id.toString(),
                tipo_vehiculo_op         : item.props.tipoVehiculoOP,
                objetivo_viaje           : item.props.objetivoViaje,
                destino_reg              : item.props.destinoReg,
                fecha_dia                : item.props.fechaDia,
                hora_inicio              : item.props.horaInicio,
                hora_fin                 : item.props.horaFin,
                pernocte                 : item.props.pernocte,
                pasaje_ida               : item.props.pasajeIda,
                pasaje_retorno           : item.props.pasajeRetorno,
                total_pasaje_dia         : item.props.totalPasajedia,
                tipo_vehiculo_opvida     : item.props.tipoVehiculoOPIda,
                tipo_vehiculo_opvuelta   : item.props.tipoVehiculoOPVuelta,
                estado                    :item.props.estado,
                modificacion             : item.props.modificacion,
                observacion              : item.props.observacion,
                estado_observacion       : item.props.estadoObservacion,
                memorandum_id            : item.props.memorandumId,
                viatico_id               : item.props.viaticoId,
                vehiculo_id              : item.props.vehiculoId,
                destino_id               : item.props.destinoId,
                destino_id2               :item.props.destinoId2,
            };
        })
        .sort((a, b) => (a.fecha_dia > b.fecha_dia ? 1 : -1));
          
        //filtramos por el id de Viatico
        const filtroIdViatico1: DetalleDestinoFormDataResponse[] = (listaDestinos.find((c) => c.viatico_id === ID_VIATICO))?  	
        listaDestinos.filter((item) => this.filtrarId(item.viatico_id, ID_VIATICO)):[];
        
         //filtramos por el id de Viatico
         const filtroIdViatico: DetalleDestinoFormDataResponse[] = (filtroIdViatico1.find((c) => c.viatico_id === ID_VIATICO))?                
         filtroIdViatico1.filter((item) => this.filtrarEstado(item.estado, 'SIN_VIAJE')):[];
        
        //filtramos para la verificacion de los estados 
        const filtroEstados: DetalleDestinoFormDataResponse[] = (filtroIdViatico.find((c) => c.viatico_id === ID_VIATICO))?		
        filtroIdViatico.filter((item) => this.filtrarId(item.estado, "APROBADO")):[];
        
        //Controlando estado de aprobacion si el numero de destino aprobados es igual al numero de destinos descritos
       
        const estadoAprobado = (filtroIdViatico.length === filtroEstados.length && filtroIdViatico.length>0 && filtroEstados.length>0)?true:false;
	

        const viatico = await ViaticoService.getById(ID_VIATICO);
        if (viatico.isFailure) return Result.fail<ViaticoFormDataResponse>("Viatico no encontrado");
        const props = viatico.getValue();
        
        const numerReciboEstado = (props.props.numeRecibo > 0)?true:false;
        //Actualizando apertura
        const memorandumID = props.props.memorandumId;       
        const aperturaViaticoId = memorandumResult.find((c)=>c.id === memorandumID)?.props.aperturaViaticoId|| "-";
        const aperturaPasajeId = memorandumResult.find((c)=>c.id === memorandumID)?.props.aperturaPasajeId|| "-";
       
        
         //Actualizando valores de la apertura general PAsajes y viaticos 
         const aperturaViaticoGeneralId = aperturaViaticoResult.find((c)=>c.id ===aperturaViaticoId)?.props.aperturaGeneralId || "";        
         const aperturaPasajeGeneralId = aperturaViaticoResult.find((c)=>c.id === aperturaPasajeId)?.props.aperturaGeneralId|| "";       
         //Sacando valores para el historial
        const codigoMemorandum = memorandumResult.find((a)=>a.id ===memorandumID)?.props.codDepartMemo ||"";	
    
        
        let descripcion = "";
        for(let i=0; i<filtroEstados.length; i++) { 
           descripcion = descripcion.concat(" - ").concat(filtroEstados[i].objetivo_viaje);           
        }        

       //Control de pasajes vacio 
         if(aperturaPasajeGeneralId.length > 0){

        //Control de negativos
           const totalPasajes = props.props.totalPasajes;
           const montoRestanteP = aperturaViaticoResult.find((c)=>c.props.aperturaGeneralId === aperturaPasajeGeneralId)?.props.presupuestoRestante||0;         
           const controlMontoPasajes = montoRestanteP - totalPasajes;
           if(montoRestanteP < 101){ // comprobando el monto restante de pasajes si es menor a 100 actualizara los estados SIN PRESUPUESTO
                const estado = SIN_PRESUPUESTO               
                const resultMontoRestViaticoPasajes= await AperturaViaticoService.update(aperturaPasajeId, {estado});                
                if (resultMontoRestViaticoPasajes.isFailure) return this.fail(res, "Falló al actualizar el estado en Apertura_Viatico Pasajes");                
               
                const resultMontoRestGeneralPasajes= await AperturaGeneralService.update(aperturaPasajeGeneralId, {estado});				
                if (resultMontoRestGeneralPasajes.isFailure) return this.fail(res, "Falló al actualizar el estado en Apertura General Pasajes");             
            }
           if(controlMontoPasajes < 0){ // diferencia emtre el restante y el pasaje real             
                return this.fail (res,"El monto Restante en PASAJES no es suficiente para cubrir el pasaje de este memorandum, Monto INSUFICIENTE revisar aperturas");   
            }            
       
            /*if(montoRestanteP < 29){ // asumiendo un  pasaje inferior a ese monto
            return this.fail (res,"El monto Restante es menor a 30 es el minimo permisible, ya no se puede asignar mas Pasajes");   
            } */ 
            // actualizando valores en historial de Aperturas       
                const propsPA: HistorialAperturaProps = {               
                
                    titulo     : "PASAJES: ".concat(codigoMemorandum),
                    descripcion: descripcion,
                    gasto      : props.props.totalPasajes,
                    debeHaber  : "EGRESO",
                    estado     : "",
                    fecha      : new Date(),
                    aperturaId   :aperturaPasajeGeneralId,
                };
                
                const resultPA = await HistorialAperturaService.create(propsPA);
                if (resultPA.isFailure) return Result.fail(resultPA.error);
                
                const id_historial_pasaje = resultPA.getValue().id;		
                
                const historialGastoPasaje = await HistorialGastoService.getAll();
                if (historialGastoPasaje.isFailure) return Result.fail("Falló al obtener la historial de gasto");
                const historialResultPasaje = historialGastoPasaje.getValue().filter((h) => h.props.aperturaId === aperturaPasajeGeneralId);

                if (resultPA.isSuccess) {
                    const lastElementHistorial = historialResultPasaje.reduce(      
                    (elementoAnterior, elementoActual) =>
                    elementoActual.props.fecha > elementoAnterior.props.fecha
                        ? elementoActual
                        : elementoAnterior
                    );
                    const saldo_anterior = lastElementHistorial?lastElementHistorial.props.saldo:0;       
                    
                    let debe = 0;  let haber = 0 ;   let saldo = 0;  
                
                    debe = props.props.totalPasajes;
                    haber = 0 ;
                    saldo = Number(saldo_anterior) - Number(debe);
                    const propsHistorialGasto = {
                                                
                        fecha      : new Date(),
                        descripcion: "PASAJES: ".concat(codigoMemorandum),
                        debe       : debe,
                        haber      : Number(haber),
                        saldo      : Number(saldo), 
                        estado     : "",
                        historialAperturaId   : id_historial_pasaje,
                        aperturaId           : aperturaPasajeGeneralId,           
                    
                    };
                
                    const resultHistorial = await HistorialGastoService.create(propsHistorialGasto);
                    if (resultHistorial.isFailure) return this.fail(res, String(resultHistorial.error));
              
                    //Actualizando valores de apertura Viatico
                    const debePasaje = debe;  
                    const aperturaViaticoIdP = aperturaViaticoResult.find((c)=>c.props.aperturaGeneralId ===aperturaPasajeGeneralId)?.id||"";                
                    const montoRestante = aperturaViaticoResult.find((c)=>c.props.aperturaGeneralId ===aperturaPasajeGeneralId)?.props.presupuestoRestante||0;         
                    const estado = montoRestante > 49?CON_PRESUPUESTO:SIN_PRESUPUESTO;
                    const presupuestoRestante = Number(montoRestante) - Number(debePasaje);     
                    const resultPas = await AperturaViaticoService.update(aperturaViaticoIdP, { presupuestoRestante ,estado});
                    if (resultPas.isFailure) return this.fail(res, "Falló al cambiar el Restante de la Apertura Viatico Pasajes");

                  // Actualizando valores en apertura general 
                    
                    const aperturaGeneralIDP = aperturaViaticoResult.find((c)=>c.id === aperturaViaticoIdP)?.props.aperturaGeneralId||"";                   
                    const resultAperturaGeneralP = await AperturaGeneralService.update(aperturaGeneralIDP, { presupuestoRestante });                    
                    if (resultAperturaGeneralP.isFailure) return this.fail(res, "Falló al cambiar el Restante de la Apertura General Pasajes");
  
                }        

            }        
        // Fin Pasajes
        //Si Viaticos es vacio 
        if(aperturaViaticoGeneralId.length > 0){                  
          //Control de negativos
           const totalViaticos= props.props.totalViatico;          
           const montoRestanteV = aperturaViaticoResult.find((c)=>c.props.aperturaGeneralId ===aperturaViaticoGeneralId)?.props.presupuestoRestante||0;                    
           const controlMontoViaticos = montoRestanteV - totalViaticos;           
           if(montoRestanteV < 201){ // comprobando el monto restante de viatico si es menor a 100 actualizara los estados SIN PRESUPUESTO
                const estado = SIN_PRESUPUESTO               
                const resultMontoRestViatico= await AperturaViaticoService.update(aperturaViaticoId, {estado});                
                if (resultMontoRestViatico.isFailure) return this.fail(res, "Falló al actualizar el estado en Apertura_Viatico Viatico");                
               
                const resultMontoRestGeneralViatico= await AperturaGeneralService.update(aperturaViaticoGeneralId, {estado});				
                if (resultMontoRestGeneralViatico.isFailure) return this.fail(res, "Falló al actualizar el estado en Apertura General Viatico");             
            }
           if(controlMontoViaticos < 0){ // diferencia emtre el restante y el pasaje real             
                return this.fail (res,"El monto Restante en VIATICOS no es suficiente para cubrir el pasaje de este memorandum, Monto INSUFICIENTE revisar aperturas");   
            }        
          
            /*  if(montoRestanteV < 49){ // asumiendo un  viatico inferior a ese monto
                return this.fail(res,"El monto Restante es menor a 50 es el minimo permisible, ya no se puede asignar mas Viaticos");   
            } */
            // actualizando valores en historial de aperturas
                const propsVA: HistorialAperturaProps = {        
                
                    titulo     : "VIATICOS: ".concat(codigoMemorandum),
                    descripcion: descripcion,
                    gasto      : props.props.totalViatico,
                    debeHaber  : "EGRESO",
                    estado     : "",
                    fecha      : new Date(),
                    aperturaId   :aperturaViaticoGeneralId,
                };
                const resultVA = await HistorialAperturaService.create(propsVA);
                if (resultVA.isFailure) return Result.fail(resultVA.error);
                
                const id_historial_viatico = resultVA.getValue().id;
                const historialGastoViatico = await HistorialGastoService.getAll();
                if (historialGastoViatico.isFailure) return Result.fail("Falló al obtener la historial de gasto");
                const historialResultViatico = historialGastoViatico.getValue().filter((h) => h.props.aperturaId === aperturaViaticoGeneralId);


                if (resultVA.isSuccess) {
                    const lastElementHistorial = historialResultViatico.reduce(      
                    (elementoAnterior, elementoActual) =>
                    elementoActual.props.fecha > elementoAnterior.props.fecha
                        ? elementoActual
                        : elementoAnterior
                    );
                    const saldo_anterior = lastElementHistorial?lastElementHistorial.props.saldo:0;       
                    
                    let debe = 0;  let haber = 0 ;   let saldo = 0;  
                
                    debe = props.props.totalViatico;
                    haber = 0 ;
                    saldo = Number(saldo_anterior) - Number(debe);
                    const propsHistorialGasto = {
                        
                        fecha      : new Date(),
                        descripcion: "VIATICOS: ".concat(codigoMemorandum),
                        debe       : debe,
                        haber      : Number(haber),
                        saldo      : Number(saldo), 
                        estado     : "",
                        historialAperturaId   : id_historial_viatico,
                        aperturaId           : aperturaViaticoGeneralId,           
                    
                    };
                    const resultHistorial = await HistorialGastoService.create(propsHistorialGasto);
                    if (resultHistorial.isFailure) return this.fail(res, String(resultHistorial.error));
                 
                    const debeViatico = debe;  
                    const aperturaViaticoIdV = aperturaViaticoResult.find((c)=>c.props.aperturaGeneralId ===aperturaViaticoGeneralId)?.id||"";                
                    const montoRestante = aperturaViaticoResult.find((c)=>c.props.aperturaGeneralId ===aperturaViaticoGeneralId)?.props.presupuestoRestante||0;         
                    const estado = montoRestante > 49?CON_PRESUPUESTO:SIN_PRESUPUESTO;
                    const presupuestoRestante = Number(montoRestante) - Number(debeViatico);     
                    const resultVia = await AperturaViaticoService.update(aperturaViaticoIdV, { presupuestoRestante ,estado});
                    if (resultVia.isFailure) return this.fail(res, "Falló al cambiar el Restante de la Apertura Viatico");

                      // Actualizando valores en apertura general     
                    const aperturaGeneralIDV = aperturaViaticoResult.find((c)=>c.id === aperturaViaticoIdV)?.props.aperturaGeneralId||""; 
                    const resultAperturaGeneralV = await AperturaGeneralService.update(aperturaGeneralIDV, { presupuestoRestante });					
                    if (resultAperturaGeneralV.isFailure) return this.fail(res, "Falló al cambiar el Restante de la Apertura General Viatico");

                }  
        } 
        
        //Fin Viaticos

        // fin actualizacion de la apertura Pasaje y viaticos
        if(!estadoAprobado){
            return this.fail(res,"Existen destinos pendientes de aprobación");
        }else if(!numerReciboEstado){
            return this.fail(res,"No Ingreso el numero de Recibo antes de la Aprobacion del Memorandum");   
        }else{
           
           // Creacion descargo
                const descargoProps : DescargoProps=  {
                fechaDescargo              : new Date(),
                estadoDescargo             : 'PENDIENTE',
                viaticoPasajeReal          : 0,
                montoDespositado           : 0,
                montoDescargo              : -1,
                saldoDescargo              : -1,
                presentaInforme            : 'PENDIENTE',//Modificardescargo  'NP PRESENTO',
                viaticoReal                : 0,
                observacionEstado          : 'SIN OBSERVACION',//Modificardescargo  'APROBADO',
                observacionDescargo        : '',//Modificardescargo  'APROBADO',               
                prorroga                   : '',//Modificardescargo  'NO',
                tiempoDescargo             : 8,//Modificardescargo   8
                notificacionDescargo       : '',
                viaticoId                  : ID_VIATICO,
                }

            const descargoCreate = await DescargoService.create(descargoProps);
            if (descargoCreate.isFailure) return this.fail(res,"Falló al crear Viatico despues de aprobar Viatico");  
        }         
    }            

    const result = await ViaticoService.update(ID_VIATICO, { estadoPago });
    if (result.isFailure) return this.fail(res, "Falló al cambiar estado en Viatico");
    
    return this.ok(res);

}

//filtramos por el tipo Inte,nacional o provincial
    public filtrarId(item:string, constante:string) {    
        return (item === constante); 
    }

   
    public filtrarEstado(item:string, estado:string) { 
        return (item != estado); 
    } 


public async getPDFViaticoReporte(req: Request, res: Response): Promise<any> {
    const id: string = req.body.id; 
           
    const viaticoResult = await ViaticoView.getPDFViatico(req.authUser, id);
    if (viaticoResult.isFailure) return this.fail(res, String(viaticoResult.error));
    const result = viaticoResult.getValue();
    return ViaticoReport.creaPDF(result, 'viatico', res);
}   

public async getFechaFiltroRRHH(req: Request, res: Response): Promise<Response<any>> {
    const viaticoFiltro = await ViaticoView.getFechaFiltroRRHH(req.params.fechaInicio, req.params.fechaFin, req.query);
    if (viaticoFiltro.isFailure) return this.fail(res, "Falló al obtener la tabla de Viatico filtro de fechas ");
    return this.ok<any>(res, viaticoFiltro.getValue());
}

public async getTipoUsuarioRRHH(req: Request, res: Response): Promise<Response<any>> {          
    const viaticoFiltro = await ViaticoView.getTipoUsuarioRRHH(req.params.tipo, req.query);		
    if (viaticoFiltro.isFailure) return this.fail(res, "Falló al obtener la tabla de Viatico filtro de tipo de funcionario ");
    return this.ok<any>(res, viaticoFiltro.getValue());
}

public async getEstadoPagoRRHH(req: Request, res: Response): Promise<Response<any>> {      
    
    const viaticoFiltro = await ViaticoView.getEstadoPagoRRHH(req.params.estado, req.query);		
    if (viaticoFiltro.isFailure) return this.fail(res, "Falló al obtener la tabla de Descargo filtro de tipo de estado Pago");
    return this.ok<any>(res, viaticoFiltro.getValue());
}
public async getEstadoModificacionRRHH(req: Request, res: Response): Promise<Response<any>> {      
    
    const viaticoFiltro = await ViaticoView.getEstadoModificacionRRHH(req.params.estado, req.query);		
    if (viaticoFiltro.isFailure) return this.fail(res, "Falló al obtener la tabla de Descargo filtro de tipo de estado Pago");
    return this.ok<any>(res, viaticoFiltro.getValue());
}

public async getReportJSON(req: Request, res: Response): Promise<any> {
  const idViatico = req.params.id; 
  const queryString = req.body.qs;	
  const fechaInicio = req.body.data.fechaInicio; 
  const fechaFin = req.body.data.fechaFin; 	
  const params = new URLSearchParams(queryString);
  const tipoReporte = String(params.get("tipo_reporte")); //
  
    let idsFiltrosReporte;
	if(req.body.data != undefined){
         idsFiltrosReporte = req.body.data.ids;  
    }   
	
    const formData = await ViaticoView.generarFilasExcel(req.authUser,queryString, idViatico, idsFiltrosReporte, fechaInicio, fechaFin);
    const formDataMemorandum = await MemorandumView.generarFilasExcel(req.authUser,queryString, idViatico, idsFiltrosReporte, fechaInicio, fechaFin);
	
    if (formData.isFailure) return this.fail(res, String(formData.error));
    const result = formData.getValue();	

     if (formDataMemorandum.isFailure) return this.fail(res, String(formDataMemorandum.error));
    const resultMemorandum = formDataMemorandum.getValue();	

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte Viático');
    // nueva pestaña para memorandum reposicion
    const worksheetReposicion = workbook.addWorksheet('Memorandum Reposición');
      // Definir columnas con estilos base
    
    worksheet.columns = await ViaticoView.generarHeadExcel(tipoReporte)!;
    // memorandum reposicion
    const columnsReposicion = await MemorandumView.generarHeadExcel(tipoReporte)!; 
    worksheetReposicion.columns = columnsReposicion ?? [];
       // Estilo de los encabezados
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; 
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4472C4' }, // azul oscuro
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    //memorandum reposicion 
    worksheetReposicion.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; 
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4472C4' }, // azul oscuro
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

     //Aqui falta aumentar fila 
     
   const formatData = await ViaticoView.getFormatData(result.data); //data    

    //memorandum reposicion
   const formatDataMemorandum = await MemorandumView.getFormatData(resultMemorandum.data); //data    
     
   //let contadorFilas =  1;
    
  switch(tipoReporte){
    
    case ENUM_REPORTE_PARA_RRHH:     
   if (formatData && formatData.length > 0) {
    formatData!.sort((a, b) => {
        const toDate = (f: string) => {
            const [d, m, y] = f.split('/');
            return new Date(+y, +m - 1, +d).getTime();
        };
        return toDate(a.fecha_inicio_viaje) - toDate(b.fecha_inicio_viaje);
    });

    formatData!.forEach((item: any, index: number) => {
        worksheet.addRow({        
                nume_recibo            : item.nume_recibo,
                tipo_memo_repo         : item.tipo_memo_repo, 
                tipo_usuario           : item.tipo_usuario,
                //ff_of                  : item.ff_of,                  
                usuario_ci             : item.usuario_ci,  
                usuario_nombre         : item.usuario_nombre,          
                cod_depart_memo        : item.cod_depart_memo,      
                destino                : item.destino,
                fecha_inicio_viaje     : item.fecha_inicio_viaje,           
                fecha_fin_viaje        : item.fecha_fin_viaje, 
                cantidad_dias          : item.cantidad_dias,
                dias_viaje             : item.dias_viaje,
                notificacion_memo      : item.notificacion_memo,
                estado_pago            : item.estado_pago,         
                estado_modificacion    : item.estado_modificacion,
                apertura_programatica  : item.apertura_programatica,              
        });      
        });
   }    
   if (formatDataMemorandum && formatDataMemorandum.length > 0) {
         formatDataMemorandum!.sort((a, b) => {
            const toDate = (f: string) => {
                const [d, m, y] = f.split('/');
                return new Date(+y, +m - 1, +d).getTime();
            };
            return toDate(a.fecha_inicio_viaje) - toDate(b.fecha_inicio_viaje);
        });
         formatDataMemorandum!.forEach((item: any, index: number) => {
      worksheetReposicion.addRow({        
           
            tipo_memo_repo         : item.tipo_memo_repo, 
            tipo_usuario           : item.tipo_usuario,
            //ff_of                  : item.ff_of,                  
            usuario_ci             : item.usuario_ci,  
            usuario_nombre         : item.usuario_nombre,          
            cod_depart_memo        : item.cod_depart_memo,      
            destino                : item.destino,
            fecha_inicio_viaje     : item.fecha_inicio_viaje,           
            fecha_fin_viaje        : item.fecha_fin_viaje, 
            cantidad_dias          : item.cantidad_dias,
            dias_viaje             : item.dias_viaje,
            notificacion_memo      : item.notificacion_memo,           
            estado_modificacion    : item.estado_modificacion,
            apertura_programatica  : item.apertura_programatica,              
      });      
    });
   }  
    
      break;  
  }

      // Estilos para las filas de datos
    worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
        if (rowNumber === 1) return; // saltar encabezado
        
        const cell = row.getCell('estado_pago');
        const cellObservado = row.getCell('estado_modificacion');
         const cellMemo = row.getCell('notificacion_memo');
         const cellTipoMemoRepo = row.getCell('tipo_memo_repo');
    switch (cell.value) {
        case 'APROBADO':
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF00FF00' }
            };
            break;

        case 'ANULADO':
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF0000' }
            };
            break;

        case 'RECHAZADO':
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF0000' }
            };
            break;
    }
     switch (cellObservado.value) {
        case 'SIN_OBSERVACION':
            cellObservado.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF00FF00' }
            };
            break;

        case 'OBSERVADO':
            cellObservado.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF0000' }
            };
            break;       
    }
  switch (cellMemo.value) {
        case 'APROBADO_CONTABILIDAD':
            cellMemo.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF00FF00' }
            };
            break;

        case 'ANULADO':
            cellMemo.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF0000' }
            };
            break;

        case 'VERIFICADO_RRHH':
            cellMemo.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF0000FF' }
            };
            break;
    }

     switch (cellTipoMemoRepo.value) {
        case 'MEMORANDUM':
            cellTipoMemoRepo.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF00FF00' }
            };
            break;

        case 'REPOSICION':
            cellTipoMemoRepo.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF3399FF' }
            };
            break;       
    }

        row.eachCell((cell) => {
          cell.alignment = { vertical: 'middle', horizontal: 'left' };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      });
  
      // Preparar descarga
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=reporte_viatico_${idViatico}.xlsx`
      );
  
      await workbook.xlsx.write(res);
      res.end(); 
}


public async anularRecibo(req: Request, res: Response): Promise<any> {
        const data = req.body;						
        const [dia, mes, año, hora, minuto] = data.fecha_anulacion.split(/[\s/:]+/);

    // Creando el formato YYYY-MM-DDTHH:mm:ss para que sea válido para 
        const fechaISO = `${año}-${mes}-${dia}T${hora}:${minuto}:00`;		
        const fechaAnulacion = new Date(fechaISO);    
        const ID_VIATICO = data.id;
		
        const props: ViaticoProps = {			
            numeRecibo           : data.nume_recibo,
            fechaPagoViatico     : new Date("1900-01-01"),
            sumaPasajeIda        : 0,
            sumaPasajeRetorno    : 0,
            tipoPasajeGD         : "-",
            totalPasajes         : 0,
            totalViatico         : 0,
            liquidoPagable       : 0,
            estadoPago           : ENUM_ANULADO,
            estadoRecibo         : ENUM_ANULADO,
            fechaAnulacion       : data.fecha_anulacion,
            notificacionViatico  : data.observacion_anulacion,
            memorandumId         : "-",
            escalaId             : "-",
        };
        
        let result = null;
        if (ID_VIATICO) {
            result = await ViaticoService.update(ID_VIATICO, props);
            if (result.isFailure) return this.fail(res, String(result.error));
            return this.ok(res, result);
        }
         // CREAR Viatico ANULADO
        result = await ViaticoService.create(props);
        if (result.isFailure) return Result.fail(result.error);

         //Actualizacion de gastos 
        const dataViatico = result.getValue();
        //DESCARGO
        const ID_DESCARGO = data.id;         
         const propsDescargo: DescargoProps = {
                fechaDescargo         : new Date("1900-01-01"),//data.fecha_anulacion,
                estadoDescargo        : ENUM_ANULADO,
                viaticoPasajeReal     : 0,
                montoDespositado      : 0,
                montoDescargo         : 0,
                saldoDescargo         : 0,
                presentaInforme       : ENUM_ANULADO,
                viaticoReal           : 0,
                observacionEstado     : ENUM_ANULADO,
                observacionDescargo   : data.observacion_anulacion,              
                prorroga              : data.prorroga,
                tiempoDescargo        : 0,
                notificacionDescargo  : "-",
                viaticoId             : dataViatico.id,   
        };
        
        let resultDescargo = null;
        if (ID_DESCARGO) {
            resultDescargo = await DescargoService.update(ID_DESCARGO, propsDescargo);
            if (resultDescargo.isFailure) return this.fail(res, String(resultDescargo.error));
            return this.ok(res, result);
        }
        resultDescargo = await DescargoService.create(propsDescargo);
        if (resultDescargo.isFailure) return Result.fail(resultDescargo.error);  

        return this.ok<any>(res, result);


        
    }

}
