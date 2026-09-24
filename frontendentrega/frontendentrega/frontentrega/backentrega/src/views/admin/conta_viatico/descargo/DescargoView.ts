import { Result } from "../../../../base/types/Result";
import { findAndCountResult, obtenerFeriadosBoliviaOffline, queryStringToArray, } from "../../../../tools/util";
import moment from "moment";
import  DescargoService  from "../../../../core/admin/conta_viatico/descargo";
import  CargoService  from "../../../../core/rrhh/cargo";
import  PersonalService  from "../../../../core/rrhh/personal";
import  ViaticoService  from "../../../../core/admin/conta_viatico/viatico";
import  UsuarioService  from "../../../../core/system/autenticacion/usuario";
import  MemorandumService  from "../../../../core/admin/conta_viatico/memorandum";
import  DetalleDestinoService  from "../../../../core/admin/conta_viatico/detalle_destino";
import { DetalleDestinoFormDataResponse, DetalleDestinoOptionsFormModel } from "../detalle_destino/DetalleDestinoView";
import  EscalaDestinoService  from "../../../../core/admin/conta_viatico/escala_destino";
import  AperturaViaticoService  from "../../../../core/admin/conta_viatico/apertura_viatico";
import { EscalaFormDataResponse } from "../escala/EscalaView";
import  EscalaService  from "../../../../core/admin/conta_viatico/escala";
import { AuthUser } from "../../../../base/types/AuthUser";

import  AreaService from "../../../../core/rrhh/area";
import { ENUM_ANULADO, ENUM_APROBADO, ENUM_APROBADO_CONTABILIDAD, ENUM_DESCARGADO, ENUM_DESCARGADO_Y_PRESENTA_INFORME, ENUM_GENERAL, ENUM_PENDIENTE, ENUM_PRESENTA, ENUM_PRESENTA_INFORME, ENUM_REPORTE_FF_OF, ENUM_REPORTE_PARA_RRHH, ENUM_REPORTE_POR_BENEFICIARIO, ENUM_REPORTE_POR_PLANILLA, ENUM_REPORTE_POR_PROYECTO, ENUM_REPORTE_POR_TIPO } from "../../../../base/constants/enum";
import { Column } from "exceljs";
import AperturaGeneralService from "../../../../core/admin/apertura/apertura_general";

type DescargoTableModel = {
    id                     : string;
    fecha_descargo         : Date;
    fecha_descargo_format?  : string;
    estado_descargo        : string;
    viatico_pasaje_real    : number;
    monto_despositado      : number;
    monto_descargo         : number;
    saldo_descargo         : number;
    presenta_informe       : string;
    viatico_real : number;
    observacion_estado : string;
    observacion_descargo : string;
    prorroga               : string;
    tiempo_descargo        : number;
    notificacion_descargo  : string;
    viatico_id             : string;
//Agregando campos para muestra
    num_recibo             : number;
    usuario_nombre         : string;
    usuario_cargo          : string;

   usuario_ci?               : string;
   usuario_tipo?             : string;
   liquido_pagable?          : number;
   fecha_ida?                : string;
   fecha_retorno?            : string;
   destino?                  : string;
   cod_memo?                 : string;   
   tipo_memo_repo?           : string;
   partida_presupuestaria?   : string;
   ff_of?                    : string;
   area?                     : string;
   sigla?                    : string;
   estado_pago?              : string;
   tipo_comision_idp?        : string;
   fecha_anulacion?          : Date;
   fecha_anulacion_recibo?   : string;

};

export type GetDescargosTableResponse = {
    rows: DescargoTableModel[];
    count: number;
};

export type DescargoFormDataResponse = {
    id                     : string;
    fecha_descargo         : string;
    estado_descargo        : string;
    viatico_pasaje_real    : number;
    monto_despositado      : number;
    monto_descargo         : number;
    saldo_descargo         : number;
    presenta_informe       : string;
    viatico_real : number;  
    observacion_estado : string;
    observacion_descargo : string;
    prorroga               : string;
    tiempo_descargo        : number;
    notificacion_descargo  : string;
    viatico_id             : string;

    usuario_nombre?           : string;
    usuario_cargo?            : string;
    usuario_ci?               : string;
    nume_recibo?              : number;               
    //liquido_pagable?          : number;
    fecha_inicio_viaje?       : string;
    fecha_fin_viaje?          : string;
    destino?                  : string;
    cod_depart_memo?                 : string; 
    cantidad_dias?            : number; 
    tipo_comision_idp?        : string; 
    escala_exterior?          : string;
    suma_pasaje_ida?          : number;
    suma_pasaje_retorno?      : number;
    total_pasajes?            : number;
    categoria_usuario?        : string;
    tipo_comision_idp_escala? : string;
    viaticos_por_dia?         : number;
    escala_id?               : string;
    fecha_memo_registro?     : string;
    memorandum_id?           : string;
    fecha_pago_viatico? : string;
    total_viatico?      : number;
    liquido_pagable?    : number;
    conteo_dias_detalle? : number;
    
    usuario_id?          : string;
};


export type ReportFilters = {
    tipo        ?: string;
    nombre      ?: string;
    telefono    ?: string;
    direccion   ?: string;

    _limit?: string;
    _page?: string;
    q?: string;
};
export type ViaticoItem = { //cambiar
    id     : string;
    fecha_descargo         : Date;
    fecha_descargo_format?  : string;
    estado_descargo        : string;
    viatico_pasaje_real    : number;
    monto_depositado      : number;
    monto_descargo         : number;
    saldo_descargo         : number;
    presenta_informe       : string;
    viatico_real : number;
    observacion_estado : string;
    observacion_descargo : string;
    prorroga               : string;
    tiempo_descargo        : number;
    notificacion_descargo  : string;
    viatico_id             : string;

    //viatico
    gestion?: string;
    tipo?   : string;
    codigo? : string;
    nume_recibo?           : number;
    fecha_pago_viatico?    : Date;
     fecha_pago_viatico_format?   : string;
    suma_pasaje_ida?       : number;
    suma_pasaje_retorno?   : number;
    tipo_pasaje_gd?        : string;
    total_pasajes?         : number;
    total_viatico?         : number;
    liquido_pagable?       : number;
    estado_pago?           : string;
    estado_recibo?         : string;
    fecha_anulacion?       : Date;
    notificacion_viatico?  : string;
    memorandum_id?         : string | null;
    escala_id?             : string | null;
    //campos reporte

    apertura_programatica? : string;
    ff_of?                 : string;
    usuario_ci?            : string,
    usuario_nombre?        : string;   
    sigla?                 : string;   
    cod_depart_memo?       : string;
    destino?               : string;
    fecha_inicio_viaje?    : string;
    fecha_fin_viaje?       : string;
    total_viaticos?        : number;
    fecha_rango_inicio?    : string;
    fecha_rango_fin?       : string; 
    // por tipo de reporte
    tipo_reporte?          : string;
    area_nombre?           : string;
    area_id?               : string;
    fuente_nombre?         : string;
    nombre_beneficiario?   : string; 
    usuario_tipo?          : string;   

    total_dia_monto?      : number;   
    fecha_inicio?   : string;
    fecha_fin?      : string;   
    estado_modificacion?      : string;   
   
    //numero recibo
    //total_pasjes
    //liquido_pagable
    //Presenta Informe
    //descarga
};
export type ViaticoDataR = {
    tipo_reporte            : string;
    lista_areas             : any[];
    lista_ffof              : string[]; 
    idBeneficiario          :  ViaticoItem[];
    rows                    : ViaticoItem[];
    fecha_inicio_filtro?    : string;
    fecha_fin_filtro?       : string;
};
export type InfoViaticoModel = {
    codigo    : string;
    nombre    : string;
    fecha     : string;
    email     : string;
};
export type ViaticoDataResponse = {
    info?: InfoViaticoModel;
    data?: ViaticoDataR;
};


export type AreaFormModel = {
    id: string;
    nombre: string;
    apertura_programatica?: string;
    sigla?: string;
};

export type ReportGeneral = {
nume_recibo           : number;
apertura_programatica : string; 
ff_of                 : string; 
usuario_ci            : string;
usuario_nombre        : string;
sigla                 : string;
cod_depart_memo       : string;
destino               : string;
fecha_inicio_viaje    : string;
fecha_fin_viaje       : string;
total_pasajes         : number;
total_viatico        : number;
liquido_pagable       : number;
tipo_usuario?         : string;
descargo?              : number;
deposito?             : number;
descuento?             : number;
area_id?                 : string;
estado_pago?           : string;

///DATOS DE VIATICOS
 
    
    estado_recibo?         : string;
    fecha_anulacion?       : string;
    notificacion_viatico?  : string;
    memorandum_id?         : string | null;
    escala_id?             : string | null;

    //Ingresando nuevos parametros de memorandum y escala
    cod_memorandum? : string;
    fecha_memo? : Date;
    usuario_id? : string;
    ci?: string;
    destino_id? : string;
    tipo_comision_idp?: string;
    fecha_viaje_ida? : string;
    fecha_viaje_retorno? : string;
    transporte_op? : string;
    apertura_prog? : string;
    fondo_financia? : string;
    sisin? : string;
    fecha_format_memo? :string;
    tipo_memo_repo? :string;
    fecha_pago_viatico ? : Date;
    fecha_pago_viatico_format ? : string;
    //activo                : boolean;

    //Campos de memorandum para el reporte de RRHH
    modificacion?            : boolean,
    obs_modificacion?        : string | null,
    fecha_cambio?            : string,
    estado_modificacion?     : string,
    usuario_tipo?            : string;


}



export class DescargoView {
      public async getDescargosTable(query: any): Promise<Result<{ rows: DescargoTableModel[] }>> {
			
            const descargo = await DescargoService.getAll();
            if (descargo.isFailure) return Result.fail("Falló al obtener la Descargo");
            const descargoResult = descargo.getValue();

            /*Listado de cargos*/
            const cargo = await CargoService.getAll();
            if(cargo.isFailure) return Result.fail("Fallo al obtener el Cargo");
            const cargoResult = cargo.getValue();
             /*Listado de usuarios*/
             const usuario = await UsuarioService.getAll();
             if(usuario.isFailure) return Result.fail("Fallo al obtener el Usuario");
             const usuarioResult = usuario.getValue();
            /*Listado de personal*/
            const personal =await PersonalService.getAll();
            if(personal.isFailure) return Result.fail("Fallo al obtener el Personal");
            const personalResult = personal.getValue();
             /*Listado de Viaticos*/
             const viatico =await ViaticoService.getAll();
             if(viatico.isFailure) return Result.fail("Fallo al obtener el Personal");
             const viaticoResult = viatico.getValue();

             const memorandum = await MemorandumService.getAll();
             if (memorandum.isFailure) return Result.fail("Falló al obtener la Memorandum");
             const memorandumResult = memorandum.getValue();

             const detalleDestino = await DetalleDestinoService.getAll();
             if (detalleDestino.isFailure) return Result.fail("Falló al obtener la Detalle destino");
             const detalleDestinoResult = detalleDestino.getValue();

              /*Listado de escala Destino*/
            const escalaDestino =await EscalaDestinoService.getAll();
            if(escalaDestino.isFailure) return Result.fail("Fallo al obtener el Escala Destino");
            const escalaDestinoResult = escalaDestino.getValue();
            /*Listado de apertura*/
            const apertura =await AperturaViaticoService.getAll();
            if(apertura.isFailure) return Result.fail("Fallo al obtener el Apertura");
            const aperturaResult = apertura.getValue();
             /*Listado de apertura*/
             const area =await AreaService.getAll();
             if(area.isFailure) return Result.fail("Fallo al obtener el area");
             const areaResult = area.getValue();
      
                           
            const result: DescargoTableModel[] = descargoResult.map((item) => {

            const memorandumID = viaticoResult.find((c) => c.id === item.props.viaticoId)?.props.memorandumId|| "-";
            const numeroRecibo = viaticoResult.find((c) => c.id === item.props.viaticoId)?.props.numeRecibo||0;
            const usuarioID = memorandumResult.find((c) => c.id === memorandumID)?.props.usuarioId||"-"; 
            const tipoMemoRepo = memorandumResult.find((c) => c.id === memorandumID)?.props.tipoMemoRepo||"-"; 
            const aperturaID = memorandumResult.find((c) => c.id === memorandumID)?.props.aperturaViaticoId||"-";			
            const partidaPresupuestaria = aperturaResult.find((c) => c.id === aperturaID)?.props.aperturaProgramatica||"-";			
            const codFte = aperturaResult.find((c) => c.id === aperturaID)?.props.codFte||"-";
            const codOrg = aperturaResult.find((c) => c.id === aperturaID)?.props.codOrg||"-";  
            const ffOf = codFte.concat("-").concat(codOrg);
            const areaId = aperturaResult.find((c) => c.id === aperturaID)?.props.areaId||"-";  
            const area = areaResult.find((c) => c.id === areaId)?.props.nombre||"-"; 
            const siglaUsuario = areaResult.find((c)=> c.id === areaId)?.props.sigla||"-"; 

            /*seleccionamos del listado de area el nombre del departamento y su sigla*/
            const usuarioNombre = usuarioResult.find((c) => c.id === usuarioID)?.props.fullname|| "-";//Revisar
            const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === usuarioID)?.props.cargoId|| "-";
            const cargoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.nombre|| "-";
           
            const ciUsuario = usuarioResult.find((c) => c.id === usuarioID)?.props.ci|| "-";
            const fechaIda = memorandumResult.find((c) => c.id === memorandumID)?.props.fechaInicioViaje; 
            const fechaRetorno = memorandumResult.find((c) => c.id === memorandumID)?.props.fechaFinViaje;          			
            const codigoMemo = memorandumResult.find((c) => c.id === memorandumID)?.props.codDepartMemo||"-"; 
            const cantidadDias = memorandumResult.find((c) => c.id === memorandumID)?.props.cantidadDias||"-"; 
            //const destino = detalleDestinoResult.find((c) => c.props.memorandumId === memorandumID)?.props.destinoReg||"-"; 
             const destino = detalleDestinoResult.filter(c => c.props.memorandumId === memorandumID).find(c => c.props.destinoReg)?.props.destinoReg || "-";			
            const liquidoPagable = viaticoResult.find((c) => c.props.memorandumId === memorandumID)?.props.liquidoPagable||0;
            const estadoPago = viaticoResult.find((c) => c.props.memorandumId === memorandumID)?.props.estadoPago||"-";
             const fechaPagoViatico = viaticoResult.find((c) => c.props.memorandumId === memorandumID)?.props.fechaPagoViatico||"-";
              const tipoComisionIDP = memorandumResult.find((c) => c.id === memorandumID)?.props.tipoComisionIDP;          
            /* Sacamos el tipo de usuario */
            const tipoUsuario = cargoResult.find((c) => c.id  === cargoUsuarioid)?.props.tipo || "-";
            const fechaAnulacionRecibo = viaticoResult.find((c) => c.props.memorandumId === memorandumID)?.props.fechaAnulacion;


                //Lista de destinos
                const listaDestinos: DetalleDestinoOptionsFormModel[] = detalleDestino
                .getValue()
                .map((item) => {                
                        return {                
                            id: item.id.toString(),
                            nombre: item.props.memorandumId,
                            caption : item.props.destinoReg,
                            estado: item.props.estado,                                             
                        };            
                }) ;         

                // Se filta por los destinos
                const filtroDestinos1 : DetalleDestinoOptionsFormModel [] = listaDestinos
                .filter((value) => this.filtrarId(value.nombre, memorandumID)); 
                const filtroDestinos : DetalleDestinoOptionsFormModel [] = filtroDestinos1
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                .filter((value) => this.filtrarEstadoDestino(value.estado!,'SIN_VIAJE' )); 

                            // filtramos por el tipo de nombre
                const elementosUnicos = new Map(filtroDestinos.map(value => [value.caption, value]));
				
                 let destinoNombre = '';
            
                    if(elementosUnicos.size > 1){
                        
                        //recorrer 
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        elementosUnicos.forEach((value, key) => {
                        
                            if(escalaDestinoResult.find((c) => c.props.destino === value.caption)){
                                
                                destinoNombre = destinoNombre.concat( escalaDestinoResult.find((c) => c.props.destino === value.caption)?.props.destino|| "-").concat(' - ');					
                            
                            }else if( escalaDestinoResult.find((c) => c.id === destino)){
                                destinoNombre = destinoNombre.concat((escalaDestinoResult.find((c) => c.id === destino))?
                                escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-":destino).concat(' - ');   
                                
                            }
                            else {
                                destinoNombre = destinoNombre.concat(destino).concat(' - ');               
                            }              
                    });          
                    }else{
                        destinoNombre = (escalaDestinoResult.find((c) => c.id === destino))?
                        escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-":destino;   
                            
                    }
               //Actualizando Fechas
             
               if(item.props.tiempoDescargo > 0){
                    
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const dias = this.generarRangoFechas(fechaRetorno!,new Date()).length;                                                    
                    const OCHO_DIAS = 9;//(dias ===1)?9:8;   // 9 considerando el mismo dia de retorno  
                    let tiempoDescargo = OCHO_DIAS - dias;	                   

                    if(tiempoDescargo <= 9 || item.props.estadoDescargo.includes('DESCARGADO')){               
                        if(tiempoDescargo <= 0){
                            tiempoDescargo = 0; 
                        } 
                        this.actualizarTiempo(item.id, tiempoDescargo);	                   
                    }
               }
               
              
                //Actualizando Fechas 
                return {
                    id                          : String(item.id),
                    fecha_descargo_format       : item.props.fechaDescargo && moment(item.props.fechaDescargo).year() >= 1990? moment(item.props.fechaDescargo).format('DD/MM/YYYY'): '-',
                    fecha_descargo              : item.props.fechaDescargo,
                    estado_descargo             : item.props.estadoDescargo,
                    viatico_pasaje_real         : item.props.viaticoPasajeReal,
                    monto_despositado           : item.props.montoDespositado,
                    monto_descargo              : item.props.montoDescargo,
                    saldo_descargo              : item.props.saldoDescargo,
                    presenta_informe            : item.props.presentaInforme,
                    viatico_real                : item.props.viaticoReal,
                    observacion_estado          : item.props.observacionEstado,
                    observacion_descargo        :item.props.observacionDescargo,
                    prorroga                    : item.props.prorroga,
                    tiempo_descargo             : item.props.tiempoDescargo,
                    notificacion_descargo       : item.props.notificacionDescargo,
					viatico_id                  : item.props.viaticoId, 
                    num_recibo             : numeroRecibo,
                    usuario_nombre         : usuarioNombre,
                    usuario_cargo          : cargoUsuario, 
                    usuario_tipo           : tipoUsuario,
                    
                    usuario_ci              : ciUsuario,
                    liquido_pagable         : liquidoPagable,
                    fecha_ida               : fechaIda?moment(fechaIda).format("DD/MM/YYYY").toString(): '',
                    fecha_retorno           : fechaRetorno?moment(fechaRetorno).format("DD/MM/YYYY").toString(): '',
                    destino                 : destinoNombre,
                    cod_memo                : codigoMemo,
                    cantidad_dias           : cantidadDias,
                    tipo_memo_repo          : tipoMemoRepo,
                    partida_presupuestaria  : partidaPresupuestaria,
                    ff_of                   : ffOf,
                    area                    : area,
                    sigla                   : siglaUsuario,
                    estado_pago             : estadoPago,
                    fecha_pago_viatico      : fechaPagoViatico?moment(fechaPagoViatico).format("DD/MM/YYYY").toString(): '',
                    tipo_comision_idp       : tipoComisionIDP,
                    fecha_anulacion_recibo  : fechaAnulacionRecibo!.getFullYear() >2025?moment(fechaAnulacionRecibo).format("DD/MM/YYYY").toString(): '-',
                };
            }).sort((a, b) => a.num_recibo > b.num_recibo ?-1:1);
    
             const response = findAndCountResult(result, query);
            //  const response = findAndCountResult(result);
							
            return Result.ok(response);
    }

