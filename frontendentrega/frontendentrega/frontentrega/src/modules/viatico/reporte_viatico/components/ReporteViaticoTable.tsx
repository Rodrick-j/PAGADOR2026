import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, StatusColumn, ActionColumn, ChangeStateColumn, OnUpdateOptions, DataTableRefProps, ActiveColumn } from 'components/core/DataTable';
//@mui
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';

//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { ReporteViaticoModuleService } from 'modules/viatico/reporte_viatico/ReporteViaticoModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { BACKGROUND_1, ESTADO_A, ESTADO_APROBADO_JEFE, ESTADO_E, ESTADO_J, ESTADO_K, ESTADO_L, ESTADO_O } from 'constants/colors';
import { ANULADO, APROBADO, ENUM_ESTADOS_CANCELADOS, ENUM_ESTADOS_I, ENUM_ESTADOS_IJ, ENUM_ESTADOS_J, ENUM_ESTADOS_OBSERVADO, ENUM_ESTADOS_PAGO, ENUM_TIPO_COMISION, ENUM_TIPOS_USUARIO, ENUM_TIPOS_VENCIMIENTO, OBSERVADO, SIN_OBSERVACION } from 'constants/enums';
import { ConfirmDialog } from 'components/core/ConfirmDialog';
import { CheckCircleOutline } from '@mui/icons-material';
import { ViaticoTableModel } from 'modules/viatico/viatico/components/ViaticoTable';
import { getAvatarURL } from 'utils';

export type ReporteViaticoTableModel = {
    id                     : string;
    num_recibo             : string;
    fecha_descargo         : Date;
    estado_descargo        : string;
    viatico_pasaje_real    : number;
    monto_despositado      : number;
    monto_descargo         : number;
    saldo_descargo         : number;
    presenta_informe       : string;
    viatico_real           : number;
    observacion_estado     : string;
    observacion_descargo   : string;
    prorroga               : boolean;
    tiempo_descargo        : number;
    notificacion_descargo  : boolean;
    activo                 : boolean;
    viatico_id             : string;
    // para las columnas especiales
    actions: unknown;
   //campos adicionales necesarios
   usuario_nombre           : string;
   usuario_cargo            : string;
   usuario_ci               : string;
   usuario_tipo?            : string;
   liquido_pagable?          : number;
   fecha_ida?                : string;
   fecha_retorno?            : string;
   destino?                  : string;
   cod_memo?                 : string; 
   cantidad_dias?            : number;  
   imprimir?                 : string;
   tipo_memo_repo?           : string;
   fecha_descargo_format? : string;
   partida_presupuestaria?   : string;
   ff_of?                    : string;
   area?                     : string;
   sigla? : string;
   radio? : any;  
   estado_pago? : string;
   

   //tabla viaticos
    nume_recibo           : number;
    fecha_pago_viatico    : Date;
    suma_pasaje_ida       : number;
    suma_pasaje_retorno   : number;
    tipo_pasaje_gd        : string;
    total_pasajes         : number;
    total_viatico         : number;
   // liquido_pagable       : number;
   // estado_pago           : string;
    estado_recibo         : string;
    fecha_anulacion       : Date;
    notificacion_viatico  : string;
    notificacion_memo?     : string;
    estado_memorandum?     : string;

    memorandum_id?          : string | null; //aumentado
    escala_id?              : string | null; //aumentado
   // activo                 : boolean;
    fecha_format_memo?      :string;
   //tipo_memo_repo?         : string | null; //aumentado
     //campos de escala
     categoria?             : string;
     escala?                : string;
     viaticoPorDia?         : number;
     moneda?                : string;
     bolivianos?            : number;
     cargoId?               : string;
     conteo_dias_detalle    : number;

      cod_memorandum        : string;
     fecha_memo             : Date;
     usuario_id             : string;
     ci                     : string;
     destino_id             : string;
     tipo_comision_idp      : string;
     fecha_viaje_ida        : Date;
     fecha_viaje_retorno    : Date;
   //  cantidad_dias :number;
     transporte_op          : string;
     apertura_prog          : string;
     fondo_financia         : string;
     sisin                  : string;
    imagen                  : string;
    
    modificacion            : boolean,
    obs_modificacion        : string | null,
    fecha_cambio            : string,
    estado_modificacion     : string,
    area_indice_usuario?    : string,
    fecha_anulacion_recibo? : string,

};


