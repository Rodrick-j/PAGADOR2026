import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, StatusColumn, ActionColumn, ChangeStateColumn, OnUpdateOptions, DataTableRefProps, ActiveColumn } from 'components/core/DataTable';
//@mui
import { Box,Typography,IconButton, Tooltip,CircularProgress } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { MemorandumrrhhReporteModuleService } from 'modules/rrhh/memorandum_rrhh_reporte/MemorandumrrhhReporteModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { BACKGROUND_1, ESTADO_A, ESTADO_APROBADO_JEFE, ESTADO_J, ESTADO_K, ESTADO_L } from 'constants/colors';
import { ENUM_ESTADOS_I, ENUM_ESTADOS_IJ, ENUM_ESTADOS_IK, ENUM_ESTADOS_J, ENUM_TIPO_COMISION, ENUM_TIPO_MEMORANDUM_RRHH, ENUM_TIPOS_USUARIO } from 'constants/enums';
import { ConfirmDialog } from 'components/core/ConfirmDialog';
import { CheckCircleOutline } from '@mui/icons-material';
import { SelectOption } from 'components/core/FormDialog';
import { getAvatarURL } from 'utils';

export type MemorandumrrhhReporteTableModel = {
   id: string;
   cod_depart_memo        : string;
   tipo_memorandum        :string;
   //campos que se aumentan
   usuario_nombre         :string;
   usuario_cargo          : string;
   ci                     : string;
   nume_celular           : string;
   usuario_area?          : string;    
   // campos de imagen
   imagen                : string;
   imagen2               : string;
   //Campos para imprimir
   imprimir             : string;
   //campos Memorandum
   autorizado_por         : any[];
   cargo_jefe_unidad      : string;
   fecha_memo_registro    : Date;
   fecha_memo_format      : string;
   vehiculo_id            : string; //tipo de vehiculo marca  TV
   num_placa              : string; //placa del vehiculo  TV
   tipo_comision_idp      : string;
   fecha_inicio_viaje     : Date;
   fecha_fin_viaje        : Date;
   cantidad_dias          : number;
   tipo_memo_repo         : boolean;
   tipo_transporte        : string;
   observacion            : string;
   estado_memorandum      : string;
   notificacion_memo      : string;
    //Modificacion
   modificacion           : boolean;
   obs_modificacion      : string ;
   fecha_cambio          : string;
   estado_modificacion   : string;
   //detalle Destino dias
   conteo_dias_detalle    : number;
   contrato?              : string;
   lista_select_jefes?    : SelectOption[];
   // para las columnas especiales
   actions: unknown;
   options?: unknown;
   //campos adicionales necesarios
  // usuario_nombre           : string;
  // usuario_cargo            : string;
   usuario_ci               : string;
   usuario_tipo?            : string;
   liquido_pagable?          : number;
   fecha_ida?                : string;
   fecha_retorno?            : string;
   destino?                  : string;
   cod_memo?                 : string; 
   //cantidad_dias?            : number;  
   //imprimir?                 : string;
   //tipo_memo_repo?           : string;
   fecha_descargo_format? : string;
   partida_presupuestaria?   : string;
   ff_of?                    : string;
   area?                     : string;
   sigla? : string;
   radio? : any;  


};



