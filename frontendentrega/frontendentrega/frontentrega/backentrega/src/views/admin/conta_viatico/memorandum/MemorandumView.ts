import { Result } from "../../../../base/types/Result";
import { esFeriado, findAndCountResult, obtenerFeriadosBolivia, queryStringToArray } from "../../../../tools/util";
import moment from "moment";
import  MemorandumService  from "../../../../core/admin/conta_viatico/memorandum";
import  VehiculoService from "../../../../core/admin/bsss/vehiculo";
import  CargoService  from "../../../../core/rrhh/cargo";
import  AperturaViaticoService  from "../../../../core/admin/conta_viatico/apertura_viatico";
import  UsuarioService from "../../../../core/system/autenticacion/usuario";
import PersonalService from "../../../../core/rrhh/personal";
import  AreaService  from "../../../../core/rrhh/area";
import { AuthUser } from "../../../../base/types/AuthUser";
import  DetalleDestinoService  from "../../../../core/admin/conta_viatico/detalle_destino";
import { DetalleDestinoOptionsFormModel } from "../detalle_destino/DetalleDestinoView";
import  EscalaDestinoService  from "../../../../core/admin/conta_viatico/escala_destino";
import RoleService from "../../../../core/system/autenticacion/role";
//import { AperturaViaticosOptionsFormModel, AperturaViaticosOptionsFormModel2, AperturaViaticoView } from "../apertura_viatico/AperturaViaticoView";
import { ASESOR, ASESOR_FINANCIERO, ENUM_APROBADO_CONTABILIDAD, ENUM_APROBADO_SECRETARIO,  ENUM_CON_RESOLUCION,  ENUM_EN_ESPERA_INFORME,  ENUM_ENCARGADO_VIATICOS,  ENUM_INHABIL,  ENUM_OBSERVADO, ENUM_PENDIENTE_CONTABILIDAD, ENUM_PENDIENTE_DE_APROBAR, ENUM_PENDIENTE_RRHH,  ENUM_REPORTE_PARA_RRHH,  ENUM_REPOSICION_VENCIDA,  ENUM_SIN_RESOLUCION,  ENUM_TECNICO_RRHH,   ENUM_VERIFICADO_RRHH, ESTADOS_ENCARGADO, ESTADOS_PERMITIDOS_CONTA, ESTADOS_PERMITIDOS_RRHH, ESTADOS_RRHH, GABINETE, GABINETE_DESPACHO, GOBERNADOR, JEFE_COMUNICACION, JEFE_GABINETE, MEMORANDUM_INSTRUCCION, ROLES_TECNICOS_VIATICOS, SECRETARIO, SECRETARIO_GABINETE_ITEM, SECRETARIO_GOBERNADOR_ITEM, SECRETARIO_SDAFP_ITEM,  TECNICO_GENERAL_VIATICOS } from "../../../../base/constants/enum";
import  AperturaGeneralService  from "../../../../core/admin/apertura/apertura_general";
import { Column } from "exceljs";
import { ReportGeneral, ViaticoDataR } from "../viatico/ViaticoView";
import { UsuarioView } from "../../../system/autenticacion/usuario/UsuarioView";


type MemorandumTableModel = {
    id                     : string;
    /** Se agregan tablas de conexion con memorandum */
    usuario_nombre         : string;
    usuario_cargo          : string;
    ci                     : string;
    nume_celular           : string;
    num_placa?             : string;
    apertura_viatico       : string;
    nombre_area_apertura   : string;
    presupuesto_inicial    : number;
    presupuesto_restante   : number;
    presupuesto_inicial_pasaje?  :number;
    presupuesto_restante_pasaje? : number;
    /**Tabla original de la BDD */
    cod_depart_memo        : string;
    autorizado_por         : string[];
    cargo_jefe_unidad      : string;
    fecha_memo_registro    : Date; 
    fecha_memo_format?     : string;//Date
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
    apertura_viatico_id    : string | null;  //codigo
    apertura_pasaje_id?    : string | null;  //codigo
    usuario_id             : string | null;  //nombre completo   
    contrato?              : string;
    lista_select_jefes?     : SelectOption[]; 
   //
    modificacion            : boolean,
    obs_modificacion        : string | null,
    fecha_cambio            : string,
    estado_modificacion     : string,
    area_indice_usuario?           : string,

    codigo_objeto?     : string;
    objeto_gasto?      : string;
    justificacion?     : string;
    aprobacion_rrhh_conta  : string[];
    tiempo_aprobacion_usuario : string[];
    destino?           : string;
    objetivo_viaje?    : string;      
    resolucion?        : string;
    };

export type GetMemorandumsTableResponse = {
    rows: MemorandumTableModel[];
    count: number;
};

export type MemorandumFormDataResponse = {
    id                     : string;
    cod_depart_memo        : string;
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
    apertura_viatico_id    : string | null;
    apertura_pasaje_id     : string | null;  //codigo
    usuario_id             : string | null;
    
    modificacion           : boolean,
    obs_modificacion       : string | null ,
    fecha_cambio           : string,
    estado_modificacion    : string,

    justificacion          : string;

    // Datos Usuario
    nombre_usuario :string;
    ci:             string;
    cargo_usuario : string;
    nume_celular:   string;
    conteo_dias_detalle    : number; 
    usuario_admin :string;

    presupuesto_viatico?           : number;
    estado_presupuesto_viatico?    : string;
    presupuesto_pasaje?           : number;
    estado_presupuesto_pasaje?    : string;
    aprobacion_rrhh_conta  : string[];
    tiempo_aprobacion_usuario : string[];
};
export type MemorandumModelDetalle = {
    id?                    : string;
    nombre_usuario : string;
    ci: string;
    cargo_usuario : string
    tipo_comision_idp        : string;
    fecha_inicio_viaje     : string;
    fecha_fin_viaje        : string;
    cantidad_dias          : number;
};

