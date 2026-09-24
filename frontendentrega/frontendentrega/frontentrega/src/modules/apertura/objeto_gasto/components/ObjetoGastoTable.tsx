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
import { ObjetoGastoModuleService } from 'modules/apertura/objeto_gasto/ObjetoGastoModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { BACKGROUND_1, ESTADO_A, ESTADO_F, ESTADO_G } from 'constants/colors';

export type ObjetoGastoTableModel = {
    id: string;   
    objeto                         : string;
    descripcion_objeto_gasto       : string;   
    observacion                    : string;  
    estado                         : boolean; 
    actions: unknown;
};


export type ObjetoGastoTableRefProps = {
    refresh: (updateParams?: UpdateParams<ObjetoGastoTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<ObjetoGastoTableModel> = {
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
    onViewClick: (idObjetoGasto: string) => Promise<void>;
    onEditClick: (idObjetoGasto: string) => Promise<void>;
};

export const ObjetoGastoTableComponent = (props: Props, ref: React.Ref<ObjetoGastoTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<ObjetoGastoTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<ObjetoGastoTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false,render:renderColumnActions, width:150 },//, render: renderColumnActions                   
        { id: 'objeto', label: 'Objeto', align: 'center',filter: nombrePadreFilter, width:120},       
        { id: 'descripcion_objeto_gasto', label: 'Descripcion Objeto Gasto', align: 'center',filter: nombrePadreFilter},   
        { id: 'observacion', label: 'Observacion', align: 'center' },       
        { id: 'estado', label: 'Estado', align: 'center', render:renderColumnActive },       
      //  { id: 'activo', label: 'Opciones', align: 'left' }//, render: renderColumnStatus
    ];

    const handleUpdateTable = (params: UpdateParams<ObjetoGastoTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        ObjetoGastoModuleService.getTableObjetoGasto(params as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<ObjetoGastoTableModel> = {
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
   

     
    function renderColumnActions(data: ObjetoGastoTableModel): ReactElement {
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
                deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro?</div>
                        <br />
                        <div>
                            {/*Se cambia a apertura programatica y Cod fte  <strong>Nombre: </strong> {data.apertura_programatica +' - '+data.cod_fte} deberia ser por el area y apertura programatica*/}
                            <strong>Nombre: </strong> {data.id +' - '+data.objeto+' - '+data.descripcion_objeto_gasto} 
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return ObjetoGastoModuleService.destroyObjetoGasto(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('ObjetoGasto eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }


    function renderColumnActive(data: ObjetoGastoTableModel): ReactElement {
        return (
            <ActiveColumn
                active={data.estado}				
                onActiveChange={async (newValue: any) => {                   
                    return ObjetoGastoModuleService.setActiveObjeto(data.id, newValue).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Estado actualizado exitosamente');
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

export const ObjetoGastoTable = forwardRef(ObjetoGastoTableComponent);
