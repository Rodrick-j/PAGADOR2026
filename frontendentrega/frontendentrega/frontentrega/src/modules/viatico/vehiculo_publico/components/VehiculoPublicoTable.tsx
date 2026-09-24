import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, StatusColumn, ActionColumn, ChangeStateColumn, OnUpdateOptions, DataTableRefProps, ActiveColumn } from 'components/core/DataTable';
//@mui
import { Box } from '@mui/material';
//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { VehiculoPublicoModuleService } from 'modules/viatico/vehiculo_publico/VehiculoPublicoModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { BACKGROUND_1, ESTADO_A } from 'constants/colors';

export type VehiculoPublicoTableModel = {
    id: string;
    razon_social          : string;
    num_boleto            : number;
    placa                 : string;
    tipo_vehiculo         : string;
    precio_boleto         : number;
    activo                : boolean;

    // para las columnas especiales
    actions: unknown;
};


export type VehiculoPublicoTableRefProps = {
    refresh: (updateParams?: UpdateParams<VehiculoPublicoTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<VehiculoPublicoTableModel> = {
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
    onViewClick: (idVehiculoPublico: string) => Promise<void>;
    onEditClick: (idVehiculoPublico: string) => Promise<void>;
};

export const VehiculoPublicoTableComponent = (props: Props, ref: React.Ref<VehiculoPublicoTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<VehiculoPublicoTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<VehiculoPublicoTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false, render:renderColumnActions },//, render: renderColumnActions
        { id: 'razon_social', label: 'Razon Social', align: 'center' },//, render: renderColumnActive
        { id: 'num_boleto', label: 'Numero de Boleto', align: 'center', filter: nombresFilter },
        { id: 'placa', label: 'Placa', align: 'center' },
        { id: 'tipo_vehiculo', label: 'Tipo de Vehiculo', align: 'center', filter: partidaFilter },
        { id: 'precio_boleto', label: 'Precio de Boleto', align: 'center', filter: nombrePadreFilter },
        { id: 'activo', label: 'Estado', align: 'center' }//, render: renderColumnStatus
    ];

    const handleUpdateTable = (params: UpdateParams<VehiculoPublicoTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        VehiculoPublicoModuleService.getTableVehiculoPublico(params as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<VehiculoPublicoTableModel> = {
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

    function renderColumnActive(data: VehiculoPublicoTableModel): ReactElement {
        return (
            <ActiveColumn
                active={data.activo}
                onActiveChange={async (newValue: any) => {
                    return VehiculoPublicoModuleService.setActiveVehiculoPublico(data.id, newValue).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Estado actualizado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnActions(data: VehiculoPublicoTableModel): ReactElement {
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
                deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro?</div>
                        <br />
                        <div>
                            {/* data.sigla  y data. nombre <strong>Nombre: </strong> {data.razon_social +' - '+data.id}  cambiar identificador para mostrar*/}
                            <strong>Nombre: </strong> {data.num_boleto}
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return VehiculoPublicoModuleService.destroyVehiculoPublico(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('VehiculoPublico eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnStatus(data: VehiculoPublicoTableModel): ReactElement {
        const color = 'white';
        const background = data.activo? ESTADO_A[0] : ESTADO_A[1];
        const estado = data.activo?'ACTIVO':'INACTIVO';
        return <StatusColumn status={estado} color={color} background={background} />;
    }

    function renderColumnPadre(data: VehiculoPublicoTableModel): ReactElement {
        // Se cambia de padre activo pero para verficar
        const padre = data.activo?'SI':'NO';
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

export const VehiculoPublicoTable = forwardRef(VehiculoPublicoTableComponent);
