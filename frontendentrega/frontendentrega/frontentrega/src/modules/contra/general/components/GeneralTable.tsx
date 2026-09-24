import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, StatusColumn, ActionColumn, OnUpdateOptions, DataTableRefProps } from 'components/core/DataTable';
//@mui

//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { GeneralModuleService } from 'modules/contra/general/GeneralModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { ESTADO_A } from 'constants/colors';

export type GeneralTableModel = {
    id     : string;
    nombre : string;
    tiempo : string;
    tipo   : string;
    paso   : number;
    usuario: string;

    // para las columnas especiales
    actions: unknown;
};


export type GeneralTableRefProps = {
    refresh: (updateParams?: UpdateParams<GeneralTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<GeneralTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const nombresFilter: HeaderFilter = { type: 'text' };
const tipoFilter: HeaderFilter = { type: 'text' };

type Props = {
    onAddClick: () => void;
    onViewClick: (idGeneral: string) => Promise<void>;
    onEditClick: (idGeneral: string) => Promise<void>;
};

export const GeneralTableComponent = (props: Props, ref: React.Ref<GeneralTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<GeneralTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<GeneralTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false, render: renderColumnActions, width: 180 },
        { id: 'nombre', label: 'Nombre Actividad', align: 'left', filter: nombresFilter },        
        { id: 'usuario', label: 'Responsable', align: 'left' },
        { id: 'tiempo', label: 'Tiempo', align: 'left' },
        { id: 'tipo', label: 'Tipo', align: 'left', filter: tipoFilter },
        { id: 'paso', label: 'Paso', align: 'left' },
    ];

    const handleUpdateTable = (params: UpdateParams<GeneralTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        GeneralModuleService.getTableGeneral(params as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<GeneralTableModel> = {
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
            
    function renderColumnActions(data: GeneralTableModel): ReactElement {
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
                    return GeneralModuleService.destroyGeneral(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('General eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
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

export const GeneralTable = forwardRef(GeneralTableComponent);
