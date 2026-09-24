import { Result } from "../../../../base/types/Result";
import moment from "moment";
import { esFeriado, findAndCountResult, obtenerFeriadosBolivia, queryStringToArray } from "../../../../tools/util";

import  ViaticoService  from "../../../../core/admin/conta_viatico/viatico";
import  MemorandumService from "../../../../core/admin/conta_viatico/memorandum";
import  UsuarioService  from "../../../../core/system/autenticacion/usuario";
import  DetalleDestinoService  from "../../../../core/admin/conta_viatico/detalle_destino";
import  AperturaViaticoService  from "../../../../core/admin/conta_viatico/apertura_viatico";
import  CargoService  from "../../../../core/rrhh/cargo";
import  PersonalService  from "../../../../core/rrhh/personal";
import  EscalaService from "../../../../core/admin/conta_viatico/escala";
import EscalaDestinoService  from "../../../../core/admin/conta_viatico/escala_destino";
import { EscalaFormDataResponse } from "../escala/EscalaView";
import { DetalleDestinoFormDataResponse, DetalleDestinoOptionsFormModel } from "../detalle_destino/DetalleDestinoView";

import { AuthUser } from "../../../../base/types/AuthUser";
import  AreaService  from "../../../../core/rrhh/area";
import { ENUM_ANULADO, ENUM_APROBADO, ENUM_CON_RESOLUCION, ENUM_INHABIL, ENUM_OBSERVADO, ENUM_RECHAZADO, ENUM_REPORTE_PARA_RRHH, ENUM_SIN_OBSERVACION, ENUM_SIN_RESOLUCION } from "../../../../base/constants/enum";
import { AreaFormModel } from "../descargo/DescargoView";
import { Column } from "exceljs";
import AperturaGeneralService from "../../../../core/admin/apertura/apertura_general";


type ViaticoTableModel = {
    id                    : string;
    nume_recibo           : number;
    fecha_pago_viatico    : string;
    suma_pasaje_ida       : number;
    suma_pasaje_retorno   : number;
    tipo_pasaje_gd        : string;
    total_pasajes         : number;
    total_viatico         : number;
    liquido_pagable       : number;
    estado_pago           : string;
    estado_recibo         : string;
    fecha_anulacion       : string;
    notificacion_viatico  : string;
    memorandum_id         : string | null;
    escala_id             : string | null;
    usuario_cel?          : string;

    //Ingresando nuevos parametros de memorandum y escala
    cod_memorandum : string;
    fecha_memo : Date;
    usuario_id : string;
    ci: string;
    destino_id : string;
    tipo_comision_idp: string;
    fecha_viaje_ida : string;
    fecha_viaje_retorno : string;
    transporte_op : string;
    apertura_prog : string;
    fondo_financia : string;
    sisin : string;
    fecha_format_memo? :string;
    tipo_memo_repo? :string;
    //activo                : boolean;

    //Campos de memorandum para el reporte de RRHH
    modificacion?            : boolean,
    obs_modificacion?        : string | null,
    fecha_cambio?            : string,
    estado_modificacion?     : string,
    usuario_tipo?            : string;
    notificacion_memo?       : string;
    estado_memorandum?       : string;
    resolucion?              : string;
    
};

export type GetViaticosTableResponse = {
    rows: ViaticoTableModel[];
    count: number;
};

export type ViaticoFormDataResponse = {
    id                    : string;
    nume_recibo           : number;
    fecha_pago_viatico    : string;
    suma_pasaje_ida       : number;
    suma_pasaje_retorno   : number;
    tipo_pasaje_gd        : string;
    total_pasajes         : number;
    total_viatico         : number;
    liquido_pagable       : number;
    estado_pago           : string;
    estado_recibo         : string;
    fecha_anulacion       : string;
    notificacion_viatico  : string;
    memorandum_id         : string | null;
    escala_id             : string | null;

     //campos para MOSTRAR

     usuario_nombre          : string;
     cod_depart_memo         : string;
     ci                      : string;
     cargo_usuario           : string;
     fecha_memo_registro     : string;
     tipo_comision_idp       : string;
     fecha_inicio_viaje      : string;
     fecha_fin_viaje         : string;
    // categoria_usuario       : string;
     viaticos_por_dia        : number;
     cantidad_dias           : number;
     conteo_dias_detalle     : number;
     categoria               : string;
     usuario_id              : string;
     
     // campo para el control de apertura
    apertura_nombre_viatico?   : string;
    apertura_nombre_pasaje?    : string;
    apertura_prog_viatico?   : string;
    apertura_prog_pasaje?    : string;
    apertura_saldo_pasaje? : number;
    apertura_saldo_viatico? : number;
    apertura_estado_pasaje? : string;
    apertura_estado_viatico? : string;
    resolucion?              : string;
  
};

type InfoReporteModel = {
    id                    : string;
    nume_recibo           : number;
    fecha_pago_viatico    : string;
    suma_pasaje_ida       : number;
    suma_pasaje_retorno   : number;
    tipo_pasaje_gd        : string;
    total_pasajes         : number;
    total_viatico         : number;
    liquido_pagable       : number;
    estado_pago           : string;
    estado_recibo         : string;
    fecha_anulacion       : string;
    notificacion_viatico  : string;
    memorandum_id         : string | null;
    escala_id             : string | null;

    //Ingresando nuevos parametros de memorandum y escala
    usuario_nombre          : string;
    cod_depart_memo         : string;
     ci                      : string;
     cargo_usuario           : string;
     fecha_memo_registro     : string;
     tipo_comision_idp       : string;
     fecha_inicio_viaje      : string;
     fecha_fin_viaje         : string;
    // categoria_usuario       : string;
     viaticos_por_dia        : number;
     cantidad_dias           : number;
     usuario_a_cargo         : string;

     destino                 : string;
    
    //activo                : boolean;
    codigoQR    : string;
};

export type SumaPasajeOptionsResponseModel = {
    id?                          : string;
    pasaje_ida_suma              : number;
    pasaje_retorno_suma          : number;
    total_pasaje_dia             : number; 
};

