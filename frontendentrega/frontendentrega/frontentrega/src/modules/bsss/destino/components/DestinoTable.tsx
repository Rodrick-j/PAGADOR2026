import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, StatusColumn, ActionColumn, OnUpdateOptions, DataTableRefProps } from 'components/core/DataTable';
//@mui

//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { DestinoModuleService } from 'modules/bsss/destino/DestinoModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { ESTADO_A } from 'constants/colors';

export type DestinoTableModel = {
    id       : string;
    nombre   : string;
    distancia: string;
    litros   : string;
    estado   : boolean;

    // para las columnas especiales
    actions: unknown;
};


export type DestinoTableRefProps = {
    refresh: (updateParams?: UpdateParams<DestinoTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<DestinoTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const nombresFilter: HeaderFilter = { type: 'text' };

type Props = {
    onAddClick: () => void;
    onViewClick: (idDestino: string) => Promise<void>;
    onEditClick: (idDestino: string) => Promise<void>;
};

export const DestinoTableComponent = (props: Props, ref: React.Ref<DestinoTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<DestinoTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<DestinoTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false, render: renderColumnActions, width: 180 },
        { id: 'nombre', label: 'Nombre Destino', align: 'left', filter: nombresFilter },        
        { id: 'distancia', label: 'Distancia Km. Aprox.', align: 'left', width: 180 },
        { id: 'litros', label: 'Litros (recomendados para emitir el vale)', align: 'left' },
        { id: 'estado', label: 'Estado', align: 'left', render: renderColumnStatus, width: 120 }
    ];

    const handleUpdateTable = (params: UpdateParams<DestinoTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        DestinoModuleService.getTableDestino(params as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<DestinoTableModel> = {
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
            
    function renderColumnActions(data: DestinoTableModel): ReactElement {
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
                deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro?</div>
                        <br />
                        <div>
                            <strong>Nombre: </strong> {data.nombre}
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return DestinoModuleService.destroyDestino(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Destino eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnStatus(data: DestinoTableModel): ReactElement {
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

export const DestinoTable = forwardRef(DestinoTableComponent);
