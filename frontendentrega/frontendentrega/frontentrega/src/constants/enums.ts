export const ID_SIN_APERTURA = "00000000-0000-0000-0000-000000000000";
export const IS_ADMINISTRADOR = "00000000-0000-0000-0000-000000000001";
export const SIN_OBSERVACION = "SIN_OBSERVACION";
export const OBSERVADO = "OBSERVADO";
export const APROBADO_SECRETARIO = "APROBADO_SECRETARIO";
export const SECRETARIO = "SECRETARIO(A)"
export const JEFE_GABINETE = "JEFE (A) DE GABINETE"
export const JEFE_COMUNICACION = "JEFE (A) DE UNIDAD II -JEFE (A) DE UNIDAD DE COMUNICACIÓN SOCIAL"
export const ASESOR = "ASESOR"
export const ASESOR_FINANCIERO = "ASESOR FINANCIERO"
export const ASESOR_ESTRATEGICO = "ASESOR ESTRATÉGICO"
export const ASESOR_LEGAL = "ASESOR LEGAL"
export const GOBERNADOR = "GOBERNADOR (A) DEL DEPARTAMENTO";
export const VERIFICADO_RRHH = "VERIFICADO_RRHH";
export const EN_ESPERA_INFORME = "EN_ESPERA_INFORME";
export const REPOSICION_VENCIDA = "REPOSICION_VENCIDA";
export const ANULADO = "ANULADO";
export const APROBADO = "APROBADO";
export const CERRADO = "CERRADO";
export const REPOSICION = "REPOSICION";
export const ACTIVO = "ACTIVO";
export const APROBADO_CONTABILIDAD = "APROBADO_CONTABILIDAD";
export const RECHAZADO = "RECHAZADO";
export const TECNICO_VIATICOS = "tecnicoviaticos";
export const TECNICO_VALE_VIATICOS = "tecnicocombustibleviaticos";
export const TECNICO_COMPLETO = "tecnicocompleto";
export const TECNICO_COMBUSTIBLE_JEFE = "tcnicocombustiblejefe";
export const TECNICO_RRHH= "tecnicorrhh";
export const ENCARGADO_COMBUSTIBLE= "encargadocombustible"; // VERFICAR ESTA CONSTANTE
export const JEFE = "jefe";
export const ENCARGADO_VIATICOS = "encargadoviaticos";

export const MEMORANDUM_SIN_COBRO = "MEMORANDUM_SIN_COBRO";
export const MEMORANDUM_FUNCIONES = "MEMORANDUM_ASIGNACION_DE_FUNCIONES";// MEMORANDUM DE DESIGANCION DE FUNCIONES
export const MEMORANDUM_OTRO = "MEMORANDUM_OTRO";

export const ENUM_IS_SUPERADMINISTRADOR = 'superadministrador';
export const TECNICO_GENERAL_VIATICOS = "tecnicogeneralviaticos";
export const VIATICOS = "Viaticos";
export const PASAJES = "Pasajes";
export const APERTURA_GABINETE = "000 0 001";
export const GABINETE_DESPACHO = "GABINETE DESPACHO";
export const CON_PRESUPUESTO = "CON PRESUPUESTO";
export const SIN_PRESUPUESTO = "SIN PRESUPUESTO";
export const CON_RESOLUCION = "CON_RESOLUCION";
export const GABINETE_DESPACHO_SECRETARIOS = "GABINETE DESPACHO SECRETARIOS";

export const ESTADOS_BLOQUEADOS = [
  ANULADO,
  RECHAZADO,
  VERIFICADO_RRHH
];
export const ROLES_ENCARGADO_ADMIN = [
  ENCARGADO_VIATICOS,
  ENUM_IS_SUPERADMINISTRADOR
];
export const esAutoridad = [JEFE_GABINETE, JEFE_COMUNICACION, ASESOR_FINANCIERO];
export const ESTADOS_BLOQUEADO_RRHH = [VERIFICADO_RRHH, EN_ESPERA_INFORME, ANULADO, REPOSICION_VENCIDA, APROBADO_CONTABILIDAD, RECHAZADO];
export const ESTADOS_BLOQUEADOS_CONTA = [VERIFICADO_RRHH, EN_ESPERA_INFORME, APROBADO_SECRETARIO, ANULADO, RECHAZADO, REPOSICION_VENCIDA,APROBADO_CONTABILIDAD ];

export const ESTADOS_BLOQUEADO_ENCARGADO = [APROBADO_CONTABILIDAD, RECHAZADO, ANULADO, REPOSICION_VENCIDA];

export const ROLES_TECNICOS_VIATICOS = [
  TECNICO_VIATICOS,
  JEFE,
  TECNICO_VALE_VIATICOS,
  TECNICO_COMPLETO,
  TECNICO_COMBUSTIBLE_JEFE,
];

export const ESTADOS_SOLO_VISTA = [
  APROBADO_CONTABILIDAD,
  APROBADO_SECRETARIO,
  VERIFICADO_RRHH,
  RECHAZADO,
  ANULADO, 
  REPOSICION_VENCIDA,
  EN_ESPERA_INFORME,
];