export type ReporteViaticoTableRefProps = {
    refresh: (updateParams?: UpdateParams<ReporteViaticoTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<ReporteViaticoTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const nombresFilter: HeaderFilter = { type: 'text' };
const nombrePadreFilter: HeaderFilter = { type: 'text' };
const partidaFilter: HeaderFilter = { type: 'text' };
const estadosFilter: HeaderFilter = { type: 'select',options: ENUM_ESTADOS_I};
const estadosFilterPago: HeaderFilter = { type: 'select',options: ENUM_ESTADOS_PAGO};
const informeFilter: HeaderFilter = { type: 'select',options: ENUM_ESTADOS_J};
const tipoUsuarioFilter: HeaderFilter = {type:'select',options: ENUM_TIPOS_USUARIO}
const tipoComisionFilter: HeaderFilter = {type:'select',options: ENUM_TIPO_COMISION}

// Rango de fechas
const fechaFilter: HeaderFilter = { type: 'date' };

type Props = {
    onAddClick: () => void;
    onViewClick: (idReporteViatico: string) => Promise<void>;
    onEditClick: (idReporteViatico: string) => Promise<void>;
    onDownloadClick?: (fechaInicio : string, fechaFin: string,tipoFecha: number ) => void;
    onDownloadExcel?: (fechaInicio : string, fechaFin: string ) => void;
    tipoReporte: string;    
    loading : boolean;
};


export const ReporteViaticoTableComponent = (props: Props, ref: React.Ref<ReporteViaticoTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick, onDownloadClick,onDownloadExcel ,tipoReporte, loading} = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<ReporteViaticoTableModel>>(tableParamsInitialize);
    const [dataBase, setDataBase] = useState<ReporteViaticoTableModel[]>([]);    
  
     // Estado para el rango de fechas
     const [fechaInicio, setFechaInicio] = useState<string>('');
     const [fechaFin, setFechaFin] = useState<string>('');
     const [beneficiario, setBeneficiario] = useState<string>('');

     const [nombre, setNombre] = useState<string>('');
     const [apellido, setApellido] = useState<string>('');
     const [tipo, setTipo] = useState<string>('');
     const [reciboAnulado, setReciboAnulado] = useState<string>('');
      const [estadoPago, setEstadoPago] = useState<string>('');
      const [modificacion, setModificacion] = useState<string>('');
    const [mesSeleccionado, setMesSeleccionado] = useState("");
     
    // Estado donde guardas el último filtro aplicado
        const [filtroActivo, setFiltroActivo] = useState<{
            fechaInicio: string;
            fechaFin: string;
            tipoFecha?: number;
        } | null>(null);
     
     // Filtrar por fechas
     const filtrarPorFecha = (datos: any[]) => {
        
         if (!fechaInicio || !fechaFin) return datos; // Si no hay fechas seleccionadas, no filtramos
                     
         const inicio = convertirFecha(fechaInicio);        
         const fin = convertirFecha(fechaFin);
                       
         // Filtrar los datos por fechas
        const filteredByDate = datos.filter(item => {						
            const fechaFormat = convertirFecha(item.fecha_ida);
            const itemDate = fechaFormat; 		
            return  itemDate! >= inicio! && itemDate! <= fin!;			
        });         
       
        return filteredByDate;
      
     };

     // conversion de fecha
     const convertirFecha = (fecha : any )=> {
            
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
   
    const tableRef = useRef<DataTableRefProps>(null);
    let tableHeaders: TableHeader<ReporteViaticoTableModel>[] =[];
    let tableHeadersRRHH: TableHeader<ViaticoTableModel>[] =[];
    if (props.tipoReporte === "GENERAL"){

         tableHeaders = [
                  
               { id: 'num_recibo', label: 'Numero de Recibo Viatico', align: 'center', width: 140 ,filter: partidaFilter },
               { id: 'tipo_memo_repo', label: 'Tipo de Memorandum', align: 'center', width: 140 },
               { id: 'fecha_pago_viatico', label: 'Fecha Pago Viatico', align: 'center', width: 140 , filter: fechaFilter},
               { id: 'usuario_nombre', label: 'Nombre de Usuario', align: 'center', width: 200,filter: partidaFilter },
               { id: 'usuario_ci', label: 'C.I.', align: 'center' ,filter: partidaFilter},
               { id: 'usuario_cargo', label: 'Cargo de Usuario', align: 'center', width: 220 },
               { id: 'cod_memo', label: 'Cod. Memo', align: 'center', width: 220,filter: partidaFilter},
               { id: 'fecha_ida' , label: 'Fecha Inicio Viaje', align: 'center'},
               { id: 'fecha_retorno' , label: 'Fecha Retorno Viaje', align: 'center'},
               { id: 'estado_pago', label: 'Estado Pago', align: 'center', width: 150, render:renderColumnStatusPago },  
               { id: 'destino' , label: 'Destino', align: 'center'},
               { id: 'cantidad_dias' , label: 'Cantidad de Dias', align:'center'},      
               { id: 'area', label: 'Area', align: 'center', width: 200 ,filter: partidaFilter }, 
               { id: 'sigla', label: 'Sigla', align: 'center', width: 80  },
               { id: 'tipo_comision_idp', label: 'Tipo de Comision', align: 'center', width: 100,  filter: tipoComisionFilter  },
               { id: 'partida_presupuestaria', label: 'Partida Presupuestaria', align: 'center', width: 150 ,filter: partidaFilter },
               { id: 'ff_of', label: 'Fuente de Financiamiento', align: 'center', width: 140,filter: partidaFilter }, 
               { id: 'liquido_pagable', label: 'Liquido Pagable', align: 'center'},
               { id: 'fecha_descargo_format', label: 'Fecha Descargo Viatico', align: 'center'},    
               { id: 'viatico_pasaje_real', label: 'Viatico Pasaje Real', align: 'center' , width: 120},
               { id: 'viatico_real', label: 'Viatico Real', align: 'center' , width: 120},       
               { id: 'monto_descargo', label: 'Monto Viatico', align: 'center' },
               { id: 'saldo_descargo', label: 'Saldo Viatico', align: 'center' },
               { id: 'monto_despositado', label: 'Monto Depositado', align: 'center' },
               { id: 'observacion_estado', label: 'Tiene Observacion', align: 'center' , width: 120},
               { id: 'observacion_descargo', label: 'Descripcion Observacion', align: 'center' , width: 180},
               { id: 'presenta_informe', label: 'Presenta Informe', align: 'center',filter:informeFilter }, 
               { id: 'estado_descargo', label: 'Descarga', align: 'center', width: 150,filter:estadosFilter },     
               { id: 'tiempo_descargo', label: 'Tiempo ReporteViatico', align: 'center' },               
               { id: 'notificacion_descargo', label: 'Notificaciones ReporteViatico', align: 'center',render:renderColumnStatusDias},
               { id: 'activo', label: 'Estado', align: 'center', render:renderColumnStatus,width: 220},

             
           ];
    }
    if (props.tipoReporte === "REPORTE_POR_PLANILLA"){
        tableHeaders = [
                       
               { id: 'num_recibo', label: 'Numero de Recibo Viatico', align: 'center', width: 140 ,filter: partidaFilter},
               { id: 'ff_of', label: 'Fuente de Financiamiento', align: 'center', width: 140,filter: partidaFilter }, 
               { id: 'partida_presupuestaria', label: 'Partida Presupuestaria', align: 'center', width: 150 ,filter: partidaFilter },            
               { id: 'usuario_nombre', label: 'Nombre de Usuario', align: 'center', width: 200,filter: partidaFilter },
               { id: 'cod_memo', label: 'Cod. Memo', align: 'center', width: 220,filter: partidaFilter},
               { id: 'usuario_ci', label: 'C.I.', align: 'center' ,filter: partidaFilter},
               { id: 'sigla', label: 'Sigla', align: 'center', width: 80 ,filter: partidaFilter },
               { id: 'usuario_cargo', label: 'Cargo de Usuario', align: 'center', width: 220 },
               { id: 'destino' , label: 'Destino', align: 'center'},              
               { id: 'fecha_ida' , label: 'Fecha Inicio Viaje', align: 'center'},
               { id: 'fecha_retorno' , label: 'Fecha Retorno Viaje', align: 'center'},                         
               { id: 'cantidad_dias' , label: 'Cantidad de Dias', align:'center'},      
               { id: 'area', label: 'Area', align: 'center', width: 200 ,filter: partidaFilter },
               { id: 'tipo_memo_repo', label: 'Tipo de Memorandum', align: 'center', width: 140 },
               { id: 'liquido_pagable', label: 'Liquido Pagable', align: 'center'},
               { id: 'fecha_descargo_format', label: 'Fecha Descargo Viatico', align: 'center'},
               { id: 'viatico_pasaje_real', label: 'Viatico Pasaje Real', align: 'center' , width: 120},
               { id: 'viatico_real', label: 'Viatico Real', align: 'center' , width: 120},       
               { id: 'monto_descargo', label: 'Monto Viatico', align: 'center' },
               { id: 'saldo_descargo', label: 'Saldo Viatico', align: 'center' },
               { id: 'monto_despositado', label: 'Monto Depositado', align: 'center' },
               { id: 'observacion_estado', label: 'Tiene Observacion', align: 'center' , width: 120},
               { id: 'observacion_descargo', label: 'Descripcion Observacion', align: 'center' , width: 180},
               { id: 'presenta_informe', label: 'Presenta Informe', align: 'center',filter:informeFilter },
               { id: 'estado_descargo', label: 'Descarga', align: 'center', width: 150,filter:estadosFilter },
               { id: 'tiempo_descargo', label: 'Tiempo ReporteViatico', align: 'center' },
               { id: 'notificacion_descargo', label: 'Notificaciones ReporteViatico', align: 'center',render:renderColumnStatusDias},
               { id: 'activo', label: 'Estado', align: 'center', render:renderColumnStatus,width: 220}, 
             
           ];
    } 
    if (props.tipoReporte === "REPORTE_POR_PROYECTO"){
        tableHeaders = [

               { id: 'ff_of', label: 'Fuente de Financiamiento', align: 'center', width: 140,filter: partidaFilter },//, 
               { id: 'partida_presupuestaria', label: 'Partida Presupuestaria', align: 'center', width: 150 ,filter: partidaFilter },
               { id: 'num_recibo', label: 'Numero de Recibo Viatico', align: 'center', width: 140 ,filter: partidaFilter},//
               { id: 'usuario_ci', label: 'C.I.', align: 'center' ,filter: partidaFilter},//,              
               { id: 'usuario_nombre', label: 'Nombre de Usuario', align: 'center', width: 200,filter: partidaFilter },//,
               { id: 'sigla', label: 'Sigla', align: 'center', width: 80 ,filter: partidaFilter },             
               { id: 'usuario_cargo', label: 'Cargo de Usuario', align: 'center', width: 220 },//,
               { id: 'cod_memo', label: 'Cod. Memo', align: 'center', width: 220,filter: partidaFilter},//
               { id: 'destino' , label: 'Destino', align: 'center'},
               { id: 'fecha_ida' , label: 'Fecha Inicio Viaje', align: 'center'},//
               { id: 'fecha_retorno' , label: 'Fecha Retorno Viaje', align: 'center'},               
               { id: 'cantidad_dias' , label: 'Cantidad de Dias', align:'center'},      
               { id: 'area', label: 'Area', align: 'center', width: 200 ,filter: partidaFilter },//
               { id: 'tipo_memo_repo', label: 'Tipo de Memorandum', align: 'center', width: 140 },//
               { id: 'liquido_pagable', label: 'Liquido Pagable', align: 'center'},
               { id: 'fecha_descargo_format', label: 'Fecha Descargo Viatico', align: 'center' },//
               { id: 'viatico_pasaje_real', label: 'Viatico Pasaje Real', align: 'center' , width: 120},
               { id: 'viatico_real', label: 'Viatico Real', align: 'center' , width: 120},       
               { id: 'monto_descargo', label: 'Monto Viatico', align: 'center' },
               { id: 'saldo_descargo', label: 'Saldo Viatico', align: 'center' },
               { id: 'monto_despositado', label: 'Monto Depositado', align: 'center' },
               { id: 'observacion_estado', label: 'Tiene Observacion', align: 'center' , width: 120},
               { id: 'observacion_descargo', label: 'Descripcion Observacion', align: 'center' , width: 180},
               { id: 'presenta_informe', label: 'Presenta Informe', align: 'center',filter:informeFilter },
               { id: 'estado_descargo', label: 'Descarga', align: 'center', width: 150,filter:estadosFilter },
               { id: 'tiempo_descargo', label: 'Tiempo ReporteViatico', align: 'center' },
               { id: 'notificacion_descargo', label: 'Notificaciones ReporteViatico', align: 'center',render:renderColumnStatusDias},
               { id: 'activo', label: 'Estado', align: 'center', render:renderColumnStatus,width: 220},
            
           ];
    }    
    if (props.tipoReporte === "REPORTE_FF_OF" ){
        tableHeaders = [
            //   { id: 'actions', label: 'Acciones', sort: false, render:renderColumnActions },
       
               { id: 'num_recibo', label: 'Numero de Recibo Viatico', align: 'center', width: 140 ,filter: partidaFilter},
               { id: 'partida_presupuestaria', label: 'Partida Presupuestaria', align: 'center', width: 150 ,filter: partidaFilter },
               { id: 'usuario_ci', label: 'C.I.', align: 'center' ,filter: partidaFilter},//,              
               { id: 'usuario_nombre', label: 'Nombre de Usuario', align: 'center', width: 200,filter: partidaFilter },//,
               { id: 'sigla', label: 'Sigla', align: 'center', width: 80 ,filter: partidaFilter },
               { id: 'usuario_cargo', label: 'Cargo de Usuario', align: 'center', width: 220 },//,
               { id: 'cod_memo', label: 'Cod. Memo', align: 'center', width: 220,filter: partidaFilter},//
               { id: 'destino' , label: 'Destino', align: 'center'},
               { id: 'fecha_ida' , label: 'Fecha Inicio Viaje', align: 'center'},//
               { id: 'fecha_retorno' , label: 'Fecha Retorno Viaje', align: 'center'},              
               { id: 'cantidad_dias' , label: 'Cantidad de Dias', align:'center'},      
               { id: 'area', label: 'Area', align: 'center', width: 200 ,filter: partidaFilter },//
               { id: 'tipo_memo_repo', label: 'Tipo de Memorandum', align: 'center', width: 140 },//
               { id: 'ff_of', label: 'Fuente de Financiamiento', align: 'center', width: 140,filter: partidaFilter },//, 
               { id: 'liquido_pagable', label: 'Liquido Pagable', align: 'center'},
               { id: 'fecha_descargo_format', label: 'Fecha Descargo Viatico', align: 'center'},
               { id: 'viatico_pasaje_real', label: 'Viatico Pasaje Real', align: 'center' , width: 120},
               { id: 'viatico_real', label: 'Viatico Real', align: 'center' , width: 120},       
               { id: 'monto_descargo', label: 'Monto Viatico', align: 'center' },
               { id: 'saldo_descargo', label: 'Saldo Viatico', align: 'center' },
               { id: 'monto_despositado', label: 'Monto Depositado', align: 'center' },
               { id: 'observacion_estado', label: 'Tiene Observacion', align: 'center' , width: 120},
               { id: 'observacion_descargo', label: 'Descripcion Observacion', align: 'center' , width: 180},
               { id: 'presenta_informe', label: 'Presenta Informe', align: 'center',filter:informeFilter },
               { id: 'estado_descargo', label: 'Descarga', align: 'center', width: 150,filter:estadosFilter },        
               { id: 'tiempo_descargo', label: 'Tiempo ReporteViatico', align: 'center' },
               { id: 'notificacion_descargo', label: 'Notificaciones ReporteViatico', align: 'center',render:renderColumnStatusDias},
               { id: 'activo', label: 'Estado', align: 'center', render:renderColumnStatus,width: 220},
             
           ];
    } if ( props.tipoReporte === "REPORTE_POR_BENEFICIARIO"){
        tableHeaders = [
           
               { id: 'num_recibo', label: 'Numero de Recibo Viatico', align: 'center', width: 140 ,filter: partidaFilter},
               { id: 'ff_of', label: 'Fuente de Financiamiento', align: 'center', width: 140,filter: partidaFilter },
               { id: 'partida_presupuestaria', label: 'Partida Presupuestaria', align: 'center', width: 150 ,filter: partidaFilter },
               { id: 'fecha_pago_viatico', label: 'Fecha Pago Viatico', align: 'center', width: 140 , filter: fechaFilter},
               { id: 'usuario_nombre', label: 'Nombre de Usuario', align: 'center', width: 200,filter: partidaFilter },
               { id: 'cod_memo', label: 'Cod. Memo', align: 'center', width: 220,filter: partidaFilter},
               { id: 'usuario_ci', label: 'C.I.', align: 'center' ,filter: partidaFilter},
               { id: 'sigla', label: 'Sigla', align: 'center', width: 80 ,filter: partidaFilter },
               { id: 'usuario_cargo', label: 'Cargo de Usuario', align: 'center', width: 220 },
               { id: 'destino' , label: 'Destino', align: 'center'},              
               { id: 'fecha_ida' , label: 'Fecha Inicio Viaje', align: 'center'},
               { id: 'fecha_retorno' , label: 'Fecha Retorno Viaje', align: 'center'},                         
               { id: 'cantidad_dias' , label: 'Cantidad de Dias', align:'center'},      
               { id: 'area', label: 'Area', align: 'center', width: 200 ,filter: partidaFilter },
               { id: 'tipo_memo_repo', label: 'Tipo de Memorandum', align: 'center', width: 140 },
               { id: 'liquido_pagable', label: 'Liquido Pagable', align: 'center'},
               { id: 'fecha_descargo_format', label: 'Fecha Descargo Viatico', align: 'center'},
               { id: 'viatico_pasaje_real', label: 'Viatico Pasaje Real', align: 'center' , width: 120},
               { id: 'viatico_real', label: 'Viatico Real', align: 'center' , width: 120},       
               { id: 'monto_descargo', label: 'Monto Viatico', align: 'center' },
               { id: 'saldo_descargo', label: 'Saldo Viatico', align: 'center' },
               { id: 'monto_despositado', label: 'Monto Depositado', align: 'center' },
               { id: 'observacion_estado', label: 'Tiene Observacion', align: 'center' , width: 120},
               { id: 'observacion_descargo', label: 'Descripcion Observacion', align: 'center' , width: 180},
               { id: 'presenta_informe', label: 'Presenta Informe', align: 'center',filter:informeFilter },
               { id: 'estado_descargo', label: 'Descarga', align: 'center', width: 150,filter:estadosFilter },
               { id: 'tiempo_descargo', label: 'Tiempo ReporteViatico', align: 'center' },             
               { id: 'notificacion_descargo', label: 'Notificaciones ReporteViatico', align: 'center',render:renderColumnStatusDias},
               { id: 'activo', label: 'Estado', align: 'center', render:renderColumnStatus,width: 220},
             
           ];
    }  if (props.tipoReporte === "REPORTE_POR_TIPO"){
        tableHeaders = [
                       
            { id: 'num_recibo', label: 'Numero de Recibo Viatico', align: 'center', width: 140,filter: partidaFilter },
            { id: 'usuario_tipo', label: 'Tipo de Usuario', align: 'center', width: 140,filter: tipoUsuarioFilter  },
            { id: 'fecha_anulacion_recibo', label: 'Fecha Anulacion Recibo', align: 'center', width: 140 },
            { id: 'fecha_pago_viatico', label: 'Fecha Pago Viatico', align: 'center', width: 140 , filter: fechaFilter},
            { id: 'usuario_nombre', label: 'Nombre de Usuario', align: 'center', width: 200,filter: partidaFilter },
            { id: 'usuario_ci', label: 'C.I.', align: 'center' ,filter: partidaFilter},
            { id: 'usuario_cargo', label: 'Cargo de Usuario', align: 'center', width: 220 },
            { id: 'cod_memo', label: 'Cod. Memo', align: 'center', width: 220,filter: partidaFilter},
            { id: 'fecha_ida' , label: 'Fecha Inicio Viaje', align: 'center'},
            { id: 'fecha_retorno' , label: 'Fecha Retorno Viaje', align: 'center'},
            { id: 'estado_pago', label: 'Estado Pago', align: 'center', width: 150,render: renderColumnStatusPago },
            { id: 'destino' , label: 'Destino', align: 'center'},
            { id: 'cantidad_dias' , label: 'Cantidad de Dias', align:'center'},      
            { id: 'area', label: 'Area', align: 'center', width: 200 ,filter: partidaFilter }, 
            { id: 'sigla', label: 'Sigla', align: 'center', width: 80 ,filter: partidaFilter },
            { id: 'partida_presupuestaria', label: 'Partida Presupuestaria', align: 'center', width: 150 ,filter: partidaFilter },
            { id: 'ff_of', label: 'Fuente de Financiamiento', align: 'center', width: 140,filter: partidaFilter }, 
            { id: 'liquido_pagable', label: 'Liquido Pagable', align: 'center'},
            { id: 'fecha_descargo_format', label: 'Fecha Descargo Viatico', align: 'center'},    
            { id: 'viatico_pasaje_real', label: 'Viatico Pasaje Real', align: 'center' , width: 120},
            { id: 'viatico_real', label: 'Viatico Real', align: 'center' , width: 120},       
            { id: 'monto_descargo', label: 'Monto Viatico', align: 'center' },
            { id: 'saldo_descargo', label: 'Saldo Viatico', align: 'center' },
            { id: 'monto_despositado', label: 'Monto Depositado', align: 'center' },
            { id: 'observacion_estado', label: 'Tiene Observacion', align: 'center' , width: 120},
            { id: 'observacion_descargo', label: 'Descripcion Observacion', align: 'center' , width: 180},
            { id: 'presenta_informe', label: 'Presenta Informe', align: 'center',filter:informeFilter }, 
            { id: 'estado_descargo', label: 'Descarga', align: 'center', width: 150,filter:estadosFilter },     
            { id: 'tiempo_descargo', label: 'Tiempo ReporteViatico', align: 'center' },               
            { id: 'notificacion_descargo', label: 'Notificaciones ReporteViatico', align: 'center',render:renderColumnStatusDias},
            { id: 'activo', label: 'Estado', align: 'center', render:renderColumnStatus,width: 220},
             
           ];
    } 

    if (props.tipoReporte === "REPORTE_PARA_RRHH"){
        tableHeadersRRHH = [
                       
       // { id: 'actions', label: 'Acciones', sort: false , render:renderColumnActions},

        { id: 'nume_recibo', label: 'Numero de Recibo', align: 'center', width:150 , filter: nombresFilter },
        { id: 'cod_memorandum', label: 'Codigo de Memorandum', align: 'center', width:250 , filter: nombresFilter },
        { id: 'tipo_memo_repo', label: 'Tipo de Memorandum', align: 'center', width:150 , filter: nombresFilter },
        { id: 'usuario_tipo', label: 'Tipo de Usuario', align: 'center', width: 140,filter: tipoUsuarioFilter  },
        { id: 'fecha_format_memo', label: 'Fecha de Memorandum', align: 'center', width:150 , filter: nombresFilter },
        { id: 'usuario_id', label: 'Nombre Completo', align: 'center', width:250 , filter: nombresFilter, render:renderColumnSolicitante },
        { id: 'ci', label: 'C.I.', align: 'center', filter: nombresFilter },
        { id: 'tipo_comision_idp', label: 'Tipo de Comision', align: 'center', width:150 },
        { id: 'destino_id', label: 'Destino', align: 'center', width:150 , filter: nombresFilter },
        { id: 'fecha_viaje_ida', label: 'Fecha Inicio Viaje', align: 'center', width:150},
        { id: 'fecha_viaje_retorno', label: 'Fecha Fin Viaje', align: 'center', width:150},
        { id: 'cantidad_dias', label: 'Cantidad de Dias', align: 'center' },
       // { id: 'transporte_op', label: 'Tipo de transporte', align: 'center' },
        { id: 'apertura_prog', label: 'Apertura Programatica', align: 'center', width:150 , filter: nombresFilter},
      //  { id: 'modificacion', label: 'Modificaciones', align: 'center', width: 150, },
        { id: 'notificacion_memo', label: 'Estado Memorandum', align: 'center', render:renderColumnStatusMemo },
        { id: 'notificacion_viatico', label: 'Estado Viatico', align: 'center', render:renderColumnStatusRRHH},
        { id: 'obs_modificacion', label: 'Observaciones', align: 'center', width: 200, },
        { id: 'fecha_cambio', label: 'Fechas de Cambio', align: 'center', width: 100,   },
        { id: 'estado_modificacion', label: 'Estado Modificaciones', align: 'center', width: 180, render: renderModificacionStatus  },
      //  { id: 'fondo_financia', label: 'Fondo de Financiamiento', align: 'center'},
      //  { id: 'sisin', label: 'SISIN', align: 'center', width:250 },

       // { id: 'nume_recibo', label: 'Numero de Recibo', align: 'center', width:150 },
      //  { id: 'fecha_pago_viatico', label: 'Fecha Pago de Viatico', align: 'center', width:150, filter: nombresFilter },
      //  { id: 'suma_pasaje_ida', label: 'Suma Pasaje Ida', align: 'center', width:150 },
     //   { id: 'suma_pasaje_retorno', label: 'Suma Pasaje Retorno', align: 'center', width:160},
       // { id: 'tipo_pasaje_gd', label: 'Tipo Pasaje General/Detallado', align: 'center', width:180, filter: nombrePadreFilter },
       // { id: 'total_pasajes', label: 'Total Pasajes', align: 'center', width:150 },// render: renderColumnPadre,
       // { id: 'total_viatico', label: 'Total Viatico', align: 'center',width:150 },//, render: renderColumnActive
       // { id: 'liquido_pagable', label: 'Liquido Pagable', align: 'center',width:150 },
       // { id: 'estado_pago', label: 'Pago Viatico', align: 'center', width:150, render:renderColumnChange, filter:estadosFilter },
      //  { id: 'estado_recibo', label: 'Estado Recibo', align: 'center',width:150, filter: partidaFilter },
       // { id: 'fecha_anulacion', label: 'Fecha de Anulacion', align: 'center',width:150, filter: nombrePadreFilter },
   
      //  { id: 'activo', label: 'Estado', align: 'center' },//, render: renderColumnStatus
   //     { id: 'options', label: 'Detalle Destino', sort: false, width:200, render:renderColumnOptions, align: 'center' },//, render: renderColumnStatus
     //   { id: 'imprimir', label: 'Descargar Recibo', sort: false, render: renderImpresionOptions, align: 'center' ,width:100},//render: renderImpresionOptions,
             
           ];
    } 
    

    const handleUpdateTable = (params: UpdateParams<ReporteViaticoTableModel>, opt: OnUpdateOptions) => {
      
        opt.setLoading(true);       
        if (!isMounted()) return;

        const newParams = {
            ...params,
            filters: { ...params.filters, tipo_reporte: tipoReporte },
        };

        if (props.tipoReporte === "REPORTE_PARA_RRHH"){ 			
            
                ReporteViaticoModuleService.getTableReporteViaticoRRHH(newParams as QueryParams).then((result) => {                                 
                opt.setLoading(false);
                if (!result.success) return;
                const newTableParams: UpdateParams<ReporteViaticoTableModel> = {				
                
                    ...params,
                    rows: result.rows || [],
                    count: result.count || 0
                };                
                if (isMounted()) setTableParams(newTableParams);
			
        });} else {				
				
                ReporteViaticoModuleService.getTableReporteViatico(newParams as QueryParams).then((result) => {
                            
                    opt.setLoading(false);
                    if (!result.success) return;
                    const newTableParams: UpdateParams<ReporteViaticoTableModel> = {				
                        ...params,
                        rows: result.rows || [],
                        count: result.count || 0
                    };
                    if (isMounted()) setTableParams(newTableParams);
                    
                });
            }
    };

    useEffect(() => {
        tableRef.current?.refresh();
    }, [tableRef]);

    const tableRefHandler = () => ({
        refresh: () => {
            const newTableParams = {				
                ...tableParams,
            };
            tableRef.current?.refresh(newTableParams);   
        },
        getQueryParams: () => {
            const newParams = {
                ...tableParams,
                filters: { ...tableParams.filters, tipo_reporte: tipoReporte },
            };
         
            return newParams;
		
        }
    });

    // Manejadores de cambios para las fechas
    const handleFechaInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFechaInicio(e.target.value);     
    };

    const handleFechaFinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFechaFin(e.target.value);     
    };
    //Manejadores de beneficiario
    const handleBeneficiarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBeneficiario(e.target.value);            
    };
    //Manejadores de beneficiario
    const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNombre(e.target.value);     
    };
    //Manejadores de beneficiario
    const handleApellidoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApellido(e.target.value);     
    };

    const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTipo(e.target.value);     
    };

    const handleEstadoPagoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEstadoPago(e.target.value);     
    };
    const handleTipoVencimientochange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTipo(e.target.value);     		
    };
    const handleTipoPostPagoCanceladoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTipo(e.target.value);     		
    };
    const handleReciboAnuladoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setReciboAnulado(e.target.value);     		
    };

     const handleEstadoModificacionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setModificacion(e.target.value);     
    };
    const handleMesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
             setMesSeleccionado(e.target.value);
    };
    //Manejadores de beneficiario
   /* const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectOpciones(e.target.value);     
    };*/
   
      function renderModificacionStatus(data: ViaticoTableModel): ReactElement {
               const color = 'white';
               const estado = data.estado_modificacion === SIN_OBSERVACION?SIN_OBSERVACION:OBSERVADO;
               const background = data.estado_modificacion != OBSERVADO? ESTADO_O[0] : ESTADO_O[1];
               return <StatusColumn status={estado} color={color} background={background} />;
           }
    
    // Mostrar datos filtrados
    const mostrarDatosFiltrados =  async () => {
        let inicio = fechaInicio;
        let fin = fechaFin;
        let tipoFecha = 0; // si es dia

        if (mesSeleccionado) {
            const añoActual = new Date().getFullYear();
            const mesIndex = parseInt(mesSeleccionado, 10);
            const primerDia = new Date(añoActual, mesIndex, 1);
            const ultimoDia = new Date(añoActual, mesIndex + 1, 0);

            // Convertir a formato YYYY-MM-DD
            inicio = primerDia.toISOString().split("T")[0];		
            fin = ultimoDia.toISOString().split("T")[0];
            tipoFecha = 1; // si es mes
        }
        
        if (!inicio || !fin) {
            return notify.error("Seleccione un rango de fechas o un mes.");//alert("Seleccione un rango de fechas o un mes.");
            //return;
        }        
         // Guarda el filtro actual
        setFiltroActivo({ fechaInicio: inicio, fechaFin: fin, tipoFecha: tipoFecha });  

        ReporteViaticoModuleService.getFechaFiltro(inicio, fin).then((result) => {		
			
            if (!result.success) return;			
            const newTableParams: UpdateParams<ReporteViaticoTableModel> = {            
                ...tableParams,    
                rows: result.rows || [],				
                count: result.count || 0,
                // rowsPerPage: 5,
                //page: 1
            };            
            if (isMounted()) 
               setTableParams(newTableParams);               			
        });      
    };

