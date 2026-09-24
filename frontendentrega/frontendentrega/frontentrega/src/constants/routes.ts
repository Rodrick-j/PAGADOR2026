export const HOME = '/';
export const NOT_FOUND = '*';
export const LOGIN = '/login';
export const CALLBACK = '/callback';
/* rutas privadas */
export const LANDING = '/landing';
export const DASHBOARD = '/dashboard';
export const DASHBOARD_USER = '/dashboard/user';
export const DASHBOARD_ROLE = '/dashboard/role';
export const DASHBOARD_RUTA = '/dashboard/ruta';
export const DASHBOARD_SETTING = '/dashboard/setting';
// RRHH
export const RRHH = '/rrhh';
export const RRHH_PERSONAL = '/rrhh/personal';
export const RRHH_AREA = '/rrhh/area';
export const RRHH_CARGO = '/rrhh/cargo';
export const RRHH_ASIGNAR = '/rrhh/asignar';
export const RRHH_VACACION = '/rrhh/vacacion';
export const RRHH_DECLARACION = '/rrhh/declaracion';
export const RRHH_ASISTENCIA = '/rrhh/asistencia';
export const RRHH_FICHA_ADMIN = '/rrhh/ficha_admin';
export const RRHH_HORARIO = '/rrhh/horario';
export const RRHH_HORARIO_RANGO = '/rrhh/horario_rango';
export const RRHH_REGISTRO_HORARIO = '/rrhh/registro_horario';
export const RRHH_DESIGNACION_HORARIO = '/rrhh/designacion_horario';
export const RRHH_DESIGNACION_PERMISO = '/rrhh/designacion_permiso';
export const RRHH_CONFIG_HORARIO = '/rrhh/config_horario';
export const RRHH_MEMORANDUM_RRHH = '/rrhh/memorandum_rrhh';
export const RRHH_MEMORANDUM_DETALLE = '/rrhh/memorandum_rrhh/:id';
export const RRHH_MEMORANDUM_REPORTE = '/rrhh/memorandum_rrhh_reporte';

export const RRHH_SOLICITUD_VACACION = '/rrhh/solicitud_vacacion/:id';
export const RRHH_FICHA_DETALLE = '/rrhh/ficha_detalle/:id';
//BSSS
export const BSSS = '/bienes';
export const BSSS_VALE = '/bienes/vale';
export const BSSS_VALE_ADMIN = '/bienes/vale_admin';
export const BSSS_VEHICULO = '/bienes/vehiculo';
export const BSSS_DESTINO = '/bienes/destino';
export const BSSS_ASIGNACION = '/bienes/asignacion';
export const BSSS_REPORTE_VALE = '/bienes/reporte_vale';
export const BSSS_BITACORA_VIAJE = '/bienes/bitacora_viaje';
export const BSSS_BITACORA_DETALLE = '/bienes/bitacora_detalle';
export const BSSS_BITACORA_DETALLE_ID = '/bienes/bitacora_detalle/:id/bitacora_viaje/:semana';
//CONTA
export const CONTA = '/conta';
export const CONTA_CUENTA = '/conta/cuenta';
export const CONTA_DEUDA_DETALLE = '/conta/deuda/:id';
export const CONTA_SEGUIMIENTO_DETALLE = '/conta/seguimiento/:id';
//CONTRA
export const CONTRA = '/contra';
export const CONTRA_GENERAL = '/contra/general';
export const CONTRA_PROCESO = '/contra/proceso';
export const CONTRA_ACTIVIDAD = '/contra/actividad';
export const CONTRA_REPORTE = '/contra/reporte_proceso';
export const CONTRA_PROCESO_DETALLE = '/contra/proceso/:id';
export const CONTRA_ACTIVIDAD_DETALLE = '/contra/actividad/:id';
//ARCHIVO
export const ARCHIVO = '/archivo';
export const ARCHIVO_DOCUMENTO = '/archivo/documento';
export const ARCHIVO_ACTA = '/archivo/acta';
export const ARCHIVO_ACTA_RECEPCION = '/archivo/acta_recepcion';
export const ARCHIVO_ACTA_RECEPCION_DETALLE = '/archivo/acta_recepcion_detalle/:id';
export const ARCHIVO_ACTA_REPORTE = '/archivo/acta_reporte';
export const ARCHIVO_ACTA_DETALLE = '/archivo/acta';
//VIATICO
export const VIATICO = '/viatico';
export const VIATICO_VIATICO_ADMIN = '/viatico/viatico';
export const VIATICO_VIATICO_DETALLE = '/viatico/viatico/:id/memorandum/:memoId';
export const VIATICO_MEMORANDUM = '/viatico/memorandum';
export const VIATICO_MEMORANDUM_DETALLE = '/viatico/memorandum/:id';
export const VIATICO_DESCARGO = '/viatico/descargo';
export const VIATICO_ESCALA = '/viatico/escala';
export const VIATICO_DETALLE_DESTINO = '/viatico/detalle_destino';
export const VIATICO_VEHICULO_PUBLICO = '/viatico/vehiculo_publico';
export const VIATICO_APERTURA_VIATICO = '/viatico/apertura_viatico';
export const VIATICO_MEMORANDUM_REPORTE = '/viatico/reporte_memorandum';
export const VIATICO_ESCALA_DESTINO = '/viatico/escala_destino';
export const VIATICO_REPORTE_VIATICO = '/viatico/reporte_viatico';
//APERTURA
export const APERTURA = '/apertura'
export const APERTURA_GENERAL = '/apertura/apertura_general';
export const OBJETO_GASTO_APERTURA ='/apertura/objeto_gasto';
export const APERTURA_HISTORIAL = '/apertura/historial_apertura';
export const APERTURA_HISTORIAL_DETALLE = '/apertura/historial_apertura/:id';