export const ROLES_EDICION = [ // para quitar agregar a jefe de gabinete comentar combustible jefe
  TECNICO_VIATICOS,
  TECNICO_VALE_VIATICOS,
  TECNICO_COMPLETO,
  TECNICO_COMBUSTIBLE_JEFE,
  TECNICO_GENERAL_VIATICOS
];
//CITES
export const ACTA_DE_RECEPCION = "ACTA DE RECEPCION";
export const ACTAS_DE_COMPROMISO = "ACTAS DE COMPROMISO";
export const ACTAS_DE_ENTREGA = "ACTAS DE ENTREGA";
export const AUTO_DE_APERTURA = "AUTO DE APERTURA";
export const CIRCULARES = "CIRCULARES";
export const COMUNICADOS = "COMUNICADOS";
export const INFORME_DE_CONFORMIDAD = "INFORME DE CONFORMIDAD";
export const INFORME_DE_DISCONFORMIDAD = "INFORME DE DISCONFORMIDAD";
export const INFORME_DE_INFRACCIÓN = "INFORME DE INFRACCIÓN";
export const INFORME_DE_VIAJE_EN_COMISIÓN = "INFORME DE VIAJE EN COMISIÓN";
export const INFORME_LEGAL = "INFORME LEGAL";
export const INFORME_TÉCNICO = "INFORME TÉCNICO";
export const INSTRUCTIVO = "INSTRUCTIVO";
export const MEMORÁNDUM_DE_ASIGNACIÓN = "MEMORÁNDUM DE ASIGNACIÓN";
export const MEMORÁNDUM_DE_DESIGNACIÓN = "MEMORÁNDUM DE DESIGNACIÓN";
export const MEMORÁNDUM_DE_FELICITACIÓN = "MEMORÁNDUM DE FELICITACIÓN";
export const MEMORÁNDUM_DE_LLAMADA_DE_ATENCIÓN = "MEMORÁNDUM DE LLAMADA DE ATENCIÓN";
export const MEMORÁNDUM_OFICIAL = "MEMORÁNDUM OFICIAL";
export const NOTA_EXTERNA  = "NOTA EXTERNA";
export const NOTA_INTERNA = "NOTA INTERNA";
export const RESOLUCION_ADMINISTRATIVA_DE_ADJUDICACIÓN = "RESOLUCION ADMINISTRATIVA DE ADJUDICACIÓN";
export const RESOLUCION_ADMINISTRATIVA_DE_ANULACIÓN = "RESOLUCION ADMINISTRATIVA DE ANULACIÓN";


export const GRUPO_GENERAL = new Set([
  ACTA_DE_RECEPCION,
  ACTAS_DE_COMPROMISO,
  ACTAS_DE_ENTREGA,
  CIRCULARES,
  COMUNICADOS,
  INFORME_DE_CONFORMIDAD,
  INFORME_DE_DISCONFORMIDAD,
  INFORME_LEGAL,
  INFORME_TÉCNICO,
  INSTRUCTIVO,
  NOTA_EXTERNA,
  NOTA_INTERNA,
]);

export const GRUPO_MEMORANDUM_PERSONAL = new Set([
  MEMORÁNDUM_DE_ASIGNACIÓN,
  MEMORÁNDUM_DE_DESIGNACIÓN,
  MEMORÁNDUM_DE_FELICITACIÓN,
  MEMORÁNDUM_DE_LLAMADA_DE_ATENCIÓN,
]);

export const GRUPO_RESOLUCIONES = new Set([
  RESOLUCION_ADMINISTRATIVA_DE_ADJUDICACIÓN,
  RESOLUCION_ADMINISTRATIVA_DE_ANULACIÓN,
]);

export const GRUPO_VACIO = new Set([
  INFORME_DE_VIAJE_EN_COMISIÓN,
  MEMORÁNDUM_OFICIAL,
  INFORME_DE_INFRACCIÓN,
  AUTO_DE_APERTURA,
]);


export const EJECUTADO = "EJECUTADO";
export const PENDIENTE = "PENDIENTE";