// Mostrar datos filtrados viaticos para rrhh
    const mostrarDatosFiltradosRRHH =  async () => {
        let inicio = fechaInicio;
        let fin = fechaFin;
        let tipoFecha = 0; // si es dia

        if (mesSeleccionado) {
            const añoActual = new Date().getFullYear();
            const mesIndex = parseInt(mesSeleccionado, 10);
            const primerDia = new Date(añoActual, mesIndex, 1);
            const ultimoDia = new Date(añoActual, mesIndex + 1, 0);

            // Convertir a formato YYYY-MM-DD
            inicio = primerDia.toISOString().split("T")[0];		
            fin = ultimoDia.toISOString().split("T")[0];
            tipoFecha = 1; // si es mes
        }
        
        if (!inicio || !fin) {
            return notify.error("Seleccione un rango de fechas o un mes.");//alert("Seleccione un rango de fechas o un mes.");
            //return;
        }        
         // Guarda el filtro actual
        setFiltroActivo({ fechaInicio: inicio, fechaFin: fin, tipoFecha: tipoFecha });  

        ReporteViaticoModuleService.getFechaFiltroRRHH(inicio, fin).then((result) => {		
			
            if (!result.success) return;			
            const newTableParams: UpdateParams<ReporteViaticoTableModel> = {            
                ...tableParams,    
                rows: result.rows || [],				
                count: result.count || 0,
                // rowsPerPage: 5,
                //page: 1
                
            };    
                // 👇 Guardas los datos base
             setDataBase(result.rows|| []);
        
            if (isMounted()) 
               setTableParams(newTableParams); 
                          			
        });        
       
    };

    const buscarNombreApellido =  async () => {      

         if(nombre.length > 0 || apellido.length >0){
           
            ReporteViaticoModuleService.getNombreApellido(nombre, apellido).then((result) => {		
          
                if (!result.success) return;			
                const newTableParams: UpdateParams<ReporteViaticoTableModel> = {            
                    ...tableParams,    
                    rows: result.rows || [],				
                    count: result.count || 0,
                    // rowsPerPage: 5,
                    //page: 1
                };            
                if (isMounted()) 
                   setTableParams(newTableParams);               			
            });     
         }         
  };
    
  const mostrarDatosBeneficiario =  async () => {
     
    ReporteViaticoModuleService.getDatosBeneficiario(fechaInicio, fechaFin, beneficiario).then((result) => {		
            
      if (!result.success) return;			
      const newTableParams: UpdateParams<ReporteViaticoTableModel> = {            
          ...tableParams,    
          rows: result.rows || [],				
          count: result.count || 0,
          // rowsPerPage: 5,
          //page: 1
      };            
      if (isMounted()) 
         setTableParams(newTableParams);                 
  });      
};