export type detalleDestinoItem = {
    id                       : string;
    tipo_vehiculo_op         : string;
    objetivo_viaje           : string;
    destino_reg              : string;
    fecha_dia                : string;
    hora_inicio              : string;
    hora_fin                 : string;
    pernocte                 : string;
    pasaje_ida               : number;
    pasaje_retorno           : number;
    total_pasaje_dia         : number;
    tipo_vehiculo_opvida     : string;
    tipo_vehiculo_opvuelta   : string;
    estado                   : string;
    memorandum_id            : string;
    viatico_id               : string;
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

export type MemorandumReporte = {
    //tasks: any;
    //lineas: lineaTemporalItem[];
    rows  : detalleDestinoItem[];
    
};

export type InfoReporteModel = {
    //id                     : string;
    /** Se agregan tablas de conexion con memorandum */
    usuario_nombre : string;
    usuario_cargo : string;
    ci                     : string;
    nume_celular            : string;

    num_placa?              : string;

    apertura_viatico : string;
    nombre_area_apertura :string;
    presupuesto_inicial:number;
    presupuesto_restante : number;
    /**Tabla original de la BDD */
    cod_depart_memo        : string;
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

    ffyOrg                 : string;   
    sisin                  :  string;
    conteo_dias_detalle    : number; 
    contrato?              : string;    
    codigoQR               : string;
    usuario_a_cargo?       : string; 
    usuario_sigla?         : string; 
    aprobado_rrhh?         : string;
    aprobado_contabilidad? : string;
    tipo_memorandum?       : string;
    es_gobernador?         : string; 
    //Se puede agregar lo de modificacion 
    //Caso gobernador
    usuario_nombre_finanzas?  : string;
    ci_finanzas?              : string;
    usuario_cargo_finanzas?   : string;
    contrato_finanzas?        : string;
    nume_celular_finanzas?    : string; 
    aprobacion_rrhh_conta ?   : string;  
    tiempo_aprobacion_usuario? : string;
    
};

export type SelectOption = {
    value: string;
    label: string;
}
export type MemorandumData = {
    info: InfoReporteModel;
    data: MemorandumReporte;
};
export type MemorandumProcesoFechas = {   
    fecha_dia: string;  
    pernocte : string;
    estado?  : string ;  
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
export type DetalleDestinoTableModel = {
    id                       : string;
    tipo_vehiculo_op         : string;
    objetivo_viaje           : string;
    destino_reg              : string;
    fecha_dia                : Date;
    hora_inicio              : string;
    hora_fin                 : string;
    pernocte                 : string;
    pasaje_ida               : number;
    pasaje_retorno           : number;
    total_pasaje_dia         : number;
    tipo_vehiculo_opvida         : string;
    tipo_vehiculo_opvuelta         : string;
    memorandum_id            : string;
    viatico_id               : string;
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

export type MemorandumItem = { //cambiar
    id     : string;
    gestion?: string;
    tipo?   : string;
    codigo? : string;
   
    //campos reporte
estado_memorandum?      : string;
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

export type MemorandumDataR = {
    rows: MemorandumItem[];
};
export type InfoMemorandumModel = {
    codigo    : string;
    nombre    : string;
    fecha     : string;
    email     : string;
};
 export type MemorandumDataResponse = {
     info?: InfoMemorandumModel;
     data?: MemorandumDataR;
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

export class MemorandumView {
    public async getMemorandumsTable(authUser: AuthUser, query: any): Promise<Result<{ rows: MemorandumTableModel[] }>> {
            const memorandum = await MemorandumService.getAll();
            if (memorandum.isFailure) return Result.fail("Falló al obtener la Memorandum");
            const memorandumResult = memorandum.getValue();
            /*Listado de usuarios*/
            const usuarios = await UsuarioService.getAll();
            if(usuarios.isFailure) return Result.fail("Fallo al obtener el Usuario");
            const usuarioResult = usuarios.getValue();
            /*Listado de apertura viatico*/
            const aperturaViatico = await AperturaViaticoService.getAll();
            if(aperturaViatico.isFailure) return Result.fail("Fallo al obtener la Apertura Viatico");
            const aperturaViaticoResult = aperturaViatico.getValue();
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
            const detalleDestino = await DetalleDestinoService.getAll();
            if (detalleDestino.isFailure) return Result.fail("Falló al obtener la Detalle Destino");
             const detalleDestinoResult = detalleDestino.getValue(); 

            /*Listado detalle destino*/    
            const escalaDestino = await EscalaDestinoService.getAll();
            if (escalaDestino.isFailure) return Result.fail("Falló al obtener la escala Destino");
             const escalaDestinoResult = escalaDestino.getValue();   

             /*Listado de apertura viatico*/
            const aperturaGeneral = await AperturaGeneralService.getAll();
            if(aperturaGeneral.isFailure) return Result.fail("Fallo al obtener la Apertura General");
            const aperturaGeneralResult = aperturaGeneral.getValue(); 
              //conteo dias detalle destino 
               //Lista de destinos
               const listaDestinos: DetalleDestinoOptionsFormModel[] = detalleDestino
               .getValue()
               .map((value) => {                
                       return {                
                           id: value.id.toString(),
                           nombre: value.props.memorandumId,
                           caption : value.props.destinoReg, 
                           dia     : value.props.fechaDia,                                              
                        };            
               }) ;     
            const feriados =  await obtenerFeriadosBolivia();   
            const result: MemorandumTableModel[] = memorandumResult.map((item) => {

                 /**seleccionamos del listado de area el nombre del departamento y su sigla*/
               const usuarioNombre = usuarioResult.find((c) => c.id === item.props.usuarioId)?.props.fullname|| "-";//Revisar              
               const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === item.props.usuarioId)?.props.cargoId|| "-";
               const cargoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.nombre|| "-";
               const contratoUsuario =  cargoResult.find((c) => c.id === cargoUsuarioid)?.props.item|| "-";
               const usuarioCI = usuarioResult.find((c) => c.id === item.props.usuarioId)?.props.ci|| "-";
               const usuarioNumCelular = usuarioResult.find((c) => c.id === item.props.usuarioId)?.props.celular|| "-";   
               
               const areaIdUsuario = personalResult.find((c) => c.props.usuarioId === item.props.usuarioId)?.props.areaId|| "-";
               const areaIndiceUsuario = areaResult.find((c) => c.id === areaIdUsuario)?.props.indice|| "-";
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
                     let cargoNombreJefe = cargoResult.find((r)=> r.id === cargoIDJefe)?.props.nombre|| "-"; 
                     //consideraciones especiales par el jefe de gabinete
                    // if(cargoNombreJefe.includes(JEFE_GABINETE))
                      if(cargoNombreJefe.includes(GOBERNADOR) || cargoNombreJefe.includes(JEFE_GABINETE)
                        || cargoNombreJefe.includes(JEFE_COMUNICACION)|| cargoNombreJefe.includes(ASESOR))// tener cuidado ambos jefes no pueden estar en uno 
                     {
                        cargoNombreJefe = SECRETARIO;					
                     }                  
                     
                     const palabras = cargoNombreJefe.trim().split(' ');                     
                     const primeraPalabra = palabras[0].replace(/\(.*?\)/g, '').toLocaleUpperCase();                                     
                     const concatenaAprove = "APROBADO_".concat(primeraPalabra);
                     
                     listaSelectJefes.push({ value: concatenaAprove, label: concatenaAprove})      
                     
                });
                
               // lista select que debe enviarse al frontend

               // fin lista select
               const codAperturaViatico = aperturaViaticoResult.find((c) => c.id === item.props.aperturaViaticoId)?.props.aperturaProgramatica|| "-";// revisar sesta parte
               const AreaApertura = aperturaViaticoResult.find((c) => c.id === item.props.aperturaViaticoId)?.props.areaId|| "-";// revisar sesta parte
               const nombreAreaApertura = areaResult.find((c) => c.id === AreaApertura)?.props.nombre|| "-";// revisar sesta parte
               const presupuestoInicialApertura = aperturaViaticoResult.find((c) => c.id === item.props.aperturaViaticoId)?.props.presupuestoInicial|| 0;// revisar sesta parte
               const presupuestoRestanteApertura = aperturaViaticoResult.find((c) => c.id === item.props.aperturaViaticoId)?.props.presupuestoRestante|| 0;// revisar sesta parte
               const presupuestoInicialPasaje = aperturaViaticoResult.find((c) => c.id === item.props.aperturaPasajeId)?.props.presupuestoInicial|| 0;// revisar sesta parte
               const presupuestoRestantePasaje = aperturaViaticoResult.find((c) => c.id === item.props.aperturaPasajeId)?.props.presupuestoRestante|| 0;// revisar sesta parte
               const codigoObjetoViatico = aperturaViaticoResult.find((c) => c.id === item.props.aperturaViaticoId)?.props.objeto|| "-";// revisar sesta parte
               const objetoGastoViatico = aperturaViaticoResult.find((c) => c.id === item.props.aperturaViaticoId)?.props.descripcionObjetoGasto|| "--";// revisar sesta parte
               const codigoObjetoPasaje = aperturaViaticoResult.find((c) => c.id === item.props.aperturaPasajeId)?.props.objeto|| "-";// revisar sesta parte
               const objetoGastoPasaje = aperturaViaticoResult.find((c) => c.id === item.props.aperturaPasajeId)?.props.descripcionObjetoGasto|| "--";// revisar sesta parte
             
                // Se envian las observaciones sin repeticiones y los destinos
                let destinosConcatenados = '';
                let objetivoViajeConcatenados = '';
                let destinoMemo = "";
                const cadenasAgregadasDestino = new Set<string>();
                const cadenasAgregadasObjetivo = new Set<string>();

                const filtroDestinos : DetalleDestinoOptionsFormModel [] = listaDestinos
                .filter((value) => this.filtrarId(value.nombre, item.id)); 
              let contador = 0;
              let resolucion = ENUM_SIN_RESOLUCION;
             
                for(let i = 0; i < filtroDestinos.length; i++){                   
                    const estado = detalleDestinoResult.find((c) => c.id === filtroDestinos[i].id)?.props.estado|| "-";//Revisar
					//const destino = detalleDestinoResult.find((c)=> c.id === filtroDestinos[i].id )?.props.destinoReg || "-";
                        if(escalaDestinoResult.find((c) => c.id === filtroDestinos[i].caption)){
                            destinoMemo = escalaDestinoResult.find((c) => c.id ===filtroDestinos[i].caption)?.props.destino|| "-";
                        }else{
                            destinoMemo =filtroDestinos[i].caption!;
                        }
                    const objetivoViaje = detalleDestinoResult.find((c)=> c.id === filtroDestinos[i].id )?.props.objetivoViaje || "-";
					
                    if(estado === 'SIN_VIAJE'){						
                        contador++;				
						
                    }

                     const cadenaDestino = `${destinoMemo}`;
                     const cadenaObjetivoViaje = `${objetivoViaje}`;

                        if (!cadenasAgregadasDestino.has(cadenaDestino) || !cadenasAgregadasObjetivo.has(cadenaObjetivoViaje)) {
                            cadenasAgregadasDestino.add(cadenaDestino);
                            cadenasAgregadasObjetivo.add(cadenaObjetivoViaje);

                            if (destinosConcatenados !== ''|| objetivoViajeConcatenados !== '') {
                                destinosConcatenados += ', ';
                                objetivoViajeConcatenados += ', ';
                            }

                            destinosConcatenados += cadenaDestino;
                            objetivoViajeConcatenados += cadenaObjetivoViaje;
                        }

                    
                     if( item.props.diasHabiles === ENUM_INHABIL || resolucion.includes(ENUM_CON_RESOLUCION))                                    
                    
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
                   //     
                }                
                const cantidadDiasDetalleDestino = filtroDestinos.length - contador;  
                //Verificacion de los dias habiles
              


               //recupera datos para mostrar en la tabla del modulo
                return {
                    id                     : String(item.id),    
                    usuario_nombre         : usuarioNombre,
                    usuario_cargo          : cargoUsuario,   
                    ci                     : usuarioCI ,
                    nume_celular           : usuarioNumCelular, 
                   // num_placa              : placaVehiculo,
                    cod_depart_memo        : item.props.codDepartMemo,
                    apertura_viatico       : codAperturaViatico,					
                    nombre_area_apertura   : nombreAreaApertura,
                    presupuesto_inicial    : presupuestoInicialApertura,
                    presupuesto_restante   : presupuestoRestanteApertura,
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
                    apertura_viatico_id    : item.props.aperturaViaticoId,
                    apertura_pasaje_id     : item.props.aperturaPasajeId,
                    usuario_id             : item.props.usuarioId,
                   
                    conteo_dias_detalle    : cantidadDiasDetalleDestino,
                    contrato               : String(contratoUsuario),
                    fecha_memo_format      :item.props.fechaMemoRegistro?moment(item.props.fechaMemoRegistro).format("DD/MM/YYYY HH:mm:ss").toString(): '',
                    presupuesto_inicial_pasaje    : presupuestoInicialPasaje,
                    presupuesto_restante_pasaje   : presupuestoRestantePasaje,
                    lista_select_jefes     : listaSelectJefes,
                    area_indice_usuario    : areaIndiceUsuario,
                    codigo_objeto          : codigoObjetoViatico.concat("-").concat(codigoObjetoPasaje),
                    objeto_gasto           : objetoGastoViatico.concat("-").concat(objetoGastoPasaje),
                    justificacion          : item.props.justificacion,
                    aprobacion_rrhh_conta     : item.props.aprobacionRRHHconta,
                    tiempo_aprobacion_usuario : item.props.tiempoAprobacionUsuario,
                    destino                : destinosConcatenados,
                    objetivo_viaje         :objetivoViajeConcatenados,
                    resolucion             : resolucion,
                };
               
            }).sort((a, b) => moment(a.fecha_memo_registro).toDate() < moment(b.fecha_memo_registro).toDate() ? 1 : -1);


             /*filtrado POR ROL y discriminacion por padre e hijo areas*/
            let listaFiltradaPorUsuario : MemorandumTableModel[]=[]; 
            let listaFiltradaJerarquia: MemorandumTableModel[]=[]; 
            let aperturaPadre;
            const usuarioId = authUser.uid;				
			
			// Area usuario
            const  areaUsuarioId =  personalResult.find((c) => c.props.usuarioId === usuarioId)?.props.areaId|| "-";				 //corregir						
			// 2. Buscar si esa área es un hijo o un padre en la tabla de aperturas
            const aperturaHijo = aperturaGeneralResult.find((c) => c.props.areaHijoId === areaUsuarioId  );						
			//aqui sino existe una apertura para esa direccion obtner todos los del padre
            if(aperturaHijo){
                  const  areaPadreID =  aperturaGeneralResult.find((c) => c.props.areaHijoId === areaUsuarioId)?.props.areaId|| "-";	
                    aperturaPadre = aperturaGeneralResult.find((c) => c.props.areaId === areaPadreID  );                    					
            }else{
                   aperturaPadre = aperturaGeneralResult.find((c) => c.props.areaId === areaUsuarioId  );                    
                   //cuando un area o programa no tiene apertura abierta entonces buscara las del padre                    
                   if(aperturaPadre === undefined){
                       const areaPadre = areaResult.find((c)=> c.id === areaUsuarioId)?.props.areaId;                       
                       aperturaPadre = aperturaGeneralResult.find((c) => c.props.areaId === areaPadre  );                       
                   }  
            }          		
            let idsAperturaVisibles: string[] = [];
            // 3. Si el área es hijo
            if (aperturaHijo) {
                const aperturaHijoId = aperturaHijo.props.areaHijoId;			
                idsAperturaVisibles.push(aperturaHijoId);
            }
            //  4. Si el área es padre
            if (aperturaPadre) {         
                const aperturaPadreId = aperturaPadre.props.areaId;
                const aperturaProgramaticaPadre = aperturaPadre.props.aperturaProgramatica;
                // Buscar todos los hijos de este padre
                const hijosDePadre = aperturaGeneralResult.filter((c) => c.props.areaId === aperturaPadreId).map((h) => h.props.aperturaProgramatica);       
                
                // El padre ve sus memos + los de sus hijos
                idsAperturaVisibles = [aperturaProgramaticaPadre, ...hijosDePadre];
                idsAperturaVisibles = Array.from(new Set(idsAperturaVisibles.filter(id => id && id.trim() !== '')));			                
				
            }
             
                   
            if(ROLES_TECNICOS_VIATICOS.has(authUser.roles!)){			
             
				listaFiltradaJerarquia = result.filter((memo) => idsAperturaVisibles.includes(memo.apertura_viatico));//listaFiltradaJerarquia.filter((memo) => idsAperturaVisibles.includes(memo.apertura_viatico));//
                // Mostrando aquellos que corresponden a un area segun el cite
                const areaIdUsuario = personalResult.find((c) => c.props.usuarioId === authUser.uid)?.props.areaId;				
                const rutaAreaUsuario = areaResult.find((c) => c.id === areaIdUsuario)?.props.indice|| "-"; 				
                const areaNombre = await AreaService.getIndicePorSigla(rutaAreaUsuario, areaResult);
				const listaFiltrada = listaFiltradaJerarquia.filter((memo) => {
                  
                    if (!memo.cod_depart_memo) return false;
                    const rutaMemo = memo.cod_depart_memo.split(" Nº")[0]; 				
                    // Esto extrae solo GADOR/SDPD/ATI  ejemplo
                    // 🔹 Caso 1: soy área hija (quiero solo lo mío)
                    if (areaNombre.getValue().split("/").length === 4) {
                        return rutaMemo === areaNombre.getValue();
                    }

                    // 🔹 Caso 2: soy padre (veo lo mío + hijos)
                    return (rutaMemo === areaNombre.getValue() || rutaMemo.startsWith(areaNombre.getValue() + "/"));
                });
                
                // Inicio vista de finanzas para el gobernador CASO ESPECIAL
                 const uidIngreso = authUser.uid;              
                 const cargoID = personalResult.find((c) => c.props.usuarioId=== uidIngreso)?.props.cargoId|| "-"; 	                 
                 const item = cargoResult.find((c) => c.id === cargoID)?.props.item|| "-";                  
                 const cargoIDGobernador = cargoResult.find((c) => c.props.nombre === GOBERNADOR)?.id|| "-"; 	
                 const idGobernador = personalResult.find((c) => c.props.cargoId === cargoIDGobernador)?.props.usuarioId|| "-"; 					 
                 let memoGobernador ;
               if(item === SECRETARIO_SDAFP_ITEM ){
                     memoGobernador = result.filter((memo) => memo.usuario_id === idGobernador);//listaFiltradaJerarquia.filter((memo) => idsAperturaVisibles.includes(memo.apertura_viatico));//                                      
                     listaFiltrada.push(...memoGobernador);
               }               
                // Fin vista de finanzas para el gobernador CASO ESPECIAL

                  // Inicio vista de Direccion superior secretarios para el gobernador CASO ESPECIAL
                                                 
                let memoJefeGabinete ;
               if(item === SECRETARIO_GABINETE_ITEM ){
                     memoJefeGabinete = result.filter((memo) =>  !memo.cod_depart_memo.includes(GABINETE_DESPACHO) && memo.cod_depart_memo.includes(GABINETE));
                     memoJefeGabinete.forEach(item =>!listaFiltrada.some(x => x.cod_depart_memo === item.cod_depart_memo)
                     && listaFiltrada.push(item));     
                //    listaFiltradaPorUsuario = listaFiltrada;                
                    
               }               
                // Fin vista de finanzas para el gobernador CASO ESPECIAL
               // vista caso especial gobernador
                 let memoVistaGobernador;
                  const listaVistaGobernador : any = [];
               if( item === SECRETARIO_GOBERNADOR_ITEM){
                     const cargoIDGabinete = cargoResult.find((c) => c.props.nombre.includes(JEFE_GABINETE))?.id|| "-"; 	                    
                     const idGabinete = personalResult.find((c) => c.props.cargoId === cargoIDGabinete && c.props.activo )?.props.usuarioId|| "-";                                 
                     memoVistaGobernador = result.filter( (memo) => memo.cod_depart_memo.includes(GABINETE_DESPACHO));                                            
                     const memoGabinete = result.filter((memo) => memo.usuario_id === idGabinete);                     
                     memoVistaGobernador.forEach(item =>!listaFiltrada.some(x => x.cod_depart_memo === item.cod_depart_memo)
                     && listaVistaGobernador.push(item)); 
                     listaVistaGobernador.push(...memoGabinete);
                    
                    
               }               
               //fin vista caso especial gobernador
                // fin verificacion de vistas segun cite  
               if(item === SECRETARIO_GOBERNADOR_ITEM)   {
                  listaFiltradaPorUsuario = listaVistaGobernador;                                       
               } else{
                  listaFiltradaPorUsuario = listaFiltrada;    
               }              
             
                
            }else if(authUser.roles === TECNICO_GENERAL_VIATICOS){
                //CAsos especial secretarios      
                const memoSecretarios = result.filter((memo) => memo.cod_depart_memo.includes(GABINETE_DESPACHO));//listaFiltradaJerarquia.filter((memo) => idsAperturaVisibles.includes(memo.apertura_viatico));//                                      
				listaFiltradaPorUsuario = memoSecretarios;			
               //Fin caso Especial Secretarios
            }else if(authUser.roles === ENUM_TECNICO_RRHH){                
                listaFiltradaPorUsuario = result.filter((a)=> ESTADOS_RRHH.has(a.estado_memorandum) ||a.estado_modificacion === ENUM_OBSERVADO);  
            }else if(authUser.roles === ENUM_ENCARGADO_VIATICOS){
                listaFiltradaPorUsuario = result.filter((a)=>  ESTADOS_ENCARGADO.has(a.estado_memorandum) || a.estado_modificacion === ENUM_OBSERVADO);                
            }else{
                listaFiltradaPorUsuario = result; 			
                
            }
        
            /*fin Filtrado*/
            listaFiltradaPorUsuario.sort((a, b) => moment(a.fecha_memo_registro).toDate() < moment(b.fecha_memo_registro).toDate() ? 1 : -1)
             
            const response = findAndCountResult(listaFiltradaPorUsuario, query);		
              return Result.ok(response);
    }
   
 
    public async getMemorandumsUserTable(authUser: AuthUser, query: any): Promise<Result<{ rows: MemorandumTableModel[] }>> {
            const ID_USUARIO = authUser.uid;
            const memorandum = await MemorandumService.getAll();
            if (memorandum.isFailure) return Result.fail("Falló al obtener la Memorandum");
            let memorandumResult = memorandum.getValue();
            if(ID_USUARIO) memorandumResult = memorandum.getValue().filter((a) => a.props.usuarioId === ID_USUARIO);
            /*procedimiento de verificacion de rol*/
            const usuarioResult = await UsuarioService.getById(ID_USUARIO);
            if (usuarioResult.isFailure) return Result.fail("Falló al obtener la usuario");
            const ID_ROLE = usuarioResult.getValue().props.roleId;
            const rolesResult = await RoleService.getById(ID_ROLE);
            const permisos = JSON.parse(rolesResult.getValue().props.permisos);
            const is_approve = typeof permisos.approve !== 'undefined'? permisos.approve: false;
            
            if (authUser.superadministrador || is_approve) memorandumResult = memorandum.getValue();

           /*Listado de usuarios*/
            const usuarios = await UsuarioService.getAll();
            if(usuarios.isFailure) return Result.fail("Fallo al obtener el Usuario");
            const usuariosResult = usuarios.getValue();
            /*Listado de apertura viatico*/
            const aperturaViatico = await AperturaViaticoService.getAll();
            if(aperturaViatico.isFailure) return Result.fail("Fallo al obtener la Apertura Viatico");
            const aperturaViaticoResult = aperturaViatico.getValue();
            /*Listado de vehiculos*/
            const vehiculo = await VehiculoService.getAll();
            if(vehiculo.isFailure) return Result.fail("Fallo al obtener el Vehiculo");
           // const vehiculoResult = vehiculo.getValue();
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
            const detalleDestino = await DetalleDestinoService.getAll();
            if (detalleDestino.isFailure) return Result.fail("Falló al obtener la Area");
            /*Lista de destinos*/
            const listaDestinos: DetalleDestinoOptionsFormModel[] = detalleDestino
                                                                    .getValue()
                                                                    .map((value) => {                
                                                                            return {                
                                                                                id: value.id.toString(),
                                                                                nombre: value.props.memorandumId,
                                                                                caption : value.props.destinoReg,                                             
                                                                            };            
                                                                    });     
            const result: MemorandumTableModel[] = memorandumResult.map((item) => {

               /**seleccionamos del listado de area el nombre del departamento y su sigla*/
               const usuarioNombre = usuariosResult.find((c) => c.id === item.props.usuarioId)?.props.fullname|| "-";//Revisar
               const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === item.props.usuarioId)?.props.cargoId|| "-";
               const cargoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.nombre|| "-";
               const usuarioCI = usuariosResult.find((c) => c.id === item.props.usuarioId)?.props.ci|| "-";
               const usuarioNumCelular = usuariosResult.find((c) => c.id === item.props.usuarioId)?.props.celular|| "-";        
               const codAperturaViatico = aperturaViaticoResult.find((c) => c.id === item.props.aperturaViaticoId)?.props.aperturaProgramatica|| "-";// revisar sesta parte
               const AreaApertura = aperturaViaticoResult.find((c) => c.id === item.props.aperturaViaticoId)?.props.areaId|| "-";// revisar sesta parte
               const nombreAreaApertura = areaResult.find((c) => c.id === AreaApertura)?.props.nombre|| "-";// revisar sesta parte
               const presupuestoInicialApertura = aperturaViaticoResult.find((c) => c.id === item.props.aperturaViaticoId)?.props.presupuestoInicial|| 0;// revisar sesta parte
               const presupuestoRestanteApertura = aperturaViaticoResult.find((c) => c.id === item.props.aperturaViaticoId)?.props.presupuestoRestante|| 0;// revisar sesta parte
             
                // Se filta por los id de memo
                const filtroDestinos : DetalleDestinoOptionsFormModel [] = listaDestinos
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
                    apertura_viatico       : codAperturaViatico,
                    nombre_area_apertura   : nombreAreaApertura,
                    presupuesto_inicial    : presupuestoInicialApertura,
                    presupuesto_restante   : presupuestoRestanteApertura,
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
                    apertura_viatico_id    : item.props.aperturaViaticoId,
                    usuario_id             : item.props.usuarioId,

                    modificacion            : item.props.modificacion,
                    obs_modificacion        : item.props.obsModificacion,
                    fecha_cambio            : item.props.fechaCambio,
                    estado_modificacion     : item.props.estadoModificacion,
                    
                    conteo_dias_detalle    : cantidadDiasDetalleDestino,
                    fecha_memo_format      :item.props.fechaMemoRegistro?moment(item.props.fechaMemoRegistro).format("DD/MM/YYYY").toString(): '',
                    justificacion           : item.props.justificacion,
                     aprobacion_rrhh_conta     : item.props.aprobacionRRHHconta,
                    tiempo_aprobacion_usuario : item.props.tiempoAprobacionUsuario,
                };
            }).sort((a, b) => moment(a.fecha_memo_registro).toDate() < moment(b.fecha_memo_registro).toDate() ? 1 : -1);

            const response = findAndCountResult(result, query);
            return Result.ok(response);
    }
    public async getMemorandumsSolicitadaUserTable(authUser: AuthUser, query: any): Promise<Result<{ rows: MemorandumTableModel[] }>> {
            const ID_USUARIO = authUser.uid;
            const memorandum = await MemorandumService.getAll();
            if (memorandum.isFailure) return Result.fail("Falló al obtener la Memorandum");
            const memorandumResult = memorandum.getValue().filter((a) => a.props.autorizadoPor[0] === ID_USUARIO);
                        
           /*Listado de usuarios*/
            const usuarios = await UsuarioService.getAll();
            if(usuarios.isFailure) return Result.fail("Fallo al obtener el Usuario");
            const usuariosResult = usuarios.getValue();
            /*Listado de apertura viatico*/
            const aperturaViatico = await AperturaViaticoService.getAll();
            if(aperturaViatico.isFailure) return Result.fail("Fallo al obtener la Apertura Viatico");
            const aperturaViaticoResult = aperturaViatico.getValue();
            /*Listado de vehiculos*/
            const vehiculo = await VehiculoService.getAll();
            if(vehiculo.isFailure) return Result.fail("Fallo al obtener el Vehiculo");
           // const vehiculoResult = vehiculo.getValue();
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
            const detalleDestino = await DetalleDestinoService.getAll();
            if (detalleDestino.isFailure) return Result.fail("Falló al obtener la Area");
            /*Lista de destinos*/
            const listaDestinos: DetalleDestinoOptionsFormModel[] = detalleDestino
                                                                    .getValue()
                                                                    .map((value) => {                
                                                                            return {                
                                                                                id: value.id.toString(),
                                                                                nombre: value.props.memorandumId,
                                                                                caption : value.props.destinoReg,                                             
                                                                            };            
                                                                    });     
            const result: MemorandumTableModel[] = memorandumResult.map((item) => {

               /**seleccionamos del listado de area el nombre del departamento y su sigla*/
               const usuarioNombre = usuariosResult.find((c) => c.id === item.props.usuarioId)?.props.fullname|| "-";//Revisar
               const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === item.props.usuarioId)?.props.cargoId|| "-";
               const cargoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.nombre|| "-";
               const usuarioCI = usuariosResult.find((c) => c.id === item.props.usuarioId)?.props.ci|| "-";
               const usuarioNumCelular = usuariosResult.find((c) => c.id === item.props.usuarioId)?.props.celular|| "-";              
               const codAperturaViatico = aperturaViaticoResult.find((c) => c.id === item.props.aperturaViaticoId)?.props.aperturaProgramatica|| "-";// revisar sesta parte
               const AreaApertura = aperturaViaticoResult.find((c) => c.id === item.props.aperturaViaticoId)?.props.areaId|| "-";// revisar sesta parte
               const nombreAreaApertura = areaResult.find((c) => c.id === AreaApertura)?.props.nombre|| "-";// revisar sesta parte
               const presupuestoInicialApertura = aperturaViaticoResult.find((c) => c.id === item.props.aperturaViaticoId)?.props.presupuestoInicial|| 0;// revisar sesta parte
               const presupuestoRestanteApertura = aperturaViaticoResult.find((c) => c.id === item.props.aperturaViaticoId)?.props.presupuestoRestante|| 0;// revisar sesta parte
             
                // Se filta por los id de memo
                const filtroDestinos : DetalleDestinoOptionsFormModel [] = listaDestinos
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
                    apertura_viatico       : codAperturaViatico,
                    nombre_area_apertura   : nombreAreaApertura,
                    presupuesto_inicial    : presupuestoInicialApertura,
                    presupuesto_restante   : presupuestoRestanteApertura,
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
                    apertura_viatico_id    : item.props.aperturaViaticoId,
                    usuario_id             : item.props.usuarioId,
                    
                    modificacion            : item.props.modificacion,
                    obs_modificacion        : item.props.obsModificacion,
                    fecha_cambio            : item.props.fechaCambio,
                    estado_modificacion     : item.props.estadoModificacion,

                    conteo_dias_detalle    : cantidadDiasDetalleDestino,
                    fecha_memo_format      :item.props.fechaMemoRegistro?moment(item.props.fechaMemoRegistro).format("DD/MM/YYYY").toString(): '',
                    justificacion          : item.props.justificacion,
                     aprobacion_rrhh_conta     : item.props.aprobacionRRHHconta,
                    tiempo_aprobacion_usuario : item.props.tiempoAprobacionUsuario,
                };
            }).sort((a, b) => moment(a.fecha_memo_registro).toDate() < moment(b.fecha_memo_registro).toDate() ? 1 : -1);
            
            const response = findAndCountResult(result, query);
            return Result.ok(response);
    }

    public async getMemorandumFormDataView(authUser: AuthUser,id_memorandum: string): Promise<Result<MemorandumFormDataResponse>> {
        const memorandum = await MemorandumService.getById(id_memorandum);
        if (memorandum.isFailure) return Result.fail<MemorandumFormDataResponse>("Memorandum no encontrado");
        
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
       
        const aperturaViatico = await AperturaViaticoService.getAll();
        if(aperturaViatico.isFailure) return Result.fail("Fallo al obtener la Apertura Viatico");
        const aperturaViaticoResult = aperturaViatico.getValue();

        //seleccionamos del listado de area el nombre del departamento y su sigla
       const usuarioNombre = usuarioResult.find((c) => c.id === props.usuarioId)?.props.fullname|| "-";//Revisar
       const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === props.usuarioId)?.props.cargoId|| "-";
       const cargoUsuario = cargoResult.find((c) => c.id === cargoUsuarioid)?.props.nombre|| "-";
       const usuarioCI = usuarioResult.find((c) => c.id === props.usuarioId)?.props.ci|| "-";
       const usuarioNumCelular = usuarioResult.find((c) => c.id === props.usuarioId)?.props.celular|| "-";

       const presupuestoRestanteViatico = aperturaViaticoResult.find((c) => c.id === props.aperturaViaticoId)?.props.presupuestoRestante|| 0;
       const estadoPresupuestoViatico = aperturaViaticoResult.find((c) => c.id === props.aperturaViaticoId)?.props.estado|| "-";
       const presupuestoRestantePasaje = aperturaViaticoResult.find((c) => c.id === props.aperturaPasajeId)?.props.presupuestoRestante|| 0;
       const estadoPresupuestoPasaje = aperturaViaticoResult.find((c) => c.id === props.aperturaPasajeId)?.props.estado|| "-";

        const result: MemorandumFormDataResponse = {
            id                     : memorandum.getValue().id,    
            cod_depart_memo        : props.codDepartMemo,
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
            apertura_viatico_id    : props.aperturaViaticoId,
            apertura_pasaje_id     : props.aperturaPasajeId,
            usuario_id             : props.usuarioId,
          
            modificacion            : props.modificacion,
            obs_modificacion        : props.obsModificacion,
            fecha_cambio            : props.fechaCambio,
            estado_modificacion     : props.estadoModificacion,
            justificacion           : props.justificacion,
            // Datos usuario

            nombre_usuario     : usuarioNombre,
            ci                 : usuarioCI,
            cargo_usuario      : cargoUsuario,
            nume_celular       : usuarioNumCelular,
            conteo_dias_detalle: 0,
            usuario_admin       : authUser.uid,

            presupuesto_viatico         : presupuestoRestanteViatico,
            estado_presupuesto_viatico  : estadoPresupuestoViatico,           
            presupuesto_pasaje         : presupuestoRestantePasaje,
            estado_presupuesto_pasaje  : estadoPresupuestoPasaje,
            aprobacion_rrhh_conta     : props.aprobacionRRHHconta,
            tiempo_aprobacion_usuario : props.tiempoAprobacionUsuario,
			
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
    
    const memorandum = await MemorandumService.getById(id_memorandum)
    if (memorandum.isFailure) return Result.fail<MemorandumFormDataResponse>("Falló al obtener la Memorandum");
    const props = memorandum.getValue().props;

   /*Listado de usuarios*/
    const usuario = await UsuarioService.getAll();
    if(usuario.isFailure) return Result.fail("Fallo al obtener el Usuario");
    const usuarioResult = usuario.getValue();
    /*Listado de apertura viatico*/
    const aperturaViatico = await AperturaViaticoService.getAll();
    if(aperturaViatico.isFailure) return Result.fail("Fallo al obtener la Apertura Viatico");
    const aperturaViaticoResult = aperturaViatico.getValue();
    /*Listado de vehiculos*/
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
    const detalleDestino = await DetalleDestinoService.getAll();
    if (detalleDestino.isFailure) return Result.fail("Falló al obtener la DetalleDestino");
    const detalleDestinoResult = detalleDestino.getValue();
   
    /* listado de actividades */
    const escalaDestino = await EscalaDestinoService.getAll();
    if (escalaDestino.isFailure) return Result.fail('Falló al obtener la detalleDestino');  
    const escalaDestinoResult = escalaDestino.getValue();   
     //seleccionamos del listado de area el nombre del departamento y su sigla
     const destino = detalleDestinoResult.find((c) =>c.props.memorandumId === id_memorandum)?.props.destinoReg|| "-";//Revisar     
     const destinoNombre = escalaDestinoResult.find((c) =>c.id === destino)?escalaDestinoResult.find((c) =>c.id === destino)?.props.destino|| "-":destino;
     
     
  //  const placa = vehiculoResult.find((c) => c.id === props.vehiculoId)?.props.numPlaca|| "-";
    const listaDestinos: detalleDestinoItem [] = detalleDestino
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
            pasaje_ida               : item.props.pasajeIda,
            pasaje_retorno           : item.props.pasajeRetorno,
            total_pasaje_dia         : item.props.totalPasajedia,
            tipo_vehiculo_opvida     : item.props.tipoVehiculoOPIda,
            tipo_vehiculo_opvuelta   : item.props.tipoVehiculoOPVuelta,
            memorandum_id            : item.props.memorandumId,
            viatico_id               : item.props.viaticoId,
            vehiculo_id              : item.props.vehiculoId,
            estado                    : item.props.estado,
            destino_id               : item.props.destinoId,
           destino_id2               : item.props.destinoId2,
            //aumentando campos
          // num_placa : placa,    
        };
    }) ; 
   