export type ViaticoReporte = {
    //tasks: any;
    //lineas: lineaTemporalItem[];
  //  rows  : InfoReporteModel[];   //RevisaViatico 
};
export type ViaticoData = {
    info: InfoReporteModel;
    data: ViaticoReporte;
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
    gestion?: string;
    tipo?   : string;
    codigo? : string;
    nume_recibo           : number;
    fecha_pago_viatico    : string;
    suma_pasaje_ida       : number;
    suma_pasaje_retorno   : number;
    tipo_pasaje_gd        : string;
    total_pasajes         : number;
    total_viatico         : number;
    liquido_pagable       : number;
    estado_pago           : string;
    estado_recibo         : string;
    fecha_anulacion       : string;
    notificacion_viatico  : string;
    memorandum_id         : string | null;
    escala_id             : string | null;
    //campos reporte

    apertura_prog? : string;
    ff_of?                 : string;
    ci?            : string,
    usuario_id?        : string;   
    sigla?                 : string;   
    cod_memorandum?       : string;
    destino_id?               : string;
    fecha_viaje_ida?    : string;
    fecha_viaje_retorno?       : string;
    total_viaticos?        : number;
    fecha_rango_inicio?    : string;
    fecha_rango_fin?       : string; 
    cantidad_dias?        : number;
    tipo_memo_repo?    : string;

     modificacion?            : boolean,
    obs_modificacion?        : string | null,
    fecha_cambio?            : string,
    estado_modificacion?     : string,
    usuario_tipo?            : string;
    notificacion_memo?      : string;

    dias_viaje?             : string;
    
};
export type ViaticoDataR = {
    rows: ViaticoItem[];
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


export type ViaticoTableModelResponse ={
    id                              : string;
    apertura_programatica          : string;
    cod_fte                        : string;
    cod_org                        : string;
    objeto                        : string;
    descripcion_objeto_gasto        : string;
    presupuesto_inicial            : number;
    presupuesto_restante           : number;
    estado                        : string;
    sisin                         : string;
    gestion                       : Date;
    area_id                        : string;    
    apertura_general_id             : string;
}

export type ReportGeneral = {
nume_recibo?           : number;
apertura_programatica : string; 
ff_of?                 : string; 
usuario_ci            : string;
usuario_nombre        : string;
sigla?                 : string;
cod_depart_memo       : string;
destino               : string;
fecha_inicio_viaje    : string;
fecha_fin_viaje       : string;
total_pasajes?         : number;
total_viatico?        : number;
liquido_pagable?       : number;
tipo_usuario?         : string;
descargo?              : number;
deposito?             : number;
descuento?             : number;
area_id?                 : string;
estado_pago?           : string;

///DATOS DE VIATICOS
 
    
    estado_recibo?         : string;
    fecha_anulacion?       : string;
     notificacion_memo?  : string;
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
    cantidad_dias?   : number;
    //activo                : boolean;

    //Campos de memorandum para el reporte de RRHH
    modificacion?            : boolean,
    obs_modificacion?        : string | null,
    fecha_cambio?            : string,
    estado_modificacion?     : string,
    usuario_tipo?            : string;

    dias_viaje?              : string; 
}


export class ViaticoView {
    public async getViaticosTable(query: any): Promise<Result<{ rows: ViaticoTableModel[] }>> {
			
            const viatico = await ViaticoService.getAll();
            if (viatico.isFailure) return Result.fail("Falló al obtener la Viatico");
            const viaticoResult = viatico.getValue();

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
             //detalle destino
             const aperturaViatico = await AperturaViaticoService.getAll();
             if (aperturaViatico.isFailure) return Result.fail("Falló al obtener la Apertura Viatico");
             const aperturaViaticoResult = aperturaViatico.getValue();
             //destino Escala
             const escalaDestino = await EscalaDestinoService.getAll();
             if (escalaDestino.isFailure) return Result.fail("Falló al obtener la Apertura Viatico");
             const escalaDestinoResult = escalaDestino.getValue();
           /*Listado de cargos*/
            const cargo = await CargoService.getAll();
            if(cargo.isFailure) return Result.fail("Fallo al obtener el Cargo");
            const cargoResult = cargo.getValue();
            /*Listado de personal*/
            const personal =await PersonalService.getAll();
            if(personal.isFailure) return Result.fail("Fallo al obtener el Personal");
            const personalResult = personal.getValue();
             const feriados =  await obtenerFeriadosBolivia();          
            const result: ViaticoTableModel[] = viaticoResult.map((item) => {

            // Memorandum
            const codigoMemorandum = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.codDepartMemo|| "-";//Revisar			
            const fechaMemorandum = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.fechaMemoRegistro || new Date("1990-01-01");
            const cantidadDias =  memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.cantidadDias|| 0;
            const tipoMemoRepo = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.tipoMemoRepo||'';            
            // usuario
            const nombreUsuarioId = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.usuarioId|| "-";
            const nombreUsuario = usuarioResult.find((c) => c.id === nombreUsuarioId)?.props.fullname|| "-";
            const usuarioCI = usuarioResult.find((c) => c.id === nombreUsuarioId)?.props.ci|| "-";
            const usuarioCelular = usuarioResult.find((c) => c.id === nombreUsuarioId)?.props.celular|| "-";
            // detalle destino
            const tipoComisionIDP = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.tipoComisionIDP|| "-"; 
            //const destino = detalleDestinoResult.find((c) => c.props.memorandumId === item.props.memorandumId)?.props.destinoReg|| "-";
            const destino = detalleDestinoResult.filter(c => c.props.memorandumId === item.props.memorandumId).find(c => c.props.destinoReg)?.props.destinoReg || "-";			
            const fechaIda = memorandumResult.find((c) => c.id=== item.props.memorandumId)?.props.fechaInicioViaje|| "-";
            const fechaRetorno = memorandumResult.find((c) => c.id ===  item.props.memorandumId )?.props.fechaFinViaje|| "-";
            const transporteOP = detalleDestinoResult.find((c) => c.props.memorandumId ===  item.props.memorandumId )?.props.tipoVehiculoOP|| "-";
            //Apertura Viatico
            const codApertura = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.aperturaViaticoId|| "-";
            const aperturaProgra = aperturaViaticoResult.find((c) => c.id === codApertura)?.props.aperturaProgramatica|| "-";
            const fondoFinan = aperturaViaticoResult.find((c) => c.id === codApertura)?.props.codFte|| "-";
            const sisin = aperturaViaticoResult.find((c) => c.id === codApertura)?.props.sisin|| "-";
            //Observaciones
            const modificacion =  memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.modificacion;       
            const obsModificacion = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.obsModificacion|| "-";     
            const fechaCambio   = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.fechaCambio|| "-";       
            const estadoModificacion  = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.estadoModificacion|| "-"; 
            const usuarioID = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.usuarioId||"-"; 
            const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === usuarioID)?.props.cargoId|| "-";
            const tipoUsuario = cargoResult.find((c) => c.id  === cargoUsuarioid)?.props.tipo || "-";
            const notificacionMemo =  memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.estadoMemorandum;      
            const diasHabiles =  memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.diasHabiles;   
            //Lista de destinos
            const listaDestinos: DetalleDestinoOptionsFormModel[] = detalleDestino
            .getValue()
            .map((item) => {                
                    return {                
                        id: item.id.toString(),
                        nombre: item.props.memorandumId,
                        caption : item.props.destinoReg,
                        estado: item.props.estado,    
                        dia: item.props.fechaDia,                                         
                    };            
            }) ;         
          
         // Se filta por los destinos
        const filtroDestinos1: DetalleDestinoOptionsFormModel [] = listaDestinos
        .filter((value) => this.filtrarId(value.nombre, item.props.memorandumId!)); 

        const filtroDestinos : DetalleDestinoOptionsFormModel [] = filtroDestinos1
        .filter((value) => this.filtrarEstadoDestino(value.estado!,'SIN_VIAJE' )); 
       
        // Se filta por los destinos
        const filtroAprobados : DetalleDestinoOptionsFormModel [] = filtroDestinos 	
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
        // verificando si se cuenta con resolucion
        let resolucion = ENUM_SIN_RESOLUCION;
       
        for(let i = 0; i < filtroDestinos.length; i++){    
       
           if( diasHabiles === ENUM_INHABIL || resolucion.includes(ENUM_CON_RESOLUCION))                                    
            {                    
               if (!esFeriado(filtroDestinos[i].dia!,feriados)) {
                const diaSemana = filtroDestinos[i].dia!.getDay();					
                // 0 es Domingo, 6 es Sábado
                    if (diaSemana === 0 || diaSemana === 6) {                 
                        resolucion = ENUM_CON_RESOLUCION;					
                        }                             
                } else{
                        resolucion = ENUM_CON_RESOLUCION;
                }
           }       
        
        }    

                return {
                    id                    : String(item.id),
                    nume_recibo           : item.props.numeRecibo,
                    fecha_pago_viatico    : item.props.fechaPagoViatico && moment(item.props.fechaPagoViatico).year() >= 1990? moment(item.props.fechaPagoViatico).format('DD/MM/YYYY'): '-',
                    suma_pasaje_ida       : item.props.sumaPasajeIda,
                    suma_pasaje_retorno   : item.props.sumaPasajeRetorno,
                    tipo_pasaje_gd        : item.props.tipoPasajeGD,
                    total_pasajes         : item.props.totalPasajes,
                    total_viatico         : item.props.totalViatico,
                    liquido_pagable       : item.props.liquidoPagable,
                    estado_pago           : item.props.estadoPago,
                    estado_recibo         : item.props.estadoRecibo,
                    fecha_anulacion       : item.props.fechaAnulacion.getFullYear() > 2025?moment(item.props.fechaAnulacion).format("DD/MM/YYYY").toString(): '-',   
                    notificacion_viatico  : item.props.notificacionViatico,
                    memorandum_id         : item.props.memorandumId,
                    escala_id             : item.props.escalaId,  

                    //Ingresando nuevos parametros de memorandum y escala
                    cod_memorandum : codigoMemorandum,
                    fecha_memo : fechaMemorandum,
                    usuario_id : nombreUsuario,
                    ci: usuarioCI,
                    destino_id : destinoNombre,
                    tipo_comision_idp:tipoComisionIDP,
                    fecha_viaje_ida : fechaIda?moment(fechaIda).format("DD/MM/YYYY").toString(): '',
                    fecha_viaje_retorno :fechaRetorno?moment(fechaRetorno).format("DD/MM/YYYY").toString(): '',
                    cantidad_dias : cantidadDias,
                    transporte_op : transporteOP,
                    apertura_prog : aperturaProgra,
                    fondo_financia : fondoFinan,
                    sisin : sisin,
                    conteo_dias_detalle:conteoDiasDetalle,
                    fecha_format_memo :  moment(fechaMemorandum).year() < 1990? "-": moment(fechaMemorandum).format("DD/MM/YYYY"),//fechaMemorandum?moment(fechaMemorandum).format("DD/MM/YYYY HH:mm:ss").toString(): '-',
                    tipo_memo_repo :tipoMemoRepo,
                    //activo                : boolean;
                    modificacion            :modificacion,
                    obs_modificacion        : obsModificacion,
                    fecha_cambio            : fechaCambio,
                    estado_modificacion     : estadoModificacion,
                    usuario_tipo            : tipoUsuario,
                    notificacion_memo       : notificacionMemo,
                    usuario_cel             : usuarioCelular,
                    resolucion              : resolucion,
                };
            }).sort((a, b) => a.fecha_memo > b.fecha_memo ? -1 : 1)
            const response = findAndCountResult(result, query);			
			
            return Result.ok(response);
    }

    public async getViaticoFormDataView(id_viatico: string): Promise<Result<ViaticoFormDataResponse>> {
        const viatico = await ViaticoService.getById(id_viatico);
        if (viatico.isFailure) return Result.fail<ViaticoFormDataResponse>("Viatico no encontrado");
        const props = viatico.getValue().props;
		
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
         const aperturaViaticoResult = aperturaViatico.getValue();
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
        // const viaticoAllResult = viaticoAll.getValue();

         /*Listado de area*/
        const area = await AreaService.getAll();
        if (area.isFailure) return Result.fail("Falló al obtener la Area");
        const areaResult = area.getValue();   
           

      /*Listado de apertura viatico*/
     const aperturaGeneral = await AperturaGeneralService.getAll();
     if(aperturaGeneral.isFailure) return Result.fail("Fallo al obtener la Apertura General");
     const aperturaGeneralResult = aperturaGeneral.getValue(); 
       
          // Memorandum
          const codigoMemorandum = memorandumResult.find((c) => c.id === props.memorandumId)?.props.codDepartMemo|| "-";//Revisar
          const fechaMemorandum = memorandumResult.find((c) => c.id === props.memorandumId)?.props.fechaMemoRegistro|| "-";
          const tipoMemorandumIDP = memorandumResult.find((c) => c.id === props.memorandumId)?.props.tipoComisionIDP|| "-";
          const cantidadDias = memorandumResult.find((c) => c.id === props.memorandumId)?.props.cantidadDias|| 0;
          // usuario
          const nombreUsuarioId = memorandumResult.find((c) => c.id === props.memorandumId)?.props.usuarioId|| "-";
          const nombreUsuario = usuarioResult.find((c) => c.id === nombreUsuarioId)?.props.fullname|| "-";
          const usuarioCI = usuarioResult.find((c) => c.id === nombreUsuarioId)?.props.ci|| "-";
         
          const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === nombreUsuarioId)?.props.cargoId|| "-";
          const cargoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.nombre|| "-";
          // detalle destino     
 
          const destino = detalleDestinoResult.find((c) => c.props.memorandumId === props.memorandumId)?.props.destinoReg|| "-";
          const fechaIda = memorandumResult.find((c) => c.id=== props.memorandumId)?.props.fechaInicioViaje|| "-";
          const fechaRetorno = memorandumResult.find((c) => c.id ===  props.memorandumId )?.props.fechaFinViaje|| "-";
        const notificacionMemo =  memorandumResult.find((c) => c.id === props.memorandumId)?.props.estadoMemorandum;       
        const diasHabiles =  memorandumResult.find((c) => c.id === props.memorandumId)?.props.diasHabiles; 

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
             const feriados =  await obtenerFeriadosBolivia();          
            
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
            const categoria = filtroEscala.length>0? escalaResult.find((c) => c.id === filtroEscala[0].id)?.props.categoria|| "": "-";
            //const tipoComisionIDP = filtroEscala.length>0? escalaResult.find((c) => c.id === filtroEscala[0].id)?.props.tipoComisionIdp|| "" : "-";
            const escalaID = filtroEscala.length>0? escalaResult.find((c) => c.id === filtroEscala[0].id)?.id|| '': '';
            
       //fin de este punto realizamos la busqueda del tipo de escala para la determinacion del id de escala 
       //Determinacion de la suma de pasajes y viaticos 
       
       const listaDestinos: DetalleDestinoFormDataResponse[] = detalleDestino
       .getValue()
       .map((item) => {      
        
         // verificando si se cuenta con resolucion
           
                
           
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
               estado                   :item.props.estado,
               modificacion             : item.props.modificacion,
                observacion             : item.props.observacion,
                estado_observacion      : item.props.estadoObservacion,
               memorandum_id            : item.props.memorandumId,
               viatico_id               : item.props.viaticoId,
               vehiculo_id              : item.props.vehiculoId,
               destino_id               : item.props.destinoId,
               destino_id2               :item.props.destinoId2,                                       
           };
       }) ; 
      

   // Se filta por los destinos
   const filtroDestinos : DetalleDestinoFormDataResponse [] = listaDestinos
   .filter((item) => this.filtrarId(item.viatico_id, id_viatico));
   
   // verificando si se cuenta con resolucion
        let resolucion = ENUM_SIN_RESOLUCION;
       
        for(let i = 0; i < filtroDestinos.length; i++){    
       
           if( diasHabiles === ENUM_INHABIL || resolucion.includes(ENUM_CON_RESOLUCION))                                    
            {                    
               if (!esFeriado(filtroDestinos[i].fecha_dia,feriados)) {
                const diaSemana = filtroDestinos[i].fecha_dia.getDay();					
                // 0 es Domingo, 6 es Sábado
                    if (diaSemana === 0 || diaSemana === 6) {                 
                        resolucion = ENUM_CON_RESOLUCION;					
                        }                             
                } else{
                        resolucion = ENUM_CON_RESOLUCION;
                }
           }       
        
        }    

   const conteoDiasDetalle = filtroDestinos.length;
   //inicio apertura
   const aperturaViaticoID = memorandumResult.find((c) => c.id === props.memorandumId)?.props.aperturaViaticoId||"-";	  
    const aperturaPasajeID = memorandumResult.find((c) => c.id === props.memorandumId)?.props.aperturaPasajeId||"-";
	
     // campo para el control de apertura
     let aperturaNombreViatico;
     let aperturaNombrePasaje;
    const aperturaIDGeneralViatico = aperturaViaticoResult.find((c) => c.id === aperturaViaticoID)?.props.aperturaGeneralId;	
    const aperturaHijoIDViatico = aperturaGeneralResult.find((c) => c.id === aperturaIDGeneralViatico)?.props.areaHijoId;							
			//aqui sino existe una apertura para esa direccion obtner todos los del padre
    if(aperturaHijoIDViatico){
           aperturaNombreViatico =  areaResult.find((c) => c.id === aperturaHijoIDViatico)?.props.nombre|| "-";	                               
     }else{
           const aperturaPadreIDViatico = aperturaViaticoResult.find((c) => c.id=== aperturaViaticoID)?.props.areaId;                    
           aperturaNombreViatico =  areaResult.find((c) => c.id === aperturaPadreIDViatico)?.props.nombre|| "-";	                             
    }   
    //pasajes 
    const aperturaIDGeneralPasaje = aperturaViaticoResult.find((c) => c.id === aperturaPasajeID)?.props.aperturaGeneralId;     	
    const aperturaHijoIDPasaje = aperturaGeneralResult.find((c) => c.id=== aperturaIDGeneralPasaje)?.props.areaHijoId;						
	
			//aqui sino existe una apertura para esa direccion obtner todos los del padre
    if(aperturaHijoIDPasaje){
           aperturaNombrePasaje =  areaResult.find((c) => c.id === aperturaHijoIDPasaje)?.props.nombre|| "-";	                    
    
     }else{
           const aperturaPadreIDPasaje = aperturaViaticoResult.find((c) => c.id === aperturaPasajeID)?.props.areaId;                    
           aperturaNombrePasaje =  areaResult.find((c) => c.id === aperturaPadreIDPasaje)?.props.nombre|| "-";	                    
    
    }   
  
    const aperturaProgViatico = aperturaViaticoResult.find((c) => c.id=== aperturaViaticoID)?.props.aperturaProgramatica;   
    const aperturaProgPasaje = aperturaViaticoResult.find((c) => c.id=== aperturaPasajeID)?.props.aperturaProgramatica;	
    const aperturaSaldoPasaje = aperturaViaticoResult.find((c) => c.id=== aperturaViaticoID)?.props.presupuestoRestante;	
    const aperturaSaldoViatico =  aperturaViaticoResult.find((c) => c.id=== aperturaPasajeID)?.props.presupuestoRestante;	
    const aperturaEstadoViatico = aperturaViaticoResult.find((c) => c.id=== aperturaViaticoID)?.props.estado;	
    const aperturaEstadoPasaje =  aperturaViaticoResult.find((c) => c.id=== aperturaPasajeID)?.props.estado;	
  
   //fin apertura
   const sumaPasajes = filtroDestinos.reduce((suma, item) => {
    suma.pasaje_ida += item.pasaje_ida || 0;
    suma.pasaje_retorno += item.pasaje_retorno || 0;
    return suma;
    }, { pasaje_ida: 0, pasaje_retorno: 0 });   
    
   
    const sumaTotal = sumaPasajes.pasaje_ida + sumaPasajes.pasaje_retorno;
    const productoDiadporViatico = cantidadDias * viaticoDia;
    const sumaTotalViaticos = sumaTotal + productoDiadporViatico;
    
         //fin Determinacion de la suma de pasajes y viaticos 

        const result: ViaticoFormDataResponse = {


            id                    : viatico.getValue().id, 
            nume_recibo           : props.numeRecibo,
            fecha_pago_viatico    : props.fechaPagoViatico?moment(props.fechaPagoViatico).format("dd/MM/yyyy HH:mm").toString():'',  
            suma_pasaje_ida       : sumaPasajes.pasaje_ida,
            suma_pasaje_retorno   : sumaPasajes.pasaje_retorno,
            tipo_pasaje_gd        : props.tipoPasajeGD,
            total_pasajes         : sumaTotal,
            total_viatico         : productoDiadporViatico,
            liquido_pagable       : sumaTotalViaticos,
            estado_pago           : props.estadoPago,
            estado_recibo         : this.numberToWords(props.liquidoPagable),//this.numberToWord(sumaTotalViaticos)
            fecha_anulacion       : props.fechaAnulacion?moment(props.fechaAnulacion).format("DD/MM/YYYY HH:mm").toString():'',  		
            notificacion_viatico  : props.notificacionViatico,
            memorandum_id         : props.memorandumId,
            escala_id             : escalaID,//filtroEscala[0].id ||'-',//props.escalaId,
            conteo_dias_detalle   : conteoDiasDetalle,

             //campos para MOSTRAR

             usuario_nombre          : nombreUsuario,
             cod_depart_memo         : codigoMemorandum,
             ci                      : usuarioCI,
             cargo_usuario           : cargoUsuario,
             fecha_memo_registro     : fechaMemorandum?moment(fechaMemorandum).format("DD/MM/YYYY").toString(): '',
             tipo_comision_idp       : tipoMemorandumIDP,
             fecha_inicio_viaje      : fechaIda?moment(fechaIda).format("DD/MM/YYYY").toString(): '',
             fecha_fin_viaje         : fechaRetorno?moment(fechaRetorno).format("DD/MM/YYYY").toString(): '',
             usuario_id              : nombreUsuarioId,
             cantidad_dias           : cantidadDias,
             categoria               : categoria,
           
             viaticos_por_dia        : viaticoDia,   
              // campo para el control de apertura
            apertura_nombre_viatico  : aperturaNombreViatico,
            apertura_nombre_pasaje   : aperturaNombrePasaje,
            apertura_prog_viatico    : aperturaProgViatico,
            apertura_prog_pasaje     : aperturaProgPasaje,
            apertura_saldo_pasaje    : aperturaSaldoViatico,
            apertura_saldo_viatico   : aperturaSaldoPasaje,
            apertura_estado_pasaje    : aperturaEstadoPasaje,
            apertura_estado_viatico   : aperturaEstadoViatico,
            resolucion               : resolucion,
             
        };
 
        return Result.ok(result);
		
    }

   //filtramos por el tipo Inte,nacional o provincial
   public filtrarTipoPCP(item:string, constante:string) { 
    return (item === constante); 
   }
   public filtrarId(item:string, id:string) { 
    return (item === id); 
   }
   
   public filtrarEstadoDestino(item:string, estado:string) { 
    return (item != estado); 
 } 

   //impresion
