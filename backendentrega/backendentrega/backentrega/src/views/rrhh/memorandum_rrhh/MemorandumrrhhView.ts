import { Result } from "../../../base/types/Result";
import { findAndCountResult ,queryStringToArray} from "../../../tools/util";
import moment from "moment";

import  VehiculoService from "../../../core/admin/bsss/vehiculo";
import  CargoService  from "../../../core/rrhh/cargo";
import  UsuarioService from "../../../core/system/autenticacion/usuario";
import PersonalService from "../../../core/rrhh/personal";
import  AreaService  from "../../../core/rrhh/area";
import { AuthUser } from "../../../base/types/AuthUser";
import  EscalaDestinoService  from "../../../core/admin/conta_viatico/escala_destino";
import RoleService from "../../../core/system/autenticacion/role";
import { ENUM_ANULADO, ENUM_APROBADO_CONTABILIDAD, ENUM_APROBADO_SECRETARIO, ENUM_GENERAL, ENUM_JEFE, ENUM_OBSERVADO, ENUM_PENDIENTE,   ENUM_PENDIENTE_DE_APROBAR,   ENUM_PENDIENTE_RRHH,   ENUM_RECHAZADO, ENUM_REPORTE_POR_BENEFICIARIO, ENUM_REPORTE_POR_PROYECTO, ENUM_REPORTE_POR_TIPO, ENUM_SUPERADMINISTRADOR, ENUM_TECNICO_COMPLETO, ENUM_TECNICO_RRHH, ENUM_TECNICO_VALE_VIATICOS, ENUM_TECNICO_VIATICOS, ENUM_VERIFICADO_RRHH, ESTADOS_RRHH, ROLES_TECNICOS_VIATICOS, TECNICO_COMBUSTIBLE_JEFE } from "../../../base/constants/enum";
import  MemorandumrrhhService from "../../../core/rrhh/memorandum_rrhh";
import  DetalleDestinorrhhService  from "../../../core/rrhh/detalle_destino_rrhh";
import { DetalleDestinorrhhOptionsFormModel } from "../detalle_destino_rrhh/DetalleDestinorrhhView";
import { Column } from "exceljs";
import { ReportFilters } from "../../../views/system/report/types";



type MemorandumrrhhTableModel = {
    id                     : string;
    /** Se agregan tablas de conexion con memorandum */
    usuario_nombre         : string;
    usuario_cargo          : string;
    usuario_area?          : string;
    usuario_area_id?       : string;
    ci                     : string;
    nume_celular           : string;
    tipo_usuario?          : string;

    num_placa?             : string;

    /**Tabla original de la BDD */
    cod_depart_memo        : string;
    tipo_memorandum        : string;
    autorizado_por         : string[];
    cargo_jefe_unidad?      : string;
    fecha_memo_registro    : Date; 
    fecha_memo_format?      : string;//Date
    tipo_comision_idp      : string;
    fecha_inicio_viaje     : string; //Date
    fecha_fin_viaje        : string; //Date
    cantidad_dias          : number;
    tipo_memo_repo         : string;
    dias_habiles           : string;
    tipo_transporte        : string;
    observacion            : string;
    estado_memorandum      : string;
    notificacion_memo      : string;

    usuario_id?             : string | null;  //nombre completo   
    contrato?              : string;
    lista_select_jefes?     : SelectOption[]; 
   //
    modificacion?            : boolean,
    obs_modificacion?        : string | null,
    fecha_cambio?            : string,
    estado_modificacion?     : string,
    };



export type MemorandumrrhhFormDataResponse = {
    id                     : string;
    cod_depart_memo        : string;
    tipo_memorandum        : string;
    autorizado_por         : string[];
    fecha_memo_registro    : string;//date
    tipo_comision_idp      : string;
    fecha_inicio_viaje     : string;//date
    fecha_fin_viaje        : string;//date
    cantidad_dias          : number;
    tipo_memo_repo         : string;
    tipo_transporte        : string;
    observacion            : string;
    estado_memorandum      : string;
    dias_habiles           : string;
    notificacion_memo      : string;

    usuario_id             : string | null;
    
    modificacion           : boolean,
    obs_modificacion       : string | null ,
    fecha_cambio           : string,
    estado_modificacion    : string,

    // Datos Usuario
    nombre_usuario :string;
    ci:             string;
    cargo_usuario : string;
    nume_celular:   string;
    conteo_dias_detalle    : number; 
    usuario_admin :string;
};
export type MemorandumrrhhModelDetalle = {
    id?                    : string;
    nombre_usuario : string;
    ci: string;
    cargo_usuario : string
    tipo_comision_idp        : string;
    fecha_inicio_viaje     : string;
    fecha_fin_viaje        : string;
    cantidad_dias          : number;
};

export type detalleDestinorrhhItem = {
    id                       : string;
    tipo_vehiculo_op         : string;
    objetivo_viaje           : string;
    destino_reg              : string;
    fecha_dia                : string;
    hora_inicio              : string;
    hora_fin                 : string;
    pernocte                 : string;
   
    estado                   : string;
    memorandumrrhh_id            : string;
    
    vehiculo_id              : string;
    destino_id               : string;
    destino_id2              : string;

    //aumentando campos
    num_placa? : string;
    fecha_inicio? : string;
    fecha_fin? : string;
    observacion? : string;
    //cod_memorandum :string;
};


export type MemorandumrrhhDataResponse = {
    info?: InfoMemorandumrrhhModel;
    data?: MemorandumrrhhDataR;
};

export type MemorandumrrhhItem = { //cambiar
    id                     : string;
    /** Se agregan tablas de conexion con memorandum */
    usuario_nombre         : string;
    usuario_cargo          : string;
    usuario_area?          : string;
    ci                     : string;
    nume_celular           : string;
    tipo_usuario?          : string;

    num_placa?             : string;

    /**Tabla original de la BDD */
    cod_depart_memo        : string;
    tipo_memorandum        : string;
    autorizado_por         : string[];
    cargo_jefe_unidad?      : string;
    fecha_memo_registro    : Date; 
    fecha_memo_format?      : string;//Date
    tipo_comision_idp      : string;
    fecha_inicio_viaje     : string; //Date
    fecha_fin_viaje        : string; //Date
    cantidad_dias          : number | string;
    tipo_memo_repo         : string;
    dias_habiles           : string;
    tipo_transporte        : string;
    observacion            : string;
    estado_memorandum      : string;
    notificacion_memo      : string;

    usuario_id?             : string | null;  //nombre completo   
    contrato?              : string;
    lista_select_jefes?     : SelectOption[]; 
   //
    modificacion?            : boolean,
    obs_modificacion?        : string | null,
    fecha_cambio?            : string,
    estado_modificacion?     : string,
    destino?                 : string,
    area_solicitante?        : string,
    sigla?                   : string;            
};
export type AreaFormModel = {
    id: string;
    nombre: string;
    partida_presupuestaria?: string;
    sigla?: string;
};
export type MemorandumrrhhDataR = {
    tipo_reporte             : string;
    lista_areas              : AreaFormModel[];
    //   lista_ffof     : string[]; 
    idBeneficiario           : MemorandumrrhhItem[];
    rows                     : MemorandumrrhhItem[];
    fecha_inicio_filtro?     : string;
    fecha_fin_filtro?        : string;
};
export type InfoMemorandumrrhhModel = {
    codigo    : string;
    nombre    : string;
    fecha     : string;
    email     : string;
    codigoQR?  : string;
};

export type MemorandumrrhhData = {
    info: InfoReporteModel;
    data: MemorandumrrhhReporte;
};

export type MemorandumrrhhReporte = {
    //tasks: any;
    //lineas: lineaTemporalItem[];
    rows  : detalleDestinorrhhItem[];
    
};

export type InfoReporteModel = {
    //id                     : string;
    /** Se agregan tablas de conexion con memorandum */
    usuario_nombre : string;
    usuario_cargo : string;
    ci                     : string;
    nume_celular            : string;

    num_placa?              : string;

    /**Tabla original de la BDD */
    cod_depart_memo        : string;
    tipo_memorandum        : string;
    autorizado_por         : string[];
    cargo_jefe_unidad      : string;
    fecha_memo_registro    : string; //Date
    tipo_comision_idp      : string;
    fecha_inicio_viaje     : string; //Date
    fecha_fin_viaje        : string; //Date
    cantidad_dias          : number;
    tipo_memo_repo         : string;
    tipo_transporte        : string;
    observacion            : string;
    estado_memorandum      : string;
    notificacion_memo      : string;

    conteo_dias_detalle    : number; 
    contrato?              : string;    
    codigoQR               : string;
    usuario_a_cargo?       : string; 
    usuario_sigla?         : string; 
    aprobado_rrhh?         : string;

    //Se puede agregar lo de modificacion    
};

export type SelectOption = {
    value: string;
    label: string;
}

export type MemorandumProcesoFechas = {   
    fecha_dia: string;  
    pernocte : string;  
};
export type MemorandumProcesoFechasDate = {   
    fecha_dia: Date;  
    pernocte : string;  
};

export type MemorandumTablaReporte = {   
    fecha_inicio: string;  
    fecha_fin   : string;
    pernocte    : string;
    observacion : string;  
};
//Tabla de destino
export type DetalleDestinorrhhTableModel = {
    id                       : string;
    tipo_vehiculo_op         : string;
    objetivo_viaje           : string;
    destino_reg              : string;
    fecha_dia                : Date;
    hora_inicio              : string;
    hora_fin                 : string;
    pernocte                 : string;   
    memorandumrrhh_id            : string;
  //  viatico_id               : string;
    vehiculo_id              : string;
    destino_id               : string;
};
export type MemorandumTipoPCPOptionsFormModel = {
    id: string;
    nombre: string;
    caption?: string;
};

export type ConteoDestinoPCPOptionsFormModel = {
    id: string;
    nombre: boolean;
    caption?: number;
};

export type MemorandumCite = {
    id: string;
    nombre: string;
    caption?: number;
};

export type tipoDateString = {
    a : Date;
    b : string; 
}

export type doubleString = {
    a : string;
    b : string; 
}

export type ModificacionDetalleDestino = {
   // id: string;
    modificacion: boolean;
    observacion: string;  
    estadoObservacion : string,
};
export type ModificacionMemorandum = {
    // id: string;
     modificacion        : boolean;
     obsModificacion     : string;  
     fechaCambio        : string,
     estadoModificacion : string;
     estadoMemorandum   : string;
 };

export type ReportGeneral = {
numero ?              : number;
tipo_memorandum      : string; 
usuario_ci           : string;
usuario_nombre       : string;
sigla  ?              : string;
cod_depart_memo      : string;
destino  ?            : string;
fecha_inicio_viaje   : string;
fecha_fin_viaje      : string;
tipo_comision        : string;
cantidad_dias        : number;
tipo_usuario         : string;
estado_memorandum?    : string;
area_id?             : string;

}

