import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, StatusColumn, ActionColumn, ChangeStateColumn, OnUpdateOptions, DataTableRefProps } from 'components/core/DataTable';
import { ConfirmDialog } from 'components/core/ConfirmDialog';
//@mui
import { Box, CircularProgress, IconButton,Tooltip,Typography } from '@mui/material';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { ValeModuleService } from 'modules/bsss/vale_admin/ValeAdminModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { useSession } from 'hooks/session';
//utils/constants
import { fCurrency } from 'utils/formatNumber';
import {  ESTADO_E, ESTADO_EJECUTADO } from 'constants/colors';
import { ANULADO, APROBADO, EJECUTADO, ENUM_EJECUTADO, ENUM_ESTADOS_B, ENUM_IS_SUPERADMINISTRADOR, PENDIENTE, RECHAZADO } from 'constants/enums';

export type ValeTableModel = {
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
    ejecutado?    : string;

    litros_reales?  : number;
    precio_real?    : number;
    numero_factura? : number;
    fecha_factura?  : Date;
    estado_ejecutado?: string;  
    numero_recibo?  : number; 
    
    // para las columnas especiales
    actions: unknown;
};
export type  DatosMessage = {
    id              : string;
    cod_vale        : string;
    numero_recibo   : number;
    num_apertura    : string;
    placa           : string;    
    combustible     : string;
    litros          : string;
    precio_total    : string;
    litros_reales   : number;
    precio_real     : number;
    numero_factura  : number;
    fecha_factura   : Date;
   
}

