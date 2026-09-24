import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { useIsMounted } from 'hooks/useIsMounted';
//components
import { DataTableV2, TableHeader, UpdateParams, HeaderFilter, OnUpdateOptions, DataTableRefProps, StatusColumn, ActiveColumn } from 'components/core/DataTable';
import Cardify from 'components/Cardify';
import { MoreMenu } from 'components/core/MoreMenu';
//@mui
import { Box, Stack, Typography } from '@mui/material';
//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { DeudaModuleService } from 'modules/conta/deuda/DeudaModuleService';
import { cuentaProps } from '../DeudaModule';
//hooks
import { sanitizeStringToNumber } from 'utils';
import { ESTADO_A } from 'constants/colors';
import { ENUM_DEUDA } from 'constants/enums';
import { useSession } from 'hooks/session';

export type DeudaTableModel = {
    index         : number;
    id            : string;
    titulo        : string;
    cod_activo    : string;
    descripcion   : string;
    estado        : boolean;
    gestion_deuda : string;
    monto_deuda   : number;
    cuenta_id     : string;

    // para las columnas especiales
    activo       : boolean;
    actions      : unknown;
};

export type DeudaTableRefProps = {
    refresh: (updateParams?: UpdateParams<DeudaTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<DeudaTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const codFilter: HeaderFilter = { type: 'text' };
const descripcionFilter: HeaderFilter = { type: 'text' };

type Props = {
    onAddClick: () => void;
    onRegularizarClick: (ids: string[]) => void;
    onViewClick: (idDeuda: string) => Promise<void>;
    onEditClick: (idDeuda: string) => Promise<void>;
    cuentaId: string;
    data: cuentaProps | null;
};

export const DeudaTableComponent = (props: Props, ref: React.Ref<DeudaTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick, onRegularizarClick, cuentaId, data } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const authUser = useSession();

    //const { approve } = authUser.permisos;
    const [tableParams, setTableParams] = useState<UpdateParams<DeudaTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    const tableHeaders: TableHeader<DeudaTableModel>[] = [
        { id: 'actions', label: '', render: renderColumnActions, sort: false, width: 60 },
      //  { id: 'cod_activo', label: 'Cod. Deuda', sort: false, width: 120, align: 'left' },
        { id: 'gestion_deuda', label: 'Gestion Deuda', sort: false, width: 80, align: 'left', filter: codFilter },
        { id: 'titulo', label: 'Concepto Deuda', sort: false, width: 120, align: 'left', filter: codFilter },
        { id: 'monto_deuda', label: 'Monto Deuda', sort: false, width: 100, align: 'left' },
        { id: 'descripcion', label: 'Descripcion Deuda', sort: false, width: '100%', align: 'left', filter: descripcionFilter, render: renderColumnDescripcion  },
        { id: 'estado', label: 'Estado', sort: false, align: 'left', render: renderColumnStatus },
    ];

    /*if (approve) {
        tableHeaders.splice(4, 0, { id: 'activo', label: 'Activo', align: 'center', width: 80, render: renderColumnActive });
    }*/

    const handleUpdateTable = (params: UpdateParams<DeudaTableModel>, opt: OnUpdateOptions) => {
        if (!isMounted()) return;
        const newParams = {
            ...params,
            filters: { ...params.filters, cuenta_id: cuentaId },
        };
        opt.setLoading(true);
        DeudaModuleService.getTableDeuda(newParams as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<DeudaTableModel> = {
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

    function renderColumnActive(data: DeudaTableModel): ReactElement {
        if(data.index<=0 || !data.estado) return <></>;
        return (
            <ActiveColumn
                active={data.estado}
                onActiveChange={async (newValue: any) => {
                    return DeudaModuleService.setActiveDeuda(data.id, newValue).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Estado actualizado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnDescripcion(data: DeudaTableModel): ReactElement {
        return (
            <React.Fragment>
                <Box display='inline-block' overflow='hidden' width='150px'>
                        <Typography variant="caption" sx={{fontSize: '10px'}}>{data.descripcion}</Typography>
                </Box>
            </React.Fragment>
        );
    }

    function renderColumnActions(data: DeudaTableModel): ReactElement {
        if(data.index<=0 || !data.estado) return <></>;
        return (
            <MoreMenu
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
                deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro?</div>
                        <br />
                        <div>
                            <strong>Titulo: </strong> {data.titulo}
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return DeudaModuleService.destroyDeuda(data.id).then((result) => {

                        if (!result.success) return notify.error(result.msg);
                        notify.success('Deuda eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
                size='small'
            />
        );
    }

    function renderColumnStatus(data: DeudaTableModel): ReactElement {
        const color = 'white';
        const background = data.estado? ESTADO_A[0] : ESTADO_A[1];
        const texto = data.estado? ENUM_DEUDA[0]:ENUM_DEUDA[1];
        return <StatusColumn status={texto} color={color} background={background} />;
    }

    return (
        <>
            <Box p={1} pb={0}>
                {
                    data ?
                        <Stack direction={"row"} spacing={1} mb={1}>
                            <Cardify
                                title={"NOMBRE: "+data?.nombre_deudor || ""}
                                subtitle={"TIPO DE CUENTA: "+data?.tipo_cuenta || ""}
                                description={"SALDO REAL: "+sanitizeStringToNumber(data?.saldo || 0.00)+" Bs." || ""}
                                color={"info"}
                                icon={"bi:cash-coin"}
                            />
                            <Cardify
                                title={"GESTION: "+data?.gestion_generacion_deuda || ""}
                                subtitle={"CONFIRMACION DE SALDOS: "+data?.confirmacion || ""}
                                description={"DEPOSITOS REALIZADOS: "+data?.depositos_realizados || ""}
                                color={"success"}
                                icon={"majesticons:checkbox-list-detail-line"}
                            />
                        </Stack>
                        :<Typography variant="subtitle1" component="span">Cargando...</Typography>
                }
            </Box>
            <DataTableV2
                ref={tableRef}
                headers={tableHeaders}
                updateParams={tableParams}
                onUpdate={handleUpdateTable}
                onActionAddClick={onAddClick}
                onActionOption1Click={onRegularizarClick}
                vScroll
            />
        </>
    );
};

export const DeudaTable = forwardRef(DeudaTableComponent);