public async getPDFViatico(authUser: AuthUser, params: string): Promise<Result<any>> {    
    const ID_USUARIO = authUser.uid;
    const id_viatico = params;     
   
    const usuarioaCargo = await UsuarioService.getById(ID_USUARIO);
    if (usuarioaCargo.isFailure) return Result.fail(String(usuarioaCargo.error));
    const usuarioaCargoResult = usuarioaCargo.getValue().props;
    
    const viatico = await ViaticoService.getById(id_viatico)
    if (viatico.isFailure) return Result.fail<ViaticoFormDataResponse>("Falló al obtener la Viatico");
    const props = viatico.getValue().props;

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
  // const viaticoAllResult = viaticoAll.getValue();
 
    // Memorandum
    const codigoMemorandum = memorandumResult.find((c) => c.id === props.memorandumId)?.props.codDepartMemo|| "-";//Revisar
    const fechaMemorandum = memorandumResult.find((c) => c.id === props.memorandumId)?.props.fechaMemoRegistro|| "-";
    const tipoMemorandumIDP = memorandumResult.find((c) => c.id === props.memorandumId)?.props.tipoComisionIDP|| "-";
    const cantidadDias = memorandumResult.find((c) => c.id === props.memorandumId)?.props.cantidadDias|| 0;
    // usuario
    const nombreUsuarioId = memorandumResult.find((c) => c.id === props.memorandumId)?.props.usuarioId|| "-";
    const nombreUsuario = usuarioResult.find((c) => c.id === nombreUsuarioId)?.props.fullname|| "-";
    const usuarioCI = usuarioResult.find((c) => c.id === nombreUsuarioId)?.props.ci|| "-";
   
    const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === nombreUsuarioId)?.props.cargoId|| "-";
    const cargoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.nombre|| "-";
    // detalle destino
    const notificacionMemo =  memorandumResult.find((c) => c.id === props.memorandumId)?.props.estadoMemorandum;       

   const destino = detalleDestinoResult.find((c) => c.props.memorandumId === props.memorandumId)?.props.destinoReg|| "-";
    const fechaIda = memorandumResult.find((c) => c.id=== props.memorandumId)?.props.fechaInicioViaje|| "-";
    const fechaRetorno = memorandumResult.find((c) => c.id ===  props.memorandumId )?.props.fechaFinViaje|| "-";

    // Desde este punto realizamos la busqueda del tipo de escala para la determinacion del id de escala 
  const destinoNombre = (escalaDestinoResult.find((c) => c.id === destino))?  
    escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-": destino;
 // impresion de destinos en impresion de pago   
 const destinosIdsUnicos = [
  ...new Set(
    detalleDestinoResult
      .filter(c => c.props.memorandumId === props.memorandumId)
      .map(c => c.props.destinoReg)
  )
];