//CORRESPONDENCIA
export const CORRESPONDENCIA = '/correspondencia'
export const CORRESPONDENCIA_CITES = '/correspondencia/cites';
// AUDITORIA
export const AUDITORIA = '/auditoria';
export const AUDITORIA_BITACORA = '/auditoria/bitacora';

const buildPath = (path: string, params: { [key: string]: string }) => {
     let result = path;
       Object.keys(params).forEach(param => result = result.replace(`:${param}`, encodeURIComponent(params[param])));
    return result;
};

export type Params = { id: string; };
export type ParamsDos = { id: string, memoId:string; };
export type ParamsSemana = { id: string, semana:string; };
const getDetalleSolicitudVacacionPath = (params: Params) => buildPath(RRHH_SOLICITUD_VACACION, params);
const getDeudaDetallePath             = (params: Params) => buildPath(CONTA_DEUDA_DETALLE, params);
const getSeguimientoDetallePath       = (params: Params) => buildPath(CONTA_SEGUIMIENTO_DETALLE, params);
const getActividadDetallePath         = (params: Params) => buildPath(CONTRA_ACTIVIDAD_DETALLE, params);
const getProcesoDetallePath           = (params: Params) => buildPath(CONTRA_PROCESO_DETALLE, params);
const getActaRecepcionDetallePath     = (params: Params) => buildPath(ARCHIVO_ACTA_RECEPCION_DETALLE, params);
const getFichaDetallePath             = (params: Params) => buildPath(RRHH_FICHA_DETALLE, params);

const getViaticoDetallePath           = (params: ParamsDos) => buildPath(VIATICO_VIATICO_DETALLE,params);
const getDetalleMemorandumPath        = (params: Params) => buildPath(VIATICO_MEMORANDUM_DETALLE,params);
const getHistorialAperturaPath        = (params: Params) => buildPath(APERTURA_HISTORIAL_DETALLE,params);
const getDetalleMemorandumRRHHPath    = (params: Params) => buildPath(RRHH_MEMORANDUM_DETALLE,params);
const getBitacoraDetallePath          = (params: ParamsSemana) => buildPath(BSSS_BITACORA_DETALLE_ID,params);

export const RUTAS = {
    solicitud_vacacion    : { _path: RRHH_SOLICITUD_VACACION, basePath: '/rrhh/solicitud_vacacion', getPath: getDetalleSolicitudVacacionPath, label: 'Solicitud Vacacion' },
    deuda_detalle         : { _path: CONTA_DEUDA_DETALLE, basePath: '/conta/deuda', getPath: getDeudaDetallePath, label: 'Deuda Detalle' },
    seguimiento_detalle   : { _path: CONTA_SEGUIMIENTO_DETALLE, basePath: '/conta/deuda', getPath: getSeguimientoDetallePath, label: 'Seguimiento Detalle' },
    proceso_detalle       : { _path: CONTRA_PROCESO_DETALLE, basePath: '/contra/proceso', getPath: getProcesoDetallePath, label: 'Proceso Detalle' },
    acta_recepcion_detalle: { _path: ARCHIVO_ACTA_RECEPCION_DETALLE, basePath: '/archivo/acta_recepcion', getPath: getActaRecepcionDetallePath, label: 'Acta RecepacioDetalle' },
    actividad_detalle : { _path: CONTRA_ACTIVIDAD_DETALLE, basePath: '/contra/actividad', getPath: getActividadDetallePath, label: 'Actividad Detalle' },
    ficha_detalle     : { _path: RRHH_FICHA_DETALLE, basePath: '/rrhh/ficha_detalle', getPath: getFichaDetallePath, label: 'Ficha Detalle' },
        //Realizar la revision de los path
    memorandum_detalle: { _path: VIATICO_MEMORANDUM_DETALLE, basePath:'/viatico/memorandum',getPath:getDetalleMemorandumPath, label:'Memorandum Detalle'},
    viatico_detalle   : { _path: VIATICO_VIATICO_DETALLE,basePath: '/viatico/viatico', getPath: getViaticoDetallePath, label:'Viatico Detalle'},
    historial_apertura_detalle : { _path: APERTURA_HISTORIAL_DETALLE,basePath: '/apertura/historial_apertura', getPath: getHistorialAperturaPath, label:'Historial Apertura Detalle'},
    memorandum_detalle_rrhh: { _path: RRHH_MEMORANDUM_DETALLE, basePath:'/rrhh/memorandum_rrhh',getPath:getDetalleMemorandumRRHHPath, label:'Memorandum Detalle RR.HH.'},
    bitacora_detalle   : { _path: BSSS_BITACORA_DETALLE_ID,basePath: '/bienes/bitacora_detalle', getPath: getBitacoraDetallePath, label:'Bitacora Detalle'},
};
