import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, StatusColumn, ActionColumn, OnUpdateOptions, DataTableRefProps, ActiveColumn } from 'components/core/DataTable';
//@mui
import { Box, CircularProgress, Chip, IconButton, Typography, Tooltip, Badge } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';
import PrintIcon from '@mui/icons-material/Print';
//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { CuentaModuleService } from 'modules/conta/cuenta/CuentaModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { ENUM_COLOR_TIPO_CUENTA, ESTADO_A } from 'constants/colors';
import { ENUM_GESTION, ENUM_MOTIVO_DEUDA, ENUM_SINCON_PROCESO, ENUM_TIPO_CUENTA } from 'constants/enums';
import { FileItem } from 'components/core/FormDialog';
import { truncateText } from 'utils/formatText';
import { STORAGE_URL } from 'config/app-config';


export type CuentaTableModel = {
    id                      : string;
    nombre_deudor           : string;
    tipo_cuenta             : string;
    ci                      : string;
    gestion_generacion_deuda: string;
    documentacion_respaldo  : string;
    direccion_domicilio     : string;
    telefono_celular        : string;
    confirmacion            : string;
    descripcion_confirmacion: string;
    incremento_deuda        : string;
    monto_incremento_deuda  : number;
    depositos_realizados    : string;
    observacion             : string;
    saldo                   : number;
    cantidad_activos        : number;
    estado                  : boolean;
    adjuntos                : string;
    descripcion_deuda       : string;
    estado_deuda            : string;
    cantidad_anios          : string;
    detalle_gestion_deuda   : string;
    motivo_deuda            : string;
    estado_envio            : { estado: boolean; dias: number };

    estado_proceso: string;
    activo        : boolean;

    // para las columnas especiales
    actions : unknown;
    options?: unknown;
};