export type MemorandumrrhhReporteTableRefProps = {
    refresh: (updateParams?: UpdateParams<MemorandumrrhhReporteTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<MemorandumrrhhReporteTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const textFilter: HeaderFilter = { type: 'text' };
//const fechaFilter: HeaderFilter = { type: 'date' };
const tipoMemorandumFilter: HeaderFilter = { type: 'select', options: ENUM_TIPO_MEMORANDUM_RRHH};
const tipoComisionFilter: HeaderFilter = { type: 'select', options: ENUM_TIPO_COMISION };


// Rango de fechas
const fechaFilter: HeaderFilter = { type: 'date' };

type Props = {
    onAddClick: () => void;
    onViewClick: (idMemorandumrrhhReporte: string) => Promise<void>;
    onEditClick: (idMemorandumrrhhReporte: string) => Promise<void>;
    onDownloadClick?: (fechaInicio : string, fechaFin: string,tipoFecha: number ) => void;
    onDownloadExcel?: (fechaInicio : string, fechaFin: string ) => void;
    tipoReporte: string;    
    loading : boolean;
    onDetalleMemorandumClick: (idMemorandum: string) => void;
    onImprimirClick: (data: MemorandumrrhhReporteTableModel) => void;  //cambiar areporte
    loading2: string;
};


export const MemorandumrrhhReporteTableComponent = (props: Props, ref: React.Ref<MemorandumrrhhReporteTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick, onDownloadClick,onDownloadExcel,onDetalleMemorandumClick,onImprimirClick ,tipoReporte, loading,loading2} = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<MemorandumrrhhReporteTableModel>>(tableParamsInitialize);
  
     // Estado para el rango de fechas
     const [fechaInicio, setFechaInicio] = useState<string>('');
     const [fechaFin, setFechaFin] = useState<string>('');
     const [beneficiario, setBeneficiario] = useState<string>('');

     const [nombre, setNombre] = useState<string>('');
     const [apellido, setApellido] = useState<string>('');
     const [tipo, setTipo] = useState<string>('');
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
    let tableHeaders: TableHeader<MemorandumrrhhReporteTableModel>[] =[];
    if (props.tipoReporte === "GENERAL"){

         tableHeaders = [
                  
                { id: 'actions', label: 'Acciones', sort: false, width:150, render:renderColumnActions},
                { id: 'cod_depart_memo', label: 'Numero de CITE', align: 'center',  width:250  , filter: textFilter },
                { id: 'tipo_memorandum', label: 'Tipo de Memorandum', align: 'center',  width:320 , filter: tipoMemorandumFilter  },
                { id: 'fecha_memo_format', label: 'Fecha Memorandum', align: 'center' },
                { id: 'usuario_nombre', label: 'Nombre Usuario Solicita Memorandum', align: 'center', width:250, render: renderColumnSolicitante, filter: textFilter },
                { id: 'ci', label: 'CI', align: 'center', filter: textFilter,width:80 },
                { id: 'contrato', label: 'Item/contrato', align: 'center', width:150, filter: textFilter },
                { id: 'nume_celular', label: 'Numero de Celular', align: 'center'},
                    //aumentando campos de apertua
                { id: 'autorizado_por', label: 'Autorizado por Jefe de Unidad', align: 'center',width:300, render: renderColumnResponsable},
                { id: 'tipo_comision_idp', label: 'Tipo de Comision', align: 'center', filter: tipoComisionFilter },
                { id: 'fecha_inicio_viaje', label: 'Fecha Inicio Viaje', align: 'center',width:150, filter: fechaFilter },
                { id: 'fecha_fin_viaje', label: 'Fecha Fin Viaje', align: 'center',width:150 },
                { id: 'cantidad_dias', label: 'Cantidad dias', align: 'center'},
                { id: 'usuario_area', label: 'Area de solicitud de Memorandum', align: 'center',filter: textFilter},
                { id: 'tipo_memo_repo', label: 'Tipo de Memorandum', align: 'center'  },
                { id: 'tipo_transporte', label: 'Tipo de Transporte', align: 'center' },
                { id: 'observacion', label: 'Observacion', align: 'center',width:320 },
             //   { id: 'estado_memorandum', label: 'Aprobar Memorandum', align: 'center', render:renderColumnChange},
                { id: 'notificacion_memo', label: 'Estado', align: 'center', render:renderColumnStatus },
            //    { id: 'options', label: 'Detalles del Destino', sort: false,width:200, render:renderColumnOptions, align: 'center' },
            //    { id: 'imprimir', label: 'Descargar Memorandum', sort: false,width:150, render: renderImpresionOptions, align: 'center' },

             
             
           ];
    }
    
    if (props.tipoReporte === "REPORTE_POR_PROYECTO"){
        tableHeaders = [

              { id: 'actions', label: 'Acciones', sort: false, width:150, render:renderColumnActions},
                { id: 'cod_depart_memo', label: 'Numero de CITE', align: 'center',  width:250  , filter: textFilter },
                { id: 'tipo_memorandum', label: 'Tipo de Memorandum', align: 'center',  width:320 , filter: tipoMemorandumFilter  },
                { id: 'fecha_memo_format', label: 'Fecha Memorandum', align: 'center' },
                { id: 'usuario_nombre', label: 'Nombre Usuario Solicita Memorandum', align: 'center', width:250, render: renderColumnSolicitante, filter: textFilter },
                { id: 'ci', label: 'CI', align: 'center', filter: textFilter,width:80 },
                { id: 'contrato', label: 'Item/contrato', align: 'center', width:150, filter: textFilter },
                { id: 'nume_celular', label: 'Numero de Celular', align: 'center'},
                    //aumentando campos de apertua
                { id: 'autorizado_por', label: 'Autorizado por Jefe de Unidad', align: 'center',width:300, render: renderColumnResponsable},
                { id: 'tipo_comision_idp', label: 'Tipo de Comision', align: 'center', filter: tipoComisionFilter },
                { id: 'fecha_inicio_viaje', label: 'Fecha Inicio Viaje', align: 'center',width:150, filter: fechaFilter },
                { id: 'fecha_fin_viaje', label: 'Fecha Fin Viaje', align: 'center',width:150 },
                { id: 'cantidad_dias', label: 'Cantidad dias', align: 'center'},
                { id: 'usuario_area', label: 'Area de solicitud de Memorandum', align: 'center',filter: textFilter},
                { id: 'tipo_memo_repo', label: 'Tipo de Memorandum', align: 'center'  },
                { id: 'tipo_transporte', label: 'Tipo de Transporte', align: 'center' },
                { id: 'observacion', label: 'Observacion', align: 'center',width:320 },
             //   { id: 'estado_memorandum', label: 'Aprobar Memorandum', align: 'center', render:renderColumnChange},
                { id: 'notificacion_memo', label: 'Estado', align: 'center', render:renderColumnStatus },
              //  { id: 'options', label: 'Detalles del Destino', sort: false,width:200, render:renderColumnOptions, align: 'center' },
             //   { id: 'imprimir', label: 'Descargar Memorandum', sort: false,width:150, render: renderImpresionOptions, align: 'center' },

              
            
           ];
      
    } if ( props.tipoReporte === "REPORTE_POR_BENEFICIARIO"){
        tableHeaders = [
           
              { id: 'actions', label: 'Acciones', sort: false, width:150, render:renderColumnActions},
                { id: 'cod_depart_memo', label: 'Numero de CITE', align: 'center',  width:250  , filter: textFilter },
                { id: 'tipo_memorandum', label: 'Tipo de Memorandum', align: 'center',  width:320 , filter: tipoMemorandumFilter  },
                { id: 'fecha_memo_format', label: 'Fecha Memorandum', align: 'center' },
                { id: 'usuario_nombre', label: 'Nombre Usuario Solicita Memorandum', align: 'center', width:250, render: renderColumnSolicitante, filter: textFilter },
                { id: 'ci', label: 'CI', align: 'center', filter: textFilter,width:80 },
                { id: 'contrato', label: 'Item/contrato', align: 'center', width:150, filter: textFilter },
                { id: 'nume_celular', label: 'Numero de Celular', align: 'center'},
                    //aumentando campos de apertua
                { id: 'autorizado_por', label: 'Autorizado por Jefe de Unidad', align: 'center',width:300, render: renderColumnResponsable},
                { id: 'tipo_comision_idp', label: 'Tipo de Comision', align: 'center', filter: tipoComisionFilter },
                { id: 'fecha_inicio_viaje', label: 'Fecha Inicio Viaje', align: 'center',width:150, filter: fechaFilter },
                { id: 'fecha_fin_viaje', label: 'Fecha Fin Viaje', align: 'center',width:150 },
                { id: 'cantidad_dias', label: 'Cantidad dias', align: 'center'},
                { id: 'usuario_area', label: 'Area de solicitud de Memorandum', align: 'center',filter: textFilter},
                { id: 'tipo_memo_repo', label: 'Tipo de Memorandum', align: 'center'  },
                { id: 'tipo_transporte', label: 'Tipo de Transporte', align: 'center' },
                { id: 'observacion', label: 'Observacion', align: 'center',width:320 },
             //   { id: 'estado_memorandum', label: 'Aprobar Memorandum', align: 'center', render:renderColumnChange},
                { id: 'notificacion_memo', label: 'Estado', align: 'center', render:renderColumnStatus },
             //{ id: 'options', label: 'Detalles del Destino', sort: false,width:200, render:renderColumnOptions, align: 'center' },
            //    { id: 'imprimir', label: 'Descargar Memorandum', sort: false,width:150, render: renderImpresionOptions, align: 'center' },

             
           ];
    }  if (props.tipoReporte === "REPORTE_POR_TIPO"){
        tableHeaders = [
                       
           { id: 'actions', label: 'Acciones', sort: false, width:150, render:renderColumnActions},
                { id: 'cod_depart_memo', label: 'Numero de CITE', align: 'center',  width:250  , filter: textFilter },
                { id: 'tipo_memorandum', label: 'Tipo de Memorandum', align: 'center',  width:320 , filter: tipoMemorandumFilter  },
                { id: 'fecha_memo_format', label: 'Fecha Memorandum', align: 'center' },
                { id: 'usuario_nombre', label: 'Nombre Usuario Solicita Memorandum', align: 'center', width:250, render: renderColumnSolicitante, filter: textFilter },
                { id: 'ci', label: 'CI', align: 'center', filter: textFilter,width:80 },
                { id: 'contrato', label: 'Item/contrato', align: 'center', width:150, filter: textFilter },
                { id: 'nume_celular', label: 'Numero de Celular', align: 'center'},
                    //aumentando campos de apertua
                { id: 'autorizado_por', label: 'Autorizado por Jefe de Unidad', align: 'center',width:300, render: renderColumnResponsable},
                { id: 'tipo_comision_idp', label: 'Tipo de Comision', align: 'center', filter: tipoComisionFilter },
                { id: 'fecha_inicio_viaje', label: 'Fecha Inicio Viaje', align: 'center',width:150, filter: fechaFilter },
                { id: 'fecha_fin_viaje', label: 'Fecha Fin Viaje', align: 'center',width:150 },
                { id: 'cantidad_dias', label: 'Cantidad dias', align: 'center'},
                { id: 'usuario_area', label: 'Area de solicitud de Memorandum', align: 'center',filter: textFilter},
                { id: 'tipo_memo_repo', label: 'Tipo de Memorandum', align: 'center'  },
                { id: 'tipo_transporte', label: 'Tipo de Transporte', align: 'center' },
                { id: 'observacion', label: 'Observacion', align: 'center',width:320 },
             //   { id: 'estado_memorandum', label: 'Aprobar Memorandum', align: 'center', render:renderColumnChange},
                { id: 'notificacion_memo', label: 'Estado', align: 'center', render:renderColumnStatus },
             //   { id: 'options', label: 'Detalles del Destino', sort: false,width:200, render:renderColumnOptions, align: 'center' },
              //  { id: 'imprimir', label: 'Descargar Memorandum', sort: false,width:150, render: renderImpresionOptions, align: 'center' },

               
             
           ];
    } 
    

    const handleUpdateTable = (params: UpdateParams<MemorandumrrhhReporteTableModel>, opt: OnUpdateOptions) => {
      
        opt.setLoading(true);       
        if (!isMounted()) return;

        const newParams = {
            ...params,
            filters: { ...params.filters },
        };
        MemorandumrrhhReporteModuleService.getTableMemorandumrrhhReporte(newParams as QueryParams).then((result) => {
			          
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<MemorandumrrhhReporteTableModel> = {				
                ...params,
                rows: result.rows || [],
                count: result.count || 0
            };
            if (isMounted()) setTableParams(newTableParams);
			
        });
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

    const handleMesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
             setMesSeleccionado(e.target.value);
        };
        
    //Manejadores de beneficiario
   /* const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectOpciones(e.target.value);     
    };*/


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

         MemorandumrrhhReporteModuleService.getFechaFiltro(inicio, fin).then((result) => {		
			
            if (!result.success) return;			
            const newTableParams: UpdateParams<MemorandumrrhhReporteTableModel> = {            
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

    const buscarNombreApellido =  async () => {      

         if(nombre.length > 0 || apellido.length >0){
           
            MemorandumrrhhReporteModuleService.getNombreApellido(nombre, apellido).then((result) => {		
          
                if (!result.success) return;			
                const newTableParams: UpdateParams<MemorandumrrhhReporteTableModel> = {            
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
     
    MemorandumrrhhReporteModuleService.getDatosBeneficiario(fechaInicio, fechaFin, beneficiario).then((result) => {		
            
      if (!result.success) return;			
      const newTableParams: UpdateParams<MemorandumrrhhReporteTableModel> = {            
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
      
       MemorandumrrhhReporteModuleService.getTipoUsuario(tipo).then((result) => {		
       
     
           if (!result.success) return;			
           const newTableParams: UpdateParams<MemorandumrrhhReporteTableModel> = {            
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
      
       MemorandumrrhhReporteModuleService.getTipoEstados(tipo).then((result) => {		
       
     
           if (!result.success) return;			
           const newTableParams: UpdateParams<MemorandumrrhhReporteTableModel> = {            
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
};

// Función para limpiar los filtros
const limpiarFiltros2 = () => {
    setNombre('');  
    setApellido('');    
};

// Función para limpiar los filtros
const limpiarFiltros3 = () => {
    setTipo('');  
   
};

    
    useEffect(() => {
        tableParams;
       
    }, [tableParams]);


    useImperativeHandle(ref, tableRefHandler, [tableParams]);

    //cambio de color estado
       function renderColumnStatus(data: MemorandumrrhhReporteTableModel): ReactElement {
           const estado = data.estado_memorandum;
           const color = 'white';
           const background = ESTADO_APROBADO_JEFE[estado];
           const texto = estado;
           return <StatusColumn status={texto} color={color} background={background} />;
       }
   
    

    function renderColumnActions(data: MemorandumrrhhReporteTableModel): ReactElement {
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
              
            />
        );
    }


    
     function renderColumnResponsable(tableModel: MemorandumrrhhReporteTableModel): ReactElement {
            const imagen = tableModel.imagen2;
            const autorizados = tableModel.autorizado_por || []; // por si viene vacío o null

            return (
              <Box display="flex" flexDirection="row" alignContent="space-evenly">
                <Box
                  component="img"
                  alt="Foto"
                  src={getAvatarURL(imagen)}
                  sx={{ width: 32, height: 32, borderRadius: 1.2, flexShrink: 0, mr: 1 }}
                />
                <Box display="flex" flexDirection="column">
                  {autorizados.map((persona, index) => (
                    <Box key={persona.id || index}>
                      <Typography variant="subtitle2">{persona.fullname}</Typography>
                      <Typography
                        color="tertiary"
                        variant="caption"
                        sx={{ fontSize: '10px' }}
                      >
                        {persona.cargo}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            );
          }



    function renderColumnSolicitante(tableModel: MemorandumrrhhReporteTableModel): ReactElement {
        const imagen = tableModel.imagen;
        return  (
            <Box display="flex" flexDirection="row" alignContent="space-evenly" >
                <Box
                    component="img"
                    alt={tableModel.usuario_nombre}
                    src={getAvatarURL(imagen)}
                    sx={{ width: 32, height: 32, borderRadius: 1.2, flexShrink: 0, mr: 1 }}
                />
                <Box display="flex" flexDirection="column">
                    <Typography variant="subtitle2">{tableModel.usuario_nombre}</Typography>
                    <Typography color="tertiary" variant="caption" sx={{ fontSize: '10px'}}>{tableModel.usuario_cargo}</Typography>
                </Box>
            </Box>
        );
    }

// Función para combinar las opciones del backend con las del frontend
function combinarOpciones(backendOptions: SelectOption[],  enumOptions: { value: string, label: string }[]): string[] {
    const todasLasOpciones = [...backendOptions, ...enumOptions];
    const valoresUnicos = new Set<string>();
    const valoresFinales: string[] = [];

    todasLasOpciones.forEach((opcion) => {
        const valor = String(opcion.value); // 🔧 conversión a string segura
        if (!valoresUnicos.has(valor)) {
            valoresUnicos.add(valor);
            valoresFinales.push(valor);
        }
    });

    return valoresFinales;
}


function renderColumnOptions(data: MemorandumrrhhReporteTableModel): ReactElement {

    const isComplete = data.cantidad_dias === data.conteo_dias_detalle;
     // Define el color del botón basado en si los valores están completos
    const buttonColor =  isComplete ? 'info' : 'error';
    // Define el mensaje a mostrar si los datos no están completos
    const message = !isComplete ? 'Los datos no están completos (Revisar Destinos)' : 'Datos completos - Destinos Completos';
    return (

            <>
               <Box display="flex" alignItems="center">
                    <Tooltip title={message} arrow>
                        <span>
                            <IconButton
                                size="small"
                                onClick={() => onDetalleMemorandumClick(data.id)}
                                color={buttonColor}
                            >
                                <ListAltIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                    {!isComplete && (
                        <Typography color={buttonColor} variant="caption" sx={{ ml: 1 }}>
                            {message}
                        </Typography>
                    )}
                     {isComplete && (
                        <Typography color={'#4C90E4'} variant="caption" sx={{ ml: 1 }}>
                            {message}
                        </Typography>
                    )}
                </Box>

            </>
        );

    }

    function renderImpresionOptions(data: MemorandumrrhhReporteTableModel): ReactElement {
        const isComplete = data.cantidad_dias === data.conteo_dias_detalle;
        // Define el color del botón basado en si los valores están completos
        const buttonColor =  isComplete ? 'info' : 'error';
        // Define el mensaje a mostrar si los datos no están completos
        const message = !isComplete ? 'Los datos no están completos (Revisar Destinos)' : 'Datos completos - Destinos Completos';
        return (
            <>
                    {isComplete && (
                        <Tooltip title = "Memorandum a imprimir">
                            <IconButton size="small" disabled={loading2===data.id} onClick={() => onImprimirClick(data)} color="error">
                            {loading2===data.id ? <CircularProgress size={16}  />:<PictureAsPdfIcon />}
                            </IconButton>
                        </Tooltip>
                    )}
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
           { (props.tipoReporte === "GENERAL" || props.tipoReporte === "REPORTE_POR_PROYECTO" || props.tipoReporte === "REPORTE_POR_TIPO" )  && (
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
                    <button onClick={() => mostrarDatosFiltrados()} className="filter-button">
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
                            {ENUM_ESTADOS_IK.map((tipoItem, index) => (
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
           
        </Box>
            <DataTable
                ref={tableRef}
                headers={tableHeaders}
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

export const MemorandumrrhhReporteTable = forwardRef(MemorandumrrhhReporteTableComponent);
