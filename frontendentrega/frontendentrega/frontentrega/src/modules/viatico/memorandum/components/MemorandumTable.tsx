import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, StatusColumn, ActionColumn, ChangeStateColumn, OnUpdateOptions, DataTableRefProps, ActiveColumn } from 'components/core/DataTable';
//@mui
//import { Box } from '@mui/material';
import { Alert, Box,CircularProgress, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { MemorandumModuleService } from 'modules/viatico/memorandum/MemorandumModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { useSession } from 'hooks/session';


import {  ANULADO, APROBADO_CONTABILIDAD, APROBADO_SECRETARIO, ASESOR, ASESOR_FINANCIERO, EN_ESPERA_INFORME, ENCARGADO_VIATICOS, ENUM_CON_SIN_OBSERVACIONES, ENUM_ESTADOS_APROBADOS, ENUM_ESTADOS_APROBADOS_JEFES, ENUM_ESTADOS_APROBADOS_RRHH, ENUM_ESTADOS_APROBADOS_SDAFP, ENUM_ESTADOS_CONTABILIDAD, ENUM_ESTADOS_H, ENUM_ESTADOS_MEMOREPO, ENUM_ESTADOS_PAGO, ENUM_IS_JEFE, ENUM_IS_SUPERADMINISTRADOR, ESTADOS_BLOQUEADO_ENCARGADO, ESTADOS_BLOQUEADO_RRHH, ESTADOS_BLOQUEADOS_CONTA, ESTADOS_SOLO_VISTA, GOBERNADOR, JEFE, JEFE_COMUNICACION, JEFE_GABINETE, OBSERVADO, PENDIENTE, RECHAZADO, REPOSICION, REPOSICION_VENCIDA, ROLES_EDICION, ROLES_ENCARGADO_ADMIN, ROLES_TECNICOS_VIATICOS, SECRETARIO, SIN_OBSERVACION, STORAGE_LOCAL, TECNICO_COMBUSTIBLE_JEFE, TECNICO_COMPLETO, TECNICO_RRHH, TECNICO_VALE_VIATICOS, TECNICO_VIATICOS, VERIFICADO_RRHH } from 'constants/enums';
import { ConfirmDialog } from 'components/core/ConfirmDialog';
import { ESTADO_APROBADO_JEFE, ESTADO_O, ESTADO_TIPO_MEMO_REPO, ESTADO_TIPO_RESOLUCION } from 'constants/colors';
import { DetalleDestinoModuleService } from 'modules/viatico/detalle_destino';
import { getAvatarURL } from 'utils';

import { SelectOption } from 'components/core/FormDialog';
import ModalPersonalizadoDialog from 'components/ModalPersonalizado';

export type MemorandumTableModel = {
    id: string;
    cod_depart_memo        : string;
   //
   //campos que se aumentan
   usuario_nombre         :string;
   usuario_cargo          : string;
   ci                     : string;
   nume_celular           : string;
   // campos para apertura
   apertura_viatico       : string;
   nombre_area_apertura   :string;
   presupuesto_inicial    :number;
   presupuesto_restante   : number;
   presupuesto_inicial_pasaje?    :number;
   presupuesto_restante_pasaje?   : number;
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
    tipo_memo_repo         : string;//boolean
    tipo_transporte        : string;
    observacion            : string;
    estado_memorandum      : string;
    notificacion_memo      : string;
    aprobacion_rrhh_conta  : string[];
    tiempo_aprobacion_usuario : string[];

    codigo_objeto?          : string;
    objeto_gasto?           : string;
    //Modificacion
    modificacion           : boolean;
    obs_modificacion      : string ;
    fecha_cambio          : string;
    estado_modificacion   : string;

    justificacion         : string;
    //detalle Destino dias
    conteo_dias_detalle    : number;
    contrato?              : string;
    lista_select_jefes?    : SelectOption[];
    tipo_memo_repo_change?   : boolean;
    // para las columnas especiales
    actions: unknown;
    options?: unknown;
    objetivo_viaje?  : string;
    destino?         : string;
    resolucion?      : string;
};

export type ReporteMemorandumTableModel = {
    id: string;
    cod_depart_memo        : string;
   //
   //campos que se aumentan
   usuario_nombre         :string;
   usuario_cargo          : string;
   ci                     : string;
   nume_celular  : string;
   // campos para apertura
   apertura_viatico : string;
   nombre_area_apertura :string;
   presupuesto_inicial:number;
   presupuesto_restante : number;
   // campos de imagen
   imagen                : string;
   imagen2               : string;
      //Campos para imprimir
     imprimir             : string;
     //campos Memorandum
    autorizado_por         : any[];
    cargo_jefe_unidad      : string;
    fecha_memo_registro    : Date;
    vehiculo_id               : string; //tipo de vehiculo marca  TV
    num_placa                  : string; //placa del vehiculo  TV
    tipo_comision_idp      : string;
    fecha_inicio_viaje     : Date;
    fecha_fin_viaje        : Date;
    cantidad_dias          : number;
    tipo_memo_repo         : string;//boolean;
    tipo_transporte        : string;
    observacion            : string;
    estado_memorandum      : string;
    notificacion_memo      : string;
    modificacion           : boolean;
    obs_modificacion      : string ;
    fecha_cambio          : string;
    estado_modificacion   : string;
    justificacion         : string;
    aprobacion_rrhh_conta  : string[];
    tiempo_aprobacion_usuario : string[];
    //detalle Destino dias
    conteo_dias_detalle    : number;

    // para las columnas especiales
    actions: unknown;
    options?: unknown;
};

export type DatosMessage = {
    id              : string;
    nombre_usuario  : string;
    cod_memo        : string;
    tipo_comision_idp   : string;

}

export type MemorandumTableRefProps = {
    refresh: (updateParams?: UpdateParams<MemorandumTableModel>) => void;
    getQueryParams: () => QueryParams;
};


export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<MemorandumTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};


