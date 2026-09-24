//Roles
export const ENUM_SUPERADMINISTRADOR = "superAdministrador";
// roles de viaticos
export const ENUM_TECNICO_VIATICOS = "tecnicoviaticos";
export const ENUM_TECNICO_COMPLETO = "tecnicocompleto";
export const ENUM_TECNICO_VALE_VIATICOS = "tecnicocombustibleviaticos";
export const ENUM_TECNICO_CITES = "tecnicodecites";
export const TECNICO_COMBUSTIBLE_JEFE = "tcnicocombustiblejefe";
export const ENUM_JEFE = "jefe";
export const ENUM_VIATICO_EX= "2.2.2.20";
export const ENUM_VIATICO_IN= "2.2.2.10";
export const ENUM_PASAJE_EX= "2.2.1.20";
export const ENUM_PASAJE_IN= "2.2.1.10";
export const ENUM_COMBUSTIBLE= "3.4.1.10";
export const ENUM_EJECUTADO= "EJECUTADO";
export const JEFE_GABINETE = "JEFE (A) DE GABINETE";
export const ASESOR = "ASESOR"
export const ASESOR_FINANCIERO = "ASESOR FINANCIERO"
export const JEFE_COMUNICACION = "JEFE (A) DE UNIDAD II -JEFE (A) DE UNIDAD DE COMUNICACIÓN SOCIAL";
export const GOBERNADOR = "GOBERNADOR (A) DEL DEPARTAMENTO";
export const MEMORANDUM_INSTRUCCION = "MEMORANDUM DE INSTRUCCIÓN";
export const SECRETARIO_SDAFP_ITEM = "10072";
export const SECRETARIO_GABINETE_ITEM = "10010";
export const SECRETARIO_GOBERNADOR_ITEM = "10001";
export const SECRETARIO = "SECRETARIO";
export const ENUM_ENCARGADO_VIATICOS = "encargadoviaticos";
export const ENUM_ENCARGADO_COMBUSTIBLE = "encargado";
export const ENUM_TECNICO_RRHH = "tecnicorrhh";
export const ENUM_TECNICO_GENERAL_VIATICOS =  "tecnicogeneralviaticos";
export const ENUM_APROBADO_SECRETARIO = "APROBADO_SECRETARIO";
export const ENUM_OBSERVADO = "OBSERVADO";
export const ENUM_SIN_OBSERVACION = "SIN_OBSERVACION";
export const ENUM_VERIFICADO_RRHH = "VERIFICADO_RRHH";
export const ENUM_APROBADO_CONTABILIDAD = "APROBADO_CONTABILIDAD";
export const ENUM_APROBADO_JEFE = "APROBADO_JEFE";
export const ENUM_APROBADO_ENCARGADO = "APROBADO_ENCARGADO";
export const ENUM_APROBADO_DIRECTOR = "APROBADO_DIRECTOR";
export const ENUM_PENDIENTE_RRHH = "PENDIENTE_RRHH";
export const ENUM_PENDIENTE_CONTABILIDAD = "PENDIENTE_CONTABILIDAD";
export const ENUM_PENDIENTE_DE_APROBAR = "PENDIENTE_DE_APROBAR";
export const ENUM_MEMORANDUM_SIN_COBRO = "MEMORANDUM_SIN_COBRO";
export const ENUM_MEMORANDUM_FUNCIONES = "MEMORANDUM_DESIGNACION_DE_FUNCIONES";

export const ENUM_DESCARGADO_Y_PRESENTA_INFORME = "DESCARGADO_Y_PRESENTA_INFORME";
export const ENUM_DESCARGADO = "DESCARGADO";
export const ENUM_PRESENTA = "PRESENTA";
export const ENUM_PRESENTA_INFORME = "PRESENTA_INFORME";
export const ENUM_PENDIENTE = "PENDIENTE";
export const ENUM_ANULADO = "ANULADO";
export const ENUM_RECHAZADO = "RECHAZADO";
export const ENUM_EN_ESPERA_INFORME = "EN_ESPERA_INFORME";
export const ENUM_REPOSICION_VENCIDA = "REPOSICION_VENCIDA";
export const ENUM_APROBADO = "APROBADO";
export const CON_PRESUPUESTO = "CON PRESUPUESTO";
export const SIN_PRESUPUESTO = "SIN PRESUPUESTO";

export const ENUM_INGRESO = "INGRESO";
export const ENUM_EGRESO = "EGRESO";
export const ENUM_VIATICO = "Viaticos";
export const ENUM_PASAJE = "Pasajes";
export const ENUM_INHABIL = "INHABILES";
export const ENUM_CON_RESOLUCION = "CON_RESOLUCION";
export const ENUM_SIN_RESOLUCION = "SIN_RESOLUCION";


export const ENUM_GENERAL = "GENERAL"
export const ENUM_REPORTE_POR_PLANILLA = "REPORTE_POR_PLANILLA";
export const ENUM_REPORTE_POR_PROYECTO = "REPORTE_POR_PROYECTO";
export const ENUM_REPORTE_FF_OF = "REPORTE_FF_OF";
export const ENUM_REPORTE_POR_BENEFICIARIO = "REPORTE_POR_BENEFICIARIO";
export const ENUM_REPORTE_POR_TIPO = "REPORTE_POR_TIPO";
export const ENUM_REPORTE_POR_APERTURA = "REPORTE_POR_APERTURA";
export const ENUM_REPORTE_PARA_RRHH = "REPORTE_PARA_RRHH";
export const ENUM_REPORTE_FINAL = "REPORTE_FINAL";

