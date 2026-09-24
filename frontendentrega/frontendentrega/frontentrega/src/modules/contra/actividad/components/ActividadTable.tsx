import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, OnUpdateOptions, DataTableRefProps, ActiveColumn, StatusColumn } from 'components/core/DataTable';
//@mui
import { IconButton } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { ProcesoModuleService } from 'modules/contra/proceso';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { ESTADO_A, ESTADO_J } from 'constants/colors';
import { Block } from '@mui/icons-material';

export type ActividadTableModel = {
    id    : string;
    responsable           : string;
    solicitante           : string;
    juridica              : string;
    modalidad_descripcion : string;
    hoja_ruta             : string;
    codigo_interno_entidad: string;
    cuce                  : string;
    estado_activo         :string;

    // para las columnas especiales
    options?: unknown;
    activo?:unknown;
};


export type ActividadTableRefProps = {
    refresh: (updateParams?: UpdateParams<ActividadTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<ActividadTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const responsableConvocanteFilter: HeaderFilter = { type: 'text' };
const solicitanteConvocanteFilter: HeaderFilter = { type: 'text' };
const juridicaConvocanteFilter: HeaderFilter = { type: 'text' };
const cuceFilter: HeaderFilter = { type: 'text' };
const codigoFilter: HeaderFilter = { type: 'text' };
const hojaRutaFilter: HeaderFilter = { type: 'text' };
const nombreModalidadFilter: HeaderFilter = { type: 'text' };

type Props = {
    onDetalleClick: (idActividad: string) => void;
};

export const ActividadTableComponent = (props: Props, ref: React.Ref<ActividadTableRefProps>): ReactElement => {
    const { onDetalleClick } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<ActividadTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<ActividadTableModel>[] = [
        { id: 'responsable', label: 'Responsable Proceso (RPA - RPC)', align: 'left', filter: responsableConvocanteFilter, width: 250 },
        { id: 'solicitante', label: 'Tecnico Encargado de Seguimiento (TES)', align: 'left', filter: solicitanteConvocanteFilter, width: 250 },
        { id: 'juridica', label: 'Tecnico juridica', align: 'left', filter: juridicaConvocanteFilter, width: 250 },
        { id: 'modalidad_descripcion', label: 'Modalidad de contratacion', align: 'left', filter: nombreModalidadFilter },
        { id: 'hoja_ruta', label: 'Hoja de Ruta', align: 'left', filter: hojaRutaFilter, width: 180 },
        { id: 'codigo_interno_entidad', label: 'Codigo Interno', align: 'left', filter: codigoFilter, width: 180 },
        { id: 'cuce', label: 'CUCE', align: 'left', filter: cuceFilter, width: 180 },
        {
            id: 'options',
            label: 'Opciones',
            sort: false,
            render: renderColumnOptions
        },
       // { id: 'activo', label: 'Activo', align: 'center', width: 80, render: renderColumnActive },
        { id: 'estado_activo', label: 'Estado', align: 'left', render: renderColumnStatus, width: 120 },

    ];

    const handleUpdateTable = (params: UpdateParams<ActividadTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        ProcesoModuleService.getTableProceso(params as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<ActividadTableModel> = {
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

    function renderColumnOptions(data: ActividadTableModel): ReactElement {
        if(data.estado_activo==="CERRADO" ||data.estado_activo==="SUSPENDIDO") return(
            <IconButton size="small">
                    <Block />
                </IconButton>
        );  
        return (
            <>
                <IconButton size="small" onClick={() => onDetalleClick(data.id)} color="info">
                    <ListAltIcon />
                </IconButton>
            </>
        );
    }

     
    /*function renderColumnStatus(data: ActividadTableModel): ReactElement {
        const estado = data.estado_activo?'ACTIVO':'INACTIVO';	
        const color = 'white';
        const background = data.estado_activo? ESTADO_A[0] : ESTADO_A[1];		
        return <StatusColumn status={estado} color={color} background={background} />;
    }*/

    function renderColumnStatus(data: ActividadTableModel): ReactElement {
        const estado = data.estado_activo;
        const color = 'white';
        const background = ESTADO_J[estado];
        const texto = estado;
        return <StatusColumn status={texto} color={color} background={background} />;
    }
    

    return (
        <>
            <DataTable
                ref={tableRef}
                headers={tableHeaders}
                updateParams={tableParams}
                onUpdate={handleUpdateTable}
                vScroll
            />
        </>
    );
};

export const ActividadTable = forwardRef(ActividadTableComponent);
