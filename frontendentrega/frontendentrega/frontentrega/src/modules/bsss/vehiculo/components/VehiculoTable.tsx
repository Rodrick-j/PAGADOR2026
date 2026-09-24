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
import { VehiculoModuleService } from 'modules/bsss/vehiculo/VehiculoModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { ESTADO_A } from 'constants/colors';

export type VehiculoTableModel = {
    id         : string;
    nombre     : string;
    area       : string;
    cod_activo : string;
    num_placa  : string;
    tipo       : string;
    marca      : string;
    carga      : string;
    observacion: string;
    estado     : boolean;

    // para las columnas especiales
    actions: unknown;
};


export type VehiculoTableRefProps = {
    refresh: (updateParams?: UpdateParams<VehiculoTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<VehiculoTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const codFilter: HeaderFilter = { type: 'text' };
const placaFilter: HeaderFilter = { type: 'text' };
const conductorFilter: HeaderFilter = { type: 'text' };
const nombreasignacionsFilter: HeaderFilter = { type: 'text' };

type Props = {
    onAddClick: () => void;
    onViewClick: (idVehiculo: string) => Promise<void>;
    onEditClick: (idVehiculo: string) => Promise<void>;
};

export const VehiculoTableComponent = (props: Props, ref: React.Ref<VehiculoTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<VehiculoTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<VehiculoTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false, render: renderColumnActions },
        { id: 'estado', label: 'Activo', align: 'left', render: renderColumnActive, width: 80 },
        { id: 'cod_activo', label: 'Codigo Activo', align: 'left', filter: codFilter },
        { id: 'num_placa', label: 'Nro Placa', align: 'left', filter: placaFilter },
        { id: 'area', label: 'Secretaria/Unidad/Area', align: 'left', width: 260, filter: nombreasignacionsFilter },
        { id: 'tipo', label: 'Tipo', align: 'left' },
        { id: 'marca', label: 'Marca', align: 'left' },
        { id: 'carga', label: 'Carga', align: 'left' },
        { id: 'nombre', label: 'Nombre Conductor/CI', align: 'left', filter: conductorFilter, width: 240 },
        { id: 'observacion', label: 'Observaciones', align: 'left' },
        { id: 'estado', label: 'Estado', align: 'left', render: renderColumnStatus }
    ];

    const handleUpdateTable = (params: UpdateParams<VehiculoTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        VehiculoModuleService.getTableVehiculo(params as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<VehiculoTableModel> = {
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

    function renderColumnActive(data: VehiculoTableModel): ReactElement {
        return (
            <ActiveColumn
                active={data.estado}
                onActiveChange={async (newValue: any) => {
                    return VehiculoModuleService.setActiveVehiculo(data.id, newValue).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Estado actualizado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnActions(data: VehiculoTableModel): ReactElement {
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
                deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro?</div>
                        <br />
                        <div>
                            <strong>Nombre: </strong> {data.nombre +' - '+data.num_placa}
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return VehiculoModuleService.destroyVehiculo(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Vehiculo eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnStatus(data: VehiculoTableModel): ReactElement {
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

export const VehiculoTable = forwardRef(VehiculoTableComponent);