export const ENUM_DEPENDENCIA = "DEPENDENCIA";
export const ENUM_PRINCIPAL = "PRINCIPAL";
export const TECNICO_GENERAL_VIATICOS = "tecnicogeneralviaticos";
export const GABINETE_DESPACHO = "GABINETE DESPACHO";
export const GABINETE = "GABINETE";
export const ENUM_APROBADO_RESPONSABLE = "APROBADO_RESPONSABLE";

export const ESTADOS_PERMITIDOS_CONTA = [
  ENUM_APROBADO_SECRETARIO,
  ENUM_VERIFICADO_RRHH,
  ENUM_APROBADO_CONTABILIDAD,
  ENUM_EN_ESPERA_INFORME,
  ENUM_REPOSICION_VENCIDA,
];

export const ESTADOS_PERMITIDOS_RRHH = [
  ENUM_VERIFICADO_RRHH,
  ENUM_APROBADO_CONTABILIDAD,
  ENUM_EN_ESPERA_INFORME,
   ENUM_REPOSICION_VENCIDA,
];

export const ROLES_TECNICOS_VIATICOS = new Set([
  ENUM_TECNICO_VIATICOS,
  ENUM_TECNICO_COMPLETO,
  ENUM_TECNICO_VALE_VIATICOS,
  ENUM_JEFE,
  TECNICO_COMBUSTIBLE_JEFE,
  ENUM_SUPERADMINISTRADOR
]);
export const ESTADOS_RRHH = new Set([
  ENUM_APROBADO_SECRETARIO,
  ENUM_VERIFICADO_RRHH,
  ENUM_APROBADO_CONTABILIDAD, 
  ENUM_ANULADO,
  ENUM_RECHAZADO,
  ENUM_EN_ESPERA_INFORME
]);

export const ESTADOS_ENCARGADO = new Set([
  ENUM_VERIFICADO_RRHH,
  ENUM_APROBADO_CONTABILIDAD,
  ENUM_ANULADO,
  ENUM_RECHAZADO,
  ENUM_EN_ESPERA_INFORME,
  ENUM_REPOSICION_VENCIDA
]);

export const ESTADO_MEMORANDUMS_APROBACION = new Set([
  //ENUM_PENDIENTE,
  ENUM_APROBADO_RESPONSABLE,
  ENUM_APROBADO_JEFE,
  ENUM_APROBADO_DIRECTOR,
  ENUM_APROBADO_SECRETARIO,
  ENUM_VERIFICADO_RRHH,
  ENUM_APROBADO_CONTABILIDAD,
  ENUM_SUPERADMINISTRADOR
]);

export const ENUM_MOTIVO_DEUDA = [
    { value: 'FONDOS_EN_AVANCE', label: 'Fondos en avance no descargados' },
    { value: 'FONDO_ROTATORIO', label: 'Fondo rotatorio de caja chica no descargados' },
    { value: 'PASAJES_NO_DESCARGADOS', label: 'Pasajes no descargados' },
    { value: 'VIATICOS_NO_DESCARGADOS', label: 'Viaticos no descargados' },
    { value: 'ACTIVOS_FIJOS_FALTANTES', label: 'Activos fijos faltantes' },
    { value: 'DIFERENCIAS_ENTRE_SALDOS', label: 'Diferencias entre saldos de inventario de almacenes' },
    { value: 'SERVICIOS_BASICOS', label: 'Servicios Basicos' },
    { value: 'OTRO', label: 'Otro' }
];

export const ENUM_TIPO_CUENTA = [
    { value: 'CORTO_PLAZO', label: 'Corto Plazo' },
    { value: 'GESTION_ANTERIOR', label: 'Gestion anterior' },
    { value: 'OTRAS_CUENTAS', label: 'Otras cuentas' }
];

export const ENUM_TIPO_ACTA = [
    { value: 'ACT_PRE', label: 'Acta de Prestamo' },
    { value: 'ACT_DEV', label: 'Acta de Devolucion' },
];

export const ENUM_TIPO_ACTA2 = [
    { value: 'ACT_REC', label: 'Acta de Recepcion' },
    { value: 'ACT_PRE', label: 'Acta de Prestamo' },
    { value: 'ACT_DEV', label: 'Acta de Devolucion' },
];

export const ENUM_TIPO_DOCUMENTO = [
    { value: 'C31_CON', label: 'C-31 Con imputacion' },
    { value: 'C31_SIN', label: 'C-31 Sin imputacion' },
    { value: 'C21_CON', label: 'C-21 Con imputacion' },
    { value: 'C21_SIN', label: 'C-21 Sin imputacion' },
    { value: 'ASC_MAN', label: 'Asientos Manuales' },
    { value: 'OTROS', label: 'Otros' },
];

export const ENUM_DEUDA = ['ACTIVO', 'SALDADO'];
                                   
export const EMUM_CODIGO_OBJETOS = ['2.2.1.10', '2.2.1.20', '2.2.2.10', '2.2.2.20'];

export const ENUM_OBJETO_GASTO_VALE = '3.4.1.10';