export class MemorandumrrhhView {
    public async getMemorandumsTable(authUser: AuthUser, query: any): Promise<Result<{ rows: MemorandumrrhhTableModel[] }>> {
			
            const memorandum = await MemorandumrrhhService.getAll();
            if (memorandum.isFailure) return Result.fail("Falló al obtener la Memorandum");
            const memorandumrrhhResult = memorandum.getValue();
            /*Listado de usuarios*/
            const usuarios = await UsuarioService.getAll();
            if(usuarios.isFailure) return Result.fail("Fallo al obtener el Usuario");
            const usuarioResult = usuarios.getValue();
            /*Listado de apertura viatico*/             
            /*Listado de vehiculos*/
            const vehiculo = await VehiculoService.getAll();
            if(vehiculo.isFailure) return Result.fail("Fallo al obtener el Vehiculo");
            const vehiculosResult = vehiculo.getValue().filter((v) => v.props.estado);
            if(!vehiculosResult) return Result.fail("Error no existe vehiculos");            

            /*Listado de cargos*/
            const cargo = await CargoService.getAll();
            if(cargo.isFailure) return Result.fail("Fallo al obtener el Cargo");
            const cargoResult = cargo.getValue();
            /*Listado de personal*/
            const personal =await PersonalService.getAll();
            if(personal.isFailure) return Result.fail("Fallo al obtener el Personal");
            const personalResult = personal.getValue();
            /*Listado de area*/
            const area = await AreaService.getAll();
            if (area.isFailure) return Result.fail("Falló al obtener la Area");
            const areaResult = area.getValue();   
           /*Listado detalle destino*/    
            const detalleDestino = await DetalleDestinorrhhService.getAll();
            if (detalleDestino.isFailure) return Result.fail("Falló al obtener la Detalle Destino");
             const detalleDestinoResult = detalleDestino.getValue(); 
              //conteo dias detalle destino 
               //Lista de destinos
               const listaDestinos: DetalleDestinorrhhOptionsFormModel[] = detalleDestino
               .getValue()
               .map((value) => {                
                       return {                
                           id: value.id.toString(),
                           nombre: value.props.memorandumrrhhId,
                           caption : value.props.destinoReg,                                             
                        };            
               }) ;     
             
            const result: MemorandumrrhhTableModel[] = memorandumrrhhResult.map((item) => {

                 /**seleccionamos del listado de area el nombre del departamento y su sigla*/
               const usuarioNombre = usuarioResult.find((c) => c.id === item.props.usuarioId)?.props.fullname|| "-";//Revisar              
               const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === item.props.usuarioId)?.props.cargoId|| "-";
               const cargoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.nombre|| "-";
               const contratoUsuario =  cargoResult.find((c) => c.id === cargoUsuarioid)?.props.item|| "-";
               const usuarioCI = usuarioResult.find((c) => c.id === item.props.usuarioId)?.props.ci|| "-";
               const usuarioNumCelular = usuarioResult.find((c) => c.id === item.props.usuarioId)?.props.celular|| "-";                
                //datos jefe
                const jefesObject = item.props.autorizadoPor || [];				
                const listaJefes: any[] = [];
                 //sacar el nombre completo del jefe y unirlo al id
                jefesObject.forEach((e: any) => {
                    const jefe = usuarioResult.find((r) => r.id === e);
                    const cargoJefe = personalResult.find((c)=> c.props.usuarioId === e)?.props.cargoId|| "-";
                    if (jefe) {
                        const cargoNombreJefe = cargoResult.find((r)=> r.id === cargoJefe)?.props.nombre|| "-";
                        const propsJefe = {
                            id      : jefe.id,
                            fullname     : jefe.props.fullname,              
                            cargo    : cargoNombreJefe,             
                        };
                        listaJefes.push(propsJefe);
                    }
                });
               // sacar el cargo del personal del jefe
               const listaSelectJefes: SelectOption  [] = [];               
                listaJefes.forEach((e:any)=>{                    
                     const cargoIDJefe = personalResult.find((c)=> c.props.usuarioId ===e.id)?.props.cargoId|| "-";                    
                     const cargoNombreJefe = cargoResult.find((r)=> r.id === cargoIDJefe)?.props.nombre|| "-";                 
                     const palabras = cargoNombreJefe.trim().split(' ');
                     const primeraPalabra = palabras[0].replace(/\(.*?\)/g, '').toLocaleUpperCase();                
                     const concatenaAprove = "APROBADO_".concat(primeraPalabra);
                     listaSelectJefes.push({ value: concatenaAprove, label: concatenaAprove})      
                });
                
               // area de los usuarios del  memorandum
                   const usuarioId = usuarioResult.find((c)=>c.id === item.props.usuarioId)?.id || "-";                   
                   const usuarioArea = personalResult.find((c)=> c.props.usuarioId === usuarioId)?.props.areaId || "-";                   
                                     
                   let areaPadre = areaResult.find((c)=>c.id === usuarioArea)?.props.areaId;	                 
                   if(areaPadre == null){
                      areaPadre = usuarioArea;              
                    }  
                   const areaNombreUsuario =  areaResult.find((c) => c.id === areaPadre)?.props.nombre|| "-";	                    
               // fin area usuarios memorandum
               
                // Se filta por los id de memo
                const filtroDestinos : DetalleDestinorrhhOptionsFormModel [] = listaDestinos
                .filter((value) => this.filtrarId(value.nombre, item.id)); 
              let contador = 0;
                for(let i = 0; i < filtroDestinos.length; i++){                   
                    const estado = detalleDestinoResult.find((c) => c.id === filtroDestinos[i].id)?.props.estado|| "-";//Revisar
					
                    if(estado === 'SIN_VIAJE'){
                        contador++;					
                    }
                }                
                const cantidadDiasDetalleDestino = filtroDestinos.length - contador;  

               //recupera datos para mostrar en la tabla del modulo
                return {
                    id                     : String(item.id),    
                    usuario_nombre         : usuarioNombre,
                    usuario_cargo          : cargoUsuario,   
                    ci                     : usuarioCI ,
                    nume_celular           : usuarioNumCelular, 
                   // num_placa              : placaVehiculo,
                    cod_depart_memo        : item.props.codDepartMemo,
                    tipo_memorandum        : item.props.tipoMemorandum,
                 
                    autorizado_por         : listaJefes,//listaJefes,//nombreJefe,
                    cargo_jefe_unidad      : listaJefes[0].cargo,//cargoNombreJefe,
                    fecha_memo_registro    : item.props.fechaMemoRegistro,
                    tipo_comision_idp      : item.props.tipoComisionIDP,
                    fecha_inicio_viaje     : item.props.fechaInicioViaje?moment(item.props.fechaInicioViaje).format("DD/MM/YYYY").toString(): '',//moment(item.props.fechaInicioViaje,"DD/MM/YYYY").toString,
                    fecha_fin_viaje        : item.props.fechaFinViaje?moment(item.props.fechaFinViaje).format("DD/MM/YYYY").toString(): '',//moment(item.props.fechaFinViaje,"DD/MM/YYYY").toString,
                    cantidad_dias          : item.props.cantidadDias,
                    tipo_memo_repo         : item.props.tipoMemoRepo,
                    tipo_transporte        : item.props.tipoTransporte,
                    dias_habiles           : item.props.diasHabiles,
                    observacion            : item.props.observacion,
                    estado_memorandum      : item.props.estadoMemorandum,
                    notificacion_memo      : item.props.notificacionMemo,       
                    
                    modificacion            : item.props.modificacion,
                    obs_modificacion        : item.props.obsModificacion,
                    fecha_cambio            : item.props.fechaCambio,
                    estado_modificacion     : item.props.estadoModificacion,
                    //no se esta utilizando usuario, cargo y apertuv
                
                    usuario_id             : item.props.usuarioId,
                    usuario_area           : areaNombreUsuario,//ID del area del usuario,
                    usuario_area_id        : usuarioArea,//areaNombreUsuario,//ID del area del usuario,
                    conteo_dias_detalle    : cantidadDiasDetalleDestino,
                    contrato               : String(contratoUsuario),
                    fecha_memo_format      :item.props.fechaMemoRegistro?moment(item.props.fechaMemoRegistro).format("DD/MM/YYYY").toString(): '',
            
                    lista_select_jefes     : listaSelectJefes,
                };
               
            }).sort((a, b) => moment(a.fecha_memo_registro).toDate() < moment(b.fecha_memo_registro).toDate() ? 1 : -1);


             /*filtrado POR ROL y area*/
            let listafiltradaPorUsuario : MemorandumrrhhTableModel[]=[]; 
            const usuarioId = authUser.uid;					
			const areaId =  personalResult.find((c) => c.props.usuarioId === usuarioId)?.props.areaId|| "-";	
            let areaPadreAdmin = areaResult.find((c)=>c.id === areaId)?.props.areaId;		          
            if(areaPadreAdmin == null){
               areaPadreAdmin = areaId;              
              
            }    
            
            if(ROLES_TECNICOS_VIATICOS.has(authUser.roles!)){	         			
								
                listafiltradaPorUsuario = result.filter((a)=> a.usuario_area_id === areaPadreAdmin); 
			
            }else if(authUser.roles === ENUM_TECNICO_RRHH){
				
                listafiltradaPorUsuario = result.filter((a)=>  ESTADOS_RRHH.has(a.estado_memorandum) ||a.estado_modificacion === ENUM_OBSERVADO );  
			
            }else{
                listafiltradaPorUsuario = result; 				
			
            }
       
            /*fin Filtrado*/
               
            const response = findAndCountResult(listafiltradaPorUsuario, query);		
           
            return Result.ok(response);
    }
   
 
    public async getMemorandumsUserTable(authUser: AuthUser, query: any): Promise<Result<{ rows: MemorandumrrhhTableModel[] }>> {
            const ID_USUARIO = authUser.uid;
            const memorandum = await MemorandumrrhhService.getAll();
            if (memorandum.isFailure) return Result.fail("Falló al obtener la Memorandum");
            let memorandumrrhhResult = memorandum.getValue();
            if(ID_USUARIO) memorandumrrhhResult = memorandum.getValue().filter((a) => a.props.usuarioId === ID_USUARIO);
            /*procedimiento de verificacion de rol*/
            const usuarioResult = await UsuarioService.getById(ID_USUARIO);
            if (usuarioResult.isFailure) return Result.fail("Falló al obtener la usuario");
            const ID_ROLE = usuarioResult.getValue().props.roleId;
            const rolesResult = await RoleService.getById(ID_ROLE);
            const permisos = JSON.parse(rolesResult.getValue().props.permisos);
            const is_approve = typeof permisos.approve !== 'undefined'? permisos.approve: false;
            
            if (authUser.superadministrador || is_approve) memorandumrrhhResult = memorandum.getValue();

           /*Listado de usuarios*/
            const usuarios = await UsuarioService.getAll();
            if(usuarios.isFailure) return Result.fail("Fallo al obtener el Usuario");
            const usuariosResult = usuarios.getValue();
           
            /*Listado de vehiculos*/
            const vehiculo = await VehiculoService.getAll();
            if(vehiculo.isFailure) return Result.fail("Fallo al obtener el Vehiculo");
          //  const vehiculoResult = vehiculo.getValue();
            /*Listado de cargos*/
            const cargo = await CargoService.getAll();
            if(cargo.isFailure) return Result.fail("Fallo al obtener el Cargo");
            const cargoResult = cargo.getValue();
            /*Listado de personal*/
            const personal =await PersonalService.getAll();
            if(personal.isFailure) return Result.fail("Fallo al obtener el Personal");
            const personalResult = personal.getValue();
            /*Listado de area*/
            const area = await AreaService.getAll();
            if (area.isFailure) return Result.fail("Falló al obtener la Area");
           // const areaResult = area.getValue();   
            /*Listado detalle destino*/    
            const detalleDestino = await DetalleDestinorrhhService.getAll();
            if (detalleDestino.isFailure) return Result.fail("Falló al obtener la Area");
            /*Lista de destinos*/
            const listaDestinos: DetalleDestinorrhhOptionsFormModel[] = detalleDestino
                                                                    .getValue()
                                                                    .map((value) => {                
                                                                            return {                
                                                                                id: value.id.toString(),
                                                                                nombre: value.props.memorandumrrhhId,
                                                                                caption : value.props.destinoReg,                                             
                                                                            };            
                                                                    });     
            const result: MemorandumrrhhTableModel[] = memorandumrrhhResult.map((item) => {

               /**seleccionamos del listado de area el nombre del departamento y su sigla*/
               const usuarioNombre = usuariosResult.find((c) => c.id === item.props.usuarioId)?.props.fullname|| "-";//Revisar
               const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === item.props.usuarioId)?.props.cargoId|| "-";
               const cargoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.nombre|| "-";
               const usuarioCI = usuariosResult.find((c) => c.id === item.props.usuarioId)?.props.ci|| "-";
               const usuarioNumCelular = usuariosResult.find((c) => c.id === item.props.usuarioId)?.props.celular|| "-";                
                            
                // Se filta por los id de memo
                const filtroDestinos : DetalleDestinorrhhOptionsFormModel [] = listaDestinos
                                                                            .filter((value) => this.filtrarId(value.nombre, item.id));             
                                                                            const cantidadDiasDetalleDestino = filtroDestinos.length;          
               //recupera datos para mostrar en la tabla del modulo

               //datos jefe
               const jefesObject = item.props.autorizadoPor || [];				
               const listaJefes: any[] = [];
                //sacar el nombre completo del jefe y unirlo al id
               jefesObject.forEach((e: any) => {
                   const jefe = usuariosResult.find((r) => r.id === e);
                   const cargoJefe = personalResult.find((c)=> c.props.usuarioId === e)?.props.cargoId|| "-";
                   if (jefe) {
                       const cargoNombreJefe = cargoResult.find((r)=> r.id === cargoJefe)?.props.nombre|| "-";
                       const propsJefe = {
                           id      : jefe.id,
                           fullname     : jefe.props.fullname,              
                           cargo    : cargoNombreJefe,             
                       };
                       listaJefes.push(propsJefe);
                   }
               });
                return {
                    id                     : String(item.id),    
                    usuario_nombre         : usuarioNombre,
                    usuario_cargo          : cargoUsuario,   
                    ci                     : usuarioCI ,
                    nume_celular           : usuarioNumCelular, 
                   // num_placa              : placaVehiculo,
                    cod_depart_memo        : item.props.codDepartMemo,
                    tipo_memorandum        : item.props.tipoMemorandum,
             
                    autorizado_por         : listaJefes,//nombreJefe,
                    cargo_jefe_unidad      : "",//cargoNombreJefe,
                    fecha_memo_registro    : item.props.fechaMemoRegistro,
                    tipo_comision_idp      : item.props.tipoComisionIDP,
                    fecha_inicio_viaje     : item.props.fechaInicioViaje?moment(item.props.fechaInicioViaje).format("DD/MM/YYYY").toString(): '',//moment(item.props.fechaInicioViaje,"DD/MM/YYYY").toString,
                    fecha_fin_viaje        : item.props.fechaFinViaje?moment(item.props.fechaFinViaje).format("DD/MM/YYYY").toString(): '',//moment(item.props.fechaFinViaje,"DD/MM/YYYY").toString,
                    cantidad_dias          : item.props.cantidadDias,
                    tipo_memo_repo         : item.props.tipoMemoRepo,
                    tipo_transporte        : item.props.tipoTransporte,
                    observacion            : item.props.observacion,
                    estado_memorandum      : item.props.estadoMemorandum,
                    notificacion_memo      : item.props.notificacionMemo,
                    dias_habiles           : item.props.diasHabiles,                 
                    usuario_id             : item.props.usuarioId,
                    modificacion            : item.props.modificacion,
                    obs_modificacion        : item.props.obsModificacion,
                    fecha_cambio            : item.props.fechaCambio,
                    estado_modificacion     : item.props.estadoModificacion,
                    
                    conteo_dias_detalle    : cantidadDiasDetalleDestino,
                    fecha_memo_format      :item.props.fechaMemoRegistro?moment(item.props.fechaMemoRegistro).format("DD/MM/YYYY").toString(): '',
                };
            }).sort((a, b) => moment(a.fecha_memo_registro).toDate() < moment(b.fecha_memo_registro).toDate() ? 1 : -1);
            
            const response = findAndCountResult(result, query);
            return Result.ok(response);
    }
    public async getMemorandumsSolicitadaUserTable(authUser: AuthUser, query: any): Promise<Result<{ rows: MemorandumrrhhTableModel[] }>> {
            const ID_USUARIO = authUser.uid;
            const memorandum = await MemorandumrrhhService.getAll();
            if (memorandum.isFailure) return Result.fail("Falló al obtener la Memorandum");
            const memorandumrrhhResult = memorandum.getValue().filter((a) => a.props.autorizadoPor[0] === ID_USUARIO);
                        
           /*Listado de usuarios*/
            const usuarios = await UsuarioService.getAll();
            if(usuarios.isFailure) return Result.fail("Fallo al obtener el Usuario");
            const usuariosResult = usuarios.getValue();
           
            /*Listado de vehiculos*/
            const vehiculo = await VehiculoService.getAll();
            if(vehiculo.isFailure) return Result.fail("Fallo al obtener el Vehiculo");
            //const vehiculoResult = vehiculo.getValue();
            /*Listado de cargos*/
            const cargo = await CargoService.getAll();
            if(cargo.isFailure) return Result.fail("Fallo al obtener el Cargo");
            const cargoResult = cargo.getValue();
            /*Listado de personal*/
            const personal =await PersonalService.getAll();
            if(personal.isFailure) return Result.fail("Fallo al obtener el Personal");
            const personalResult = personal.getValue();
            /*Listado de area*/
            const area = await AreaService.getAll();
            if (area.isFailure) return Result.fail("Falló al obtener la Area");
           // const areaResult = area.getValue();   
            /*Listado detalle destino*/    
            const detalleDestino = await DetalleDestinorrhhService.getAll();
            if (detalleDestino.isFailure) return Result.fail("Falló al obtener la Area");
            /*Lista de destinos*/
            const listaDestinos: DetalleDestinorrhhOptionsFormModel[] = detalleDestino
                                                                    .getValue()
                                                                    .map((value) => {                
                                                                            return {                
                                                                                id: value.id.toString(),
                                                                                nombre: value.props.memorandumrrhhId,
                                                                                caption : value.props.destinoReg,                                             
                                                                            };            
                                                                    });     
            const result: MemorandumrrhhTableModel[] = memorandumrrhhResult.map((item) => {

               /**seleccionamos del listado de area el nombre del departamento y su sigla*/
               const usuarioNombre = usuariosResult.find((c) => c.id === item.props.usuarioId)?.props.fullname|| "-";//Revisar
               const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === item.props.usuarioId)?.props.cargoId|| "-";
               const cargoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.nombre|| "-";
               const usuarioCI = usuariosResult.find((c) => c.id === item.props.usuarioId)?.props.ci|| "-";
               const usuarioNumCelular = usuariosResult.find((c) => c.id === item.props.usuarioId)?.props.celular|| "-";                
              
             
                // Se filta por los id de memo
                const filtroDestinos : DetalleDestinorrhhOptionsFormModel [] = listaDestinos
                                                                            .filter((value) => this.filtrarId(value.nombre, item.id));             
                                                                            const cantidadDiasDetalleDestino = filtroDestinos.length;          
               
                //datos jefe
                const jefesObject = item.props.autorizadoPor || [];				
                const listaJefes: any[] = [];
                 //sacar el nombre completo del jefe y unirlo al id
                jefesObject.forEach((e: any) => {
                    const jefe = usuariosResult.find((r) => r.id === e);
                    const cargoJefe = personalResult.find((c)=> c.props.usuarioId === e)?.props.cargoId|| "-";
                    if (jefe) {
                        const cargoNombreJefe = cargoResult.find((r)=> r.id === cargoJefe)?.props.nombre|| "-";
                        const propsJefe = {
                            id      : jefe.id,
                            fullname     : jefe.props.fullname,              
                            cargo    : cargoNombreJefe,             
                        };
                        listaJefes.push(propsJefe);
                    }
                });
               
                //recupera datos para mostrar en la tabla del modulo
                return {
                    id                     : String(item.id),    
                    usuario_nombre         : usuarioNombre,
                    usuario_cargo          : cargoUsuario,   
                    ci                     : usuarioCI ,
                    nume_celular           : usuarioNumCelular, 
                  //  num_placa              : placaVehiculo,
                    cod_depart_memo        : item.props.codDepartMemo,
                    tipo_memorandum        : item.props.tipoMemorandum,
                 
                    autorizado_por         : listaJefes,//nombreJefe,
                    cargo_jefe_unidad      : "",//cargoNombreJefe,
                    fecha_memo_registro    : item.props.fechaMemoRegistro,
                    tipo_comision_idp      : item.props.tipoComisionIDP,
                    fecha_inicio_viaje     : item.props.fechaInicioViaje?moment(item.props.fechaInicioViaje).format("DD/MM/YYYY").toString(): '',//moment(item.props.fechaInicioViaje,"DD/MM/YYYY").toString,
                    fecha_fin_viaje        : item.props.fechaFinViaje?moment(item.props.fechaFinViaje).format("DD/MM/YYYY").toString(): '',//moment(item.props.fechaFinViaje,"DD/MM/YYYY").toString,
                    cantidad_dias          : item.props.cantidadDias,
                    tipo_memo_repo         : item.props.tipoMemoRepo,
                    tipo_transporte        : item.props.tipoTransporte,
                    dias_habiles           : item.props.diasHabiles,
                    observacion            : item.props.observacion,
                    estado_memorandum      : item.props.estadoMemorandum,
                    notificacion_memo      : item.props.notificacionMemo,                
                    usuario_id             : item.props.usuarioId,                    
                    modificacion            : item.props.modificacion,
                    obs_modificacion        : item.props.obsModificacion,
                    fecha_cambio            : item.props.fechaCambio,
                    estado_modificacion     : item.props.estadoModificacion,

                    conteo_dias_detalle    : cantidadDiasDetalleDestino,
                    fecha_memo_format      :item.props.fechaMemoRegistro?moment(item.props.fechaMemoRegistro).format("DD/MM/YYYY").toString(): '',
                };
            }).sort((a, b) => moment(a.fecha_memo_registro).toDate() < moment(b.fecha_memo_registro).toDate() ? 1 : -1);
            
            const response = findAndCountResult(result, query);
            return Result.ok(response);
    }

    public async getMemorandumFormDataView(authUser: AuthUser,id_memorandum: string): Promise<Result<MemorandumrrhhFormDataResponse>> {
        const memorandum = await MemorandumrrhhService.getById(id_memorandum);
        if (memorandum.isFailure) return Result.fail<MemorandumrrhhFormDataResponse>("Memorandum no encontrado");
        
        const props = memorandum.getValue().props;
        /*Listado de usuarios*/
        const usuario = await UsuarioService.getAll();
        if(usuario.isFailure) return Result.fail("Fallo al obtener el Usuario");
        const usuarioResult = usuario.getValue();
        /*Listado de cargos*/
        const cargo = await CargoService.getAll();
        if(cargo.isFailure) return Result.fail("Fallo al obtener el Cargo");
        const cargoResult = cargo.getValue();
        /*Listado de personal*/
        const personal =await PersonalService.getAll();
        if(personal.isFailure) return Result.fail("Fallo al obtener el Cargo");
        const personalResult = personal.getValue();


        //seleccionamos del listado de area el nombre del departamento y su sigla
       const usuarioNombre = usuarioResult.find((c) => c.id === props.usuarioId)?.props.fullname|| "-";//Revisar
       const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === props.usuarioId)?.props.cargoId|| "-";
       const cargoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.nombre|| "-";
       const usuarioCI = usuarioResult.find((c) => c.id === props.usuarioId)?.props.ci|| "-";
       const usuarioNumCelular = usuarioResult.find((c) => c.id === props.usuarioId)?.props.celular|| "-";

        const result: MemorandumrrhhFormDataResponse = {
            id                     : memorandum.getValue().id,    
            cod_depart_memo        : props.codDepartMemo,
            tipo_memorandum        : props.tipoMemorandum,
            autorizado_por         : props.autorizadoPor,
          //  cargo_jefe_unidad      : props.cargoJefeUnidad,
            fecha_memo_registro    : props.fechaMemoRegistro?moment(props.fechaMemoRegistro,"DD/MM/YYYY HH:mm").toString():'',//props.fechaPresentacionCas?moment(props.fechaPresentacionCas, "DD/MM/YYYY HH:mm").toString():'',
            tipo_comision_idp      : props.tipoComisionIDP,
            fecha_inicio_viaje     : props.fechaInicioViaje?moment(props.fechaInicioViaje,"DD/MM/YYYY HH:mm").toString():'',
            fecha_fin_viaje        : props.fechaFinViaje?moment(props.fechaFinViaje,"DD/MM/YYYY HH:mm").toString():'',
            cantidad_dias          : props.cantidadDias,
            tipo_memo_repo         : props.tipoMemoRepo,
            tipo_transporte        : props.tipoTransporte,
            observacion            : props.observacion,
            estado_memorandum      : props.estadoMemorandum,
            notificacion_memo      : props.notificacionMemo,
            dias_habiles           : props.diasHabiles,           
            usuario_id             : props.usuarioId,          
            modificacion            : props.modificacion,
            obs_modificacion        : props.obsModificacion,
            fecha_cambio            : props.fechaCambio,
            estado_modificacion     : props.estadoModificacion,
            // Datos usuario

            nombre_usuario     : usuarioNombre,
            ci                 : usuarioCI,
            cargo_usuario      : cargoUsuario,
            nume_celular       : usuarioNumCelular,
            conteo_dias_detalle: 0,
            usuario_admin       : authUser.uid,
			
        };
       
        return Result.ok(result);
    }

