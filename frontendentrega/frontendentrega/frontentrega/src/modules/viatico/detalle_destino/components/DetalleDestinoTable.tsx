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
import { DetalleDestinoModuleService } from 'modules/viatico/detalle_destino/DetalleDestinoModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { BACKGROUND_1, ESTADO_A } from 'constants/colors';
import { ANULADO } from 'constants/enums';

export type DetalleDestinoTableModel = {
    id: string;
    tipo_vehiculo_op         : string;
    objetivo_viaje           : string;
    destino_reg              : string;
    fecha_dia                : Date;
    hora_inicio              : string;
    hora_fin                 : string;
    pernocte                 : string;
    pasaje_ida               : number;
    pasaje_retorno           : number;
    total_pasaje_dia         : number;
    tipo_vehiculo_opvida     : string;
    tipo_vehiculo_opvuelta   : string;
    estado                   : string;
    activo                   : boolean;

    // para las columnas especiales
    actions: unknown;
    // aumentamos campos vehiculo
    vehiculo_id? : string;
    num_placa? : string;
    dia_semana? : string;
};


export type DetalleDestinoTableRefProps = {
    refresh: (updateParams?: UpdateParams<DetalleDestinoTableModel>) => void;
    getQueryParams: () => QueryParams;
};
export type DetalleTipoVehiculoTableModel = {
    id: string;
    nombre         : string;
    caption?           : string;   
};

export type RangoFechasTableModel = {
    id            : string;
    fecha         : string;
    caption?      : string;   
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<DetalleDestinoTableModel> = {
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
    onViewClick: (idDetalleDestino: string) => Promise<void>;
    onEditClick: (idDetalleDestino: string) => Promise<void>;
};

export const DetalleDestinoTableComponent = (props: Props, ref: React.Ref<DetalleDestinoTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<DetalleDestinoTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<DetalleDestinoTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false, render:renderColumnActions },//, render: renderColumnActions
        { id: 'tipo_vehiculo_op', label: 'Vehiculo Oficial o Publico',width:150 , align: 'center'},//, render: renderColumnActive 
        { id: 'vehiculo_id', label: 'Tipo de Vehiculo', align: 'center',width:150 },      
        { id: 'num_placa', label: 'Placa Vehiculo', align: 'center'},  
        { id: 'objetivo_viaje', label: 'Objetivo de Viaje', align: 'center', filter: nombresFilter, width: 240 },
        { id: 'destino_reg', label: 'Destino registrado', align: 'center' },
        { id: 'fecha_dia', label: 'Fecha Registro Memorandum', align: 'center', filter: partidaFilter },
        { id: 'hora_inicio', label: 'Hora Inicio', align: 'center', filter: nombrePadreFilter },
        { id: 'hora_fin', label: 'Hora Fin', align: 'center', filter: nombrePadreFilter },//, render: renderColumnPadre
        { id: 'pasaje_ida', label: 'Pasaje de Ida', align: 'center' },//, render: renderColumnStatus
        { id: 'pasaje_retorno', label: 'Pasaje de Retorno', align: 'center', filter: nombrePadreFilter },//, render: renderColumnPadre
        { id: 'total_pasaje_dia', label: 'Total Pasaje Dia', align: 'center' },//, render: renderColumnStatus
        { id: 'activo', label: 'Estado', align: 'center' }//, render: renderColumnStatus
    ];

    const handleUpdateTable = (params: UpdateParams<DetalleDestinoTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        DetalleDestinoModuleService.getTableDetalleDestino(params as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<DetalleDestinoTableModel> = {
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

    function renderColumnActive(data: DetalleDestinoTableModel): ReactElement {
        return (
            <ActiveColumn
                active={data.activo}
                onActiveChange={async (newValue: any) => {
                    return DetalleDestinoModuleService.setActiveDetalleDestino(data.id, newValue).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Estado actualizado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnActions(data: DetalleDestinoTableModel): ReactElement {
        if(data.estado==='APROBADO' || data.estado===ANULADO) return(
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
            />
        );
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
                deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro?</div>
                        <br />
                        <div>
                            {/* Mejorar data. sigla   y data. nombre  <strong>Nombre: </strong> {data.fecha_dia +' - '+data.id}  cambiar por una id mas representativa*/}
                            <strong>Nombre: </strong> {data.destino_reg} 
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return DetalleDestinoModuleService.destroyDetalleDestino(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('DetalleDestino eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnStatus(data: DetalleDestinoTableModel): ReactElement {
        const color = 'white';
        const background = data.activo? ESTADO_A[0] : ESTADO_A[1];
        const estado = data.activo?'ACTIVO':'INACTIVO';
        return <StatusColumn status={estado} color={color} background={background} />;
    }

    function renderColumnPadre(data: DetalleDestinoTableModel): ReactElement {
        // se cambia lo de padre por activo pero se debe verificar
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

export const DetalleDestinoTable = forwardRef(DetalleDestinoTableComponent);
