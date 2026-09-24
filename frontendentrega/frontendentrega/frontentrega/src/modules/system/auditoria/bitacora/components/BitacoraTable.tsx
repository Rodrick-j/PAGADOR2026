import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { DataTable, TableHeader, UpdateParams, HeaderFilter, ActionColumn, OnUpdateOptions, DataTableRefProps } from 'components/core/DataTable';

import { QueryParams } from 'services/base/Types';
import { useIsMounted } from 'hooks/useIsMounted';

import { BitacoraModuleService } from '../BitacoraModuleService';

export type BitacoraTableModel = {
    id      : string;
    fecha   : string;
    ruta    : string;
    metodo  : string;
    ip      : string;
    modulo  : string;
    nombre  : string;
    rol     : string;
    // para las columnas especiales
    actions: unknown;
    options?: unknown;
};

export type BitacoraTableRefProps = {
    refresh: (updateParams?: UpdateParams<BitacoraTableModel>) => void;
    getQueryParams: () => QueryParams
};

const tableParamsInitialize: UpdateParams<BitacoraTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const fullNombreFilter: HeaderFilter = { type: 'text' };
const fullRolFilter: HeaderFilter = { type: 'text' };

type Props = {
    onViewClick     : (id: string) => Promise<void>;
    onDownloadClick?: () => void;
    loading         : boolean;
};

export const BitacoraTableComponent = (props: Props, ref: React.Ref<BitacoraTableRefProps>): ReactElement => {
    const { onViewClick, onDownloadClick, loading } = props;
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<BitacoraTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    const tableHeaders: TableHeader<BitacoraTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false, render: renderColumnActions },
        { id: 'fecha', label: 'Fecha y Hora', align: 'left' },
        { id: 'ruta', label: 'Ruta', align: 'left' },
        { id: 'metodo', label: 'Metodo', align: 'left' },
        { id: 'modulo', label: 'Modulo', align: 'left' },
        { id: 'ip', label: 'IP', align: 'left' },
        { id: 'nombre', label: 'Nombre Usuario', align: 'left', filter: fullNombreFilter },
        { id: 'rol', label: 'Rol', align: 'left', filter: fullRolFilter }
    ];

    const handleUpdateTable = (params: UpdateParams<BitacoraTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        BitacoraModuleService.getTableBitacoras(params as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<BitacoraTableModel> = {
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

    function renderColumnActions(data: BitacoraTableModel): ReactElement {
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
            />
        );
    }

    return (
        <DataTable
            ref={tableRef}
            headers={tableHeaders}
            updateParams={tableParams}
            onUpdate={handleUpdateTable}
            onDownloadClick={onDownloadClick}
            isLoading={loading}
        />
    );
};

export const BitacoraTable = forwardRef(BitacoraTableComponent);