const destinosNombres = destinosIdsUnicos
  .map(id => {
    const encontrado = escalaDestinoResult.find(c => c.id === id);
    return encontrado ? encontrado.props.destino : id; // si no encuentra, retorna la ID
  })
  .join("-");
// fin impresion de destinos   
    
    
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
 }) ; 

        // Se filta por los destinos
        const filtroDestinos : DetalleDestinoFormDataResponse [] = listaDestinos
        .filter((item) => this.filtrarId(item.viatico_id, id_viatico));

        const sumaPasajes = filtroDestinos.reduce((suma, item) => {
        suma.pasaje_ida += item.pasaje_ida || 0;
        suma.pasaje_retorno += item.pasaje_retorno || 0;
        return suma;
        }, { pasaje_ida: 0, pasaje_retorno: 0 });   


        const sumaTotal = sumaPasajes.pasaje_ida + sumaPasajes.pasaje_retorno;
        const productoDiadporViatico = cantidadDias * viaticoDia;
        const sumaTotalViaticos = sumaTotal + productoDiadporViatico;
        
   
    //recupera datos para mostrar en la tabla del modulo
    //QR VIATICO
      const numeroReciboQR = "Numero Recibo: ".concat(String(props.numeRecibo));     
      const fechaQR = "Fecha pago: ".concat(String(props.fechaPagoViatico.getTime()));      
      const montoQr = "Liquido Pagable: ".concat(String(props.liquidoPagable));
      const memorandumQR = "ID memorandum: ".concat(String(props.memorandumId)); 
      const viaticoIdQR = "ID viatico: ".concat(String(id_viatico));
    //FIN QR VIATICO       
    const result: ViaticoData = {
        info: {
            //cod_depart_memo      : props.codDepartMemo,
            id                    : viatico.getValue().id, 
            nume_recibo           : props.numeRecibo,
            fecha_pago_viatico    : props.fechaPagoViatico?moment(props.fechaPagoViatico).format("DD/MM/YYYY").toString():'',  
            suma_pasaje_ida       : sumaPasajes.pasaje_ida,
            suma_pasaje_retorno   : sumaPasajes.pasaje_retorno,
            tipo_pasaje_gd        : props.tipoPasajeGD,
            total_pasajes         : sumaTotal,
            total_viatico         : productoDiadporViatico,
            liquido_pagable       : props.liquidoPagable,//sumaTotalViaticos
            estado_pago           : props.estadoPago,
            estado_recibo         : this.numberToWords(props.liquidoPagable),//this.numberToWords(sumaTotalViaticos),
            fecha_anulacion       : props.fechaAnulacion?moment(props.fechaAnulacion).format("DD/MM/YYYY").toString():'',  
            notificacion_viatico  : props.notificacionViatico,
            memorandum_id         : props.memorandumId,
            escala_id             : escalaID,//filtroEscala[0].id ||'-',//props.escalaId,

             //campos para MOSTRAR
             

             usuario_nombre          : nombreUsuario,
             cod_depart_memo         : codigoMemorandum,
             ci                      : usuarioCI,
             cargo_usuario           : cargoUsuario,
             fecha_memo_registro     : fechaMemorandum?moment(fechaMemorandum).format("DD/MM/YYYY").toString(): '',
             tipo_comision_idp       : tipoMemorandumIDP,
             fecha_inicio_viaje      : fechaIda?moment(fechaIda).format("DD/MM/YYYY").toString(): '',
             fecha_fin_viaje         : fechaRetorno?moment(fechaRetorno).format("DD/MM/YYYY").toString(): '',
           
             cantidad_dias           : cantidadDias,
             viaticos_por_dia        : viaticoDia,      
             destino                 : destinosNombres, 
             usuario_a_cargo         : usuarioaCargoResult.fullname,      // aqui solo se imprime un solo destino 
         
            codigoQR    : `${numeroReciboQR}-               
            ${fechaQR}-   
            ${montoQr}- 
            ${memorandumQR}-                     
            ${viaticoIdQR}-`,
           // email     : usuarioResult.email,
           
        },
        data: {
             
        }
    };
    
    return Result.ok(result);
}

