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
import { truncateText } from 'utils/formatText';
import { STORAGE_URL } from 'config/app-config';
import { FileItem } from 'components/core/FormDialog';
import { Box, Chip } from '@mui/material';

export type HistorialTableModel = {
    index      : number;
    id         : string;
    fecha      : Date;
    descripcion: string;
    debe       : number;
    haber      : number;
    saldo      : number;
    estado     : boolean;
    adjuntos   : string;
    cuenta_id  : string;
    //campo qu viene de cuenta
    concepto_deuda : string;

    // para las columnas especiales
    actions: unknown;
};

export type HistorialTableRefProps = {
    refresh: (updateParams?: UpdateParams<HistorialTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<HistorialTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

type Props = {
    cuentaId: string;
    onComplete: () => void;
};

export const HistorialTableComponent = (props: Props, ref: React.Ref<HistorialTableRefProps>): ReactElement => {
    const { cuentaId, onComplete } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();
    const authUser = useSession();

    const { remove } = authUser.permisos;
    const [tableParams, setTableParams] = useState<UpdateParams<HistorialTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    const tableHeaders: TableHeader<HistorialTableModel>[] = [
       // { id: 'concepto_deuda', label: 'Concepto de Deuda', sort: false, align: 'left' },
        { id: 'fecha', label: 'Fecha Registro', sort: false, align: 'left' },
        { id: 'descripcion', label: 'Descripcion', sort: false, align: 'left' },
        { id: 'debe', label: 'Debe', sort: false, width: 95, align: 'right' },
        { id: 'haber', label: 'Haber', sort: false, width: 95, align: 'right' },
        { id: 'saldo', label: 'Saldo', sort: false, align: 'right' },
        { id: 'adjuntos', label: 'Doc. Adjuntos', align: 'right', render: renderColumnAdjunto },
    ];

    if (remove) {
        tableHeaders.splice(0, 0, { id: 'actions', label: 'Opcion', width: 80, align: 'left', sort: false, render: renderColumnActions });
    }

    const handleUpdateTable = (params: UpdateParams<HistorialTableModel>, opt: OnUpdateOptions) => {
        if (!isMounted()) return;
        const newParams = {
            ...params,
            filters: { ...params.filters, cuenta_id: cuentaId },
        };
        opt.setLoading(true);
        DeudaModuleService.getTableHistorial(newParams as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<HistorialTableModel> = {
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

    function renderColumnAdjunto(data: HistorialTableModel): ReactElement {
        if (data && (data.adjuntos === 'null' || (data.adjuntos && JSON.parse(data.adjuntos).length > 0 && data.adjuntos === '[]' ))) return (<></>);
        return (
            <React.Fragment>
                {
                    <Box display="flex" alignItems="left" flexDirection="column">
                        <div>
                            {JSON.parse(data.adjuntos).map((item: FileItem) => {
                                return (
                                    <Chip
                                        key={item.id}
                                        label={truncateText(item.fileName.replace(`${item.id}-`, ''))}
                                        component="a"
                                        onClick={() => {
                                            window.open(`${STORAGE_URL}/${item.fileName}`);
                                        }}
                                        sx={{ maxWidth: 280, mb: 1 }}
                                        variant="outlined"
                                    />
                                );
                            })}
                        </div>
                    </Box>
                }
            </React.Fragment>
        )
    }

    function renderColumnActions(data: HistorialTableModel): ReactElement {
        if(data.index===0) return <></>;
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
                    return DeudaModuleService.destroyHistorial(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Historial eliminado exitosamente');
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

export const HistorialTable = forwardRef(HistorialTableComponent);
