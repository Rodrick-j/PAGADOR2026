import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../../base/types/Result";
import MemorandumView from "..";
import { MemorandumFormDataResponse, MemorandumTipoPCPOptionsFormModel, ModificacionDetalleDestino, ModificacionMemorandum } from "../MemorandumView";
import  MemorandumService  from "../../../../../core/admin/conta_viatico/memorandum";
import { MemorandumProps } from "../../../../../core/admin/conta_viatico/memorandum/MemorandumEntity";
import { AuthUser } from "../../../../../base/types/AuthUser";
import  ViaticoService  from "../../../../../core/admin/conta_viatico/viatico";
import {  ViaticoProps } from "../../../../../core/admin/conta_viatico/viatico/ViaticoEntity";
import { MemorandumReport } from "../../../../../tools/MemorandumReport";
import  DetalleDestinoService  from "../../../../../core/admin/conta_viatico/detalle_destino";
import { DetalleDestinoOptionsFormModel, DetalleDestinoOptionsFormModel2 } from "../../detalle_destino/DetalleDestinoView";
import moment from "moment";
import { CON_PRESUPUESTO, ENUM_ANULADO, ENUM_APROBADO_CONTABILIDAD, ENUM_APROBADO_JEFE, ENUM_PENDIENTE, ENUM_RECHAZADO, ENUM_REPOSICION_VENCIDA, ESTADO_MEMORANDUMS_APROBACION, SIN_PRESUPUESTO } from "../../../../../base/constants/enum";
import { CitesView } from "../../../correspondencia/cites/CitesView";
import AperturaViaticoService  from "../../../../../core/admin/conta_viatico/apertura_viatico";
import { ViaticoFormDataResponse } from "../../viatico/ViaticoView";
import { HistorialAperturaProps } from "../../../../../core/admin/apertura/historial_apertura/HistorialAperturaEntity";
import  HistorialAperturaService  from "../../../../../core/admin/apertura/historial_apertura";
import HistorialGastoService  from "../../../../../core/admin/apertura/historial_gasto";
import  AperturaGeneralService from "../../../../../core/admin/apertura/apertura_general";
import  PersonalService  from "../../../../../core/rrhh/personal";




export class MemorandumViewController extends BaseHttpController {
    public async getMemorandumsTable(req: Request, res: Response): Promise<Response<any>> {
        const AUTH_USER: AuthUser = req.authUser;		
        const memorandum = await MemorandumView.getMemorandumsTable(AUTH_USER, req.query);
        if (memorandum.isFailure) return this.fail(res, "Falló al obtener la tabla de Memorandum");
        return this.ok<any>(res, memorandum.getValue());
    }
    public async getMemorandumsUserTable(req: Request, res: Response): Promise<Response<any>> {
        const AUTH_USER: AuthUser = req.authUser;
        const memorandum = await MemorandumView.getMemorandumsUserTable(AUTH_USER, req.query);
        if (memorandum.isFailure) return this.fail(res, "Falló al obtener la tabla de Memorandum");
        return this.ok<any>(res, memorandum.getValue());
    }
    public async getMemorandumsSolicitadaUserTable(req: Request, res: Response): Promise<Response<any>> {
        const AUTH_USER: AuthUser = req.authUser;
        const memorandum = await MemorandumView.getMemorandumsSolicitadaUserTable(AUTH_USER, req.query);
        if (memorandum.isFailure) return this.fail(res, "Falló al obtener la tabla de Memorandum");
        return this.ok<any>(res, memorandum.getValue());
    }