export type CuentaTableRefProps = {
    refresh: (updateParams?: UpdateParams<CuentaTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<CuentaTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const nombresFilter: HeaderFilter       = { type: 'text' };
const ciFilter: HeaderFilter            = { type: 'text' };
const descripcionFilter: HeaderFilter   = { type: 'text' };
const gestionFilter: HeaderFilter       = { type: 'select', options: ENUM_GESTION };
const motivoFilter: HeaderFilter        = { type: 'select', options: ENUM_MOTIVO_DEUDA };
const estadoProcesoFilter: HeaderFilter = { type: 'select', options: ENUM_SINCON_PROCESO };

type Props = {
    onAddClick                      ?: () => void;
    onViewClick                      : (idCuenta: string) => Promise<void>;
    onEditClick                      : (idCuenta: string) => Promise<void>;
    onDetalleClick                   : (idCuenta: string) => void;
    onDetalle2Click                 ?: (idCuenta: string) => void;
    onImprimirReporteIndividualClick : (data: CuentaTableModel) => void;
    onImprimirSeguimientoClick?      : (data: CuentaTableModel) => void;
    onDownloadClick                 ?: () => void;
    tipoCuenta                       : string;
    loading                          : boolean;
    loading2                         : string;
    loading3?                        : string;
};

export const CuentaTableComponent = (props: Props, ref: React.Ref<CuentaTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick, onDetalleClick, onDetalle2Click, onDownloadClick, onImprimirReporteIndividualClick, onImprimirSeguimientoClick, tipoCuenta, loading, loading2, loading3 } = props;

    const notify = useNotify();
    const isMounted = useIsMounted();

    const [tableParams, setTableParams] = useState<UpdateParams<CuentaTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<CuentaTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false, render: renderColumnActions, width: 160 },
        { id: 'activo', label: 'Activo', align: 'center', width: 80, render: renderColumnActive },
        { id: 'nombre_deudor', label: 'Nombre Deudor', align: 'left', filter: nombresFilter, width: 180 },
        { id: 'ci', label: 'Codigo Identidad', align: 'left', filter: ciFilter },
        { id: 'tipo_cuenta', label: 'Tipo de Cuenta', align: 'left', render: renderColumnTipoCuenta, width: 150 },
        { id: 'motivo_deuda', label: 'Motivo de Deuda', align: 'left', filter: motivoFilter, width: 150, render: renderColumnMotivo },
        { id: 'gestion_generacion_deuda', label: 'Gestion Generacion Deuda', width: 150, align: 'center', filter: gestionFilter },
        { id: 'cantidad_anios', label: 'Numero de Años Deuda', align: 'center', width: 150 },
        { id: 'descripcion_deuda', label: 'Descripcion Deuda', align: 'left', width: 200, filter: descripcionFilter, render: renderColumnDescripcion },
        { id: 'detalle_gestion_deuda', label: 'Detalle Años Deuda', align: 'center', width: 150 },
        { id: 'estado_proceso', label: 'Estado Proceso', align: 'left', filter: estadoProcesoFilter, render: renderColumnEstadoProceso },
        { id: 'cantidad_activos', label: 'Cantidad', align: 'center' },
        { id: 'saldo', label: 'Saldo Real Deuda', align: 'right' ,width: 150},
        { id: 'adjuntos', label: 'Doc. Adjuntos', align: 'right', render: renderColumnAdjunto },
        { id: 'estado', label: 'Estado', align: 'left', render: renderColumnStatus, width: 120 },
        { id: 'options', label: 'Opciones', sort: false, render: renderColumnOptions },
    ];

    const handleUpdateTable = (params: UpdateParams<CuentaTableModel>, opt: OnUpdateOptions) => {
        if (!isMounted()) return;
        const newParams = {
            ...params,
            filters: { ...params.filters, tipo_cuenta: tipoCuenta },
        };
        opt.setLoading(true);
        CuentaModuleService.getTableCuenta(newParams as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<CuentaTableModel> = {
                ...params,
                rows: result.rows || [],
                count: result.count || 0
            };
            if (isMounted()) setTableParams(newTableParams);
        });
    };



    function renderColumnDescripcion(tableModel: CuentaTableModel): ReactElement {
        return (
            <React.Fragment>
                <Box display='inline-block' overflow='hidden' width='150px'>
                        <Typography variant="caption" sx={{fontSize: '10px'}}>{tableModel.descripcion_deuda}</Typography>
                </Box>
            </React.Fragment>
        );
    }

    function renderColumnMotivo(tableModel: CuentaTableModel): ReactElement {
        return (
            <React.Fragment>
                <Typography variant="caption" component='div' sx={{fontSize: '10px'}}>
                    {
                        tableModel.motivo_deuda.split('-').map((r: any, index) => (
                                <p
                                    key={index}
                                    style={{ fontWeight: index % 2 === 0 ? 'bold' : 'normal' }}
                                >
                                    -&nbsp;&nbsp;{r}
                                </p>
                            )
                        )
                    }
                </Typography>
            </React.Fragment>
        );
    }

    function renderColumnEstadoProceso(data: CuentaTableModel): ReactElement {
        const estado_proceso: string = ENUM_SINCON_PROCESO.find((t) => t.value===data.estado_proceso)?.label || "-";
        return (
            <React.Fragment>
                <Typography variant="caption">{estado_proceso}</Typography>
            </React.Fragment>
        );
    }

    function renderColumnTipoCuenta(data: CuentaTableModel): ReactElement {
        const tipo: string = ENUM_TIPO_CUENTA.find((t) => t.value===data.tipo_cuenta)?.label || "-";
        const color = 'white';
        const background = ENUM_COLOR_TIPO_CUENTA[data.tipo_cuenta];
        return <StatusColumn status={tipo} color={color} background={background} />;
    }

    function renderColumnAdjunto(data: CuentaTableModel): ReactElement {
        if (data && (data.adjuntos === 'null' || (data.adjuntos && JSON.parse(data.adjuntos).length > 0 && data.adjuntos === '[]' ))) return (<></>);
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
                filters: { ...tableParams.filters, tipo_cuenta: tipoCuenta },
            };
            return newParams;
        }
    });

    useImperativeHandle(ref, tableRefHandler, [tableParams]);

    function renderColumnActions(data: CuentaTableModel): ReactElement {
        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
                onEditClick={() => onEditClick(data.id)}
                deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro?</div>
                        <br />
                        <div>
                            <strong>Nombre: </strong> {data.ci}
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return CuentaModuleService.destroyCuenta(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Cuenta eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnActive(data: CuentaTableModel): ReactElement {
        return (
            <ActiveColumn
                active={data.estado}
                onActiveChange={async (newValue: any) => {
                    return CuentaModuleService.setActiveCuenta(data.id, newValue).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Estado actualizado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnStatus(data: CuentaTableModel): ReactElement {
        const color = 'white';
        const background = data.estado? ESTADO_A[0] : ESTADO_A[1];
        const estado = data.estado?'ACTIVO':'INACTIVO';
        return <StatusColumn status={estado} color={color} background={background} />;
    }

    function renderColumnOptions(data: CuentaTableModel): ReactElement {
        return (
            <Box display='flex' flexDirection='row'>
                <Tooltip title="Detalle Cuenta">
                    <IconButton size="small" onClick={() => onDetalleClick(data.id)} color="info">
                        <ListAltIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Imprimir reporte Individual">
                    <IconButton size="small" disabled={loading2===data.id} onClick={() => onImprimirReporteIndividualClick(data)} color="error">
                        {loading2===data.id ? <CircularProgress size={16}  />:<PictureAsPdfIcon />}
                    </IconButton>
                </Tooltip>
                {
                    onDetalle2Click && <Tooltip title="Seguimiento Cuenta">
                                            <IconButton size="small" onClick={() => onDetalle2Click(data.id)} color="secondary">
                                                <VerticalSplitIcon />
                                            </IconButton>
                                        </Tooltip>
                }
                {
                   <IconButton size="small" disabled={loading2===data.id} onClick={() => onImprimirSeguimientoClick && onImprimirSeguimientoClick(data)} color="success">
                    {
                        loading3===data.id ? <CircularProgress size={16}  />
                                            : data.estado_envio ? <Badge badgeContent={data.estado_envio.dias} color="error" invisible={!data.estado_envio.estado}>
                                                                    <PrintIcon color="action" />
                                                                </Badge> : <PrintIcon color="inherit" />
                    }
                    </IconButton>
                }
            </Box>
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

export const CuentaTable = forwardRef(CuentaTableComponent);