    public filtrarId(item:string, id:string) { 
        return (item === id); 
       }

    //Filtrar por nombre y apellido
   public filtrarNombreApellido(itemNombre:string, nombre:string, apellido:string) { 
            
        if( nombre === undefined){
            const apellidoUpper = apellido.toUpperCase();
            return itemNombre.includes(apellidoUpper); 
			
        }else if(apellido === undefined){
            const nombreUpper = nombre.toUpperCase();
            return itemNombre.includes(nombreUpper); 
        }else {
          // Filtrar si ambos, nombre y apellido, están definidos
             const nombreUpper = nombre.toUpperCase();
             const apellidoUpper = apellido.toUpperCase();
             return itemNombre.includes(nombreUpper) && itemNombre.includes(apellidoUpper);
        }      
       }   

       public filtrarCI(item:string, ci:string) {             
        return (item === ci);     
       }  

      

    public filtrarEstadoDestino(item:string, estado:string) { 
        return (item != estado); 
     } 

       // generar rango de fechas

    public generarRangoFechas(fechaInicio: Date, fechaFin: Date): Date[] {				
						
        // verificar si es feriado
        const anho = new Date().getFullYear();
        const mesActual = new Date().getMonth() + 1;       
        let feriados: string[] = [];      
        feriados = obtenerFeriadosBoliviaOffline(anho, mesActual >= 9);

        const fechas: Date[] = [];
        const fechaActual = new Date(fechaInicio);			
       
    if (fechaInicio.getDate() < fechaFin.getDate() ) {         
        
            fechaFin.setDate(fechaFin.getDate()+1);				
        }      
        // Bucle que recorre desde fechaInicio hasta fechaFin
        while (fechaActual <= fechaFin) {
            const fechaFormateada = fechaActual.toISOString().slice(0, 10).toString();				
            const esferiadoFecha =  feriados.includes(fechaFormateada);					
            const diaFecha = fechaActual.getDay();             					
            if (!esferiadoFecha) {
                if(!(diaFecha === 0 || diaFecha === 6)){
                    fechas.push(new Date(fechaActual));
                }              
            }                          
            // Incrementar la fecha actual en 1 día
            fechaActual.setDate(fechaActual.getDate() + 1);			 
        }        
        
        return fechas;
		
	
    }   


    public async actualizarTiempo(id:string, tiempoDescargo: number):Promise<unknown> {
        const result = await DescargoService.update(id, { tiempoDescargo }); 
        if (result.isFailure) return Result.fail("Falló al cambiar tiempo Descargo en Descargo");
        return Result.ok("Tiempo actualizado correctamente");
    }


    public async getDescargoFormDataView(id_descargo: string): Promise<Result<DescargoFormDataResponse>> {
        const descargo = await DescargoService.getById(id_descargo);
        if (descargo.isFailure) return Result.fail<DescargoFormDataResponse>("Descargo no encontrado");        
        const props = descargo.getValue().props;

        //memorandum 
        const memorandum = await MemorandumService.getAll();
        if (memorandum.isFailure) return Result.fail("Falló al obtener la Memorandum");
        const memorandumResult = memorandum.getValue();
        //Usuario 
        const usuario = await UsuarioService.getAll();
        if (usuario.isFailure) return Result.fail("Falló al obtener la Usuario");
        const usuarioResult = usuario.getValue();

        //detalle destino
        const detalleDestino = await DetalleDestinoService.getAll();
        if (detalleDestino.isFailure) return Result.fail("Falló al obtener la Detalle Destino");
        const detalleDestinoResult = detalleDestino.getValue();
        //apertura
        const aperturaViatico = await AperturaViaticoService.getAll();
        if (aperturaViatico.isFailure) return Result.fail("Falló al obtener la Apertura Viatico");
        // const aperturaViaticoResult = aperturaViatico.getValue();
        //cargo
            /*Listado de cargos*/
        const cargo = await CargoService.getAll();
        if(cargo.isFailure) return Result.fail("Fallo al obtener el Cargo");
        const cargoResult = cargo.getValue();
        /*Listado de personal*/
        const personal =await PersonalService.getAll();
        if(personal.isFailure) return Result.fail("Fallo al obtener el Cargo");
        const personalResult = personal.getValue();

        /*Listado de escala*/
        const escala =await EscalaService.getAll();
        if(escala.isFailure) return Result.fail("Fallo al obtener el Cargo");
        const escalaResult = escala.getValue();

        /*Listado de escala Destino*/
        const escalaDestino =await EscalaDestinoService.getAll();
        if(escalaDestino.isFailure) return Result.fail("Fallo al obtener el Cargo");
        const escalaDestinoResult = escalaDestino.getValue();

        //Viatico 
        const viaticoAll = await ViaticoService.getAll();
        if (viaticoAll.isFailure) return Result.fail("Falló al obtener la Memorandum");
         const viaticoAllResult = viaticoAll.getValue();

        const MEMORANDUM_ID = viaticoAllResult.find((c)=> c.id === props.viaticoId)?.props.memorandumId||'-';

        // Memorandum
        const codigoMemorandum = memorandumResult.find((c) => c.id === MEMORANDUM_ID)?.props.codDepartMemo|| "-";//Revisar
        const fechaMemorandum = memorandumResult.find((c) => c.id === MEMORANDUM_ID)?.props.fechaMemoRegistro|| new Date();
        const tipoMemorandumIDP = memorandumResult.find((c) => c.id ===MEMORANDUM_ID)?.props.tipoComisionIDP|| "-";
        const cantidadDias = memorandumResult.find((c) => c.id === MEMORANDUM_ID)?.props.cantidadDias|| 0;
        // usuario
        const nombreUsuarioId = memorandumResult.find((c) => c.id === MEMORANDUM_ID)?.props.usuarioId|| "-";
        const nombreUsuario = usuarioResult.find((c) => c.id === nombreUsuarioId)?.props.fullname|| "-";
        const usuarioCI = usuarioResult.find((c) => c.id === nombreUsuarioId)?.props.ci|| "-";
        
        const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === nombreUsuarioId)?.props.cargoId|| "-";
        const cargoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.nombre|| "-";
        // detalle destino     

        const destino = detalleDestinoResult.find((c) => c.props.memorandumId === MEMORANDUM_ID)?.props.destinoReg|| "-";
        const fechaIda = memorandumResult.find((c) => c.id=== MEMORANDUM_ID)?.props.fechaInicioViaje|| new Date();
        const fechaRetorno = memorandumResult.find((c) => c.id === MEMORANDUM_ID )?.props.fechaFinViaje|| new Date();

        //Viaticos 
        const numeRecibo = viaticoAllResult.find((c) => c.props.memorandumId === MEMORANDUM_ID)?.props.numeRecibo || 0;
        const fechaPagoViatico = viaticoAllResult.find((c) => c.props.memorandumId === MEMORANDUM_ID)?.props.fechaPagoViatico || new Date();

        // Desde este punto realizamos la busqueda del tipo de escala para la determinacion del id de escala 
        const destinoNombre = (escalaDestinoResult.find((c) => c.id === destino))?
        escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-": destino;     
            
        
        /* let destinoNombre = '';
        if(escalaDestinoResult.find((c) => c.id === destino)){
            destinoNombre = escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-";         
        }else{
            destinoNombre = destino;
        }*/
        
        const escalaTipo = escalaDestinoResult.find((c) => c.props.destino === destinoNombre)?.props.escalaExterior|| "-";
            
        const listaAllEscalas: EscalaFormDataResponse[] = escala
            .getValue()
            .map((item) => {
                
                return {
                    id: item.id.toString(),
                    categoria             : item.props.categoria,
                    tipo_comision_idp     : item.props.tipoComisionIdp,
                    escala                : item.props.escala,
                    viatico_por_dia       : item.props.viaticoPorDia,
                    moneda                : item.props.moneda,
                    bolivianos            : item.props.bolivianos,
                    cargo_id              : item.props.cargoId,
                };
            })
            .sort((a, b) => (a.categoria > b.categoria ? 1 : -1));

            const filtroCargo: EscalaFormDataResponse[] = (escalaResult.find((c) => c.props.cargoId === cargoUsuarioid))?
                listaAllEscalas.filter((item) => this.filtrarTipoPCP(item.cargo_id, cargoUsuarioid)):[];
                    
            const filtroTipo: EscalaFormDataResponse[] =(escalaResult.find((c) => c.props.tipoComisionIdp === tipoMemorandumIDP))?
                    filtroCargo.filter((item) => this.filtrarTipoPCP(item.tipo_comision_idp, tipoMemorandumIDP)):[];    
            
            const filtroEscala: EscalaFormDataResponse[] = tipoMemorandumIDP ==="INTERNACIONAL"?filtroTipo
                .filter((item) => this.filtrarTipoPCP(item.escala, escalaTipo)):filtroTipo;
                
            const viaticoDia = filtroEscala.length>0? escalaResult.find((c) => c.id === filtroEscala[0].id)?.props.viaticoPorDia|| 0 : 0;
            const escalaID = filtroEscala.length>0? escalaResult.find((c) => c.id === filtroEscala[0].id)?.id|| '': '';
            
        //fin de este punto realizamos la busqueda del tipo de escala para la determinacion del id de escala 
        //Determinacion de la suma de pasajes y viaticos 
        const listaDestinos: DetalleDestinoFormDataResponse[] = detalleDestino
        .getValue()
        .map((item) => {                   
            return {
                
                id: item.id.toString(),             
                tipo_vehiculo_op         : item.props.tipoVehiculoOP,
                objetivo_viaje           : item.props.objetivoViaje,
                destino_reg              : destinoNombre,
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
        }) ; 

        // Se filta por los destinos
        const filtroDestinos : DetalleDestinoFormDataResponse [] = listaDestinos
        .filter((item) => this.filtrarId(item.viatico_id, props.viaticoId));

        const conteoDiasDetalle = filtroDestinos.length;


        const sumaPasajes = filtroDestinos.reduce((suma, item) => {
        suma.pasaje_ida += item.pasaje_ida || 0;
        suma.pasaje_retorno += item.pasaje_retorno || 0;
        return suma;
        }, { pasaje_ida: 0, pasaje_retorno: 0 });   


        const sumaTotal = sumaPasajes.pasaje_ida + sumaPasajes.pasaje_retorno;
        const productoDiadporViatico = cantidadDias * viaticoDia;
        const sumaTotalViaticos = sumaTotal + productoDiadporViatico;

        //fin Determinacion de la suma de pasajes y viaticos 

        const result: DescargoFormDataResponse = {
                    id                          : descargo.getValue().id,
                    fecha_descargo              : props.fechaDescargo?moment(props.fechaDescargo).format("dd/mm/YYYY").toString(): '',
                    estado_descargo             : props.estadoDescargo,
                    viatico_pasaje_real         : props.viaticoPasajeReal,
                    monto_despositado           : props.montoDespositado,
                    monto_descargo              : props.montoDescargo,
                    saldo_descargo              : props.saldoDescargo,
                    presenta_informe            : props.presentaInforme,
                    viatico_real                : props.viaticoReal,
                    observacion_estado          : props.observacionEstado,
                    observacion_descargo        : props.observacionDescargo,
                    prorroga                    : props.prorroga,
                    tiempo_descargo             : props.tiempoDescargo,
                    notificacion_descargo       : props.notificacionDescargo,
					viatico_id                  : props.viaticoId,  
                    
                     //campos para MOSTRAR

                    usuario_nombre          : nombreUsuario,
                    cod_depart_memo         : codigoMemorandum,
                    usuario_ci                      : usuarioCI,
                    usuario_cargo           : cargoUsuario,
                    fecha_memo_registro     : fechaMemorandum?moment(fechaMemorandum).format("DD/MM/YYYY").toString(): '',
                    tipo_comision_idp       : tipoMemorandumIDP,
                    fecha_inicio_viaje      : fechaIda?moment(fechaIda).format("DD/MM/YYYY").toString(): '',
                    fecha_fin_viaje         : fechaRetorno?moment(fechaRetorno).format("DD/MM/YYYY").toString(): '',
                    
                    cantidad_dias           : cantidadDias,
                    viaticos_por_dia        : viaticoDia, 
                    
                    nume_recibo           : numeRecibo,
                    fecha_pago_viatico    : fechaPagoViatico?moment(fechaPagoViatico).format("DD/MM/YYYY HH:mm").toString():'',  
                    suma_pasaje_ida       : sumaPasajes.pasaje_ida,
                    suma_pasaje_retorno   : sumaPasajes.pasaje_retorno,                   
                    total_pasajes         : sumaTotal,
                    total_viatico         : productoDiadporViatico,
                    liquido_pagable       : sumaTotalViaticos,                   
                    escala_id             : escalaID,//filtroEscala[0].id ||'-',//props.escalaId,
                    conteo_dias_detalle   : conteoDiasDetalle,
                    usuario_id            : nombreUsuarioId,
                    //categoria_usuario     : categoria,
                   // tipo_comision_idp_escala :
        };

        return Result.ok(result);
    }

      //filtramos por el tipo Inte,nacional o provincial
   public filtrarTipoPCP(item:string, constante:string) { 
    return (item === constante); 
   }