//impresion
public async getPDFMemorandum(authUser: AuthUser, params: string): Promise<Result<any>> {    
    const ID_USUARIO = authUser.uid;
    const id_memorandum = params;    
    
    const usuarioaCargo = await UsuarioService.getById(ID_USUARIO);
    if (usuarioaCargo.isFailure) return Result.fail(String(usuarioaCargo.error));
    const usuarioaCargoResult = usuarioaCargo.getValue().props;
    
    const memorandum = await MemorandumrrhhService.getById(id_memorandum)
    if (memorandum.isFailure) return Result.fail<MemorandumrrhhFormDataResponse>("Falló al obtener la Memorandum");
    const props = memorandum.getValue().props;

   /*Listado de usuarios*/
    const usuario = await UsuarioService.getAll();
    if(usuario.isFailure) return Result.fail("Fallo al obtener el Usuario");
    const usuarioResult = usuario.getValue();
  
    const vehiculo = await VehiculoService.getAll();
    if(vehiculo.isFailure) return Result.fail("Fallo al obtener el Vehiculo");
    const vehiculoResult = vehiculo.getValue();
    /*Listado de cargos*/
    const cargo = await CargoService.getAll();
    if(cargo.isFailure) return Result.fail("Fallo al obtener el Cargo");
    const cargoResult = cargo.getValue();
/*Listado de personal*/
    const personal =await PersonalService.getAll();
    if(personal.isFailure) return Result.fail("Fallo al obtener el Personal");
    const personalResult = personal.getValue();
    /*Listado de Detalle Destino */
    const detalleDestino = await DetalleDestinorrhhService.getAll();
    if (detalleDestino.isFailure) return Result.fail("Falló al obtener la DetalleDestino");
    const detalleDestinoResult = detalleDestino.getValue();
   
    /* listado de actividades */
    const escalaDestino = await EscalaDestinoService.getAll();
    if (escalaDestino.isFailure) return Result.fail('Falló al obtener la detalleDestino');  
    const escalaDestinoResult = escalaDestino.getValue();   
     //seleccionamos del listado de area el nombre del departamento y su sigla
     const destino = detalleDestinoResult.find((c) =>c.props.memorandumrrhhId === id_memorandum)?.props.destinoReg|| "-";//Revisar     
     const destinoNombre = escalaDestinoResult.find((c) =>c.id === destino)?escalaDestinoResult.find((c) =>c.id === destino)?.props.destino|| "-":destino;
     
  //  const placa = vehiculoResult.find((c) => c.id === props.vehiculoId)?.props.numPlaca|| "-";
    const listaDestinos: detalleDestinorrhhItem [] = detalleDestino
    .getValue()
    .map((item) => {                   
        return {
            
            id: item.id.toString(),
           
            tipo_vehiculo_op         : item.props.tipoVehiculoOP,
            objetivo_viaje           : item.props.objetivoViaje,
            destino_reg              : destinoNombre,
            fecha_dia                : item.props.fechaDia?moment(item.props.fechaDia).format("DD/MM/YYYY").toString(): '',
            hora_inicio              : item.props.horaInicio,
            hora_fin                 : item.props.horaFin,
            pernocte                 : item.props.pernocte,      
            memorandumrrhh_id        : item.props.memorandumrrhhId,
            vehiculo_id              : item.props.vehiculoId,
            estado                    : item.props.estado,
            destino_id               : item.props.destinoId,
           destino_id2               : item.props.destinoId2,
            //aumentando campos
          // num_placa : placa,    
        };
    }) ; 
   
// Se filta por los destinos por id memorandum
const filtroDestinos1 : detalleDestinorrhhItem [] = listaDestinos
.filter((item) => this.filtrarId(item.memorandumrrhh_id, id_memorandum));

// se filtran auqellos que no tienen SIN_VIAJE en el estado
const filtroDestinos : detalleDestinorrhhItem [] = filtroDestinos1
.filter((item) => this.filtrarEstadoDestino(item.estado, 'SIN_VIAJE'));

//ordenando por fechas
filtroDestinos.sort((a, b) => a.fecha_dia > b.fecha_dia ? 1 : -1)

const  conteoDiasDetalle = filtroDestinos.length;

    const area = await AreaService.getAll();
    if (area.isFailure) return Result.fail("Falló al obtener la Memorandum");
    const areaResult = area.getValue();

    //seleccionamos del listado de area el nombre del departamento y su sigla
       const usuarioNombre = usuarioResult.find((c) => c.id === props.usuarioId)?.props.fullname|| "-";//Revisar
    const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === props.usuarioId)?.props.cargoId|| "-";
    const cargoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.nombre|| "-";
    const contratoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.item|| "-";
    const usuarioCI = usuarioResult.find((c) => c.id === props.usuarioId)?.props.ci|| "-";
    const usuarioNumCelular = usuarioResult.find((c) => c.id === props.usuarioId)?.props.celular|| "-";
    const usuarioAreaID = personalResult.find((c) => c.props.usuarioId === props.usuarioId)?.props.areaId|| "-";
    const usuarioSigla = areaResult.find((c)=> c.id === usuarioAreaID)?.props.sigla|| "-";
  
    //llenasmo lista gestion de fechas
    const listaFechaPernocte: MemorandumProcesoFechas [] = [];
    for (let i = 0; i < filtroDestinos.length; i++) {
         listaFechaPernocte.push({fecha_dia: filtroDestinos[i].fecha_dia,pernocte: filtroDestinos[i].pernocte});
    }   
    //ordenamos fechas
    const listaFechaOrdenada = this.ordenarFechas(listaFechaPernocte);
    //generamos la lista a mostrara en reporte
    const listaFechaPernocteLlena = this.generarFechasMemorandum(listaFechaOrdenada);
    let count = 0;
    //recupera datos para mostrar en la tabla del modulo
    const fechaMemoRegistro = this.formatearFechaEncabezado(props.fechaMemoRegistro?moment(props.fechaMemoRegistro).format("DD/MM/YYYY").toString(): '');

     //datos jefe
     const jefesObject = props.autorizadoPor || [];				
     const listaJefes: any[] = [];
      //sacar el nombre completo del jefe y unirlo al id
     jefesObject.forEach((e: any) => {
         const jefe = usuarioResult.find((r) => r.id === e);
         const cargoJefe = personalResult.find((c)=> c.props.usuarioId === e)?.props.cargoId|| "-";
        
         if (jefe && props.estadoMemorandum === ENUM_APROBADO_SECRETARIO ||jefe && props.estadoMemorandum === ENUM_VERIFICADO_RRHH||jefe && props.estadoMemorandum === ENUM_APROBADO_CONTABILIDAD) {          
             const cargoNombreJefe = cargoResult.find((r)=> r.id === cargoJefe)?.props.nombre|| "-";
             const palabras = cargoNombreJefe.trim().split(' ');
             const primeraPalabra = palabras[0].replace(/\(.*?\)/g, '').toLocaleUpperCase();                
             const concatenaAprove = "APROBADO_".concat(primeraPalabra);
             const propsJefe = {
                 id      : jefe.id,
                 fullname     : jefe.props.fullname,              
                 cargo    : cargoNombreJefe,  
                 aprobado : concatenaAprove.concat("/").concat(jefe.props.fullname),           
             };
             listaJefes.push(propsJefe);
             
         }else {             
             const propsJefe = {             
                 aprobado : ENUM_PENDIENTE_DE_APROBAR,
             };
             listaJefes.push(propsJefe);
		
         }
     });

     //aprobado por RRHH
     let verificadoRRHH;
     if(props.estadoMemorandum === ENUM_VERIFICADO_RRHH){
        verificadoRRHH = ENUM_VERIFICADO_RRHH;		
     }else{
        verificadoRRHH = ENUM_PENDIENTE_RRHH;		
     }
     
    const result: MemorandumrrhhData = {
        info: {
           
            usuario_nombre         : usuarioNombre,
            usuario_cargo          : cargoUsuario,
            ci                     : usuarioCI ,
            nume_celular           : usuarioNumCelular, 
           // num_placa              : placaVehiculo,
            cod_depart_memo        : props.codDepartMemo,
            tipo_memorandum        : props.tipoMemorandum,         
            autorizado_por         : listaJefes,
            cargo_jefe_unidad      : "",
            fecha_memo_registro    : fechaMemoRegistro,
            tipo_comision_idp      : props.tipoComisionIDP,
            fecha_inicio_viaje     : props.fechaInicioViaje?moment(props.fechaInicioViaje).format("DD/MM/YYYY").toString(): '',
            fecha_fin_viaje        : props.fechaFinViaje?moment(props.fechaFinViaje).format("DD/MM/YYYY").toString(): '',
            cantidad_dias          : props.cantidadDias,
            tipo_memo_repo         : props.tipoMemoRepo,
            tipo_transporte        : props.tipoTransporte,
            observacion            : props.observacion,
            estado_memorandum      : props.estadoMemorandum,
            notificacion_memo      : props.notificacionMemo,
          //  ffyOrg                 : ffyOrg,
          //  sisin                  : sisin,
            contrato : String(contratoUsuario),
            conteo_dias_detalle    : conteoDiasDetalle,
            usuario_a_cargo        :usuarioaCargoResult.fullname,
            usuario_sigla          : usuarioSigla,
            aprobado_rrhh          : verificadoRRHH,
         
            codigoQR    : `
            ${id_memorandum}-  
            ${props.codDepartMemo}-       
            ${props.autorizadoPor}-        
            ${props.fechaMemoRegistro}-   
            ${props.tipoComisionIDP}-     
            ${props.fechaInicioViaje}-    
            ${props.fechaFinViaje}-       
            ${props.cantidadDias}-                  
            ${props.tipoTransporte}-      
            ${props.observacion}-         
            ${props.estadoMemorandum}-    
            ${props.tipoMemorandum}-            
            ${props.usuarioId}`,
           // email     : usuarioResult.email,
           
        },
        data: {
              
                rows:   filtroDestinos.map((item)=> {                          
                           
                        const tipoVehiculo = vehiculoResult.find((c) => c.id === item.vehiculo_id)?.props.tipo|| "-";
                        const placaVehiculo = vehiculoResult.find((c) => c.id === item.vehiculo_id)?.props.numPlaca|| "-";
                        const marcaVehiculo = vehiculoResult.find((c) => c.id === item.vehiculo_id)?.props.marca|| "-";
                        const vehiculoOP = item.tipo_vehiculo_op === 'OFICIAL'? 'OFICIAL'.concat(' - ').concat(placaVehiculo).concat(' - ' ).concat(tipoVehiculo).concat(' - ').concat(marcaVehiculo): item.tipo_vehiculo_op;
                        const fechaDiaInicio = listaFechaPernocteLlena[count].fecha_inicio;					
                        const fechaDiafin = listaFechaPernocteLlena[count].fecha_fin;						
                        const observacion = listaFechaPernocteLlena[count].observacion;
                        const destinoFecha = detalleDestinoResult.find((c) => c.props.memorandumrrhhId === id_memorandum && moment(c.props.fechaDia).format("DD/MM/YYYY").toString() === item.fecha_dia)?.props.destinoReg||"-";

                        count ++;
                          
                            return {
                                id                       : String(item.id),
                                tipo_vehiculo_op         : vehiculoOP,//item.tipo_vehiculo_op,
                                objetivo_viaje           : item.objetivo_viaje,
                                destino_reg              : destinoFecha,//item.destino_reg,
                                fecha_dia                : item.fecha_dia,//?moment(item.fecha_dia).format("DD/MM/YYYY").toString(): '',
                                hora_inicio              : item.hora_inicio,
                                hora_fin                 : item.hora_fin,
                                pernocte                 : item.pernocte,                           
                                 estado                  : item.estado,
                                memorandumrrhh_id            : item.memorandumrrhh_id,
                              //  viatico_id               : item.viatico_id,
                                vehiculo_id              : placaVehiculo,
                                destino_id               : item.destino_id,
                                destino_id2              : item.destino_id2,

                                fecha_inicio             :fechaDiaInicio,
                                fecha_fin                : fechaDiafin,
                                observacion              : observacion,
                                num_placa                : tipoVehiculo,  
                              
                           }
                           
                   
                }),
        },        
  } 
 
    return Result.ok(result);

}