export const OPTIONS_DOCUMENTOS = [
  { value: 'ACTA DE RECEPCION', label: 'ACTA DE RECEPCION' },
  { value: "ACTAS DE COMPROMISO", label: "ACTAS DE COMPROMISO" },
  { value: "ACTAS DE ENTREGA", label: "ACTAS DE ENTREGA" },
  { value:  "AUTO DE APERTURA", label:  "AUTO DE APERTURA" },
  { value: "CIRCULARES", label: "CIRCULARES" },
  { value: 'COMUNICADOS', label: 'COMUNICADOS' },
  { value: 'INFORME DE CONFORMIDAD', label: 'INFORME DE CONFORMIDAD' },
  { value: 'INFORME DE DISCONFORMIDAD', label: 'INFORME DE DISCONFORMIDAD' },
  { value: 'INFORME DE INFRACCIÓN', label: 'INFORME DE INFRACCIÓN' },
  { value: 'INFORME DE VIAJE EN COMISIÓN', label: 'INFORME DE VIAJE EN COMISIÓN' },
  { value: 'INFORME LEGAL', label: 'INFORME LEGAL' },
  { value: 'INFORME TÉCNICO', label: 'INFORME TÉCNICO' },
  { value: 'INSTRUCTIVO', label: 'INSTRUCTIVO' },
  { value: 'MEMORÁNDUM DE ASIGNACIÓN', label: 'MEMORÁNDUM DE ASIGNACIÓN' },
  { value: 'MEMORÁNDUM DE DESIGNACIÓN', label: 'MEMORÁNDUM DE DESIGNACIÓN' },
  { value: 'MEMORÁNDUM DE FELICITACIÓN', label: 'MEMORÁNDUM DE FELICITACIÓN' },
  { value: 'MEMORÁNDUM DE LLAMADA DE ATENCIÓN', label: 'MEMORÁNDUM DE LLAMADA DE ATENCIÓN' },
  { value: 'MEMORÁNDUM OFICIAL', label: 'MEMORÁNDUM OFICIAL' },
  { value: 'NOTA EXTERNA', label: 'NOTA EXTERNA' },
  { value: 'NOTA INTERNA', label: 'NOTA INTERNA' },
  { value: 'RESOLUCION ADMINISTRATIVA DE ADJUDICACIÓN', label: 'RESOLUCION ADMINISTRATIVA DE ADJUDICACIÓN' },
  { value: 'RESOLUCION ADMINISTRATIVA DE ANULACIÓN', label: 'RESOLUCION ADMINISTRATIVA DE ANULACIÓN' }
];

export const OPTIONS_TIPO_MEMOREPOSICION = [
  { value: 'MEMORANDUM', label: 'MEMORANDUM' },
  { value: "REPOSICION", label: "REPOSICION" },
];

export const ENUM_CATEGORIA = [
    { value: 'circular', label: 'Circular' },
    { value: 'comunicado', label: 'Comunicado' },
    { value: 'evento', label: 'Evento' },
    { value: 'instructivo', label: 'Instructivo' }
];

export const ENUM_GENERO = [
    { value: 'MASCULINO', label: 'Masculino' },
    { value: 'FEMENINO', label: 'Femenino' }
];

export const ENUM_TIPO_CUENTA = [
    { value: 'CORTO_PLAZO', label: 'Corto Plazo' },
    { value: 'GESTION_ANTERIOR', label: 'Gestion anterior' },
    { value: 'OTRAS_CUENTAS', label: 'Otras cuentas' }
];

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

export const ENUM_IMPRESION_VIATICO = [
    { value: 'REPORTE_POR_PLANILLA', label: 'Reporte por Planilla' },
    { value: 'REPORTE_POR_PROYECTO', label: 'Reporte por Proyecto' },
    { value: 'REPORTE_FF_OF', label: 'Reporte por FF Y OF' },
    { value: 'REPORTE_POR_BENEFICIARIO', label: 'Reporte por Beneficiario' },
    { value: 'REPORTE_POR_TIPO', label: 'Reporte por Tipo' },
    { value: 'REPORTE_PARA_RRHH', label: 'Reporte para RR.HH.' }
];

export const ENUM_IMPRESION_MEMORANDUM_RRHH = [
    { value: 'REPORTE_POR_PROYECTO', label: 'Reporte por Proyecto' },
    { value: 'REPORTE_POR_BENEFICIARIO', label: 'Reporte por Beneficiario' },
    { value: 'REPORTE_POR_TIPO', label: 'Reporte por Tipo' }
];

export const ENUM_IMPRESION_VALE_COMBUSTIBLE = [
    { value: 'REPORTE_POR_PROYECTO', label: 'Reporte por Proyecto' },
    { value: 'REPORTE_POR_APERTURA', label: 'Reporte por Apertura' },
    { value: 'REPORTE_POR_TIPO', label: 'Reporte por Tipo' },
    { value: 'REPORTE_FINAL', label: 'Reporte Final' },
    //{ value: 'REPORTE_POR_APERTURA', label: 'Reporte por Apertura' },

];


export const ENUM_TIPO_DOCUMENTO = [
    { value: 'C31_CON', label: 'C-31 Con imputacion' },
    { value: 'C31_SIN', label: 'C-31 Sin imputacion' },
    { value: 'C21_CON', label: 'C-21 Con imputacion' },
    { value: 'C21_SIN', label: 'C-21 Sin imputacion' },
    { value: 'ASC_MAN', label: 'Asientos Manuales' },
    { value: 'OTROS', label: 'Otros' },
];

export const ENUM_TIPO_ACTA = [
    { value: 'ACT_PRE', label: 'Acta de Prestamo' },
    { value: 'ACT_DEV', label: 'Acta de Devolucion' },
];

export const ENUM_TIPO_ACTA3 = [
    { value: 'ACT_REC', label: 'Acta de Recepcion' },
    { value: 'ACT_PRE', label: 'Acta de Prestamo' },
    { value: 'ACT_DEV', label: 'Acta de Devolucion' },
];

export const ENUM_TIPO_ACTA2 = [
    { value: 'ACT_REC', label: 'En Archivo' },
    { value: 'ACT_PRE', label: 'Prestado' },
    { value: 'ACT_DEV', label: 'En Archivo' },
];