const buscarTipoUsuario =  async () => {      

    if(tipo.length > 0){
      
       ReporteViaticoModuleService.getTipoUsuario(fechaInicio, fechaFin , tipo).then((result) => {		
       
     
           if (!result.success) return;			
           const newTableParams: UpdateParams<ReporteViaticoTableModel> = {            
               ...tableParams,    
               rows: result.rows || [],				
               count: result.count || 0,
               // rowsPerPage: 5,
               //page: 1
           };            
           if (isMounted()) 
              setTableParams(newTableParams);               			
       });     
    }         
};

const buscarTipoVencimiento =  async () => {      

    if(tipo.length > 0){
      
       ReporteViaticoModuleService.getTipoVencimiento(fechaInicio, fechaFin ,tipo).then((result) => {		
       
     
           if (!result.success) return;			
           const newTableParams: UpdateParams<ReporteViaticoTableModel> = {            
               ...tableParams,    
               rows: result.rows || [],				
               count: result.count || 0,
               // rowsPerPage: 5,
               //page: 1
           };            
           if (isMounted()) 
              setTableParams(newTableParams);               			
       });     
    }         
};

const buscarTipoPostPagoCancelado =  async () => {      

    if(tipo.length > 0){
      
       ReporteViaticoModuleService.getTipoPostPagoCancelado(fechaInicio, fechaFin ,tipo).then((result) => {		
       
     
           if (!result.success) return;			
           const newTableParams: UpdateParams<ReporteViaticoTableModel> = {            
               ...tableParams,    
               rows: result.rows || [],				
               count: result.count || 0,
               // rowsPerPage: 5,
               //page: 1
           };            
           if (isMounted()) 
              setTableParams(newTableParams);               			
       });     
    }         
};
const buscarAnulados =  async () => {      

    if(reciboAnulado.length > 0){
      
       ReporteViaticoModuleService.getTipoAnulado(fechaInicio, fechaFin ,reciboAnulado).then((result) => {		
       
     
           if (!result.success) return;			
           const newTableParams: UpdateParams<ReporteViaticoTableModel> = {            
               ...tableParams,    
               rows: result.rows || [],				
               count: result.count || 0,
               // rowsPerPage: 5,
               //page: 1
           };            
           if (isMounted()) 
              setTableParams(newTableParams);               			
       });     
    }         
};

