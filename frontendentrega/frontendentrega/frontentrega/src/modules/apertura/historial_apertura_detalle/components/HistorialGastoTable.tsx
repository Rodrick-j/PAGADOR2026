import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
//components
import { DataTable, TableHeader, UpdateParams, ActionColumn, OnUpdateOptions, DataTableRefProps } from 'components/core/DataTable';
//@mui
//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { DeudaModuleService } from 'modules/conta/deuda/DeudaModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { useSession } from 'hooks/session';

import { HistorialAperturaDetalleModuleService } from '../HistorialAperturaDetalleModuleService';
import { ENCARGADO_COMBUSTIBLE, ENCARGADO_VIATICOS } from 'constants/enums';

export type HistorialGastoTableModel = {
    index         :number;
    id         : string;
    fecha                : Date;
    fecha_format         : string;
    descripcion          : string;
    debe                 : number;
    haber                : number;
    saldo                : number;
	estado                  : string;
    historial_apertura_id   : string;
    apertura_id             : string;	

    // para las columnas especiales
    actions: unknown;
};

export type HistorialGastoTableRefProps = {
    refresh: (updateParams?: UpdateParams<HistorialGastoTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<HistorialGastoTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

type Props = {
    aperturaId: string;
    onComplete: () => void;
};

export const HistorialGastoTableComponent = (props: Props, ref: React.Ref<HistorialGastoTableRefProps>): ReactElement => {
    const { aperturaId, onComplete } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const authUser = useSession();

    const { remove } = authUser.permisos;
    const [tableParams, setTableParams] = useState<UpdateParams<HistorialGastoTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);
 
    const tableHeaders: TableHeader<HistorialGastoTableModel>[] = [
        { id: 'fecha_format', label: 'Fecha', sort: false, align: 'center' }, 
        { id: 'descripcion', label: 'Descripcion', sort: false, align: 'center' },  
        { id: 'debe', label: 'Egreso', sort: false, width: 95, align: 'center' }, 
        { id: 'haber', label: 'Ingreso', sort: false, width: 95, align: 'center' }, 
        { id: 'saldo', label: 'Saldo', sort: false, align: 'center' },
       
    ];

    if (remove) {
        tableHeaders.splice(0, 0, { id: 'actions', label: 'Opcion', width: 80, align: 'left', sort: false, render: renderColumnActions });
    }

    const handleUpdateTable = (params: UpdateParams<HistorialGastoTableModel>, opt: OnUpdateOptions) => {        
        if (!isMounted()) return;
        const newParams = {
            ...params,
            filters: { ...params.filters, apertura_id: aperturaId },
        };
        opt.setLoading(true);
        HistorialAperturaDetalleModuleService.getTableHistorialGasto(newParams as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<HistorialGastoTableModel> = {
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

   
        
    function renderColumnActions(data: HistorialGastoTableModel): ReactElement {        
        if(data.index===0 || authUser.roles === ENCARGADO_COMBUSTIBLE || authUser.roles === ENCARGADO_VIATICOS) return <></>;
		
        return (
            <ActionColumn                
                deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro?</div>
                        <br />
                        <div>
                            <strong>Descripcion: </strong> {data.descripcion}
                        </div>
                    </div>
                }
                onDeleteClick={async () => {            
                    return HistorialAperturaDetalleModuleService.destroyHistorialGasto(data.id).then((result) => {						
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Historial Gasto eliminado exitosamente');
                        tableRef.current?.refresh();
                        onComplete();
                    });
                }}
                size='small'
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
                showFilters={false}
                showRefresh={false}
                showSearch={false}
                hiddenPagination={true}
                vScroll
            />        
        </>
    );
};

export const HistorialGastoTable = forwardRef(HistorialGastoTableComponent);
