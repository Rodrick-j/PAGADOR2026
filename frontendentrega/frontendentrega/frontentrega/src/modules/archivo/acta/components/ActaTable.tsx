import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { useIsMounted } from 'hooks/useIsMounted';
//components
import { TableHeader, UpdateParams, HeaderFilter, OnUpdateOptions, DataTableRefProps, DataTable, ActionColumn, StatusColumn } from 'components/core/DataTable';
import { FileItem } from 'components/core/FormDialog';
import { ConfirmDialog } from 'components/core/ConfirmDialog';
//@mui
import { Box, Chip, CircularProgress, IconButton, Tooltip } from '@mui/material';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { ActaModuleService } from 'modules/archivo/acta/ActaModuleService';
//hooks
import { ENUM_TIPO_ACTA } from 'constants/enums';
import { ENUM_COLOR_TIPO_ACTA } from 'constants/colors';
import { truncateText } from 'utils/formatText';
import { STORAGE_URL } from 'config/app-config';
import { addDays, differenceInCalendarDays, isValid, parse } from 'date-fns';

export type ActaTableModel = {
    id               : string;
    tipo             : string;
    descripcion      : string;
    cod_acta         : string;
    dias             : string;
    fecha_registro   : string;
    fecha_devolucion : string;
    documentos       : string[];
    adjuntos         : string;
    nombre           : string;
    area             : string;

    // para las columnas especiales
    actions: unknown;
    options?: unknown;
    retraso?: unknown;
};