const buscarTipoUsuarioRRHH =  async () => {     
      
         if (tipo && tipo.length > 0) {       

                // 👇 filtrar sobre los datos ya obtenidos por fecha
                const datosFiltrados = dataBase.filter(item =>
                    tipo.includes(item.usuario_tipo!)
                );

                const newTableParams: UpdateParams<ReporteViaticoTableModel> = {            
                    ...tableParams,    
                    rows: datosFiltrados,				
                    count: datosFiltrados.length,
                };            

           if (isMounted()) 
               setTableParams(newTableParams);               			
       } 
       
       if(dataBase.length <= 0 ){             
              
       ReporteViaticoModuleService.getTipoUsuarioRRHH(tipo).then((result) => {		      
     
           if (!result.success) return;			
           const newTableParams: UpdateParams<ReporteViaticoTableModel> = {            
               ...tableParams,    
               rows: result.rows || [],				
               count: result.count || 0,
               // rowsPerPage: 5,
               //page: 1
           };            
           if (isMounted()) 
              setTableParams(newTableParams);               			
       });     
    
       }      
};
const buscarEstados =  async () => {      

    if(tipo.length > 0){
      
       ReporteViaticoModuleService.getTipoEstados(fechaInicio, fechaFin ,tipo).then((result) => {		
       
     
           if (!result.success) return;			
           const newTableParams: UpdateParams<ReporteViaticoTableModel> = {            
               ...tableParams,    
               rows: result.rows || [],				
               count: result.count || 0,
               // rowsPerPage: 5,
               //page: 1
           };            
           if (isMounted()) 
              setTableParams(newTableParams);               			
       });     
    }         
};