public async getFechaFiltroRRHH(fechaInicio: string, fechaFin: string, query:any): Promise<Result<{ rows: ViaticoTableModel[]  }>> {
		
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
     const aperturaViatico = await AperturaViaticoService.getAll();
     if (aperturaViatico.isFailure) return Result.fail("Falló al obtener la Apertura Viatico");
     const aperturaViaticoResult = aperturaViatico.getValue();
                   
    const result: ViaticoTableModel[] = viaticoResult.map((item) => {

    // Memorandum
            const codigoMemorandum = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.codDepartMemo|| "-";//Revisar
            const fechaMemorandum = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.fechaMemoRegistro || new Date();
            const cantidadDias =  memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.cantidadDias|| 0;
            const tipoMemoRepo = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.tipoMemoRepo||'';
            // usuario
            const nombreUsuarioId = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.usuarioId|| "-";
            const nombreUsuario = usuarioResult.find((c) => c.id === nombreUsuarioId)?.props.fullname|| "-";
            const usuarioCI = usuarioResult.find((c) => c.id === nombreUsuarioId)?.props.ci|| "-";
            // detalle destino
            const tipoComisionIDP = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.tipoComisionIDP|| "-"; 
            const destino = detalleDestinoResult.find((c) => c.props.memorandumId === item.props.memorandumId)?.props.destinoReg|| "-";
            const fechaIda = memorandumResult.find((c) => c.id=== item.props.memorandumId)?.props.fechaInicioViaje|| "-";
            const fechaRetorno = memorandumResult.find((c) => c.id ===  item.props.memorandumId )?.props.fechaFinViaje|| "-";
            const transporteOP = detalleDestinoResult.find((c) => c.props.memorandumId ===  item.props.memorandumId )?.props.tipoVehiculoOP|| "-";
            //Apertura Viatico
            const codApertura = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.aperturaViaticoId|| "-";
            const aperturaProgra = aperturaViaticoResult.find((c) => c.id === codApertura)?.props.aperturaProgramatica|| "-";
            const fondoFinan = aperturaViaticoResult.find((c) => c.id === codApertura)?.props.codFte|| "-";
            const sisin = aperturaViaticoResult.find((c) => c.id === codApertura)?.props.sisin|| "-";
            //Observaciones
            const modificacion =  memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.modificacion;       
            const obsModificacion = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.obsModificacion|| "-";     
            const fechaCambio   = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.fechaCambio|| "-";       
            const estadoModificacion  = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.estadoModificacion|| "-"; 
            const usuarioID = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.usuarioId||"-"; 
            const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === usuarioID)?.props.cargoId|| "-";
            const tipoUsuario = cargoResult.find((c) => c.id  === cargoUsuarioid)?.props.tipo || "-";
             const notificacionMemo =  memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.estadoMemorandum;       
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
        const filtroDestinos1: DetalleDestinoOptionsFormModel [] = listaDestinos
        .filter((value) => this.filtrarId(value.nombre, item.props.memorandumId!)); 

        const filtroDestinos : DetalleDestinoOptionsFormModel [] = filtroDestinos1
        .filter((value) => this.filtrarEstadoDestino(value.estado!,'SIN_VIAJE' )); 
       
        // Se filta por los destinos
        const filtroAprobados : DetalleDestinoOptionsFormModel [] = filtroDestinos 	
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
                   
                }else {
                    destinoNombre = destinoNombre.concat(destino).concat(' - ');
                
                }              
           });          
        }else{
            destinoNombre = (escalaDestinoResult.find((c) => c.id === destino))?
            escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-":destino;   
                    
        }
  
                return {
                    id                    : String(item.id),
                    nume_recibo           : item.props.numeRecibo,
                    fecha_pago_viatico    : item.props.fechaPagoViatico?moment(item.props.fechaPagoViatico).format("DD/MM/YYYY").toString(): '', 
                    suma_pasaje_ida       : item.props.sumaPasajeIda,
                    suma_pasaje_retorno   : item.props.sumaPasajeRetorno,
                    tipo_pasaje_gd        : item.props.tipoPasajeGD,
                    total_pasajes         : item.props.totalPasajes,
                    total_viatico         : item.props.totalViatico,
                    liquido_pagable       : item.props.liquidoPagable,
                    estado_pago           : item.props.estadoPago,
                    estado_recibo         : item.props.estadoRecibo,
                    fecha_anulacion       : item.props.fechaAnulacion?moment(item.props.fechaAnulacion).format("DD/MM/YYYY").toString(): '',   
                    notificacion_viatico  : item.props.notificacionViatico,
                    memorandum_id         : item.props.memorandumId,
                    escala_id             : item.props.escalaId,  

                    //Ingresando nuevos parametros de memorandum y escala
                    cod_memorandum : codigoMemorandum,
                    fecha_memo : fechaMemorandum,
                    usuario_id : nombreUsuario,
                    ci: usuarioCI,
                    destino_id : destinoNombre,
                    tipo_comision_idp:tipoComisionIDP,
                    fecha_viaje_ida : fechaIda?moment(fechaIda).format("DD/MM/YYYY").toString(): '',
                    fecha_viaje_retorno :fechaRetorno?moment(fechaRetorno).format("DD/MM/YYYY").toString(): '',
                    cantidad_dias : cantidadDias,
                    transporte_op : transporteOP,
                    apertura_prog : aperturaProgra,
                    fondo_financia : fondoFinan,
                    sisin : sisin,
                    conteo_dias_detalle:conteoDiasDetalle,
                    fecha_format_memo :  fechaMemorandum?moment(fechaMemorandum).format("DD/MM/YYYY HH:mm:ss").toString(): '',
                    tipo_memo_repo :tipoMemoRepo,
                    //activo                : boolean;
                    modificacion            :modificacion,
                    obs_modificacion        : obsModificacion,
                    fecha_cambio            : fechaCambio,
                    estado_modificacion     : estadoModificacion,
                    usuario_tipo            : tipoUsuario,
                    notificacion_memo       : notificacionMemo,
                };
            }).sort((a, b) => a.fecha_memo > b.fecha_memo ? -1 : 1)

    const filtrarFecha : ViaticoTableModel[] = this.filtrarPorFecha(result, fechaInicio, fechaFin); 
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
       const fechaFormat = this.convertirFecha(item.fecha_viaje_ida);
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

   public async getTipoUsuarioRRHH(tipo: string, query:any): Promise<Result<{ rows: ViaticoTableModel[]  }>> {
 
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
     const aperturaViatico = await AperturaViaticoService.getAll();
     if (aperturaViatico.isFailure) return Result.fail("Falló al obtener la Apertura Viatico");
     const aperturaViaticoResult = aperturaViatico.getValue();
                   
    const result: ViaticoTableModel[] = viaticoResult.map((item) => {

    // Memorandum
            const codigoMemorandum = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.codDepartMemo|| "-";//Revisar
            const fechaMemorandum = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.fechaMemoRegistro || new Date();
            const cantidadDias =  memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.cantidadDias|| 0;
            const tipoMemoRepo = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.tipoMemoRepo||'';
            // usuario
            const nombreUsuarioId = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.usuarioId|| "-";
            const nombreUsuario = usuarioResult.find((c) => c.id === nombreUsuarioId)?.props.fullname|| "-";
            const usuarioCI = usuarioResult.find((c) => c.id === nombreUsuarioId)?.props.ci|| "-";
            // detalle destino
            const tipoComisionIDP = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.tipoComisionIDP|| "-"; 
            const destino = detalleDestinoResult.find((c) => c.props.memorandumId === item.props.memorandumId)?.props.destinoReg|| "-";
            const fechaIda = memorandumResult.find((c) => c.id=== item.props.memorandumId)?.props.fechaInicioViaje|| "-";
            const fechaRetorno = memorandumResult.find((c) => c.id ===  item.props.memorandumId )?.props.fechaFinViaje|| "-";
            const transporteOP = detalleDestinoResult.find((c) => c.props.memorandumId ===  item.props.memorandumId )?.props.tipoVehiculoOP|| "-";
            //Apertura Viatico
            const codApertura = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.aperturaViaticoId|| "-";
            const aperturaProgra = aperturaViaticoResult.find((c) => c.id === codApertura)?.props.aperturaProgramatica|| "-";
            const fondoFinan = aperturaViaticoResult.find((c) => c.id === codApertura)?.props.codFte|| "-";
            const sisin = aperturaViaticoResult.find((c) => c.id === codApertura)?.props.sisin|| "-";
            //Observaciones
            const modificacion =  memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.modificacion;       
            const obsModificacion = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.obsModificacion|| "-";     
            const fechaCambio   = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.fechaCambio|| "-";       
            const estadoModificacion  = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.estadoModificacion|| "-"; 
            const usuarioID = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.usuarioId||"-"; 
            const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === usuarioID)?.props.cargoId|| "-";
            const tipoUsuario = cargoResult.find((c) => c.id  === cargoUsuarioid)?.props.tipo || "-";
             const notificacionMemo =  memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.estadoMemorandum;       
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
        const filtroDestinos1: DetalleDestinoOptionsFormModel [] = listaDestinos
        .filter((value) => this.filtrarId(value.nombre, item.props.memorandumId!)); 

        const filtroDestinos : DetalleDestinoOptionsFormModel [] = filtroDestinos1
        .filter((value) => this.filtrarEstadoDestino(value.estado!,'SIN_VIAJE' )); 
       
        // Se filta por los destinos
        const filtroAprobados : DetalleDestinoOptionsFormModel [] = filtroDestinos 	
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
                   
                }else {
                    destinoNombre = destinoNombre.concat(destino).concat(' - ');
                
                }              
           });          
        }else{
            destinoNombre = (escalaDestinoResult.find((c) => c.id === destino))?
            escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-":destino;   
                    
        }
  
                return {
                    id                    : String(item.id),
                    nume_recibo           : item.props.numeRecibo,
                    fecha_pago_viatico    : item.props.fechaPagoViatico?moment(item.props.fechaPagoViatico).format("DD/MM/YYYY").toString(): '', 
                    suma_pasaje_ida       : item.props.sumaPasajeIda,
                    suma_pasaje_retorno   : item.props.sumaPasajeRetorno,
                    tipo_pasaje_gd        : item.props.tipoPasajeGD,
                    total_pasajes         : item.props.totalPasajes,
                    total_viatico         : item.props.totalViatico,
                    liquido_pagable       : item.props.liquidoPagable,
                    estado_pago           : item.props.estadoPago,
                    estado_recibo         : item.props.estadoRecibo,
                    fecha_anulacion       : item.props.fechaAnulacion?moment(item.props.fechaAnulacion).format("DD/MM/YYYY").toString(): '',   
                    notificacion_viatico  : item.props.notificacionViatico,
                    memorandum_id         : item.props.memorandumId,
                    escala_id             : item.props.escalaId,  

                    //Ingresando nuevos parametros de memorandum y escala
                    cod_memorandum : codigoMemorandum,
                    fecha_memo : fechaMemorandum,
                    usuario_id : nombreUsuario,
                    ci: usuarioCI,
                    destino_id : destinoNombre,
                    tipo_comision_idp:tipoComisionIDP,
                    fecha_viaje_ida : fechaIda?moment(fechaIda).format("DD/MM/YYYY").toString(): '',
                    fecha_viaje_retorno :fechaRetorno?moment(fechaRetorno).format("DD/MM/YYYY").toString(): '',
                    cantidad_dias : cantidadDias,
                    transporte_op : transporteOP,
                    apertura_prog : aperturaProgra,
                    fondo_financia : fondoFinan,
                    sisin : sisin,
                    conteo_dias_detalle:conteoDiasDetalle,
                    fecha_format_memo :  fechaMemorandum?moment(fechaMemorandum).format("DD/MM/YYYY HH:mm:ss").toString(): '',
                    tipo_memo_repo :tipoMemoRepo,
                    //activo                : boolean;
                    modificacion            :modificacion,
                    obs_modificacion        : obsModificacion,
                    fecha_cambio            : fechaCambio,
                    estado_modificacion     : estadoModificacion,
                    usuario_tipo            : tipoUsuario,
                    notificacion_memo       : notificacionMemo,
                };
            }).sort((a, b) => a.fecha_memo > b.fecha_memo ? -1 : 1)
   
    const filtroTipo : ViaticoTableModel [] = result		
    .filter((value) => this.filtrarTipoUsuario(value.usuario_tipo!,tipo )); 	
    
    const response = findAndCountResult(filtroTipo, query); 
	
    return Result.ok(response);
	
}
public filtrarTipoUsuario(item:string, tipo:string) {             
    return (item === tipo);     
   }

