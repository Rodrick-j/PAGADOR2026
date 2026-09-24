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
import { EscalaDestinoModuleService } from 'modules/viatico/escala_destino/EscalaDestinoModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { BACKGROUND_1, ESTADO_A } from 'constants/colors';

export type EscalaDestinoTableModel = {
    id                    : string;
    tipo_pcp              : string;  
    escala_exterior       : string; 
    destino              : string;  
    provincia            : string;
    modalidad            : string;
    pasaje_minimo         : number;
    pasaje_maximo         : number;      
    activo                : boolean;

    // para las columnas especiales
    actions: unknown;
};


export type EscalaDestinoTableRefProps = {
    refresh: (updateParams?: UpdateParams<EscalaDestinoTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<EscalaDestinoTableModel> = {
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
    onViewClick: (idEscalaDestino: string) => Promise<void>;
    onEditClick: (idEscalaDestino: string) => Promise<void>;
};

export const EscalaDestinoTableComponent = (props: Props, ref: React.Ref<EscalaDestinoTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<EscalaDestinoTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<EscalaDestinoTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false, render:renderColumnActions },//, render: renderColumnActions
        { id: 'destino', label: 'Destino', align: 'center',  filter: nombrePadreFilter },//render: renderColumnPadre,
        { id: 'tipo_pcp', label: 'Tipo de Viaje', align: 'center' },//, render: renderColumnActive
        { id: 'escala_exterior', label: 'Escala Exterior', align: 'center' },//, render: renderColumnActive
        { id: 'provincia', label: 'Provincia', align: 'center', filter: nombresFilter},
        { id: 'modalidad', label: 'Modalidad de Viaje', align: 'center' },
        { id: 'pasaje_minimo', label: 'Pasaje Minimo', align: 'center', filter: partidaFilter },
        { id: 'pasaje_maximo',label:'Pasaje Maximo', align: 'center', filter: nombrePadreFilter },
       
        { id: 'activo', label: 'Estado', align: 'center'}//, render: renderColumnStatus 
    ];

    const handleUpdateTable = (params: UpdateParams<EscalaDestinoTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        EscalaDestinoModuleService.getTableEscalaDestino(params as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<EscalaDestinoTableModel> = {
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

    function renderColumnActive(data: EscalaDestinoTableModel): ReactElement {
        return (
            <ActiveColumn
                active={data.activo}
                onActiveChange={async (newValue: any) => {
                    return EscalaDestinoModuleService.setActiveEscalaDestino(data.id, newValue).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Estado actualizado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnActions(data: EscalaDestinoTableModel): ReactElement {
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
                            <strong>Nombre: </strong> {data.destino}
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return EscalaDestinoModuleService.destroyEscalaDestino(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('EscalaDestino eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnStatus(data: EscalaDestinoTableModel): ReactElement {
        const color = 'white';
        const background = data.activo? ESTADO_A[0] : ESTADO_A[1];
        const estado = data.activo?'ACTIVO':'INACTIVO';
        return <StatusColumn status={estado} color={color} background={background} />;
    }

    function renderColumnPadre(data: EscalaDestinoTableModel): ReactElement {
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

export const EscalaDestinoTable = forwardRef(EscalaDestinoTableComponent);
