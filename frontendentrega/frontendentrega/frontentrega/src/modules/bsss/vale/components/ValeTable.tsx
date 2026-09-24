import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, ActionColumn, OnUpdateOptions, DataTableRefProps, StatusColumn } from 'components/core/DataTable';
//@mui
import { Alert, Box, CircularProgress, IconButton } from '@mui/material';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import { CSSProperties } from '@mui/material/styles/createMixins';
//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { ValeModuleService } from 'modules/bsss/vale/ValeModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { fCurrency } from 'utils/formatNumber';
import { ValeTableItem } from './ValeTableItem';
import { ESTADO_E } from 'constants/colors';

export type ValeTableModel = {
    id           : string;
    cod_vale     : string;
    nombre       : string;
    num_apertura : string;
    placa        : string;
    tipo         : string;
    combustible  : string;
    litros       : string;
    fecha_emision: string;
    destino      : string;
    destinos     : string;
    otro_vehiculo: string;
    precio_total : string;
    observaciones: string;
    estado       : string;   
    // para las columnas especiales
    actions: unknown;
    options?: unknown;
    numero_recibo? : string;
};


export type ValeTableRefProps = {
    refresh: (updateParams?: UpdateParams<ValeTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<ValeTableModel> = {
    rows       : [],
    count      : 0,
    rowsPerPage: 5,
    page       : 1
};

const codValeFilter: HeaderFilter         = { type: 'text' };
const numValeFilter: HeaderFilter         = { type: 'text' };
const numAperturaValeFilter: HeaderFilter = { type: 'text' };
const placaValeFilter: HeaderFilter       = { type: 'text' };
const destinoValeFilter: HeaderFilter     = { type: 'text' };

type Props = {
    onAddClick       : () => void;
    onViewClick      : (idVale: string) => Promise<void>;
    onEditClick      : (idVale: string) => Promise<void>;
    onImprimirClick  : (data: ValeTableModel) => void;
    habilitado       : boolean;
    estadoPresupuesto: boolean;
    loading          : string;
};

export const ValeTableComponent = (props: Props, ref: React.Ref<ValeTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick, onImprimirClick, loading, habilitado, estadoPresupuesto } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();

    const [tableParams, setTableParams] = useState<UpdateParams<ValeTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<ValeTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false, render: renderColumnActions, width: 180 },
        {
            id: 'options',
            label: 'Opciones',
            sort: false,
            render: renderColumnOptions,
            width: 70,
        },
        { id: 'cod_vale', label: 'Cod. Vale', align: 'left', filter: codValeFilter },
        { id: 'numero_recibo', label: 'Nº Vale Manual', align: 'left', filter: numValeFilter },
        { id: 'num_apertura', label: 'Apertura Prog.', align: 'left', filter: numAperturaValeFilter },
        { id: 'otro_vehiculo', label: 'Vehiculo', align: 'left' },
        { id: 'placa', label: 'Placa', align: 'left', filter: placaValeFilter },
        { id: 'tipo', label: 'Tipo', align: 'left'},
        { id: 'combustible', label: 'Combustible', align: 'left' },
        { id: 'litros', label: 'Litros', align: 'left' },
        { id: 'fecha_emision', label: 'Fecha Carga', align: 'left' },
        { id: 'destino', label: 'Destino', align: 'left', filter: destinoValeFilter },
        { id: 'precio_total', label: 'Precio Total', align: 'left', render: renderColumnPrecioTotal },
        { id: 'estado', label: 'Estado', align: 'left', render: renderColumnStatus },
        
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
        return <Box sx={{ textAlign: 'left', color: color, textDecoration: styleFont }}>{precioTotal}</Box>;
    }

    function renderColumnActions(data: ValeTableModel): ReactElement {
        if(data.estado==='APROBADO' || data.estado==='ANULADO') return(
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
            />
        );

        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
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

    function renderColumnOptions(data: ValeTableModel): ReactElement {
        return (
            <IconButton disabled={loading===data.id} onClick={() => onImprimirClick(data)} color="warning">
                {loading===data.id ? <CircularProgress size={16}  />:<LocalPrintshopIcon />}
            </IconButton>
        );
    }

    function renderColumnStatus(data: ValeTableModel): ReactElement {
        const color = 'white';
        const background = ESTADO_E[data.estado];
        return <StatusColumn status={data.estado} color={color} background={background} />;
    }

    function renderMobileComponent(data: ValeTableModel) {
        return (
            <ValeTableItem
                data={data}
                refresh={() => tableRef.current?.refresh()}
                onImprimirClick={() => onImprimirClick(data)}
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
                onDeleteClick={() => {
                    ValeModuleService.destroyVale(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success(result.msg);
                        tableRef.current?.refresh();
                    });
                }}
                loading={loading}
            />
        );
    }
    if(!habilitado)
        return (
            <Alert variant="outlined" severity="warning" sx={{ my: 1 }}>
                El usuario esta  <strong>INHABILITADO</strong> en la presente gestión <br /> para realizar vales de combustible, por favor comuniquese con el Area de sistemas ATI.
            </Alert>
        )
    return (
        <>
            {
                !estadoPresupuesto && <Alert variant="outlined" severity="error" sx={{ my: 1 }}>
                    La asignacion para combustibles <strong>NO CUENTA CON PRESUPUESTO</strong> <br /> para realizar vales de combustible, por favor comuniquese con el Area de sistemas ATI.
                </Alert>
            }
            <DataTable
                ref={tableRef}
                headers={tableHeaders}
                updateParams={tableParams}
                onUpdate={handleUpdateTable}
                onActionAddClick={onAddClick}
                mobileComponent={renderMobileComponent}
                vScroll
            />
        </>
    );
};

export const ValeTable = forwardRef(ValeTableComponent);
