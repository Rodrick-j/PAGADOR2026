import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, ActionColumn, OnUpdateOptions, DataTableRefProps } from 'components/core/DataTable';
//@mui
import { Box } from '@mui/material';
//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { VacacionModuleService } from 'modules/rrhh/vacacion/VacacionModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { ENUM_GESTION_PERIODO, ENUM_TIPO_VACACION } from 'constants/enums';

export type VacacionTableModel = {
    id             : string;
    usuario        : string;
    ci             : string;
    gestion        : string;
    tipo_vacacion  : string;
    fecha_registro : string;
    fecha_ini      : string;
    fecha_fin      : string;
    dias_total     : number;
    dias_utilizados: number;
    dias_pendiente : number;
    estado         : string;
    jefe           : string;
    area           : string;

    // para las columnas especiales
    actions: unknown;
};


export type VacacionTableRefProps = {
    refresh: (updateParams?: UpdateParams<VacacionTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<VacacionTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const nombresFilter: HeaderFilter = { type: 'text' };
const ciFilter: HeaderFilter = { type: 'text' };
const gestionFilter: HeaderFilter    = { type: 'select', options: ENUM_GESTION_PERIODO };
const tipoVacacionFilter: HeaderFilter    = { type: 'select', options: ENUM_TIPO_VACACION };

type Props = {
    onAddClick: () => void;
    onVacacionClick: (idVacacion: string) => void;
    onViewClick: (idVacacion: string) => Promise<void>;
    onEditClick: (idVacacion: string) => Promise<void>;
};

export const VacacionTableComponent = (props: Props, ref: React.Ref<VacacionTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<VacacionTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<VacacionTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false, render: renderColumnActions, width: 140 },
        { id: 'usuario', label: 'Nombre Completo', align: 'left', width: 280, onCellClick: handleClickCell, filter: nombresFilter },
        { id: 'ci', label: 'CI', align: 'left', filter: ciFilter, width: 80 },
        { id: 'gestion', label: 'Gestion', align: 'left',  onCellClick: handleClickCell, width: 80, filter: gestionFilter },
        { id: 'tipo_vacacion', label: 'Tipo de Vacacion', align: 'left',  onCellClick: handleClickCell, width: 80, filter: tipoVacacionFilter },
        { id: 'dias_total', label: 'Dias Total', align: 'left',  onCellClick: handleClickCell, width: 80 },
        { id: 'dias_utilizados', label: 'Dias Utilizados', align: 'left',  onCellClick: handleClickCell, width: 80 },
        { id: 'dias_pendiente', label: 'Dias Pendiente', align: 'left',  onCellClick: handleClickCell, width: 80 },
        { id: 'fecha_registro', label: 'Fecha de Registro', align: 'left',  onCellClick: handleClickCell, width: 80 },
        { id: 'fecha_ini', label: 'Fecha Inicio', align: 'left',  onCellClick: handleClickCell, width: 80 },
        { id: 'fecha_fin', label: 'Fecha Fin', align: 'left',  onCellClick: handleClickCell, width: 80 },
        { id: 'jefe', label: 'Jefe Inmediato', align: 'left',  onCellClick: handleClickCell },
        { id: 'area', label: 'Area', align: 'left',  onCellClick: handleClickCell },
    ];


    function handleClickCell(data: VacacionTableModel) {
        props.onVacacionClick(data.id);
    }

    const handleUpdateTable = (params: UpdateParams<VacacionTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        VacacionModuleService.getTableVacacion(params as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<VacacionTableModel> = {
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

    function renderColumnActions(data: VacacionTableModel): ReactElement {
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
                deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro?</div>
                        <br />
                        <div>
                            <strong>Nombre: </strong> {data.usuario}
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return VacacionModuleService.destroyVacacion(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Vacacion eliminado exitosamente');
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

export const VacacionTable = forwardRef(VacacionTableComponent);
