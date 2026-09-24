import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, ActionColumn, OnUpdateOptions, DataTableRefProps } from 'components/core/DataTable';
//@mui
import { Box, IconButton, Tooltip } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';

//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { BitacoraViajeModuleService } from 'modules/bsss/bitacora_viaje/BitacoraViajeModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';

export type BitacoraViajeTableModel = {
    id       : string;
    semana   : number;
    area_id  : string;
    vehiculo_id : string;
    usuario_id : string;
    area_nombre? : string;
    vehiculo_nombre? : string;
    usuario_nombre? : string;
    // para las columnas especiales
    actions: unknown;
    options?: unknown;
};


export type BitacoraViajeTableRefProps = {
    refresh: (updateParams?: UpdateParams<BitacoraViajeTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<BitacoraViajeTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const nombresFilter: HeaderFilter = { type: 'text' };

type Props = {
    onAddClick: () => void;
    onViewClick: (idBitacoraViaje: string) => Promise<void>;
    onEditClick: (idBitacoraViaje: string) => Promise<void>;
    onDetalleClick: (idBitacoraViaje: string, semana: number) => void;
};

export const BitacoraViajeTableComponent = (props: Props, ref: React.Ref<BitacoraViajeTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick, onDetalleClick } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<BitacoraViajeTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<BitacoraViajeTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false, render: renderColumnActions, width: 100 },
        { id: 'semana', label: 'Semana', align: 'left', filter: nombresFilter,width: 120 },        
        { id: 'area_nombre', label: 'Area/Secretaria/Unidad', align: 'left', width: 230 },
        { id: 'vehiculo_nombre', label: 'Vehiculo', align: 'left' ,  width: 80},
        { id: 'usuario_nombre', label: 'Usuario', align: 'left', width: 200 },
        { id: 'options', label: 'Opciones', sort: false, render: renderColumnOptions, width: 90 }
    ];

    const handleUpdateTable = (params: UpdateParams<BitacoraViajeTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        BitacoraViajeModuleService.getTableBitacoraViaje(params as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<BitacoraViajeTableModel> = {
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
            
    function renderColumnActions(data: BitacoraViajeTableModel): ReactElement {
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
                deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro?</div>
                        <br />
                        <div>
                            <strong>Nombre: </strong> {data.semana}
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return BitacoraViajeModuleService.destroyBitacoraViaje(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('BitacoraViaje eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnOptions(data: BitacoraViajeTableModel): ReactElement {
        return (
            <Box display="inline-flex">
                <Tooltip title="Detalle">
                    <IconButton size="small" onClick={() => onDetalleClick(data.id, data.semana)} color="info">
                        <ListAltIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        );
    }

   /* function renderColumnStatus(data: BitacoraViajeTableModel): ReactElement {
        const color = 'white';
        const background = data.estado? ESTADO_A[0] : ESTADO_A[1];
        const estado = data.estado?'ACTIVO':'INACTIVO';
        return <StatusColumn status={estado} color={color} background={background} />;
    }    */

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

export const BitacoraViajeTable = forwardRef(BitacoraViajeTableComponent);
