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
import { AsignacionModuleService } from 'modules/bsss/asignacion/AsignacionModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { ESTADO_A } from 'constants/colors';

export type AsignacionTableModel = {
    id            : string;
    nombre_area   : string;
    nombre_usuario: string;
    inicial       : string;
    restante      : string;
    real          : string;
    observacion   : string;
    estado        : boolean;
    cod_asignacion  : string;
    contrato?     : string;
    // para las columnas especiales
    actions: unknown;
};


export type AsignacionTableRefProps = {
    refresh: (updateParams?: UpdateParams<AsignacionTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<AsignacionTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const nombresFilter: HeaderFilter = { type: 'text' };
const nombreasignacionsFilter: HeaderFilter = { type: 'text' };
const codigoasignacionsFilter: HeaderFilter = { type: 'text' };

type Props = {
    onAddClick: () => void;
    onViewClick: (idAsignacion: string) => Promise<void>;
    onEditClick: (idAsignacion: string) => Promise<void>;
};

export const AsignacionTableComponent = (props: Props, ref: React.Ref<AsignacionTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<AsignacionTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<AsignacionTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false, render: renderColumnActions },
        { id: 'estado', label: 'Activo', align: 'left', render: renderColumnActive },
        { id: 'nombre_area', label: 'Nombre A.P.', align: 'left', filter: nombreasignacionsFilter },
        { id: 'cod_asignacion', label: 'Asignacion Programatica', align: 'left', filter: codigoasignacionsFilter},
        { id: 'inicial', label: 'Presupuesto de Ingreso Bs.', align: 'right' },
        { id: 'restante', label: 'Presupuesto Restante Bs.', align: 'right' },
        { id: 'real', label: 'Presupuesto Restante Real Bs.', align: 'right' },
        { id: 'observacion', label: 'Observaciones', align: 'left' },
        { id: 'nombre_usuario', label: 'Usuario Asociado', align: 'left', filter: nombresFilter },
        { id: 'estado', label: 'Estado', align: 'left', render: renderColumnStatus },
        { id: 'contrato', label: 'Codigo contrato', align: 'center', width: 200 },
    ];

    const handleUpdateTable = (params: UpdateParams<AsignacionTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        AsignacionModuleService.getTableAsignacion(params as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<AsignacionTableModel> = {
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

    function renderColumnActive(data: AsignacionTableModel): ReactElement {
        return (
            <ActiveColumn
                active={data.estado}
                onActiveChange={async (newValue: any) => {
                    return AsignacionModuleService.setActiveAsignacion(data.id, newValue).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Estado actualizado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnActions(data: AsignacionTableModel): ReactElement {
        if(!data.estado) return(
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
            />
        )
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
                deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro?</div>
                        <br />
                        <div>
                            <strong>Nombre: </strong> {data.inicial}
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return AsignacionModuleService.destroyAsignacion(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Asignacion eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnStatus(data: AsignacionTableModel): ReactElement {
        const color = 'white';
        const background = data.estado? ESTADO_A[0] : ESTADO_A[1];
        const estado = data.estado?'ACTIVO':'INACTIVO';
        return <StatusColumn status={estado} color={color} background={background} />;
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

export const AsignacionTable = forwardRef(AsignacionTableComponent);