export type ValeTableRefProps = {
    refresh: (updateParams?: UpdateParams<ValeTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<ValeTableModel> = {
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
const ejecutadoFilter: HeaderFilter    = { type   : 'select', options: ENUM_EJECUTADO };

type Props = {
    onAddClick      : () => void;
    onViewClick     : (idVale: string) => Promise<void>;
    onEditClick     : (idVale: string) => Promise<void>;
    onImprimirClick  : (data: ValeTableModel) => void;
    onDownloadClick?: () => void;
    loading         : boolean;
    loading1        : string;
};

export const ValeTableComponent = (props: Props, ref: React.Ref<ValeTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick, onDownloadClick, onImprimirClick, loading, loading1 } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const authUser = useSession();
    const es_super_administrador = authUser.roles === ENUM_IS_SUPERADMINISTRADOR;
    const optionsVale = ENUM_ESTADOS_B.map((m) => m.value);
    const optionsValeEjecutado = ENUM_EJECUTADO.map((m) => m.value);

    const [idVale, setIdVale] = useState<string>('');
    const [tableParams, setTableParams] = useState<UpdateParams<ValeTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<ValeTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false, render: renderColumnActions },
        { id: 'estado', label: 'Aprobar', align: 'center', render: renderColumnChange, filter: estadoFilter },
        { id: 'estado_ejecutado', label: 'Ejecutado', align: 'center',  render: renderColumnChangeEjecutado,  filter: ejecutadoFilter },
        { id: 'fecha_validez', label: 'Fecha Carga', align: 'left', filter: fechaCargaFilter },
        { id: 'cod_vale', label: 'Cod. Vale', align: 'left', filter: codValeFilter },
        { id: 'num_apertura', label: 'Apertura Prog.', align: 'left', filter: aperturaFilter },
        { id: 'placa', label: 'Placa', align: 'left', filter: placaFilter },
        { id: 'tipo', label: 'Tipo', align: 'left'},
        { id: 'combustible', label: 'Combustible', align: 'center' },
        { id: 'litros', label: 'Litros', align: 'right' },
        { id: 'litros_reales', label: 'Litros reales', align: 'center',  },
        { id: 'destino', label: 'Destino', align: 'left', filter: destinoValeFilter },
        { id: 'precio_total', label: 'Precio Total', align: 'right', render: renderColumnPrecioTotal },
        { id: 'precio_real', label: 'Precio Real', align: 'center', render:renderColumnPrecioReal },
        { id: 'observaciones', label: 'Observacion', align: 'left' },
        { id: 'aprobado', label: 'Estado', align: 'left', render: renderColumnStatus },
        { id: 'ejecutado', label: 'Estado Ejecutado', align: 'center', render: renderColumnStatusEjecutado }
    ];

    const handleUpdateTable = (params: UpdateParams<ValeTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        ValeModuleService.getTableVale(params as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<ValeTableModel> = {
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

    function renderColumnPrecioTotal(data: ValeTableModel): ReactElement {
        const precioTotal = fCurrency(data.precio_total);
        const color = data.estado==='ANULADO'?'#FF4747':'black';
        const styleFont = data.estado==='ANULADO'?'line-through':'none';
        return <Box sx={{ textAlign: 'right', color: color, textDecoration: styleFont }}>{precioTotal}</Box>;
    }
     function renderColumnPrecioReal(data: ValeTableModel): ReactElement {
            const precioReal = fCurrency(data.precio_real);
            const color = data.estado==='ANULADO'?'#FF4747':'black';
            const styleFont = data.estado==='ANULADO'?'line-through':'none';
            return <Box sx={{ textAlign: 'right', color: color, textDecoration: styleFont }}>{precioReal}</Box>;
        }  

    const [open2, setOpen2] = useState<boolean>(false);

    function renderColumnChange(data: ValeTableModel): ReactElement {
        // if(data.estado_ejecutado === EJECUTADO || data.estado===APROBADO )  return <>{'-'}</>;
       //    if(data.estado_ejecutado === EJECUTADO  )  return <>{'-'}</>;
        if(data.estado_ejecutado === EJECUTADO || data.estado===APROBADO )  return <>{<IconButton disabled={loading1===data.id} onClick={() => onImprimirClick(data)} color="success">
                                                                                {loading1===data.id ? <CircularProgress size={16}  />:<LocalPrintshopIcon />}
                                                                            </IconButton>}</>;
        return (
            <Box display="flex" flexDirection="row" alignItems={'center'}>
                {
                    (data.estado==='APROBADO' || data.estado==='ANULADO') && <IconButton disabled={loading1===data.id} onClick={() => onImprimirClick(data)} color="success">
                                                                                {loading1===data.id ? <CircularProgress size={16}  />:<LocalPrintshopIcon />}
                                                                            </IconButton>
                }
                <ConfirmDialog
                    title={'Confirmar'}
                    message={'¿La anulacion del Vale, revertira el monto a su restante?'}
                    open={open2}
                    onAccept={async () => {
                        return ValeModuleService.setAprobadoVale(idVale, 'ANULADO').then((result) => {
                            if (!result.success) return notify.error(result.msg);
                            notify.success('Se actualizo exitosamente');
                            setOpen2(false);
                            tableRef.current?.refresh();
                        });
                    }}
                    onCancel={() => { isMounted() && setOpen2(false); tableRef.current?.refresh(); }}
                />
                {
                   data.estado!=='ANULADO' && <ChangeStateColumn
                        data={data.estado}
                        options={optionsVale}
                        onChange={async (newValue: any) => {
                            if(newValue==='ANULADO') {
                                setIdVale(data.id);
                                setOpen2(true);
                            }
                            else
                                return ValeModuleService.setAprobadoVale(data.id, newValue).then((result) => {
                                    if (!result.success) return notify.error(result.msg);
                                    notify.success('Se actualizo exitosamente');
                                    tableRef.current?.refresh();
                                });
                        }}
                    />
                }
            </Box>
        );
    }

    function renderColumnActions(data: ValeTableModel): ReactElement {
        if((data.estado==='ANULADO' || data.estado_ejecutado===EJECUTADO) && !es_super_administrador)
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
            />
        );

        return (
            <ActionColumn
                onViewClick={() =>  onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
               /* deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro?</div>
                        <br />
                        <div>
                            <strong>Nombre: </strong> {data.cod_vale}
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return ValeModuleService.destroyVale(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Vale eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}*/
            />
        );
    }

    function renderColumnStatus(data: ValeTableModel): ReactElement {
        const color = 'white';
        const background = ESTADO_E[data.estado];
        return <StatusColumn status={data.estado} color={color} background={background} />;
    }

     function renderColumnStatusEjecutado(data: ValeTableModel): ReactElement {
        const color = 'white';
        const background = ESTADO_EJECUTADO[data.estado_ejecutado!];
        return <StatusColumn status={data.estado_ejecutado!} color={color} background={background} />;
    }


    const [open3, setOpen3] = useState<boolean>(false);
     const [ejecutadoId, setEjecutadoId] = useState<DatosMessage>();
    function renderColumnChangeEjecutado(data: ValeTableModel): ReactElement {

        if(data.estado_ejecutado === EJECUTADO && data.estado===APROBADO )  return <>{ <Tooltip title={EJECUTADO} arrow>
                        <span>
                            <IconButton size="small" color={"success"}><CheckCircleIcon /> </IconButton>
                        </span>
                    </Tooltip>}</>;
        if(data.estado === PENDIENTE ||data.estado=== ANULADO||data.estado=== RECHAZADO  ||data.estado_ejecutado === EJECUTADO)  return <>{'-'}</>;
		
         const isComplete = data.litros_reales != null && data.precio_real != null  && data.numero_factura != null && data.litros_reales != 0 && data.precio_real != 0  && data.numero_factura != 0;
    
        // Define el color del botón basado en si los valores están completos
        const buttonColor =  isComplete ? 'success' : 'error';

        // Define el mensaje a mostrar si los datos no están completos
        const message = !isComplete ? 'Datos Reales Incompletos' : 'Datos reales Completos';    

        
        return (
            <Box display="flex" flexDirection="row" alignItems={'center'}>
               { 
                  (data.estado=== APROBADO || data.estado_ejecutado===PENDIENTE) &&(
                    <Tooltip title={message} arrow>
                        <span>
                            <IconButton
                                size="small"                                
                                color={buttonColor}
                            >
                                <CheckCircleIcon />
                            </IconButton>
                        </span>
                    </Tooltip>                    
                  )                      
                }
                {!isComplete && (
                     <Typography color={buttonColor} variant="caption" sx={{ ml: 1 }}>
                     </Typography>
                )}
                {isComplete && (
                     <Typography color={'#0ba766ff'} variant="caption" sx={{ ml: 1 }}>                   
                     </Typography>
                )}
                <ConfirmDialog
                    title={'Confirmar Ejecucion'}
                    message={
                             <span>
                               <b>EJECUCION del Vale </b>, esto significa que Usted ya ingreso los datos reales del vale de combustible. Al EJECUTAR el vale se procedera a descargar el monto de la Apertura General correspondiente.
                                <br />
                                <b>Codigo de Vale:</b>  {ejecutadoId?.cod_vale}
                                <br />
                                <b>Numero de Apertura:</b>  {ejecutadoId?.num_apertura}
                                <br />
                                <b>Litro Inicial:</b> {ejecutadoId?.litros}
                                <br />
                                <b>Litros Reales:</b>  {ejecutadoId?.litros_reales}                             
                                <br />
                                <b>Precio Inicial:</b>  {ejecutadoId?.precio_total}                               
                                <br />
                                <b>Precio Real:</b>  {ejecutadoId?.precio_real}
                                <br />
                                <b>Numero de Factura:</b>  {ejecutadoId?.numero_factura}
                                <br />
                                <b>¿esta usted seguro?</b>
                                </span>

                    }
                    open={open3}
                    onAccept={async () => {
                        return ValeModuleService.setEjecutadoVale(idVale, EJECUTADO).then((result) => {
                            if (!result.success) return notify.error(result.msg);
                            notify.success('Se actualizo exitosamente');
                            setOpen3(false);
                            tableRef.current?.refresh();
                        });
                    }}
                    onCancel={() => { isMounted() && setOpen3(false); tableRef.current?.refresh(); }}
                />
                {
                   data.estado_ejecutado!==EJECUTADO && <ChangeStateColumn
                        data={data.estado_ejecutado!}
                        options={optionsValeEjecutado}
                        onChange={async (newValue: any) => {
                            if (data.litros_reales != 0 && data.precio_real != 0 && data.numero_factura !=0 ) {
                                 if(newValue=== EJECUTADO) {                               
                                    setOpen3(true);
                                    setIdVale(data.id);
                                    setEjecutadoId({id: data.id, cod_vale:data.cod_vale, combustible:data.combustible, placa: data.placa, litros: data.litros, precio_total: data.precio_total,
                                        litros_reales: data.litros_reales!, precio_real: data.precio_real!, numero_factura: data.numero_factura!, fecha_factura: data.fecha_factura!,num_apertura: data.num_apertura,
                                        numero_recibo: data.numero_recibo!
                                 });
                                }
                                else
                                    return ValeModuleService.setEjecutadoVale(data.id, newValue).then((result) => {
                                        if (!result.success) return notify.error(result.msg);
                                        notify.success('Se actualizo exitosamente');
                                        tableRef.current?.refresh();
                                    });
                            }else{
                                 notify.error('Los datos del REGISTRO REAL deben actualizarse antes de realizar la EJECUCION');
                                // tableRef.current?.refresh();
                            }                           
                        }}
                    />
                }
            </Box>
        );
    }


    return (
        <>
            <DataTable
                ref={tableRef}
                headers={tableHeaders}
                updateParams={tableParams}
                onUpdate={handleUpdateTable}
                onDownloadClick={onDownloadClick}
                isLoading={loading}
                vScroll
            />
        </>
    );
};

export const ValeTable = forwardRef(ValeTableComponent);