export const ENUM_PERMISO = [
    'NORMAL',
    'EDITAR',
    'ELIMINAR'
];

export const ENUM_ESTADO = [
    'PENDIENTE',
    'SUPERIOR',
    'RECHAZADO',
    'APROBADO'
];

export const ENUM_ESTADOS = [
    { value: 'PENDIENTE', label: 'PENDIENTE' },
    { value: 'SUPERIOR', label: 'SUPERIOR' },
    { value: 'APROBADO', label: 'APROBADO' },
    { value: 'RECHAZADO', label: 'RECHAZADO' }
]

export const ENUM_ESTADOS_B = [
    { value: 'PENDIENTE', label: 'PENDIENTE' },
    { value: 'ANULADO', label: 'ANULADO' },
    { value: 'APROBADO', label: 'APROBADO' },
    { value: 'RECHAZADO', label: 'RECHAZADO' }
]

export const ENUM_EJECUTADO = [
    { value: 'PENDIENTE', label: 'PENDIENTE' },
    { value: 'EJECUTADO', label: 'EJECUTADO' },
]

export const ENUM_ESTADOS_C = [
    { value: 'PENDIENTE', label: 'PENDIENTE' },
    { value: 'ATENDIDO', label: 'ATENDIDO' },
    { value: 'EN_PROCESO', label: 'EN PROCESO' },
    { value: 'ATRASADO', label: 'ATRASADO' }
]

export const ENUM_ESTADOS_F = [
    { value: 'PENDIENTE', label: 'PENDIENTE' },
    { value: 'APROBADO', label: 'APROBADO' },
   // { value: 'ANULADO', label: 'ANULADO' },
    //{ value: 'RECHAZADO', label: 'RECHAZADO' }
]

export const ENUM_ESTADOS_MEMOREPO = [
    { value: 'MEMORANDUM', label: 'MEMORANDUM' },
    { value: 'REPOSICION', label: 'REPOSICION' },
   
]

export const ENUM_ESTADOS_G = [
    { value: 'PENDIENTE', label: 'PENDIENTE' },
   //{ value: 'ANULADO', label: 'ANULADO' },
    { value: 'APROBADO', label: 'APROBADO' },
   // { value: 'SIN_VIAJE', label: 'SIN VIAJE' }
]
export const ENUM_ESTADOS_H = [
    { value: 'PENDIENTE', label: 'PENDIENTE' },
    { value: 'APROBADO_JEFE', label: 'APROBADO_JEFE' },
    { value: 'APROBADO_CONTABILIDAD', label: 'APROBADO_CONTABILIDAD' },
    { value: 'RECHAZADO', label: 'RECHAZADO' }
]

export const ENUM_ESTADOS_L = [
    { value: 'ACTIVO', label: 'ACTIVO' },
    { value: 'ANULADO', label: 'ANULADO' },
    { value: 'CERRADO', label: 'CERRADO' },


]
export const ENUM_ESTADOS_APROBADOS_JEFES = [
    { value: 'PENDIENTE', label: 'PENDIENTE' },
    { value: 'APROBADO_JEFE_UNIDAD', label: 'APROBADO_JEFE_UNIDAD' },
    { value: 'APROBADO_ENCARGADO', label: 'APROBADO_ENCARGADO' },
    { value: 'APROBADO_SECRETARIO', label: 'APROBADO_SECRETARIO' },
    { value: 'RECHAZADO', label: 'RECHAZADO' }
]
export const ENUM_ESTADOS_APROBADOS= [
    { value: 'PENDIENTE', label: 'PENDIENTE' },
    { value: 'RECHAZADO', label: 'RECHAZADO' }
]

export const ENUM_CON_SIN_OBSERVACIONES= [
    { value: 'SIN_OBSERVACION', label: 'SIN_OBSERVACION' },
    { value: 'OBSERVADO', label: 'OBSERVADO' }

]

export const ENUM_ESTADOS_APROBADOS_RRHH = [
    //{ value: 'PENDIENTE', label: 'PENDIENTE' },
    { value: 'VERIFICADO_RRHH', label: 'VERIFICADO_RRHH' },
    //{ value: 'ANULADO', label: 'ANULADO' },
    { value: 'RECHAZADO', label: 'RECHAZADO' }
]
export const ENUM_ESTADOS_APROBADOS_SDAFP = [
    { value: 'PENDIENTE', label: 'PENDIENTE' }, // se podria utilizar para volver un memorandum al inicio
    { value: 'APROBADO_CONTABILIDAD', label: 'APROBADO_CONTABILIDAD' },
    { value: 'ANULADO', label: 'ANULADO' },
    { value: 'EN_ESPERA_INFORME', label: 'EN_ESPERA_INFORME' },
    { value: 'REPOSICION_VENCIDA', label: 'REPOSICION_VENCIDA' },
    { value: 'RECHAZADO', label: 'RECHAZADO' }
]