//impresion reporte general
public async getMemorandumrrhhReport(authUser: AuthUser, queryString: any, id?:string, listaIds? : string[], fechaInicio?: string, fechaFin?: string, tipoFecha?: number, id_memorandumrrhh?:string): Promise<Result<MemorandumrrhhDataResponse>> {
   
    const resultObject = queryStringToArray(queryString);    
    const result = {
        info: await this.getInfoMemorandumrrhhData(authUser, resultObject, id_memorandumrrhh!),
        data: await this.getMemorandumrrhhData(resultObject, id, listaIds, fechaInicio!, fechaFin!, tipoFecha!)
    };

    return Result.ok(result);
	
}  

private async getInfoMemorandumrrhhData(authUser: AuthUser, queryString: ReportFilters, id_memorandumrrhh?: string): Promise<InfoMemorandumrrhhModel | undefined> {

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

        // INICIO QR
        /* const memorandumrrhh = await MemorandumrrhhService.getById(id_memorandumrrhh!)
         if (memorandumrrhh.isFailure)  Result.fail<MemorandumrrhhDataResponse>("Falló al obtener la Memorandum rrhh");
         const props = memorandumrrhh.getValue().props;
          const tipoMemoQR = "Tipo Memorandum ".concat(String(props.tipoMemorandum));     
          const fechaQR = "Fecha Registro: ".concat(String(props.fechaMemoRegistro.getTime()));      
          const idUsuarioQr = "Id de Usuario: ".concat(String(props.usuarioId));
          const citeQr = "Codigo cite: ".concat(String(props.codDepartMemo)); 
          const estadoQr = "Estado: ".concat(String(props.estadoMemorandum));
          const idMemoQr = "ID memorandumrrhh: ".concat(String(id_memorandumrrhh));*/
        //FIN QR
        return {
            codigo    : codigo,
            nombre    : NOMBRE_USUARIO,
            fecha     : FECHA_REGISTRO,
            email     : EMAIL_USUARIO,
           /* codigoQR  : `${tipoMemoQR}-               
            ${idUsuarioQr}-   
            ${fechaQR}- 
            ${citeQr}-                     
            ${estadoQr}-
            ${idMemoQr}-`,*/
        }
}

private async getMemorandumrrhhData(queryString: ReportFilters, id?:string, listaIds?:string[], fechaInicio?: string, fechaFin?: string, tipoFecha?: number): Promise<MemorandumrrhhDataR | undefined> {
	
    const inputObj: any = queryString;	
    const tipo = inputObj.tipo_reporte || null;	

    const hoy = new Date();
    const gestion = hoy.getFullYear().toString();
    const memorandumrrhh = await MemorandumrrhhService.getAll();
    if (memorandumrrhh.isFailure) return undefined;
    const memorandumrrhhResult = memorandumrrhh.getValue();

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
    //cargo
     const cargo = await CargoService.getAll();
     if (cargo.isFailure) return undefined;
     const cargoResult = cargo.getValue();
    //destino
    const detalleDestino = await DetalleDestinorrhhService.getAll();
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
            return {                
                id: item.id.toString(),
                nombre: item.props.nombre,
               // partida_presupuestaria : item.props.partidaPresupuestaria,
                sigla: item.props.sigla,                                             
            };            
         }) ;  
     
     //FINAL FILTRADO DE AREA  
           
    const memorandumrrhhesR: MemorandumrrhhItem[] = memorandumrrhhResult.map((item) => {
        const MEMORANDUM_ID = item.id;
        const usuarioID = memorandumrrhhResult.find((c) => c.id === MEMORANDUM_ID)?.props.usuarioId||"-"; 
        const tipoMemoRepo = memorandumrrhhResult.find((c) => c.id === MEMORANDUM_ID)?.props.tipoMemoRepo||"-";    
   
        const areaId = personalResult.find((c) => c.props.usuarioId === usuarioID)?.props.areaId||"-";  
        const area = areaResult.find((c) => c.id === areaId)?.props.nombre||"-"; 
        const siglaUsuario = areaResult.find((c)=> c.id === areaId)?.props.sigla||"-"; 

        /*seleccionamos del listado de area el nombre del departamento y su sigla*/
        const usuarioNombre = usuarioResult.find((c) => c.id === usuarioID)?.props.fullname|| "-";//Revisar
        const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === usuarioID)?.props.cargoId|| "-";
        const cargoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.nombre|| "-";
   
        const ciUsuario = usuarioResult.find((c) => c.id === usuarioID)?.props.ci|| "-";
        const fechaIda = memorandumrrhhResult.find((c) => c.id === MEMORANDUM_ID)?.props.fechaInicioViaje||"-"; 
        const fechaRetorno = memorandumrrhhResult.find((c) => c.id === MEMORANDUM_ID)?.props.fechaFinViaje||"-";          
        const codigoMemo = memorandumrrhhResult.find((c) => c.id === MEMORANDUM_ID)?.props.codDepartMemo||"-"; 
        const cantidadDias = memorandumrrhhResult.find((c) => c.id === MEMORANDUM_ID)?.props.cantidadDias||"-"; 
        const destino = detalleDestinoResult.find((c) => c.props.memorandumrrhhId === MEMORANDUM_ID)?.props.destinoReg||"-"; 
  
        const usuarioCI = usuarioResult.find((c) => c.id ===usuarioID)?.props.ci|| "-";
        const usuarioNumCelular = usuarioResult.find((c) => c.id === usuarioID)?.props.celular|| "-";
        const cargoUsuarioId = personalResult.find((a)=>a.props.usuarioId === usuarioID)?.props.cargoId ||"";
        const tipoUsuario = cargoResult.find((a)=> a.id === cargoUsuarioId)?.props.tipo ||"";
        //Lista de destinos
        const listaDestinos: DetalleDestinorrhhOptionsFormModel[] = detalleDestino
        .getValue()
        .map((item) => {                
                return {                
                    id: item.id.toString(),
                    nombre: item.props.memorandumrrhhId,
                    caption : item.props.destinoReg,
                    estado: item.props.estado,                                             
                };            
        }) ;         
    
        // Se filta por los destinos
        const filtroDestinos : DetalleDestinorrhhOptionsFormModel [] = listaDestinos
        .filter((value) => this.filtrarId(value.nombre, MEMORANDUM_ID)); //item.props.memorandumId!

        // Se filta por los destinos
        const filtroAprobados : DetalleDestinorrhhOptionsFormModel [] = filtroDestinos        
        .filter((value) => this.filtrarId(value.estado!,'APROBADO')); 

        const conteoDiasDetalle = filtroAprobados.length;

            // filtramos por el tipo de nombre
            const elementosUnicos = new Map(filtroDestinos.map(value => [value.caption, value]));
            let destinoNombre = '';
            if(elementosUnicos.size > 1){
            //recorrer 
                elementosUnicos.forEach((value, key) => {
                    if(escalaDestinoResult.find((c) => c.id === value.caption)){
                        destinoNombre = destinoNombre.concat( escalaDestinoResult.find((c) => c.id === value.caption)?.props.destino|| "-").concat(' - ');
                    }else {
                        destinoNombre = destinoNombre.concat(destino).concat(' - ');
                    }              
            });          
            }else{
                destinoNombre = (escalaDestinoResult.find((c) => c.id === destino))?
                escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-":destino;            
            }         
                        
           //Filtro de Areas por proyecto
           listaAreasEncontradas.push(areaId); // verificar si se deben ingresar todas las areas
         
           // fin filtrado areas por proyecto

          
        return {
            id: String(item.id),
            gestion: gestion,
            tipo   : tipo,            
            usuario_nombre                  : usuarioNombre,
            usuario_cargo                   : cargoUsuario,            
            usuario_ci                      : ciUsuario,        
            fecha_ida                       : fechaIda?moment(fechaIda).format("DD/MM/YYYY").toString(): '',
            fecha_retorno                   : fechaRetorno?moment(fechaRetorno).format("DD/MM/YYYY").toString(): '',
            destino                         : destinoNombre,
            cod_memo                        : codigoMemo,
            cantidad_dias                   : !Number.isNaN(cantidadDias)?cantidadDias:"-",
            tipo_memo_repo                  : tipoMemoRepo,          
            area                            : area,
            sigla                           : siglaUsuario,
            cod_depart_memo                 : item.props.codDepartMemo,
            tipo_memorandum                 : item.props.tipoMemorandum,
            autorizado_por                  : item.props.autorizadoPor,           
            fecha_memo_registro             : item.props.fechaMemoRegistro,
            //fecha_memo_format               : item.props.,
            tipo_comision_idp               : item.props.tipoComisionIDP,
            fecha_inicio_viaje              : item.props.fechaInicioViaje?moment(item.props.fechaInicioViaje).format("DD/MM/YYYY").toString(): '',//Date
            fecha_fin_viaje                 : item.props.fechaFinViaje?moment(item.props.fechaFinViaje).format("DD/MM/YYYY").toString(): '', //Date          
            dias_habiles                    : item.props.diasHabiles,
            tipo_transporte                 : item.props.tipoTransporte,
            observacion                     : item.props.observacion,
            estado_memorandum               : item.props.estadoMemorandum,
            notificacion_memo               : item.props.notificacionMemo,

            nombre_usuario                  : usuarioNombre,
            ci                              : usuarioCI,
            cargo_usuario                   : cargoUsuario,
            nume_celular                    : usuarioNumCelular,
            conteo_dias_detalle             : 0,
            tipo_usuario                    : tipoUsuario,

            area_solicitante                 : area,
            area_id                         : areaId,
         //   usuario_admin       : authUser.uid,


            tipo_comision                 : item.props.tipoComisionIDP,
          
        };
    }).sort((a, b) =>a.fecha_inicio_viaje > b.fecha_inicio_viaje ? 1 : -1);
     
        //FILTRADO POR PROYECTO
        
        for(let i = 0 ; i < listaAreasEncontradas.length ; i++){
            const filtroAreas =  listaAreas 			
            .filter((value) => this.filtrarId(value.id,listaAreasEncontradas[i]));             
            if(filtroAreas.length >0 && filtroAreas != undefined){ 
                listaFiltradaAreas.push(filtroAreas[0])			
            }
        }           
       const listaFiltradaProyecto : AreaFormModel [] = [...new Set(listaFiltradaAreas)];       
        // FIN FILTRADO POR PROYECTO 
       
       //FILTRADO POR BENEFICIARIO
       let filtroGeneral : MemorandumrrhhItem [] = [];
       let filtroFecha : string[] = [] ;
       let filtroSinRepetidosBen: MemorandumrrhhItem [] = [];

       if(tipo === "REPORTE_POR_BENEFICIARIO"){      
              
                listaIds!.forEach((idG, key) => {        
                    const resultadoFiltro = memorandumrrhhesR.filter((value) => this.filtrarId(value.id, idG));           
                    filtroGeneral = [...filtroGeneral, ...resultadoFiltro];  // Acumulamos los resultados
                    filtroFecha = this.getfechafirstLast(filtroGeneral);                    
					
                }); 
                     filtroSinRepetidosBen = filtroGeneral.filter((valor, index, self) => {				
                        return self.findIndex((item) => item.ci === valor.ci) === index;
                    });
                   
         }else if(listaIds != undefined){
      //FILTRO GENERAL        
            
                listaIds!.forEach((idG, key) => {        
                    const resultadoFiltro = memorandumrrhhesR.filter((value) => this.filtrarId(value.id, idG));           
                    filtroGeneral = [...filtroGeneral, ...resultadoFiltro];  // Acumulamos los resultados					
                    filtroFecha = this.getfechafirstLast(filtroGeneral);                    
					
                });

       //FIN FILTRO GENERAL
      }         
       

    //  const fechaInicioFiltro = filtroFecha[0];
    //  const fechafinFiltro = filtroFecha[filtroFecha.length-1];
   
        //const response = findAndCountResult(filtroGeneral);

        const result1: MemorandumrrhhDataR = {
            tipo_reporte: tipo,
            rows: filtroGeneral,
            lista_areas: listaFiltradaProyecto,
          //  lista_ffof : listaSinRepetidos,	
            idBeneficiario : filtroSinRepetidosBen,//response.rows,//listaIdBeneficiario,
            fecha_inicio_filtro : fechaInicio?moment(fechaInicio).format("DD/MM/YYYY").toString(): '', 			
            fecha_fin_filtro : fechaFin?moment(fechaFin).format("DD/MM/YYYY").toString(): '', 
			
        };
        
        return result1;
	
}

