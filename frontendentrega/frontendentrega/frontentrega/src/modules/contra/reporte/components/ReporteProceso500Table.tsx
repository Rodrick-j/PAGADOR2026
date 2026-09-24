import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, OnUpdateOptions, DataTableRefProps, StatusColumn } from 'components/core/DataTable';
//@mui

//services
import { QueryParams } from 'services/base/Types';
//model
import { ReporteProcesoModuleService } from '../ReporteProcesoModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { ENUM_ESTADOS_C } from 'constants/enums';
import { ESTADO_J } from 'constants/colors';


export type ReporteProceso500TableModel = {
    id                    : string;
    cuce                  : string;
    objeto_contratacion   : string;
    hoja_ruta             : string;
    codigo_interno_entidad: string;

    conclusion200         : string;
    conclusion220         : string;
    conclusion500         : string;

    fecha_cierre          : string;
    fecha_registro        : string;
    estado                : string;
    estado_activo         : string;
};

export type ReporteProceso500TableRefProps = {
    refresh: (updateParams?: UpdateParams<ReporteProceso500TableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<ReporteProceso500TableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};


const cuceFilter: HeaderFilter     = { type: 'text' };
const codigoFilter: HeaderFilter   = { type: 'text' };
const hojaRutaFilter: HeaderFilter = { type: 'text' };
const statusFilter: HeaderFilter  = { type: 'select', options: ENUM_ESTADOS_C };

type Props = {
    onDownloadClick?: () => void;
    loading         : boolean;
};

export const ReporteProceso500TableComponent = (props: Props, ref: React.Ref<ReporteProceso500TableRefProps>): ReactElement => {
    const { onDownloadClick, loading } = props;
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<ReporteProceso500TableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<ReporteProceso500TableModel>[] = [
        { id: 'objeto_contratacion', label: 'Objeto de la Contratacion', align: 'left', width: 280 },
        { id: 'cuce', label: 'CUCE', align: 'left', filter: cuceFilter },
        { id: 'codigo_interno_entidad', label: 'Codigo Interno', align: 'left', filter: codigoFilter },
        { id: 'hoja_ruta', label: 'Hoja de Ruta', align: 'left', filter: hojaRutaFilter },
        { id: 'fecha_registro', label: 'Fecha de Registro', align: 'left', width: 150 },
        { id: 'fecha_cierre', label: 'Fecha de Conclusion', align: 'left', width: 150 },
        { id: 'conclusion200', label: 'Conclusion - F200', align: 'center' },
        { id: 'conclusion220', label: 'Conclusion - F220', align: 'center' },
        { id: 'conclusion500', label: 'Conclusion - F500', align: 'center' },
        { id: 'estado', label: 'Estado', filter: statusFilter, align: 'left', render: renderColumnStatus },
    ];

    function renderColumnStatus(data: ReporteProceso500TableModel): ReactElement {
        const estado = data.estado_activo;
        const color = 'white';
        const background = ESTADO_J[estado];
        const texto = estado;
        return <StatusColumn status={texto} color={color} background={background} />;
    }

    const handleUpdateTable = (params: UpdateParams<ReporteProceso500TableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        ReporteProcesoModuleService.getTableReporteProceso500(params as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<ReporteProceso500TableModel> = {
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

export const ReporteProceso500Table = forwardRef(ReporteProceso500TableComponent);