export const ENUM_ESTADOS_I = [
    { value: 'PENDIENTE', label: 'PENDIENTE' },
    { value: 'DESCARGADO', label: 'DESCARGADO' },
]
export const ENUM_ESTADOS_J = [
    { value: 'PENDIENTE', label: 'PENDIENTE' },
    { value: 'PRESENTA', label: 'PRESENTA' },
]
export const ENUM_ESTADOS_OBSERVADO = [
    { value: 'SIN_OBSERVACION', label: 'SIN_OBSERVACION' },
    { value: 'OBSERVADO', label: 'OBSERVADO' },
]

export const ENUM_ESTADOS_IJ = [
    { value: 'PENDIENTE', label: 'PENDIENTE' },
    { value: 'DESCARGADO', label: 'DESCARGADO' },
    { value: 'PRESENTA_INFORME', label: 'PRESENTA_INFORME' },
    { value: 'DESCARGADO_Y_PRESENTA_INFORME', label: 'DESCARGADO_Y_PRESENTA_INFORME' },

]
export const ENUM_ESTADOS_IK = [
    { value: 'PENDIENTE', label: 'PENDIENTE' },
    { value: 'ANULADO', label: 'ANULADO' },
    { value: 'VERIFICADO_RRHH', label: 'VERIFICADO_RRHH' },
    { value: 'RECHAZADO', label: 'RECHAZADO' },

]

export const ENUM_ESTADOS_PAGO = [
    { value: 'APROBADO', label: 'APROBADO' },
   // { value: 'EN_ESPERA_INFORME', label: 'EN_ESPERA_INFORME' },
   // { value: 'VERIFICADO_RRHH', label: 'VERIFICADO_RRHH' },
    { value: 'ANULADO', label: 'ANULADO' },    
    { value: 'RECHAZADO', label: 'RECHAZADO' },
]
export const ENUM_ESTADOS_CONTABILIDAD = [   
    { value: 'VERIFICADO_RRHH', label: 'VERIFICADO_RRHH' },
    { value: 'APROBADO_CONTABILIDAD', label: 'APROBADO_CONTABILIDAD' },
    { value: 'EN_ESPERA_INFORME', label: 'EN_ESPERA_INFORME' },
    { value: 'REPOSICION_VENCIDA', label: 'REPOSICION_VENCIDA' },
    { value: 'ANULADO', label: 'ANULADO' },    
    { value: 'RECHAZADO', label: 'RECHAZADO' },
    { value: 'APROBADO_SECRETARIO', label: 'APROBADO_SECRETARIO' },
    { value: 'PENDIENTE', label: 'PENDIENTE' },
]

export const ENUM_ESTADOS_DESCARGO = [        
    { value: 0, label: 'VENCIDO' },
]

export const ENUM_ESTADOS_CANCELADOS = [        
    { value: "POST_PAGO_CANCELADO", label: 'POST_PAGO_CANCELADO' },
]

export const ENUM_TIPOS_VENCIMIENTO = [
    { value: 0, label: "0 DIAS VENCIDO" },
    { value: 1, label: "1 DIA" },
    { value: 2, label: "2 DIAS" },
    { value: 3, label: "3 DIAS" },
    { value: 4, label: "4 DIAS" },
    { value: 5, label: "5 DIAS" },
    { value: 6, label: "6 DIAS" },
    { value: 7, label: "7 DIAS" },
    { value: 8, label: "8 DIAS" },
]


export const ENUM_TIPOS_USUARIO = [
    { value: 'REGULAR', label: 'REGULAR' },
    { value: 'EVENTUAL', label: 'EVENTUAL' },
    { value: 'CONSULTOR', label: 'CONSULTOR' },
]

export const ENUM_ESTADOS_K = [
    { value: 'ABIERTO', label: 'ABIERTO' },
    { value: 'CERRADO', label: 'CERRADO' },
    { value: 'SUSPENDIDO', label: 'SUSPENDIDO' },

]


export const ENUM_ESTADOS_NM = [
    { value: 'DESCARGADO', label: 'DESCARGADO' },
    { value: 'CON_INFORME', label: 'CON_INFORME' },
    { value: 'DESCARGADO_CON_INFORME', label: 'DESCARGADO_CON_INFORME' },
    { value: 'PENDIENTE', label: 'PENDIENTE' }
]
export const ENUM_ESTADOS_MO = [
    { value: 'VENCIDO', label: 'VENCIDO' },
    { value: 'POR_VENCER', label: 'POR_VENCER' },
    { value: 'AUN_A_TIEMPO', label: 'AUN_A_TIEMPO' },
    { value: 'CON_TIEMPO', label: 'CON_TIEMPO' },
    { value: 'PENDIENTE', label: 'PENDIENTE' }
]

export const ENUM_AFP = [
    { value: 'FUTURO', label: 'Futuro' },
    { value: 'PREVISION', label: 'Prevision' },
    { value: 'GESTORA PUBLICA', label: 'Gestora Publica' }
];

export const ENUM_TIPO_CARGO = [
    { value: 'REGULAR', label: 'Regular' },
    { value: 'EVENTUAL', label: 'Eventual' },
    { value: 'CONSULTOR', label: 'Consultor' },
];

export const ENUM_TIPO_COMISION = [
    { value: 'INTERNACIONAL', label: 'Internacional' },
    { value: 'NACIONAL', label: 'Nacional/Departamental' },
    { value: 'PROVINCIAL', label: 'Provincial/Comunidad' },
];