// Identificar la primera y ultima de las fechas dentro del filtro
public  getfechafirstLast (listaGeneral : MemorandumrrhhItem[]):string[]{	
    const filtroFechas : string []= [];
    const filtroFechasFirstLast : string []= [];
            
    listaGeneral.forEach((value,key)=>{
         filtroFechas.push(value.fecha_inicio_viaje!)
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


//Se agrega memorandum detalle
public async getTableMemorandumDetalle(authUser: AuthUser, query: any, memorandumrrhh_id: string): Promise<Result<{ rows: DetalleDestinorrhhTableModel[] }>> {
    const ID_USUARIO = authUser.uid;
    const usuario = await UsuarioService.getById(ID_USUARIO);
    if (usuario.isFailure) throw new Error(String(usuario.error));

    const usuarios = await UsuarioService.getAll(); 
    if (usuarios.isFailure) Result.fail(String(usuarios.error));
   // const usuarioResult = usuarios.getValue();
    
    /* listado de actividades */
    const detalleDestino = await DetalleDestinorrhhService.getAll();
    if (detalleDestino.isFailure) return Result.fail('Falló al obtener la detalleDestino');        
    const detalledestinoResult = detalleDestino.getValue().filter((a) => a.props.memorandumrrhhId === memorandumrrhh_id);
   
    /* listado general de la tabla actividades ordenados */
    const result: DetalleDestinorrhhTableModel[] = detalledestinoResult.sort((a, b) => a.props.horaInicio > b.props.horaFin ? 1 : -1).map((item)=> {
              
        return {
            id                       : String(item.id),          
            tipo_vehiculo_op         : item.props.tipoVehiculoOP,
            objetivo_viaje           : item.props.objetivoViaje,
            destino_reg              : item.props.destinoReg,
            fecha_dia                : item.props.fechaDia,
            hora_inicio              : item.props.horaInicio,
            hora_fin                 : item.props.horaFin,
            pernocte                 : item.props.pernocte,
            memorandumrrhh_id        : item.props.memorandumrrhhId,
         
            vehiculo_id              : item.props.vehiculoId,
            destino_id               :item.props.destinoId,          
        };
    });

    
    const response = findAndCountResult(result, query);
    return Result.ok(response);
}
//Se envia el tipo de PCP seleccionando en memorandum
public async getTipoPCP(id_memorandum: string): Promise<Result<MemorandumTipoPCPOptionsFormModel>> {
    const memorandum = await MemorandumrrhhService.getById(id_memorandum);
    if (memorandum.isFailure) return Result.fail<MemorandumTipoPCPOptionsFormModel>("Memorandum no encontrado");

    const props = memorandum.getValue().props;
    const tipoPCP = props.tipoComisionIDP;
    const result: MemorandumTipoPCPOptionsFormModel = {
        id                     : memorandum.getValue().id,    
        nombre                 : tipoPCP,  
        caption                : tipoPCP,   
    };    
    return Result.ok(result);
}


//Se envia el tipo de PCP seleccionando en memorandum
public async getControlCountDias(id_memorandum: string): Promise<Result<ConteoDestinoPCPOptionsFormModel>> {
    //Seleccionamos memorandum y sacamos la cantidad de dias
    const memorandum = await MemorandumrrhhService.getById(id_memorandum);
    if (memorandum.isFailure) return Result.fail<ConteoDestinoPCPOptionsFormModel>("Memorandum no encontrado");
    const memorandumrrhhResult = memorandum.getValue();   
 /*Listado de Detalle destino*/
    const detalleDestino =await DetalleDestinorrhhService.getAll();
    if(detalleDestino.isFailure) return Result.fail("Fallo al obtener los detalles destinos");
    //Cantidad de dias del memo
    const cantidadDiasMemo:number = await MemorandumrrhhService.contarDiasHabilesRango(memorandumrrhhResult.props.fechaInicioViaje,memorandumrrhhResult.props.fechaFinViaje); 
     //Lista de destinos
     const listaDestinos: DetalleDestinorrhhOptionsFormModel[] = detalleDestino
        .getValue()
        .map((item) => {                
                return {                
                    id: item.id.toString(),
                    nombre: item.props.memorandumrrhhId,
                    caption : item.props.destinoReg,                                             
                };            
        }) ; 
    // Se filta por los destinos
    const filtroDestinos : DetalleDestinorrhhOptionsFormModel [] = listaDestinos
    .filter((item) => this.filtrarId(item.nombre, id_memorandum));
    const result: ConteoDestinoPCPOptionsFormModel = {
        id                     : memorandum.getValue().id,    
        nombre                 : filtroDestinos.length == cantidadDiasMemo?true:false,  //cantida de dias 
        caption                : cantidadDiasMemo,   
    };       
    return Result.ok<any>(result);
   // return Result.ok(result);
}

  //filtramos por el tipo de id 
  public filtrarId(item:string, id:string) { 
    return (item === id); 
 } 

 public filtrarEstadoDestino(item:string, estado:string) { 
    return (item != estado); 
 } 

 //Formateat Fecha encabezado Reportes
 public formatearFechaEncabezado(fecha: string) {
    const meses = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
      ];
    
      // Dividir la fecha original en partes: día, mes, año
      const partes = fecha.split('/');
    
      // Convertir el día, mes y año
      const dia = parseInt(partes[0], 10); // Eliminar el cero a la izquierda si lo hay
      const mes = meses[parseInt(partes[1], 10) - 1]; // Convertir el mes de número a nombre
      const año = partes[2];
    
      // Retornar el formato deseado: "2 de febrero de 2024"
      return `${dia} de ${mes} del ${año}`;    
 }

 

 //Ordenar Fechas Para Reportes
 public ordenarFechas(listaPernocte: MemorandumProcesoFechas[]) {

    const fechas: MemorandumProcesoFechasDate[] =[];
    // Paso 1: Convertir las cadenas de fecha a objetos Date y a 'YYYY-MM-DD'
    for(let i = 0; i < listaPernocte.length; i++){
        const [dia, mes, año] = listaPernocte[i].fecha_dia.split('/').map(Number);
        fechas.push({fecha_dia:new Date(año, mes - 1, dia),pernocte: listaPernocte[i].pernocte});
    }
    // Paso 2: Ordenar las fechas en orden ascendente (de la más antigua a la más nueva)
    fechas.sort((a, b) => a.fecha_dia > b.fecha_dia ? 1 : -1);	

    // Paso 3: Convertir las fechas ordenadas de nuevo a cadenas en formato 'DD/MM/YYYY'
    const fechasOrdenadas: MemorandumProcesoFechas[] = [];
    // Generamos los dias en literal
    const diasSemana = [
        'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
      ];
    for(let i = 0; i < fechas.length; i++){
        const dia = String(fechas[i].fecha_dia.getDate()).padStart(2, '0');		
        const mes = String(fechas[i].fecha_dia.getMonth() + 1).padStart(2, '0');		
        const año = fechas[i].fecha_dia.getFullYear();        
		// Obtenemos el día de la semana (0-6)
        const diaSemana = diasSemana[fechas[i].fecha_dia.getDay()];

        fechasOrdenadas.push({fecha_dia:`${diaSemana} ${dia}/${mes}/${año}`,pernocte: listaPernocte[i].pernocte});
    }   

    return fechasOrdenadas;

 }



 //Realizacion de lista de fechas para Reportes
 public generarFechasMemorandum(listaPernocte:MemorandumProcesoFechas[]) {
  
    const result: MemorandumTablaReporte[] = [];      
    //generamos las fechas
    for(let i = 0; i <listaPernocte.length; i++) {
		
		
        if(listaPernocte[i].pernocte === 'SIN PERNOCTE'&& listaPernocte[i+1] != undefined){
            const observacion = listaPernocte[i].fecha_dia.concat(' : ').concat(listaPernocte[i].pernocte).concat(',');			
            result.push({fecha_inicio:listaPernocte[i].fecha_dia,fecha_fin:listaPernocte[i].fecha_dia,pernocte:listaPernocte[i].pernocte,observacion:observacion});
        }else if(listaPernocte[i].pernocte === 'SIN PERNOCTE'&& listaPernocte[i+1] === undefined){// listaPernocte.length > 1 &&  i === listaPernocte.length -1){
            
            if(listaPernocte[i-1] === undefined ){				
                const observacion = listaPernocte[i].fecha_dia.concat(' : ').concat(listaPernocte[i].pernocte).concat(',');
                result.push({ fecha_inicio: listaPernocte[i].fecha_dia, fecha_fin: listaPernocte[i].fecha_dia, pernocte: listaPernocte[i].pernocte, observacion: observacion });
           }else{
                if (listaPernocte[i - 1].pernocte === 'CON PERNOCTE') {
                    const observacion = listaPernocte[i].fecha_dia.concat(' : ').concat(listaPernocte[i].pernocte).concat(',');
                    result.push({ fecha_inicio: '', fecha_fin: listaPernocte[i].fecha_dia, pernocte: listaPernocte[i].pernocte, observacion: observacion });
                }
                else if (listaPernocte[i - 1].pernocte === 'SIN PERNOCTE') {
                    const observacion = listaPernocte[i].fecha_dia.concat(' : ').concat(listaPernocte[i].pernocte).concat(',');
                    result.push({ fecha_inicio: listaPernocte[i].fecha_dia, fecha_fin: listaPernocte[i].fecha_dia, pernocte: listaPernocte[i].pernocte, observacion: observacion });
                }
           }                     
        }
        else{
           if(i === 0){
            const observacion = listaPernocte[i].fecha_dia.concat(' : ').concat(listaPernocte[i].pernocte).concat(',');
            result.push({fecha_inicio:listaPernocte[i].fecha_dia,fecha_fin:'',pernocte:listaPernocte[i].pernocte,observacion:observacion});
           }else {
            const observacion = listaPernocte[i].fecha_dia.concat(' : ').concat(listaPernocte[i].pernocte).concat(',');
            result.push({fecha_inicio:'',fecha_fin:'',pernocte:listaPernocte[i].pernocte,observacion:observacion});
           }  
           
        }

    }    

    return result; 
	
	
 } 

 //Se envia datos requeridos del memorandum
 public async getDatosMemorandum(id_memorandum: string): Promise<Result<MemorandumrrhhModelDetalle>> {
    const memorandum = await MemorandumrrhhService.getById(id_memorandum);
    if (memorandum.isFailure) return Result.fail<MemorandumrrhhFormDataResponse>("Memorandum no encontrado");    
    const props = memorandum.getValue().props;          
     //seleccionamos del listado de area el nombre del departamento y su sigla
     /*Listado de usuarios*/
     const usuario = await UsuarioService.getAll();
     if(usuario.isFailure) return Result.fail("Fallo al obtener el Usuario");
     const usuarioResult = usuario.getValue();
     /*Listado de cargos*/
     const cargo = await CargoService.getAll();
     if(cargo.isFailure) return Result.fail("Fallo al obtener el Cargo");
     const cargoResult = cargo.getValue();
     /*Listado de personal*/
     const personal =await PersonalService.getAll();
     if(personal.isFailure) return Result.fail("Fallo al obtener el Personal");
     const personalResult = personal.getValue();
    
    //seleccionamos del listado de area el nombre del departamento y su sigla
    const usuarioNombre = usuarioResult.find((c) => c.id === props.usuarioId)?.props.fullname|| "-";//Revisar
    const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === props.usuarioId)?.props.cargoId|| "-";
    const cargoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.nombre|| "-";
    const usuarioCI = usuarioResult.find((c) => c.id === props.usuarioId)?.props.ci|| "-";
   
      
     const result: MemorandumrrhhModelDetalle = {
        id                     : id_memorandum,  
        nombre_usuario         : usuarioNombre,
        ci                     : usuarioCI,
        cargo_usuario          : cargoUsuario,
        tipo_comision_idp      : props.tipoComisionIDP,
        fecha_inicio_viaje     : props.fechaInicioViaje?moment(props.fechaInicioViaje).format("DD/MM/YYYY").toString(): '',
        fecha_fin_viaje        : props.fechaFinViaje?moment(props.fechaFinViaje).format("DD/MM/YYYY").toString(): '',
        cantidad_dias          : Number(props.cantidadDias),
    };    
    return Result.ok(result);
}

public async getDiaHabil(id_memorandum: string): Promise<Result<MemorandumTipoPCPOptionsFormModel>> {
    const memorandum = await MemorandumrrhhService.getById(id_memorandum);
    if (memorandum.isFailure) return Result.fail<MemorandumTipoPCPOptionsFormModel>("Memorandum no encontrado");

    const props = memorandum.getValue().props;
    const diaHabil = props.diasHabiles;
    const result: MemorandumTipoPCPOptionsFormModel = {
        id                     : memorandum.getValue().id,    
        nombre                 : diaHabil,  
        caption                : diaHabil,   
    };    
    return Result.ok(result);
}


public async getAllCites(): Promise<Result<{ rows: MemorandumCite[]; count: number }>> {
    /*Listado de areas*/
    const memorandum = await MemorandumrrhhService.getAll();
    if(memorandum.isFailure) return Result.fail("Fallo al obtener el memorandum");
    const memorandumrrhhResult = memorandum.getValue();
     
    /* listado general de la tabla area ordenados */
    const result: MemorandumCite[] = await Promise.all(
        memorandumrrhhResult.map(async (item) => {                 
        const numeroCite = this.extraerNumero(item.props.codDepartMemo);     
     
        return {
          id        : item.id.toString(),
          nombre    : item.props.codDepartMemo,
          caption   : numeroCite ,
        };
      })
    );
    result.sort((a, b) => a.nombre > b.nombre ? 1 : -1);  
  return Result.ok({ rows: result, count: result.length });
} 

public extraerNumero(texto: string): number {
    const match = texto.match(/Nº\s+0*(\d+)\//);
    return match ? parseInt(match[1], 10) : -1; // Usa -1 si no se encuentra número
  }
  

public async getFechaFiltro(fechaInicio: string, fechaFin: string, query:any): Promise<Result<{ rows: MemorandumrrhhTableModel[]  }>> {
				
    const memorandumrrhh = await MemorandumrrhhService.getAll();
    if (memorandumrrhh.isFailure) return Result.fail("Falló al obtener la Memorandumrrhh");
    const memorandumrrhhResult = memorandumrrhh.getValue();

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
     
    const detalleDestino = await DetalleDestinorrhhService.getAll();
     if (detalleDestino.isFailure) return Result.fail("Falló al obtener la Detalle destino");
     const detalleDestinoResult = detalleDestino.getValue();

      /*Listado de escala Destino*/
    const escalaDestino =await EscalaDestinoService.getAll();
    if(escalaDestino.isFailure) return Result.fail("Fallo al obtener el Escala Destino");
    const escalaDestinoResult = escalaDestino.getValue();
     /*Listado de apertura*/
     const area =await AreaService.getAll();
     if(area.isFailure) return Result.fail("Fallo al obtener el area");
     const areaResult = area.getValue();

                   
    const result: MemorandumrrhhTableModel[] = memorandumrrhhResult.map((item) => {
     const memorandumID = item.id;
     const usuarioID = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.usuarioId||"-"; 
    const tipoMemoRepo = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.tipoMemoRepo||"-";    
   
    const areaId = personalResult.find((c) => c.props.usuarioId === usuarioID)?.props.areaId||"-";  
    const area = areaResult.find((c) => c.id === areaId)?.props.nombre||"-"; 
    const siglaUsuario = areaResult.find((c)=> c.id === areaId)?.props.sigla||"-"; 

    /*seleccionamos del listado de area el nombre del departamento y su sigla*/
    const usuarioNombre = usuarioResult.find((c) => c.id === usuarioID)?.props.fullname|| "-";//Revisar
    const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === usuarioID)?.props.cargoId|| "-";
    const cargoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.nombre|| "-";
   
    const ciUsuario = usuarioResult.find((c) => c.id === usuarioID)?.props.ci|| "-";
    const fechaIda = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.fechaInicioViaje||"-"; 
    const fechaRetorno = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.fechaFinViaje||"-";          
    const codigoMemo = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.codDepartMemo||"-"; 
    const cantidadDias = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.cantidadDias||"-"; 
    const destino = detalleDestinoResult.find((c) => c.props.memorandumrrhhId === memorandumID)?.props.destinoReg||"-"; 
  
    const usuarioCI = usuarioResult.find((c) => c.id ===usuarioID)?.props.ci|| "-";
   const usuarioNumCelular = usuarioResult.find((c) => c.id === usuarioID)?.props.celular|| "-";
   const contratoUsuario =  cargoResult.find((c) => c.id === cargoUsuarioid)?.props.item|| "-";
    

    //datos jefe
                const jefesObject = item.props.autorizadoPor || [];				
                const listaJefes: any[] = [];
                 //sacar el nombre completo del jefe y unirlo al id
                jefesObject.forEach((e: any) => {
                    const jefe = usuarioResult.find((r) => r.id === e);
                    const cargoJefe = personalResult.find((c)=> c.props.usuarioId === e)?.props.cargoId|| "-";
                    if (jefe) {
                        const cargoNombreJefe = cargoResult.find((r)=> r.id === cargoJefe)?.props.nombre|| "-";
                        const propsJefe = {
                            id      : jefe.id,
                            fullname     : jefe.props.fullname,              
                            cargo    : cargoNombreJefe,             
                        };
                        listaJefes.push(propsJefe);
                    }
                });
               // sacar el cargo del personal del jefe
               const listaSelectJefes: SelectOption  [] = [];               
                listaJefes.forEach((e:any)=>{                    
                     const cargoIDJefe = personalResult.find((c)=> c.props.usuarioId ===e.id)?.props.cargoId|| "-";                    
                     const cargoNombreJefe = cargoResult.find((r)=> r.id === cargoIDJefe)?.props.nombre|| "-";                 
                     const palabras = cargoNombreJefe.trim().split(' ');
                     const primeraPalabra = palabras[0].replace(/\(.*?\)/g, '').toLocaleUpperCase();                
                     const concatenaAprove = "APROBADO_".concat(primeraPalabra);
                     listaSelectJefes.push({ value: concatenaAprove, label: concatenaAprove})      
                });
   
        //Lista de destinos
        const listaDestinos: DetalleDestinorrhhOptionsFormModel[] = detalleDestino
        .getValue()
        .map((item) => {                
                return {                
                    id: item.id.toString(),
                    nombre: item.props.memorandumrrhhId,
                    caption : item.props.destinoReg,
                    estado: item.props.estado,                                             
                };            
        }) ;         

        // Se filta por los destinos
        const filtroDestinos1 : DetalleDestinorrhhOptionsFormModel [] = listaDestinos
        .filter((value) => this.filtrarId(value.nombre, memorandumID)); 
        const filtroDestinos : DetalleDestinorrhhOptionsFormModel [] = filtroDestinos1
        .filter((value) => this.filtrarEstadoDestino(value.estado!,'SIN_VIAJE' )); 

                    // filtramos por el tipo de nombre
        const elementosUnicos = new Map(filtroDestinos.map(value => [value.caption, value]));

         // area de los usuarios del  memorandum
                   const usuarioId = usuarioResult.find((c)=>c.id === item.props.usuarioId)?.id || "-";                   
                   const usuarioArea = personalResult.find((c)=> c.props.usuarioId === usuarioId)?.props.areaId || "-";                   
                                     
                   let areaPadre = areaResult.find((c)=>c.id === usuarioArea)?.props.areaId;	                 
                   if(areaPadre == null){
                      areaPadre = usuarioArea;              
                    }  
                   const areaNombreUsuario =  areaResult.find((c) => c.id === areaPadre)?.props.nombre|| "-";	                    
        // fin area usuarios memorandum
        
        let destinoNombre = '';
        if(elementosUnicos.size > 1){
        //recorrer 
        elementosUnicos.forEach((value, key) => {
            if(escalaDestinoResult.find((c) => c.id === value.caption)){
                destinoNombre = destinoNombre.concat( escalaDestinoResult.find((c) => c.id === value.caption)?.props.destino|| "-").concat(' - ');
            }else {
                destinoNombre = destinoNombre.concat(destino).concat(' - ');
            }              
        });          
        }else{
        destinoNombre = (escalaDestinoResult.find((c) => c.id === destino))?
        escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-":destino;            
        }
               
         // Se filta por los id de memo
                const filtroDestinos2 : DetalleDestinorrhhOptionsFormModel [] = listaDestinos
                .filter((value) => this.filtrarId(value.nombre, item.id)); 
              let contador = 0;
                for(let i = 0; i < filtroDestinos2.length; i++){                   
                    const estado = detalleDestinoResult.find((c) => c.id === filtroDestinos2[i].id)?.props.estado|| "-";//Revisar
					
                    if(estado === 'SIN_VIAJE'){
                        contador++;					
                    }
                }                
                const cantidadDiasDetalleDestino = filtroDestinos2.length - contador;  



        //Actualizando Fechas 
        return {
            id                              : String(item.id),          
            usuario_nombre                  : usuarioNombre,
            usuario_cargo                   : cargoUsuario, 
            
            usuario_ci                      : ciUsuario,
         //   liquido_pagable                 : liquidoPagable,
            fecha_ida                       : fechaIda?moment(fechaIda).format("DD/MM/YYYY").toString(): '',
            fecha_retorno                   : fechaRetorno?moment(fechaRetorno).format("DD/MM/YYYY").toString(): '',
            destino                         : destinoNombre,
            cod_memo                        : codigoMemo,
            cantidad_dias                   : Number(cantidadDias),
            tipo_memo_repo                  : tipoMemoRepo,       
            area                            : area,
            sigla                           : siglaUsuario,
            cod_depart_memo                 : item.props.codDepartMemo,
            tipo_memorandum                 : item.props.tipoMemorandum,
            autorizado_por                  : listaJefes,
            //cargo_jefe_unidad               : item.props.carg,
            fecha_memo_registro             : item.props.fechaMemoRegistro,
            fecha_memo_format               : item.props.fechaMemoRegistro?moment(item.props.fechaMemoRegistro).format("DD/MM/YYYY").toString(): '',//Date
            tipo_comision_idp               : item.props.tipoComisionIDP,
            fecha_inicio_viaje              :item.props.fechaInicioViaje?moment(item.props.fechaInicioViaje).format("DD/MM/YYYY").toString(): '',//Date
            fecha_fin_viaje                 :item.props.fechaFinViaje?moment(item.props.fechaFinViaje).format("DD/MM/YYYY").toString(): '', //Date          
            dias_habiles                    : item.props.diasHabiles,
            tipo_transporte                 : item.props.tipoTransporte,
            observacion                     : item.props.observacion,
            estado_memorandum               : item.props.estadoMemorandum,
            notificacion_memo               : item.props.notificacionMemo,

            nombre_usuario                  : usuarioNombre,
            ci                              : usuarioCI,
            cargo_usuario                   : cargoUsuario,
            nume_celular                    : usuarioNumCelular,
            conteo_dias_detall              : 0,
            contrato                        : String(contratoUsuario),
            usuario_area                  : areaNombreUsuario,//ID del area del usuario,
            conteo_dias_detalle        : cantidadDiasDetalleDestino,
              
         //   usuario_admin       : authUser.uid,

          
        };
    }).sort((a, b) => a.fecha_memo_registro > b.fecha_memo_registro ?-1:1);   

    const filtrarFecha : MemorandumrrhhTableModel[] = this.filtrarPorFecha(result, fechaInicio, fechaFin); 
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
       const fechaFormat = this.convertirFecha(item.fecha_ida);
       const itemDate = fechaFormat; 		
       return  itemDate! >= inicio! && itemDate! <= fin!;			
   });         
     
   return filteredByDate;
 

};
 

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