const nombrePadreFilter: HeaderFilter = { type: 'text' };
const partidaFilter: HeaderFilter = { type: 'text' };
const estadosFilter: HeaderFilter = { type: 'select',options: ENUM_ESTADOS_CONTABILIDAD};

type Props = {
    onAddClick: () => void;
    onViewClick: (idMemorandum: string) => Promise<void>;
  //  onDetalleMemorandumClick: (idMemorandum: string, fechaInicio :Date, fechaFin : Date, cantidaDias: number) => void;
    onDetalleMemorandumClick: (idMemorandum: string) => void;
    onEditClick: (idMemorandum: string) => Promise<void>;
 //   onDetalleClick: (idMemorandum: string) => void;
    onImprimirClick: (data: ReporteMemorandumTableModel) => void;  //cambiar areporte
    loading: string;
    loading2: string;
};

export const MemorandumTableComponent = (props: Props, ref: React.Ref<MemorandumTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick,onDetalleMemorandumClick, onEditClick , onImprimirClick, loading, loading2 } = props;
   // const { onDetalleMemorandumClick } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<MemorandumTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);
    const authUser = useSession();

    let tableHeaders: TableHeader<MemorandumTableModel>[] = [];
    
    if(authUser.roles === TECNICO_VIATICOS || authUser.roles === TECNICO_COMPLETO || authUser.roles === TECNICO_VALE_VIATICOS){
         tableHeaders = [
            { id: 'actions', label: 'Acciones', sort: false, render:renderColumnActions, width:150}, //, render: renderColumnActions
            { id: 'cod_depart_memo', label: 'Numero de CITE', align: 'center' , filter: partidaFilter,  width:250  },//, render: renderColumnActive
            { id: 'tipo_memo_repo', label: 'Tipo de Memorandum', align: 'center', render: renderColumnStatusMemoRepo },
            { id: 'fecha_memo_format', label: 'Fecha Memorandum', align: 'center' },
            { id: 'usuario_nombre', label: 'Nombre Usuario Solicita Memorandum', align: 'center', render: renderColumnSolicitante, filter: partidaFilter, width:250 },
            { id: 'ci', label: 'CI', align: 'center', filter: partidaFilter },               
            //{ id: 'estado_memorandum', label: 'Aprobar Memorandum', align: 'center', render:renderColumnChange},
            { id: 'notificacion_memo', label: 'Estado', align: 'center', render:renderColumnStatus },
            { id: 'options', label: 'Detalles del Destino', sort: false, render:renderColumnOptions, align: 'center' ,width:200},
            { id: 'imprimir', label: 'Descargar Memorandum', sort: false, render: renderImpresionOptions, align: 'center' ,width:150},            
            { id: 'nume_celular', label: 'Numero de Celular', align: 'center'},
            { id: 'contrato', label: 'Item/contrato', align: 'center', filter: partidaFilter, width:150 },
            { id: 'fecha_inicio_viaje', label: 'Fecha Inicio Viaje', align: 'center',width:150, filter: nombrePadreFilter },
            { id: 'fecha_fin_viaje', label: 'Fecha Fin Viaje', align: 'center',width:150 },
            { id: 'cantidad_dias', label: 'Cantidad dias', align: 'center',width:90},
            
            //aumentando campos de apertua
            { id: 'autorizado_por', label: 'Autorizado por Jefe de Unidad', align: 'center', render: renderColumnResponsable,width:300},
            { id: 'apertura_viatico', label: 'Codigo Apertura', align: 'center', filter: partidaFilter, width:200 },
            { id: 'nombre_area_apertura', label: 'Area Apertura', align: 'center', filter: partidaFilter ,width:200 },
            { id: 'codigo_objeto', label: 'Codigo Objeto', align: 'center', width:80 },
            { id: 'objeto_gasto', label: 'Objeto de Gasto', align: 'center', width:260 },
            { id: 'presupuesto_inicial', label: 'Presupuesto Inicial Viatico', align: 'center' },
            { id: 'presupuesto_restante', label: 'Presuspuesto Restante Viatico', align: 'center' },
            { id: 'presupuesto_inicial_pasaje', label: 'Presupuesto Inicial Pasaje', align: 'center' },
            { id: 'presupuesto_restante_pasaje', label: 'Presuspuesto Restante Pasaje', align: 'center' },           
            { id: 'tipo_comision_idp', label: 'Tipo de Comision', align: 'center' },
           
          
            { id: 'tipo_transporte', label: 'Tipo de Transporte', align: 'center' },
            { id: 'justificacion', label: 'Justificacion de Anulacion/Rechazo', align: 'center',width: 200, },
            { id: 'observacion', label: 'Observacion', align: 'center' },    
            { id: 'modificacion', label: 'Modificaciones', align: 'center', width: 150, render: renderColumnActive  },
            { id: 'obs_modificacion', label: 'Observaciones', align: 'center', width: 200, },
            { id: 'fecha_cambio', label: 'Fechas de Cambio', align: 'center', width: 100,   },
            { id: 'estado_modificacion', label: 'Estado Modificaciones', align: 'center', width: 180, render: renderModificacionStatus  }

        ];
    }else if(authUser.roles === ENCARGADO_VIATICOS || authUser.roles === ENUM_IS_SUPERADMINISTRADOR){
        tableHeaders = [
            { id: 'actions', label: 'Acciones', sort: false, render:renderColumnActions, width:150}, //, render: renderColumnActions
            { id: 'cod_depart_memo', label: 'Numero de CITE', align: 'center' , filter: partidaFilter,  width:250  },//, render: renderColumnActive
            { id: 'tipo_memo_repo', label: 'Tipo de Memorandum', align: 'center', render: renderColumnStatusMemoRepo },
            { id: 'tipo_memo_repo_change', label: 'Cambio Tipo de Memorandum', align: 'center', render: renderColumnChangeMemoRepo  },
            { id: 'fecha_memo_format', label: 'Fecha Memorandum', align: 'center' },
            { id: 'usuario_nombre', label: 'Nombre Usuario Solicita Memorandum', align: 'center',filter: nombrePadreFilter , render: renderColumnSolicitante, width:250 },
            { id: 'ci', label: 'CI', align: 'center', filter: partidaFilter },  
            { id: 'resolucion', label: 'Existe Resolucion', align: 'center' , render: renderColumnStatusResolucion},               
            { id: 'estado_memorandum', label: 'Aprobar Memorandum', align: 'center', render:renderColumnChange ,filter: estadosFilter },
            { id: 'notificacion_memo', label: 'Estado', align: 'center', render:renderColumnStatus},
            { id: 'options', label: 'Detalles del Destino', sort: false, render:renderColumnOptions, align: 'center' ,width:200},
            { id: 'imprimir', label: 'Descargar Memorandum', sort: false, render: renderImpresionOptions, align: 'center' ,width:150},
            { id: 'nume_celular', label: 'Numero de Celular', align: 'center'},
            { id: 'contrato', label: 'Item/contrato', align: 'center', filter: partidaFilter, width:150 },
            { id: 'fecha_inicio_viaje', label: 'Fecha Inicio Viaje', align: 'center',width:150, filter: nombrePadreFilter },
            { id: 'fecha_fin_viaje', label: 'Fecha Fin Viaje', align: 'center',width:150 },
            { id: 'cantidad_dias', label: 'Cantidad dias', align: 'center',width:90},
            { id: 'tipo_comision_idp', label: 'Tipo de Comision', align: 'center'},
            { id: 'destino', label: 'Destino', align: 'center'},
            { id: 'objetivo_viaje', label: 'Objetivo de Viaje', align: 'center', width:500},
                 
            //aumentando campos de apertua
             { id: 'autorizado_por', label: 'Autorizado por Jefe de Unidad', align: 'center', render: renderColumnResponsable,width:300},
            { id: 'apertura_viatico', label: 'Codigo Apertura', align: 'center', filter: partidaFilter, width:200 },
            { id: 'nombre_area_apertura', label: 'Area Apertura', align: 'center', filter: partidaFilter ,width:200 },
            { id: 'codigo_objeto', label: 'Codigo Objeto', align: 'center', width:80 },
            { id: 'objeto_gasto', label: 'Objeto de Gasto', align: 'center', width:260 },
            { id: 'presupuesto_inicial', label: 'Presupuesto Inicial Viatico', align: 'center' },
            { id: 'presupuesto_restante', label: 'Presuspuesto Restante Viatico', align: 'center' },
            { id: 'presupuesto_inicial_pasaje', label: 'Presupuesto Inicial Pasaje', align: 'center' },
            { id: 'presupuesto_restante_pasaje', label: 'Presuspuesto Restante Pasaje', align: 'center' },           
          
           
            
            { id: 'tipo_transporte', label: 'Tipo de Transporte', align: 'center' },
            { id: 'justificacion', label: 'Justificacion de Anulacion/Rechazo', align: 'center',width: 200, },
            { id: 'observacion', label: 'Observacion', align: 'center' },    
            { id: 'modificacion', label: 'Modificaciones', align: 'center', width: 150, render: renderColumnActive  },
            { id: 'obs_modificacion', label: 'Observaciones', align: 'center', width: 200, },
            { id: 'fecha_cambio', label: 'Fechas de Cambio', align: 'center', width: 100,   },
            { id: 'estado_modificacion', label: 'Estado Modificaciones', align: 'center', width: 180, render: renderModificacionStatus  }

        ];
    }
    else{
        tableHeaders = [
            { id: 'actions', label: 'Acciones', sort: false, render:renderColumnActions, width:150}, //, render: renderColumnActions
            { id: 'cod_depart_memo', label: 'Numero de CITE', align: 'center' , filter: partidaFilter,  width:250  },//, render: renderColumnActive
            { id: 'tipo_memo_repo', label: 'Tipo de Memorandum', align: 'center',render: renderColumnStatusMemoRepo },
            { id: 'fecha_memo_format', label: 'Fecha Memorandum', align: 'center' },
            { id: 'usuario_nombre', label: 'Nombre Usuario Solicita Memorandum', align: 'center',filter: nombrePadreFilter, render: renderColumnSolicitante, width:250 },
            { id: 'ci', label: 'CI', align: 'center', filter: partidaFilter },               
            { id: 'estado_memorandum', label: 'Aprobar Memorandum', align: 'center', render:renderColumnChange ,filter: estadosFilter },
            { id: 'notificacion_memo', label: 'Estado', align: 'center', render:renderColumnStatus},
            { id: 'options', label: 'Detalles del Destino', sort: false, render:renderColumnOptions, align: 'center' ,width:200},
            { id: 'imprimir', label: 'Descargar Memorandum', sort: false, render: renderImpresionOptions, align: 'center' ,width:150},
            { id: 'nume_celular', label: 'Numero de Celular', align: 'center'},
            { id: 'contrato', label: 'Item/contrato', align: 'center', filter: partidaFilter, width:150 },
            { id: 'fecha_inicio_viaje', label: 'Fecha Inicio Viaje', align: 'center',width:150, filter: nombrePadreFilter },
            { id: 'fecha_fin_viaje', label: 'Fecha Fin Viaje', align: 'center',width:150 },
            { id: 'cantidad_dias', label: 'Cantidad dias', align: 'center',width:90},
           
            //aumentando campos de apertua
             { id: 'autorizado_por', label: 'Autorizado por Jefe de Unidad', align: 'center', render: renderColumnResponsable,width:300},
            { id: 'apertura_viatico', label: 'Codigo Apertura', align: 'center', filter: partidaFilter, width:200 },
            { id: 'nombre_area_apertura', label: 'Area Apertura', align: 'center', filter: partidaFilter ,width:200 },
            { id: 'codigo_objeto', label: 'Codigo Objeto', align: 'center', width:80 },
            { id: 'objeto_gasto', label: 'Objeto de Gasto', align: 'center', width:260 },
            { id: 'presupuesto_inicial', label: 'Presupuesto Inicial Viatico', align: 'center' },
            { id: 'presupuesto_restante', label: 'Presuspuesto Restante Viatico', align: 'center' },
            { id: 'presupuesto_inicial_pasaje', label: 'Presupuesto Inicial Pasaje', align: 'center' },
            { id: 'presupuesto_restante_pasaje', label: 'Presuspuesto Restante Pasaje', align: 'center' },           
            { id: 'tipo_comision_idp', label: 'Tipo de Comision', align: 'center' },
            
            
            { id: 'tipo_transporte', label: 'Tipo de Transporte', align: 'center' },
            { id: 'justificacion', label: 'Justificacion de Anulacion/Rechazo', align: 'center',width: 200, },
            { id: 'observacion', label: 'Observacion', align: 'center' },    
            { id: 'modificacion', label: 'Modificaciones', align: 'center', width: 150, render: renderColumnActive  },
            { id: 'obs_modificacion', label: 'Observaciones', align: 'center', width: 200, },
            { id: 'fecha_cambio', label: 'Fechas de Cambio', align: 'center', width: 100,   },
            { id: 'estado_modificacion', label: 'Estado Modificaciones', align: 'center', width: 180, render: renderModificacionStatus  }

        ];
    }

    const handleUpdateTable = (params: UpdateParams<MemorandumTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        MemorandumModuleService.getTableMemorandum(params as QueryParams).then((result) => {			
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<MemorandumTableModel> = {
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
                filters: {
                    ...tableParams.filters
                },
            };
            return newParams;
        }
    });


    useImperativeHandle(ref, tableRefHandler, [tableParams]);

    const [rangoFechas, setRangoFechas] = useState<{ id: Date; nombre: string; caption: string }[]>([]);
    const [switchValue, setSwitchValue] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [activeRowId, setActiveRowId] = useState<string | null>(null);

    function renderColumnActive(data: MemorandumTableModel): ReactElement {
        const fechaInicio = String(data.fecha_inicio_viaje);	
        const fechaFin = String(data.fecha_fin_viaje);
	
        const fechaActual = new Date();	
        const [dia, mes, anio] = fechaInicio.split('/');
        const [dia2, mes2, anio2] = fechaFin.split('/');
        const fechaInicioDate = new Date(`${anio}-${mes}-${dia}T00:00:00`);
        const fechaFinDate = new Date(`${anio2}-${mes2}-${dia2}T24:00:00`);
   
		if (fechaActual >= fechaInicioDate && fechaActual <= fechaFinDate) {
	

            return (

                // Render
                <>
                <ActiveColumn
                    active={data.modificacion!}
                    onActiveChange={async (newValue) => {
                    setSwitchValue(newValue);        // Guardamos valor del switch
                    setActiveRowId(data.id);         // Guardamos ID para luego usarlo
                    //cargamos el listado de fechas segun seleccion
                    const response = await DetalleDestinoModuleService.getRangoFechas(data.id);

                    if (response.success) {
                        const data = response?.rows;
                        if (Array.isArray(data)) {
                        setRangoFechas(data);
                        } else {
                        setRangoFechas([]);
                        }
                    }

                    setOpenModal(true);              // Abrimos el modal
                    return Promise.resolve();        // Para cumplir con la promesa esperada
                    }}
                />

                <ModalPersonalizadoDialog
                    open={openModal}
                    mainMessage='Esta seguro de MODIFICAR el memorandum?'
                    obs = {ENUM_CON_SIN_OBSERVACIONES}
                    message='Una vez modificado el memorandum se enviara al area de RR.HH. para su revision lo que implica que no podra volver a modificarlo'
                    rangoFechas= {rangoFechas}
                    onClose={() => setOpenModal(false)}
                    onConfirm={async (estadoModif, observaciones) => {

                    const result = await MemorandumModuleService.setActiveMemorandum(activeRowId!, switchValue, rangoFechas, observaciones,estadoModif );
                    if (!result.success) return notify.error(result.msg);
                    notify.success('Estado actualizado exitosamente');
                    setOpenModal(false);
                    tableRef.current?.refresh();

                    }}
                />
                </>

          
            );

        } else {
            return <>{'-'}</>;
        }
    }

      function renderModificacionStatus(data: MemorandumTableModel): ReactElement {
           const color = 'white';
           const estado = data.estado_modificacion === SIN_OBSERVACION?SIN_OBSERVACION:OBSERVADO;
           const background = data.estado_modificacion != OBSERVADO? ESTADO_O[0] : ESTADO_O[1];
           return <StatusColumn status={estado} color={color} background={background} />;
       }


    function renderColumnActions(data: MemorandumTableModel): ReactElement {
        if(ESTADOS_SOLO_VISTA.includes(data.estado_memorandum)) return(
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
            />
        );

         if(ROLES_EDICION.includes(authUser.roles)) return(
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
                deleteMessage={
                    <div>
                        <div><b>¿Quiere eliminar el registro? </b><br></br>
                        Tome en cuenta de que si elimina el registro, NO deben existir memorandum posteriores para no afectar la consecutividad de los cites y reutilizar el cite a eliminar.</div>
                        <br/>
                        <div>
                         {/*data.sigla y data.nombre <strong>Nombre: </strong> {data.cod_depart_memo +' - '+data.id}*/}
                            <strong>Codigo: </strong> {data.cod_depart_memo}<br></br>
                            <strong>Fecha Creacion Memorandum: </strong> {' - '+data.fecha_memo_format}<br></br>
                            <strong>Usuario Memorandum: </strong> {' - '+data.usuario_nombre}
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return MemorandumModuleService.destroyMemorandum(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Memorandum eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
         )
          if(authUser.roles === ENUM_IS_SUPERADMINISTRADOR) return(
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
               deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro? Por favor tome en cuenta que si elimina el registro es porque no existen registros aprobados posteriores a este registro</div>
                        <br />
                        <div>
                          
                            <strong>Codigo: </strong> {data.cod_depart_memo}<br></br>
                           <strong>Fecha Creacion Memorandum: </strong> {' - '+data.fecha_memo_format}<br></br>
                            <strong>Usuario Memorandum: </strong> {' - '+data.usuario_nombre}
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return MemorandumModuleService.destroyMemorandum(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Memorandum eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
         )
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
               // onEditClick={() => onEditClick(data.id)}
                
            />
        );
    }


        function renderColumnResponsable(tableModel: MemorandumTableModel): ReactElement {
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



    function renderColumnSolicitante(tableModel: MemorandumTableModel): ReactElement {
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
    const valoresFinales: string[] = [];

    todasLasOpciones.forEach((opcion) => {
        const valor = String(opcion.value); // 🔧 conversión a string segura
        /*if (!valoresUnicos.has(valor)) {
            valoresUnicos.add(valor);
            valoresFinales.push(valor);
        }*/
       valoresFinales.push(valor);
    });

    return valoresFinales;
}
// Cambio de Memorandum a reposicion 

 //proceso de aprobacion

 const [openMemoRepo, setOpenMemoRepo] = useState<boolean>(false); 
 const [aproveIdNMemoRepo, setAproveIdNMemoRepo] = useState<DatosMessage>(); 
 const optionsVale = ENUM_ESTADOS_MEMOREPO.map((m) => m.value);
 function renderColumnChangeMemoRepo(data: MemorandumTableModel): ReactElement {

     if(data.tipo_memo_repo === REPOSICION ) return (<> - </>);
     return (
         <>
             <ConfirmDialog
                 title={' Confirmar Cambio de Memorandum a Reposicion'}
                 message={
                    <span>
                   Se realizara el cambio del tipo de Memorandum a Reposicion, una vez cambiado no se podra revertir el cambio
                    <br />
                    Nombre Beneficiario:  {aproveIdNMemoRepo?.nombre_usuario}
                    <br />
                    Nº Memo: {aproveIdNMemoRepo?.cod_memo}
                    <br />
                    Nº Recibo:  {aproveIdNMemoRepo?.tipo_comision_idp}
                    <br />
                    ¿esta usted seguro?
                    </span>
                    }
                 open={openMemoRepo}
                 onAccept={async () => {
                     return MemorandumModuleService.setCambioMemoRepo(aproveIdNMemoRepo?.id!, REPOSICION).then((result) => {
                         if (!result.success) return notify.error(result.msg);
                         notify.success('Se actualizo exitosamente');
                         setOpenMemoRepo(false);
                         tableRef.current?.refresh();
                     });
                 }}
                 onCancel={() => { isMounted() && setOpenMemoRepo(false); tableRef.current?.refresh(); }}
             />
            
            <ChangeStateColumn
                 data={data.tipo_memo_repo}
                 options={optionsVale}
                 onChange={async (newValue: any) => {

                     if(newValue===REPOSICION) {
                        setOpenMemoRepo(true)
                        setAproveIdNMemoRepo({id:data.id, nombre_usuario: data.usuario_nombre, cod_memo: data.cod_depart_memo,tipo_comision_idp: data.tipo_comision_idp});
                     }
                     else
                         return MemorandumModuleService.setCambioMemoRepo(data.id, newValue).then((result) => {
                             if (!result.success) return notify.error(result.msg);
                             notify.success('Se actualizo exitosamente');
                             tableRef.current?.refresh();
                         });
                 }}
             />
         </>
     );
 }
 
   //cambio de color estado
    function renderColumnStatusMemoRepo(data: MemorandumTableModel): ReactElement {
        const estado = data.tipo_memo_repo;
        const color = 'white';
        const background = ESTADO_TIPO_MEMO_REPO[estado];
        const texto = estado;
        return <StatusColumn status={texto} color={color} background={background} />;
    }


     //cambio de color si tiene resolucion
    function renderColumnStatusResolucion(data: MemorandumTableModel): ReactElement {
        const estado = data.resolucion!;
        const color = 'white';
        const background = ESTADO_TIPO_RESOLUCION[estado];
        const texto = estado;
        return <StatusColumn status={texto} color={color} background={background} />;
    }
//Fin cambio de memorandum a reposision 

    //proceso de aprobacion
    const [openAnulacion, setOpenAnulacion] = useState<boolean>(false);
    const [openRechazo, setOpenRechazo] = useState<boolean>(false);
      const [openVencido, setOpenVencido] = useState<boolean>(false);
    const [justificacion, setJustificacion] = useState("");
     const [anulacionId, setAnulacionId] = useState<DatosMessage>();
    const [open2, setOpen2] = useState<boolean>(false);
    const [aproveId, setAproveId] = useState<DatosMessage>();
   // const optionsVale = ENUM_ESTADOS_H.map((m) => m.value);
   // const optionsJefes = ENUM_ESTADOS_APROBADOS.map((m)=>m.value);
    const optionsRrhh = ENUM_ESTADOS_APROBADOS_RRHH.map((m) => m.value);
    const optionsSdafp = ENUM_ESTADOS_APROBADOS_SDAFP.map((m) => m.value);

    function renderColumnChange(data: MemorandumTableModel): ReactElement {
       const isComplete = data.cantidad_dias === data.conteo_dias_detalle;      
       // Define el color del botón basado en si los valores están completos
       const buttonColor =  isComplete ? 'info' : 'error';
      // Define el mensaje a mostrar si los datos no están completos
       const message = !isComplete ? 'Los datos no están completos (Revisar Destinos)' : 'Datos completos - Destinos Completos';
       
        const optionsJefesMemo = combinarOpciones(data.lista_select_jefes!,ENUM_ESTADOS_APROBADOS);
		
        /**Verifica tipo de jefe */
        const vistaJefes =  optionsJefesMemo.filter(optionsJefesMemo => {
			
			
            if (optionsJefesMemo === PENDIENTE || optionsJefesMemo === RECHAZADO) {
            return true;
            }
            //consideraciones especiales para el jefe de gabinete
           // if (authUser.cargo.includes(SECRETARIO) || authUser.cargo === JEFE_GABINETE) {
			//consideraciones especiales para el gobernador	        
            if (authUser.cargo.includes(SECRETARIO) || authUser.cargo.includes(GOBERNADOR) 
                || authUser.cargo === JEFE_GABINETE || authUser.cargo === JEFE_COMUNICACION
                || authUser.cargo.includes(ASESOR)) {			
                return optionsJefesMemo === APROBADO_SECRETARIO;
            }else{              
                return optionsJefesMemo != APROBADO_SECRETARIO;
            }           
        });	
       
        /**fin verifica tipo de jefe */		
     
        if (ROLES_ENCARGADO_ADMIN.includes(authUser.roles)){
            if (ESTADOS_BLOQUEADO_ENCARGADO.includes(data.estado_memorandum)){
                return <>{'-'}</>;
            }

        }
     
            if(ROLES_TECNICOS_VIATICOS.includes(authUser.roles)){
                 if(ESTADOS_BLOQUEADOS_CONTA.includes(data.estado_memorandum)){return <>{'-'}</>;}
                return (
                    <>
                          <ConfirmDialog
                            title={'Confirmar APROBACION'}
                            message={
                                <span>
                                Si usted es el SECRETARIO(A), esta seguro de APROBAR el memorandum? Una vez APROBADO pasara a RR.HH. para su revision y ya no podra editar el Memorandum
                                , con la APROBACION del Secretario esta determinando que este documento fue aprobado por la jerarquia de jefes anteriores - No olvide Revisar que los destinos esten bien establecidos
                                <br />
                                Nombre Beneficiario:  {aproveId?.nombre_usuario}
                                <br />
                                Nº Memo: {aproveId?.cod_memo}
                                <br />
                                tipo comision:  {aproveId?.tipo_comision_idp}
                                <br />
                                ¿esta usted seguro?
                                </span>
                            }
                            open={open2}
                            onAccept={async () => {

                                return MemorandumModuleService.setAprobadoMemorandum(aproveId?.id!,APROBADO_SECRETARIO).then((result) => {
                                    if (!result.success) return notify.error(result.msg);
                                    notify.success('Se actualizo exitosamente');
                                    setOpen2(false);
                                    tableRef.current?.refresh();
                                });
                            }}
                            onCancel={() => { isMounted() && setOpen2(false); tableRef.current?.refresh(); }}
                        />
                           <ConfirmDialog
                                title={' Confirmar RECHAZADO'}
                                message={
                                    <span>
                                    El RECHAZO del Memorandum, inhabilitara el pago de viaticos y pasajes, este memorandum se Rechazara y terminara su proceso en este punto. 
                                    <br />
                                    Nombre Beneficiario:  {aproveId?.nombre_usuario}
                                    <br />
                                    Nº Memo: {aproveId?.cod_memo}
                                    <br />
                                    Tipo de Comision:  {aproveId?.tipo_comision_idp}
                                    <br /><br />
                                    <b>Ingrese el motivo o justificación del rechazo o inabilitacion:</b>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={justificacion}
                                        onChange={(e) => setJustificacion(e.target.value)}
                                    />

                                    <br />
                                    <b>¿esta usted seguro?</b>
                                    </span>
                                    }
                                open={openRechazo}
                                onAccept={async () => {
                                    if (!justificacion.trim()) {
                                        return notify.error("Debe ingresar el motivo o Justificacion del rechazo de Memorandum");
                                    }

                                    return MemorandumModuleService.setAprobadoMemorandum(aproveId?.id!, RECHAZADO, justificacion).then((result) => {
                                        if (!result.success) return notify.error(result.msg);
                                        notify.success('Se actualizo a Rechazado exitosamente');
                                        setJustificacion(""); // limpiar
                                        setOpenRechazo(false);
                                        tableRef.current?.refresh();
                                    });
                                }}
                                onCancel={() => { isMounted() && setOpenRechazo(false);setJustificacion(""); tableRef.current?.refresh(); }}
                            />
                       <ChangeStateColumn
                            data={data.estado_memorandum}
                            options={vistaJefes}
                            onChange={async (newValue: any) => {
                               
                                if(newValue===RECHAZADO) {
                                        setOpenRechazo(true)
                                        setAproveId({id:data.id, nombre_usuario: data.usuario_nombre, cod_memo: data.cod_depart_memo,tipo_comision_idp: data.tipo_comision_idp});
                                    }

                                //CONTROL DE DIAS
                                    const diasCompletos = data.cantidad_dias === data.conteo_dias_detalle;
                       
                                if (!diasCompletos) {
                                    notify.error(
                                        'Antes de APROBAR debe verificar el detalle del Destino. Destinos incompletos. Memorandum NO APROBADO.'
                                    );
                                    return; // detenemos TODO aquí
                                }

                                //  partir de aquí ya está validado para todos

                                const esSecretario =String(newValue).length === APROBADO_SECRETARIO.length;

                                if (esSecretario) {
                                    setOpen2(true);
                                    setAproveId({
                                        id: data.id,
                                        nombre_usuario: data.usuario_nombre,
                                        cod_memo: data.cod_depart_memo,
                                        tipo_comision_idp: data.tipo_comision_idp
                                    });

                                } else {

                                    MemorandumModuleService.setAprobadoMemorandum(data.id, newValue).then((result) => {
                                            if (!result.success) return notify.error(result.msg);
                                            notify.success('Se actualizó exitosamente');
                                            tableRef.current?.refresh();
                                        });

                                }
                                //
                            }}
                        />
                    </>
                );
            }
                //pestaña de aprobacion de recursos humanos
            if(authUser.roles === TECNICO_RRHH ){
                if(ESTADOS_BLOQUEADO_RRHH.includes(data.estado_memorandum)){return <>{'-'}</>;}
                    return (
                        <>
                              <ConfirmDialog
                                title={'Confirmar APROBACION'}
                                message={
                                    <span>
                                    Esta seguro de APROBAR el memorandum? Una vez VERIFICADO pasara a CONTABILIDAD-SDAFP para su revisión, aprobacion y respectivo pago - No olvide Revisar que los destinos esten bien establecidos
                                    <br />
                                    Nombre Beneficiario:  {aproveId?.nombre_usuario}
                                    <br />
                                    Nº Memo: {aproveId?.cod_memo}
                                    <br />
                                    tipo comision:  {aproveId?.tipo_comision_idp}
                                    <br />
                                    ¿esta usted seguro?
                                    </span>
                                }
                                open={open2}
                                onAccept={async () => {

                                    return MemorandumModuleService.setAprobadoMemorandum(aproveId?.id!,VERIFICADO_RRHH).then((result) => {
                                        if (!result.success) return notify.error(result.msg);
                                        notify.success('Se actualizo exitosamente');
                                        setOpen2(false);
                                        tableRef.current?.refresh();
                                    });
                                }}
                                onCancel={() => { isMounted() && setOpen2(false); tableRef.current?.refresh(); }}
                            />
                           <ConfirmDialog
                                title={' Confirmar RECHAZADO'}
                                message={
                                    <span>
                                    El RECHAZO del Memorandum, inhabilitara el pago de viaticos y pasajes, este memorandum se Rechazara y terminara su proceso en este punto. 
                                    <br />
                                    Nombre Beneficiario:  {aproveId?.nombre_usuario}
                                    <br />
                                    Nº Memo: {aproveId?.cod_memo}
                                    <br />
                                    Tipo de Comision:  {aproveId?.tipo_comision_idp}
                                    <br /><br />
                                    <b>Ingrese el motivo o justificación del rechazo o inabilitacion:</b>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={justificacion}
                                        onChange={(e) => setJustificacion(e.target.value)}
                                    />

                                    <br />
                                    <b>¿esta usted seguro?</b>
                                    </span>
                                    }
                                open={openRechazo}
                                onAccept={async () => {
                                    if (!justificacion.trim()) {
                                        return notify.error("Debe ingresar el motivo o Justificacion del rechazo de Memorandum");
                                    }

                                    return MemorandumModuleService.setAprobadoMemorandum(aproveId?.id!, RECHAZADO, justificacion).then((result) => {
                                        if (!result.success) return notify.error(result.msg);
                                        notify.success('Se actualizo a Rechazado exitosamente');
                                        setJustificacion(""); // limpiar
                                        setOpenRechazo(false);
                                        tableRef.current?.refresh();
                                    });
                                }}
                                onCancel={() => { isMounted() && setOpenRechazo(false);setJustificacion(""); tableRef.current?.refresh(); }}
                            />


                           <ChangeStateColumn
                                data={data.estado_memorandum}
                                options={optionsRrhh}
                                onChange={async (newValue: any) => {
                                    if(newValue===RECHAZADO) {
                                        setOpenRechazo(true)
                                        setAproveId({id:data.id, nombre_usuario: data.usuario_nombre, cod_memo: data.cod_depart_memo,tipo_comision_idp: data.tipo_comision_idp});
                                    }
                                    else if(String(newValue).length === VERIFICADO_RRHH.length){
                                        setOpen2(true);
                                        setAproveId({id:data.id, nombre_usuario: data.usuario_nombre, cod_memo: data.cod_depart_memo,tipo_comision_idp: data.tipo_comision_idp});
                                    }else{
                                        MemorandumModuleService.setAprobadoMemorandum(data.id, newValue).then((result) => {
                                            if (!result.success) return notify.error(result.msg);
                                            notify.success('Se actualizo exitosamente');
                                            tableRef.current?.refresh();});
                                    }
                                }}
                            />
                        </>
                    );
                }                  

       return (
            <>
                <ConfirmDialog
                                title={' Confirmar ANULACION'}
                                message={
                                    <span>
                                    La anulacion del Memorandum, inhabilitara el pago de viaticos y pasajes, este memorandum se Anulara y terminara su proceso en este punto. 
                                    <br />
                                    Nombre Beneficiario:  {aproveId?.nombre_usuario}
                                    <br />
                                    Nº Memo: {aproveId?.cod_memo}
                                    <br />
                                    Tipo de Comision:  {aproveId?.tipo_comision_idp}
                                    <br /><br />
                                    <b>Ingrese el motivo o justificación de anulación:</b>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={justificacion}
                                        onChange={(e) => setJustificacion(e.target.value)}
                                    />

                                    <br />
                                    <b>¿esta usted seguro?</b>
                                    </span>
                                    }
                                open={openAnulacion}
                                onAccept={async () => {
                                    if (!justificacion.trim()) {
                                        return notify.error("Debe ingresar el motivo o Justificacion de la anulación");
                                    }

                                    return MemorandumModuleService.setAprobadoMemorandum(aproveId?.id!, ANULADO, justificacion).then((result) => {
                                        if (!result.success) return notify.error(result.msg);
                                        notify.success('Se actualizo a Anulacion exitosamente');
                                        setJustificacion(""); // limpiar
                                        setOpenAnulacion(false);
                                        tableRef.current?.refresh();
                                    });
                                }}
                                onCancel={() => { isMounted() && setOpenAnulacion(false);setJustificacion(""); tableRef.current?.refresh(); }}
                            />
                    <ConfirmDialog
                                title={' Confirmar RECHAZADO'}
                                message={
                                    <span>
                                    El RECHAZO del Memorandum, inhabilitara el pago de viaticos y pasajes, este memorandum se Rechazara y terminara su proceso en este punto. 
                                    <br />
                                    Nombre Beneficiario:  {aproveId?.nombre_usuario}
                                    <br />
                                    Nº Memo: {aproveId?.cod_memo}
                                    <br />
                                    Tipo de Comision:  {aproveId?.tipo_comision_idp}
                                    <br /><br />
                                    <b>Ingrese el motivo o justificación del rechazo o inabilitacion:</b>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={justificacion}
                                        onChange={(e) => setJustificacion(e.target.value)}
                                    />

                                    <br />
                                    <b>¿esta usted seguro?</b>
                                    </span>
                                    }
                                open={openRechazo}
                                onAccept={async () => {
                                    if (!justificacion.trim()) {
                                        return notify.error("Debe ingresar el motivo o Justificacion del rechazo de Memorandum");
                                    }

                                    return MemorandumModuleService.setAprobadoMemorandum(aproveId?.id!, RECHAZADO, justificacion).then((result) => {
                                        if (!result.success) return notify.error(result.msg);
                                        notify.success('Se actualizo a Rechazado exitosamente');
                                        setJustificacion(""); // limpiar
                                        setOpenRechazo(false);
                                        tableRef.current?.refresh();
                                    });
                                }}
                                onCancel={() => { isMounted() && setOpenRechazo(false);setJustificacion(""); tableRef.current?.refresh(); }}
                            />
                   <ConfirmDialog
                                title={' Confirmar REPOSICION VENCIDA'}
                                message={
                                    <span>
                                    El memorandum pasara a estar VENCIDO por tanto se inhabilitara el pago de viaticos y pasajes, terminando su proceso en este punto. 
                                    <br />
                                    Nombre Beneficiario:  {aproveId?.nombre_usuario}
                                    <br />
                                    Nº Memo: {aproveId?.cod_memo}
                                    <br />
                                    Tipo de Comision:  {aproveId?.tipo_comision_idp}
                                    <br /><br />
                                    <b>Ingrese el motivo por la que el memorandum vencio y la fecha del cambio de estado a VENCIDO en formato 12/12/2000:</b>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={justificacion}
                                        onChange={(e) => setJustificacion(e.target.value)}
                                    />

                                    <br />
                                    <b>¿esta usted seguro?</b>
                                    </span>
                                    }
                                open={openVencido}
                                onAccept={async () => {
                                    if (!justificacion.trim()) {
                                        return notify.error("Debe ingresar el motivo o Justificacion del vencimiento del Memorandum");
                                    }

                                    return MemorandumModuleService.setAprobadoMemorandum(aproveId?.id!, REPOSICION_VENCIDA, justificacion).then((result) => {
                                        if (!result.success) return notify.error(result.msg);
                                        notify.success('Se actualizo a REPOSICION VENCIDA exitosamente');
                                        setJustificacion(""); // limpiar
                                        setOpenVencido(false);
                                        tableRef.current?.refresh();
                                    });
                                }}
                                onCancel={() => { isMounted() && setOpenVencido(false);setJustificacion(""); tableRef.current?.refresh(); }}
                            />



                  <ConfirmDialog
                    title={'Confirmar APROBACION'}
                    message={
                        <span>
                        Esta seguro de APROBAR el memorandum? Una vez APROBADO se generara el pago en Viaticos - No olvide Revisar que los destinos esten bien establecidos
                        <br />
                        Nombre Beneficiario:  {aproveId?.nombre_usuario}
                        <br />
                        Nº Memo: {aproveId?.cod_memo}
                        <br />
                        tipo comision:  {aproveId?.tipo_comision_idp}
                        <br />
                        ¿esta usted seguro?
                        </span>
                    }
                    open={open2}
                    onAccept={async () => {

                        return MemorandumModuleService.setAprobadoMemorandum(aproveId?.id!,APROBADO_CONTABILIDAD).then((result) => {
                            if (!result.success) return notify.error(result.msg);
                            notify.success('Se actualizo exitosamente');
                            setOpen2(false);
                            tableRef.current?.refresh();
                        });
                    }}
                    onCancel={() => { isMounted() && setOpen2(false); tableRef.current?.refresh(); }}
                />
               <ChangeStateColumn
                    data={data.estado_memorandum}
                    options={optionsSdafp}
                    onChange={async (newValue: any) => {
                        if(newValue===RECHAZADO) {
                                setOpenRechazo(true)
                                setAproveId({id:data.id, nombre_usuario: data.usuario_nombre, cod_memo: data.cod_depart_memo,tipo_comision_idp: data.tipo_comision_idp});
                            }
                        else if(newValue===ANULADO) {
                                setOpenAnulacion(true)
                                setAproveId({id:data.id, nombre_usuario: data.usuario_nombre, cod_memo: data.cod_depart_memo,tipo_comision_idp: data.tipo_comision_idp});
                            }
                            else if(newValue===REPOSICION_VENCIDA) {
                                setOpenVencido(true)
                                setAproveId({id:data.id, nombre_usuario: data.usuario_nombre, cod_memo: data.cod_depart_memo,tipo_comision_idp: data.tipo_comision_idp});
                            }
                        else if(String(newValue).length === APROBADO_CONTABILIDAD.length){
                            setOpen2(true);
                            setAproveId({id:data.id, nombre_usuario: data.usuario_nombre, cod_memo: data.cod_depart_memo,tipo_comision_idp: data.tipo_comision_idp});
                        }else{
                            MemorandumModuleService.setAprobadoMemorandum(data.id, newValue).then((result) => {
                                if (!result.success) return notify.error(result.msg);
                                notify.success('Se actualizo exitosamente');
                                tableRef.current?.refresh();});
                        }
                    }}
                />
            </>
        );
    }


    //cambio de color estado
    function renderColumnStatus(data: MemorandumTableModel): ReactElement {
        const estado = data.estado_memorandum;
        const color = 'white';
        const background = ESTADO_APROBADO_JEFE[estado];
        const texto = estado;
        return <StatusColumn status={texto} color={color} background={background} />;
    }


    function renderColumnOptions(data: MemorandumTableModel): ReactElement {

    const isComplete = data.cantidad_dias === data.conteo_dias_detalle && data.cantidad_dias != 0;	
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

    function renderImpresionOptions(data: ReporteMemorandumTableModel): ReactElement {
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
  const puedeCrearMemo =
  ROLES_EDICION.includes(authUser.roles)
 
    return (
        <>
            <DataTable
                ref={tableRef}
                headers={tableHeaders}
                updateParams={tableParams}
                onUpdate={handleUpdateTable}
                onActionAddClick={puedeCrearMemo?onAddClick:undefined}
                vScroll
            />
        </>
    );
};

export const MemorandumTable = forwardRef(MemorandumTableComponent);