export type ActaTableRefProps = {
    refresh: (updateParams?: UpdateParams<ActaTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<ActaTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const codigoFilter: HeaderFilter      = { type: 'text' };
const documentoFilter: HeaderFilter   = { type: 'text' };
const personalFilter: HeaderFilter    = { type: 'text' };
const areaFilter: HeaderFilter        = { type: 'text' };
const descripcionFilter: HeaderFilter = { type: 'text' };
const tipoFilter: HeaderFilter    = {
    type   : 'select',
    options: ENUM_TIPO_ACTA,
};

type Props = {
    onAddClick: () => void;
    onViewClick: (idActa: string) => Promise<void>;
    onEditClick: (idActa: string) => Promise<void>;
    onImprimirClick: (data: ActaTableModel) => void;
    onDevolucionClick: (data: ActaTableModel) => Promise<void>;
    loading: string;
};

export const ActaTableComponent = (props: Props, ref: React.Ref<ActaTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick, onImprimirClick, onDevolucionClick, loading } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();

    const [tableParams, setTableParams] = useState<UpdateParams<ActaTableModel>>(tableParamsInitialize);
    const [devolucionActa, setDevolucionActa] = useState<ActaTableModel | null>(null);
    const tableRef = useRef<DataTableRefProps>(null);

    const tableHeaders: TableHeader<ActaTableModel>[] = [
        { id: 'actions', label: 'Acciones', render: renderColumnActions, sort: false },
        { id: 'cod_acta', label: 'Cod. acta', sort: false, align: 'left', filter: codigoFilter },
        { id: 'tipo', label: 'Tipo', sort: false, align: 'left', filter: tipoFilter, render: renderColumnTipo },
        { id: 'documentos', label: 'Nro Documentos', sort: false, align: 'left', filter: documentoFilter, render: renderColumnDocumentos },
        { id: 'descripcion', label: 'Descripcion/ Observacion', sort: false, align: 'left', filter: descripcionFilter },
        { id: 'fecha_registro', label: 'Fecha Registro', sort: false, align: 'left' },
        { id: 'dias', label: 'Dias Devolucion', sort: false, align: 'center' },
        { id: 'nombre', label: 'Responsable/CI', sort: false, align: 'left', filter: personalFilter },
        { id: 'area', label: 'Area/Unidad/Secretaria', sort: false, align: 'left', filter: areaFilter },
        { id: 'adjuntos', label: 'Archivos Digitales', align: 'right', render: renderColumnAdjunto },
        {
            id: 'options',
            label: 'Opciones',
            sort: false,
            render: renderColumnOptions,
            width: 170,
        },
        {
            id: 'retraso',
            label: 'Retraso',
            sort: false,
            align: 'center',
            render: renderColumnRetraso,
            width: 150,
        },
    ];

    const handleUpdateTable = (params: UpdateParams<ActaTableModel>, opt: OnUpdateOptions) => {
        if (!isMounted()) return;
        const newParams = {
            ...params,
            filters: { ...params.filters },
        };
        opt.setLoading(true);
        ActaModuleService.getTableActa(newParams as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<ActaTableModel> = {
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

    function renderColumnOptions(data: ActaTableModel): ReactElement {
        return (<Box display="inline-flex">
                <Tooltip title="Imprimir">
                    <IconButton disabled={loading===data.id} onClick={() => onImprimirClick(data)} color="warning">
                        {loading===data.id ? <CircularProgress size={16}  />:<LocalPrintshopIcon />}
                    </IconButton>
                </Tooltip>
                {data.tipo === 'ACT_PRE' && (
                    <Tooltip title="Registrar devolucion">
                        <IconButton onClick={() => setDevolucionActa(data)} color="secondary">
                            <AssignmentReturnIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        );
    }

    function renderColumnActions(data: ActaTableModel): ReactElement {
        return (
            <Box display="flex" alignItems="center" justifyContent="center">
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
                onEditClick={data.tipo === 'ACT_PRE' ? () => onEditClick(data.id) : undefined}
                deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro?</div>
                        <br />
                        <div>
                            <strong>Nro: </strong> {data.cod_acta}
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return ActaModuleService.destroyActa(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Documento eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
            </Box>
        );
    }

    function renderColumnDocumentos(data: ActaTableModel): ReactElement {
        const documentos: string[] = data.documentos || [];
        return  <>
                    {
                        documentos.map((r: any, index) => (
                               <span key={index}> {r.nro}&nbsp;|&nbsp;</span>
                            )
                        )
                    }
                </>;
    }

    function renderColumnTipo(data: ActaTableModel): ReactElement {
        const tipo: string = ENUM_TIPO_ACTA.find((t) => t.value===data.tipo)?.label || "-";
        const color = 'white';
        const background = ENUM_COLOR_TIPO_ACTA[data.tipo];
        return <StatusColumn status={tipo} color={color} background={background} />;
    }

    function parseTableDate(value?: string): Date | null {
        if (!value) return null;
        const dateTime = parse(value, 'dd/MM/yyyy HH:mm', new Date());
        if (isValid(dateTime)) return dateTime;
        const date = parse(value, 'dd/MM/yyyy', new Date());
        return isValid(date) ? date : null;
    }

    function getDiasPermitidos(value: string): number {
        return Number(value.match(/\d+/)?.[0] || 0);
    }

    function renderColumnRetraso(data: ActaTableModel): ReactElement {
        const fechaRegistro = parseTableDate(data.fecha_registro);
        const diasPermitidos = getDiasPermitidos(data.dias);
        if (!fechaRegistro || diasPermitidos <= 0) return <span>-</span>;

        const fechaLimite = addDays(fechaRegistro, diasPermitidos);
        const fechaComparacion = parseTableDate(data.fecha_devolucion) || new Date();
        const diasRetraso = differenceInCalendarDays(fechaComparacion, fechaLimite);

        if (diasRetraso <= 0) return <span>-</span>;
        return <Chip color="error" size="small" label={`Retraso de ${diasRetraso} dias`} />;
    }

    function renderColumnAdjunto(tableModel: ActaTableModel): ReactElement {
        if (tableModel && (tableModel.adjuntos === 'null' ||
            (tableModel.adjuntos && JSON.parse(tableModel.adjuntos).length > 0 &&
             tableModel.adjuntos === '[]' ))) return (<></>);
        return (
            <React.Fragment>
                {
                    <Box display="flex" alignItems="left" flexDirection="column">
                        <div>
                            {JSON.parse(tableModel.adjuntos).map((item: FileItem) => {
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

    return (
        <>
            <ConfirmDialog
                title="Confirmar devolucion"
                message={
                    <div>
                        <div>Â¿Quiere registrar la devolucion de esta acta?</div>
                        <br />
                        <div>
                            <strong>Nro: </strong> {devolucionActa?.cod_acta}
                        </div>
                    </div>
                }
                open={Boolean(devolucionActa)}
                onAccept={async () => {
                    if (!devolucionActa) return;
                    return onDevolucionClick(devolucionActa).then(() => {
                        if (isMounted()) setDevolucionActa(null);
                    });
                }}
                onCancel={() => setDevolucionActa(null)}
            />
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

export const ActaTable = forwardRef(ActaTableComponent);
