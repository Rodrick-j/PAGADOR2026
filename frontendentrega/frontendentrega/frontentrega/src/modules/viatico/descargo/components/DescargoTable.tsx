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
//model
import { DescargoModuleService } from 'modules/viatico/descargo/DescargoModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { BACKGROUND_1, ESTADO_A, ESTADO_E, ESTADO_J, ESTADO_K, ESTADO_L, ESTADO_TIPO_MEMO_REPO } from 'constants/colors';
import { ENUM_ESTADOS_DESCARGO, ENUM_ESTADOS_I, ENUM_ESTADOS_J } from 'constants/enums';
import { ConfirmDialog } from 'components/core/ConfirmDialog';
import { CheckCircleOutline } from '@mui/icons-material';

export type DescargoTableModel = {
    id                     : string;
    num_recibo             : string;
    fecha_descargo         : Date;
    estado_descargo        : string;
    viatico_pasaje_real    : number;
    monto_despositado      : number;
    monto_descargo         : number;
    saldo_descargo         : number;
    presenta_informe       : string;
    viatico_real : number;
    observacion_estado : string;
    observacion_descargo : string;
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
   liquido_pagable?          : number;
   fecha_ida?                : string;
   fecha_retorno?            : string;
   destino?                  : string;
   cod_memo?                 : string; 
   cantidad_dias?            : number;  
   imprimir?                 : string;
   tipo_memo_repo?           : string;
   fecha_descargo_format?    : string;
   estado_pago?              : string;
   fecha_anulacion_recibo?   : string;

};