public async getEstadoPagoRRHH(estado: string, query:any): Promise<Result<{ rows: ViaticoTableModel[]  }>> {
       
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
    const aperturaViaticoResult = apertura.getValue();
     /*Listado de apertura*/
     const area =await AreaService.getAll();
     if(area.isFailure) return Result.fail("Fallo al obtener el area");
     const areaResult = area.getValue();

                   
    const result: ViaticoTableModel[] = viaticoResult.map((item) => {

    // Memorandum
            const codigoMemorandum = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.codDepartMemo|| "-";//Revisar
            const fechaMemorandum = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.fechaMemoRegistro || new Date();
            const cantidadDias =  memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.cantidadDias|| 0;
            const tipoMemoRepo = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.tipoMemoRepo||'';
            // usuario
            const nombreUsuarioId = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.usuarioId|| "-";
            const nombreUsuario = usuarioResult.find((c) => c.id === nombreUsuarioId)?.props.fullname|| "-";
            const usuarioCI = usuarioResult.find((c) => c.id === nombreUsuarioId)?.props.ci|| "-";
            // detalle destino
            const tipoComisionIDP = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.tipoComisionIDP|| "-"; 
            const destino = detalleDestinoResult.find((c) => c.props.memorandumId === item.props.memorandumId)?.props.destinoReg|| "-";
            const fechaIda = memorandumResult.find((c) => c.id=== item.props.memorandumId)?.props.fechaInicioViaje|| "-";
            const fechaRetorno = memorandumResult.find((c) => c.id ===  item.props.memorandumId )?.props.fechaFinViaje|| "-";
            const transporteOP = detalleDestinoResult.find((c) => c.props.memorandumId ===  item.props.memorandumId )?.props.tipoVehiculoOP|| "-";
            //Apertura Viatico
            const codApertura = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.aperturaViaticoId|| "-";
            const aperturaProgra = aperturaViaticoResult.find((c) => c.id === codApertura)?.props.aperturaProgramatica|| "-";
            const fondoFinan = aperturaViaticoResult.find((c) => c.id === codApertura)?.props.codFte|| "-";
            const sisin = aperturaViaticoResult.find((c) => c.id === codApertura)?.props.sisin|| "-";
            //Observaciones
            const modificacion =  memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.modificacion;       
            const obsModificacion = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.obsModificacion|| "-";     
            const fechaCambio   = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.fechaCambio|| "-";       
            const estadoModificacion  = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.estadoModificacion|| "-"; 
            const usuarioID = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.usuarioId||"-"; 
            const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === usuarioID)?.props.cargoId|| "-";
            const tipoUsuario = cargoResult.find((c) => c.id  === cargoUsuarioid)?.props.tipo || "-";
             const notificacionMemo =  memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.estadoMemorandum;       
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
        const filtroDestinos1: DetalleDestinoOptionsFormModel [] = listaDestinos
        .filter((value) => this.filtrarId(value.nombre, item.props.memorandumId!)); 

        const filtroDestinos : DetalleDestinoOptionsFormModel [] = filtroDestinos1
        .filter((value) => this.filtrarEstadoDestino(value.estado!,'SIN_VIAJE' )); 
       
        // Se filta por los destinos
        const filtroAprobados : DetalleDestinoOptionsFormModel [] = filtroDestinos 	
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
  
                return {
                    id                    : String(item.id),
                    nume_recibo           : item.props.numeRecibo,
                    fecha_pago_viatico    : item.props.fechaPagoViatico?moment(item.props.fechaPagoViatico).format("DD/MM/YYYY").toString(): '', 
                    suma_pasaje_ida       : item.props.sumaPasajeIda,
                    suma_pasaje_retorno   : item.props.sumaPasajeRetorno,
                    tipo_pasaje_gd        : item.props.tipoPasajeGD,
                    total_pasajes         : item.props.totalPasajes,
                    total_viatico         : item.props.totalViatico,
                    liquido_pagable       : item.props.liquidoPagable,
                    estado_pago           : item.props.estadoPago,
                    estado_recibo         : item.props.estadoRecibo,
                    fecha_anulacion       : item.props.fechaAnulacion?moment(item.props.fechaAnulacion).format("DD/MM/YYYY").toString(): '',   
                    notificacion_viatico  : item.props.notificacionViatico,
                    memorandum_id         : item.props.memorandumId,
                    escala_id             : item.props.escalaId,  

                    //Ingresando nuevos parametros de memorandum y escala
                    cod_memorandum : codigoMemorandum,
                    fecha_memo : fechaMemorandum,
                    usuario_id : nombreUsuario,
                    ci: usuarioCI,
                    destino_id : destinoNombre,
                    tipo_comision_idp:tipoComisionIDP,
                    fecha_viaje_ida : fechaIda?moment(fechaIda).format("DD/MM/YYYY").toString(): '',
                    fecha_viaje_retorno :fechaRetorno?moment(fechaRetorno).format("DD/MM/YYYY").toString(): '',
                    cantidad_dias : cantidadDias,
                    transporte_op : transporteOP,
                    apertura_prog : aperturaProgra,
                    fondo_financia : fondoFinan,
                    sisin : sisin,
                    conteo_dias_detalle:conteoDiasDetalle,
                    fecha_format_memo :  fechaMemorandum?moment(fechaMemorandum).format("DD/MM/YYYY HH:mm:ss").toString(): '',
                    tipo_memo_repo :tipoMemoRepo,
                    //activo                : boolean;
                    modificacion            :modificacion,
                    obs_modificacion        : obsModificacion,
                    fecha_cambio            : fechaCambio,
                    estado_modificacion     : estadoModificacion,
                    usuario_tipo            : tipoUsuario,
                    notificacion_memo       : notificacionMemo,
                };
            }).sort((a, b) => a.fecha_memo > b.fecha_memo ? -1 : 1)  
   
    const filtroTipo : ViaticoTableModel [] = result		
    .filter((value) => this.filtrarEstadoPago(value.estado_pago!,estado )); 	
	
    
    const response = findAndCountResult(filtroTipo, query); 
	
    return Result.ok(response);
	
}

