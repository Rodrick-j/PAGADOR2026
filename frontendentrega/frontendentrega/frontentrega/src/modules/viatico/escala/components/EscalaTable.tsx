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
import { EscalaModuleService } from 'modules/viatico/escala/EscalaModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { BACKGROUND_1, ESTADO_A } from 'constants/colors';

export type EscalaTableModel = {
    id                    : string;
    categoria             : string;   
    tipo_comision_idp     : string; 
    escala                : string;
    viatico_por_dia       : number;
    moneda                : string;
    bolivianos            : number;
    cargo_id              : string;
    activo                : boolean;
    item_contrato?        : string;

    // para las columnas especiales
    actions: unknown;
};

export type EscalaTableModel2 = {
    id                    : string;
    categoria             : string;   
    tipo_comision_idp     : string; 
    escala                : string;
    viatico_por_dia       : string;
    moneda                : string;
    bolivianos            : string;
    cargo_id              : string;
    activo                : string;

    // para las columnas especiales
    actions: unknown;
};

export type EscalaTableRefProps = {
    refresh: (updateParams?: UpdateParams<EscalaTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<EscalaTableModel> = {
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
    onViewClick: (idEscala: string) => Promise<void>;
    onEditClick: (idEscala: string) => Promise<void>;
};

export const EscalaTableComponent = (props: Props, ref: React.Ref<EscalaTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<EscalaTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);
    

    let tableHeaders: TableHeader<EscalaTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false, render:renderColumnActions },//, render: renderColumnActions
        { id: 'categoria', label: 'Categoria', align: 'center' },//, render: renderColumnActive
        { id: 'tipo_comision_idp', label: 'Tipo de Comision', align: 'center' },//, render: renderColumnActive
        { id: 'cargo_id', label: 'Cargo', align: 'center', filter: nombresFilter, width: 200},
        { id: 'item_contrato', label: 'Item-Contrato', align: 'center', filter: nombresFilter, width: 150},
        { id: 'escala', label: 'Escala', align: 'center' },
        { id: 'viatico_por_dia', label: 'Viaticos por dia', align: 'center', filter: partidaFilter },
        { id: 'moneda', label: 'tipo de Moneda', align: 'center', filter: nombrePadreFilter },
      //  { id: 'bolivianos', label: 'Bolivianos', align: 'center',  filter: nombrePadreFilter },//render: renderColumnPadre,
        { id: 'activo', label: 'Estado', align: 'center'}//, render: renderColumnStatus 
    ];

    const handleUpdateTable = (params: UpdateParams<EscalaTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        EscalaModuleService.getTableEscala(params as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<EscalaTableModel> = {
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

    function renderColumnActive(data: EscalaTableModel): ReactElement {
        return (
            <ActiveColumn
                active={data.activo}
                onActiveChange={async (newValue: any) => {
                    return EscalaModuleService.setActiveEscala(data.id, newValue).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Estado actualizado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnActions(data: EscalaTableModel): ReactElement {
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
                deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro?</div>
                        <br />
                        <div>
                            {/*data.sigla  y data.nombre  <strong>Nombre: </strong> {data.categoria +' - '+data.cargo}  se debe colocar un identificador mas representativo*/}
                            <strong>Nombre: </strong> {data.categoria}
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return EscalaModuleService.destroyEscala(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Escala eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnStatus(data: EscalaTableModel): ReactElement {
        const color = 'white';
        const background = data.activo? ESTADO_A[0] : ESTADO_A[1];
        const estado = data.activo?'ACTIVO':'INACTIVO';
        return <StatusColumn status={estado} color={color} background={background} />;
    }

    function renderColumnPadre(data: EscalaTableModel): ReactElement {
        // se debe vericar el cambio de padre por action
        const padre = data.actions?'SI':'NO';
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

export const EscalaTable = forwardRef(EscalaTableComponent);