const buscarEstadosPago =  async () => {      

    if(estadoPago.length > 0){
      
       ReporteViaticoModuleService.getEstadoPago(fechaInicio, fechaFin ,estadoPago).then((result) => {		
       
     
           if (!result.success) return;			
           const newTableParams: UpdateParams<ReporteViaticoTableModel> = {            
               ...tableParams,    
               rows: result.rows || [],				
               count: result.count || 0,
               // rowsPerPage: 5,
               //page: 1
           };            
           if (isMounted()) 
              setTableParams(newTableParams);               			
       });     
    }         
};

const buscarEstadosPagoRRHH =  async () => {    
 
      if (estadoPago && estadoPago.length > 0) {           

                // 👇 filtrar sobre los datos ya obtenidos por fecha
                const datosFiltrados = dataBase.filter(item =>			
                    estadoPago.includes(item.estado_pago!)
                );	          
                const newTableParams: UpdateParams<ReporteViaticoTableModel> = {            
                    ...tableParams,    
                    rows: datosFiltrados,				
                    count: datosFiltrados.length,
                };            

           if (isMounted()) 
               setTableParams(newTableParams);               			
       } 
       
       if(dataBase.length <= 0 ){        
      
        ReporteViaticoModuleService.getEstadoPagoRRHH(estadoPago).then((result) => {		
        
        
            if (!result.success) return;			
            const newTableParams: UpdateParams<ReporteViaticoTableModel> = {            
                ...tableParams,    
                rows: result.rows || [],				
                count: result.count || 0,
                // rowsPerPage: 5,
                //page: 1
            };            
            if (isMounted()) 
                setTableParams(newTableParams);               			
        });     
    }         
};

const buscarObservadosRRHH =  async () => {    
      if (modificacion && modificacion.length > 0) {           
                 const datosFiltrados = dataBase.filter(item =>				
                    modificacion.includes(item.estado_modificacion!)
                );	 
                
                const newTableParams: UpdateParams<ReporteViaticoTableModel> = {            
                    ...tableParams,    
                    rows: datosFiltrados,				
                    count: datosFiltrados.length,
                };            

           if (isMounted()) 
               setTableParams(newTableParams);               			
       } 
       
       if(dataBase.length <= 0 ){        
      
        ReporteViaticoModuleService.getEstadoModificacionRRHH(modificacion).then((result) => {		
        
        
            if (!result.success) return;			
            const newTableParams: UpdateParams<ReporteViaticoTableModel> = {            
                ...tableParams,    
                rows: result.rows || [],				
                count: result.count || 0,
                // rowsPerPage: 5,
                //page: 1
            };            
            if (isMounted()) 
                setTableParams(newTableParams);               			
        });     
    }         
};


// Función para limpiar los filtros
const limpiarFiltros = () => {
    setFechaInicio('');  // Restablece el valor de la fecha de inicio
    setFechaFin('');     // Restablece el valor de la fecha de fin
    setBeneficiario(''); // Restablece el valor del CI del beneficiario
    setMesSeleccionado(""); // Restablecer el valor del mes
};

// Función para limpiar los filtros
const limpiarFiltros2 = () => {
    setNombre('');  
    setApellido('');    
};