public async getEstadoModificacionRRHH(estado: string, query:any): Promise<Result<{ rows: ViaticoTableModel[]  }>> {
       
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
    const aperturaViaticoResult = apertura.getValue();
     /*Listado de apertura*/
     const area =await AreaService.getAll();
     if(area.isFailure) return Result.fail("Fallo al obtener el area");
     const areaResult = area.getValue();

                   
    const result: ViaticoTableModel[] = viaticoResult.map((item) => {

    // Memorandum
            const codigoMemorandum = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.codDepartMemo|| "-";//Revisar
            const fechaMemorandum = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.fechaMemoRegistro || new Date();
            const cantidadDias =  memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.cantidadDias|| 0;
            const tipoMemoRepo = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.tipoMemoRepo||'';
            // usuario
            const nombreUsuarioId = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.usuarioId|| "-";
            const nombreUsuario = usuarioResult.find((c) => c.id === nombreUsuarioId)?.props.fullname|| "-";
            const usuarioCI = usuarioResult.find((c) => c.id === nombreUsuarioId)?.props.ci|| "-";
            // detalle destino
            const tipoComisionIDP = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.tipoComisionIDP|| "-"; 
            const destino = detalleDestinoResult.find((c) => c.props.memorandumId === item.props.memorandumId)?.props.destinoReg|| "-";
            const fechaIda = memorandumResult.find((c) => c.id=== item.props.memorandumId)?.props.fechaInicioViaje|| "-";
            const fechaRetorno = memorandumResult.find((c) => c.id ===  item.props.memorandumId )?.props.fechaFinViaje|| "-";
            const transporteOP = detalleDestinoResult.find((c) => c.props.memorandumId ===  item.props.memorandumId )?.props.tipoVehiculoOP|| "-";
            //Apertura Viatico
            const codApertura = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.aperturaViaticoId|| "-";
            const aperturaProgra = aperturaViaticoResult.find((c) => c.id === codApertura)?.props.aperturaProgramatica|| "-";
            const fondoFinan = aperturaViaticoResult.find((c) => c.id === codApertura)?.props.codFte|| "-";
            const sisin = aperturaViaticoResult.find((c) => c.id === codApertura)?.props.sisin|| "-";
            //Observaciones
            const modificacion =  memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.modificacion;       
            const obsModificacion = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.obsModificacion|| "-";     
            const fechaCambio   = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.fechaCambio|| "-";       
            const estadoModificacion  = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.estadoModificacion|| "-"; 
            const usuarioID = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.usuarioId||"-"; 
            const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === usuarioID)?.props.cargoId|| "-";
            const tipoUsuario = cargoResult.find((c) => c.id  === cargoUsuarioid)?.props.tipo || "-";
             const notificacionMemo =  memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.estadoMemorandum;       
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
        const filtroDestinos1: DetalleDestinoOptionsFormModel [] = listaDestinos
        .filter((value) => this.filtrarId(value.nombre, item.props.memorandumId!)); 

        const filtroDestinos : DetalleDestinoOptionsFormModel [] = filtroDestinos1
        .filter((value) => this.filtrarEstadoDestino(value.estado!,'SIN_VIAJE' )); 
       
        // Se filta por los destinos
        const filtroAprobados : DetalleDestinoOptionsFormModel [] = filtroDestinos 	
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
  
                return {
                    id                    : String(item.id),
                    nume_recibo           : item.props.numeRecibo,
                    fecha_pago_viatico    : item.props.fechaPagoViatico?moment(item.props.fechaPagoViatico).format("DD/MM/YYYY").toString(): '', 
                    suma_pasaje_ida       : item.props.sumaPasajeIda,
                    suma_pasaje_retorno   : item.props.sumaPasajeRetorno,
                    tipo_pasaje_gd        : item.props.tipoPasajeGD,
                    total_pasajes         : item.props.totalPasajes,
                    total_viatico         : item.props.totalViatico,
                    liquido_pagable       : item.props.liquidoPagable,
                    estado_pago           : item.props.estadoPago,
                    estado_recibo         : item.props.estadoRecibo,
                    fecha_anulacion       : item.props.fechaAnulacion?moment(item.props.fechaAnulacion).format("DD/MM/YYYY").toString(): '',   
                    notificacion_viatico  : item.props.notificacionViatico,
                    memorandum_id         : item.props.memorandumId,
                    escala_id             : item.props.escalaId,  

                    //Ingresando nuevos parametros de memorandum y escala
                    cod_memorandum : codigoMemorandum,
                    fecha_memo : fechaMemorandum,
                    usuario_id : nombreUsuario,
                    ci: usuarioCI,
                    destino_id : destinoNombre,
                    tipo_comision_idp:tipoComisionIDP,
                    fecha_viaje_ida : fechaIda?moment(fechaIda).format("DD/MM/YYYY").toString(): '',
                    fecha_viaje_retorno :fechaRetorno?moment(fechaRetorno).format("DD/MM/YYYY").toString(): '',
                    cantidad_dias : cantidadDias,
                    transporte_op : transporteOP,
                    apertura_prog : aperturaProgra,
                    fondo_financia : fondoFinan,
                    sisin : sisin,
                    conteo_dias_detalle:conteoDiasDetalle,
                    fecha_format_memo :  fechaMemorandum?moment(fechaMemorandum).format("DD/MM/YYYY HH:mm:ss").toString(): '',
                    tipo_memo_repo :tipoMemoRepo,
                    //activo                : boolean;
                    modificacion            :modificacion,
                    obs_modificacion        : obsModificacion,
                    fecha_cambio            : fechaCambio,
                    estado_modificacion     : estadoModificacion,
                    usuario_tipo            : tipoUsuario,
                    notificacion_memo       : notificacionMemo,
                };
            }).sort((a, b) => a.fecha_memo > b.fecha_memo ? -1 : 1)  
   
    const filtroTipo : ViaticoTableModel [] = result		
    .filter((value) => this.filtrarEstadoPago(value.estado_modificacion!,estado )); 	
	
    
    const response = findAndCountResult(filtroTipo, query); 
	
    return Result.ok(response);
	
}

// Excel de RRHH
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
 
    const viatico = await ViaticoService.getAll();
    if (viatico.isFailure) return undefined;
    const viaticoResult = viatico.getValue();
// valores para el reporte
    //apertura 
    const apertura = await AperturaViaticoService.getAll();
    if (apertura.isFailure) return undefined;
    const aperturaResult = apertura.getValue();
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

      
    const viaticoesR: ViaticoItem[] = viaticoResult.map((item) => {
       
          // Memorandum
            const codigoMemorandum = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.codDepartMemo|| "-";//Revisar
            const fechaMemorandum = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.fechaMemoRegistro || new Date();
            const cantidadDias =  memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.cantidadDias|| 0;
            const tipoMemoRepo = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.tipoMemoRepo||'';
            // usuario
            const nombreUsuarioId = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.usuarioId|| "-";
            const nombreUsuario = usuarioResult.find((c) => c.id === nombreUsuarioId)?.props.fullname|| "-";
            const usuarioCI = usuarioResult.find((c) => c.id === nombreUsuarioId)?.props.ci|| "-";
            // detalle destino
            const tipoComisionIDP = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.tipoComisionIDP|| "-"; 
            const destino = detalleDestinoResult.find((c) => c.props.memorandumId === item.props.memorandumId)?.props.destinoReg|| "-";
            const fechaIda = memorandumResult.find((c) => c.id=== item.props.memorandumId)?.props.fechaInicioViaje|| "-";
            const fechaRetorno = memorandumResult.find((c) => c.id ===  item.props.memorandumId )?.props.fechaFinViaje|| "-";
            const transporteOP = detalleDestinoResult.find((c) => c.props.memorandumId ===  item.props.memorandumId )?.props.tipoVehiculoOP|| "-";
            //Apertura Viatico
            const codApertura = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.aperturaViaticoId|| "-";
            const aperturaProgra = aperturaResult.find((c) => c.id === codApertura)?.props.aperturaProgramatica|| "-";
            const fondoFinan = aperturaResult.find((c) => c.id === codApertura)?.props.codFte|| "-";
            const sisin = aperturaResult.find((c) => c.id === codApertura)?.props.sisin|| "-";
            //Observaciones
            const modificacion =  memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.modificacion;       
            const obsModificacion = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.obsModificacion|| "-";     
            const fechaCambio   = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.fechaCambio|| "-";       
            const estadoModificacion  = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.estadoModificacion|| "-"; 
            const usuarioID = memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.usuarioId||"-"; 
            const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === usuarioID)?.props.cargoId|| "-";
            const tipoUsuario = cargoResult.find((c) => c.id  === cargoUsuarioid)?.props.tipo || "-";
             const notificacionMemo =  memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.estadoMemorandum; 
            //verificacion dias de viaje
            let diasViaje = "-"
             const tipoViaje =  memorandumResult.find((c) => c.id === item.props.memorandumId)?.props.diasHabiles;       
            
             if (tipoViaje?.includes("INHABILES")){
                diasViaje = detalleDestinoResult.filter(c => c.props.memorandumId === item.props.memorandumId && c.props.estado != 'SIN_VIAJE')
                .sort((a, b) => new Date(a.props.fechaDia).getTime() - new Date(b.props.fechaDia).getTime())
                .map(c => c.props.fechaDia?moment(c.props.fechaDia).format("DD/MM/YYYY").toString(): '').join(' - ') || '-';              
            }
                        
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
            const filtroDestinos1: DetalleDestinoOptionsFormModel [] = listaDestinos
            .filter((value) => this.filtrarId(value.nombre, item.props.memorandumId!)); 

            const filtroDestinos : DetalleDestinoOptionsFormModel [] = filtroDestinos1
            .filter((value) => this.filtrarEstadoDestino(value.estado!,'SIN_VIAJE' )); 
        
            // Se filta por los destinos
            const filtroAprobados : DetalleDestinoOptionsFormModel [] = filtroDestinos 	
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
    
                    return {
                        id                    : String(item.id),
                        nume_recibo           : item.props.numeRecibo,
                        fecha_pago_viatico    : item.props.fechaPagoViatico?moment(item.props.fechaPagoViatico).format("DD/MM/YYYY").toString(): '', 
                        suma_pasaje_ida       : item.props.sumaPasajeIda,
                        suma_pasaje_retorno   : item.props.sumaPasajeRetorno,
                        tipo_pasaje_gd        : item.props.tipoPasajeGD,
                        total_pasajes         : item.props.totalPasajes,
                        total_viatico         : item.props.totalViatico,
                        liquido_pagable       : item.props.liquidoPagable,
                        estado_pago           : item.props.estadoPago,
                        estado_recibo         : item.props.estadoRecibo,
                        fecha_anulacion       : item.props.fechaAnulacion?moment(item.props.fechaAnulacion).format("DD/MM/YYYY").toString(): '',   
                        notificacion_viatico  : item.props.notificacionViatico,
                        memorandum_id         : item.props.memorandumId,
                        escala_id             : item.props.escalaId,  
                        //Ingresando nuevos parametros de memorandum y escala
                        cod_memorandum        : codigoMemorandum,
                        fecha_memo            : fechaMemorandum,
                        usuario_id            : nombreUsuario,
                        ci                    : usuarioCI,
                        destino_id            : destinoNombre,
                        tipo_comision_idp     : tipoComisionIDP,
                        fecha_viaje_ida       : fechaIda?moment(fechaIda).format("DD/MM/YYYY").toString(): '',
                        fecha_viaje_retorno   : fechaRetorno?moment(fechaRetorno).format("DD/MM/YYYY").toString(): '',
                        cantidad_dias         : cantidadDias,
                        transporte_op         : transporteOP,
                        apertura_prog         : aperturaProgra,
                        fondo_financia        : fondoFinan,
                        sisin : sisin,
                        conteo_dias_detalle   : conteoDiasDetalle,
                        fecha_format_memo     : fechaMemorandum?moment(fechaMemorandum).format("DD/MM/YYYY HH:mm:ss").toString(): '',
                        tipo_memo_repo        : tipoMemoRepo,
                        //activo                : boolean;                    
                        modificacion            : modificacion,
                        obs_modificacion        : obsModificacion,
                        fecha_cambio            : fechaCambio,
                        estado_modificacion     : estadoModificacion,
                        usuario_tipo            : tipoUsuario,
                        notificacion_memo       : notificacionMemo,
                        dias_viaje              : diasViaje,
                    };
            }).sort((a, b) => a.fecha_memo > b.fecha_memo ? -1 : 1)  


       //FILTRADO POR BENEFICIARIO
       let filtroGeneral : ViaticoItem [] = [];
       let filtroFecha : string[] = [] ;           
      //FILTRO GENERAL                    
                listaIds!.forEach((idG, key) => {        
                    const resultadoFiltro = viaticoesR.filter((value) => this.filtrarId(value.id, idG));           					
                    filtroGeneral = [...filtroGeneral, ...resultadoFiltro];  // Acumulamos los resultados                  
                    filtroFecha = this.getfechafirstLast(filtroGeneral);                                       
                    
                });
       //FIN FILTRO GENERAL              
        const result1: ViaticoDataR = {
           // tipo_reporte: tipo,
            rows: filtroGeneral,                     
        };        
        return result1;   
}