export const ENUM_TIPO_MONEDA = [
    { value: 'DOLARES', label: 'DOLARES' },
    { value: 'BOLIVIANOS', label: 'BOLIVIANOS' },
];

/**modificado para boleeano */
export const ENUM_TIPO_MEMORANDUM = [
    { value: 'MEMORANDUM', label: 'Memorandum' },
    { value: 'REPOSICION', label: 'Reposicion' },
];
export const ENUM_DIAS_HABILES = [
    { value: 'HABILES' , label: 'Solo Dias Habiles, rango continuo, sin intermitencias/sin salto de dias.' },
    { value: 'INHABILES', label: 'Dias habiles y Fines de Semana, Feriados, rango discontinuo, intermitente/con salto de dias.' },
];
export const ENUM_TIPO_TRANSPORTE = [
    { value: 'AEREO', label: 'Aereo' },
    { value: 'NAVAL', label: 'Naval' },
    { value: 'TERRESTRE', label: 'Terrestre' },
];
//modificado para boleano
export const ENUM_TIPO_TRANSPORTE_OP = [
    { value: 'OFICIAL', label: 'OFICIAL' },
    { value: 'PUBLICO', label: 'PUBLICO' },
];

export const ENUM_SIN_APERTURA = [
    { value: 'SIN_APERTURA', label: 'SIN_APERTURA' },
];

export const ENUM_CATEGORIA_VIATICO = [
    { value: 'PRIMERA', label: 'Primera Categoria' },
    { value: 'SEGUNDA', label: 'Segunda Categoria' },
    { value: 'TERCERA', label: 'Tercera Categoria' },
    { value: 'CUARTA', label: 'Cuarta Categoria' },
    { value: 'QUINTA', label: 'Quinta Categoria' },
];

export const ENUM_ESCALA_VIATICOS = [
    { value: 'ESCALA1', label: 'ESCALA(1)' },
    { value: 'ESCALA2', label: 'ESCALA(2)' }
];

export const ENUM_TIPO_COMBUSTIBLE = [
    { value: 'GASOLINA', label: 'Gasolina' },
    { value: 'DIESEL', label: 'Diesel' },
];
export const ENUM_TIPO_MODALIDAD = [
    { value: 'OMNIBUS', label: 'OMNIBUS' },
    { value: 'MINIBUS', label: 'MINIBUS' },
    { value: 'OTRO', label: 'OTRO' },
];
export const ENUM_PERNOCTE = [
    { value: 'SIN PERNOCTE', label: 'SIN PERNOCTE' },
    { value: 'CON PERNOCTE', label: 'CON PERNOCTE' },
];
export const ENUM_HORA_INICIO = [
    { value: '08:00', label: '08:00' },
    { value: '08:30', label: '08:30' },
];
export const ENUM_HORA_FIN = [
    { value: '16:00', label: '16:00' },
    { value: '16:30', label: '16:30' },
    { value: '18:30', label: '18:30' },
];

export const ENUM_HAY_VIAJE = [
    { value: 'CON_VIAJE', label: 'SE VIAJA ESE DIA' },
    { value: 'SIN_VIAJE', label: 'NO SE VIAJA ESE DIA' },
];

export const ENUM_OBSERVACION_DESCARGO = [
    { value: 'SIN OBSERVACION', label: 'SIN OBSERVACION' },
    { value: 'CON OBSERVACION', label: 'CON OBSERVACION' },
];
export const ENUM_DEBE_HABER = [
    { value: 'EGRESO', label: 'EGRESO' },
    { value: 'INGRESO', label: 'INGRESO' },

];

export const ENUM_TIPO_MEMORANDUM_RRHH = [
    {value:'MEMORANDUM_SIN_COBRO', label: 'MEMORANDUM SIN COBRO'},
    {value:'MEMORANDUM_ASIGNACION_DE_FUNCIONES', label: 'MEMORANDUM ASIGNACION DE FUNCIONES'},
    {value:'MEMORANDUM_OTRO', label: 'MEMORANDUM OTRO'},

]

export const ENUM_PROVINCIAS = [
    { value: 'ABAROA', label: 'ABAROA' },
    { value: 'CARANGAS', label: 'CARANGAS' },
    { value: 'CERCADO', label: 'CERCADO' },
    { value: 'LADISLAO CABRERA', label: 'LADISLAO CABRERA' },
	{ value: 'LITORAL DE ATACAMA', label: 'LITORAL DE ATACAMA' },
    { value: 'MEJILLONES', label: 'MEJILLONES' },
	{ value: 'NOR CARANGAS', label: 'NOR CARANGAS' },
    { value: 'PANTALEÓN DALENCE', label: 'PANTALEÓN DALENCE' },
	{ value: 'POOPÓ', label: 'POOPÓ' },
    { value: 'SABAYA', label: 'SABAYA' },
	{ value: 'SAJAMA', label: 'SAJAMA' },
    { value: 'SAN PEDRO DE TOTORA', label: 'SAN PEDRO DE TOTORA' },
	{ value: 'SAUCARÍ', label: 'SAUCARÍ' },
    { value: 'SEBASTIÁN PAGADOR', label: 'SEBASTIÁN PAGADOR' },
	{ value: 'SUD CARANGAS', label: 'SUD CARANGAS' },
    { value: 'TOMÁS BARRÓN', label: 'TOMÁS BARRÓN' },
    { value: 'OTRO', label: 'OTRO' },
];

