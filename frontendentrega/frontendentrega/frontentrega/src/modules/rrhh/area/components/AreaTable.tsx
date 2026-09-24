import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, StatusColumn, ActionColumn, OnUpdateOptions, DataTableRefProps, ActiveColumn } from 'components/core/DataTable';
//@mui
import { Box } from '@mui/material';
//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { AreaModuleService } from 'modules/rrhh/area/AreaModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { BACKGROUND_1, ESTADO_A } from 'constants/colors';

export type AreaTableModel = {
    id         : string;
    sigla      : string;
    nombre     : string;
    areaNombre?: string;
    indice      : string;
    padre      : string;
    activo     : boolean;

    // para las columnas especiales
    actions: unknown;
};


export type AreaTableRefProps = {
    refresh: (updateParams?: UpdateParams<AreaTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<AreaTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const nombresFilter: HeaderFilter = { type: 'text' };
const nombrePadreFilter: HeaderFilter = { type: 'text' };
const partidaFilter: HeaderFilter = { type: 'text' };


type Props = {
    onAddClick: () => void;
    onViewClick: (idArea: string) => Promise<void>;
    onEditClick: (idArea: string) => Promise<void>;
};

export const AreaTableComponent = (props: Props, ref: React.Ref<AreaTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<AreaTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<AreaTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false, render: renderColumnActions },
        { id: 'activo', label: 'Activo', align: 'center', width: 80, render: renderColumnActive },
        { id: 'nombre', label: 'Nombre', align: 'left', filter: nombresFilter, width: 240 },
        { id: 'sigla', label: 'Sigla', align: 'left' ,filter: nombresFilter, },
        { id: 'indice', label: 'Indice', align: 'left', filter: partidaFilter },
        { id: 'areaNombre', label: 'Indice Completo', align: 'left', width: 240, filter: nombrePadreFilter },
        { id: 'padre', label: 'Padre', align: 'left', render: renderColumnPadre, filter: nombrePadreFilter },
        { id: 'activo', label: 'Estado', align: 'left', render: renderColumnStatus }
    ];

    const handleUpdateTable = (params: UpdateParams<AreaTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        AreaModuleService.getTableArea(params as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<AreaTableModel> = {
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

    function renderColumnActive(data: AreaTableModel): ReactElement {
        return (
            <ActiveColumn
                active={data.activo}
                onActiveChange={async (newValue: any) => {
                    return AreaModuleService.setActiveArea(data.id, newValue).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Estado actualizado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnActions(data: AreaTableModel): ReactElement {
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
                deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro?</div>
                        <br />
                        <div>
                            <strong>Nombre: </strong> {data.sigla +' - '+data.nombre}
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return AreaModuleService.destroyArea(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Area eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnStatus(data: AreaTableModel): ReactElement {
        const color = 'white';
        const background = data.activo? ESTADO_A[0] : ESTADO_A[1];
        const estado = data.activo?'ACTIVO':'INACTIVO';
        return <StatusColumn status={estado} color={color} background={background} />;
    }

    function renderColumnPadre(data: AreaTableModel): ReactElement {
        const padre = data.padre?'SI':'NO';
        return <StatusColumn status={padre} background={BACKGROUND_1}/>;
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

export const AreaTable = forwardRef(AreaTableComponent);