public generarHeadExcel(tipo:string) {   
    
    const headList : Partial<Column>[] =  [];
   switch(tipo){    
    case ENUM_REPORTE_PARA_RRHH:
            headList.push( { header: 'Numero de Recibo Viatico', key: 'nume_recibo', width: 25 },
            { header: 'Tipo Memorandum', key: 'tipo_memo_repo', width: 25 },
            { header: 'Tipo Usuario', key: 'tipo_usuario', width: 25 },          
            { header: 'C.I.', key: 'usuario_ci', width: 25 },  
            { header: 'Nombre de Usuario', key: 'usuario_nombre', width: 35 },            
            { header: 'Cod. Memo', key: 'cod_depart_memo', width: 40 },
            { header: 'Destino', key: 'destino', width: 30 },
            { header: 'Fecha Inicio Viaje', key: 'fecha_inicio_viaje', width: 25 },
            { header: 'Fecha Retorno Viaje', key: 'fecha_fin_viaje', width: 25 },  
            { header: 'Cantidad Dias', key: 'cantidad_dias', width: 25 },     
            { header: 'Dias de viaje', key: 'dias_viaje', width: 40 },   
            { header: 'Estado Memorandum', key: 'notificacion_memo', width: 30 },
            { header: 'Estado Pago Viatico', key: 'estado_pago', width: 25 },
            { header: 'Estado Modificacion', key: 'estado_modificacion', width: 25 },
            { header: 'Partida Presupuestaria', key: 'apertura_programatica', width: 25 });
          
            return headList;                           
   }
   
}


public getFormatData(data: ViaticoDataR | undefined)  {
		
    const listaData : ReportGeneral[] = [];
    if(data != null && data != undefined && data.rows.length >0){
        for (let i = 0; i < data.rows.length; i++) {
            const item : ReportGeneral = {
                nume_recibo           : Number(data.rows[i].nume_recibo),
                tipo_memo_repo        : String(data.rows[i].tipo_memo_repo),
                tipo_usuario          : String(data.rows[i].usuario_tipo),
                usuario_ci            : String(data.rows[i].ci),         
                usuario_nombre        : String(data.rows[i].usuario_id),           
              //  sigla                 : String(data.rows[i].sigla),
                cod_depart_memo       : String(data.rows[i].cod_memorandum),          
                destino               : String(data.rows[i].destino_id),
                fecha_inicio_viaje    : String(data.rows[i].fecha_viaje_ida),           
                fecha_fin_viaje       : String(data.rows[i].fecha_viaje_retorno),
                cantidad_dias         : Number(data.rows[i].cantidad_dias),
                notificacion_memo     : String(data.rows[i].notificacion_memo),    
                estado_pago           : String(data.rows[i].estado_pago),      
                estado_modificacion   : String(data.rows[i].estado_modificacion),  
                apertura_programatica : String(data.rows[i].apertura_prog),
                dias_viaje            : String(data.rows[i].dias_viaje),
            //    total_pasajes         : Number(data.rows[i].total_pasajes),   
             //   total_viatico         : Number(data.rows[i].total_viatico),  
             //   liquido_pagable       : Number(data.rows[i].liquido_pagable),
             //   ff_of                 : String(data.rows[i].ff_of),
             //   descargo              : Number(data.rows[i].monto_descargo),
             //   deposito              : Number(data.rows[i].monto_depositado),
             //   descuento             : Number(data.rows[i].saldo_descargo),
             //   tipo_usuario          : String(data.rows[i].usuario_tipo),  
             //   area_id               : String(data.rows[i].area_id), 
              //  estado_pago           : String(data.rows[i].estado_pago), 
              //  estado_modificacion   : String(data.rows[i].estado_modificacion), 
            }
            listaData.push(item)           			
           
           }
          
           return listaData;    
    }
  
  }

// Identificar la primera y ultima de las fechas dentro del filtro
public  getfechafirstLast (listaGeneral : ViaticoItem[]):string[]{	
    const filtroFechas : string []= [];
    const filtroFechasFirstLast : string []= [];
            
    listaGeneral.forEach((value,key)=>{
         filtroFechas.push(value.fecha_viaje_ida!)
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

public filtrarEstadoPago(itemEstadoPago:string, estado:string) {       
    
    if(estado === ENUM_APROBADO){
        return (itemEstadoPago === ENUM_APROBADO);
    }else if(estado === ENUM_ANULADO){
        return (itemEstadoPago === ENUM_ANULADO);
    }else if(estado === ENUM_RECHAZADO){
        return (itemEstadoPago === ENUM_RECHAZADO);
    } else if(estado === ENUM_OBSERVADO){
        return (itemEstadoPago === ENUM_OBSERVADO);
    }  else if(estado === ENUM_SIN_OBSERVACION){
        return (itemEstadoPago === ENUM_SIN_OBSERVACION);
    }    
}


// Función para convertir números a palabras
public numberToWords(num: number): string {
    if (num < 0 || num > 100000) {
        throw new Error("Número fuera de rango. Debe estar entre 0 y 100000.");
    }

    const units: string[] = [
        "cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve",
    ];

    const teens: string[] = [
        "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve",
    ];

    const tens: string[] = [
        "", "", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa",
    ];

    const hundreds: string[] = [
        "", "cien", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos",
    ];

    // Función auxiliar para convertir números de 0 a 99
    function convertTens(num: number): string {
        if (num < 10) {
            return units[num];
        } else if (num < 20) {
            return teens[num - 10];
        } else {
            const ten = Math.floor(num / 10);
            const unit = num % 10;
            return unit === 0 ? tens[ten] : `${tens[ten]} y ${units[unit]}`;
        }
    }

    // Función auxiliar para convertir números de 100 a 999
    function convertHundreds(num: number): string {
        if (num < 100) {
            return convertTens(num);
        } else if (num === 100) {
            return "cien";
        } else {
            const hundred = Math.floor(num / 100);
            const rest = num % 100;
            return rest === 0 ? hundreds[hundred] : `${hundreds[hundred]} ${convertTens(rest)}`;
        }
    }

    // Función auxiliar para convertir números de 1000 a 999999
    function convertThousands(num: number): string {
        if (num < 1000) {
            return convertHundreds(num);
        } else if (num < 100000) {
            const thousand = Math.floor(num / 1000);
            const rest = num % 1000;
            return thousand === 1 
                ? (rest === 0 ? "mil" : `mil ${convertHundreds(rest)}`)
                : `${convertHundreds(thousand)} mil ${rest === 0 ? '' : convertHundreds(rest)}`;
        } else {
            return "cien mil";
        }
    }

    // Función principal para convertir números hasta 100000
    function convertNumber(num: number): string {
        if (num === 100000) {
            return "cien mil";
        } else {
            return convertThousands(num);
        }
    }

    return convertNumber(num);
}
  
}