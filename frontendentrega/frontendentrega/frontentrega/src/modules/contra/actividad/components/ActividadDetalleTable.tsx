import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, StatusColumn, ActionColumn, OnUpdateOptions, DataTableRefProps } from 'components/core/DataTable';
//@mui

//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { ActividadModuleService } from 'modules/contra/actividad/ActividadModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { ESTADO_C } from 'constants/colors';

export type ActividadDetalleTableModel = {
    id          : string;
    titulo      : string;
    descripcion : string;
    paso        : number;
    tiempo      : string;
    notificacion: boolean;
    observacion2: string;
    responsable : string;
    fecha       : Date;
    fecha_envio : Date;
    estado      : string;

    // para las columnas especiales
    actions: unknown;
};


export type ActividadTableRefProps = {
    refresh: (updateParams?: UpdateParams<ActividadDetalleTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<ActividadDetalleTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const nombresFilter: HeaderFilter = { type: 'text' };

type Props = {
    procesoId  : string;
    onAddClick : () => void;
    onViewClick: (idActividad: string) => Promise<void>;
    onEditClick: (idActividad: string) => Promise<void>;
};

export const ActividadDetalleTableComponent = (props: Props, ref: React.Ref<ActividadTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick, procesoId } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<ActividadDetalleTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<ActividadDetalleTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false, render: renderColumnActions, width: 180 },
        { id: 'titulo', label: 'Titulo Actividad', align: 'left', filter: nombresFilter },
        { id: 'descripcion', label: 'Descripcion', align: 'left' },
        { id: 'paso', label: 'Paso', align: 'left' },
        { id: 'tiempo', label: 'Tiempo', align: 'left' },
        { id: 'notificacion', label: 'Notificacion', align: 'left' },
        { id: 'responsable', label: 'Responsable', align: 'left', width: 280 },
        { id: 'observacion2', label: 'Observacion', align: 'left' },
        { id: 'fecha', label: 'Fecha', align: 'left' },
        { id: 'fecha_envio', label: 'Fecha Envio', align: 'left' },
        { id: 'estado', label: 'Estado', sort: false, align: 'left', render: renderColumnStatus },
    ];

    const handleUpdateTable = (params: UpdateParams<ActividadDetalleTableModel>, opt: OnUpdateOptions) => {
        if (!isMounted()) return;
        const newParams = {
            ...params,
            filters: { ...params.filters, proceso_id: procesoId },
        };
        opt.setLoading(true);
        ActividadModuleService.getTableActividadDetalle(newParams as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<ActividadDetalleTableModel> = {
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

    function renderColumnActions(data: ActividadDetalleTableModel): ReactElement {
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
                deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro?</div>
                        <br />
                        <div>
                            <strong>Nombre: </strong> {data.titulo}
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return ActividadModuleService.destroyActividad(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Actividad eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnStatus(data: ActividadDetalleTableModel): ReactElement {
        const estado = data.estado;
        const color = 'white';
        const background = ESTADO_C[estado];
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
                onActionAddClick={onAddClick}
                vScroll
            />
        </>
    );
};

export const ActividadDetalleTable = forwardRef(ActividadDetalleTableComponent);
