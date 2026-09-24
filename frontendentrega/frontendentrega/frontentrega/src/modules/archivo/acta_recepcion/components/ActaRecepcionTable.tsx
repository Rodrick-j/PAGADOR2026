import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { useIsMounted } from 'hooks/useIsMounted';
//components
import { TableHeader, UpdateParams, HeaderFilter, OnUpdateOptions, DataTableRefProps, DataTable, ActionColumn } from 'components/core/DataTable';
//@mui
import { Box, CircularProgress, IconButton, Tooltip, Typography } from '@mui/material';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import ApprovalIcon from '@mui/icons-material/Approval';
import ListAltIcon from '@mui/icons-material/ListAlt';
//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { ActaRecepcionModuleService } from 'modules/archivo/acta_recepcion/ActaRecepcionModuleService';
import { MoreLessColumn } from 'components/core/DataTable/columns/MoreLessColumn';
//hooks

export type ActaRecepcionTableModel = {
    id            : string;
    cod_acta      : string;
    documentos    : string[];
    fecha_registro: string;
    area          : string;
    nombre        : string;
    sellado       : boolean;

    // para las columnas especiales
    actions: unknown;
    options?: unknown;
};

export type ActaRecepcionTableRefProps = {
    refresh: (updateParams?: UpdateParams<ActaRecepcionTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<ActaRecepcionTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};


const actaFilter: HeaderFilter = { type: 'text' };
const documentosFilter: HeaderFilter = { type: 'text' };
const areaFilter: HeaderFilter = { type: 'text' };
const nombreFilter: HeaderFilter = { type: 'text' };
const fechaFilter: HeaderFilter   = { type: 'date' };

type Props = {
    onAddClick     : () => void;
    onViewClick    : (idActaRecepcion: string) => Promise<void>;
    onEditClick    : (idActaRecepcion: string) => Promise<void>;
    onSellarClick  : (idActaRecepcion: string) => Promise<void>;
    onDetalleClick : (idActaRecepcion: string) => void;
    onImprimirClick: (data: ActaRecepcionTableModel) => void;
    loading        : string;
};

export const ActaRecepcionTableComponent = (props: Props, ref: React.Ref<ActaRecepcionTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick, onImprimirClick, onSellarClick, onDetalleClick, loading } = props;
    const notify    = useNotify();
    const isMounted = useIsMounted();

    const [tableParams, setTableParams] = useState<UpdateParams<ActaRecepcionTableModel>>(tableParamsInitialize);
    const tableRef                      = useRef<DataTableRefProps>(null);

    const tableHeaders: TableHeader<ActaRecepcionTableModel>[] = [
        { id: 'actions', label: 'Acciones', render: renderColumnActions, sort: false },
        { id: 'cod_acta', label: 'Codigo Acta', sort: false, align: 'left', filter: actaFilter },
        { id: 'documentos', label: 'Documentos', sort: false, align: 'left', filter: documentosFilter, render: renderColumnDocumentos },
        { id: 'area', label: 'Secretaria/Area/Unidad', sort: false, align: 'left', filter: areaFilter },
        { id: 'nombre', label: 'Nombre', sort: false, align: 'left', filter: nombreFilter },
        { id: 'fecha_registro', label: 'Fecha Registro', sort: false, align: 'left', filter: fechaFilter },
        {
            id: 'options',
            label: 'Opciones',
            sort: false,
            render: renderColumnOptions
        },
    ];

    const handleUpdateTable = (params: UpdateParams<ActaRecepcionTableModel>, opt: OnUpdateOptions) => {
        if (!isMounted()) return;
        const newParams = {
            ...params,
            filters: { ...params.filters },
        };
        opt.setLoading(true);
        ActaRecepcionModuleService.getTableActaRecepcion(newParams as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<ActaRecepcionTableModel> = {
                ...params,
                rows: result.rows || [],
                count: result.count || 0
            };
            if (isMounted()) setTableParams(newTableParams);
        });
    };

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

    useEffect(() => {
        tableRef.current?.refresh();
    }, [tableRef]);

    useImperativeHandle(ref, tableRefHandler, [tableParams]);



    function renderColumnDocumentos(data: ActaRecepcionTableModel): ReactElement {
        const texto = data.documentos.map((a: any, index) => a.nro).join(' | ');
        if(texto.length > 150)
            return (
                <MoreLessColumn  text={texto} />
            );
        return (<>{texto}</>)
    }
    function renderColumnOptions(data: ActaRecepcionTableModel): ReactElement {
        if(data.sellado)
        return (
            <IconButton disabled={loading===data.id} onClick={() => onImprimirClick(data)} color="primary">
                {loading===data.id ? <CircularProgress size={16}  />:<LocalPrintshopIcon />}
            </IconButton>
        );
        return (
            <Box display='inline-flex'>
                <Tooltip title="Detalle Documentos">
                    <IconButton size="small" onClick={() => onDetalleClick(data.id)} color="info">
                        <ListAltIcon />
                    </IconButton>
                </Tooltip>
                <IconButton disabled={loading===data.id} onClick={() => onSellarClick(data.id)} color="secondary">
                    {loading===data.id ? <CircularProgress size={16}  />:<ApprovalIcon />}
                </IconButton>
            </Box>
        );
    }

    function renderColumnActions(data: ActaRecepcionTableModel): ReactElement {
        if(data.sellado)
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
            />
        );
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
                deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro?</div>
                        <br />
                        <div>
                            <strong>Nro: </strong> {data.cod_acta }
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return ActaRecepcionModuleService.destroyActaRecepcion(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Documento eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    return (
        <>
            <DataTable
                ref={tableRef}
                headers={tableHeaders}
                updateParams={tableParams}
                onUpdate={handleUpdateTable}
                onActionAddClick={onAddClick}
                vScroll
            />
        </>
    );
};

export const ActaRecepcionTable = forwardRef(ActaRecepcionTableComponent);
