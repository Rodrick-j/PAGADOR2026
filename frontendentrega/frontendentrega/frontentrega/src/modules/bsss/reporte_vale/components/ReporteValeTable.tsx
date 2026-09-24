import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, StatusColumn, ActionColumn, ChangeStateColumn, OnUpdateOptions, DataTableRefProps, ActiveColumn } from 'components/core/DataTable';
//@mui
import { Box } from '@mui/material';

//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
import { useSession } from 'hooks/session';
import { fCurrency } from 'utils/formatNumber';
//model
import { ReporteValeModuleService } from 'modules/bsss/reporte_vale/ReporteValeModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { ESTADO_APROBADO_JEFE, ESTADO_E, ESTADO_EJECUTADO,  } from 'constants/colors';
import { ENUM_ESTADOS_B,  ENUM_IS_SUPERADMINISTRADOR,ENUM_ESTADOS_IK,  ENUM_TIPOS_USUARIO, ENUM_TIPO_VEHICULO } from 'constants/enums';

import { SelectOption } from 'components/core/FormDialog';



export type ReporteValeTableModel = {
    id           : string;
    cod_vale     : string;
    num_apertura : string;
    placa        : string;
    tipo         : string;
    combustible  : string;
    litros       : string;
    fecha_validez: string;
    destino      : string;
    precio_total : string;
    observaciones: string;
    estado       : string;
    aprobado     : boolean;
    fecha_emision?: string;

 
   // para las columnas especiales
     actions: unknown;
     options?: unknown;
   //campos adicionales necesarios
    imprimir                : string;
    usuario_nombre?         : string;
   
    usuario_ci               : string;
    usuario_tipo?            : string;
    fecha_descargo_format?   : string;
    partida_presupuestaria?  : string;
    ff_of?                   : string;
    area?                    : string;
    sigla? : string;
    radio? : any;  
    nombre_chofer?           : string;
    fecha_factura?           : string;
    numero_factura?          : number;
    litros_reales?           : number,
    precio_real?             : number
    estado_ejecutado?        : string;  
    contrato?                : string;
    //Reporte final
     
     apertura_programatica? : string,
     total_litros_reales?: number,
     total_precio_real: number,               


};