export const ENUM_DEPARTAMENTOS = [
    { value: 'PANDO', label: 'PANDO' },
    { value: 'BENI', label: 'BENI' },
    { value: 'LA PAZ', label: 'LA PAZ' },
    { value: 'COCHABAMBA', label: 'COCHABAMBA' },
	{ value: 'SANTA CRUZ', label: 'SANTA CRUZ' },
    { value: 'EL ALTO', label: 'EL ALTO' },
	{ value: 'POTOSI', label: 'POTOSI' },
    { value: 'CHUQUISACA', label: 'CHUQUISACA' },
	{ value: 'TARIJA', label: 'TARIJA' },
    { value: 'OTRO', label: 'OTRO' },
];

export const ENUM_TIPO_PAS_VIA = [
    { value:'PASAJE', label: 'PASAJE' },
    { value:'VIATICO', label: 'VIATICO' },
];

export const ENUM_TIPO_INT_EXT = [
    { value: 'INTERIOR', label: 'INTERIOR' },
    { value: 'EXTERIOR', label: 'EXTERIOR' },
];

export const ENUM_SINO = [
    { value: 1, label: 'si' },
    { value: 0, label: 'no' },
];

export const ENUM_SINO_2 = [
    { value: 'si', label: 'si' },
    { value: 'no', label: 'no' },
];

export const ENUM_SINO_3 = [
    { value: 'SI', label: 'Si' },
    { value: 'NO', label: 'No' },
    { value: 'OTRO', label: 'Otro' },
];

export const ENUM_SINCON_PROCESO = [
    { value: 'CON_PROCESO', label: 'Con Proceso' },
    { value: 'SIN_PROCESO', label: 'Sin Proceso' },
];

export const ENUM_TIPO_VEHICULO = [
    { value: 'GASOLINA', label: 'Gasolina' },
    { value: 'DIESEL', label: 'Diesel' },
];

export const ENUM_NOTIFICADO = [
    { value: 1, label: 'Notificado' },
    { value: 0, label: 'No Notificado' },
];
export const ENUM_TIPO_AREA = [
    { value: 'PRINCIPAL', label: 'PRINCIPAL' },
    { value: 'DEPENDENCIA', label: 'DEPENDENCIA' },
];

export const ENUM_ESTADO_CIVIL = [
    { value: 'CASADO(A)', label: 'CASADO(A)' },
    { value: 'SOLTERO(A)', label: 'SOLTERO(A)' },
    { value: 'DIVORCIADO(A)', label: 'DIVORCIADO(A)' },
    { value: 'VIUDO(A)', label: 'VIUDO(A)' },
];

export const ENUM_CIUDAD = [
    { value: 'LA PAZ', label: 'La Paz' },
    { value: 'CHUQUISACA', label: 'Chuquisaca' },
    { value: 'COCHABAMBA', label: 'Cochabamba' },
    { value: 'ORURO', label: 'Oruro' },
    { value: 'POTOSI', label: 'Potosí' },
    { value: 'TARIJA', label: 'Tarija' },
    { value: 'SANTA CRUZ', label: 'Santa Cruz' },
    { value: 'PANDO', label: 'Pando' },
    { value: 'BENI', label: 'Beni' }
]

export const ENUM_GESTION = [
    { value: '2010', label: '2010' },
    { value: '2011', label: '2011' },
    { value: '2012', label: '2012' },
    { value: '2013', label: '2013' },
    { value: '2014', label: '2014' },
    { value: '2015', label: '2015' },
    { value: '2016', label: '2016' },
    { value: '2017', label: '2017' },
    { value: '2018', label: '2018' },
    { value: '2019', label: '2019' },
    { value: '2020', label: '2020' },
    { value: '2021', label: '2021' },
    { value: '2022', label: '2022' },
    { value: '2023', label: '2023' },
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
    { value: '2026', label: '2026' },
    { value: '2027', label: '2027' },
    { value: '2028', label: '2028' },
    { value: '2029', label: '2029' },
    { value: '2030', label: '2030' },
    { value: '2031', label: '2031' },
    { value: '2032', label: '2032' },
    { value: '2033', label: '2033' },
    { value: '2034', label: '2034' },
];

export const ENUM_MES = [
    { value: 'enero',  label: 'Enero' },
    { value: 'febrero',  label: 'Febrero' },
    { value: 'marzo',  label: 'Marzo' },
    { value: 'abril',  label: 'Abril' },
    { value: 'mayo',  label: 'Mayo' },
    { value: 'junio',  label: 'Junio' },
    { value: 'julio',  label: 'Julio' },
    { value: 'agosto',  label: 'Agosto' },
    { value: 'septiembre',  label: 'Septiembre' },
    { value: 'octubre',  label: 'Octubre' },
    { value: 'noviembre',  label: 'Noviembre' },
    { value: 'diciembre', label: 'Diciembre' },
];

