import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { format } from 'date-fns';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, StatusColumn, ActionColumn, OnUpdateOptions, DataTableRefProps, ActiveColumn } from 'components/core/DataTable';
//@mui
import { Box } from '@mui/material';
//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { PersonalModuleService } from 'modules/rrhh/personal/PersonalModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { ESTADO_A } from 'constants/colors';

export type PersonalTableModel = {
    id                    : string;
    nombres               : string;
    apellido_paterno      : string;
    apellido_materno      : string;
    ci                    : string;
    fecha_nacimiento      : string;
    fecha_ingreso         : string;
    profesion             : string;
    telefono              : string;
    activo                : boolean;
    fecha_presentacion_cas: string;
    anhos_antiguedad_gador: number;
    anhos_antiguedad_cas  : number;
    meses_antiguedad_cas  : number;
    dias_antiguedad_cas   : number;
    cargo                 : string;
    area                  : string;
    item_contrato?        : string;       

    // para las columnas especiales
    actions: unknown;
};


export type PersonalTableRefProps = {
    refresh: (updateParams?: UpdateParams<PersonalTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<PersonalTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const nombresFilter: HeaderFilter = { type: 'text' };
const itemContratoFilter: HeaderFilter = { type: 'text' };
const apellidoPaternoFilter: HeaderFilter = { type: 'text' };
const ciFilter: HeaderFilter = { type: 'text' };

const FORMAT_DAY= 'dd/MM/yyyy';

type Props = {
    onAddClick: () => void;
    onViewClick: (idPersonal: string) => Promise<void>;
    onEditClick: (idPersonal: string) => Promise<void>;
};

export const PersonalTableComponent = (props: Props, ref: React.Ref<PersonalTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<PersonalTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<PersonalTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false, render: renderColumnActions },
        { id: 'activo', label: 'Activo', align: 'center', width: 80, render: renderColumnActive },
        { id: 'nombres', label: 'Nombres', align: 'left', filter: nombresFilter },
        { id: 'apellido_paterno', label: 'Ap. Paterno', align: 'left', filter: apellidoPaternoFilter },
        { id: 'apellido_materno', label: 'Ap. Materno', align: 'left' },
        { id: 'fecha_ingreso', label: 'Fecha Ingreso', align: 'left', render: renderColumnFechaIngreso },
        { id: 'cargo', label: 'Cargo', align: 'left' , filter: apellidoPaternoFilter},
        { id: 'item_contrato', label: 'Item/Contrato', filter: itemContratoFilter },
        { id: 'area', label: 'Area', align: 'left',filter: apellidoPaternoFilter },
        { id: 'ci', label: 'CI', align: 'left', filter: ciFilter },
        { id: 'fecha_nacimiento', label: 'Fecha Nac.', align: 'left', render: renderColumnFechaNacimiento },
        { id: 'profesion', label: 'Profesion', align: 'left' },
        { id: 'telefono', label: 'Telefono', align: 'left' },
        { id: 'fecha_presentacion_cas', label: 'Fecha Presentacion CAS', align: 'left' },
        { id: 'anhos_antiguedad_gador', label: 'Años antiguedad GADOR', align: 'left' },
        { id: 'anhos_antiguedad_cas', label: 'Años antiguedad CAS', align: 'left' },
        /* { id: 'meses_antiguedad_cas', label: 'Meses antiguedad CAS', align: 'left' },
        { id: 'dias_antiguedad_cas', label: 'Dias antiguedad CAS', align: 'left' }, */
        { id: 'activo', label: 'Estado', align: 'left', render: renderColumnStatus }
    ];

    const handleUpdateTable = (params: UpdateParams<PersonalTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        PersonalModuleService.getTablePersonal(params as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<PersonalTableModel> = {
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

    function renderColumnFechaNacimiento(tableModel: PersonalTableModel): ReactElement {
        return <Box sx={{ textAlign: 'left' }}>{format(new Date(tableModel.fecha_nacimiento), FORMAT_DAY).toString()}</Box>;
    }

    function renderColumnFechaIngreso(tableModel: PersonalTableModel): ReactElement {
        return tableModel.fecha_ingreso?<Box sx={{ textAlign: 'left' }}>{format(new Date(tableModel.fecha_ingreso), FORMAT_DAY).toString()}</Box>: <></>;
    }

    function renderColumnActive(data: PersonalTableModel): ReactElement {
        return (
            <ActiveColumn
                active={data.activo}
                onActiveChange={async (newValue: any) => {
                    return PersonalModuleService.setActivePersonal(data.id, newValue).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Estado actualizado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnActions(data: PersonalTableModel): ReactElement {
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
                deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro?</div>
                        <br />
                        <div>
                            <strong>Nombre: </strong> {data.nombres}
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return PersonalModuleService.destroyPersonal(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Personal eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnStatus(data: PersonalTableModel): ReactElement {
        const color = 'white';
        const background = data.activo? ESTADO_A[0] : ESTADO_A[1];
        const estado = data.activo?'ACTIVO':'INACTIVO';
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

export const PersonalTable = forwardRef(PersonalTableComponent);