public async getNombreApellido(nombre: string, apellido: string, query:any): Promise<Result<{ rows: MemorandumrrhhTableModel[]  }>> {
       
		
    const memorandumrrhh = await MemorandumrrhhService.getAll();
    if (memorandumrrhh.isFailure) return Result.fail("Falló al obtener la Memorandumrrhh");
    const memorandumrrhhResult = memorandumrrhh.getValue();

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
    
     const detalleDestino = await DetalleDestinorrhhService.getAll();
     if (detalleDestino.isFailure) return Result.fail("Falló al obtener la Detalle destino");
     const detalleDestinoResult = detalleDestino.getValue();
    /*Listado de escala Destino*/
    const escalaDestino =await EscalaDestinoService.getAll();
    if(escalaDestino.isFailure) return Result.fail("Fallo al obtener el Escala Destino");
    const escalaDestinoResult = escalaDestino.getValue();
    /*Listado de apertura*/
     const area =await AreaService.getAll();
     if(area.isFailure) return Result.fail("Fallo al obtener el area");
     const areaResult = area.getValue();
                   
    const result: MemorandumrrhhTableModel[] = memorandumrrhhResult.map((item) => {

    const memorandumID = item.id;
    const usuarioID = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.usuarioId||"-"; 
    const tipoMemoRepo = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.tipoMemoRepo||"-";    
   
    const areaId = personalResult.find((c) => c.props.usuarioId === usuarioID)?.props.areaId||"-";  
    const area = areaResult.find((c) => c.id === areaId)?.props.nombre||"-"; 
    const siglaUsuario = areaResult.find((c)=> c.id === areaId)?.props.sigla||"-"; 

    /*seleccionamos del listado de area el nombre del departamento y su sigla*/
    const usuarioNombre = usuarioResult.find((c) => c.id === usuarioID)?.props.fullname|| "-";//Revisar
    const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === usuarioID)?.props.cargoId|| "-";
    const cargoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.nombre|| "-";
   
    const ciUsuario = usuarioResult.find((c) => c.id === usuarioID)?.props.ci|| "-";
    const fechaIda = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.fechaInicioViaje||"-"; 
    const fechaRetorno = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.fechaFinViaje||"-";          
    const codigoMemo = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.codDepartMemo||"-"; 
    const cantidadDias = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.cantidadDias||"-"; 
    const destino = detalleDestinoResult.find((c) => c.props.memorandumrrhhId === memorandumID)?.props.destinoReg||"-"; 
  
    const usuarioCI = usuarioResult.find((c) => c.id ===usuarioID)?.props.ci|| "-";
   const usuarioNumCelular = usuarioResult.find((c) => c.id === usuarioID)?.props.celular|| "-";
        //Lista de destinos
        const listaDestinos: DetalleDestinorrhhOptionsFormModel[] = detalleDestino
        .getValue()
        .map((item) => {                
                return {                
                    id: item.id.toString(),
                    nombre: item.props.memorandumrrhhId,
                    caption : item.props.destinoReg,
                    estado: item.props.estado,                                             
                };            
        }) ;         

        // Se filta por los destinos
        const filtroDestinos1 : DetalleDestinorrhhOptionsFormModel [] = listaDestinos
        .filter((value) => this.filtrarId(value.nombre, memorandumID)); 
        const filtroDestinos : DetalleDestinorrhhOptionsFormModel [] = filtroDestinos1
        .filter((value) => this.filtrarEstadoDestino(value.estado!,'SIN_VIAJE' )); 

                    // filtramos por el tipo de nombre
        const elementosUnicos = new Map(filtroDestinos.map(value => [value.caption, value]));
        
        let destinoNombre = '';
        if(elementosUnicos.size > 1){
        //recorrer 
        elementosUnicos.forEach((value, key) => {
            if(escalaDestinoResult.find((c) => c.id === value.caption)){
                destinoNombre = destinoNombre.concat( escalaDestinoResult.find((c) => c.id === value.caption)?.props.destino|| "-").concat(' - ');
            }else {
                destinoNombre = destinoNombre.concat(destino).concat(' - ');
            }              
        });          
        }else{
        destinoNombre = (escalaDestinoResult.find((c) => c.id === destino))?
        escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-":destino;            
        }
         
        //Actualizando Fechas 
        return {
             id                             : String(item.id),          
            usuario_nombre                  : usuarioNombre,
            usuario_cargo                   : cargoUsuario,             
            usuario_ci                      : ciUsuario,
         //   liquido_pagable                 : liquidoPagable,
            fecha_ida                       : fechaIda?moment(fechaIda).format("DD/MM/YYYY").toString(): '',
            fecha_retorno                   : fechaRetorno?moment(fechaRetorno).format("DD/MM/YYYY").toString(): '',
            destino                         : destinoNombre,
            cod_memo                        : codigoMemo,
            cantidad_dias                   : Number(cantidadDias),
            tipo_memo_repo                  : tipoMemoRepo,            
            area                            : area,
            sigla                           : siglaUsuario,
            cod_depart_memo                 : item.props.codDepartMemo,
            tipo_memorandum                 : item.props.tipoMemorandum,
            autorizado_por                  : item.props.autorizadoPor,
            //cargo_jefe_unidad               : item.props.carg,
            fecha_memo_registro             : item.props.fechaMemoRegistro,
            //fecha_memo_format               : item.props.,
            tipo_comision_idp               : item.props.tipoComisionIDP,
            fecha_inicio_viaje              :item.props.fechaInicioViaje?moment(item.props.fechaInicioViaje).format("DD/MM/YYYY").toString(): '',//Date
            fecha_fin_viaje                 :item.props.fechaFinViaje?moment(item.props.fechaFinViaje).format("DD/MM/YYYY").toString(): '', //Date          
            dias_habiles                    : item.props.diasHabiles,
            tipo_transporte                 : item.props.tipoTransporte,
            observacion                     : item.props.observacion,
            estado_memorandum               : item.props.estadoMemorandum,
            notificacion_memo               : item.props.notificacionMemo,

            nombre_usuario                  : usuarioNombre,
            ci                              : usuarioCI,
            cargo_usuario                   : cargoUsuario,
            nume_celular                    : usuarioNumCelular,
            conteo_dias_detalle             : 0,
         //   usuario_admin       : authUser.uid,
          
        };
    }).sort((a, b) => a.fecha_inicio_viaje > b.fecha_inicio_viaje ?-1:1);   
  
    const filtroNombres : MemorandumrrhhTableModel [] = result	
    .filter((value) => this.filtrarNombreApellido(value.usuario_nombre,nombre,apellido )); 	
    const response = findAndCountResult(filtroNombres, query); 
	
    return Result.ok(response);
	
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

  
public async getDatosBeneficiario(fechaInicio: string, fechaFin: string, beneficiario:string, query:any): Promise<Result<{ rows: MemorandumrrhhTableModel[]  }>> {
		
    const memorandumrrhh = await MemorandumrrhhService.getAll();
    if (memorandumrrhh.isFailure) return Result.fail("Falló al obtener la Memorandumrrhh");
    const memorandumrrhhResult = memorandumrrhh.getValue();

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
    
    const detalleDestino = await DetalleDestinorrhhService.getAll();
     if (detalleDestino.isFailure) return Result.fail("Falló al obtener la Detalle destino");
     const detalleDestinoResult = detalleDestino.getValue();

      /*Listado de escala Destino*/
    const escalaDestino =await EscalaDestinoService.getAll();
    if(escalaDestino.isFailure) return Result.fail("Fallo al obtener el Escala Destino");
    const escalaDestinoResult = escalaDestino.getValue();
   
    
     /*Listado de apertura*/
     const area =await AreaService.getAll();
     if(area.isFailure) return Result.fail("Fallo al obtener el area");
     const areaResult = area.getValue();

                   
    const result: MemorandumrrhhTableModel[] = memorandumrrhhResult.map((item) => {

    const memorandumID = item.id;
     const usuarioID = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.usuarioId||"-"; 
    const tipoMemoRepo = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.tipoMemoRepo||"-";    
   
    const areaId = personalResult.find((c) => c.props.usuarioId === usuarioID)?.props.areaId||"-";  
    const area = areaResult.find((c) => c.id === areaId)?.props.nombre||"-"; 
    const siglaUsuario = areaResult.find((c)=> c.id === areaId)?.props.sigla||"-"; 

    /*seleccionamos del listado de area el nombre del departamento y su sigla*/
    const usuarioNombre = usuarioResult.find((c) => c.id === usuarioID)?.props.fullname|| "-";//Revisar
    const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === usuarioID)?.props.cargoId|| "-";
    const cargoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.nombre|| "-";
   
    const ciUsuario = usuarioResult.find((c) => c.id === usuarioID)?.props.ci|| "-";
    const fechaIda = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.fechaInicioViaje||"-"; 
    const fechaRetorno = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.fechaFinViaje||"-";          
    const codigoMemo = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.codDepartMemo||"-"; 
    const cantidadDias = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.cantidadDias||"-"; 
    const destino = detalleDestinoResult.find((c) => c.props.memorandumrrhhId === memorandumID)?.props.destinoReg||"-"; 
  
    const usuarioCI = usuarioResult.find((c) => c.id ===usuarioID)?.props.ci|| "-";
   const usuarioNumCelular = usuarioResult.find((c) => c.id === usuarioID)?.props.celular|| "-";
        //Lista de destinos
        const listaDestinos: DetalleDestinorrhhOptionsFormModel[] = detalleDestino
        .getValue()
        .map((item) => {                
                return {                
                    id: item.id.toString(),
                    nombre: item.props.memorandumrrhhId,
                    caption : item.props.destinoReg,
                    estado: item.props.estado,                                             
                };            
        }) ;         

        // Se filta por los destinos
        const filtroDestinos1 : DetalleDestinorrhhOptionsFormModel [] = listaDestinos
        .filter((value) => this.filtrarId(value.nombre, memorandumID)); 
        const filtroDestinos : DetalleDestinorrhhOptionsFormModel [] = filtroDestinos1
        .filter((value) => this.filtrarEstadoDestino(value.estado!,'SIN_VIAJE' )); 

                    // filtramos por el tipo de nombre
        const elementosUnicos = new Map(filtroDestinos.map(value => [value.caption, value]));
        
        let destinoNombre = '';
        if(elementosUnicos.size > 1){
        //recorrer 
        elementosUnicos.forEach((value, key) => {
            if(escalaDestinoResult.find((c) => c.id === value.caption)){
                destinoNombre = destinoNombre.concat( escalaDestinoResult.find((c) => c.id === value.caption)?.props.destino|| "-").concat(' - ');
            }else {
                destinoNombre = destinoNombre.concat(destino).concat(' - ');
            }              
        });          
        }else{
        destinoNombre = (escalaDestinoResult.find((c) => c.id === destino))?
        escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-":destino;            
        }
       
        return {
             id                          : String(item.id),          
            usuario_nombre               : usuarioNombre,
            usuario_cargo                : cargoUsuario, 
            
            usuario_ci                   : ciUsuario,
         //   liquido_pagable              : liquidoPagable,
            fecha_ida                    : fechaIda?moment(fechaIda).format("DD/MM/YYYY").toString(): '',
            fecha_retorno                : fechaRetorno?moment(fechaRetorno).format("DD/MM/YYYY").toString(): '',
            destino                      : destinoNombre,
            cod_memo                     : codigoMemo,
            cantidad_dias                : Number(cantidadDias),
            tipo_memo_repo               : tipoMemoRepo,            
            area                         : area,
            sigla                        : siglaUsuario,
            cod_depart_memo              : item.props.codDepartMemo,
            tipo_memorandum              : item.props.tipoMemorandum,
            autorizado_por               : item.props.autorizadoPor,
            fecha_memo_registro          : item.props.fechaMemoRegistro,        
            tipo_comision_idp            : item.props.tipoComisionIDP,
            fecha_inicio_viaje           :item.props.fechaInicioViaje?moment(item.props.fechaInicioViaje).format("DD/MM/YYYY").toString(): '',//Date
            fecha_fin_viaje              :item.props.fechaFinViaje?moment(item.props.fechaFinViaje).format("DD/MM/YYYY").toString(): '', //Date          
            dias_habiles                 : item.props.diasHabiles,
            tipo_transporte              : item.props.tipoTransporte,
            observacion                  : item.props.observacion,
            estado_memorandum            : item.props.estadoMemorandum,
            notificacion_memo            : item.props.notificacionMemo,

            nombre_usuario               : usuarioNombre,
            ci                           : usuarioCI,
            cargo_usuario                : cargoUsuario,
            nume_celular                 : usuarioNumCelular,
            conteo_dias_detalle          : 0,
         //   usuario_admin       : authUser.uid,
          
        };
    }).sort((a, b) => a.fecha_inicio_viaje > b.fecha_inicio_viaje ?-1:1);   
    const filtroBeneficiario : MemorandumrrhhTableModel [] = result	
    .filter((value) => this.filtrarCI(value.ci!,beneficiario )); 
    const filtrarFecha : MemorandumrrhhTableModel[] = this.filtrarPorFecha(filtroBeneficiario, fechaInicio, fechaFin);	
  
    const response = findAndCountResult(filtrarFecha, query); 
    return Result.ok(response);
	
}

    public async getTipoUsuario(tipo: string, query:any): Promise<Result<{ rows: MemorandumrrhhTableModel[]  }>> {
       
		
    const memorandumrrhh = await MemorandumrrhhService.getAll();
    if (memorandumrrhh.isFailure) return Result.fail("Falló al obtener la Memorandumrrhh");
    const memorandumrrhhResult = memorandumrrhh.getValue();

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
    
    const detalleDestino = await DetalleDestinorrhhService.getAll();
     if (detalleDestino.isFailure) return Result.fail("Falló al obtener la Detalle destino");
     const detalleDestinoResult = detalleDestino.getValue();

      /*Listado de escala Destino*/
    const escalaDestino =await EscalaDestinoService.getAll();
    if(escalaDestino.isFailure) return Result.fail("Fallo al obtener el Escala Destino");
    const escalaDestinoResult = escalaDestino.getValue();
    
     /*Listado de apertura*/
     const area =await AreaService.getAll();
     if(area.isFailure) return Result.fail("Fallo al obtener el area");
     const areaResult = area.getValue();

                   
    const result: MemorandumrrhhTableModel[] = memorandumrrhhResult.map((item) => {

   const memorandumID = item.id;
     const usuarioID = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.usuarioId||"-"; 
    const tipoMemoRepo = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.tipoMemoRepo||"-";    
   
    const areaId = personalResult.find((c) => c.props.usuarioId === usuarioID)?.props.areaId||"-";  
    const area = areaResult.find((c) => c.id === areaId)?.props.nombre||"-"; 
    const siglaUsuario = areaResult.find((c)=> c.id === areaId)?.props.sigla||"-"; 

    /*seleccionamos del listado de area el nombre del departamento y su sigla*/
    const usuarioNombre = usuarioResult.find((c) => c.id === usuarioID)?.props.fullname|| "-";//Revisar
    const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === usuarioID)?.props.cargoId|| "-";
    const cargoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.nombre|| "-";  
    const tipoUsuario = cargoResult.find((c)=>c.id === cargoUsuarioid)?.props.tipo|| "-";
   
    const ciUsuario = usuarioResult.find((c) => c.id === usuarioID)?.props.ci|| "-";
    const fechaIda = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.fechaInicioViaje||"-"; 
    const fechaRetorno = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.fechaFinViaje||"-";          
    const codigoMemo = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.codDepartMemo||"-"; 
    const cantidadDias = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.cantidadDias||"-"; 
    const destino = detalleDestinoResult.find((c) => c.props.memorandumrrhhId === memorandumID)?.props.destinoReg||"-"; 
  
    const usuarioCI = usuarioResult.find((c) => c.id ===usuarioID)?.props.ci|| "-";
   const usuarioNumCelular = usuarioResult.find((c) => c.id === usuarioID)?.props.celular|| "-";
        //Lista de destinos
        const listaDestinos: DetalleDestinorrhhOptionsFormModel[] = detalleDestino
        .getValue()
        .map((item) => {                
                return {                
                    id: item.id.toString(),
                    nombre: item.props.memorandumrrhhId,
                    caption : item.props.destinoReg,
                    estado: item.props.estado,                                             
                };            
        }) ;         

        // Se filta por los destinos
        const filtroDestinos1 : DetalleDestinorrhhOptionsFormModel [] = listaDestinos
        .filter((value) => this.filtrarId(value.nombre, memorandumID)); 
        const filtroDestinos : DetalleDestinorrhhOptionsFormModel [] = filtroDestinos1
        .filter((value) => this.filtrarEstadoDestino(value.estado!,'SIN_VIAJE' )); 

                    // filtramos por el tipo de nombre
        const elementosUnicos = new Map(filtroDestinos.map(value => [value.caption, value]));
        
        let destinoNombre = '';
        if(elementosUnicos.size > 1){
        //recorrer 
        elementosUnicos.forEach((value, key) => {
            if(escalaDestinoResult.find((c) => c.id === value.caption)){
                destinoNombre = destinoNombre.concat( escalaDestinoResult.find((c) => c.id === value.caption)?.props.destino|| "-").concat(' - ');
            }else {
                destinoNombre = destinoNombre.concat(destino).concat(' - ');
            }              
        });          
        }else{
        destinoNombre = (escalaDestinoResult.find((c) => c.id === destino))?
        escalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-":destino;            
        }
         
        //Actualizando Fechas 
        return {
            id                              : String(item.id),          
            usuario_nombre                  : usuarioNombre,
            usuario_cargo                   : cargoUsuario,             
            usuario_ci                      : ciUsuario,
        
            fecha_ida                       : fechaIda?moment(fechaIda).format("DD/MM/YYYY").toString(): '',
            fecha_retorno                   : fechaRetorno?moment(fechaRetorno).format("DD/MM/YYYY").toString(): '',
            destino                         : destinoNombre,
            cod_memo                        : codigoMemo,
            cantidad_dias                   : Number(cantidadDias),
            tipo_memo_repo                  : tipoMemoRepo,           
            area                            : area,
            sigla                           : siglaUsuario,
            cod_depart_memo                 : item.props.codDepartMemo,
            tipo_memorandum                 : item.props.tipoMemorandum,
            autorizado_por                  : item.props.autorizadoPor,        
            fecha_memo_registro             : item.props.fechaMemoRegistro,           
            tipo_comision_idp               : item.props.tipoComisionIDP,
            fecha_inicio_viaje              :item.props.fechaInicioViaje?moment(item.props.fechaInicioViaje).format("DD/MM/YYYY").toString(): '',//Date
            fecha_fin_viaje                 :item.props.fechaFinViaje?moment(item.props.fechaFinViaje).format("DD/MM/YYYY").toString(): '', //Date          
            dias_habiles                    : item.props.diasHabiles,
            tipo_transporte                 : item.props.tipoTransporte,
            observacion                     : item.props.observacion,
            estado_memorandum               : item.props.estadoMemorandum,
            notificacion_memo               : item.props.notificacionMemo,

            nombre_usuario                  : usuarioNombre,
            ci                              : usuarioCI,
            cargo_usuario                   : cargoUsuario,
            nume_celular                    : usuarioNumCelular,
            conteo_dias_detalle             : 0,
            tipo_usuario                    : tipoUsuario,
         //   usuario_admin       : authUser.uid,
          
        };
    }).sort((a, b) => a.fecha_inicio_viaje > b.fecha_inicio_viaje ?-1:1);   
   
    const filtroTipo : MemorandumrrhhTableModel [] = result		
    .filter((value) => this.filtrarTipoUsuario(value.tipo_usuario!,tipo )); 	
    
    const response = findAndCountResult(filtroTipo, query); 
	
    return Result.ok(response);
	
}

