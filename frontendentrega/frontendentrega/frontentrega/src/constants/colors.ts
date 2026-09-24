import { REPOSICION, REPOSICION_VENCIDA } from "./enums";

export const COLORS =   ['#F4808D', '#EC8FBC', '#B8E4A5', '#CF97C6', '#94A9BC', '#EFEFEF', '#EFEFEF'];
export const BGCOLORS = ['#e6072b', '#D22F86', '#74B220', '#965699', '#003679', '#D9D9D9', '#949292'];
                        //  0           1           2       3           4           5           6
export const ESTADO_A = ['#74B220','#C4CDD5'];
export const ESTADO_P = ['#003679','#C4CDD5'];
export const ESTADO_O = ['#74B220','#FF4842'];
export const ESTADO_B: any = {
    PENDIENTE: '#C4CDD5',
    SUPERIOR: '#FFC107',
    APROBADO: '#74B220',
    RECHAZADO: '#FF4842',
};

export const ESTADO_C: any = {
    PENDIENTE: '#808080',
    ATENDIDO: '#74B220',
    EN_PROCESO: '#FFC107',
    ATRASADO: '#FF4842',
    SUSPENDIDO: '#DF2323',
    ATENDIDO_CON_RETRASO: '#DC8C24',
};

export const ESTADO_D: any = {
    PENDIENTE: 'grey',
    ATENDIDO: 'success',
    EN_PROCESO: 'warning',
    ATRASADO: 'error',
    ATENDIDO_CON_RETRASO: 'secondary',
};

export const ESTADO_E: any = {
    PENDIENTE: '#919EAB',
    RECHAZADO: '#FFC107',
    APROBADO: '#74B220',
    ANULADO: '#FF4842',
};

export const ESTADO_EJECUTADO: any = {
    PENDIENTE: '#919EAB',
    EJECUTADO: '#26b321ff',
};

export const ESTADO_F: any = {
    PENDIENTE: '#919EAB',
    APROBADO_JEFE: '#965699',
    APROBADO_RRHH: '#74B220',
    RECHAZADO: '#FF4842',
};

export const ESTADO_H: any = {
    PENDIENTE: '#919EAB',
    APROBADO_JEFE: '#965699',
    APROBADO_CONTABILIDAD: '#74B220',
    RECHAZADO: '#FF4842',
};

export const ESTADO_Q: any = {
  //  PENDIENTE: '#919EAB',
    ACTIVO: '#24b62f',
    CERRADO: '#2462b6',
    ANULADO: '#FF4842',
};

export const ESTADO_TIPO_MEMO_REPO: any = {
  //  PENDIENTE: '#919EAB',
    MEMORANDUM: '#24b62f',
    REPOSICION: '#2462b6',
  //  ANULADO: '#FF4842',
};

export const ESTADO_TIPO_RESOLUCION: any = {  
     SIN_RESOLUCION: '#97f09f',  
     CON_RESOLUCION: '#f18b87',
};

export const ESTADO_APROBADO_JEFE: any = {
    PENDIENTE: '#919EAB',
    APROBADO_JEFE: '#a74870',
    APROBADO_RESPONSABLE: '#c2b9faff',
    APROBADO_DIRECTOR: '#965699',
    APROBADO_ENCARGADO: '#00abd2ff',
    APROBADO_SECRETARIO: '#74B220',
    VERIFICADO_RRHH: '#1259a2',
    APROBADO_CONTABILIDAD: '#109010',
    RECHAZADO: '#FF4842',
    ANULADO: '#8b0032',
    EN_ESPERA_INFORME: '#048effff',
    REPOSICION_VENCIDA: 'rgb(79, 80, 80)',
};

export const ESTADO_G = ['#74B220','#FC6A85'];

export const ESTADO_I: any = {
    PENDIENTE: '#919EAB',
   // RECHAZADO: '#FFC107',
    APROBADO: '#74B220',
   // ANULADO: '#FF4842',
};
export const ESTADO_DIAS_SEMANA: any = {
    Lunes :'#077907ff',
    Martes:'#077907ff',
    Miércoles:'#077907ff',
    Jueves:'#077907ff',
    Viernes:'#077907ff',
    Sábado: '#860505ff',
    Domingo: '#860505ff',
};
export const ESTADO_J: any = {
    ABIERTO: '#74B220',
    CERRADO: '#965699',
    SUSPENDIDO: '#FF4842',
};

export const ESTADO_L: any = {
    PENDIENTE: '#919EAB',
    DESCARGADO: '#f04c06',
    DESCARGADO_CON_INFORME: '#74B220',
    CON_INFORME: '#0080d4',
};

export const ESTADO_K: any = {
    VENCIDO: '#d70000',
    POR_VENCER: '#46b800',
    AUN_A_TIEMPO: '#efba03',
    CON_TIEMPO: '#00a7c0',
};

export const BACKGROUND_1 = '#E3F2FD';

export const ENUM_COLOR = [
    { value: 'primary', label: 'Primario' },
    { value: 'secondary', label: 'Secundario' },
    { value: 'info', label: 'Informacion' },
    { value: 'success', label: 'Satisfactorio' },
    { value: 'warning', label: 'Advertencia' },
    { value: 'error', label: 'Error' },
    { value: 'grey', label: 'Gris' }
];

export const ENUM_COLOR_TIPO_ACTA: any = {
    ACT_REC: '#74B220',
    ACT_PRE: '#FF4842',
    ACT_DEV: '#00a7c0',
};

export const ENUM_COLOR_TIPO_CUENTA: any = {
    CORTO_PLAZO: '#965699',
    GESTION_ANTERIOR: '#e6072b',
    OTRAS_CUENTAS: '#003679'
};