export type ReporteValeTableRefProps = {
    refresh: (updateParams?: UpdateParams<ReporteValeTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<ReporteValeTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const destinoValeFilter: HeaderFilter = { type: 'text' };
const codValeFilter: HeaderFilter = { type: 'text' };
const placaFilter: HeaderFilter = { type: 'text' };
const aperturaFilter: HeaderFilter = { type: 'text' };
const fechaCargaFilter: HeaderFilter = { type: 'date' };
const estadoFilter: HeaderFilter    = { type   : 'select', options: ENUM_ESTADOS_B };


// Rango de fechas
const fechaFilter: HeaderFilter = { type: 'date' };

type Props = {
    onAddClick: () => void;
    onViewClick: (idReporteVale: string) => Promise<void>;
    onEditClick: (idReporteVale: string) => Promise<void>;
    onDownloadClick?: (fechaInicio : string, fechaFin: string,tipoFecha: number ) => void;
    onDownloadExcel?: (fechaInicio : string, fechaFin: string ) => void;
    tipoReporte: string;    
    loading : boolean;
    
    onImprimirClick: (data: ReporteValeTableModel) => void;  //cambiar areporte
    loading2: string;
};


export const ReporteValeTableComponent = (props: Props, ref: React.Ref<ReporteValeTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick, onDownloadClick,onDownloadExcel,onImprimirClick ,tipoReporte, loading,loading2} = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const authUser = useSession();
    const es_super_administrador = authUser.roles === ENUM_IS_SUPERADMINISTRADOR;
    const optionsVale = ENUM_ESTADOS_B.map((m) => m.value);

    const [idVale, setIdVale] = useState<string>('');
    const [tableParams, setTableParams] = useState<UpdateParams<ReporteValeTableModel>>(tableParamsInitialize);
    
     // Estado para el rango de fechas
     const [fechaInicio, setFechaInicio] = useState<string>('');
     const [fechaFin, setFechaFin] = useState<string>('');
     const [mesSeleccionado, setMesSeleccionado] = useState("");
     const [apertura, setApertura] = useState<string>('');
     const [contrato, setContrato] = useState<string>('');
     const [placa, setPlaca] = useState<string>('');

      // Estado donde guardas el último filtro aplicado
    const [filtroActivo, setFiltroActivo] = useState<{
        fechaInicio: string;
        fechaFin: string;
        tipoFecha?: number;
    } | null>(null);

    
     const [tipo, setTipo] = useState<string>('');
    
     
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
    let tableHeaders: TableHeader<ReporteValeTableModel>[] =[];
    if (props.tipoReporte === "GENERAL"){

         tableHeaders = [
                  
                { id: 'actions', label: 'Acciones', sort: false, render: renderColumnActions },
              //  { id: 'estado', label: 'Aprobar', align: 'center', render: renderColumnChange, filter: estadoFilter },
                { id: 'aprobado', label: 'Estado', align: 'center', render: renderColumnStatus },
                { id: 'estado_ejecutado', label: 'Estado Ejecutado', align: 'center', render: renderColumnStatusEjecutado },
                { id: 'combustible', label: 'Combustible', align: 'center' },
                { id: 'fecha_emision', label: 'Fecha Emision', align: 'center', filter: fechaCargaFilter },
                { id: 'fecha_factura', label: 'Fecha Factura', align: 'center', filter: fechaCargaFilter },
                { id: 'nombre_chofer', label: 'Nombre Chofer',width: 200,align: 'center', filter: fechaCargaFilter },
                { id: 'placa', label: 'Placa', align: 'center', filter: codValeFilter },
                { id: 'num_apertura', label: 'Apertura Prog.', align: 'center', filter: aperturaFilter },
                { id: 'area', label: 'Unidad', align: 'center',width: 200, filter: placaFilter },
                { id: 'numero_factura', label: 'Numero Factura', align: 'center'},                
                { id: 'cod_vale', label: 'Codigo Vale', align: 'center' },
                { id: 'destino', label: 'Destino', align: 'left', filter: destinoValeFilter },
                { id: 'litros', label: 'Litros Vale', align: 'center', },
                { id: 'litros_reales', label: 'Litros reales', align: 'center',  },
                { id: 'precio_total', label: 'Precio Vale', align: 'center'  ,render: renderColumnPrecioTotal},
                { id: 'precio_real', label: 'Precio Real', align: 'center', render:renderColumnPrecioReal },
               
                { id: 'contrato', label: 'Contrato', sort: false,width:250, align: 'center' },
             //   { id: 'area', label: 'Area del Vale', sort: false,width:300,  align: 'center' },

             
             
           ];
    }
    
    if (props.tipoReporte === "REPORTE_POR_PROYECTO"){
        tableHeaders = [

                   { id: 'actions', label: 'Acciones', sort: false, render: renderColumnActions },
              //  { id: 'estado', label: 'Aprobar', align: 'center', render: renderColumnChange, filter: estadoFilter },
                { id: 'aprobado', label: 'Estado', align: 'center', render: renderColumnStatus },
                { id: 'estado_ejecutado', label: 'Estado Ejecutado', align: 'center', render: renderColumnStatusEjecutado },
                { id: 'combustible', label: 'Combustible', align: 'center' },
                { id: 'fecha_emision', label: 'Fecha Emision', align: 'center', filter: fechaCargaFilter },
                { id: 'fecha_factura', label: 'Fecha Factura', align: 'center', filter: fechaCargaFilter },
                { id: 'nombre_chofer', label: 'Nombre Chofer',width: 200,align: 'center', filter: fechaCargaFilter },
                { id: 'placa', label: 'Placa', align: 'center', filter: codValeFilter },
                { id: 'num_apertura', label: 'Apertura Prog.', align: 'center', filter: aperturaFilter },
                { id: 'area', label: 'Unidad', align: 'center',width: 200, filter: placaFilter },
                { id: 'numero_factura', label: 'Numero Factura', align: 'center'},                
                { id: 'cod_vale', label: 'Codigo Vale', align: 'center' },
                { id: 'destino', label: 'Destino', align: 'left', filter: destinoValeFilter },
                { id: 'litros', label: 'Litros Vale', align: 'center', },
                { id: 'litros_reales', label: 'Litros reales', align: 'center',  },
                { id: 'precio_total', label: 'Precio Vale', align: 'center'  ,render: renderColumnPrecioTotal},
                { id: 'precio_real', label: 'Precio Real', align: 'center', render:renderColumnPrecioReal },
               
               { id: 'contrato', label: 'Contrato', sort: false,width:250, align: 'center' },
             //   { id: 'area', label: 'Area del Vale', sort: false,width:300,  align: 'center' },

              
            
           ];
      
    } if ( props.tipoReporte === "REPORTE_POR_APERTURA"){
        tableHeaders = [
           
               { id: 'actions', label: 'Acciones', sort: false, render: renderColumnActions },
              //  { id: 'estado', label: 'Aprobar', align: 'center', render: renderColumnChange, filter: estadoFilter },
                { id: 'aprobado', label: 'Estado', align: 'center', render: renderColumnStatus },
                { id: 'estado_ejecutado', label: 'Estado Ejecutado', align: 'center', render: renderColumnStatusEjecutado },
                { id: 'combustible', label: 'Combustible', align: 'center' },
                { id: 'fecha_emision', label: 'Fecha Emision', align: 'center', filter: fechaCargaFilter },
                { id: 'fecha_factura', label: 'Fecha Factura', align: 'center', filter: fechaCargaFilter },
                { id: 'nombre_chofer', label: 'Nombre Chofer',width: 200,align: 'center', filter: fechaCargaFilter },
                { id: 'placa', label: 'Placa', align: 'center', filter: codValeFilter },
                { id: 'num_apertura', label: 'Apertura Prog.', align: 'center', filter: aperturaFilter },
                { id: 'area', label: 'Unidad', align: 'center',width: 200, filter: placaFilter },
                { id: 'numero_factura', label: 'Numero Factura', align: 'center'},                
                { id: 'cod_vale', label: 'Codigo Vale', align: 'center' },
                { id: 'destino', label: 'Destino', align: 'left', filter: destinoValeFilter },
                { id: 'litros', label: 'Litros Vale', align: 'center', },
                { id: 'litros_reales', label: 'Litros reales', align: 'center',  },
                { id: 'precio_total', label: 'Precio Vale', align: 'center'  ,render: renderColumnPrecioTotal},
                { id: 'precio_real', label: 'Precio Real', align: 'center', render:renderColumnPrecioReal },               
                { id: 'contrato', label: 'Contrato', sort: false,width:250, align: 'center' },
             //   { id: 'area', label: 'Area del Vale', sort: false,width:300,  align: 'center' },

             
           ];
    }  if (props.tipoReporte === "REPORTE_POR_TIPO"){
        tableHeaders = [
                       
              { id: 'actions', label: 'Acciones', sort: false, render: renderColumnActions },
              //  { id: 'estado', label: 'Aprobar', align: 'center', render: renderColumnChange, filter: estadoFilter },
                { id: 'aprobado', label: 'Estado', align: 'center', render: renderColumnStatus },
                { id: 'estado_ejecutado', label: 'Estado Ejecutado', align: 'center', render: renderColumnStatusEjecutado },
                { id: 'combustible', label: 'Combustible', align: 'center' },
                { id: 'fecha_emision', label: 'Fecha Emision', align: 'center', filter: fechaCargaFilter },
                { id: 'fecha_factura', label: 'Fecha Factura', align: 'center', filter: fechaCargaFilter },
                { id: 'nombre_chofer', label: 'Nombre Chofer',width: 200,align: 'center', filter: fechaCargaFilter },
                { id: 'placa', label: 'Placa', align: 'center', filter: codValeFilter },
                { id: 'num_apertura', label: 'Apertura Prog.', align: 'center', filter: aperturaFilter },
                { id: 'area', label: 'Unidad', align: 'center',width: 200, filter: placaFilter },
                { id: 'numero_factura', label: 'Numero Factura', align: 'center'},                
                { id: 'cod_vale', label: 'Codigo Vale', align: 'center' },
                { id: 'destino', label: 'Destino', align: 'left', filter: destinoValeFilter },
                { id: 'litros', label: 'Litros Vale', align: 'center', },
                { id: 'litros_reales', label: 'Litros reales', align: 'center',  },
                { id: 'precio_total', label: 'Precio Vale', align: 'center'  ,render: renderColumnPrecioTotal},
                { id: 'precio_real', label: 'Precio Real', align: 'center', render:renderColumnPrecioReal },
               
                { id: 'contrato', label: 'Contrato', sort: false,width:250, align: 'center' },
             //   { id: 'area', label: 'Area del Vale', sort: false,width:300,  align: 'center' },    
             
           ];
    } 
    if (props.tipoReporte === "REPORTE_FINAL"){ // Realizar modificaciones a las columnas
        tableHeaders = [
                       
               { id: 'actions', label: 'Acciones', sort: false, render: renderColumnActions },
              //  { id: 'estado', label: 'Aprobar', align: 'center', render: renderColumnChange, filter: estadoFilter },
                { id: 'apertura_programatica', label: 'Apertura Programatica', align: 'center',  },
                { id: 'total_litros_reales', label: 'Total litros Reales', align: 'center' },
                { id: 'total_precio_real', label: 'Total Precio Real', align: 'center', },               
             //   { id: 'area', label: 'Area del Vale', sort: false,width:300,  align: 'center' },      
             
           ];
    } 
  


    const handleUpdateTable = (params: UpdateParams<ReporteValeTableModel>, opt: OnUpdateOptions) => {
      
        opt.setLoading(true);       
        if (!isMounted()) return;

        const newParams = {
            ...params,
            filters: { ...params.filters },
        };

        if(props.tipoReporte != "REPORTE_FINAL"){
            ReporteValeModuleService.getTableReporteVale( newParams as QueryParams).then((result) => {
			          
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<ReporteValeTableModel> = {				
                ...params,
                rows: result.rows || [],
                count: result.count || 0
            };
            if (isMounted()) setTableParams(newTableParams);
			
        });
        }else{
                // Si el reporte es "REPORTE_FINAL", vaciamos la tabla
            const emptyTableParams: UpdateParams<ReporteValeTableModel> = {
                ...params,
                rows: [],
                count: 0
            };

            if (isMounted()) setTableParams(emptyTableParams);
            opt.setLoading(false);
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
    const handleAperturaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApertura(e.target.value);            
    };

    const handleContratoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContrato(e.target.value);            
    };

    const handlePlacaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlaca(e.target.value);            
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

          ReporteValeModuleService.getFechaFiltro(inicio, fin).then((result) => {		
			
            if (!result.success) return;			
            const newTableParams: UpdateParams<ReporteValeTableModel> = {            
                ...tableParams,    
                rows: result.rows || [],				
                count: result.count || 0,
                 rowsPerPage: 5,
                page: 1
            };            
            if (isMounted()) 
               setTableParams(newTableParams);               			
        });      
    };

   /* const buscarNombreApellido =  async () => {      

         if(nombre.length > 0 || apellido.length >0){
           
            ReporteValeModuleService.getNombreApellido(nombre, apellido).then((result) => {		
          
                if (!result.success) return;			
                const newTableParams: UpdateParams<ReporteValeTableModel> = {            
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
  };*/
    
  const mostrarDatosApertura =  async () => {
    
      const inicio = filtroActivo?.fechaInicio;
      const fin = filtroActivo?.fechaFin;     
    //    let tipoFecha = 0; // si es dia
    ReporteValeModuleService.getDatosApertura(inicio!, fin!, apertura).then((result) => {		
            
      if (!result.success) return;			
      const newTableParams: UpdateParams<ReporteValeTableModel> = {            
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

  const mostrarDatosContrato =  async () => {
     const inicio = filtroActivo?.fechaInicio;
      const fin = filtroActivo?.fechaFin;     
      const contratoMayuscula = contrato.toUpperCase();
    ReporteValeModuleService.getDatosContrato(inicio!, fin!, contratoMayuscula).then((result) => {		
            
      if (!result.success) return;			
      const newTableParams: UpdateParams<ReporteValeTableModel> = {            
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


const buscarTipoCombustible =  async () => {   
    const inicio = filtroActivo?.fechaInicio;
    const fin = filtroActivo?.fechaFin;        

    if(tipo.length > 0){
      
       ReporteValeModuleService.getTipoCombustible(inicio!, fin!, tipo).then((result) => {		
       
     
           if (!result.success) return;			
           const newTableParams: UpdateParams<ReporteValeTableModel> = {            
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

  const buscarPlacaVehiculo =  async () => {
     const inicio = filtroActivo?.fechaInicio;
    const fin = filtroActivo?.fechaFin;   
     
    ReporteValeModuleService.getDatosVehiculo(inicio!, fin!, placa).then((result) => {		
            
      if (!result.success) return;			
      const newTableParams: UpdateParams<ReporteValeTableModel> = {            
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

  const mostrarDatosReporteFinal =  async () => {
       let inicio;
        let fin ;
       // let tipoFecha = 0; // si es dia

        if (mesSeleccionado) {
            const añoActual = new Date().getFullYear();
            const mesIndex = parseInt(mesSeleccionado, 10);
            const primerDia = new Date(añoActual, mesIndex, 1);
            const ultimoDia = new Date(añoActual, mesIndex + 1, 0);

            // Convertir a formato YYYY-MM-DD
            inicio = primerDia.toISOString().split("T")[0];		
            fin = ultimoDia.toISOString().split("T")[0];
          //  tipoFecha = 1; // si es mes
        }
        
        if (!inicio || !fin) {
            return notify.error("Seleccione un rango de fechas o un mes.");//alert("Seleccione un rango de fechas o un mes.");
            //return;
        }

         // Guarda el filtro actual
        setFiltroActivo({ fechaInicio: inicio, fechaFin: fin});  

          ReporteValeModuleService.getFechaFiltroReporteFinal(inicio, fin).then((result) => {		
			
            if (!result.success) return;			
            const newTableParams: UpdateParams<ReporteValeTableModel> = {            
                ...tableParams,    
                rows: result.rows || [],				
                count: result.count || 0,
                 rowsPerPage: 5,
                page: 1
            };            
            if (isMounted()) 
               setTableParams(newTableParams);               			
        });      
};


// Función para limpiar los filtros
const limpiarFiltros = () => {
    setFechaInicio('');  // Restablece el valor de la fecha de inicio
    setFechaFin('');     // Restablece el valor de la fecha de fin
    setApertura(''); // Restablece el valor de la apertura
};

// Función para limpiar los filtros
const limpiarFiltros2 = () => {
    setContrato('');  
    setTipo('');    
    setPlaca('');
};

// Función para limpiar los filtros
const limpiarFiltros3 = () => {
    setTipo('');  
   
};

    
    useEffect(() => {
        tableParams;
       // console.log("TCL: mostrarDatosFiltrados -> useEffect", tableParams)
    }, [tableParams]);


    useImperativeHandle(ref, tableRefHandler, [tableParams]);

    //cambio de color estado
      function renderColumnStatus(data: ReporteValeTableModel): ReactElement {
              const color = 'white';
              const background = ESTADO_E[data.estado];
              return <StatusColumn status={data.estado} color={color} background={background} />;
          }
        function renderColumnStatusEjecutado(data: ReporteValeTableModel): ReactElement {
              const color = 'white';
              const background = ESTADO_EJECUTADO[data.estado_ejecutado!];
              return <StatusColumn status={data.estado_ejecutado!} color={color} background={background} />;
          }
   
    

    function renderColumnActions(data: ReporteValeTableModel): ReactElement {
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
              
            />
        );
    }

     const [open2, setOpen2] = useState<boolean>(false);

    

    
 function renderColumnPrecioTotal(data: ReporteValeTableModel): ReactElement {
        const precioTotal = fCurrency(data.precio_total);
        const color = data.estado==='ANULADO'?'#FF4747':'black';
        const styleFont = data.estado==='ANULADO'?'line-through':'none';
        return <Box sx={{ textAlign: 'right', color: color, textDecoration: styleFont }}>{precioTotal}</Box>;
    }

   function renderColumnPrecioReal(data: ReporteValeTableModel): ReactElement {
        const precioReal = fCurrency(data.precio_real);
        const color = data.estado==='ANULADO'?'#FF4747':'black';
        const styleFont = data.estado==='ANULADO'?'line-through':'none';
        return <Box sx={{ textAlign: 'right', color: color, textDecoration: styleFont }}>{precioReal}</Box>;
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
           { (props.tipoReporte === "GENERAL" || props.tipoReporte === "REPORTE_POR_PROYECTO" || props.tipoReporte === "REPORTE_POR_TIPO" || props.tipoReporte === "REPORTE_POR_APERTURA" )  && (
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
            { props.tipoReporte === "REPORTE_POR_APERTURA"  && (
                 
                <div className="filters-container">

                    

                    <div className="filter-item">
                        <label htmlFor="Apertura">Apertura : </label>
                        <input
                            type="text"
                            id="apertura"
                            value={apertura}
                            onChange={handleAperturaChange}
                            className="filter-input"                            
                        />
                    </div>             
                    
                    <div className="filter-item">                  
                        <button onClick={() => mostrarDatosApertura()} className="filter-button">
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

          { props.tipoReporte === "REPORTE_POR_TIPO" && (

                   <div className="filters-container">
                       <div className="filter-item">
                        <label htmlFor="Contrato">Contrato : </label>
                        <input
                            type="text"
                            id="contrato"
                            value={contrato}
                            onChange={handleContratoChange}
                            className="filter-input"   
                             disabled={tipo !== "" || placa  !== ""} // desactiva los demas campos                         
                        />
                    </div>             
                    
                    <div className="filter-item">                  
                        <button onClick={() => mostrarDatosContrato()} className="filter-button">
                            Filtrar
                        </button>
                    </div>

                    <div className="filter-item">
                        <label htmlFor="tipo">Tipo de Combustible : </label>
                        <select
                            id="tipo"
                            value={tipo}
                            onChange={handleTipoChange}
                            className="filter-input"
                            disabled={contrato !== "" || placa  !== ""} // desactiva los demas campos
                            >
                            <option value="">Seleccione......</option>
                            {ENUM_TIPO_VEHICULO.map((tipoItem, index) => (
                                <option key={index} value={tipoItem.value}>
                                    {tipoItem.label}
                                </option>
                            ))}                    
                        </select>
                    </div>
                   
                   <div className="filter-item">                  
                        <button onClick={() => buscarTipoCombustible()} className="filter-button">
                            Filtrar
                        </button>
                   </div>        
                   
                     
                   <div className="filter-item">                      
                        <label htmlFor="Placa">Placa Vehiculo : </label>
                        <input
                            type="text"
                            id="placa"
                            value={placa}
                            onChange={handlePlacaChange}
                            className="filter-input" 
                            disabled={tipo !== "" || contrato  !== ""} // desactiva los demas campos                           
                        />
                  </div>
                  <div className="filter-item">                  
                         <button onClick={() => buscarPlacaVehiculo()} className="filter-button">
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
           )} { (props.tipoReporte === "REPORTE_FINAL"  )  && (
            <div className="filters-container">
                <div className="filter-item">
                    <label htmlFor="mes">Mes: </label>
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
                    <button onClick={() => mostrarDatosReporteFinal()} className="filter-button">
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

export const ReporteValeTable = forwardRef(ReporteValeTableComponent);
