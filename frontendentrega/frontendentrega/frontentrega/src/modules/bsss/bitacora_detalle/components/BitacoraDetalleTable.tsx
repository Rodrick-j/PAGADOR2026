import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, StatusColumn, ActionColumn, OnUpdateOptions, DataTableRefProps } from 'components/core/DataTable';
//@mui

//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { BitacoraDetalleModuleService } from 'modules/bsss/bitacora_detalle/BitacoraDetalleModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { ESTADO_A } from 'constants/colors';

export type BitacoraDetalleTableModel = {
    id       : string;
    fecha_salida      : Date;
    fecha_retorno     : Date;
    hora_salida       : string;
    hora_retorno      : string;
    destino_salida    : string;
    destino_llegada   : string;
    km_salida         : number;
    km_llegada        : number;
    km_estimados      : number;
    cantidad_personas : number;
    estado           : string;
    fid_bitacora_viaje: string;
    // para las columnas especiales
    actions: unknown;
};


export type BitacoraDetalleTableRefProps = {
    refresh: (updateParams?: UpdateParams<BitacoraDetalleTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<BitacoraDetalleTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const nombresFilter: HeaderFilter = { type: 'text' };

type Props = {
    bitacoraViajeId: string;
    onAddClick: () => void;
    onViewClick: (idBitacoraDetalle: string) => Promise<void>;
    onEditClick: (idBitacoraDetalle: string) => Promise<void>;
};

export const BitacoraDetalleTableComponent = (props: Props, ref: React.Ref<BitacoraDetalleTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick, bitacoraViajeId } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<BitacoraDetalleTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<BitacoraDetalleTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false, render: renderColumnActions, width: 180 },
        { id: 'fecha_salida', label: 'Fecha Salida', align: 'left', filter: nombresFilter },        
        { id: 'fecha_retorno', label: 'Fecha Retorno', align: 'left', width: 180 },
        { id: 'hora_salida', label: 'Hora Salida', align: 'left' },
        { id: 'hora_retorno', label: 'Hora Retorno', align: 'left' },
        { id: 'destino_salida', label: 'Destino Salida', align: 'left', filter: nombresFilter },        
        { id: 'destino_llegada', label: 'Destino Llegada', align: 'left', width: 180 },
        { id: 'km_salida', label: 'kilomentros Salida', align: 'left' },
        { id: 'km_llegada', label: 'Kilometros Llegada', align: 'left' },
        { id: 'km_estimados', label: 'kilomentros Estimados', align: 'left' },
        { id: 'cantidad_personas', label: 'Cantidad Asientos', align: 'left' },
        { id: 'estado', label: 'Estado', align: 'left', render: renderColumnStatus, width: 120 }
    ];

    const handleUpdateTable = (params: UpdateParams<BitacoraDetalleTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        const newParams = {
            ...params,
            filters: {
                ...params.filters,
                ...(bitacoraViajeId ? { fid_bitacora_viaje: bitacoraViajeId } : {})
            },
        };
        BitacoraDetalleModuleService.getTableBitacoraDetalle(newParams as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<BitacoraDetalleTableModel> = {
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
            
    function renderColumnActions(data: BitacoraDetalleTableModel): ReactElement {
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
                deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro?</div>
                        <br />
                        <div>
                            <strong>Nombre: </strong> {data.destino_salida}
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return BitacoraDetalleModuleService.destroyBitacoraDetalle(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('BitacoraDetalle eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnStatus(data: BitacoraDetalleTableModel): ReactElement {
        const color = 'white';
        const isActivo = data.estado === 'ACTIVO';
        const background = isActivo ? ESTADO_A[0] : ESTADO_A[1];
        const estado = isActivo ? 'ACTIVO' : 'INACTIVO';
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

export const BitacoraDetalleTable = forwardRef(BitacoraDetalleTableComponent);