   public async getViaticoReport(authUser: AuthUser, queryString: any, id?:string, listaIds? : string[], fechaInicio?: string, fechaFin?: string,): Promise<Result<ViaticoDataResponse>> {
   
    const resultObject = queryStringToArray(queryString);    
    const result = {
        info: await this.getInfoViaticoData(authUser, resultObject),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        data: await this.getViaticoData(resultObject, id, listaIds, fechaInicio!, fechaFin!)
    };

    return Result.ok(result);
	
}  

private async getInfoViaticoData(authUser: AuthUser, queryString: ReportFilters): Promise<InfoViaticoModel | undefined> {

    const ID_USUARIO = authUser.uid;
        const usuario = await UsuarioService.getById(ID_USUARIO);		
        if (usuario.isFailure) throw new Error(String(usuario.error));
        const NOMBRE_USUARIO = usuario.getValue().getNombreCompleto();	
        const EMAIL_USUARIO = usuario.getValue().props.email;
        
        const inputObj: any = queryString;
		
		const hoy = new Date();
        const gestion = hoy.getFullYear().toString();
        const tipo = inputObj.tipo_reporte || null;		

        const FECHA_REGISTRO = moment(hoy).locale('es').format('dddd D [de] MMMM [de] YYYY hh:mm:ss a').toString();	
        const codigo = `${gestion}-|-${tipo}-|-${FECHA_REGISTRO}`;
	
        return {
            codigo    : codigo,
            nombre    : NOMBRE_USUARIO,
            fecha     : FECHA_REGISTRO,
            email     : EMAIL_USUARIO
        }
}

private async getViaticoData(queryString: ReportFilters, id?:string, listaIds?:string[], fechaInicio?: string, fechaFin?: string): Promise<ViaticoDataR | undefined> {
	
    const inputObj: any = queryString;	
    const tipo = inputObj.tipo_reporte || null;	

    const hoy = new Date();
    const gestion = hoy.getFullYear().toString();
    const descargo = await DescargoService.getAll();
    if (descargo.isFailure) return undefined;
    const descargoResult = descargo.getValue();

    const viatico = await ViaticoService.getAll();
    if (viatico.isFailure) return undefined;
    const viaticoResult = viatico.getValue();
// valores para el reporte
    //apertura 
    const apertura = await AperturaViaticoService.getAll();
    if (apertura.isFailure) return undefined;
    const aperturaResult = apertura.getValue();

    const aperturaGeneral = await AperturaGeneralService.getAll();
    if (aperturaGeneral.isFailure) return undefined;
    const aperturaGeneralResult = aperturaGeneral.getValue();
    //personal
     const personal = await PersonalService.getAll();
     if (personal.isFailure) return undefined;
     const personalResult = personal.getValue();
    //area
    const area = await AreaService.getAll();
    if (area.isFailure) return undefined;
    const areaResult = area.getValue();
    //usuario
    const usuario = await UsuarioService.getAll();
    if (usuario.isFailure) return undefined;
    const usuarioResult = usuario.getValue();
    //memorandum
    const memorandum = await MemorandumService.getAll();
    if (memorandum.isFailure) return undefined;
    const memorandumResult = memorandum.getValue();

     //cargo
     const cargo = await CargoService.getAll();
     if (cargo.isFailure) return undefined;
     const cargoResult = cargo.getValue();
    //destino
    const detalleDestino = await DetalleDestinoService.getAll();
    if (detalleDestino.isFailure) return undefined;
    const detalleDestinoResult = detalleDestino.getValue();
    //destino Escala
    const escalaDestino = await EscalaDestinoService.getAll();
    if (escalaDestino.isFailure) return undefined;
    const escalaDestinoResult = escalaDestino.getValue();
     
    const listaFiltradaAreas:AreaFormModel[] =[]; 
    const listaAreasEncontradas:string[] =[]; 
    //FILTRADO DE AREA
          
     //if(tipo === "REPORTE_POR_PROYECTO"){
        const listaAreas: AreaFormModel[] = areaResult.map((item) => {   
            const existeHijo =  aperturaGeneralResult.find((a) => a.props.areaHijoId === item.id)?.props.areaHijoId;  
            let aperturaProgramatica;
            if(existeHijo){
                aperturaProgramatica = aperturaGeneralResult.find((a) => a.props.areaHijoId === item.id)?.props.aperturaProgramatica;  
            }else{
                aperturaProgramatica = aperturaGeneralResult.find((a) => a.props.areaId === item.id)?.props.aperturaProgramatica;  
            }              			
            return {                
                id: item.id.toString(),
                nombre: item.props.nombre,
                apertura_programatica : aperturaProgramatica,
                sigla: item.props.sigla,                                             
            };            
         }) ;          
     
     //FINAL FILTRADO DE AREA  
     
     //FILTRADO DE FUENTES DE FINANCIAMIENTO
      const listaFfOf: string[] = [];
      //const listaFiltradaFfOf: string[] = [];
    
    const viaticoesR: ViaticoItem[] = descargoResult.map((item) => {
        const ID_DESCARGO = String(item.id);
        const ID_VIATICO = descargoResult.find((a) => a.id === ID_DESCARGO)?.props.viaticoId ||"";
        const MEMORANDUM_ID = viaticoResult.find((a) => a.id === ID_VIATICO)?.props.memorandumId ||"";
        const APERTURA_ID = memorandumResult.find((a) => a.id === MEMORANDUM_ID)?.props.aperturaViaticoId||"";      
        const aperturaProg = aperturaResult.find((a) => a.id === APERTURA_ID)?.props.aperturaProgramatica||""; 
        const codFte = aperturaResult.find((a) => a.id === APERTURA_ID)?.props.codFte||"";
        const codOrg = aperturaResult.find((a) => a.id === APERTURA_ID)?.props.codOrg||"";
        const ff_of = codFte.concat(" - ").concat(codOrg); 
        const usuario_id = memorandumResult.find((a) => a.id === MEMORANDUM_ID)?.props.usuarioId||"";
        const usuario_ci = usuarioResult.find((a) => a.id === usuario_id)?.props.ci||"";
        const usuario_nombre = usuarioResult.find((a) => a.id === usuario_id)?.props.fullname||"";
       
        const codDepartMemo = memorandumResult.find((a) => a.id ===MEMORANDUM_ID)?.props.codDepartMemo||"";
        //const destino = detalleDestinoResult.find((c) => c.props.memorandumId === MEMORANDUM_ID)?.props.destinoReg|| "-";
        const destino = detalleDestinoResult.filter(c => c.props.memorandumId === MEMORANDUM_ID).find(c => c.props.destinoReg)?.props.destinoReg || "-";			
        const fechaIda = memorandumResult.find((c) => c.id=== MEMORANDUM_ID)?.props.fechaInicioViaje|| new Date();
        const fechaRetorno = memorandumResult.find((c) => c.id ===  MEMORANDUM_ID )?.props.fechaFinViaje|| new Date();
        const numeRecibo = viaticoResult.find((a) => a.id === ID_VIATICO)?.props.numeRecibo || 0;
        const fechaPagoViatico = viaticoResult.find((a) => a.id === ID_VIATICO)?.props.fechaPagoViatico || new Date();
        const totalPasajes = viaticoResult.find((a) => a.id === ID_VIATICO)?.props.totalPasajes || 0;
        const totalViatico = viaticoResult.find((a) => a.id === ID_VIATICO)?.props.totalViatico || 0;
        const liquido_pagable = viaticoResult.find((a) => a.id === ID_VIATICO)?.props.liquidoPagable || 0;
        const estadoPago = viaticoResult.find((a) => a.id === ID_VIATICO)?.props.estadoPago || "-";
        const tipoComisionIDP = memorandumResult.find((c) => c.id=== MEMORANDUM_ID)?.props.tipoComisionIDP|| "";
        const cargoUsuarioId = personalResult.find((a)=>a.props.usuarioId === usuario_id)?.props.cargoId ||"";
        const tipoUsuario = cargoResult.find((a)=> a.id === cargoUsuarioId)?.props.tipo ||"";
        
        const aperturaGeneralID = aperturaResult.find((a) => a.id === APERTURA_ID)?.props.aperturaGeneralId||"";	        
        const existeHijo = aperturaGeneralResult.find((a) => a.id === aperturaGeneralID)?.props.areaHijoId||"";	        
      
         let AREA_ID:any ="";	
        if(existeHijo){
            AREA_ID = aperturaGeneralResult.find((a) => a.id === aperturaGeneralID)?.props.areaHijoId||"";		
        }else{
            AREA_ID = aperturaGeneralResult.find((a) => a.id === aperturaGeneralID)?.props.areaId||"";		
        }
        
        const sigla = areaResult.find((a) => a.id === AREA_ID)?.props.sigla||"";	
        const areaNombre = areaResult.find((a)=>a.id === AREA_ID)?.props.nombre||"";
        //Lista de destinos
        const listaDestinos: DetalleDestinoOptionsFormModel[] = detalleDestino
        .getValue()
        .map((item) => {                
                return {                
                    id: item.id.toString(),
                    nombre: item.props.memorandumId,
                    caption : item.props.destinoReg,
                    estado: item.props.estado,                                             
                };            
        }) ;         
    
        // Se filta por los destinos
        const filtroDestinos : DetalleDestinoOptionsFormModel [] = listaDestinos
        .filter((value) => this.filtrarId(value.nombre, MEMORANDUM_ID)); //item.props.memorandumId!

        // Se filta por los destinos
        const filtroAprobados : DetalleDestinoOptionsFormModel [] = filtroDestinos        
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .filter((value) => this.filtrarId(value.estado!,'APROBADO')); 

        const conteoDiasDetalle = filtroAprobados.length;

            // filtramos por el tipo de nombre
            const elementosUnicos = new Map(filtroDestinos.map(value => [value.caption, value]));
             let destinoNombre = '';
            
                    if(elementosUnicos.size > 1){
                        
                        //recorrer 
                        elementosUnicos.forEach((value, key) => {
                        
                            if(escalaDestinoResult.find((c) => c.props.destino === value.caption)){
                                
                                destinoNombre = destinoNombre.concat( escalaDestinoResult.find((c) => c.props.destino === value.caption)?.props.destino|| "-").concat(' - ');					
                            
                            }else if( escalaDestinoResult.find((c) => c.id === destino)){
                                destinoNombre = destinoNombre.concat((escalaDestinoResult.find((c) => c.id === destino))?
                                escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-":destino).concat(' - ');   
                                
                            }
                            else {
                                destinoNombre = destinoNombre.concat(destino).concat(' - ');               
                            }              
                    });          
                    }else{
                        destinoNombre = (escalaDestinoResult.find((c) => c.id === destino))?
                        escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-":destino;   
                            
                    }       
                        
           //Filtro de Areas por proyecto
        
           listaAreasEncontradas.push(AREA_ID);
        
          
         
           // fin filtrado areas por proyecto

           //FILTRADO DE FUENTES DE FINANCIAMIENTO    
           
           if(ff_of != " - "){
              listaFfOf.push(ff_of);             
           }       
            
          //FILTRADO DE FUENTES  
          
        return {
            id: String(item.id),
            gestion: gestion,
            tipo   : tipo,
            // codigo : item.props.memorandumId,
            fecha_descargo         : item.props.fechaDescargo,
          //  fecha_descargo_format  : item.props.fechaDescargo,
            estado_descargo        : item.props.estadoDescargo,
            viatico_pasaje_real    : item.props.viaticoPasajeReal,
            monto_depositado      : item.props.montoDespositado,
            monto_descargo         : item.props.montoDescargo,
            saldo_descargo         : item.props.saldoDescargo,
            presenta_informe       : item.props.presentaInforme,
            viatico_real           : item.props.viaticoReal,
            observacion_estado     : item.props.estadoDescargo,
            observacion_descargo   : item.props.observacionDescargo,
            prorroga               : item.props.prorroga,
            tiempo_descargo        : item.props.tiempoDescargo,
            notificacion_descargo  : item.props.notificacionDescargo,
            viatico_id             : item.props.viaticoId,

          //viatico  
            nume_recibo           : numeRecibo,
            fecha_pago_viatico    : fechaPagoViatico,     
            fecha_pago_viatico_format    : fechaPagoViatico?moment(fechaPagoViatico).format("DD/MM/YYYY").toString(): '',
            total_pasajes         : totalPasajes,
            total_viatico         : totalViatico,
            liquido_pagable       : liquido_pagable,
        //necesarios            
            apertura_programatica : aperturaProg,
            ff_of                 : ff_of,
            usuario_ci            : usuario_ci,
            usuario_nombre        : usuario_nombre,          
            sigla                 : sigla,   
            cod_depart_memo       : codDepartMemo,
            destino               : destinoNombre,
            fecha_inicio_viaje    : fechaIda?moment(fechaIda).format("DD/MM/YYYY").toString(): '',
            fecha_fin_viaje       : fechaRetorno?moment(fechaRetorno).format("DD/MM/YYYY").toString(): '',   
            tipo_reporte          : tipo,   
            area_id               : AREA_ID,     
            area_nombre           : areaNombre,
            usuario_tipo          : tipoUsuario,
            fechaInicio           : fechaInicio,
            fechaFin              : fechaFin,
            estado_pago            : estadoPago,
            tipo_comision_idp       : tipoComisionIDP,
        };
    }).sort((a, b) =>a.nume_recibo > b.nume_recibo ? 1 : -1);

//  Para el REPORTE DE RRHH

 

 
//  Fin del REPORTE DE RRHH
        //FILTRADO FFOF
        // Se realiza el filtro de la fuentes de financiamiento
        const listaSinRepetidos = [...new Set(listaFfOf)];      
        //FIN FILTRADO ffof

        //FILTRADO POR PROYECTO
        
        for(let i = 0 ; i < listaAreasEncontradas.length ; i++){
            const filtroAreas =  listaAreas 			
            .filter((value) => this.filtrarId(value.id,listaAreasEncontradas[i]));             
            if(filtroAreas.length >0 && filtroAreas != undefined){ 
                listaFiltradaAreas.push(filtroAreas[0])			
            }
        }           
       const listaFiltradaProyecto : AreaFormModel [] = [...new Set(listaFiltradaAreas)];          
       listaFiltradaProyecto.sort((a, b) =>a.apertura_programatica! > b.apertura_programatica! ? 1 : -1);   
      
        // FIN FILTRADO POR PROYECTO 
       
       //FILTRADO POR BENEFICIARIO
       let filtroGeneral : ViaticoItem [] = [];
       let filtroFecha : string[] = [] ;
       let filtroSinRepetidosBen: ViaticoItem [] = [];

       if(tipo === "REPORTE_POR_BENEFICIARIO"){      
              
                listaIds!.forEach((idG, key) => {        
                    const resultadoFiltro = viaticoesR.filter((value) => this.filtrarId(value.id, idG));           
                    filtroGeneral = [...filtroGeneral, ...resultadoFiltro];  // Acumulamos los resultados
                    filtroFecha = this.getfechafirstLast(filtroGeneral);                    
					
                }); 
                     filtroSinRepetidosBen = filtroGeneral.filter((valor, index, self) => {				
                        return self.findIndex((item) => item.usuario_ci === valor.usuario_ci) === index;
                    });
                   
         }else if(listaIds != undefined){
         
      //FILTRO GENERAL        
            
                listaIds!.forEach((idG, key) => {        
                    const resultadoFiltro = viaticoesR.filter((value) => this.filtrarId(value.id, idG));           
                    filtroGeneral = [...filtroGeneral, ...resultadoFiltro];
                    filtroGeneral.sort((a, b) =>a.nume_recibo! > b.nume_recibo! ? 1 : -1);  // Acumulamos los resultados					
                    filtroFecha = this.getfechafirstLast(filtroGeneral);                    					
					
                });

       //FIN FILTRO GENERAL
      }         
     
      //filtro por proyecto llenar

       const mapaAreas = new Map();    
        listaFiltradaProyecto.forEach(area => {		
			
            mapaAreas.set(area.id, {
                ...area,
                registros: [],
                totalPasajes: 0,
                totalViatico: 0,
                totalLiquido: 0
            });
        });

        filtroGeneral.forEach(row => {
            const area = mapaAreas.get(row.area_id);

            if (area) {
                area.registros.push(row);

                area.totalPasajes += Number(row.total_pasajes || 0);
                area.totalViatico += Number(row.total_viatico || 0);
                area.totalLiquido += Number(row.liquido_pagable || 0);
            }
        });
     const areasAgrupadas = Array.from(mapaAreas.values());
   

    //fin filtro por proyecto
        //const response = findAndCountResult(filtroGeneral);

        const result1: ViaticoDataR = {
		
            tipo_reporte: tipo,
            rows: filtroGeneral,
            lista_areas: areasAgrupadas,
            lista_ffof : listaSinRepetidos,	
            idBeneficiario : filtroSinRepetidosBen,//response.rows,//listaIdBeneficiario,
            fecha_inicio_filtro : fechaInicio?moment(fechaInicio).format("DD/MM/YYYY").toString(): '',   
            fecha_fin_filtro : fechaFin?moment(fechaFin).format("DD/MM/YYYY").toString(): '',   
        };
        
        return result1;
		
	
}

// Identificar la primera y ultima de las fechas dentro del filtro
public  getfechafirstLast (listaGeneral : ViaticoItem[]):string[]{	
    const filtroFechas : string []= [];
    const filtroFechasFirstLast : string []= [];
            
    listaGeneral.forEach((value,key)=>{
         filtroFechas.push(value.fecha_pago_viatico_format!)
	})
             
    // Función para convertir las fechas en formato 'dd/MM/yyyy' a objetos Date
    const parseDate = (dateString: string): Date => {
      const [day, month, year] = dateString.split('/').map(Number);
      return new Date(year, month - 1, day); // Mes en JavaScript es 0-indexado
    };    
    // Ordenar las fechas en orden ascendente
    const fechasOrdenadas = filtroFechas.sort((a, b) => {
      const dateA = parseDate(a);
      const dateB = parseDate(b);
      return dateA.getTime() - dateB.getTime(); // Comparar las fechas en milisegundos
    });
    filtroFechasFirstLast.push( fechasOrdenadas[0]);	
    filtroFechasFirstLast.push(fechasOrdenadas[fechasOrdenadas.length-1]);
    return filtroFechasFirstLast;
	
 } 

public async getFechaFiltro(fechaInicio: string, fechaFin: string, query:any): Promise<Result<{ rows: DescargoTableModel[]  }>> {
		
    const descargo = await DescargoService.getAll();
    if (descargo.isFailure) return Result.fail("Falló al obtener la Descargo");
    const descargoResult = descargo.getValue();

    /*Listado de cargos*/
    const cargo = await CargoService.getAll();
    if(cargo.isFailure) return Result.fail("Fallo al obtener el Cargo");
    const cargoResult = cargo.getValue();
     /*Listado de usuarios*/
     const usuario = await UsuarioService.getAll();
     if(usuario.isFailure) return Result.fail("Fallo al obtener el Usuario");
     const usuarioResult = usuario.getValue();
    /*Listado de personal*/
    const personal =await PersonalService.getAll();
    if(personal.isFailure) return Result.fail("Fallo al obtener el Personal");
    const personalResult = personal.getValue();
     /*Listado de Viaticos*/
     const viatico =await ViaticoService.getAll();
     if(viatico.isFailure) return Result.fail("Fallo al obtener el Personal");
     const viaticoResult = viatico.getValue();

     const memorandum = await MemorandumService.getAll();
     if (memorandum.isFailure) return Result.fail("Falló al obtener la Memorandum");
     const memorandumResult = memorandum.getValue();

     const detalleDestino = await DetalleDestinoService.getAll();
     if (detalleDestino.isFailure) return Result.fail("Falló al obtener la Detalle destino");
     const detalleDestinoResult = detalleDestino.getValue();

      /*Listado de escala Destino*/
    const escalaDestino =await EscalaDestinoService.getAll();
    if(escalaDestino.isFailure) return Result.fail("Fallo al obtener el Escala Destino");
    const escalaDestinoResult = escalaDestino.getValue();
    /*Listado de apertura*/
    const apertura =await AperturaViaticoService.getAll();
    if(apertura.isFailure) return Result.fail("Fallo al obtener el Apertura");
    const aperturaResult = apertura.getValue();
     /*Listado de apertura*/
     const area =await AreaService.getAll();
     if(area.isFailure) return Result.fail("Fallo al obtener el area");
     const areaResult = area.getValue();

                   
    const result: DescargoTableModel[] = descargoResult.map((item) => {

    const memorandumID = viaticoResult.find((c) => c.id === item.props.viaticoId)?.props.memorandumId|| "-";
    const numeroRecibo = viaticoResult.find((c) => c.id === item.props.viaticoId)?.props.numeRecibo||0;
    const usuarioID = memorandumResult.find((c) => c.id === memorandumID)?.props.usuarioId||"-"; 
    const tipoMemoRepo = memorandumResult.find((c) => c.id === memorandumID)?.props.tipoMemoRepo||"-"; 
    const aperturaID = memorandumResult.find((c) => c.id === memorandumID)?.props.aperturaViaticoId||"-";			
    const partidaPresupuestaria = aperturaResult.find((c) => c.id === aperturaID)?.props.aperturaProgramatica||"-";			
    const codFte = aperturaResult.find((c) => c.id === aperturaID)?.props.codFte||"-";
    const codOrg = aperturaResult.find((c) => c.id === aperturaID)?.props.codOrg||"-";  
    const ffOf = codFte.concat("-").concat(codOrg);
    const areaId = aperturaResult.find((c) => c.id === aperturaID)?.props.areaId||"-";  
    const area = areaResult.find((c) => c.id === areaId)?.props.nombre||"-"; 
    const siglaUsuario = areaResult.find((c)=> c.id === areaId)?.props.sigla||"-"; 

    /*seleccionamos del listado de area el nombre del departamento y su sigla*/
    const usuarioNombre = usuarioResult.find((c) => c.id === usuarioID)?.props.fullname|| "-";//Revisar
    const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === usuarioID)?.props.cargoId|| "-";
    const cargoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.nombre|| "-";
   
    const ciUsuario = usuarioResult.find((c) => c.id === usuarioID)?.props.ci|| "-";
    const fechaIda = memorandumResult.find((c) => c.id === memorandumID)?.props.fechaInicioViaje||"-"; 
    const fechaRetorno = memorandumResult.find((c) => c.id === memorandumID)?.props.fechaFinViaje||"-";          
    const codigoMemo = memorandumResult.find((c) => c.id === memorandumID)?.props.codDepartMemo||"-"; 
    const cantidadDias = memorandumResult.find((c) => c.id === memorandumID)?.props.cantidadDias||"-"; 
    //const destino = detalleDestinoResult.find((c) => c.props.memorandumId === memorandumID)?.props.destinoReg||"-"; 
     const destino = detalleDestinoResult.filter(c => c.props.memorandumId === memorandumID).find(c => c.props.destinoReg)?.props.destinoReg || "-";			
    const liquidoPagable = viaticoResult.find((c) => c.props.memorandumId === memorandumID)?.props.liquidoPagable||0;
    const ID_DESCARGO = String(item.id);
    const ID_VIATICO = descargoResult.find((a) => a.id === ID_DESCARGO)?.props.viaticoId ||"";
    const estadoPago = viaticoResult.find((a) => a.id === ID_VIATICO)?.props.estadoPago || "-";
     const fechaPagoViatico = viaticoResult.find((c) => c.props.memorandumId === memorandumID)?.props.fechaPagoViatico||"-";
      const tipoComisionIDP = memorandumResult.find((c) => c.id=== memorandumID)?.props.tipoComisionIDP|| "";
        //Lista de destinos
        const listaDestinos: DetalleDestinoOptionsFormModel[] = detalleDestino
        .getValue()
        .map((item) => {                
                return {                
                    id: item.id.toString(),
                    nombre: item.props.memorandumId,
                    caption : item.props.destinoReg,
                    estado: item.props.estado,                                             
                };            
        }) ;         

        // Se filta por los destinos
        const filtroDestinos1 : DetalleDestinoOptionsFormModel [] = listaDestinos
        .filter((value) => this.filtrarId(value.nombre, memorandumID)); 
        const filtroDestinos : DetalleDestinoOptionsFormModel [] = filtroDestinos1
        .filter((value) => this.filtrarEstadoDestino(value.estado!,'SIN_VIAJE' )); 

                    // filtramos por el tipo de nombre
        const elementosUnicos = new Map(filtroDestinos.map(value => [value.caption, value]));
        
        let destinoNombre = '';
         if(elementosUnicos.size > 1){
                        
                        //recorrer 
                        elementosUnicos.forEach((value, key) => {
                        
                            if(escalaDestinoResult.find((c) => c.props.destino === value.caption)){
                                
                                destinoNombre = destinoNombre.concat( escalaDestinoResult.find((c) => c.props.destino === value.caption)?.props.destino|| "-").concat(' - ');					
                            
                            }else if( escalaDestinoResult.find((c) => c.id === destino)){
                                destinoNombre = destinoNombre.concat((escalaDestinoResult.find((c) => c.id === destino))?
                                escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-":destino).concat(' - ');   
                                
                            }
                            else {
                                destinoNombre = destinoNombre.concat(destino).concat(' - ');         
                            }              
                    });          
                    }else{
                        destinoNombre = (escalaDestinoResult.find((c) => c.id === destino))?
                        escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-":destino;   
                            
                    }       
        //Actualizando Fechas 
        return {
            id                          : String(item.id),
            fecha_descargo_format       : item.props.fechaDescargo?moment(item.props.fechaDescargo).format("DD/MM/YYYY").toString(): '',
            fecha_descargo              : item.props.fechaDescargo,
            estado_descargo             : item.props.estadoDescargo,
            viatico_pasaje_real         : item.props.viaticoPasajeReal,
            monto_despositado           : item.props.montoDespositado,
            monto_descargo              : item.props.montoDescargo,
            saldo_descargo              : item.props.saldoDescargo,
            presenta_informe            : item.props.presentaInforme,
            viatico_real                : item.props.viaticoReal,
            observacion_estado          : item.props.observacionEstado,
            observacion_descargo        :item.props.observacionDescargo,
            prorroga                    : item.props.prorroga,
            tiempo_descargo             : item.props.tiempoDescargo,
            notificacion_descargo       : item.props.notificacionDescargo,
            viatico_id                  : item.props.viaticoId, 
            num_recibo                  : numeroRecibo,
            usuario_nombre              : usuarioNombre,
            usuario_cargo               : cargoUsuario, 
            
            usuario_ci                      : ciUsuario,
            liquido_pagable                 : liquidoPagable,
            fecha_ida                       : fechaIda?moment(fechaIda).format("DD/MM/YYYY").toString(): '',
            fecha_retorno                   : fechaRetorno?moment(fechaRetorno).format("DD/MM/YYYY").toString(): '',
            destino                         : destinoNombre,
            cod_memo                        : codigoMemo,
            cantidad_dias                   : cantidadDias,
            tipo_memo_repo                  : tipoMemoRepo,
            partida_presupuestaria          : partidaPresupuestaria,
            ff_of                           : ffOf,
            area                            : area,
            sigla                           : siglaUsuario,
            estado_pago                     : estadoPago,          
            fecha_pago_viatico              :fechaPagoViatico?moment(fechaPagoViatico).format("DD/MM/YYYY").toString(): '',
            tipo_comision_idp              : tipoComisionIDP,
        };
    }).sort((a, b) => a.num_recibo > b.num_recibo ?-1:1);   

    const filtrarFecha : DescargoTableModel[] = this.filtrarPorFecha(result, fechaInicio, fechaFin); 
    const response = findAndCountResult(filtrarFecha, query); 

    return Result.ok(response);
	
}
   

// Filtrar por fechas
public filtrarPorFecha = (datos: any[], fechaInicio:string, fechaFin: string) => {
        
    if (!fechaInicio || !fechaFin) return datos; // Si no hay fechas seleccionadas, no filtramos
                
    const inicio = this.convertirFecha(fechaInicio); 	
    const fin = this.convertirFecha(fechaFin);
                  
    // Filtrar los datos por fechas
   const filteredByDate = datos.filter(item => {						
       const fechaFormat = this.convertirFecha(item.fecha_pago_viatico);
       const itemDate = fechaFormat; 		
       return  itemDate! >= inicio! && itemDate! <= fin!;			
   });         
     
   return filteredByDate;
   
 
};

// conversion de fecha
public convertirFecha = (fecha : any )=> {
       
       let fechaFormateada;
       let partes;
        // Dividir la fecha en día, mes y año
       if (fecha.includes("/")){
           partes = fecha.split("/");
           fechaFormateada = new Date(partes[2], partes[1] - 1, partes[0]);	
       }else if(fecha.includes("-")){
           partes = fecha.split("-");
           fechaFormateada = new Date(partes[0], partes[1]-1, partes[2]);	
       }           
       
       return fechaFormateada;
   }
public filtrarPorFechaAnulacion = (datos: any[], fechaInicio:string, fechaFin: string) => {
		
        
    if (!fechaInicio || !fechaFin) return datos; // Si no hay fechas seleccionadas, no filtramos
                
    const inicio = this.convertirFecha(fechaInicio); 	
    const fin = this.convertirFecha(fechaFin);
                  
    // Filtrar los datos por fechas
   const filteredByDate = datos.filter(item => {						
       const fechaFormat = this.convertirFecha(item.fecha_anulacion?moment(item.fecha_anulacion).format("DD/MM/YYYY").toString(): '',);
       const itemDate = fechaFormat; 		
       return  itemDate! >= inicio! && itemDate! <= fin!;			
   });         
     
   return filteredByDate;
   
 
};


   public async getNombreApellido(nombre: string, apellido: string, query:any): Promise<Result<{ rows: DescargoTableModel[]  }>> {
       
		
    const descargo = await DescargoService.getAll();
    if (descargo.isFailure) return Result.fail("Falló al obtener la Descargo");
    const descargoResult = descargo.getValue();

    /*Listado de cargos*/
    const cargo = await CargoService.getAll();
    if(cargo.isFailure) return Result.fail("Fallo al obtener el Cargo");
    const cargoResult = cargo.getValue();
     /*Listado de usuarios*/
     const usuario = await UsuarioService.getAll();
     if(usuario.isFailure) return Result.fail("Fallo al obtener el Usuario");
     const usuarioResult = usuario.getValue();
    /*Listado de personal*/
    const personal =await PersonalService.getAll();
    if(personal.isFailure) return Result.fail("Fallo al obtener el Personal");
    const personalResult = personal.getValue();
     /*Listado de Viaticos*/
     const viatico =await ViaticoService.getAll();
     if(viatico.isFailure) return Result.fail("Fallo al obtener el Personal");
     const viaticoResult = viatico.getValue();

     const memorandum = await MemorandumService.getAll();
     if (memorandum.isFailure) return Result.fail("Falló al obtener la Memorandum");
     const memorandumResult = memorandum.getValue();

     const detalleDestino = await DetalleDestinoService.getAll();
     if (detalleDestino.isFailure) return Result.fail("Falló al obtener la Detalle destino");
     const detalleDestinoResult = detalleDestino.getValue();

      /*Listado de escala Destino*/
    const escalaDestino =await EscalaDestinoService.getAll();
    if(escalaDestino.isFailure) return Result.fail("Fallo al obtener el Escala Destino");
    const escalaDestinoResult = escalaDestino.getValue();
    /*Listado de apertura*/
    const apertura =await AperturaViaticoService.getAll();
    if(apertura.isFailure) return Result.fail("Fallo al obtener el Apertura");
    const aperturaResult = apertura.getValue();
     /*Listado de apertura*/
     const area =await AreaService.getAll();
     if(area.isFailure) return Result.fail("Fallo al obtener el area");
     const areaResult = area.getValue();

                   
    const result: DescargoTableModel[] = descargoResult.map((item) => {

    const memorandumID = viaticoResult.find((c) => c.id === item.props.viaticoId)?.props.memorandumId|| "-";
    const numeroRecibo = viaticoResult.find((c) => c.id === item.props.viaticoId)?.props.numeRecibo||0;
    const usuarioID = memorandumResult.find((c) => c.id === memorandumID)?.props.usuarioId||"-"; 
    const tipoMemoRepo = memorandumResult.find((c) => c.id === memorandumID)?.props.tipoMemoRepo||"-"; 
    const aperturaID = memorandumResult.find((c) => c.id === memorandumID)?.props.aperturaViaticoId||"-";			
    const partidaPresupuestaria = aperturaResult.find((c) => c.id === aperturaID)?.props.aperturaProgramatica||"-";			
    const codFte = aperturaResult.find((c) => c.id === aperturaID)?.props.codFte||"-";
    const codOrg = aperturaResult.find((c) => c.id === aperturaID)?.props.codOrg||"-";  
    const ffOf = codFte.concat("-").concat(codOrg);
    const areaId = aperturaResult.find((c) => c.id === aperturaID)?.props.areaId||"-";  
    const area = areaResult.find((c) => c.id === areaId)?.props.nombre||"-"; 
    const siglaUsuario = areaResult.find((c)=> c.id === areaId)?.props.sigla||"-"; 

    /*seleccionamos del listado de area el nombre del departamento y su sigla*/
    const usuarioNombre = usuarioResult.find((c) => c.id === usuarioID)?.props.fullname|| "-";//Revisar
    const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === usuarioID)?.props.cargoId|| "-";
    const cargoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.nombre|| "-";
   
    const ciUsuario = usuarioResult.find((c) => c.id === usuarioID)?.props.ci|| "-";
    const fechaIda = memorandumResult.find((c) => c.id === memorandumID)?.props.fechaInicioViaje||"-"; 
    const fechaRetorno = memorandumResult.find((c) => c.id === memorandumID)?.props.fechaFinViaje||"-";          
    const codigoMemo = memorandumResult.find((c) => c.id === memorandumID)?.props.codDepartMemo||"-"; 
    const cantidadDias = memorandumResult.find((c) => c.id === memorandumID)?.props.cantidadDias||"-"; 
    //const destino = detalleDestinoResult.find((c) => c.props.memorandumId === memorandumID)?.props.destinoReg||"-"; 
     const destino = detalleDestinoResult.filter(c => c.props.memorandumId === memorandumID).find(c => c.props.destinoReg)?.props.destinoReg || "-";			
    const liquidoPagable = viaticoResult.find((c) => c.props.memorandumId === memorandumID)?.props.liquidoPagable||0;
    const ID_DESCARGO = String(item.id);
    const ID_VIATICO = descargoResult.find((a) => a.id === ID_DESCARGO)?.props.viaticoId ||"";
    const estadoPago = viaticoResult.find((a) => a.id === ID_VIATICO)?.props.estadoPago || "-";
     const fechaPagoViatico = viaticoResult.find((c) => c.props.memorandumId === memorandumID)?.props.fechaPagoViatico||"-";
     const tipoComisionIDP = memorandumResult.find((c) => c.id=== memorandumID)?.props.tipoComisionIDP|| "";      
        //Lista de destinos
        const listaDestinos: DetalleDestinoOptionsFormModel[] = detalleDestino
        .getValue()
        .map((item) => {                
                return {                
                    id: item.id.toString(),
                    nombre: item.props.memorandumId,
                    caption : item.props.destinoReg,
                    estado: item.props.estado,                                             
                };            
        }) ;         

        // Se filta por los destinos
        const filtroDestinos1 : DetalleDestinoOptionsFormModel [] = listaDestinos
        .filter((value) => this.filtrarId(value.nombre, memorandumID)); 
        const filtroDestinos : DetalleDestinoOptionsFormModel [] = filtroDestinos1
        .filter((value) => this.filtrarEstadoDestino(value.estado!,'SIN_VIAJE' )); 

                    // filtramos por el tipo de nombre
        const elementosUnicos = new Map(filtroDestinos.map(value => [value.caption, value]));
        
        let destinoNombre = '';
         if(elementosUnicos.size > 1){
                        
                        //recorrer 
                        elementosUnicos.forEach((value, key) => {
                        
                            if(escalaDestinoResult.find((c) => c.props.destino === value.caption)){
                                
                                destinoNombre = destinoNombre.concat( escalaDestinoResult.find((c) => c.props.destino === value.caption)?.props.destino|| "-").concat(' - ');					
                            
                            }else if( escalaDestinoResult.find((c) => c.id === destino)){
                                destinoNombre = destinoNombre.concat((escalaDestinoResult.find((c) => c.id === destino))?
                                escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-":destino).concat(' - ');   
                                
                            }
                            else {
                                destinoNombre = destinoNombre.concat(destino).concat(' - ');               
                            }              
                    });          
                    }else{
                        destinoNombre = (escalaDestinoResult.find((c) => c.id === destino))?
                        escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-":destino;   
                            
                    } 
         
        //Actualizando Fechas 
        return {
            id                          : String(item.id),
            fecha_descargo_format       : item.props.fechaDescargo?moment(item.props.fechaDescargo).format("DD/MM/YYYY").toString(): '',
            fecha_descargo              : item.props.fechaDescargo,
            estado_descargo             : item.props.estadoDescargo,
            viatico_pasaje_real         : item.props.viaticoPasajeReal,
            monto_despositado           : item.props.montoDespositado,
            monto_descargo              : item.props.montoDescargo,
            saldo_descargo              : item.props.saldoDescargo,
            presenta_informe            : item.props.presentaInforme,
            viatico_real                : item.props.viaticoReal,
            observacion_estado          : item.props.observacionEstado,
            observacion_descargo        :item.props.observacionDescargo,
            prorroga                    : item.props.prorroga,
            tiempo_descargo             : item.props.tiempoDescargo,
            notificacion_descargo       : item.props.notificacionDescargo,
            viatico_id                  : item.props.viaticoId, 
            num_recibo                  : numeroRecibo,
            usuario_nombre              : usuarioNombre,
            usuario_cargo               : cargoUsuario, 
            
            usuario_ci                      : ciUsuario,
            liquido_pagable                 : liquidoPagable,
            fecha_ida                       : fechaIda?moment(fechaIda).format("DD/MM/YYYY").toString(): '',
            fecha_retorno                   : fechaRetorno?moment(fechaRetorno).format("DD/MM/YYYY").toString(): '',
            destino                         : destinoNombre,
            cod_memo                        : codigoMemo,
            cantidad_dias                   : cantidadDias,
            tipo_memo_repo                  : tipoMemoRepo,
            partida_presupuestaria          : partidaPresupuestaria,
            ff_of                           : ffOf,
            area                            : area,
            sigla                           : siglaUsuario,
            estado_pago                     : estadoPago,           
              fecha_pago_viatico      :fechaPagoViatico?moment(fechaPagoViatico).format("DD/MM/YYYY").toString(): '',
              tipo_comision_idp             : tipoComisionIDP,
        };
    }).sort((a, b) => a.num_recibo > b.num_recibo ?-1:1);   
  
    const filtroNombres : DescargoTableModel [] = result	
    .filter((value) => this.filtrarNombreApellido(value.usuario_nombre,nombre,apellido )); 	
    const response = findAndCountResult(filtroNombres, query); 
	
    return Result.ok(response);
	
}


public async getDatosBeneficiario(fechaInicio: string, fechaFin: string, beneficiario:string, query:any): Promise<Result<{ rows: DescargoTableModel[]  }>> {
		
    const descargo = await DescargoService.getAll();
    if (descargo.isFailure) return Result.fail("Falló al obtener la Descargo");
    const descargoResult = descargo.getValue();

    /*Listado de cargos*/
    const cargo = await CargoService.getAll();
    if(cargo.isFailure) return Result.fail("Fallo al obtener el Cargo");
    const cargoResult = cargo.getValue();
     /*Listado de usuarios*/
     const usuario = await UsuarioService.getAll();
     if(usuario.isFailure) return Result.fail("Fallo al obtener el Usuario");
     const usuarioResult = usuario.getValue();
    /*Listado de personal*/
    const personal =await PersonalService.getAll();
    if(personal.isFailure) return Result.fail("Fallo al obtener el Personal");
    const personalResult = personal.getValue();
     /*Listado de Viaticos*/
     const viatico =await ViaticoService.getAll();
     if(viatico.isFailure) return Result.fail("Fallo al obtener el Personal");
     const viaticoResult = viatico.getValue();

     const memorandum = await MemorandumService.getAll();
     if (memorandum.isFailure) return Result.fail("Falló al obtener la Memorandum");
     const memorandumResult = memorandum.getValue();

     const detalleDestino = await DetalleDestinoService.getAll();
     if (detalleDestino.isFailure) return Result.fail("Falló al obtener la Detalle destino");
     const detalleDestinoResult = detalleDestino.getValue();

      /*Listado de escala Destino*/
    const escalaDestino =await EscalaDestinoService.getAll();
    if(escalaDestino.isFailure) return Result.fail("Fallo al obtener el Escala Destino");
    const escalaDestinoResult = escalaDestino.getValue();
    /*Listado de apertura*/
    const apertura =await AperturaViaticoService.getAll();
    if(apertura.isFailure) return Result.fail("Fallo al obtener el Apertura");
    const aperturaResult = apertura.getValue();
     /*Listado de apertura*/
     const area =await AreaService.getAll();
     if(area.isFailure) return Result.fail("Fallo al obtener el area");
     const areaResult = area.getValue();

                   
    const result: DescargoTableModel[] = descargoResult.map((item) => {

    const memorandumID = viaticoResult.find((c) => c.id === item.props.viaticoId)?.props.memorandumId|| "-";
    const numeroRecibo = viaticoResult.find((c) => c.id === item.props.viaticoId)?.props.numeRecibo||0;
    const usuarioID = memorandumResult.find((c) => c.id === memorandumID)?.props.usuarioId||"-"; 
    const tipoMemoRepo = memorandumResult.find((c) => c.id === memorandumID)?.props.tipoMemoRepo||"-"; 
    const aperturaID = memorandumResult.find((c) => c.id === memorandumID)?.props.aperturaViaticoId||"-";			
    const partidaPresupuestaria = aperturaResult.find((c) => c.id === aperturaID)?.props.aperturaProgramatica||"-";			
    const codFte = aperturaResult.find((c) => c.id === aperturaID)?.props.codFte||"-";
    const codOrg = aperturaResult.find((c) => c.id === aperturaID)?.props.codOrg||"-";  
    const ffOf = codFte.concat("-").concat(codOrg);
    const areaId = aperturaResult.find((c) => c.id === aperturaID)?.props.areaId||"-";  
    const area = areaResult.find((c) => c.id === areaId)?.props.nombre||"-"; 
    const siglaUsuario = areaResult.find((c)=> c.id === areaId)?.props.sigla||"-"; 

    /*seleccionamos del listado de area el nombre del departamento y su sigla*/
    const usuarioNombre = usuarioResult.find((c) => c.id === usuarioID)?.props.fullname|| "-";//Revisar
    const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === usuarioID)?.props.cargoId|| "-";
    const cargoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.nombre|| "-";
   
    const ciUsuario = usuarioResult.find((c) => c.id === usuarioID)?.props.ci|| "-";
    const fechaIda = memorandumResult.find((c) => c.id === memorandumID)?.props.fechaInicioViaje||"-"; 
    const fechaRetorno = memorandumResult.find((c) => c.id === memorandumID)?.props.fechaFinViaje||"-";          
    const codigoMemo = memorandumResult.find((c) => c.id === memorandumID)?.props.codDepartMemo||"-"; 
    const cantidadDias = memorandumResult.find((c) => c.id === memorandumID)?.props.cantidadDias||"-"; 
    //const destino = detalleDestinoResult.find((c) => c.props.memorandumId === memorandumID)?.props.destinoReg||"-"; 
    const destino = detalleDestinoResult.filter(c => c.props.memorandumId === memorandumID).find(c => c.props.destinoReg)?.props.destinoReg || "-";			
    const liquidoPagable = viaticoResult.find((c) => c.props.memorandumId === memorandumID)?.props.liquidoPagable||0;
    const ID_DESCARGO = String(item.id);
    const ID_VIATICO = descargoResult.find((a) => a.id === ID_DESCARGO)?.props.viaticoId ||"";
    const estadoPago = viaticoResult.find((a) => a.id === ID_VIATICO)?.props.estadoPago || "-";
     const fechaPagoViatico = viaticoResult.find((c) => c.props.memorandumId === memorandumID)?.props.fechaPagoViatico||"-";
    const tipoComisionIDP = memorandumResult.find((c) => c.id=== memorandumID)?.props.tipoComisionIDP|| "";            
        //Lista de destinos
        const listaDestinos: DetalleDestinoOptionsFormModel[] = detalleDestino
        .getValue()
        .map((item) => {                
                return {                
                    id: item.id.toString(),
                    nombre: item.props.memorandumId,
                    caption : item.props.destinoReg,
                    estado: item.props.estado,                                             
                };            
        }) ;         

        // Se filta por los destinos
        const filtroDestinos1 : DetalleDestinoOptionsFormModel [] = listaDestinos
        .filter((value) => this.filtrarId(value.nombre, memorandumID)); 
        const filtroDestinos : DetalleDestinoOptionsFormModel [] = filtroDestinos1
        .filter((value) => this.filtrarEstadoDestino(value.estado!,'SIN_VIAJE' )); 

                    // filtramos por el tipo de nombre
        const elementosUnicos = new Map(filtroDestinos.map(value => [value.caption, value]));
        
        let destinoNombre = '';
        if(elementosUnicos.size > 1){
                        
                        //recorrer 
                        elementosUnicos.forEach((value, key) => {
                        
                            if(escalaDestinoResult.find((c) => c.props.destino === value.caption)){
                                
                                destinoNombre = destinoNombre.concat( escalaDestinoResult.find((c) => c.props.destino === value.caption)?.props.destino|| "-").concat(' - ');					
                            
                            }else if( escalaDestinoResult.find((c) => c.id === destino)){
                                destinoNombre = destinoNombre.concat((escalaDestinoResult.find((c) => c.id === destino))?
                                escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-":destino).concat(' - ');   
                                
                            }
                            else {
                                destinoNombre = destinoNombre.concat(destino).concat(' - ');               
                            }              
                    });          
                    }else{
                        destinoNombre = (escalaDestinoResult.find((c) => c.id === destino))?
                        escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-":destino;   
                            
                    }       
       
        return {
            id                          : String(item.id),
            fecha_descargo_format       : item.props.fechaDescargo?moment(item.props.fechaDescargo).format("DD/MM/YYYY").toString(): '',
            fecha_descargo              : item.props.fechaDescargo,
            estado_descargo             : item.props.estadoDescargo,
            viatico_pasaje_real         : item.props.viaticoPasajeReal,
            monto_despositado           : item.props.montoDespositado,
            monto_descargo              : item.props.montoDescargo,
            saldo_descargo              : item.props.saldoDescargo,
            presenta_informe            : item.props.presentaInforme,
            viatico_real                : item.props.viaticoReal,
            observacion_estado          : item.props.observacionEstado,
            observacion_descargo        :item.props.observacionDescargo,
            prorroga                    : item.props.prorroga,
            tiempo_descargo             : item.props.tiempoDescargo,
            notificacion_descargo       : item.props.notificacionDescargo,
            viatico_id                  : item.props.viaticoId, 
            num_recibo                  : numeroRecibo,
            usuario_nombre              : usuarioNombre,
            usuario_cargo               : cargoUsuario, 
            
            usuario_ci                      : ciUsuario,
            liquido_pagable                 : liquidoPagable,
            fecha_ida                       : fechaIda?moment(fechaIda).format("DD/MM/YYYY").toString(): '',
            fecha_retorno                   : fechaRetorno?moment(fechaRetorno).format("DD/MM/YYYY").toString(): '',
            destino                         : destinoNombre,
            cod_memo                        : codigoMemo,
            cantidad_dias                   : cantidadDias,
            tipo_memo_repo                  : tipoMemoRepo,
            partida_presupuestaria          : partidaPresupuestaria,
            ff_of                           : ffOf,
            area                            : area,
            sigla                           : siglaUsuario,
            estado_pago                     : estadoPago,             
            fecha_pago_viatico              :fechaPagoViatico?moment(fechaPagoViatico).format("DD/MM/YYYY").toString(): '',
            tipo_comision_idp               : tipoComisionIDP,
        };
    }).sort((a, b) => a.num_recibo > b.num_recibo ?-1:1);   
    const filtroBeneficiario : DescargoTableModel [] = result	
    .filter((value) => this.filtrarCI(value.usuario_ci!,beneficiario )); 
    const filtrarFecha : DescargoTableModel[] = this.filtrarPorFecha(filtroBeneficiario, fechaInicio, fechaFin);	
  
    const response = findAndCountResult(filtrarFecha, query); 
    return Result.ok(response);
	
}

public async getTipoUsuario(fechaInicio: string, fechaFin: string,tipo: string, query:any): Promise<Result<{ rows: DescargoTableModel[]  }>> {
       
		
    const descargo = await DescargoService.getAll();
    if (descargo.isFailure) return Result.fail("Falló al obtener la Descargo");
    const descargoResult = descargo.getValue();

    /*Listado de cargos*/
    const cargo = await CargoService.getAll();
    if(cargo.isFailure) return Result.fail("Fallo al obtener el Cargo");
    const cargoResult = cargo.getValue();
     /*Listado de usuarios*/
     const usuario = await UsuarioService.getAll();
     if(usuario.isFailure) return Result.fail("Fallo al obtener el Usuario");
     const usuarioResult = usuario.getValue();
    /*Listado de personal*/
    const personal =await PersonalService.getAll();
    if(personal.isFailure) return Result.fail("Fallo al obtener el Personal");
    const personalResult = personal.getValue();
     /*Listado de Viaticos*/
     const viatico =await ViaticoService.getAll();
     if(viatico.isFailure) return Result.fail("Fallo al obtener el Viatico");
     const viaticoResult = viatico.getValue();

     const memorandum = await MemorandumService.getAll();
     if (memorandum.isFailure) return Result.fail("Falló al obtener la Memorandum");
     const memorandumResult = memorandum.getValue();

     const detalleDestino = await DetalleDestinoService.getAll();
     if (detalleDestino.isFailure) return Result.fail("Falló al obtener la Detalle destino");
     const detalleDestinoResult = detalleDestino.getValue();

      /*Listado de escala Destino*/
    const escalaDestino =await EscalaDestinoService.getAll();
    if(escalaDestino.isFailure) return Result.fail("Fallo al obtener el Escala Destino");
    const escalaDestinoResult = escalaDestino.getValue();
    /*Listado de apertura*/
    const apertura =await AperturaViaticoService.getAll();
    if(apertura.isFailure) return Result.fail("Fallo al obtener el Apertura");
    const aperturaResult = apertura.getValue();
     /*Listado de apertura*/
     const area =await AreaService.getAll();
     if(area.isFailure) return Result.fail("Fallo al obtener el area");
     const areaResult = area.getValue();

                   
    const result: DescargoTableModel[] = descargoResult.map((item) => {

    const memorandumID = viaticoResult.find((c) => c.id === item.props.viaticoId)?.props.memorandumId|| "-";
    const numeroRecibo = viaticoResult.find((c) => c.id === item.props.viaticoId)?.props.numeRecibo||0;
    const usuarioID = memorandumResult.find((c) => c.id === memorandumID)?.props.usuarioId||"-"; 
    const tipoMemoRepo = memorandumResult.find((c) => c.id === memorandumID)?.props.tipoMemoRepo||"-"; 
    const aperturaID = memorandumResult.find((c) => c.id === memorandumID)?.props.aperturaViaticoId||"-";			
    const partidaPresupuestaria = aperturaResult.find((c) => c.id === aperturaID)?.props.aperturaProgramatica||"-";			
    const codFte = aperturaResult.find((c) => c.id === aperturaID)?.props.codFte||"-";
    const codOrg = aperturaResult.find((c) => c.id === aperturaID)?.props.codOrg||"-";  
    const ffOf = codFte.concat("-").concat(codOrg);
    const areaId = aperturaResult.find((c) => c.id === aperturaID)?.props.areaId||"-";  
    const area = areaResult.find((c) => c.id === areaId)?.props.nombre||"-"; 
    const siglaUsuario = areaResult.find((c)=> c.id === areaId)?.props.sigla||"-"; 

    /*seleccionamos del listado de area el nombre del departamento y su sigla*/
    const usuarioNombre = usuarioResult.find((c) => c.id === usuarioID)?.props.fullname|| "-";//Revisar
    const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === usuarioID)?.props.cargoId|| "-";
    const cargoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.nombre|| "-";
    const tipoUsuario = cargoResult.find((c)=>c.id === cargoUsuarioid)?.props.tipo|| "-";
   
    const ciUsuario = usuarioResult.find((c) => c.id === usuarioID)?.props.ci|| "-";
    const fechaIda = memorandumResult.find((c) => c.id === memorandumID)?.props.fechaInicioViaje||"-"; 
    const fechaRetorno = memorandumResult.find((c) => c.id === memorandumID)?.props.fechaFinViaje||"-";          
    const codigoMemo = memorandumResult.find((c) => c.id === memorandumID)?.props.codDepartMemo||"-"; 
    const cantidadDias = memorandumResult.find((c) => c.id === memorandumID)?.props.cantidadDias||"-"; 
   // const destino = detalleDestinoResult.find((c) => c.props.memorandumId === memorandumID)?.props.destinoReg||"-"; 
    const destino = detalleDestinoResult.filter(c => c.props.memorandumId === memorandumID).find(c => c.props.destinoReg)?.props.destinoReg || "-";			
    const liquidoPagable = viaticoResult.find((c) => c.props.memorandumId === memorandumID)?.props.liquidoPagable||0;
    const ID_DESCARGO = String(item.id);
    const ID_VIATICO = descargoResult.find((a) => a.id === ID_DESCARGO)?.props.viaticoId ||"";
    const estadoPago = viaticoResult.find((a) => a.id === ID_VIATICO)?.props.estadoPago || "-";
    const fechaPagoViatico = viaticoResult.find((c) => c.props.memorandumId === memorandumID)?.props.fechaPagoViatico||"-";
    const tipoComisionIDP = memorandumResult.find((c) => c.id=== memorandumID)?.props.tipoComisionIDP|| "";    
        //Lista de destinos
        const listaDestinos: DetalleDestinoOptionsFormModel[] = detalleDestino
        .getValue()
        .map((item) => {                
                return {                
                    id: item.id.toString(),
                    nombre: item.props.memorandumId,
                    caption : item.props.destinoReg,
                    estado: item.props.estado,                                             
                };            
        }) ;         

        // Se filta por los destinos
        const filtroDestinos1 : DetalleDestinoOptionsFormModel [] = listaDestinos
        .filter((value) => this.filtrarId(value.nombre, memorandumID)); 
        const filtroDestinos : DetalleDestinoOptionsFormModel [] = filtroDestinos1
        .filter((value) => this.filtrarEstadoDestino(value.estado!,'SIN_VIAJE' )); 

                    // filtramos por el tipo de nombre
        const elementosUnicos = new Map(filtroDestinos.map(value => [value.caption, value]));
        
        let destinoNombre = '';
        if(elementosUnicos.size > 1){
                        
                        //recorrer 
                        elementosUnicos.forEach((value, key) => {
                        
                            if(escalaDestinoResult.find((c) => c.props.destino === value.caption)){
                                
                                destinoNombre = destinoNombre.concat( escalaDestinoResult.find((c) => c.props.destino === value.caption)?.props.destino|| "-").concat(' - ');					
                            
                            }else if( escalaDestinoResult.find((c) => c.id === destino)){
                                destinoNombre = destinoNombre.concat((escalaDestinoResult.find((c) => c.id === destino))?
                                escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-":destino).concat(' - ');   
                                
                            }
                            else {
                                destinoNombre = destinoNombre.concat(destino).concat(' - ');               
                            }              
                    });          
                    }else{
                        destinoNombre = (escalaDestinoResult.find((c) => c.id === destino))?
                        escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-":destino;   
                            
                    }       
       //Actualizando Fechas
   
        //Actualizando Fechas 
        return {
            id                          : String(item.id),
            fecha_descargo_format       : item.props.fechaDescargo?moment(item.props.fechaDescargo).format("DD/MM/YYYY").toString(): '',
            fecha_descargo              : item.props.fechaDescargo,
            estado_descargo             : item.props.estadoDescargo,
            viatico_pasaje_real         : item.props.viaticoPasajeReal,
            monto_despositado           : item.props.montoDespositado,
            monto_descargo              : item.props.montoDescargo,
            saldo_descargo              : item.props.saldoDescargo,
            presenta_informe            : item.props.presentaInforme,
            viatico_real                : item.props.viaticoReal,
            observacion_estado          : item.props.observacionEstado,
            observacion_descargo        :item.props.observacionDescargo,
            prorroga                    : item.props.prorroga,
            tiempo_descargo             : item.props.tiempoDescargo,
            notificacion_descargo       : item.props.notificacionDescargo,
            viatico_id                  : item.props.viaticoId, 
            num_recibo                  : numeroRecibo,
            usuario_nombre              : usuarioNombre,
            usuario_cargo               : cargoUsuario, 
            usuario_tipo                : tipoUsuario,
            
            usuario_ci                      : ciUsuario,
            liquido_pagable                 : liquidoPagable,
            fecha_ida                       : fechaIda?moment(fechaIda).format("DD/MM/YYYY").toString(): '',
            fecha_retorno                   : fechaRetorno?moment(fechaRetorno).format("DD/MM/YYYY").toString(): '',
            destino                         : destinoNombre,
            cod_memo                        : codigoMemo,
            cantidad_dias                   : cantidadDias,
            tipo_memo_repo                  : tipoMemoRepo,
            partida_presupuestaria          : partidaPresupuestaria,
            ff_of                           : ffOf,
            area                            : area,
            sigla                           : siglaUsuario,
            estado_pago                     : estadoPago,            
            fecha_pago_viatico              :fechaPagoViatico?moment(fechaPagoViatico).format("DD/MM/YYYY").toString(): '',
            tipo_comision_idp               : tipoComisionIDP,
        };
    }).sort((a, b) => a.num_recibo > b.num_recibo ?-1:1);   
   
    const filtroTipo : DescargoTableModel [] = result		
    .filter((value) => this.filtrarTipoUsuario(value.usuario_tipo!,tipo )); 	
     const filtrarFecha : DescargoTableModel[] = this.filtrarPorFecha(filtroTipo, fechaInicio, fechaFin);	
    const response = findAndCountResult(filtrarFecha, query); 
	
    return Result.ok(response);
	
}


public async getTipoEstado(fechaInicio: string, fechaFin: string,estado: string, query:any): Promise<Result<{ rows: DescargoTableModel[]  }>> {
       
		
    const descargo = await DescargoService.getAll();
    if (descargo.isFailure) return Result.fail("Falló al obtener la Descargo");
    const descargoResult = descargo.getValue();

    /*Listado de cargos*/
    const cargo = await CargoService.getAll();
    if(cargo.isFailure) return Result.fail("Fallo al obtener el Cargo");
    const cargoResult = cargo.getValue();
     /*Listado de usuarios*/
     const usuario = await UsuarioService.getAll();
     if(usuario.isFailure) return Result.fail("Fallo al obtener el Usuario");
     const usuarioResult = usuario.getValue();
    /*Listado de personal*/
    const personal =await PersonalService.getAll();
    if(personal.isFailure) return Result.fail("Fallo al obtener el Personal");
    const personalResult = personal.getValue();
     /*Listado de Viaticos*/
     const viatico =await ViaticoService.getAll();
     if(viatico.isFailure) return Result.fail("Fallo al obtener el Personal");
     const viaticoResult = viatico.getValue();

     const memorandum = await MemorandumService.getAll();
     if (memorandum.isFailure) return Result.fail("Falló al obtener la Memorandum");
     const memorandumResult = memorandum.getValue();

     const detalleDestino = await DetalleDestinoService.getAll();
     if (detalleDestino.isFailure) return Result.fail("Falló al obtener la Detalle destino");
     const detalleDestinoResult = detalleDestino.getValue();

      /*Listado de escala Destino*/
    const escalaDestino =await EscalaDestinoService.getAll();
    if(escalaDestino.isFailure) return Result.fail("Fallo al obtener el Escala Destino");
    const escalaDestinoResult = escalaDestino.getValue();
    /*Listado de apertura*/
    const apertura =await AperturaViaticoService.getAll();
    if(apertura.isFailure) return Result.fail("Fallo al obtener el Apertura");
    const aperturaResult = apertura.getValue();
     /*Listado de apertura*/
     const area =await AreaService.getAll();
     if(area.isFailure) return Result.fail("Fallo al obtener el area");
     const areaResult = area.getValue();

                   
    const result: DescargoTableModel[] = descargoResult.map((item) => {

    const memorandumID = viaticoResult.find((c) => c.id === item.props.viaticoId)?.props.memorandumId|| "-";
    const numeroRecibo = viaticoResult.find((c) => c.id === item.props.viaticoId)?.props.numeRecibo||0;
    const usuarioID = memorandumResult.find((c) => c.id === memorandumID)?.props.usuarioId||"-"; 
    const tipoMemoRepo = memorandumResult.find((c) => c.id === memorandumID)?.props.tipoMemoRepo||"-"; 
    const aperturaID = memorandumResult.find((c) => c.id === memorandumID)?.props.aperturaViaticoId||"-";			
    const partidaPresupuestaria = aperturaResult.find((c) => c.id === aperturaID)?.props.aperturaProgramatica||"-";			
    const codFte = aperturaResult.find((c) => c.id === aperturaID)?.props.codFte||"-";
    const codOrg = aperturaResult.find((c) => c.id === aperturaID)?.props.codOrg||"-";  
    const ffOf = codFte.concat("-").concat(codOrg);
    const areaId = aperturaResult.find((c) => c.id === aperturaID)?.props.areaId||"-";  
    const area = areaResult.find((c) => c.id === areaId)?.props.nombre||"-"; 
    const siglaUsuario = areaResult.find((c)=> c.id === areaId)?.props.sigla||"-"; 

    /*seleccionamos del listado de area el nombre del departamento y su sigla*/
    const usuarioNombre = usuarioResult.find((c) => c.id === usuarioID)?.props.fullname|| "-";//Revisar
    const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === usuarioID)?.props.cargoId|| "-";
    const cargoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.nombre|| "-";
    const tipoUsuario = cargoResult.find((c)=>c.id === cargoUsuarioid)?.props.tipo|| "-";
   
    const ciUsuario = usuarioResult.find((c) => c.id === usuarioID)?.props.ci|| "-";
    const fechaIda = memorandumResult.find((c) => c.id === memorandumID)?.props.fechaInicioViaje||"-"; 
    const fechaRetorno = memorandumResult.find((c) => c.id === memorandumID)?.props.fechaFinViaje||"-";          
    const codigoMemo = memorandumResult.find((c) => c.id === memorandumID)?.props.codDepartMemo||"-"; 
    const cantidadDias = memorandumResult.find((c) => c.id === memorandumID)?.props.cantidadDias||"-"; 
  //  const destino = detalleDestinoResult.find((c) => c.props.memorandumId === memorandumID)?.props.destinoReg||"-"; 
   const destino = detalleDestinoResult.filter(c => c.props.memorandumId === memorandumID).find(c => c.props.destinoReg)?.props.destinoReg || "-";			
    const liquidoPagable = viaticoResult.find((c) => c.props.memorandumId === memorandumID)?.props.liquidoPagable||0;
    const ID_DESCARGO = String(item.id);
    const ID_VIATICO = descargoResult.find((a) => a.id === ID_DESCARGO)?.props.viaticoId ||"";
    const estadoPago = viaticoResult.find((a) => a.id === ID_VIATICO)?.props.estadoPago || "-";
    const fechaPagoViatico = viaticoResult.find((c) => c.props.memorandumId === memorandumID)?.props.fechaPagoViatico||"-";
     const tipoComisionIDP = memorandumResult.find((c) => c.id=== memorandumID)?.props.tipoComisionIDP|| "";    
        //Lista de destinos
        const listaDestinos: DetalleDestinoOptionsFormModel[] = detalleDestino
        .getValue()
        .map((item) => {                
                return {                
                    id: item.id.toString(),
                    nombre: item.props.memorandumId,
                    caption : item.props.destinoReg,
                    estado: item.props.estado,                                             
                };            
        }) ;         

        // Se filta por los destinos
        const filtroDestinos1 : DetalleDestinoOptionsFormModel [] = listaDestinos
        .filter((value) => this.filtrarId(value.nombre, memorandumID)); 
        const filtroDestinos : DetalleDestinoOptionsFormModel [] = filtroDestinos1
        .filter((value) => this.filtrarEstadoDestino(value.estado!,'SIN_VIAJE' )); 

                    // filtramos por el tipo de nombre
        const elementosUnicos = new Map(filtroDestinos.map(value => [value.caption, value]));
        
        let destinoNombre = '';
        if(elementosUnicos.size > 1){
                        
                        //recorrer 
                        elementosUnicos.forEach((value, key) => {
                        
                            if(escalaDestinoResult.find((c) => c.props.destino === value.caption)){
                                
                                destinoNombre = destinoNombre.concat( escalaDestinoResult.find((c) => c.props.destino === value.caption)?.props.destino|| "-").concat(' - ');					
                            
                            }else if( escalaDestinoResult.find((c) => c.id === destino)){
                                destinoNombre = destinoNombre.concat((escalaDestinoResult.find((c) => c.id === destino))?
                                escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-":destino).concat(' - ');   
                                
                            }
                            else {
                                destinoNombre = destinoNombre.concat(destino).concat(' - ');               
                            }              
                    });          
                    }else{
                        destinoNombre = (escalaDestinoResult.find((c) => c.id === destino))?
                        escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-":destino;   
                            
                    }       
       //Actualizando Fechas
   
        //Actualizando Fechas 
        return {
            id                          : String(item.id),
            fecha_descargo_format       : item.props.fechaDescargo?moment(item.props.fechaDescargo).format("DD/MM/YYYY").toString(): '',
            fecha_descargo              : item.props.fechaDescargo,
            estado_descargo             : item.props.estadoDescargo,
            viatico_pasaje_real         : item.props.viaticoPasajeReal,
            monto_despositado           : item.props.montoDespositado,
            monto_descargo              : item.props.montoDescargo,
            saldo_descargo              : item.props.saldoDescargo,
            presenta_informe            : item.props.presentaInforme,
            viatico_real                : item.props.viaticoReal,
            observacion_estado          : item.props.observacionEstado,
            observacion_descargo        :item.props.observacionDescargo,
            prorroga                    : item.props.prorroga,
            tiempo_descargo             : item.props.tiempoDescargo,
            notificacion_descargo       : item.props.notificacionDescargo,
            viatico_id                  : item.props.viaticoId, 
            num_recibo                  : numeroRecibo,
            usuario_nombre              : usuarioNombre,
            usuario_cargo               : cargoUsuario, 
            usuario_tipo                : tipoUsuario,
            
            usuario_ci                      : ciUsuario,
            liquido_pagable                 : liquidoPagable,
            fecha_ida                       : fechaIda?moment(fechaIda).format("DD/MM/YYYY").toString(): '',
            fecha_retorno                   : fechaRetorno?moment(fechaRetorno).format("DD/MM/YYYY").toString(): '',
            destino                         : destinoNombre,
            cod_memo                        : codigoMemo,
            cantidad_dias                   : cantidadDias,
            tipo_memo_repo                  : tipoMemoRepo,
            partida_presupuestaria          : partidaPresupuestaria,
            ff_of                           : ffOf,
            area                            : area,
            sigla                           : siglaUsuario,
            estado_pago                     : estadoPago,            
            fecha_pago_viatico              :fechaPagoViatico?moment(fechaPagoViatico).format("DD/MM/YYYY").toString(): '',
            tipo_comision_idp               : tipoComisionIDP,
        };
    }).sort((a, b) => a.num_recibo > b.num_recibo ?-1:1);   
   
    const filtroTipo : DescargoTableModel [] = result		
    .filter((value) => this.filtrarTipoEstado(value.estado_descargo, value.presenta_informe,estado )); 	
    const filtrarFecha : DescargoTableModel[] = this.filtrarPorFecha(filtroTipo, fechaInicio, fechaFin);	
    
    const response = findAndCountResult(filtrarFecha, query); 
	
    return Result.ok(response);
	
}

public async getEstadoPago(fechaInicio: string, fechaFin: string,estado: string, query:any): Promise<Result<{ rows: DescargoTableModel[]  }>> {
       
		
    const descargo = await DescargoService.getAll();
    if (descargo.isFailure) return Result.fail("Falló al obtener la Descargo");
    const descargoResult = descargo.getValue();

    /*Listado de cargos*/
    const cargo = await CargoService.getAll();
    if(cargo.isFailure) return Result.fail("Fallo al obtener el Cargo");
    const cargoResult = cargo.getValue();
     /*Listado de usuarios*/
     const usuario = await UsuarioService.getAll();
     if(usuario.isFailure) return Result.fail("Fallo al obtener el Usuario");
     const usuarioResult = usuario.getValue();
    /*Listado de personal*/
    const personal =await PersonalService.getAll();
    if(personal.isFailure) return Result.fail("Fallo al obtener el Personal");
    const personalResult = personal.getValue();
     /*Listado de Viaticos*/
     const viatico =await ViaticoService.getAll();
     if(viatico.isFailure) return Result.fail("Fallo al obtener el Personal");
     const viaticoResult = viatico.getValue();

     const memorandum = await MemorandumService.getAll();
     if (memorandum.isFailure) return Result.fail("Falló al obtener la Memorandum");
     const memorandumResult = memorandum.getValue();

     const detalleDestino = await DetalleDestinoService.getAll();
     if (detalleDestino.isFailure) return Result.fail("Falló al obtener la Detalle destino");
     const detalleDestinoResult = detalleDestino.getValue();

      /*Listado de escala Destino*/
    const escalaDestino =await EscalaDestinoService.getAll();
    if(escalaDestino.isFailure) return Result.fail("Fallo al obtener el Escala Destino");
    const escalaDestinoResult = escalaDestino.getValue();
    /*Listado de apertura*/
    const apertura =await AperturaViaticoService.getAll();
    if(apertura.isFailure) return Result.fail("Fallo al obtener el Apertura");
    const aperturaResult = apertura.getValue();
     /*Listado de apertura*/
     const area =await AreaService.getAll();
     if(area.isFailure) return Result.fail("Fallo al obtener el area");
     const areaResult = area.getValue();

                   
    const result: DescargoTableModel[] = descargoResult.map((item) => {

    const memorandumID = viaticoResult.find((c) => c.id === item.props.viaticoId)?.props.memorandumId|| "-";
    const numeroRecibo = viaticoResult.find((c) => c.id === item.props.viaticoId)?.props.numeRecibo||0;
    const usuarioID = memorandumResult.find((c) => c.id === memorandumID)?.props.usuarioId||"-"; 
    const tipoMemoRepo = memorandumResult.find((c) => c.id === memorandumID)?.props.tipoMemoRepo||"-"; 
    const aperturaID = memorandumResult.find((c) => c.id === memorandumID)?.props.aperturaViaticoId||"-";			
    const partidaPresupuestaria = aperturaResult.find((c) => c.id === aperturaID)?.props.aperturaProgramatica||"-";			
    const codFte = aperturaResult.find((c) => c.id === aperturaID)?.props.codFte||"-";
    const codOrg = aperturaResult.find((c) => c.id === aperturaID)?.props.codOrg||"-";  
    const ffOf = codFte.concat("-").concat(codOrg);
    const areaId = aperturaResult.find((c) => c.id === aperturaID)?.props.areaId||"-";  
    const area = areaResult.find((c) => c.id === areaId)?.props.nombre||"-"; 
    const siglaUsuario = areaResult.find((c)=> c.id === areaId)?.props.sigla||"-"; 

    /*seleccionamos del listado de area el nombre del departamento y su sigla*/
    const usuarioNombre = usuarioResult.find((c) => c.id === usuarioID)?.props.fullname|| "-";//Revisar
    const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === usuarioID)?.props.cargoId|| "-";
    const cargoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.nombre|| "-";
    const tipoUsuario = cargoResult.find((c)=>c.id === cargoUsuarioid)?.props.tipo|| "-";
   
    const ciUsuario = usuarioResult.find((c) => c.id === usuarioID)?.props.ci|| "-";
    const fechaIda = memorandumResult.find((c) => c.id === memorandumID)?.props.fechaInicioViaje||"-"; 
    const fechaRetorno = memorandumResult.find((c) => c.id === memorandumID)?.props.fechaFinViaje||"-";          
    const codigoMemo = memorandumResult.find((c) => c.id === memorandumID)?.props.codDepartMemo||"-"; 
    const cantidadDias = memorandumResult.find((c) => c.id === memorandumID)?.props.cantidadDias||"-"; 
   // const destino = detalleDestinoResult.find((c) => c.props.memorandumId === memorandumID)?.props.destinoReg||"-"; 
    const destino = detalleDestinoResult.filter(c => c.props.memorandumId === memorandumID).find(c => c.props.destinoReg)?.props.destinoReg || "-";			
    const liquidoPagable = viaticoResult.find((c) => c.props.memorandumId === memorandumID)?.props.liquidoPagable||0;
    const estadoPago = viaticoResult.find((c) => c.props.memorandumId === memorandumID)?.props.estadoPago||"";
    const fechaPagoViatico = viaticoResult.find((c) => c.props.memorandumId === memorandumID)?.props.fechaPagoViatico||"-";
     const tipoComisionIDP = memorandumResult.find((c) => c.id=== memorandumID)?.props.tipoComisionIDP|| "";    
        //Lista de destinos
        const listaDestinos: DetalleDestinoOptionsFormModel[] = detalleDestino
        .getValue()
        .map((item) => {                
                return {                
                    id: item.id.toString(),
                    nombre: item.props.memorandumId,
                    caption : item.props.destinoReg,
                    estado: item.props.estado,                                             
                };            
        }) ;         

        // Se filta por los destinos
        const filtroDestinos1 : DetalleDestinoOptionsFormModel [] = listaDestinos
        .filter((value) => this.filtrarId(value.nombre, memorandumID)); 
        const filtroDestinos : DetalleDestinoOptionsFormModel [] = filtroDestinos1
        .filter((value) => this.filtrarEstadoDestino(value.estado!,'SIN_VIAJE' )); 

                    // filtramos por el tipo de nombre
        const elementosUnicos = new Map(filtroDestinos.map(value => [value.caption, value]));
        
        let destinoNombre = '';
         if(elementosUnicos.size > 1){
                        
                        //recorrer 
                        elementosUnicos.forEach((value, key) => {
                        
                            if(escalaDestinoResult.find((c) => c.props.destino === value.caption)){
                                
                                destinoNombre = destinoNombre.concat( escalaDestinoResult.find((c) => c.props.destino === value.caption)?.props.destino|| "-").concat(' - ');					
                            
                            }else if( escalaDestinoResult.find((c) => c.id === destino)){
                                destinoNombre = destinoNombre.concat((escalaDestinoResult.find((c) => c.id === destino))?
                                escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-":destino).concat(' - ');   
                                
                            }
                            else {
                                destinoNombre = destinoNombre.concat(destino).concat(' - ');               
                            }              
                    });          
                    }else{
                        destinoNombre = (escalaDestinoResult.find((c) => c.id === destino))?
                        escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-":destino;   
                            
                    }       
   
        //Actualizando Fechas 
        return {
            id                          : String(item.id),
            fecha_descargo_format       : item.props.fechaDescargo?moment(item.props.fechaDescargo).format("DD/MM/YYYY").toString(): '',
            fecha_descargo              : item.props.fechaDescargo,
            estado_descargo             : item.props.estadoDescargo,
            viatico_pasaje_real         : item.props.viaticoPasajeReal,
            monto_despositado           : item.props.montoDespositado,
            monto_descargo              : item.props.montoDescargo,
            saldo_descargo              : item.props.saldoDescargo,
            presenta_informe            : item.props.presentaInforme,
            viatico_real                : item.props.viaticoReal,
            observacion_estado          : item.props.observacionEstado,
            observacion_descargo        :item.props.observacionDescargo,
            prorroga                    : item.props.prorroga,
            tiempo_descargo             : item.props.tiempoDescargo,
            notificacion_descargo       : item.props.notificacionDescargo,
            viatico_id                  : item.props.viaticoId, 
            num_recibo                  : numeroRecibo,
            usuario_nombre              : usuarioNombre,
            usuario_cargo               : cargoUsuario, 
            usuario_tipo                : tipoUsuario,
            
            usuario_ci                      : ciUsuario,
            liquido_pagable                 : liquidoPagable,
            fecha_ida                       : fechaIda?moment(fechaIda).format("DD/MM/YYYY").toString(): '',
            fecha_retorno                   : fechaRetorno?moment(fechaRetorno).format("DD/MM/YYYY").toString(): '',
            destino                         : destinoNombre,
            cod_memo                        : codigoMemo,
            cantidad_dias                   : cantidadDias,
            tipo_memo_repo                  : tipoMemoRepo,
            partida_presupuestaria          : partidaPresupuestaria,
            ff_of                           : ffOf,
            area                            : area,
            sigla                           : siglaUsuario,
            estado_pago                     : estadoPago,          
            fecha_pago_viatico              :fechaPagoViatico?moment(fechaPagoViatico).format("DD/MM/YYYY").toString(): '',
            tipo_comision_idp               : tipoComisionIDP,
        };
    }).sort((a, b) => a.num_recibo > b.num_recibo ?-1:1);   
   
    const filtroTipo : DescargoTableModel [] = result		
    .filter((value) => this.filtrarEstadoPago(value.estado_pago!,estado ) && new Date(value.fecha_descargo).getFullYear() > 2000 ); 	
    const filtrarFecha : DescargoTableModel[] = this.filtrarPorFecha(filtroTipo, fechaInicio, fechaFin);		
    
    const response = findAndCountResult(filtrarFecha, query); 
	
    return Result.ok(response);
	
}



public filtrarTipoUsuario(item:string, tipo:string) {             
    return (item === tipo);     
   }


public filtrarTipoEstado(itemDescargo:string, itemInforme:string, estado:string) {       
    
    if(estado === ENUM_DESCARGADO_Y_PRESENTA_INFORME){
        return (itemDescargo === ENUM_DESCARGADO && itemInforme === ENUM_PRESENTA);
    }else if(estado === ENUM_DESCARGADO){
        return (itemDescargo === ENUM_DESCARGADO && itemInforme === ENUM_PENDIENTE);
    }else if(estado === ENUM_PRESENTA_INFORME){
        return (itemDescargo === ENUM_PENDIENTE && itemInforme === ENUM_PRESENTA);
    }else{
        return (itemDescargo === ENUM_PENDIENTE && itemInforme === ENUM_PENDIENTE);
    }   
}

public filtrarEstadoPago(itemEstadoPago:string, estado:string) {       
    
    if(estado === ENUM_APROBADO){
        return (itemEstadoPago === ENUM_APROBADO);
    }else if(estado === ENUM_ANULADO){
        return (itemEstadoPago === ENUM_ANULADO);
    }  
}

public async getTipoAnulado(fechaInicio: string, fechaFin: string,tipo: string, query:any): Promise<Result<{ rows: DescargoTableModel[]  }>> {
       
		
    const descargo = await DescargoService.getAll();
    if (descargo.isFailure) return Result.fail("Falló al obtener la Descargo");
    const descargoResult = descargo.getValue();

    /*Listado de cargos*/
    const cargo = await CargoService.getAll();
    if(cargo.isFailure) return Result.fail("Fallo al obtener el Cargo");
    const cargoResult = cargo.getValue();
     /*Listado de usuarios*/
     const usuario = await UsuarioService.getAll();
     if(usuario.isFailure) return Result.fail("Fallo al obtener el Usuario");
     const usuarioResult = usuario.getValue();
    /*Listado de personal*/
    const personal =await PersonalService.getAll();
    if(personal.isFailure) return Result.fail("Fallo al obtener el Personal");
    const personalResult = personal.getValue();
     /*Listado de Viaticos*/
     const viatico =await ViaticoService.getAll();
     if(viatico.isFailure) return Result.fail("Fallo al obtener el Viatico");
     const viaticoResult = viatico.getValue();

     const memorandum = await MemorandumService.getAll();
     if (memorandum.isFailure) return Result.fail("Falló al obtener la Memorandum");
     const memorandumResult = memorandum.getValue();

     const detalleDestino = await DetalleDestinoService.getAll();
     if (detalleDestino.isFailure) return Result.fail("Falló al obtener la Detalle destino");
     const detalleDestinoResult = detalleDestino.getValue();

      /*Listado de escala Destino*/
    const escalaDestino =await EscalaDestinoService.getAll();
    if(escalaDestino.isFailure) return Result.fail("Fallo al obtener el Escala Destino");
    const escalaDestinoResult = escalaDestino.getValue();
    /*Listado de apertura*/
    const apertura =await AperturaViaticoService.getAll();
    if(apertura.isFailure) return Result.fail("Fallo al obtener el Apertura");
    const aperturaResult = apertura.getValue();
     /*Listado de apertura*/
     const area =await AreaService.getAll();
     if(area.isFailure) return Result.fail("Fallo al obtener el area");
     const areaResult = area.getValue();

                   
    const result: DescargoTableModel[] = descargoResult.map((item) => {

    const memorandumID = viaticoResult.find((c) => c.id === item.props.viaticoId)?.props.memorandumId|| "-";
    const numeroRecibo = viaticoResult.find((c) => c.id === item.props.viaticoId)?.props.numeRecibo||0;
    const usuarioID = memorandumResult.find((c) => c.id === memorandumID)?.props.usuarioId||"-"; 
    const tipoMemoRepo = memorandumResult.find((c) => c.id === memorandumID)?.props.tipoMemoRepo||"-"; 
    const aperturaID = memorandumResult.find((c) => c.id === memorandumID)?.props.aperturaViaticoId||"-";			
    const partidaPresupuestaria = aperturaResult.find((c) => c.id === aperturaID)?.props.aperturaProgramatica||"-";			
    const codFte = aperturaResult.find((c) => c.id === aperturaID)?.props.codFte||"-";
    const codOrg = aperturaResult.find((c) => c.id === aperturaID)?.props.codOrg||"-";  
    const ffOf = codFte.concat("-").concat(codOrg);
    const areaId = aperturaResult.find((c) => c.id === aperturaID)?.props.areaId||"-";  
    const area = areaResult.find((c) => c.id === areaId)?.props.nombre||"-"; 
    const siglaUsuario = areaResult.find((c)=> c.id === areaId)?.props.sigla||"-"; 

    /*seleccionamos del listado de area el nombre del departamento y su sigla*/
    const usuarioNombre = usuarioResult.find((c) => c.id === usuarioID)?.props.fullname|| "-";//Revisar
    const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === usuarioID)?.props.cargoId|| "-";
    const cargoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.nombre|| "-";
    const tipoUsuario = cargoResult.find((c)=>c.id === cargoUsuarioid)?.props.tipo|| "-";
   
    const ciUsuario = usuarioResult.find((c) => c.id === usuarioID)?.props.ci|| "-";
    const fechaIda = memorandumResult.find((c) => c.id === memorandumID)?.props.fechaInicioViaje||"-"; 
    const fechaRetorno = memorandumResult.find((c) => c.id === memorandumID)?.props.fechaFinViaje||"-";          
    const codigoMemo = memorandumResult.find((c) => c.id === memorandumID)?.props.codDepartMemo||"-"; 
    const cantidadDias = memorandumResult.find((c) => c.id === memorandumID)?.props.cantidadDias||"-"; 
   // const destino = detalleDestinoResult.find((c) => c.props.memorandumId === memorandumID)?.props.destinoReg||"-"; 
    const destino = detalleDestinoResult.filter(c => c.props.memorandumId === memorandumID).find(c => c.props.destinoReg)?.props.destinoReg || "-";			
    const liquidoPagable = viaticoResult.find((c) => c.props.memorandumId === memorandumID)?.props.liquidoPagable||0;
    const ID_DESCARGO = String(item.id);
    const ID_VIATICO = descargoResult.find((a) => a.id === ID_DESCARGO)?.props.viaticoId ||"";
    const estadoPago = viaticoResult.find((a) => a.id === ID_VIATICO)?.props.estadoPago || "-";
    const fechaPagoViatico = viaticoResult.find((c) => c.props.memorandumId === memorandumID)?.props.fechaPagoViatico||"-";
    const tipoComisionIDP = memorandumResult.find((c) => c.id=== memorandumID)?.props.tipoComisionIDP|| "";    
     const fechaAnulacion = viaticoResult.find((c) => c.props.memorandumId === memorandumID)?.props.fechaAnulacion;
        //Lista de destinos
        const listaDestinos: DetalleDestinoOptionsFormModel[] = detalleDestino
        .getValue()
        .map((item) => {                
                return {                
                    id: item.id.toString(),
                    nombre: item.props.memorandumId,
                    caption : item.props.destinoReg,
                    estado: item.props.estado,                                             
                };            
        }) ;         

        // Se filta por los destinos
        const filtroDestinos1 : DetalleDestinoOptionsFormModel [] = listaDestinos
        .filter((value) => this.filtrarId(value.nombre, memorandumID)); 
        const filtroDestinos : DetalleDestinoOptionsFormModel [] = filtroDestinos1
        .filter((value) => this.filtrarEstadoDestino(value.estado!,'SIN_VIAJE' )); 

                    // filtramos por el tipo de nombre
        const elementosUnicos = new Map(filtroDestinos.map(value => [value.caption, value]));
        
        let destinoNombre = '';
        if(elementosUnicos.size > 1){
                        
                        //recorrer 
                        elementosUnicos.forEach((value, key) => {
                        
                            if(escalaDestinoResult.find((c) => c.props.destino === value.caption)){
                                
                                destinoNombre = destinoNombre.concat( escalaDestinoResult.find((c) => c.props.destino === value.caption)?.props.destino|| "-").concat(' - ');					
                            
                            }else if( escalaDestinoResult.find((c) => c.id === destino)){
                                destinoNombre = destinoNombre.concat((escalaDestinoResult.find((c) => c.id === destino))?
                                escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-":destino).concat(' - ');   
                                
                            }
                            else {
                                destinoNombre = destinoNombre.concat(destino).concat(' - ');               
                            }              
                    });          
                    }else{
                        destinoNombre = (escalaDestinoResult.find((c) => c.id === destino))?
                        escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-":destino;   
                            
                    }       
       //Actualizando Fechas
   
        //Actualizando Fechas 
        return {
            id                          : String(item.id),
            fecha_descargo_format       : item.props.fechaDescargo?moment(item.props.fechaDescargo).format("DD/MM/YYYY").toString(): '',
            fecha_descargo              : item.props.fechaDescargo,
            estado_descargo             : item.props.estadoDescargo,
            viatico_pasaje_real         : item.props.viaticoPasajeReal,
            monto_despositado           : item.props.montoDespositado,
            monto_descargo              : item.props.montoDescargo,
            saldo_descargo              : item.props.saldoDescargo,
            presenta_informe            : item.props.presentaInforme,
            viatico_real                : item.props.viaticoReal,
            observacion_estado          : item.props.observacionEstado,
            observacion_descargo        :item.props.observacionDescargo,
            prorroga                    : item.props.prorroga,
            tiempo_descargo             : item.props.tiempoDescargo,
            notificacion_descargo       : item.props.notificacionDescargo,
            viatico_id                  : item.props.viaticoId, 
            num_recibo                  : numeroRecibo,
            usuario_nombre              : usuarioNombre,
            usuario_cargo               : cargoUsuario, 
            usuario_tipo                : tipoUsuario,
            
            usuario_ci                      : ciUsuario,
            liquido_pagable                 : liquidoPagable,
            fecha_ida                       : fechaIda?moment(fechaIda).format("DD/MM/YYYY").toString(): '',
            fecha_retorno                   : fechaRetorno?moment(fechaRetorno).format("DD/MM/YYYY").toString(): '',
            destino                         : destinoNombre,
            cod_memo                        : codigoMemo,
            cantidad_dias                   : cantidadDias,
            tipo_memo_repo                  : tipoMemoRepo,
            partida_presupuestaria          : partidaPresupuestaria,
            ff_of                           : ffOf,
            area                            : area,
            sigla                           : siglaUsuario,
            estado_pago                     : estadoPago,            
            fecha_pago_viatico              :fechaPagoViatico?moment(fechaPagoViatico).format("DD/MM/YYYY").toString(): '',
            tipo_comision_idp               : tipoComisionIDP,
            fecha_anulacion                 : fechaAnulacion,
        };
    }).sort((a, b) => a.num_recibo > b.num_recibo ?-1:1);   
   
    const filtroTipo : DescargoTableModel [] = result		
    .filter((value) => this.filtrarEstadoPago(value.estado_descargo,tipo ));    
     const filtroTipoReciboAnulado : DescargoTableModel [] = filtroTipo		
    .filter((value) =>  new Date(value.fecha_descargo).getFullYear() < 1990); 
     
    const filtrarFecha : DescargoTableModel[] = this.filtrarPorFechaAnulacion(filtroTipoReciboAnulado, fechaInicio, fechaFin);		
	console.log("TCL: filtrarFecha", filtrarFecha)
	
    const response = findAndCountResult(filtrarFecha, query); 
	
    return Result.ok(response);
	
}

public async getTipoVencimiento(fechaInicio: string, fechaFin: string,tipo: number, query:any): Promise<Result<{ rows: DescargoTableModel[]  }>> {
       
		
    const descargo = await DescargoService.getAll();
    if (descargo.isFailure) return Result.fail("Falló al obtener la Descargo");
    const descargoResult = descargo.getValue();

    /*Listado de cargos*/
    const cargo = await CargoService.getAll();
    if(cargo.isFailure) return Result.fail("Fallo al obtener el Cargo");
    const cargoResult = cargo.getValue();
     /*Listado de usuarios*/
     const usuario = await UsuarioService.getAll();
     if(usuario.isFailure) return Result.fail("Fallo al obtener el Usuario");
     const usuarioResult = usuario.getValue();
    /*Listado de personal*/
    const personal =await PersonalService.getAll();
    if(personal.isFailure) return Result.fail("Fallo al obtener el Personal");
    const personalResult = personal.getValue();
     /*Listado de Viaticos*/
     const viatico =await ViaticoService.getAll();
     if(viatico.isFailure) return Result.fail("Fallo al obtener el Viatico");
     const viaticoResult = viatico.getValue();

     const memorandum = await MemorandumService.getAll();
     if (memorandum.isFailure) return Result.fail("Falló al obtener la Memorandum");
     const memorandumResult = memorandum.getValue();

     const detalleDestino = await DetalleDestinoService.getAll();
     if (detalleDestino.isFailure) return Result.fail("Falló al obtener la Detalle destino");
     const detalleDestinoResult = detalleDestino.getValue();

      /*Listado de escala Destino*/
    const escalaDestino =await EscalaDestinoService.getAll();
    if(escalaDestino.isFailure) return Result.fail("Fallo al obtener el Escala Destino");
    const escalaDestinoResult = escalaDestino.getValue();
    /*Listado de apertura*/
    const apertura =await AperturaViaticoService.getAll();
    if(apertura.isFailure) return Result.fail("Fallo al obtener el Apertura");
    const aperturaResult = apertura.getValue();
     /*Listado de apertura*/
     const area =await AreaService.getAll();
     if(area.isFailure) return Result.fail("Fallo al obtener el area");
     const areaResult = area.getValue();

                   
    const result: DescargoTableModel[] = descargoResult.map((item) => {

    const memorandumID = viaticoResult.find((c) => c.id === item.props.viaticoId)?.props.memorandumId|| "-";
    const numeroRecibo = viaticoResult.find((c) => c.id === item.props.viaticoId)?.props.numeRecibo||0;
    const usuarioID = memorandumResult.find((c) => c.id === memorandumID)?.props.usuarioId||"-"; 
    const tipoMemoRepo = memorandumResult.find((c) => c.id === memorandumID)?.props.tipoMemoRepo||"-"; 
    const aperturaID = memorandumResult.find((c) => c.id === memorandumID)?.props.aperturaViaticoId||"-";			
    const partidaPresupuestaria = aperturaResult.find((c) => c.id === aperturaID)?.props.aperturaProgramatica||"-";			
    const codFte = aperturaResult.find((c) => c.id === aperturaID)?.props.codFte||"-";
    const codOrg = aperturaResult.find((c) => c.id === aperturaID)?.props.codOrg||"-";  
    const ffOf = codFte.concat("-").concat(codOrg);
    const areaId = aperturaResult.find((c) => c.id === aperturaID)?.props.areaId||"-";  
    const area = areaResult.find((c) => c.id === areaId)?.props.nombre||"-"; 
    const siglaUsuario = areaResult.find((c)=> c.id === areaId)?.props.sigla||"-"; 

    /*seleccionamos del listado de area el nombre del departamento y su sigla*/
    const usuarioNombre = usuarioResult.find((c) => c.id === usuarioID)?.props.fullname|| "-";//Revisar
    const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === usuarioID)?.props.cargoId|| "-";
    const cargoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.nombre|| "-";
    const tipoUsuario = cargoResult.find((c)=>c.id === cargoUsuarioid)?.props.tipo|| "-";
   
    const ciUsuario = usuarioResult.find((c) => c.id === usuarioID)?.props.ci|| "-";
    const fechaIda = memorandumResult.find((c) => c.id === memorandumID)?.props.fechaInicioViaje||"-"; 
    const fechaRetorno = memorandumResult.find((c) => c.id === memorandumID)?.props.fechaFinViaje||"-";          
    const codigoMemo = memorandumResult.find((c) => c.id === memorandumID)?.props.codDepartMemo||"-"; 
    const cantidadDias = memorandumResult.find((c) => c.id === memorandumID)?.props.cantidadDias||"-"; 
   // const destino = detalleDestinoResult.find((c) => c.props.memorandumId === memorandumID)?.props.destinoReg||"-"; 
    const destino = detalleDestinoResult.filter(c => c.props.memorandumId === memorandumID).find(c => c.props.destinoReg)?.props.destinoReg || "-";			
    const liquidoPagable = viaticoResult.find((c) => c.props.memorandumId === memorandumID)?.props.liquidoPagable||0;
    const ID_DESCARGO = String(item.id);
    const ID_VIATICO = descargoResult.find((a) => a.id === ID_DESCARGO)?.props.viaticoId ||"";
    const estadoPago = viaticoResult.find((a) => a.id === ID_VIATICO)?.props.estadoPago || "-";
    const fechaPagoViatico = viaticoResult.find((c) => c.props.memorandumId === memorandumID)?.props.fechaPagoViatico||"-";
    const tipoComisionIDP = memorandumResult.find((c) => c.id=== memorandumID)?.props.tipoComisionIDP|| "";    
        //Lista de destinos
        const listaDestinos: DetalleDestinoOptionsFormModel[] = detalleDestino
        .getValue()
        .map((item) => {                
                return {                
                    id: item.id.toString(),
                    nombre: item.props.memorandumId,
                    caption : item.props.destinoReg,
                    estado: item.props.estado,                                             
                };            
        }) ;         

        // Se filta por los destinos
        const filtroDestinos1 : DetalleDestinoOptionsFormModel [] = listaDestinos
        .filter((value) => this.filtrarId(value.nombre, memorandumID)); 
        const filtroDestinos : DetalleDestinoOptionsFormModel [] = filtroDestinos1
        .filter((value) => this.filtrarEstadoDestino(value.estado!,'SIN_VIAJE' )); 

                    // filtramos por el tipo de nombre
        const elementosUnicos = new Map(filtroDestinos.map(value => [value.caption, value]));
        
        let destinoNombre = '';
        if(elementosUnicos.size > 1){
                        
                        //recorrer 
                        elementosUnicos.forEach((value, key) => {
                        
                            if(escalaDestinoResult.find((c) => c.props.destino === value.caption)){
                                
                                destinoNombre = destinoNombre.concat( escalaDestinoResult.find((c) => c.props.destino === value.caption)?.props.destino|| "-").concat(' - ');					
                            
                            }else if( escalaDestinoResult.find((c) => c.id === destino)){
                                destinoNombre = destinoNombre.concat((escalaDestinoResult.find((c) => c.id === destino))?
                                escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-":destino).concat(' - ');   
                                
                            }
                            else {
                                destinoNombre = destinoNombre.concat(destino).concat(' - ');               
                            }              
                    });          
                    }else{
                        destinoNombre = (escalaDestinoResult.find((c) => c.id === destino))?
                        escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-":destino;   
                            
                    }       
       //Actualizando Fechas
   
        //Actualizando Fechas 
        return {
            id                          : String(item.id),
            fecha_descargo_format       : item.props.fechaDescargo?moment(item.props.fechaDescargo).format("DD/MM/YYYY").toString(): '',
            fecha_descargo              : item.props.fechaDescargo,
            estado_descargo             : item.props.estadoDescargo,
            viatico_pasaje_real         : item.props.viaticoPasajeReal,
            monto_despositado           : item.props.montoDespositado,
            monto_descargo              : item.props.montoDescargo,
            saldo_descargo              : item.props.saldoDescargo,
            presenta_informe            : item.props.presentaInforme,
            viatico_real                : item.props.viaticoReal,
            observacion_estado          : item.props.observacionEstado,
            observacion_descargo        :item.props.observacionDescargo,
            prorroga                    : item.props.prorroga,
            tiempo_descargo             : item.props.tiempoDescargo,
            notificacion_descargo       : item.props.notificacionDescargo,
            viatico_id                  : item.props.viaticoId, 
            num_recibo                  : numeroRecibo,
            usuario_nombre              : usuarioNombre,
            usuario_cargo               : cargoUsuario, 
            usuario_tipo                : tipoUsuario,
            
            usuario_ci                      : ciUsuario,
            liquido_pagable                 : liquidoPagable,
            fecha_ida                       : fechaIda?moment(fechaIda).format("DD/MM/YYYY").toString(): '',
            fecha_retorno                   : fechaRetorno?moment(fechaRetorno).format("DD/MM/YYYY").toString(): '',
            destino                         : destinoNombre,
            cod_memo                        : codigoMemo,
            cantidad_dias                   : cantidadDias,
            tipo_memo_repo                  : tipoMemoRepo,
            partida_presupuestaria          : partidaPresupuestaria,
            ff_of                           : ffOf,
            area                            : area,
            sigla                           : siglaUsuario,
            estado_pago                     : estadoPago,            
            fecha_pago_viatico              :fechaPagoViatico?moment(fechaPagoViatico).format("DD/MM/YYYY").toString(): '',
            tipo_comision_idp               : tipoComisionIDP,
        };
    }).sort((a, b) => a.num_recibo > b.num_recibo ?-1:1);   
   
    const filtroTipo : DescargoTableModel [] = result		
    .filter((value) => this.filtrarTiempoDescargo(value.tiempo_descargo,tipo )); 
     const filtrarFecha : DescargoTableModel[] = this.filtrarPorFecha(filtroTipo, fechaInicio, fechaFin);		
    const response = findAndCountResult(filtrarFecha, query); 
	
    return Result.ok(response);
	
}
 public filtrarTiempoDescargo(item:number, tiempoDescargo:number) {             
        return (item === tiempoDescargo);     
       }  

public async getTipoPostPagoCancelado(fechaInicio: string, fechaFin: string,tipo: string, query:any): Promise<Result<{ rows: DescargoTableModel[]  }>> {
       
		
    const descargo = await DescargoService.getAll();
    if (descargo.isFailure) return Result.fail("Falló al obtener la Descargo");
    const descargoResult = descargo.getValue();

    /*Listado de cargos*/
    const cargo = await CargoService.getAll();
    if(cargo.isFailure) return Result.fail("Fallo al obtener el Cargo");
    const cargoResult = cargo.getValue();
     /*Listado de usuarios*/
     const usuario = await UsuarioService.getAll();
     if(usuario.isFailure) return Result.fail("Fallo al obtener el Usuario");
     const usuarioResult = usuario.getValue();
    /*Listado de personal*/
    const personal =await PersonalService.getAll();
    if(personal.isFailure) return Result.fail("Fallo al obtener el Personal");
    const personalResult = personal.getValue();
     /*Listado de Viaticos*/
     const viatico =await ViaticoService.getAll();
     if(viatico.isFailure) return Result.fail("Fallo al obtener el Viatico");
     const viaticoResult = viatico.getValue();

     const memorandum = await MemorandumService.getAll();
     if (memorandum.isFailure) return Result.fail("Falló al obtener la Memorandum");
     const memorandumResult = memorandum.getValue();

     const detalleDestino = await DetalleDestinoService.getAll();
     if (detalleDestino.isFailure) return Result.fail("Falló al obtener la Detalle destino");
     const detalleDestinoResult = detalleDestino.getValue();

      /*Listado de escala Destino*/
    const escalaDestino =await EscalaDestinoService.getAll();
    if(escalaDestino.isFailure) return Result.fail("Fallo al obtener el Escala Destino");
    const escalaDestinoResult = escalaDestino.getValue();
    /*Listado de apertura*/
    const apertura =await AperturaViaticoService.getAll();
    if(apertura.isFailure) return Result.fail("Fallo al obtener el Apertura");
    const aperturaResult = apertura.getValue();
     /*Listado de apertura*/
     const area =await AreaService.getAll();
     if(area.isFailure) return Result.fail("Fallo al obtener el area");
     const areaResult = area.getValue();

                   
    const result: DescargoTableModel[] = descargoResult.map((item) => {

    const memorandumID = viaticoResult.find((c) => c.id === item.props.viaticoId)?.props.memorandumId|| "-";
    const numeroRecibo = viaticoResult.find((c) => c.id === item.props.viaticoId)?.props.numeRecibo||0;
    const usuarioID = memorandumResult.find((c) => c.id === memorandumID)?.props.usuarioId||"-"; 
    const tipoMemoRepo = memorandumResult.find((c) => c.id === memorandumID)?.props.tipoMemoRepo||"-"; 
    const aperturaID = memorandumResult.find((c) => c.id === memorandumID)?.props.aperturaViaticoId||"-";			
    const partidaPresupuestaria = aperturaResult.find((c) => c.id === aperturaID)?.props.aperturaProgramatica||"-";			
    const codFte = aperturaResult.find((c) => c.id === aperturaID)?.props.codFte||"-";
    const codOrg = aperturaResult.find((c) => c.id === aperturaID)?.props.codOrg||"-";  
    const ffOf = codFte.concat("-").concat(codOrg);
    const areaId = aperturaResult.find((c) => c.id === aperturaID)?.props.areaId||"-";  
    const area = areaResult.find((c) => c.id === areaId)?.props.nombre||"-"; 
    const siglaUsuario = areaResult.find((c)=> c.id === areaId)?.props.sigla||"-"; 

    /*seleccionamos del listado de area el nombre del departamento y su sigla*/
    const usuarioNombre = usuarioResult.find((c) => c.id === usuarioID)?.props.fullname|| "-";//Revisar
    const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === usuarioID)?.props.cargoId|| "-";
    const cargoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.nombre|| "-";
    const tipoUsuario = cargoResult.find((c)=>c.id === cargoUsuarioid)?.props.tipo|| "-";
   
    const ciUsuario = usuarioResult.find((c) => c.id === usuarioID)?.props.ci|| "-";
    const fechaIda = memorandumResult.find((c) => c.id === memorandumID)?.props.fechaInicioViaje||"-"; 
    const fechaRetorno = memorandumResult.find((c) => c.id === memorandumID)?.props.fechaFinViaje||"-";          
    const codigoMemo = memorandumResult.find((c) => c.id === memorandumID)?.props.codDepartMemo||"-"; 
    const cantidadDias = memorandumResult.find((c) => c.id === memorandumID)?.props.cantidadDias||"-"; 
   // const destino = detalleDestinoResult.find((c) => c.props.memorandumId === memorandumID)?.props.destinoReg||"-"; 
    const destino = detalleDestinoResult.filter(c => c.props.memorandumId === memorandumID).find(c => c.props.destinoReg)?.props.destinoReg || "-";			
    const liquidoPagable = viaticoResult.find((c) => c.props.memorandumId === memorandumID)?.props.liquidoPagable||0;
    const ID_DESCARGO = String(item.id);
    const ID_VIATICO = descargoResult.find((a) => a.id === ID_DESCARGO)?.props.viaticoId ||"";
    const estadoPago = viaticoResult.find((a) => a.id === ID_VIATICO)?.props.estadoPago || "-";
    const fechaPagoViatico = viaticoResult.find((c) => c.props.memorandumId === memorandumID)?.props.fechaPagoViatico||"-";
    const tipoComisionIDP = memorandumResult.find((c) => c.id=== memorandumID)?.props.tipoComisionIDP|| "";    
        //Lista de destinos
        const listaDestinos: DetalleDestinoOptionsFormModel[] = detalleDestino
        .getValue()
        .map((item) => {                
                return {                
                    id: item.id.toString(),
                    nombre: item.props.memorandumId,
                    caption : item.props.destinoReg,
                    estado: item.props.estado,                                             
                };            
        }) ;         

        // Se filta por los destinos
        const filtroDestinos1 : DetalleDestinoOptionsFormModel [] = listaDestinos
        .filter((value) => this.filtrarId(value.nombre, memorandumID)); 
        const filtroDestinos : DetalleDestinoOptionsFormModel [] = filtroDestinos1
        .filter((value) => this.filtrarEstadoDestino(value.estado!,'SIN_VIAJE' )); 

                    // filtramos por el tipo de nombre
        const elementosUnicos = new Map(filtroDestinos.map(value => [value.caption, value]));
        
        let destinoNombre = '';
        if(elementosUnicos.size > 1){
                        
                        //recorrer 
                        elementosUnicos.forEach((value, key) => {
                        
                            if(escalaDestinoResult.find((c) => c.props.destino === value.caption)){
                                
                                destinoNombre = destinoNombre.concat( escalaDestinoResult.find((c) => c.props.destino === value.caption)?.props.destino|| "-").concat(' - ');					
                            
                            }else if( escalaDestinoResult.find((c) => c.id === destino)){
                                destinoNombre = destinoNombre.concat((escalaDestinoResult.find((c) => c.id === destino))?
                                escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-":destino).concat(' - ');   
                                
                            }
                            else {
                                destinoNombre = destinoNombre.concat(destino).concat(' - ');               
                            }              
                    });          
                    }else{
                        destinoNombre = (escalaDestinoResult.find((c) => c.id === destino))?
                        escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-":destino;   
                            
                    }       
       //Actualizando Fechas
   
        //Actualizando Fechas 
        return {
            id                          : String(item.id),
            fecha_descargo_format       : item.props.fechaDescargo?moment(item.props.fechaDescargo).format("DD/MM/YYYY").toString(): '',
            fecha_descargo              : item.props.fechaDescargo,
            estado_descargo             : item.props.estadoDescargo,
            viatico_pasaje_real         : item.props.viaticoPasajeReal,
            monto_despositado           : item.props.montoDespositado,
            monto_descargo              : item.props.montoDescargo,
            saldo_descargo              : item.props.saldoDescargo,
            presenta_informe            : item.props.presentaInforme,
            viatico_real                : item.props.viaticoReal,
            observacion_estado          : item.props.observacionEstado,
            observacion_descargo        :item.props.observacionDescargo,
            prorroga                    : item.props.prorroga,
            tiempo_descargo             : item.props.tiempoDescargo,
            notificacion_descargo       : item.props.notificacionDescargo,
            viatico_id                  : item.props.viaticoId, 
            num_recibo                  : numeroRecibo,
            usuario_nombre              : usuarioNombre,
            usuario_cargo               : cargoUsuario, 
            usuario_tipo                : tipoUsuario,
            
            usuario_ci                      : ciUsuario,
            liquido_pagable                 : liquidoPagable,
            fecha_ida                       : fechaIda?moment(fechaIda).format("DD/MM/YYYY").toString(): '',
            fecha_retorno                   : fechaRetorno?moment(fechaRetorno).format("DD/MM/YYYY").toString(): '',
            destino                         : destinoNombre,
            cod_memo                        : codigoMemo,
            cantidad_dias                   : cantidadDias,
            tipo_memo_repo                  : tipoMemoRepo,
            partida_presupuestaria          : partidaPresupuestaria,
            ff_of                           : ffOf,
            area                            : area,
            sigla                           : siglaUsuario,
            estado_pago                     : estadoPago,            
            fecha_pago_viatico              :fechaPagoViatico?moment(fechaPagoViatico).format("DD/MM/YYYY").toString(): '',
            tipo_comision_idp               : tipoComisionIDP,
        };
    }).sort((a, b) => a.num_recibo > b.num_recibo ?-1:1);   
   
    const filtroTipo : DescargoTableModel [] = result	
    .filter((value) => value.monto_descargo === value.monto_despositado && value.monto_descargo > 0);  
       
    const filtrarFecha : DescargoTableModel[] = this.filtrarPorFecha(filtroTipo, fechaInicio, fechaFin);		
    const response = findAndCountResult(filtrarFecha, query); 	
    return Result.ok(response);
	
}

public generarHeadExcel(tipo:string) {   
    
    const headList : Partial<Column>[] =  [];
   switch(tipo){
    case ENUM_GENERAL:
    headList.push( { header: 'Fecha Pago Viatico', key: 'fecha_pago_viatico_format', width: 25 },
        { header: 'Numero de Recibo Viatico', key: 'nume_recibo', width: 25 },
        { header: 'Partida Presupuestaria', key: 'apertura_programatica', width: 25 },
        { header: 'Fuente de Financiamiento', key: 'ff_of', width: 25 },       
        { header: 'C.I.', key: 'usuario_ci', width: 25 },     
        { header: 'Nombre de Usuario', key: 'usuario_nombre', width: 25 },      
        { header: 'Sigla', key: 'sigla', width: 25 },    
        { header: 'Cod. Memo', key: 'cod_depart_memo', width: 40 },
        { header: 'Destino', key: 'destino', width: 30 },
        { header: 'Fecha Inicio Viaje', key: 'fecha_inicio_viaje', width: 25 },
        { header: 'Fecha Retorno Viaje', key: 'fecha_fin_viaje', width: 25 },       
        { header: 'Estado Pago Viatico', key: 'estado_pago', width: 25 },
        { header: 'Total Pasajes', key: 'total_pasajes', width: 25 },
        { header: 'Total Viaticos', key: 'total_viatico', width: 25 },
        { header: 'Liquido Pagable', key: 'liquido_pagable', width: 25 });    
          
        return headList;   
    case ENUM_REPORTE_POR_PLANILLA:
        headList.push({ header: 'Fecha Pago Viatico', key: 'fecha_pago_viatico_format', width: 25 }, 
            { header: 'Numero de Recibo Viatico', key: 'nume_recibo', width: 25 },
            { header: 'Fuente de Financiamiento', key: 'ff_of', width: 25 },
            { header: 'Partida Presupuestaria', key: 'apertura_programatica', width: 25 },   
            { header: 'Nombre de Usuario', key: 'usuario_nombre', width: 25 }, 
            { header: 'C.I.', key: 'usuario_ci', width: 25 },           
            { header: 'Cod. Memo', key: 'cod_depart_memo', width: 40 },
            { header: 'Destino', key: 'destino', width: 30 },
            { header: 'Fecha Inicio Viaje', key: 'fecha_inicio_viaje', width: 25 },
            { header: 'Fecha Retorno Viaje', key: 'fecha_fin_viaje', width: 25 },       
            { header: 'Total Pasajes', key: 'total_pasajes', width: 25 },
            { header: 'Total Viaticos', key: 'total_viatico', width: 25 },
            { header: 'Liquido Pagable', key: 'liquido_pagable', width: 25 },
            { header: 'Descargo', key: 'descargo', width: 25 },
            { header: 'Deposito', key: 'deposito', width: 25 },
            { header: 'Descuento', key: 'descuento', width: 25 });
            return headList;   
    case ENUM_REPORTE_POR_PROYECTO:
        headList.push({ header: 'Fecha Pago Viatico', key: 'fecha_pago_viatico_format', width: 25 },
            { header: 'Fuente de Financiamiento', key: 'ff_of', width: 25 },           
            { header: 'Partida Presupuestaria', key: 'apertura_programatica', width: 25 },
            { header: 'Numero de Recibo Viatico', key: 'nume_recibo', width: 25 },
            { header: 'C.I.', key: 'usuario_ci', width: 25 },     
            { header: 'Nombre de Usuario', key: 'usuario_nombre', width: 25 },      
            { header: 'Sigla', key: 'sigla', width: 25 },    
            { header: 'Cod. Memo', key: 'cod_depart_memo', width: 40 },
            { header: 'Destino', key: 'destino', width: 30 },
            { header: 'Fecha Inicio Viaje', key: 'fecha_inicio_viaje', width: 25 },
            { header: 'Fecha Retorno Viaje', key: 'fecha_fin_viaje', width: 25 },       
            { header: 'Total Pasajes', key: 'total_pasajes', width: 25 },
            { header: 'Total Viaticos', key: 'total_viatico', width: 25 },
            { header: 'Liquido Pagable', key: 'liquido_pagable', width: 25 });
            return headList;  
    case ENUM_REPORTE_FF_OF:
        headList.push( { header: 'Fecha Pago Viatico', key: 'fecha_pago_viatico_format', width: 25 }, 
            { header: 'Fuente de Financiamiento', key: 'ff_of', width: 25 },  
            { header: 'Numero de Recibo Viatico', key: 'nume_recibo', width: 25 },                  
            { header: 'Partida Presupuestaria', key: 'apertura_programatica', width: 25 },           
            { header: 'C.I.', key: 'usuario_ci', width: 25 },     
            { header: 'Nombre de Usuario', key: 'usuario_nombre', width: 25 },      
            { header: 'Sigla', key: 'sigla', width: 25 },    
            { header: 'Cod. Memo', key: 'cod_depart_memo', width: 40 },
            { header: 'Destino', key: 'destino', width: 30 },
            { header: 'Fecha Inicio Viaje', key: 'fecha_inicio_viaje', width: 25 },
            { header: 'Fecha Retorno Viaje', key: 'fecha_fin_viaje', width: 25 },       
            { header: 'Total Pasajes', key: 'total_pasajes', width: 25 },
            { header: 'Total Viaticos', key: 'total_viatico', width: 25 },
            { header: 'Liquido Pagable', key: 'liquido_pagable', width: 25 });
            return headList;   
    case ENUM_REPORTE_POR_BENEFICIARIO:
        headList.push( { header: 'Fecha Pago Viatico', key: 'fecha_pago_viatico_format', width: 25 },
            { header: 'Numero de Recibo Viatico', key: 'nume_recibo', width: 25 },                  
            { header: 'Partida Presupuestaria', key: 'apertura_programatica', width: 25 },           
            { header: 'C.I.', key: 'usuario_ci', width: 25 },     
            { header: 'Nombre de Usuario', key: 'usuario_nombre', width: 25 },      
            { header: 'Sigla', key: 'sigla', width: 25 },    
            { header: 'Cod. Memo', key: 'cod_depart_memo', width: 40 },
            { header: 'Destino', key: 'destino', width: 30 },
            { header: 'Fecha Inicio Viaje', key: 'fecha_inicio_viaje', width: 25 },
            { header: 'Fecha Retorno Viaje', key: 'fecha_fin_viaje', width: 25 },       
            { header: 'Total Pasajes', key: 'total_pasajes', width: 25 },
            { header: 'Total Viaticos', key: 'total_viatico', width: 25 },
            { header: 'Liquido Pagable', key: 'liquido_pagable', width: 25 });
            return headList;   
    case ENUM_REPORTE_POR_TIPO:
        headList.push( { header: 'Fecha Pago Viatico', key: 'fecha_pago_viatico_format', width: 25 },
            { header: 'Numero de Recibo Viatico', key: 'nume_recibo', width: 25 },
            { header: 'Tipo Usuario', key: 'tipo_usuario', width: 25 },
            { header: 'Fuente de Financiamiento', key: 'ff_of', width: 25 },
            { header: 'Partida Presupuestaria', key: 'apertura_programatica', width: 25 },   
            { header: 'Nombre de Usuario', key: 'usuario_nombre', width: 25 },        
            { header: 'C.I.', key: 'usuario_ci', width: 25 },   
            { header: 'Cod. Memo', key: 'cod_depart_memo', width: 40 },
            { header: 'Destino', key: 'destino', width: 30 },
            { header: 'Fecha Inicio Viaje', key: 'fecha_inicio_viaje', width: 25 },
            { header: 'Fecha Retorno Viaje', key: 'fecha_fin_viaje', width: 25 },       
            { header: 'Estado Pago Viatico', key: 'estado_pago', width: 25 },
            { header: 'Total Pasajes', key: 'total_pasajes', width: 25 },
            { header: 'Total Viaticos', key: 'total_viatico', width: 25 },
            { header: 'Liquido Pagable', key: 'liquido_pagable', width: 25 },
            { header: 'Descargo', key: 'descargo', width: 25 },
            { header: 'Deposito', key: 'deposito', width: 25 },
            { header: 'Descuento', key: 'descuento', width: 25 });
            return headList;    
   /* case ENUM_REPORTE_PARA_RRHH:
            headList.push( { header: 'Numero de Recibo Viatico', key: 'nume_recibo', width: 25 },
            { header: 'Tipo Usuario', key: 'tipo_usuario', width: 25 },          
            { header: 'Partida Presupuestaria', key: 'apertura_programatica', width: 25 },   
            { header: 'Nombre de Usuario', key: 'usuario_nombre', width: 25 },        
            { header: 'C.I.', key: 'usuario_ci', width: 25 },   
            { header: 'Cod. Memo', key: 'cod_depart_memo', width: 40 },
            { header: 'Destino', key: 'destino', width: 30 },
            { header: 'Fecha Inicio Viaje', key: 'fecha_inicio_viaje', width: 25 },
            { header: 'Fecha Retorno Viaje', key: 'fecha_fin_viaje', width: 25 },       
            { header: 'Estado Pago Viatico', key: 'estado_pago', width: 25 },
            { header: 'Estado Modificacion', key: 'estado_modificacion', width: 25 });
          
            return headList;          */                 
   }
   
}

public async generarFilasExcel(authUser: AuthUser, queryString: any, id?: string, listaIds?: string[], fechaInicio?: string, fechaFin?: string): Promise<Result<ViaticoDataResponse>> {
    const resultObject = queryStringToArray(queryString);
    
    const info = await this.getInfoViaticoData(authUser, resultObject); // Datos generales

    const data = await this.getViaticoData(resultObject, id, listaIds, fechaInicio, fechaFin); 
    //  Asegúrate que este `data` sea un ARRAY de objetos planos
    // con los campos que deseas mostrar en el Excel.
    return Result.ok({
        info,
        data
    });
}

public getFormatData(data: ViaticoDataR | undefined)  {
    const listaData : ReportGeneral[] = [];
    if(data != null && data != undefined && data.rows.length >0){
        for (let i = 0; i < data.rows.length; i++) {
            const item : ReportGeneral = {
                fecha_pago_viatico_format    : String(data.rows[i].fecha_pago_viatico_format),   
                nume_recibo           : Number(data.rows[i].nume_recibo),
                apertura_programatica : String(data.rows[i].apertura_programatica),
                ff_of                 : String(data.rows[i].ff_of),
                usuario_ci            : String(data.rows[i].usuario_ci),         
                usuario_nombre        : String(data.rows[i].usuario_nombre),           
                sigla                 : String(data.rows[i].sigla),
                cod_depart_memo       : String(data.rows[i].cod_depart_memo),          
                destino               : String(data.rows[i].destino),
                fecha_inicio_viaje    : String(data.rows[i].fecha_inicio_viaje),           
                fecha_fin_viaje       : String(data.rows[i].fecha_fin_viaje),   
                total_pasajes         : Number(data.rows[i].total_pasajes),      
                total_viatico         : Number(data.rows[i].total_viatico),        
                liquido_pagable       : Number(data.rows[i].liquido_pagable),
                descargo              : Number(data.rows[i].monto_descargo),
                deposito              : Number(data.rows[i].monto_depositado),
                descuento             : Number(data.rows[i].saldo_descargo),
                tipo_usuario          : String(data.rows[i].usuario_tipo),  
                area_id               : String(data.rows[i].area_id), 
                estado_pago           : String(data.rows[i].estado_pago), 
                estado_modificacion   : String(data.rows[i].estado_modificacion), 
            }
            listaData.push(item)           
           
           }
          
           return listaData;    
    }
  
  }


   
}