// Se filta por los destinos por id memorandum
const filtroDestinos1 : detalleDestinoItem [] = listaDestinos
.filter((item) => this.filtrarId(item.memorandum_id, id_memorandum));

// se filtran auqellos que no tienen SIN_VIAJE en el estado
const filtroDestinos : detalleDestinoItem [] = filtroDestinos1
.filter((item) => this.filtrarEstadoDestino(item.estado, 'SIN_VIAJE'));

//ordenando por fechas
//filtroDestinos.sort((a, b) => a.fecha_dia > b.fecha_dia ? 1 : -1)
const parseFecha = (f: string) => {
    const [d, m, y] = f.split("/");
    return new Date(+y, +m - 1, +d).getTime();
};

filtroDestinos.sort((a, b) => parseFecha(a.fecha_dia) - parseFecha(b.fecha_dia));
filtroDestinos1.sort((a, b) => parseFecha(a.fecha_dia) - parseFecha(b.fecha_dia));

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

        
     //Apertura Viatico
    const codAperturaViatico = aperturaViaticoResult.find((c) => c.id === props.aperturaViaticoId)?.props.aperturaProgramatica|| "-";// revisar sesta parte
    const AreaApertura = aperturaViaticoResult.find((c) => c.id === props.aperturaViaticoId)?.props.areaId|| "-";// revisar sesta parte
    const nombreAreaApertura = areaResult.find((c) => c.id === AreaApertura)?.props.nombre|| "-";// revisar sesta parte
    const presupuestoInicialApertura = aperturaViaticoResult.find((c) => c.id === props.aperturaViaticoId)?.props.presupuestoInicial|| 0;// revisar sesta parte
    const presupuestoRestanteApertura = aperturaViaticoResult.find((c) => c.id === props.aperturaViaticoId)?.props.presupuestoRestante|| 0;// revisar sesta parte
    const fuente = aperturaViaticoResult.find((c) => c.id === props.aperturaViaticoId)?.props.codFte|| "-";
    const org = aperturaViaticoResult.find((c) => c.id === props.aperturaViaticoId)?.props.codOrg|| "-";
    const sisin = aperturaViaticoResult.find((c) => c.id === props.aperturaViaticoId)?.props.sisin|| "-";
    const ffyOrg = fuente.concat(' - ').concat(org);
    //llenasmo lista gestion de fechas
    const listaFechaPernocte: MemorandumProcesoFechas [] = [];
    for (let i = 0; i < filtroDestinos.length; i++) {
         listaFechaPernocte.push({fecha_dia: filtroDestinos[i].fecha_dia,pernocte: filtroDestinos[i].pernocte,estado: filtroDestinos[i].estado});
    }   
    //ordenamos fechas
    const listaFechaOrdenada = this.ordenarFechas(listaFechaPernocte);
    //generamos la lista a mostrara en reporte
    const listaFechaPernocteLlena = this.generarFechasMemorandum(listaFechaOrdenada, filtroDestinos1);
    let count = 0;
    //recupera datos para mostrar en la tabla del modulo
    const fechaMemoRegistro = this.formatearFechaEncabezado(props.fechaMemoRegistro?moment(props.fechaMemoRegistro).format("DD/MM/YYYY").toString(): '');

     //datos jefe
     const jefesObject = props.autorizadoPor || [];				
     const listaJefes: any[] = [];
     //  lista de fechas 
      const tiempoAprobacionUsuarioObject = props.tiempoAprobacionUsuario || [];      
          
      //sacar el nombre completo del jefe y unirlo al id
     jefesObject.forEach((e: any) => {
         const jefe = usuarioResult.find((r) => r.id === e);
         const cargoJefe = personalResult.find((c)=> c.props.usuarioId === e)?.props.cargoId|| "-";
         //eliminar jefe si repite en la lista de rrhh y conta esto sirve para verificar si pasaron por todos por la aprobacion 
        

         if (jefe && ESTADOS_PERMITIDOS_CONTA.includes(props.estadoMemorandum)) {        
             const cargoNombreJefe = cargoResult.find((r)=> r.id === cargoJefe)?.props.nombre|| "-";
             const palabras = cargoNombreJefe.trim().split(' ');
             const primeraPalabra = palabras[0].replace(/\(.*?\)/g, '').toLocaleUpperCase();                
             const concatenaAprove = "APROBADO_".concat(primeraPalabra);
             const tiempo = tiempoAprobacionUsuarioObject.shift()  || '--'; // obtiene y elimina el primero            
             const propsJefe = {
                 id      : jefe.id,
                 fullname     : jefe.props.fullname,              
                 cargo    : cargoNombreJefe,  
                 aprobado : concatenaAprove.concat("/").concat(jefe.props.fullname),//.concat(" - ").concat(tiempo!),           
             };
             listaJefes.push(propsJefe);
             
         }else {             
             const propsJefe = {             
                 aprobado : ENUM_PENDIENTE_DE_APROBAR,
             };
             listaJefes.push(propsJefe);
		
         }
     });

    //usuario y tiempo de aprobacion
    // datos lista de usuarios 
     const aprobacionRRHHcontaObject = props.aprobacionRRHHconta || [];
     const listaAprobacionUsuarios = aprobacionRRHHcontaObject.filter(item => !jefesObject.includes(item));
     let usuarioRRHH =""; let usuarioContabilidad="";
     for (let i = 0; i < listaAprobacionUsuarios.length; i++) {
         const usuario = usuarioResult.find((r) => r.id === listaAprobacionUsuarios[i]);
         if (i === 0) usuarioRRHH = usuario?.props.fullname || "-";        
         if (i === 1) usuarioContabilidad = usuario?.props.fullname || "-";
     }
    
     

     //aprobado por RRHH
     let verificadoRRHH;
          
    if (ESTADOS_PERMITIDOS_RRHH.includes(props.estadoMemorandum)) {
        const tiempo = tiempoAprobacionUsuarioObject.shift() || '--'; // obtiene y elimina el primero
        verificadoRRHH = ENUM_VERIFICADO_RRHH.concat("/").concat(usuarioRRHH!);//.concat(" - ").concat(tiempo!);
     }else{
        verificadoRRHH = ENUM_PENDIENTE_RRHH;		
     }

     //aprobado por CONTABILIDAD
     let aprobadoContabilidad;
        
     if(props.estadoMemorandum === ENUM_APROBADO_CONTABILIDAD){
        const tiempo = tiempoAprobacionUsuarioObject.shift()  || '--'; // obtiene y elimina el primero  
        aprobadoContabilidad = ENUM_APROBADO_CONTABILIDAD.concat("/").concat(usuarioContabilidad!);//.concat(" - ").concat(tiempo!); 				
     }else{
        aprobadoContabilidad = ENUM_PENDIENTE_CONTABILIDAD;		
     }

     //Si es gobernador
      const cargoID = personalResult.find((c) => c.props.usuarioId=== props.usuarioId && c.props.activo)?.props.cargoId|| "-"; 	                      
      const cargoNombre = cargoResult.find((c) => c.id=== cargoID)?.props.nombre|| "-"; 	      
        let tipoMemorandum = "";
        let usuarioNombreFinanzas = "";
        let ciFinanzas="";
        let usuarioCargoFinanzas= "";
        let contratoFinanzas = "";
        let numeCelularFinanzas="";
      if(cargoNombre.includes(GOBERNADOR)){  	                     
        tipoMemorandum =  MEMORANDUM_INSTRUCCION;
        usuarioCargoFinanzas = cargoResult.find((c) => c.props.item === SECRETARIO_SDAFP_ITEM )?.props.nombre|| "-"; 	
        //const cargoIDFinanzas = cargoResult.find((c) => c.props.item === SECRETARIO_SDAFP_ITEM )?.id|| "-";       
        const usuarioIDFinanzas = jefesObject[0];//personalResult.find((c) => c.props.cargoId=== cargoIDFinanzas  && c.props.activo)?.props.usuarioId; 
        usuarioNombreFinanzas = usuarioResult.find((c) => c.id === usuarioIDFinanzas)?.props.fullname|| "-";
        ciFinanzas  = personalResult.find((c) => c.props.usuarioId=== usuarioIDFinanzas)?.props.ci|| "-"; 
        contratoFinanzas = SECRETARIO_SDAFP_ITEM; 
        numeCelularFinanzas = usuarioResult.find((c) => c.id === usuarioIDFinanzas)?.props.celular|| "-";
      }
     //FIN ES GOBERNADOR
    const result: MemorandumData = {	
        info: {
           
            usuario_nombre         : usuarioNombre,
            usuario_cargo          : cargoUsuario,
            ci                     : usuarioCI ,
            nume_celular           : usuarioNumCelular, 
           // num_placa              : placaVehiculo,
            cod_depart_memo        : props.codDepartMemo,
            apertura_viatico       : codAperturaViatico,
            nombre_area_apertura   : nombreAreaApertura,
            presupuesto_inicial    : presupuestoInicialApertura,
            presupuesto_restante   : presupuestoRestanteApertura,
            autorizado_por         : listaJefes,//nombreJefe,
            cargo_jefe_unidad      : "",//cargoNombreJefe,
            fecha_memo_registro    : fechaMemoRegistro,//props.fechaMemoRegistro?moment(props.fechaMemoRegistro).format("DD/MM/YYYY").toString(): '',
            tipo_comision_idp      : props.tipoComisionIDP,
            fecha_inicio_viaje     : props.fechaInicioViaje?moment(props.fechaInicioViaje).format("DD/MM/YYYY").toString(): '',
            fecha_fin_viaje        : props.fechaFinViaje?moment(props.fechaFinViaje).format("DD/MM/YYYY").toString(): '',
            cantidad_dias          : props.cantidadDias,
            tipo_memo_repo         : props.tipoMemoRepo,
            tipo_transporte        : props.tipoTransporte,
            observacion            : props.observacion,
            estado_memorandum      : props.estadoMemorandum,
            notificacion_memo      : props.notificacionMemo,
            ffyOrg                 : ffyOrg,
            sisin                  : sisin,
            contrato : String(contratoUsuario),
            conteo_dias_detalle    : conteoDiasDetalle,
            usuario_a_cargo        :usuarioaCargoResult.fullname,
            usuario_sigla          : usuarioSigla,
            aprobado_rrhh          : verificadoRRHH,
            aprobado_contabilidad  : aprobadoContabilidad,
            tipo_memorandum        : tipoMemorandum,
            
             usuario_nombre_finanzas  : usuarioNombreFinanzas,
            ci_finanzas               : ciFinanzas,
            usuario_cargo_finanzas    : usuarioCargoFinanzas,
            contrato_finanzas         : contratoFinanzas,
            nume_celular_finanzas     : numeCelularFinanzas,
           // aprobacion_rrhh_conta     : props.aprobacionRRHHconta,
            //tiempo_aprobacion_usuario : props.tiempoAprobacionUsuario,
            codigoQR    : `${props.codDepartMemo}-       
            ${id_memorandum}-        
            ${moment(props.fechaMemoRegistro).format("DD/MM/YYYY").toString()}-                  
            ${props.tipoMemoRepo}-                     
            ${codAperturaViatico}-               
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
                        const destinoFecha = detalleDestinoResult.find((c) => c.props.memorandumId === id_memorandum && moment(c.props.fechaDia).format("DD/MM/YYYY").toString() === item.fecha_dia)?.props.destinoReg||"-";						
						const destinoNombreFecha = escalaDestinoResult.find((c) =>c.id === destinoFecha)?escalaDestinoResult.find((c) =>c.id === destinoFecha)?.props.destino|| "-":destinoFecha;
					
                        count ++;
                          
                            return {
                                id                       : String(item.id),
                                tipo_vehiculo_op         : vehiculoOP,//item.tipo_vehiculo_op,
                                objetivo_viaje           : item.objetivo_viaje,
                                destino_reg              : destinoNombreFecha,//item.destino_reg,
                                fecha_dia                : item.fecha_dia,//?moment(item.fecha_dia).format("DD/MM/YYYY").toString(): '',
                                hora_inicio              : item.hora_inicio,
                                hora_fin                 : item.hora_fin,
                                pernocte                 : item.pernocte,
                                pasaje_ida               : item.pasaje_ida,
                                pasaje_retorno           : item.pasaje_retorno,
                                total_pasaje_dia         : item.total_pasaje_dia,
                                 tipo_vehiculo_opvida    : item.tipo_vehiculo_opvida,
                                 tipo_vehiculo_opvuelta  : item.tipo_vehiculo_opvuelta,
                                 estado                  : item.estado,
                                memorandum_id            : item.memorandum_id,
                                viatico_id               : item.viatico_id,
                                vehiculo_id              : placaVehiculo,
                                destino_id               : item.destino_id,
                                destino_id2              : item.destino_id2,

                                fecha_inicio :fechaDiaInicio,
                                fecha_fin    : fechaDiafin,
                                observacion : observacion,
                                num_placa   : tipoVehiculo,  
                              
                           }
                           
                   
                }),
                
        },        
  }     
 
    return Result.ok(result);

	

}


//Se agrega memorandum detalle
public async getTableMemorandumDetalle(authUser: AuthUser, query: any, memorandum_id: string): Promise<Result<{ rows: DetalleDestinoTableModel[] }>> {
    const ID_USUARIO = authUser.uid;
    const usuario = await UsuarioService.getById(ID_USUARIO);
    if (usuario.isFailure) throw new Error(String(usuario.error));

    const usuarios = await UsuarioService.getAll(); 
    if (usuarios.isFailure) Result.fail(String(usuarios.error));
   // const usuarioResult = usuarios.getValue();
    
    /* listado de actividades */
    const detalleDestino = await DetalleDestinoService.getAll();
    if (detalleDestino.isFailure) return Result.fail('Falló al obtener la detalleDestino');        
    const detalledestinoResult = detalleDestino.getValue().filter((a) => a.props.memorandumId === memorandum_id);
   
    /* listado general de la tabla actividades ordenados */
    const result: DetalleDestinoTableModel[] = detalledestinoResult.sort((a, b) => a.props.horaInicio > b.props.horaFin ? 1 : -1).map((item)=> {
              
        return {
            id                       : String(item.id),          
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
            memorandum_id            : item.props.memorandumId,
            viatico_id               : item.props.viaticoId,
            vehiculo_id              : item.props.vehiculoId,
            destino_id               :item.props.destinoId,          
        };
    });

    
    const response = findAndCountResult(result, query);
    return Result.ok(response);
}
//Se envia el tipo de PCP seleccionando en memorandum
public async getTipoPCP(id_memorandum: string): Promise<Result<MemorandumTipoPCPOptionsFormModel>> {
    const memorandum = await MemorandumService.getById(id_memorandum);
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
    const memorandum = await MemorandumService.getById(id_memorandum);
    if (memorandum.isFailure) return Result.fail<ConteoDestinoPCPOptionsFormModel>("Memorandum no encontrado");
    const memorandumResult = memorandum.getValue();   
 /*Listado de Detalle destino*/
    const detalleDestino =await DetalleDestinoService.getAll();
    if(detalleDestino.isFailure) return Result.fail("Fallo al obtener los detalles destinos");
    //Cantidad de dias del memo
    const cantidadDiasMemo:number = await MemorandumService.contarDiasHabilesRango(memorandumResult.props.fechaInicioViaje,memorandumResult.props.fechaFinViaje); 
     //Lista de destinos
     const listaDestinos: DetalleDestinoOptionsFormModel[] = detalleDestino
        .getValue()
        .map((item) => {                
                return {                
                    id: item.id.toString(),
                    nombre: item.props.memorandumId,
                    caption : item.props.destinoReg,                                             
                };            
        }) ; 
    // Se filta por los destinos
    const filtroDestinos : DetalleDestinoOptionsFormModel [] = listaDestinos
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
   public static async filtrarId(item:string, id:string) { 
    return (item === id); 
 } 
  public static async filtrarEstadoDestino(item:string, estado:string) { 
    return (item != estado); 
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

        fechasOrdenadas.push({fecha_dia:`${diaSemana} ${dia}/${mes}/${año}`,pernocte: listaPernocte[i].pernocte, estado: listaPernocte[i].estado});
    }   

    return fechasOrdenadas;

 }



 //Realizacion de lista de fechas para Reportes
 /*public generarFechasMemorandum(listaPernocte:MemorandumProcesoFechas[]) {
  
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
	
	
 } */

    public generarFechasMemorandum(listaPernocte: MemorandumProcesoFechas[], listaCompleta: MemorandumProcesoFechas[]) {
	

    const result: MemorandumTablaReporte[] = [];

    let viajeAbierto = false;
    const observacionCompleta = listaCompleta
    .map(item =>
        `${item.fecha_dia} : ${
            item.estado === "SIN_VIAJE"
                ? item.estado
                : item.pernocte
        }`
    )
    .join(", ");

    for (const item of listaPernocte) {

        
        //-----------------------------------------
        // SIN VIAJE
        //-----------------------------------------
        if (item.estado === "SIN_VIAJE") {

            // Si quieres mostrar los días sin viaje:
            result.push({
                fecha_inicio: "",
                fecha_fin: "",
                pernocte: item.pernocte,
                observacion: "",
            });

            continue;
        }

        //-----------------------------------------
        // CON PERNOCTE
        //-----------------------------------------
        if (item.pernocte === "CON PERNOCTE") {

            if (!viajeAbierto) {

                viajeAbierto = true;

                result.push({
                    fecha_inicio: item.fecha_dia,
                    fecha_fin: "",
                    pernocte: item.pernocte,
                    observacion: "",
                });

            } else {

                result.push({
                    fecha_inicio: "",
                    fecha_fin: "",
                    pernocte: item.pernocte,
                    observacion: "",
                });

            }

            continue;
        }

        //-----------------------------------------
        // SIN PERNOCTE
        //-----------------------------------------
        if (viajeAbierto) {

            viajeAbierto = false;

            result.push({
                fecha_inicio: "",
                fecha_fin: item.fecha_dia,
                pernocte: item.pernocte,
                observacion:"",
            });

        } else {

            // Ida y vuelta el mismo día

            result.push({
                fecha_inicio: item.fecha_dia,
                fecha_fin: item.fecha_dia,
                pernocte: item.pernocte,
                observacion: "",
            });

        }

    }

    if (result.length > 0) {
          result[0].observacion = observacionCompleta;
    }

    if (viajeAbierto) {
        throw new Error("Existe un viaje con pernocte sin fecha de retorno.");
    }

    return result;
}

 //Se envia datos requeridos del memorandum
 public async getDatosMemorandum(id_memorandum: string): Promise<Result<MemorandumModelDetalle>> {
    const memorandum = await MemorandumService.getById(id_memorandum);
    if (memorandum.isFailure) return Result.fail<MemorandumFormDataResponse>("Memorandum no encontrado");    
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

      
     const result: MemorandumModelDetalle = {
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
    const memorandum = await MemorandumService.getById(id_memorandum);
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
    const memorandum = await MemorandumService.getAll();
    if(memorandum.isFailure) return Result.fail("Fallo al obtener el memorandum");
    const memorandumResult = memorandum.getValue();
     
    /* listado general de la tabla area ordenados */
    const result: MemorandumCite[] = await Promise.all(
        memorandumResult.map(async (item) => {                 
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

public async getCiteServer(id_usuario: string): Promise<Result<{ rows: string[]; count: number }>> {
    /*Listado de areas*/
    const memorandum = await MemorandumService.getAll();
    if(memorandum.isFailure) return Result.fail("Fallo al obtener el memorandum");
    const memorandumResult = memorandum.getValue();

    const personal = await PersonalService.getAll();
    if(personal.isFailure) return Result.fail("Fallo al obtener el personal");
    const personalResult = personal.getValue();

    const area = await AreaService.getAll();
    if(area.isFailure) return Result.fail("Fallo al obtener el area");
    const areaResult = area.getValue();
    
    const areaUsuario = personalResult.find((c) => c.props.usuarioId === id_usuario)?.props.areaId ||"-";	
    const indiceArea  = areaResult.find((c)=> c.id === areaUsuario)?.props.indice ||"-";	
    const findCite = (await AreaService.getIndicePorSigla(indiceArea, areaResult)).getValue();    
    const allCites = (await this.getAllCites()).getValue().rows;

     //Verificando el Cite mayor
    let auxMayor = 0;
    let citeMayor = "";
    let nuevoCodigo = "";
    const listaCites = [];

    if(findCite.length > 0 ){

        for(let i=0; i < allCites.length; i++){
			const regex = /([^\n]+?) Nº \d+\/\d{4}/g;		
            const matches = allCites[i].nombre.match(regex) || [];			

            const filtered = matches.filter(match => {
                const [path] = match.split(' Nº');
                return path.trim() === findCite;
              });

            if(filtered.length > 0){	

                if(Number(allCites[i].caption) > auxMayor){
                  auxMayor = Number(allCites[i].caption);
                  citeMayor = allCites[i].nombre;

                }
            }
         }

         // generando el cite
         const fechaActual = new Date();        
         const anioActual = fechaActual.getFullYear();
         const nuevoNumero = (auxMayor + 1).toString().padStart(3, '0'); // Formato con ceros a la izquierda
         nuevoCodigo = `${findCite} Nº ${nuevoNumero}/${anioActual}`;
        
    }else{
         nuevoCodigo = "No exite Cite para este Usuario, debe registrarse correctamente";       

    }

    /*const listaCites = [
        { value: nuevoCodigo, label: nuevoCodigo },
      ];*/
      listaCites.push(nuevoCodigo);

     //  return listaCites;  
  return Result.ok({ rows: listaCites, count: listaCites.length });
} 

public extraerNumero(texto: string): number {
    const match = texto.match(/Nº\s+0*(\d+)\//);
    return match ? parseInt(match[1], 10) : -1; // Usa -1 si no se encuentra número
  }
//Excel memorandum 

  // Excel de RRHH
  public static async generarFilasExcel(authUser: AuthUser, queryString: any, id?: string, listaIds?: string[], fechaInicio?: string, fechaFin?: string): Promise<Result<MemorandumDataResponse>> {
      const resultObject = queryStringToArray(queryString);
      
      const info = await this.getInfoMemorandumData(authUser, resultObject); // Datos generales
  
      const data = await this.getMemorandumData(resultObject, id, listaIds, fechaInicio, fechaFin); 
      //  Asegúrate que este `data` sea un ARRAY de objetos planos
      // con los campos que deseas mostrar en el Excel.
      return Result.ok({
          info,
          data
      });
  }


  private static async getInfoMemorandumData(authUser: AuthUser, queryString: ReportFilters): Promise<InfoMemorandumModel | undefined> {
  
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

private static async getMemorandumData(queryString: ReportFilters, id?:string, listaIds?:string[], fechaInicio?: string, fechaFin?: string): Promise<MemorandumDataR | undefined> {
    
    const inputObj: any = queryString;	
    const tipo = inputObj.tipo_reporte || null;	

    const hoy = new Date();
    const gestion = hoy.getFullYear().toString();

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
       
    
    const memorandumesR: MemorandumItem[] = memorandumResult.map((item) => {
            
          // Memorandum
            const codigoMemorandum = memorandumResult.find((c) => c.id === item.id)?.props.codDepartMemo|| "-";//Revisar
            const fechaMemorandum = memorandumResult.find((c) => c.id === item.id)?.props.fechaMemoRegistro || new Date();
            const cantidadDias =  memorandumResult.find((c) => c.id === item.id)?.props.cantidadDias|| 0;
            const tipoMemoRepo = memorandumResult.find((c) => c.id === item.id)?.props.tipoMemoRepo||'';
            // usuario
            const nombreUsuarioId = memorandumResult.find((c) => c.id === item.id)?.props.usuarioId|| "-";
            const nombreUsuario = usuarioResult.find((c) => c.id === nombreUsuarioId)?.props.fullname|| "-";
            const usuarioCI = usuarioResult.find((c) => c.id === nombreUsuarioId)?.props.ci|| "-";
            // detalle destino
            const tipoComisionIDP = memorandumResult.find((c) => c.id === item.id)?.props.tipoComisionIDP|| "-"; 
            const destino = detalleDestinoResult.find(c =>c.props.memorandumId === item.id && c.props.destinoReg 
                && c.props.destinoReg.trim() !== '')?.props.destinoReg || "-";
            const fechaIda = memorandumResult.find((c) => c.id=== item.id)?.props.fechaInicioViaje|| "-";
            const fechaRetorno = memorandumResult.find((c) => c.id ===  item.id )?.props.fechaFinViaje|| "-";
            const transporteOP = detalleDestinoResult.find((c) => c.props.memorandumId ===  item.id)?.props.tipoVehiculoOP|| "-";
            //Apertura Viatico
            const codApertura = memorandumResult.find((c) => c.id === item.id)?.props.aperturaViaticoId|| "-";
            const aperturaProgra = aperturaResult.find((c) => c.id === codApertura)?.props.aperturaProgramatica|| "-";
            const fondoFinan = aperturaResult.find((c) => c.id === codApertura)?.props.codFte|| "-";
            const sisin = aperturaResult.find((c) => c.id === codApertura)?.props.sisin|| "-";
            //Observaciones
            const modificacion =  memorandumResult.find((c) => c.id === item.id)?.props.modificacion;       
            const obsModificacion = memorandumResult.find((c) => c.id === item.id)?.props.obsModificacion|| "-";     
            const fechaCambio   = memorandumResult.find((c) => c.id === item.id)?.props.fechaCambio|| "-";       
            const estadoModificacion  = memorandumResult.find((c) => c.id === item.id)?.props.estadoModificacion|| "-"; 
            const usuarioID = memorandumResult.find((c) => c.id === item.id)?.props.usuarioId||"-"; 
            const cargoUsuarioid = personalResult.find((c) => c.props.usuarioId === usuarioID)?.props.cargoId|| "-";
            const tipoUsuario = cargoResult.find((c) => c.id  === cargoUsuarioid)?.props.tipo || "-";
             const notificacionMemo =  memorandumResult.find((c) => c.id === item.id)?.props.estadoMemorandum; 
            //verificacion dias de viaje
            let diasViaje = "-"
             const tipoViaje =  memorandumResult.find((c) => c.id === item.id)?.props.diasHabiles;       
            
             if (tipoViaje?.includes("INHABILES")){
                diasViaje = detalleDestinoResult.filter(c => c.props.memorandumId === item.id && c.props.estado != 'SIN_VIAJE')
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
            .filter((value) => value.nombre === item.id); 
			
            const filtroDestinos : DetalleDestinoOptionsFormModel [] = filtroDestinos1
            .filter((value) => value.estado! !='SIN_VIAJE' ); 
     
            // Se filta por los destinos
            const filtroAprobados : DetalleDestinoOptionsFormModel [] = filtroDestinos 	
            .filter((value) => value.estado! === 'APROBADO'); 
     
            const conteoDiasDetalle = filtroAprobados.length;
            
            // filtramos por el tipo de nombre
            const elementosUnicos = new Map(filtroDestinos.map(value => [value.caption, value]));
            let destinoNombre = '';
            
                    if(elementosUnicos.size >= 1){
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
                        dias_viaje              : diasViaje,
                    };
            }).sort((a, b) => a.fecha_memo > b.fecha_memo ? -1 : 1)  
  
       //FILTRADO POR BENEFICIARIO
       let filtroGeneral : MemorandumItem [] = [];
      
        const toDate = (f: string) => {
        const [y, m, d] = f.split('-') || f.split('/') ;
        return new Date(+y, +m - 1, +d);
        };
        const toDate2 = (f: string) => {
        const [d, m, y] = f.split('/') ;
        return new Date(+y, +m - 1, +d);
        };
       const fechaIni = toDate(fechaInicio!);      
      const fechaFinDate = toDate(fechaFin!);      
           
      //  FILTRO GENERAL y despeje de unicos       
                const filtroReposicion = memorandumesR.filter((value) => value.tipo_memo_repo === "REPOSICION");  											
                const filtroEstadoMemo = filtroReposicion.filter((value) => value.notificacion_memo === "VERIFICADO_RRHH" || value.notificacion_memo ==="APROBADO_SECRETARIO"
                || value.notificacion_memo ==="EN_ESPERA_INFORME"|| value.notificacion_memo ==="REPOSICION_VENCIDA");  			                 				
                const filtroFecha = filtroEstadoMemo.filter((value) => toDate2(value.fecha_viaje_ida!) >= fechaIni &&  toDate2(value.fecha_viaje_ida!) <= fechaFinDate )				
					
               
               if (Array.isArray(listaIds) && listaIds.length > 0) { 
                    listaIds!.forEach((idG) => {        
                        const resultadoFiltro = filtroFecha.filter((value) =>
                            this.filtrarId(value.id, idG)                       
                        );               
                        resultadoFiltro.forEach(item => {                         
                            const existe = filtroGeneral.some(f => f.id === item.id);
                            if (!existe) {
                            filtroGeneral.push(item);
                            }
                        });              
                    });       
               }  else{
                    filtroGeneral = filtroFecha;				
               }            
              

       //FIN FILTRO GENERAL         
        const result1: MemorandumDataR = {
           // tipo_reporte: tipo,
            rows: filtroGeneral,                   
        };
        
        return result1;
        
    
}


 
  //Reporte memorandum reposicion 
  public static async generarHeadExcel(tipo:string) {   
      
      const headList : Partial<Column>[] =  [];
     switch(tipo){    
      case ENUM_REPORTE_PARA_RRHH:
              headList.push( 
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
              { header: 'Estado Modificacion', key: 'estado_modificacion', width: 25 },
              { header: 'Partida Presupuestaria', key: 'apertura_programatica', width: 25 });
            
              return headList ;                        
     }
     
  }

  public static async getFormatData(data: MemorandumDataR | undefined)  {
        
      const listaData : ReportGeneral[] = [];
      if(data != null && data != undefined && data.rows.length >0){
          for (let i = 0; i < data.rows.length; i++) {
              const item : ReportGeneral = {
               
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
                  estado_modificacion   : String(data.rows[i].estado_modificacion),  
                  apertura_programatica : String(data.rows[i].apertura_prog),
                  dias_viaje            : String(data.rows[i].dias_viaje),
           
              }
              listaData.push(item)           			
             
             }
            
             return listaData;    
      }
    }


  
  
}