export type DescargoTableRefProps = {
    refresh: (updateParams?: UpdateParams<DescargoTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<DescargoTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

export type DatosMessage = {
    id              : string;
    nombre_usuario  : string;
    cod_memo        : string;
    num_recibo      : string;

}

const nombresFilter: HeaderFilter = { type: 'text' };
const nombrePadreFilter: HeaderFilter = { type: 'text' };
const partidaFilter: HeaderFilter = { type: 'text' };
const estadosFilter: HeaderFilter = { type: 'select',options: ENUM_ESTADOS_I};
const informeFilter: HeaderFilter = { type: 'select',options: ENUM_ESTADOS_J};
const fechaFilter: HeaderFilter = { type: 'date' };
const estadosDescargoFilter: HeaderFilter = { type: 'select',options: ENUM_ESTADOS_DESCARGO};


type Props = {
    onAddClick: () => void;
    onViewClick: (idDescargo: string) => Promise<void>;
    onEditClick: (idDescargo: string) => Promise<void>;
};

export const DescargoTableComponent = (props: Props, ref: React.Ref<DescargoTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<DescargoTableModel>>(tableParamsInitialize);
   
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<DescargoTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false, render:renderColumnActions },
        { id: 'num_recibo', label: 'Numero de Recibo Viatico', align: 'center', width: 140 ,filter: partidaFilter },//, render: renderColumnActiveder: renderColumnActions
        { id: 'tipo_memo_repo', label: 'Tipo de Memorandum', align: 'center', width: 140 , render: renderColumnStatusMemoRepo },//, render: renderColumnActiveder: renderColumnActions
        { id: 'usuario_nombre', label: 'Nombre de Usuario', align: 'center', width: 200,filter: partidaFilter },//,
        { id: 'usuario_ci', label: 'C.I.', align: 'center' ,filter: partidaFilter},//,
        { id: 'usuario_cargo', label: 'Cargo de Usuario', align: 'center', width: 220 },//,
        { id: 'cod_memo', label: 'Cod. Memo', align: 'center',filter: partidaFilter, width: 250},//, render: renderColumnPadre
        { id: 'fecha_ida' , label: 'Fecha Inicio Viaje', align: 'center',filter: fechaFilter},
        { id: 'fecha_retorno' , label: 'Fecha Retorno Viaje', align: 'center'},
        { id: 'destino' , label: 'Destino', align: 'center'},
        { id: 'cantidad_dias' , label: 'Cantidad de Dias', align:'center'},       
        { id: 'liquido_pagable', label: 'Liquido Pagable', align: 'center'},
        { id: 'fecha_descargo_format', label: 'Fecha Descargo', align: 'center',filter: fechaFilter},//, render: renderColumnActive      
        { id: 'viatico_pasaje_real', label: 'Viatico Pasaje Real', align: 'center' , width: 120},
        { id: 'viatico_real', label: 'Viatico Real', align: 'center' , width: 120},       
        { id: 'monto_descargo', label: 'Monto Descargo', align: 'center' },
        { id: 'saldo_descargo', label: 'Saldo Descargo', align: 'center' },//, render: renderColumnPadre
        { id: 'monto_despositado', label: 'Monto Depositado', align: 'center' },
        { id: 'observacion_estado', label: 'Tiene Observacion', align: 'center' , width: 120},
        { id: 'observacion_descargo', label: 'Descripcion Observacion', align: 'center' , width: 180},
        { id: 'presenta_informe', label: 'Presenta Informe', align: 'center', render:renderColumnChangeDescargaInforme, filter:informeFilter },//, render: renderColumnStatus
        { id: 'estado_descargo', label: 'Descarga', align: 'center', width: 150, render:renderColumnChangeDescarga, filter:estadosFilter},
      //  { id: 'prorroga', label: 'Prorroga', align: 'center' },//, render: renderColumnStatus
        
        { id: 'tiempo_descargo', label: 'Tiempo Descargo', align: 'center' ,filter: partidaFilter },//, render: renderColumnStatus
       
        { id: 'notificacion_descargo', label: 'Notificaciones Descargo', align: 'center',render:renderColumnStatusDias},//, render: renderColumnStatus 
        { id: 'activo', label: 'Estado', align: 'center', render:renderColumnStatus,width: 220},//, render: renderColumnStatus 
        { id: 'estado_pago', label: 'Estado Pago Viatico', align: 'center', render: renderColumnStatusViatico,width: 150},
        { id: 'fecha_anulacion_recibo', label: 'Fecha Anulacion Recibo', align: 'center',filter: fechaFilter},//, render: renderColumnActive   
      //  { id: 'imprimir', label: 'imprimir', align: 'center'},//, render: renderColumnStatus 
    ];

    const handleUpdateTable = (params: UpdateParams<DescargoTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        DescargoModuleService.getTableDescargo(params as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<DescargoTableModel> = {
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

    function renderColumnActive(data: DescargoTableModel): ReactElement {
        return (
            <ActiveColumn
                active={data.activo}
                onActiveChange={async (newValue: any) => {
                    return DescargoModuleService.setActiveDescargo(data.id, newValue).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Estado actualizado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    //cambio de color estado
        function renderColumnStatusMemoRepo(data: DescargoTableModel): ReactElement {
            const estado = data.tipo_memo_repo;
            const color = 'white';
            const background = ESTADO_TIPO_MEMO_REPO[estado!];
            const texto = estado;
            return <StatusColumn status={texto!} color={color} background={background} />;
        }

    function renderColumnActions(data: DescargoTableModel): ReactElement {
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
             
            />
        );
    }
    //cambio de color estado
     function renderColumnStatusViatico(data: DescargoTableModel): ReactElement {
         const color = 'white';
         const background = ESTADO_E[data.estado_pago!];
         return <StatusColumn status={data.estado_pago!} color={color} background={background} />;
     }
    

    function renderColumnStatus(data: DescargoTableModel): ReactElement {
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

    function renderColumnStatusDias(data: DescargoTableModel): ReactElement {
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

    function renderColumnPadre(data: DescargoTableModel): ReactElement {
        // se cambia data.padre por activo pero se debe verificar la funcionalidad
        const padre = data.activo?'SI':'NO';
        return <StatusColumn status={padre} background={BACKGROUND_1}/>;
    }
//construir estos metodos de descargo e informes en el backend
     const [open2, setOpen2] = useState<boolean>(false);
     const optionsVale = ENUM_ESTADOS_I.map((m) => m.value);
     const [descargaId, setDescargaId] = useState<DatosMessage>();
     function renderColumnChangeDescarga(data: DescargoTableModel): ReactElement {
        if(data.estado_descargo==='DESCARGADO') return (<CheckCircleOutline  sx={{ color: 'green' }}/>);
         return (
             <>
                 <ConfirmDialog
                     title={'Confirmar'}
                     message={
                        <span>
                            Realizara la DESCARGA del Viatico, ¿esta usted seguro? 
                            <br />
                            Nombre Beneficiario:  {descargaId?.nombre_usuario}
                            <br />
                            Nº Memo: {descargaId?.cod_memo}
                            <br />
                            Nº Recibo:  {descargaId?.num_recibo}
                        </span>                      
                     }
                     open={open2}
                     onAccept={async () => {
                         return DescargoModuleService.setAprobadoDescargo(descargaId?.id!, 'DESCARGADO').then((result) => {
                             if (!result.success) return notify.error(result.msg);
                             notify.success('El DESCARGO se realizo correctamente!'+
                                '\n'+'Nombre Beneficiario: '+descargaId?.nombre_usuario+
                            '\n'+'Nº Memo: '+descargaId?.cod_memo+
                        '\n'+'Nº Recibo: '+descargaId?.num_recibo);
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
                         if(newValue==='DESCARGADO'){
                            setOpen2(true);
                            setDescargaId({ id: data.id, nombre_usuario: data.usuario_nombre, cod_memo: data.cod_memo!, num_recibo: data.num_recibo });
                         }                            
                         else{
                            return DescargoModuleService.setAprobadoDescargo(data.id, newValue).then((result) => {
                                if (!result.success) return notify.error(result.msg);
                                notify.success('Se actualizo exitosamente');
                                tableRef.current?.refresh();
                            });
                         }
                            
                     }}
                 />
             </>
         );
     }

     const [open1, setOpen1] = useState<boolean>(false);
     const optionsVale1 = ENUM_ESTADOS_J.map((m) => m.value);
     const [presentaId, setPresentaId] = useState<DatosMessage>();
     function renderColumnChangeDescargaInforme(data: DescargoTableModel): ReactElement {
         if(data.presenta_informe==='PRESENTA') return (<CheckCircleOutline  sx={{ color: 'green' }}/>);
         return (
             <>
                 <ConfirmDialog
                     title={'Confirmar'}
                     message={
                        <span>
                        Realizara la APROBACION de la presentacion del INFORME del Viatico
                        <br />
                        Nombre Beneficiario:  {presentaId?.nombre_usuario}
                        <br />
                        Nº Memo: {presentaId?.cod_memo}
                        <br />
                        Nº Recibo:  {presentaId?.num_recibo}
                        <br />
                        ¿esta usted seguro?
                        </span> 
                     }
                     open={open1}
                     onAccept={async () => {
                         return DescargoModuleService.setAprobadoInforme(presentaId?.id!, 'PRESENTA').then((result) => {
                             if (!result.success) return notify.error(result.msg);
                             notify.success('La presentacion del informe se realizo de manera correcta' +
                                '\n'+'Nombre Beneficiario: '+presentaId?.nombre_usuario+
                            '\n'+'Nº Memo: '+presentaId?.cod_memo+
                        '\n'+'Nº Recibo: '+presentaId?.num_recibo
                        );
                             setOpen1(false);
                             tableRef.current?.refresh();
                         });
                     }}
                     onCancel={() => { isMounted() && setOpen1(false); tableRef.current?.refresh(); }}
                 />
                 <ChangeStateColumn
                     data={data.presenta_informe}
                     options={optionsVale1}
                     onChange={async (newValue: any) => {
                        if(newValue==='PRESENTA'){
                            setOpen1(true);
                            setPresentaId({ id: data.id, nombre_usuario: data.usuario_nombre, cod_memo: data.cod_memo!, num_recibo: data.num_recibo });
                        } 
                         else{
                            return DescargoModuleService.setAprobadoInforme(data.id, newValue).then((result) => {
                                if (!result.success) return notify.error(result.msg);
                                notify.success('Se actualizo exitosamente');
                                tableRef.current?.refresh();
                            });
                         }
                             
                     }}
                 />
             </>
         );
     }
 

    return (
        <>
            <DataTable
                ref={tableRef}
                headers={tableHeaders}
                updateParams={tableParams}
                onUpdate={handleUpdateTable}
              //  onActionAddClick={onAddClick}
                vScroll
            />
        </>
    );
};

export const DescargoTable = forwardRef(DescargoTableComponent);