    public async getMemorandumFormData(req: Request, res: Response): Promise<any> {
        const AUTH_USER: AuthUser = req.authUser;
        const formData = await MemorandumView.getMemorandumFormDataView(AUTH_USER,req.params.memorandum_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<MemorandumFormDataResponse>(res, formData.getValue());
    }

    public async createOrUpdateMemorandum(req: Request, res: Response): Promise<any> {
        const data = req.body;
        const isHabiles = data.dias_habiles;
        let cantidadDiasMemo = 0;
        if (isHabiles === "HABILES") {
            cantidadDiasMemo = await MemorandumService.contarDiasHabilesRango(
                data.fecha_inicio_viaje,
                data.fecha_fin_viaje,
            );
        } else {
            cantidadDiasMemo = await MemorandumService.contarDiasHabilesRangoInhabiles(
                data.fecha_inicio_viaje,
                data.fecha_fin_viaje,
            );
        }

        //verificar el avnce de los dias a viajar

        const ID_MEMORANDUM = data.id;
	
/**Verificacion de si documento ha sido llenado por otra persona (cite Repetido)*/
        let nuevoCodigo = data.cod_depart_memo;
		
        if(!ID_MEMORANDUM){
        
            const resultCites = await MemorandumView.getAllCites();
            if (resultCites.isFailure) return this.fail(res, String(resultCites.error));
            const allCites = resultCites.getValue().rows;          
		
            let auxMayor = 0; 	                    
            let pathAux;
            const documentoSigla = allCites.find((c) => c.nombre === data.cod_depart_memo)?.nombre;			
            const numeroDocumento = allCites.find((c) => c.nombre === data.cod_depart_memo)?.caption;	
        
            if(documentoSigla){
                          
                auxMayor = Number(numeroDocumento);     
                // expresion
                const regex = /([^\n]+?) Nº \d+\/\d{4}/g;
                const matches = documentoSigla.match(regex) || [];					
                const filtered = matches.filter(match => {				
                    const [path] = match.split(' Nº');																
                    pathAux = path;		                   
					
                });
                
                // generando el cite
                const fechaActual = new Date();                    
                const anioActual = fechaActual.getFullYear();                        
                const nuevoNumero = (auxMayor + 1).toString().padStart(3, '0'); // Formato con ceros a la izquierda                      
                nuevoCodigo = `${pathAux} Nº ${nuevoNumero}/${anioActual}`;              			

           }

        }
       

        /**Fin de la verificacion del documento */

        const props: MemorandumProps = {
			
            codDepartMemo: nuevoCodigo,//data.cod_depart_memo,
            autorizadoPor: data.autorizado_por,
            // cargoJefeUnidad      : data.cargo_jefe_unidad,
            fechaMemoRegistro: data.fecha_memo_registro,
            tipoComisionIDP: data.tipo_comision_idp,
            fechaInicioViaje: data.fecha_inicio_viaje,
            fechaFinViaje: data.fecha_fin_viaje,
            cantidadDias: cantidadDiasMemo,
            tipoMemoRepo: data.tipo_memo_repo,
            tipoTransporte: data.tipo_transporte,
            observacion: data.observacion,
            estadoMemorandum: data.estado_memorandum,
            notificacionMemo: data.notificacion_memo,
            diasHabiles: data.dias_habiles,
            aperturaViaticoId: data.apertura_viatico_id,
            aperturaPasajeId: data.apertura_pasaje_id,
            usuarioId: data.usuario_id,
            modificacion         : data.modificacion,
            obsModificacion      : data.obs_modificacion,
            fechaCambio          : data.fecha_cambio,
            estadoModificacion   : data.estado_modificacion,
            justificacion        : data.justificacion,
            aprobacionRRHHconta  : data.aprobacion_rrhh_conta,
            tiempoAprobacionUsuario : data.tiempo_aprobacion_usuario,
        };
        
        let result = null;
        if (ID_MEMORANDUM) {
            result = await MemorandumService.update(ID_MEMORANDUM, props);
            if (result.isFailure) return this.fail(res, String(result.error));
            return this.ok(res, result);
        }

        // Guardia de idempotencia: si por mala señal o doble clic el cliente reenvia
        // la misma peticion, evita crear un memorandum duplicado para el mismo
        // funcionario y el mismo rango exacto de fechas de viaje.
        const posiblesDuplicados = await MemorandumService.getAll({
            fid_usuario: data.usuario_id,
            fecha_inicio_viaje: data.fecha_inicio_viaje,
            fecha_fin_viaje: data.fecha_fin_viaje,
        });
        if (posiblesDuplicados.isSuccess) {
            const yaExisteActivo = posiblesDuplicados
                .getValue()
                .some((m) => ![ENUM_ANULADO, ENUM_RECHAZADO].includes(m.props.estadoMemorandum as string));
            if (yaExisteActivo) {
                return this.fail(res, "Ya existe un memorandum registrado para este funcionario con las mismas fechas de viaje.");
            }
        }

        result = await MemorandumService.create(props);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async destroyMemorandumDetalle(req: Request, res: Response): Promise<any> {
        const ID_DETALLE_DESTINO = req.params.detalle_id;
        const detalle_destino = await DetalleDestinoService.getById(ID_DETALLE_DESTINO);
        if (detalle_destino.isFailure) return this.fail(res, String(detalle_destino.error));

        const result = await DetalleDestinoService.delete(ID_DETALLE_DESTINO);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }    

    public async destroyMemorandum(req: Request, res: Response): Promise<any> {
        const ID_MEMO = req.params.memorandum_id;
        const memorandumR = await MemorandumService.getById(ID_MEMO);
        if (memorandumR.isFailure) return this.fail(res, String(memorandumR.error));

        /*Listado de Detalle Destino */
        const detalleDestino = await DetalleDestinoService.getAll();
        if (detalleDestino.isFailure) return Result.fail("Falló al obtener la DetalleDestino");

        //Lista de destinos
        const listaDestinos: DetalleDestinoOptionsFormModel[] = detalleDestino.getValue().map((item) => {
            return {
                id: item.id.toString(),
                nombre: item.props.memorandumId,
                caption: item.props.destinoReg,
            };
        });

        // Se filta por los destinos
        const filtroDestinos: DetalleDestinoOptionsFormModel[] = listaDestinos.filter((item) =>
            this.filtrarId(item.nombre, ID_MEMO),
        );

        if (filtroDestinos.length > 0) {
            filtroDestinos.forEach(async (item) => {
                const detalleDestinoR = DetalleDestinoService.getById(item.id);
                if ((await detalleDestinoR).isFailure) return this.fail(res, String((await detalleDestinoR).error));
                const resultDestino = await DetalleDestinoService.delete(item.id);
                if (resultDestino.isFailure) return Result.fail(result.error);
            });
        }
        //seleccionamos del listado de area el nombre del departamento y su sigla
        const result = await MemorandumService.delete(ID_MEMO);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }
    
    //filtramos por el tipo de id
    public filtrarId(item: string, id: string) {
        return item === id;
    }

    //Se agrega para memorandum detalle
    public async getTableMemorandumDetalle(req: Request, res: Response): Promise<any> {
        const AUTH_USER: AuthUser = req.authUser;
        const memorandums = await MemorandumView.getTableMemorandumDetalle(
            AUTH_USER,
            req.query,
            req.params.memorandum_id,
        );
        if (memorandums.isFailure) return this.fail(res, "Falló al obtener la tabla de proceso");
        return this.ok<any>(res, memorandums.getValue());
    }

    public async changeModificacion(req: Request, res: Response): Promise<any> {
        const memorandumId = req.params.memorandum_id;		
        const modificacion = Boolean(req.body.modificacion);	
        const obsModificacion = req.body.observacion;		
        const fechaCambio = req.body.fecha;	
        const estadoModificacion = req.body.estadoModif;	

        /* [dia, mes, anio] = fechaCambio.split('/').map(Number);
        const fechaFormat = new Date(anio, mes - 1, dia); // mes es 0-indexado*/

        // Guardando valores en los destinos 
         /*Listado detalle destino*/    
        const detalleDestino = await DetalleDestinoService.getAll();
        if (detalleDestino.isFailure) return Result.fail("Falló al obtener la Detalle Destino");
                  
        const listaDestinos: DetalleDestinoOptionsFormModel2[] = detalleDestino
              .getValue()
              .map((value) => {                
                return {                
                 id: value.id.toString(),
                 nombre: value.props.memorandumId,
                 caption : value.props.fechaDia,                                             
                    };            
                }) ;     

     // Se filta por los id de memo
      const filtroDestinos : DetalleDestinoOptionsFormModel2 [] = listaDestinos       
     .filter((value) => this.filtrarId(value.nombre,memorandumId)).sort((a, b) => a.caption! > b.caption! ? 1 : -1); 

     let observacionesString = "";    
     let fechaStringConcat = "";
     let modificacionMemo = false;
     let estadoModifMemo = "";
        
      for(let i = 0; i < filtroDestinos.length ; i++){
            const destinoFecha = filtroDestinos[i];
            const fechaString = destinoFecha.caption?moment(destinoFecha.caption).format("DD/MM/YYYY").toString(): '';
            const fechaCambioAux = fechaCambio[i];
			if(fechaString === fechaCambioAux.nombre){
				
                const props : ModificacionDetalleDestino= {						
					
                    // id : memorandumId,
                     modificacion: modificacion,
                     observacion: obsModificacion[i].b,                    
                     estadoObservacion: estadoModificacion[i].b,
                 }
                 // Datos para los campos del memorandum
                
                 if(estadoModificacion[i].b === "OBSERVADO"){
                    observacionesString = observacionesString.concat(obsModificacion[i].b).concat(" - ");                  
                    fechaStringConcat = fechaStringConcat.concat(fechaCambioAux.nombre).concat(" - ");                  
                    modificacionMemo = true;					
                    estadoModifMemo = "OBSERVADO"					
                 }
                
                 //Fin datos para el campo del memo
                const resultDestino = await DetalleDestinoService.update(filtroDestinos[i].id, props);	
                if (resultDestino.isFailure) return this.fail(res, "Falló al actualizar las observaciones del destino en detalle destino");
            }
      }
        //fin de guardado
        //Actualizacion en el memorandum       
        const propsMemo : ModificacionMemorandum = {			
			
            modificacion : modificacionMemo,
            obsModificacion : observacionesString,
            fechaCambio : fechaStringConcat,
            estadoModificacion: estadoModifMemo,
            estadoMemorandum:"PENDIENTE"
        }   
      
       const result = await MemorandumService.update(memorandumId, propsMemo);
   
        if (result.isFailure) return this.fail(res, "Falló al actualizar las observaciones de modificaciones al Memorandum");
        return this.ok(res);

         //fin actualizacion en el memorandum
    }

    //cambio de estado a aprobado
    public async changeApprove(req: Request, res: Response): Promise<any> {
        const ID_MEMORANDUM = req.params.memorandum_id;
        const estadoMemorandum = req.body.aprobado;
        const justificacion = req.body.justificacion;		
        const estadoPago = req.body.aprobado;
        const AUTH_USER: AuthUser = req.authUser;		
		
        
        if (estadoMemorandum === ENUM_ANULADO) {
            
             const viatico =await ViaticoService.getAll();
             if(viatico.isFailure) return Result.fail("Fallo al obtener el Personal");
             const viaticoResult = viatico.getValue();
            // SI VIENE DESDE VIATICOS HACER OTRO SI VIENE DESDE MEMO
             const viaticoID = viaticoResult.find((c) => c.props.memorandumId === ID_MEMORANDUM)?.id;//Revisar
             if(viaticoID){
            
                  //Actualizando estado en estado de pago viatico
                const result = await ViaticoService.update(viaticoID, { estadoPago });
                if (result.isFailure) return this.fail(res, "Falló al cambiar estado en Viatico");
              
                //Si la apertura tiene valores deben revertirse en apertura general y en apertura viaticos
                const viaticoByID = await ViaticoService.getById(viaticoID);
            
                if (viaticoByID.isFailure) return Result.fail<ViaticoFormDataResponse>("Viatico no encontrado");
                const props = viaticoByID.getValue();   
                const memorandum = await MemorandumService.getAll();
                if (memorandum.isFailure) return Result.fail("Falló al obtener la Memorandum");
                const memorandumResult = memorandum.getValue();
                //apertura viatico  debemos verificar que los destinos esten aprobados 
                const aperturaViatico = await AperturaViaticoService.getAll();
                if (aperturaViatico.isFailure) return Result.fail("Falló al obtener la apertura viatico");
                const aperturaViaticoResult = aperturaViatico.getValue();  
                //Actualizando valores de la apertura general PAsajes y viaticos 
                const aperturaViaticoId = memorandumResult.find((c)=>c.id === ID_MEMORANDUM)?.props.aperturaViaticoId|| "-";
                const aperturaPasajeId = memorandumResult.find((c)=>c.id === ID_MEMORANDUM)?.props.aperturaPasajeId|| "-";             
                const aperturaViaticoGeneralId = aperturaViaticoResult.find((c)=>c.id ===aperturaViaticoId)?.props.aperturaGeneralId || "";        
                const aperturaPasajeGeneralId = aperturaViaticoResult.find((c)=>c.id === aperturaPasajeId)?.props.aperturaGeneralId|| "";       
                //Sacando valores para el historial
                const codigoMemorandum = memorandumResult.find((a)=>a.id ===ID_MEMORANDUM)?.props.codDepartMemo ||"";	
                
                //PASAJES
                const descripcionPasajes = "Reversion del Memorandum codigo de cite: ".concat(codigoMemorandum).concat("Por ANULACION");
                    
                const propsPA: HistorialAperturaProps = {               
                
                    titulo     : "REVERSION PASAJES ANULACION: ".concat(codigoMemorandum),
                    descripcion: descripcionPasajes,
                    gasto      : props.props.totalPasajes,
                    debeHaber  : "INGRESO",
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
                
                    debe = 0;
                    haber = props.props.totalPasajes ;
                    saldo = Number(saldo_anterior) + Number(haber);
                    const propsHistorialGasto = {
                                                
                        fecha      : new Date(),
                        descripcion: "REVERSION PASAJES POR ANULACION: ".concat(codigoMemorandum),
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
                    const haberPasaje = haber;  
                    const aperturaViaticoIdP = aperturaViaticoResult.find((c)=>c.props.aperturaGeneralId ===aperturaPasajeGeneralId)?.id||"";                
                    const montoRestante = aperturaViaticoResult.find((c)=>c.props.aperturaGeneralId ===aperturaPasajeGeneralId)?.props.presupuestoRestante||0;         
                    const estado = montoRestante > 100?CON_PRESUPUESTO:SIN_PRESUPUESTO;// valor que se debe cambiar minimo en pasajes
                    const presupuestoRestante = Number(montoRestante) + Number(haberPasaje);     
                    const resultPas = await AperturaViaticoService.update(aperturaViaticoIdP, { presupuestoRestante ,estado});
                    if (resultPas.isFailure) return this.fail(res, "Falló al cambiar el Restante de la Apertura Viatico Pasajes");

                  // Actualizando valores en apertura general 
                    
                    const aperturaGeneralIDP = aperturaViaticoResult.find((c)=>c.id === aperturaViaticoIdP)?.props.aperturaGeneralId||"";                   
                    const resultAperturaGeneralP = await AperturaGeneralService.update(aperturaGeneralIDP, { presupuestoRestante });                    
                    if (resultAperturaGeneralP.isFailure) return this.fail(res, "Falló al cambiar el Restante de la Apertura General Pasajes");
                }

                //VIATICOS
                const  descripcionViatico = "Reversion del Memorandum codigo de cite: ".concat(codigoMemorandum).concat("Por ANULACION");
                 const propsVA: HistorialAperturaProps = {        
                
                    titulo     : "REVERSION VIATICOS ANULACION: ".concat(codigoMemorandum),
                    descripcion: descripcionViatico,
                    gasto      : props.props.totalViatico,
                    debeHaber  : "INGRESO",
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
                
                    debe = 0;
                    haber = props.props.totalViatico ;
                    saldo = Number(saldo_anterior) + Number(haber);
                    const propsHistorialGasto = {
                        
                        fecha      : new Date(),
                        descripcion: "REVERSION DE VIATICOS POR ANULACION: ".concat(codigoMemorandum),
                        debe       : debe,
                        haber      : Number(haber),
                        saldo      : Number(saldo), 
                        estado     : "",
                        historialAperturaId   : id_historial_viatico,
                        aperturaId           : aperturaViaticoGeneralId,           
                    
                    };
                    const resultHistorial = await HistorialGastoService.create(propsHistorialGasto);
                    if (resultHistorial.isFailure) return this.fail(res, String(resultHistorial.error));
                 
                    const haberViatico = haber;  
                    const aperturaViaticoIdV = aperturaViaticoResult.find((c)=>c.props.aperturaGeneralId ===aperturaViaticoGeneralId)?.id||"";                
                    const montoRestante = aperturaViaticoResult.find((c)=>c.props.aperturaGeneralId ===aperturaViaticoGeneralId)?.props.presupuestoRestante||0;         
                    const estado = montoRestante > 200?CON_PRESUPUESTO:SIN_PRESUPUESTO;//Se debe determinar el minimo de Viticos
                    const presupuestoRestante = Number(montoRestante) + Number(haberViatico);     
                    const resultVia = await AperturaViaticoService.update(aperturaViaticoIdV, { presupuestoRestante ,estado});
                    if (resultVia.isFailure) return this.fail(res, "Falló al cambiar el Restante de la Apertura Viatico");

                      // Actualizando valores en apertura general     
                    const aperturaGeneralIDV = aperturaViaticoResult.find((c)=>c.id === aperturaViaticoIdV)?.props.aperturaGeneralId||""; 
                    const resultAperturaGeneralV = await AperturaGeneralService.update(aperturaGeneralIDV, { presupuestoRestante });					
                    if (resultAperturaGeneralV.isFailure) return this.fail(res, "Falló al cambiar el Restante de la Apertura General Viatico");   
                }      

                // Fin reversion valores de apertura siempre y cuando se anule cuando ya haya llegado a cajas
              }
             const resultMemo = await MemorandumService.update(ID_MEMORANDUM, { estadoMemorandum, justificacion });
             if (resultMemo.isFailure) return this.fail(res, "Falló al cambiar estado en Viatico");
        }

        if (estadoMemorandum === ENUM_RECHAZADO || estadoMemorandum === ENUM_REPOSICION_VENCIDA) {
             const resultMemo = await MemorandumService.update(ID_MEMORANDUM, { estadoMemorandum, justificacion });
             if (resultMemo.isFailure) return this.fail(res, "Falló al cambiar estado en Viatico");
        }
        
        

        if (estadoMemorandum === ENUM_APROBADO_CONTABILIDAD) {
            //cuando el memorandum se encuentra aprobado se crea la fila en viaticos para editar los valores
            const memorandumAprove = await MemorandumService.getById(ID_MEMORANDUM);
            if (memorandumAprove.isFailure) return this.fail(res, String(memorandumAprove.error));
            //detalle destino

            const dateString = "01/01/2024"; // formato DD/MM/YYYY
            const parts = dateString.split("/"); // Se divide en partes (día, mes, año)
            const dateFormat = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);

            const viaticoProps: ViaticoProps = {
                numeRecibo: 0,
                fechaPagoViatico: new Date(), //verificar
                sumaPasajeIda: 0,
                sumaPasajeRetorno: 0,
                tipoPasajeGD: "",
                totalPasajes: 0,
                totalViatico: 0,
                liquidoPagable: 0,
                estadoPago: "PENDIENTE",
                estadoRecibo: "",
                fechaAnulacion: dateFormat, //new Date(),// cambiarlo por primera fecha de gestion
                notificacionViatico: "",
                memorandumId: ID_MEMORANDUM,
                escalaId: "",
            };
            const viaticoCreate = await ViaticoService.create(viaticoProps);
            if (viaticoCreate.isFailure) return this.fail(res, "Falló al crear Viatico despues de aprobar memorandum");
            //actualizando detalle destino

            const viatico = await ViaticoService.getAll();
            if (viatico.isFailure) return Result.fail("Falló al obtener el Viatico");
            const viaticoResult = viatico.getValue();
            const viaticoId = viaticoResult.find((c) => c.props.memorandumId === ID_MEMORANDUM)?.id || "";

            const detalleDestino = await DetalleDestinoService.getAll();
            if (detalleDestino.isFailure) return Result.fail("Falló al obtener la Detalle Destino");
            //const detalleDestinoResult = detalleDestino.getValue();

            const listaDestinos: DetalleDestinoOptionsFormModel[] = detalleDestino.getValue().map((item) => {
                return {
                    id: item.id.toString(),
                    nombre: item.props.memorandumId,
                    caption: item.props.viaticoId,
                };
            });
            // Se filta por los destinos
            const filtroDestinos: DetalleDestinoOptionsFormModel[] = listaDestinos.filter((item) =>
                this.filtrarId(item.nombre, ID_MEMORANDUM),
            );

            for (let i = 0; i < filtroDestinos.length; i++) {
                const detalleDestinoUpdate = await DetalleDestinoService.update(filtroDestinos[i].id, { viaticoId });
                if (detalleDestinoUpdate.isFailure)
                    return this.fail(res, "Falló al actualizar detalle destino con viatico");
            }
            //fin actualizando detalle destino
        }

        if(ESTADO_MEMORANDUMS_APROBACION.has(estadoMemorandum)){
            
             const usuario =  AUTH_USER.uid;           
             const fechaAprobacion  = new Date()?moment(new Date()).format("DD/MM/YYYY HH:mm:ss").toString(): '';             
             const memo = await MemorandumService.getById(ID_MEMORANDUM);                
             const tiempoActual = memo.getValue().props.tiempoAprobacionUsuario || [];             
             const usuarioActual = memo.getValue().props.aprobacionRRHHconta || [];
             
             const  aprobacionRRHHconta = Array.isArray(usuarioActual) ? usuarioActual : JSON.parse(usuarioActual);
             const  tiempoAprobacionUsuario = Array.isArray(tiempoActual) ? tiempoActual : JSON.parse(tiempoActual);
             
             aprobacionRRHHconta.push(usuario);
             tiempoAprobacionUsuario.push(fechaAprobacion);
             const result = await MemorandumService.update(ID_MEMORANDUM, { estadoMemorandum, aprobacionRRHHconta:aprobacionRRHHconta,tiempoAprobacionUsuario:tiempoAprobacionUsuario });             
             if (result.isFailure) return this.fail(res, "Falló al cambiar estado en memorandum");
        }else if(estadoMemorandum === ENUM_PENDIENTE){
            const result = await MemorandumService.update(ID_MEMORANDUM,  { estadoMemorandum, aprobacionRRHHconta:[],tiempoAprobacionUsuario:[] });             
             if (result.isFailure) return this.fail(res, "Falló al cambiar estado en memorandum");
        }
        else{
            const result = await MemorandumService.update(ID_MEMORANDUM, { estadoMemorandum });
             if (result.isFailure) return this.fail(res, "Falló al cambiar estado en memorandum");
        }
        

        return this.ok(res);
    }
public filtrarEstado(item: string, estado: string) {
        return item != estado;
 }

    public async getPDFMemorandumReporte(req: Request, res: Response): Promise<any> {
        const id: string = req.body.id;
        const memorandumResult = await MemorandumView.getPDFMemorandum(req.authUser, id);
        if (memorandumResult.isFailure) return this.fail(res, String(memorandumResult.error));

        const result = memorandumResult.getValue();
        return MemorandumReport.creaPDF(result, "memorandum", res);
    }

    //Se agrega para memorandum detalle
    public async getTipoPCP(req: Request, res: Response): Promise<any> {
        const memorandums = await MemorandumView.getTipoPCP(req.params.memorandum_id);
        if (memorandums.isFailure) return this.fail(res, "Falló al obtener El tipo de comisión");
        return this.ok<MemorandumTipoPCPOptionsFormModel>(res, memorandums.getValue());
    }

    //Se agrega para memorandum detalle
    public async getControlCountDias(req: Request, res: Response): Promise<any> {
        const memorandums = await MemorandumView.getControlCountDias(req.params.memorandum_id);
        if (memorandums.isFailure) return this.fail(res, "Falló al obtener El control interno de conteo de dias");
        return this.ok<any>(res, memorandums.getValue());
    }

    //Se agrega para detalle memorandum
    public async getDatosMemorandum(req: Request, res: Response): Promise<any> {
        const detalleDestino = await MemorandumView.getDatosMemorandum(req.params.memorandum_id);
        if (detalleDestino.isFailure) return this.fail(res, "Falló al obtener los detalles del memorandum");
        return this.ok<any>(res, detalleDestino.getValue());
    }

    public async getCodMemoData(req: Request, res: Response): Promise<any> {
        const nro = String(req.params.nro);
        //  const recibo = req.params.recibo;
        const codMemo = await MemorandumService.getAll();
        if (codMemo.isFailure) return this.fail(res, "Memorandum no encontrado");
        const codMemoResult = codMemo
            .getValue()
            .filter((d) => d.props.codDepartMemo === nro)
            .map((dd) => dd.props.codDepartMemo);
        return this.ok<any>(res, { nro: codMemoResult.length > 0 });
    }
    public async getDiaHabil(req: Request, res: Response): Promise<any> {
        const memorandums = await MemorandumView.getDiaHabil(req.params.memorandum_id);
        if (memorandums.isFailure) return this.fail(res, "Falló al obtener el dia Habil");
        return this.ok<MemorandumTipoPCPOptionsFormModel>(res, memorandums.getValue());
    }

    public async changeState(req: Request, res: Response): Promise<any> {
        const ID_MEMORANDUM = req.params.memorandum_id;
        const estadoMemorandum = req.body.estado;

        const result = await MemorandumService.update(ID_MEMORANDUM, { estadoMemorandum });
        if (result.isFailure) return this.fail(res, "Falló al cambiar estado");

        return this.ok(res);
    }

    public async getAllCites(req: Request, res: Response): Promise<any> { 
        const cite = await MemorandumView.getAllCites();	
        if (cite.isFailure) return this.fail(res, 'Falló al obtener el CITE ');
        return this.ok<any>(res, cite.getValue());
      }
       public async getCiteServer(req: Request, res: Response): Promise<any> {
        const cite = await MemorandumView.getCiteServer(req.params.id_usuario);
        if (cite.isFailure) return this.fail(res, "Falló al obtener el CITE");
        return this.ok<any>(res, cite.getValue());
    }

 public async changeMemoRepo(req: Request, res: Response): Promise<any> {
       
        const ID_MEMORANDUM = req.params.memorandum_id;		
        const tipoMemoRepo = req.body.tipo;       
        
     //   if (tipo_memo_repo === "REPOSICION") {
          
        const memorandumAprove = await MemorandumService.getById(ID_MEMORANDUM);		
        if (memorandumAprove.isFailure) return this.fail(res, String(memorandumAprove.error));
            //detalle destino
        const result = await MemorandumService.update(ID_MEMORANDUM, { tipoMemoRepo });
         if (result.isFailure) return this.fail(res, "Falló al cambiar el tipo de memorandum");
    //    }

        /*const result = await MemorandumService.update(ID_MEMORANDUM, { estadoMemorandum });
        if (result.isFailure) return this.fail(res, "Falló al cambiar estado en memorandum");*/

        return this.ok(res);
    }      
}
