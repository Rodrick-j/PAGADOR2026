import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, StatusColumn, ActionColumn, OnUpdateOptions, DataTableRefProps } from 'components/core/DataTable';
//@mui
import { Box, CircularProgress, Chip, IconButton, Typography } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { SeguimientoModuleService } from 'modules/conta/seguimiento/SeguimientoModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { ESTADO_A } from 'constants/colors';
import { FileItem } from 'components/core/FormDialog';
import { truncateText } from 'utils/formatText';
import { STORAGE_URL } from 'config/app-config';

export type SeguimientoTableModel = {
    id         : string;
    fecha      : string;
    dias       : number;
    descripcion: string;
    observacion: string;
    estado     : boolean;
    adjuntos   : string;

    // para las columnas especiales
    actions: unknown;
    options?: unknown;
};


export type SeguimientoTableRefProps = {
    refresh: (updateParams?: UpdateParams<SeguimientoTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<SeguimientoTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const descripcionFilter: HeaderFilter   = { type: 'text' };

type Props = {
    onAddClick     ?: () => void;
    onEditClick     : (idSeguimiento: string) => Promise<void>;
    onDownloadClick?: () => void;
    cuentaId        : string;
    loading         : boolean;
};

export const SeguimientoTableComponent = (props: Props, ref: React.Ref<SeguimientoTableRefProps>): ReactElement => {
    const { onAddClick, onEditClick, onDownloadClick, cuentaId, loading } = props;

    const notify = useNotify();
    const isMounted = useIsMounted();

    const [tableParams, setTableParams] = useState<UpdateParams<SeguimientoTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<SeguimientoTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false, render: renderColumnActions, width: 160 },
        { id: 'fecha', label: 'Fecha registro', align: 'left' },
        { id: 'descripcion', label: 'Descripcion', align: 'left', width: 200, filter: descripcionFilter, render: renderColumnDescripcion },
        { id: 'observacion', label: 'Observacion', align: 'left' },
        { id: 'dias', label: 'Dias', align: 'center' },
        { id: 'adjuntos', label: 'Doc. Adjuntos', align: 'right', render: renderColumnAdjunto },
        { id: 'options', label: 'Opciones', sort: false, render: renderColumnOptions },
    ];

    const handleUpdateTable = (params: UpdateParams<SeguimientoTableModel>, opt: OnUpdateOptions) => {
        if (!isMounted()) return;
        const newParams = {
            ...params,
            filters: { ...params.filters, cuenta_id: cuentaId },
        };
        opt.setLoading(true);
        SeguimientoModuleService.getTableSeguimiento(newParams as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<SeguimientoTableModel> = {
                ...params,
                rows: result.rows || [],
                count: result.count || 0
            };
            if (isMounted()) setTableParams(newTableParams);
        });
    };

    function renderColumnDescripcion(tableModel: SeguimientoTableModel): ReactElement {
        return (
            <React.Fragment>
                <Box display='inline-block' overflow='hidden' width='150px'>
                    <Typography variant="caption" sx={{fontSize: '12px'}}>{tableModel.descripcion}</Typography>
                </Box>
            </React.Fragment>
        );
    }

    function renderColumnAdjunto(data: SeguimientoTableModel): ReactElement {
        if (data && (data.adjuntos === 'null' ||
            (data.adjuntos && JSON.parse(data.adjuntos).length > 0 &&
             data.adjuntos === '[]' ))) return (<></>);
        return (
            <React.Fragment>
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
            </React.Fragment>
        );
    }

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
                filters: { ...tableParams.filters },
            };
            return newParams;
        }
    });

    useImperativeHandle(ref, tableRefHandler, [tableParams]);

    function renderColumnActions(data: SeguimientoTableModel): ReactElement {
        return (
            <ActionColumn
                onEditClick={() => onEditClick(data.id)}
                deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro?</div>
                        <br />
                        <div>
                            <strong>Nombre: </strong> {data.descripcion}
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return SeguimientoModuleService.destroySeguimiento(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Cuenta eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnOptions(data: SeguimientoTableModel): ReactElement {
        return (
            <>

            </>
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
                onDownloadClick={onDownloadClick}
                isLoading={loading}
                vScroll
            />
        </>
    );
};

export const SeguimientoTable = forwardRef(SeguimientoTableComponent);
