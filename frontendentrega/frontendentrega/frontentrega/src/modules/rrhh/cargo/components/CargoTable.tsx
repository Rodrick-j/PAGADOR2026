import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, StatusColumn, ActionColumn, OnUpdateOptions, DataTableRefProps, ActiveColumn } from 'components/core/DataTable';
//@mui
import { Box, Typography } from '@mui/material';
//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { CargoModuleService } from 'modules/rrhh/cargo/CargoModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { fCurrency } from 'utils/formatNumber';
import { BACKGROUND_1, ESTADO_A } from 'constants/colors';
import { ENUM_TIPO_CARGO } from 'constants/enums';

export type CargoTableModel = {
    id: string;
    nombre           : string;
    item             : number;
    gestion_creacion : string;
    tipo             : string;
    salario          : number;
    libre            : boolean;
    nivel            : number;
    activo           : boolean;

    // para las columnas especiales
    actions: unknown;
};


export type CargoTableRefProps = {
    refresh: (updateParams?: UpdateParams<CargoTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<CargoTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const nombresFilter: HeaderFilter = { type: 'text' };
const numitemFilter: HeaderFilter = { type: 'text' };
const tipoFilter: HeaderFilter = { type: 'select', options: ENUM_TIPO_CARGO };

type Props = {
    onAddClick: () => void;
    onViewClick: (idCargo: string) => Promise<void>;
    onEditClick: (idCargo: string) => Promise<void>;
};

export const CargoTableComponent = (props: Props, ref: React.Ref<CargoTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<CargoTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<CargoTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false, render: renderColumnActions, width: 180 },
        { id: 'activo', label: 'Activo', align: 'left', width: 70, render: renderColumnActive },
        { id: 'nombre', label: 'Cargo', align: 'left', filter: nombresFilter, width: 320 },
        { id: 'item', label: 'Num Item', align: 'left', filter: numitemFilter },
        { id: 'gestion_creacion', label: 'Gestion Creacion', align: 'left', width: 80 },
        { id: 'nivel', label: 'Nivel', align: 'left', width: 60 },
        { id: 'tipo', label: 'Tipo', align: 'left', filter: tipoFilter },
        { id: 'salario', label: 'Salario', align: 'left', render: renderColumnSalario },
        { id: 'libre', label: 'Libre', align: 'left', render: renderColumnLibre },
        { id: 'activo', label: 'Estado', align: 'left', render: renderColumnStatus }
    ];

    const handleUpdateTable = (params: UpdateParams<CargoTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        CargoModuleService.getTableCargo(params as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<CargoTableModel> = {
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

    function renderColumnLibre(tableModel: CargoTableModel): ReactElement {
        const sino = tableModel.libre?'SI':'NO';
        return <StatusColumn status={sino} background={BACKGROUND_1}/>;
    }

    function renderColumnSalario(tableModel: CargoTableModel): ReactElement {
        const salario = fCurrency(tableModel.salario);
        return <Box sx={{ textAlign: 'left' }}>{salario}</Box>;
    }

    function renderColumnActive(data: CargoTableModel): ReactElement {
        return (
            <ActiveColumn
                active={data.activo}
                onActiveChange={async (newValue: any) => {
                    return CargoModuleService.setActiveCargo(data.id, newValue).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Estado actualizado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnActions(data: CargoTableModel): ReactElement {
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
                deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro?</div>
                        <br />
                        <div>
                            <strong>Nombre: </strong> {data.nombre +' - '+data.item}
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return CargoModuleService.destroyCargo(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Cargo eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnStatus(data: CargoTableModel): ReactElement {
        const color = 'white';
        const background = data.activo? ESTADO_A[0] : ESTADO_A[1];
        const estado = data.activo?'ACTIVO':'INACTIVO';
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

export const CargoTable = forwardRef(CargoTableComponent);