export const ENUM_GESTION_PERIODO = [
    { value: '2017-2018', label: '2017-2018' },
    { value: '2018-2019', label: '2018-2019' },
    { value: '2019-2020', label: '2019-2020' },
    { value: '2020-2021', label: '2020-2021' },
    { value: '2021-2022', label: '2021-2022' },
    { value: '2022-2023', label: '2022-2023' },
    { value: '2023-2024', label: '2023-2024' },
    { value: '2024-2025', label: '2024-2025' },
    { value: '2025-2026', label: '2025-2026' },
    { value: '2026-2027', label: '2026-2027' },
    { value: '2027-2028', label: '2027-2028' },
    { value: '2028-2029', label: '2028-2029' },
    { value: '2029-2030', label: '2029-2030' },
    { value: '2030-2031', label: '2030-2031' },
    { value: '2031-2032', label: '2031-2032' },
    { value: '2032-2033', label: '2032-2033' },
    { value: '2033-2034', label: '2033-2034' },
];

export const ENUM_PERMISOS = [
    { value: 'create', label: 'Crear' },
    { value: 'read', label: 'Leer' },
    { value: 'edit', label: 'Editar' },
    { value: 'remove', label: 'Borrar' },
    { value: 'send', label: 'Enviar' },
    { value: 'download', label: 'Descarga' },
    { value: 'approve', label: 'Aprobar' },
    { value: 'lock', label: 'Reset' },
];

export const ENUM_TIPO_SOLICITUD = [
    { value: 'PROGRAMADA', label: 'Programada' },
    { value: 'SOLICITADA', label: 'Solicitada' }
];

export const ENUM_TIPO_PERMISO = [
    { value: 'PARTICULAR', label: 'Particular' },
    { value: 'LICENCIA', label: 'Licencia' },
    { value: 'COMISION', label: 'Comision' },
    { value: 'OLVIDO', label: 'Olvido' }
];

export const ENUM_TIPO_VACACION = [
    { value: 'COMPLETO', label: 'Completo' },
    { value: 'MEDIO', label: 'Medio' },
    { value: 'HORAS', label: 'Horas' },
];

export const ENUM_ESTADO_JEFE = [
    'PENDIENTE',
    'VERIFICADO_RRHH',
    'RECHAZADO',
];
export const ENUM_ESTADO_JEFE_SDAFP = [
    'PENDIENTE',
    'APROBADO_JEFE',
    'APROBADO_CONTABILIDAD',
    'RECHAZADO',
];

export const ENUM_TIPO_CONTRA = [
    { value: 'LP', label: 'LP - Licitacion Publica > 1.000.000 - 70.000.000' },
    { value: 'ANPE1', label: 'ANPE - ANPE > 50.000 - 200.000' },
    { value: 'ANPE2', label: 'ANPE - ANPE > 200.000 - 1.000.000' },
    { value: 'CM', label: 'CM - Contratacion Menor' },
    { value: 'EX', label: 'EX - Contratacion Excepcion' },
    { value: 'EM', label: 'EM - Contratacion Por Desastres y/o Emergencias' },
    { value: 'CD', label: 'CD - Contratacion Directa de Bienes y Servicios' },
    { value: 'CDNE', label: 'CDNE - Contratacion Directa bajo normativa especifica' },
];

export const ENUM_TIPO_CONTRA2 = [
    { value: 'LP', label: 'LP' },
    { value: 'ANPE1', label: 'ANPE1' },
    { value: 'ANPE2', label: 'ANPE2' },
    { value: 'CM', label: 'CM' },
    { value: 'EX', label: 'EX' },
    { value: 'EM', label: 'EM' },
    { value: 'CD', label: 'CD' },
    { value: 'CDNE', label: 'CDNE' },
];

export const ENUM_OPTIONS_MENU = [
    { name: 'dashboard', description: 'Principal' },
    { name: 'rrhh', description: 'Recursos humanos' },
    { name: 'contra', description: 'Contrataciones' },
    { name: 'bienes', description: 'Bienes y Servicios' },
    { name: 'conta', description: 'Contabilidad' },
    { name: 'archivo', description: 'Archivo' },
    { name: 'viatico', description: 'Viatico' },
    { name: 'apertura', description: 'Apertura' },
    { name: 'correspondencia', description: 'Correspondencia' },
    { name: 'auditoria', description: 'Bitacora' },

];

export const ENUM_DEUDA = ['ACTIVO', 'SALDADO'];
export const ENUM_PROCESODETALLE = ['PENDIENTE', 'ATENDIDO','PROCESO','ATRASADO'];


export const ENUM_IS_JEFE = 'jefe';

export const STORAGE_LOCAL = '/static/mock-images/avatars';

export const DEFAULT_CENTER = { lat: -17.969624502296277, lng: -67.11449045679467 };
export const DEFAULT_ZOOM = 17;
export const COMPRESION_IMAGEN_PERFIL = 0.85;

export const TIME_FORMAT = 'HH:mm';
export const TIME_FORMAT_2 = 'HH:mm:ss';