// Función para limpiar los filtros
const limpiarFiltros3 = () => {
    setTipo('');     
    setEstadoPago("");
     
};
// Función para limpiar los filtros
const limpiarFiltros4 = () => {
    setTipo('');     
    setEstadoPago("");
    setModificacion("");
    setDataBase([]);     
};
const limpiarFiltros5 = () => {
    setTipo('');     
    setReciboAnulado(""); 
         
};   

   


    useEffect(() => {
        tableParams;
       
    }, [tableParams]);


    useImperativeHandle(ref, tableRefHandler, [tableParams, dataBase]);

    function renderColumnActive(data: ReporteViaticoTableModel): ReactElement {
        return (
            <ActiveColumn
                active={data.activo}
                onActiveChange={async (newValue: any) => {
                    return ReporteViaticoModuleService.setActiveReporteViatico(data.id, newValue).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Estado actualizado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }
//cambio de color estado
    function renderColumnStatusMemo(data: ViaticoTableModel): ReactElement {
        const estado = data.notificacion_memo!;
        const color = 'white';
        const background = ESTADO_APROBADO_JEFE[estado!];
        const texto = estado;
        return <StatusColumn status={texto} color={color} background={background} />;
    }
    //PARA RRHH
//cambio de color estado
 function renderColumnStatusRRHH(data: ViaticoTableModel): ReactElement {
     const color = 'white';
     const background = ESTADO_E[data.estado_pago];
     return <StatusColumn status={data.estado_pago} color={color} background={background} />;
 }


    function renderColumnSolicitante(tableModel: ViaticoTableModel): ReactElement {
            const imagen = tableModel.imagen;
            return  (
                <Box display="flex" flexDirection="row" alignContent="space-evenly" >
                    <Box
                        component="img"
                        alt={tableModel.usuario_id}
                        src={getAvatarURL(imagen)}
                        sx={{ width: 32, height: 32, borderRadius: 1.2, flexShrink: 0, mr: 1 }}
                    />
                    <Box display="flex" flexDirection="column">
                        <Typography variant="subtitle2">{tableModel.usuario_id}</Typography>
                       {/* <Typography color="tertiary" variant="caption" sx={{ fontSize: '10px'}}>{tableModel.usuario_cargo}</Typography>*/}
                    </Box>
                </Box>
            );
        }



    //FIN PARA RRHH

    

     function renderColumnStatusPago(data: ReporteViaticoTableModel): ReactElement {
         const color = 'white';
         const background = ESTADO_E[data.estado_pago!];
         return <StatusColumn status={data.estado_pago!} color={color} background={background} />;
     }

    function renderColumnStatus(data: ReporteViaticoTableModel): ReactElement {
        const estado = data.estado_descargo;
        const informe = data.presenta_informe;
        let valorColor;
       
     if(estado === 'DESCARGADO' && informe === 'PENDIENTE'){
        valorColor = 'DESCARGADO';
     }else if(estado === 'PENDIENTE' && informe === 'PRESENTA') {
        valorColor = 'CON_INFORME';
     }else if(estado === 'DESCARGADO' && informe === 'PRESENTA') {
        valorColor = 'DESCARGADO_CON_INFORME';
     }else {
        valorColor = 'PENDIENTE';
     }
     const color = 'black';
     const background = ESTADO_L[valorColor];
     const texto = valorColor;

        return <StatusColumn status={texto} color={color} background={background} maxWidth='250px'/>;
    }

    function renderColumnStatusDias(data: ReporteViaticoTableModel): ReactElement {
        const dias = data.tiempo_descargo;      
        let valorColor;
       switch(dias){
        case 0:
            valorColor = 'VENCIDO';
            break;
        case 1:
            valorColor = 'POR_VENCER';
            break;
        case 2:
            valorColor = 'POR_VENCER';
            break;
        case 3:
            valorColor = 'AUN_A_TIEMPO';
            break;
        case 4:
            valorColor = 'AUN_A_TIEMPO';
            break;
        case 5:
            valorColor = 'AUN_A_TIEMPO';
            break;
        case 6:
            valorColor = 'CON_TIEMPO';
            break;
        case 7:
            valorColor = 'CON_TIEMPO';
            break;
        case 8:
            valorColor = 'CON_TIEMPO';
            break;
        default:
            valorColor = 'PENDIENTE';
            break;
      
       }
        
     const color = 'black';
     const background = ESTADO_K[valorColor];
     const texto = valorColor;
        if(data.estado_descargo==='DESCARGADO') return <> - </>
        return (<StatusColumn status={texto} color={color} background={background} maxWidth='150px'/>);
    }

    function renderColumnPadre(data: ReporteViaticoTableModel): ReactElement {
        // se cambia data.padre por activo pero se debe verificar la funcionalidad
        const padre = data.activo?'SI':'NO';
        return <StatusColumn status={padre} background={BACKGROUND_1}/>;
    }

let headers;

if (props.tipoReporte === "REPORTE_PARA_RRHH") {
  headers = tableHeadersRRHH;
} else {
  headers = tableHeaders;
}

    
//construir estos metodos de descargo e informes en el backend
     const [open2, setOpen2] = useState<boolean>(false);
     const optionsVale = ENUM_ESTADOS_I.map((m) => m.value);
     function renderColumnChangeDescarga(data: ReporteViaticoTableModel): ReactElement {
        if(data.estado_descargo==='DESCARGADO') return (<CheckCircleOutline  sx={{ color: 'green' }}/>);
         return (
             <>
                 <ConfirmDialog
                     title={'Confirmar'}
                     message={
                        <span>
                            Realizara la DESCARGA del Viatico, ¿esta usted seguro? 
                            <br />
                            Nombre Beneficiario:  {data.usuario_nombre}
                            <br />
                            Nº Memo: {data.cod_memo}
                            <br />
                            Nº Recibo:  {data.num_recibo}
                        </span>                      
                     }
                     open={open2}
                     onAccept={async () => {
                         return ReporteViaticoModuleService.setAprobadoReporteViatico(data.id, 'DESCARGADO').then((result) => {
                             if (!result.success) return notify.error(result.msg);
                             notify.success('El DESCARGO se realizo correctamente!'+
                                '\n'+'Nombre Beneficiario: '+data.usuario_nombre+
                            '\n'+'Nº Memo: '+data.cod_memo+
                        '\n'+'Nº Recibo: '+data.num_recibo);
                             setOpen2(false);
                             tableRef.current?.refresh();
                         });
                     }}
                     onCancel={() => { isMounted() && setOpen2(false); tableRef.current?.refresh(); }}
                 />
                 <ChangeStateColumn
                     data={data.estado_descargo}
                     options={optionsVale}
                     onChange={async (newValue: any) => {
                         if(newValue==='DESCARGADO') setOpen2(true);
                         else
                             return ReporteViaticoModuleService.setAprobadoReporteViatico(data.id, newValue).then((result) => {
                                 if (!result.success) return notify.error(result.msg);
                                 notify.success('Se actualizo exitosamente');
                                 tableRef.current?.refresh();
                             });
                     }}
                 />
             </>
         );
     }

    
    return (
        <>

        <Box>
             {/* Filtros de fecha */}

              {/* Estilos internos en la etiqueta <style> */}
            <style>{`
                .filters-container {
                    display: flex;
                    justify-content: flex-start;
                    gap: 10px;
                    margin-bottom: 10px;
                }           
                
                .filter-input {
                    padding: 6px;
                    border: 2px solid #ccc;
                    border-radius: 4px;
                    font-size: 14px;
                    width: 150px;
                }
                .filter-button {
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                }
                    
                 .filter-button-red {
                    padding: 10px 20px;
                    background-color:rgb(226, 57, 6);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                }

                .filter-button:hover {
                    background-color: #45a049;
                }

               
            `}</style>
             {/* Filtros de fecha */}
           { (props.tipoReporte === "GENERAL" || props.tipoReporte === "REPORTE_POR_PLANILLA"|| props.tipoReporte === "REPORTE_POR_PROYECTO" || props.tipoReporte === "REPORTE_FF_OF" || props.tipoReporte === "REPORTE_POR_TIPO" )  && (
            <div className="filters-container">
                <div className="filter-item">
                    <label htmlFor="fechaInicio">Fecha Inicio : </label>
                    <input
                        type="date"
                        id="fechaInicio"
                        value={fechaInicio}
                        onChange={handleFechaInicioChange}
                        className="filter-input"
                        disabled={mesSeleccionado !== ""} // desactiva si eliges mes
                    />
                </div>
                <div className="filter-item">
                    <label htmlFor="fechaFin">Fecha Fin : </label>
                    <input
                        type="date"
                        id="fechaFin"
                        value={fechaFin}
                        onChange={handleFechaFinChange}
                        className="filter-input"
                        disabled={mesSeleccionado !== ""} // desactiva si eliges mes
                    />
                </div>

                 <div className="filter-item">
                    <label htmlFor="mes">o    Mes: </label>
                    <select
                    id="mes"
                    value={mesSeleccionado}
                    onChange={handleMesChange}
                    className="filter-input"
                     disabled={fechaFin !== "" || fechaInicio  !== ""} // desactiva si elige dia
                    >
                    <option value="">Seleccione un mes</option>
                    <option value="0">Enero</option>
                    <option value="1">Febrero</option>
                    <option value="2">Marzo</option>
                    <option value="3">Abril</option>
                    <option value="4">Mayo</option>
                    <option value="5">Junio</option>
                    <option value="6">Julio</option>
                    <option value="7">Agosto</option>
                    <option value="8">Septiembre</option>
                    <option value="9">Octubre</option>
                    <option value="10">Noviembre</option>
                    <option value="11">Diciembre</option>
                    </select>
                </div>
               {props.tipoReporte !== "REPORTE_POR_TIPO" && (
                    <div className="filter-item">
                        <button
                            onClick={() => mostrarDatosFiltrados()}
                            className="filter-button"
                        >
                            Filtrar
                        </button>
                    </div>
                )}

                {props.tipoReporte !== "REPORTE_POR_TIPO" && (
                    <div className="filter-item">
                        <button
                            onClick={() => limpiarFiltros()}
                            className="filter-button-red"
                        >
                            Limpiar Filtros
                        </button>
                    </div>
                )}

            </div>
            )}
            { props.tipoReporte === "REPORTE_POR_BENEFICIARIO"  && (
                 
                <div className="filters-container">

                    <div className="filter-item">
                       <label htmlFor="fechaInicio">Fecha Inicio : </label>
                       <input
                            type="date"
                            id="fechaInicio"
                            value={fechaInicio}
                            onChange={handleFechaInicioChange}
                            className="filter-input"
                       />
                    </div>
                   <div className="filter-item">
                        <label htmlFor="fechaFin">Fecha Fin : </label>
                        <input
                            type="date"
                            id="fechaFin"
                            value={fechaFin}
                            onChange={handleFechaFinChange}
                            className="filter-input"
                        />
                    </div>

                    <div className="filter-item">
                        <label htmlFor="beneficiario">Beneficiario CI : </label>
                        <input
                            type="text"
                            id="beneficiario"
                            value={beneficiario}
                            onChange={handleBeneficiarioChange}
                            className="filter-input"                            
                        />
                    </div>             
                    
                    <div className="filter-item">                  
                        <button onClick={() => mostrarDatosBeneficiario()} className="filter-button">
                            Filtrar
                        </button>
                    </div>

                     {/* Botón para limpiar los filtros */}
                    <div className="filter-item">
                        <button
                            onClick={() => limpiarFiltros()}
                            className="filter-button-red"
                        >
                            Limpiar Filtros
                        </button>
                    </div>
                </div>             
                
            )}

           { props.tipoReporte === "REPORTE_POR_BENEFICIARIO" && (

           <div className="filters-container">

                    <div className="filter-item">
                        <label htmlFor="nombre">Nombre : </label>
                        <input
                            type="text"
                            id="nombre"
                            value={nombre}
                            onChange={handleNombreChange}
                            className="filter-input"                            
                     />
                    </div>
                    <div className="filter-item">
                        <label htmlFor="apellido">Apellido : </label>
                        <input
                            type="text"
                            id="apellido"
                            value={apellido}
                            onChange={handleApellidoChange}
                            className="filter-input"                            
                     />
                    </div>
                      <div className="filter-item">                  
                        <button onClick={() => buscarNombreApellido()} className="filter-button">
                            Filtrar
                        </button>
                      </div> 
                      {/* Botón para limpiar los filtros */}
                    <div className="filter-item">
                        <button
                            onClick={() => limpiarFiltros2()}
                            className="filter-button-red"
                        >
                            Limpiar Filtros
                        </button>
                    </div>

            </div>
           )}

           { props.tipoReporte === "REPORTE_POR_TIPO" && (

           <div className="filters-container">

                    <div className="filter-item">
                        <label htmlFor="tipo">tipo de Funcionario : </label>
                        <select
                            id="tipo"
                            value={tipo}
                            onChange={handleTipoChange}
                            className="filter-input"
                            
                            >
                            <option value="">Seleccione......</option>
                            {ENUM_TIPOS_USUARIO.map((tipoItem, index) => (
                                <option key={index} value={tipoItem.value}>
                                    {tipoItem.label}
                                </option>
                            ))}                    
                        </select>
                    </div>
                   
                   <div className="filter-item">                  
                        <button onClick={() => buscarTipoUsuario()} className="filter-button">
                            Filtrar
                        </button>
                   </div>   
                      

                      <div className="filter-item">
                        <label htmlFor="tipo">o    por tipo de Estado : </label>
                        <select
                            id="tipo"
                            value={tipo}
                            onChange={handleTipoChange}
                            className="filter-input"
                            >
                            <option value="">Seleccione......</option>
                            {ENUM_ESTADOS_IJ.map((tipoItem, index) => (
                                <option key={index} value={tipoItem.value}>
                                    {tipoItem.label}
                                </option>
                            ))}                    
                        </select>
                    </div>
                   
                     <div className="filter-item">                  
                        <button onClick={() => buscarEstados()} className="filter-button">
                            Filtrar
                        </button>
                      </div>   

                        <div className="filter-item">
                        <label htmlFor="estadoPago">o  Estado Pago Viatico : </label>
                        <select
                            id="estadoPago"
                            value={estadoPago}
                            onChange={handleEstadoPagoChange}
                            className="filter-input"
                            >
                            <option value="">Seleccione......</option>
                            {ENUM_ESTADOS_PAGO.map((tipoItem, index) => (
                                <option key={index} value={tipoItem.value}>
                                    {tipoItem.label}
                                </option>
                            ))}                    
                        </select>
                    </div>
                   
                     <div className="filter-item">                  
                        <button onClick={() => buscarEstadosPago()} className="filter-button">
                            Filtrar
                        </button>
                      </div>    

                        {/* Botón para limpiar los filtros */}
                    <div className="filter-item">
                        <button
                            onClick={() => limpiarFiltros3()}
                            className="filter-button-red"
                        >
                            Limpiar Filtros
                        </button>
                    </div>
                      
            </div>
           )}
            { props.tipoReporte === "REPORTE_POR_TIPO" && (

           <div className="filters-container">

                    <div className="filter-item">
                        <label htmlFor="tipo">Tiempo de Vencimiento(dias) : </label>
                        <select
                            id="tipo"
                            value={tipo}
                            onChange={handleTipoVencimientochange}
                            className="filter-input"
                            
                            >
                            <option value="">Seleccione......</option>
                            {ENUM_TIPOS_VENCIMIENTO.map((tipoItem, index) => (
                                <option key={index} value={tipoItem.value}>
                                    {tipoItem.label}
                                </option>
                            ))}                    
                        </select>
                    </div>
                   
                   <div className="filter-item">                  
                        <button onClick={() => buscarTipoVencimiento()} className="filter-button">
                            Filtrar
                        </button>
                   </div>   
                      

                     <div className="filter-item">
                        <label htmlFor="tipo">Viaje Cancelado Post Pago: </label>
                        <select
                            id="tipo"
                            value={tipo}
                            onChange={handleTipoPostPagoCanceladoChange}
                            className="filter-input"
                            >
                            <option value="">Seleccione......</option>
                            {ENUM_ESTADOS_CANCELADOS.map((tipoItem, index) => (
                                <option key={index} value={tipoItem.value}>
                                    {tipoItem.label}
                                </option>
                            ))}                    
                        </select>
                    </div>
                   
                     <div className="filter-item">                  
                        <button onClick={() => buscarTipoPostPagoCancelado()} className="filter-button">
                            Filtrar
                        </button>
                      </div>   

                    <div className="filter-item">
                        <label htmlFor="reciboAnulado">Recibos Anulados: </label>
                        <select
                            id="reciboAnulado"
                            value={reciboAnulado}
                            onChange={handleReciboAnuladoChange}
                            className="filter-input"
                            >
                            <option value="">Seleccione......</option>
                            {ENUM_ESTADOS_PAGO.map((tipoItem, index) => (
                                <option key={index} value={tipoItem.value}>
                                    {tipoItem.label}
                                </option>
                            ))}                    
                        </select>
                    </div>
                   
                     <div className="filter-item">                  
                        <button onClick={() => buscarAnulados()} className="filter-button">
                            Filtrar
                        </button>
                      </div>    

                        {/* Botón para limpiar los filtros */}
                    <div className="filter-item">
                        <button
                            onClick={() => limpiarFiltros5()}
                            className="filter-button-red"
                        >
                            Limpiar Filtros
                        </button>
                    </div>
                      
            </div>
           )}
           
              { (props.tipoReporte === "REPORTE_PARA_RRHH" )  && (
            <div className="filters-container">
                <div className="filter-item">
                    <label htmlFor="fechaInicio">Fecha Inicio : </label>
                    <input
                        type="date"
                        id="fechaInicio"
                        value={fechaInicio}
                        onChange={handleFechaInicioChange}
                        className="filter-input"
                        disabled={mesSeleccionado !== ""} // desactiva si eliges mes
                    />
                </div>
                <div className="filter-item">
                    <label htmlFor="fechaFin">Fecha Fin : </label>
                    <input
                        type="date"
                        id="fechaFin"
                        value={fechaFin}
                        onChange={handleFechaFinChange}
                        className="filter-input"
                        disabled={mesSeleccionado !== ""} // desactiva si eliges mes
                    />
                </div>

                 <div className="filter-item">
                    <label htmlFor="mes">o    Mes: </label>
                    <select
                    id="mes"
                    value={mesSeleccionado}
                    onChange={handleMesChange}
                    className="filter-input"
                     disabled={fechaFin !== "" || fechaInicio  !== ""} // desactiva si elige dia
                    >
                    <option value="">Seleccione un mes</option>
                    <option value="0">Enero</option>
                    <option value="1">Febrero</option>
                    <option value="2">Marzo</option>
                    <option value="3">Abril</option>
                    <option value="4">Mayo</option>
                    <option value="5">Junio</option>
                    <option value="6">Julio</option>
                    <option value="7">Agosto</option>
                    <option value="8">Septiembre</option>
                    <option value="9">Octubre</option>
                    <option value="10">Noviembre</option>
                    <option value="11">Diciembre</option>
                    </select>
                </div>
                <div className="filter-item">                  
                    <button onClick={() => mostrarDatosFiltradosRRHH()} className="filter-button">
                         Filtrar
                     </button>
                </div>
            

             {/* Botón para limpiar los filtros */}
                    <div className="filter-item">
                        <button
                            onClick={() => limpiarFiltros()}
                            className="filter-button-red"
                        >
                            Limpiar Filtros
                        </button>
                    </div>

            </div>
            )}

            { props.tipoReporte === "REPORTE_PARA_RRHH" && (
             <div className="filters-container">

                    <div className="filter-item">
                        <label htmlFor="tipo">tipo de Funcionario : </label>
                        <select
                            id="tipo"
                            value={tipo}
                            onChange={handleTipoChange}
                            className="filter-input"
                            
                            >
                            <option value="">Seleccione......</option>
                            {ENUM_TIPOS_USUARIO.map((tipoItem, index) => (
                                <option key={index} value={tipoItem.value}>
                                    {tipoItem.label}
                                </option>
                            ))}                    
                        </select>
                    </div>
                   
                   <div className="filter-item">                  
                        <button onClick={() => buscarTipoUsuarioRRHH()} className="filter-button">
                            Filtrar
                        </button>
                   </div>                       

                 <div className="filter-item">
                        <label htmlFor="estadoPago">o  Estado Pago Viatico : </label>
                        <select
                            id="estadoPago"
                            value={estadoPago}
                            onChange={handleEstadoPagoChange}
                            className="filter-input"
                            >
                            <option value="">Seleccione......</option>
                            {ENUM_ESTADOS_PAGO.map((tipoItem, index) => (
                                <option key={index} value={tipoItem.value}>
                                    {tipoItem.label}
                                </option>
                            ))}                    
                        </select>
                    </div>
                   
                     <div className="filter-item">                  
                        <button onClick={() => buscarEstadosPagoRRHH()} className="filter-button">
                            Filtrar
                        </button>
                      </div>    

                      <div className="filter-item">
                        <label htmlFor="tipo">o    por Observacion: </label>
                        <select
                            id="tipo"
                            value={modificacion}
                            onChange={handleEstadoModificacionChange}
                            className="filter-input"
                            >
                            <option value="">Seleccione......</option>
                            {ENUM_ESTADOS_OBSERVADO.map((tipoItem, index) => (
                                <option key={index} value={tipoItem.value}>
                                    {tipoItem.label}
                                </option>
                            ))}                    
                        </select>
                    </div>
                   
                     <div className="filter-item">                  
                        <button onClick={() => buscarObservadosRRHH()} className="filter-button">
                            Filtrar
                        </button>
                      </div>   


                        {/* Botón para limpiar los filtros */}
                    <div className="filter-item">
                        <button
                            onClick={() => limpiarFiltros4()}
                            className="filter-button-red"
                        >
                            Limpiar Filtros
                        </button>
                    </div>
                      
            </div>
           )}
        </Box>
            <DataTable
                ref={tableRef}
                headers={headers}
                updateParams={tableParams}
                onUpdate={handleUpdateTable}
                onDownloadClick={() => onDownloadClick?.(filtroActivo?.fechaInicio!, filtroActivo?.fechaFin!, filtroActivo?.tipoFecha!)}//  onDownloadClick={onDownloadClick}
                onDownloadExcel={()=> onDownloadExcel?.(filtroActivo?.fechaInicio!, filtroActivo?.fechaFin!)}
                isLoading={loading}
                //onActionAddClick={onAddClick}               
                vScroll
                
            />

            
        </>
    );
};

export const ReporteViaticoTable = forwardRef(ReporteViaticoTableComponent);