public filtrarTipoUsuario(item:string, tipo:string) {             
    return (item === tipo);     
}

public async getTipoEstado(estado: string, query:any): Promise<Result<{ rows: MemorandumrrhhTableModel[]  }>> {
       
		
    const memorandumrrhh = await MemorandumrrhhService.getAll();
    if (memorandumrrhh.isFailure) return Result.fail("Falló al obtener la Memorandumrrhh");
    const memorandumrrhhResult = memorandumrrhh.getValue();

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
     
     const detalleDestino = await DetalleDestinorrhhService.getAll();
     if (detalleDestino.isFailure) return Result.fail("Falló al obtener la Detalle destino");
     const detalleDestinoResult = detalleDestino.getValue();

      /*Listado de escala Destino*/
    const escalaDestino =await EscalaDestinoService.getAll();
    if(escalaDestino.isFailure) return Result.fail("Fallo al obtener el Escala Destino");
    const escalaDestinoResult = escalaDestino.getValue();
   
     /*Listado de apertura*/
     const area =await AreaService.getAll();
     if(area.isFailure) return Result.fail("Fallo al obtener el area");
     const areaResult = area.getValue();

                   
    const result: MemorandumrrhhTableModel[] = memorandumrrhhResult.map((item) => {

     const memorandumID = item.id;
     const usuarioID = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.usuarioId||"-"; 
    const tipoMemoRepo = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.tipoMemoRepo||"-";    
   
    const areaId = personalResult.find((c) => c.props.usuarioId === usuarioID)?.props.areaId||"-";  
    const area = areaResult.find((c) => c.id === areaId)?.props.nombre||"-"; 
    const siglaUsuario = areaResult.find((c)=> c.id === areaId)?.props.sigla||"-"; 

    /*seleccionamos del listado de area el nombre del departamento y su sigla*/
    const usuarioNombre = usuarioResult.find((c) => c.id === usuarioID)?.props.fullname|| "-";//Revisar
    const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === usuarioID)?.props.cargoId|| "-";
    const cargoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.nombre|| "-";  
    const tipoUsuario = cargoResult.find((c)=>c.id === cargoUsuarioid)?.props.tipo|| "-";
   
    const ciUsuario = usuarioResult.find((c) => c.id === usuarioID)?.props.ci|| "-";
    const fechaIda = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.fechaInicioViaje||"-"; 
    const fechaRetorno = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.fechaFinViaje||"-";          
    const codigoMemo = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.codDepartMemo||"-"; 
    const cantidadDias = memorandumrrhhResult.find((c) => c.id === memorandumID)?.props.cantidadDias||"-"; 
    const destino = detalleDestinoResult.find((c) => c.props.memorandumrrhhId === memorandumID)?.props.destinoReg||"-"; 
  
    const usuarioCI = usuarioResult.find((c) => c.id ===usuarioID)?.props.ci|| "-";
   const usuarioNumCelular = usuarioResult.find((c) => c.id === usuarioID)?.props.celular|| "-";
        //Lista de destinos
        const listaDestinos: DetalleDestinorrhhOptionsFormModel[] = detalleDestino
        .getValue()
        .map((item) => {                
                return {                
                    id: item.id.toString(),
                    nombre: item.props.memorandumrrhhId,
                    caption : item.props.destinoReg,
                    estado: item.props.estado,                                             
                };            
        }) ;         

        // Se filta por los destinos
        const filtroDestinos1 : DetalleDestinorrhhOptionsFormModel [] = listaDestinos
        .filter((value) => this.filtrarId(value.nombre, memorandumID)); 
        const filtroDestinos : DetalleDestinorrhhOptionsFormModel [] = filtroDestinos1
        .filter((value) => this.filtrarEstadoDestino(value.estado!,'SIN_VIAJE' )); 

                    // filtramos por el tipo de nombre
        const elementosUnicos = new Map(filtroDestinos.map(value => [value.caption, value]));
        
        let destinoNombre = '';
        if(elementosUnicos.size > 1){
        //recorrer 
        elementosUnicos.forEach((value, key) => {
            if(escalaDestinoResult.find((c) => c.id === value.caption)){
                destinoNombre = destinoNombre.concat( escalaDestinoResult.find((c) => c.id === value.caption)?.props.destino|| "-").concat(' - ');
            }else {
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
            usuario_nombre              : usuarioNombre,
            usuario_cargo               : cargoUsuario, 
            
            usuario_ci                  : ciUsuario,
         //   liquido_pagable             : liquidoPagable,
            fecha_ida                   : fechaIda?moment(fechaIda).format("DD/MM/YYYY").toString(): '',
            fecha_retorno               : fechaRetorno?moment(fechaRetorno).format("DD/MM/YYYY").toString(): '',
            destino                     : destinoNombre,
            cod_memo                    : codigoMemo,
            cantidad_dias               : Number(cantidadDias),
            tipo_memo_repo              : tipoMemoRepo,           
            area                        : area,
            sigla                       : siglaUsuario,
            cod_depart_memo             : item.props.codDepartMemo,
            tipo_memorandum             : item.props.tipoMemorandum,
            autorizado_por              : item.props.autorizadoPor,
            //cargo_jefe_unidad           : item.props.carg,
            fecha_memo_registro         : item.props.fechaMemoRegistro,
            //fecha_memo_format           : item.props.,
            tipo_comision_idp           : item.props.tipoComisionIDP,
            fecha_inicio_viaje          :item.props.fechaInicioViaje?moment(item.props.fechaInicioViaje).format("DD/MM/YYYY").toString(): '',//Date
            fecha_fin_viaje             :item.props.fechaFinViaje?moment(item.props.fechaFinViaje).format("DD/MM/YYYY").toString(): '', //Date          
            dias_habiles                : item.props.diasHabiles,
            tipo_transporte             : item.props.tipoTransporte,
            observacion                 : item.props.observacion,
            estado_memorandum           : item.props.estadoMemorandum,
            notificacion_memo           : item.props.notificacionMemo,

            nombre_usuario     : usuarioNombre,
            ci                 : usuarioCI,
            cargo_usuario      : cargoUsuario,
            nume_celular       : usuarioNumCelular,
            conteo_dias_detalle: 0,
            tipo_usuario       : tipoUsuario,
         //   usuario_admin       : authUser.uid,
          
        };
    }).sort((a, b) => a.fecha_inicio_viaje > b.fecha_inicio_viaje ?-1:1);   
   
    const filtroTipo : MemorandumrrhhTableModel [] = result		
    .filter((value) => this.filtrarTipoEstado(value.estado_memorandum,estado )); 	
	
    
    const response = findAndCountResult(filtroTipo, query); 
	
    return Result.ok(response);
	
}


public filtrarTipoEstado(itemMemorandumrrhh:string,  estado:string) {       
    
    if(estado === ENUM_VERIFICADO_RRHH){
        return (itemMemorandumrrhh === ENUM_VERIFICADO_RRHH );
    }else if(estado === ENUM_ANULADO){
        return (itemMemorandumrrhh === ENUM_ANULADO );
    }else if(estado === ENUM_RECHAZADO){
        return (itemMemorandumrrhh === ENUM_RECHAZADO );
    }else{
        return (itemMemorandumrrhh === ENUM_PENDIENTE );
    }   
}


public generarHeadExcel(tipo:string) {   
    
    const headList : Partial<Column>[] =  [];
   switch(tipo){
    case ENUM_GENERAL:
    headList.push( { header: 'Nº', key: 'numero', width: 10 },
        { header: 'Tipo de Memorandum', key: 'tipo_memorandum', width: 45 },       
        { header: 'C.I.', key: 'usuario_ci', width: 25 },     
        { header: 'Nombre de Usuario', key: 'usuario_nombre', width: 40 },      
        { header: 'Sigla', key: 'sigla', width: 25 },    
        { header: 'Cod. Memo', key: 'cod_depart_memo', width: 40 },
        { header: 'Destino', key: 'destino', width: 30 },
        { header: 'Fecha Inicio Viaje', key: 'fecha_inicio_viaje', width: 25 },
        { header: 'Fecha Retorno Viaje', key: 'fecha_fin_viaje', width: 25 },       
        { header: 'Estado', key: 'estado_memorandum', width: 25 }, 
        { header: 'Cantidad de dias', key: 'cantidad_dias', width: 25 },
        { header: 'Tipo de usuario', key: 'tipo_usuario', width: 25 })      
        
        return headList;   
   
    case ENUM_REPORTE_POR_PROYECTO:
         headList.push({ header: 'Nº', key: 'numero', width: 10 },
        { header: 'Tipo de Memorandum', key: 'tipo_memorandum', width: 45 },       
        { header: 'C.I.', key: 'usuario_ci', width: 25 },     
        { header: 'Nombre de Usuario', key: 'usuario_nombre', width: 40 },      
        { header: 'Sigla', key: 'sigla', width: 25 },    
        { header: 'Cod. Memo', key: 'cod_depart_memo', width: 40 },
        { header: 'Destino', key: 'destino', width: 30 },
        { header: 'Fecha Inicio Viaje', key: 'fecha_inicio_viaje', width: 25 },
        { header: 'Fecha Retorno Viaje', key: 'fecha_fin_viaje', width: 25 },       
        { header: 'Estado', key: 'estado_memorandum', width: 25 },
        { header: 'Cantidad de dias', key: 'cantidad_dias', width: 25 },
        { header: 'Tipo de usuario', key: 'tipo_usuario', width: 25 })      
        return headList;   
   
   
    case ENUM_REPORTE_POR_BENEFICIARIO:
          headList.push({ header: 'Nº', key: 'numero', width: 10 },
        { header: 'Tipo de Memorandum', key: 'tipo_memorandum', width: 45 },       
        { header: 'C.I.', key: 'usuario_ci', width: 25 },     
        { header: 'Nombre de Usuario', key: 'usuario_nombre', width: 40 },      
        { header: 'Sigla', key: 'sigla', width: 25 },    
        { header: 'Cod. Memo', key: 'cod_depart_memo', width: 40 },
        { header: 'Destino', key: 'destino', width: 30 },
        { header: 'Fecha Inicio Viaje', key: 'fecha_inicio_viaje', width: 25 },
        { header: 'Fecha Retorno Viaje', key: 'fecha_fin_viaje', width: 25 },       
        { header: 'Estado', key: 'estado_memorandum', width: 25 },
        { header: 'Cantidad de dias', key: 'cantidad_dias', width: 25 },
        { header: 'Tipo de usuario', key: 'tipo_usuario', width: 25 })       
        return headList;   
    
    case ENUM_REPORTE_POR_TIPO:
         headList.push({ header: 'Nº', key: 'numero', width: 10 },
        { header: 'Tipo de Memorandum', key: 'tipo_memorandum', width: 45 },       
        { header: 'C.I.', key: 'usuario_ci', width: 25 },     
        { header: 'Nombre de Usuario', key: 'usuario_nombre', width: 40 },      
        { header: 'Sigla', key: 'sigla', width: 25 },    
        { header: 'Cod. Memo', key: 'cod_depart_memo', width: 40 },
        { header: 'Destino', key: 'destino', width: 30 },
        { header: 'Fecha Inicio Viaje', key: 'fecha_inicio_viaje', width: 25 },
        { header: 'Fecha Retorno Viaje', key: 'fecha_fin_viaje', width: 25 },       
        { header: 'Estado', key: 'estado_memorandum', width: 25 },
        { header: 'Cantidad de dias', key: 'cantidad_dias', width: 25 },
        { header: 'Tipo de usuario', key: 'tipo_usuario', width: 25 })      
        return headList;   
                           
   }
}

public async generarFilasExcel(authUser: AuthUser, queryString: any, id?: string, listaIds?: string[], fechaInicio?: string, fechaFin?: string): Promise<Result<MemorandumrrhhDataResponse>> {
    const resultObject = queryStringToArray(queryString);
    
    const info = await this.getInfoMemorandumrrhhData(authUser, resultObject); // Datos generales

    const data = await this.getMemorandumrrhhData(resultObject, id, listaIds, fechaInicio, fechaFin); 
    //  Asegúrate que este `data` sea un ARRAY de objetos planos
    // con los campos que deseas mostrar en el Excel.
    return Result.ok({
        info,
        data
    });
}

public getFormatData(data: MemorandumrrhhDataR | undefined)  {
    const listaData : ReportGeneral[] = [];
    if(data != null && data != undefined && data.rows.length >0){
        for (let i = 0; i < data.rows.length; i++) {
            const item : ReportGeneral = {
                numero                : Number(i+1),
                tipo_memorandum       : String(data.rows[i].tipo_memorandum),               
                usuario_ci            : String(data.rows[i].ci),        
                usuario_nombre        : String(data.rows[i].usuario_nombre),           
                sigla                 : String(data.rows[i].sigla),
                cod_depart_memo       : String(data.rows[i].cod_depart_memo),          
                destino               : String(data.rows[i].destino),
                fecha_inicio_viaje    : String(data.rows[i].fecha_inicio_viaje),           
                fecha_fin_viaje       : String(data.rows[i].fecha_fin_viaje), 
                tipo_comision         : String(data.rows[i].tipo_comision_idp),  
                cantidad_dias         : Number(data.rows[i].cantidad_dias),  
                tipo_usuario          :String(data.rows[i].tipo_usuario),      
                estado_memorandum     :String(data.rows[i].estado_memorandum),                    
               // area_id               : String(data.rows[i].usuario_area) ///revisar
            }
            listaData.push(item)           
			
           }
            
          
           return listaData;    
    }

  }


}