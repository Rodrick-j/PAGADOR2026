import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, StatusColumn, OnUpdateOptions, DataTableRefProps } from 'components/core/DataTable';
//@mui
import { Box, CircularProgress, IconButton, Typography } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
//services
import { QueryParams } from 'services/base/Types';
//model
import { ReporteProcesoModuleService } from '../ReporteProcesoModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';

import { ENUM_ESTADOS_C, ENUM_TIPO_CONTRA2 } from 'constants/enums';
import { ESTADO_J } from 'constants/colors';
import { Block } from '@mui/icons-material';
import { getAvatarURL } from 'utils';



export type ReporteProcesoTableModel = {
    id    : string;
    area                  : string;
    tipo?                 : string;
    secretaria?           : string;
    entidad_convocante    : string;
    modalidad_descripcion : string;
    codigo_interno_entidad: string;
    cuce                  : string;
    objeto_contratacion   : string;
    hoja_ruta             : string;
    solicitante           : string;
    responsable           : string;
    juridica              : string;
    area2                 : string;
    area3                 : string;
    imagen                : string;
    imagen2               : string;
    imagen3               : string;

    fecha_registro        : Date;
    gestion               : string;
    estado                : string;
    estado_activo : string;

    // para las columnas especiales
    actions: unknown;
    options?: unknown;
    activos?:unknown;
};


export type ReporteProcesoTableRefProps = {
    refresh: (updateParams?: UpdateParams<ReporteProcesoTableModel>) => void;
    getQueryParams: () => QueryParams;
};



export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<ReporteProcesoTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const areaFilter: HeaderFilter                  = { type: 'text' };
const tipoFilter: HeaderFilter                  = { type: 'select', options: ENUM_TIPO_CONTRA2 };
const responsableConvocanteFilter: HeaderFilter = { type: 'text' };
const objetoContratacionFilter: HeaderFilter    = { type: 'text' };
const solicitanteConvocanteFilter: HeaderFilter = { type: 'text' };
const juridicaConvocanteFilter: HeaderFilter    = { type: 'text' };
const cuceFilter: HeaderFilter                  = { type: 'text' };
const codigoFilter: HeaderFilter                = { type: 'text' };
const hojaRutaFilter: HeaderFilter              = { type: 'text' };
const nombreModalidadFilter: HeaderFilter       = { type: 'text' };
const statusFilter: HeaderFilter                = { type: 'select', options: ENUM_ESTADOS_C };

type Props = {
    onDetalleClick  : (idProceso: string) => void;
    onImprimirClick : (data: ReporteProcesoTableModel) => void;
    onDownloadClick?: () => void;
    loading         : string;
    loading1        : boolean;
};

export const ReporteProcesoTableComponent = (props: Props, ref: React.Ref<ReporteProcesoTableRefProps>): ReactElement => {
    const { onDetalleClick, onImprimirClick, onDownloadClick, loading, loading1 } = props;
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<ReporteProcesoTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<ReporteProcesoTableModel>[] = [
        { id: 'cuce', label: 'CUCE', align: 'left', filter: cuceFilter, width: 180 },
        { id: 'codigo_interno_entidad', label: 'Codigo Interno', align: 'left', filter: codigoFilter, width: 180 },
        { id: 'area', label: 'Unidad Solicitante', align: 'left', filter: areaFilter, width: 180 },
        { id: 'modalidad_descripcion', label: 'Modalidad de contratacion', width: 180, align: 'left', filter: nombreModalidadFilter },
        { id: 'fecha_registro', label: 'Fecha de Registro', align: 'left', width: 150 },
        { id: 'objeto_contratacion', label: 'Objeto de la Contratacion', align: 'left', width: 350, filter: objetoContratacionFilter },
        { id: 'hoja_ruta', label: 'Hoja de Ruta', align: 'left', filter: hojaRutaFilter, width: 180 },
        { id: 'tipo', label: 'Tipo', align: 'left', filter: tipoFilter, width: 80 },
        { id: 'responsable', label: 'Responsable Proceso', align: 'left', render: renderColumnResponsable, filter: responsableConvocanteFilter, width: 250 },
        { id: 'solicitante', label: 'Tecnico a cargo', align: 'left', render: renderColumnSolicitante, filter: solicitanteConvocanteFilter, width: 250 },
        { id: 'juridica', label: 'Tecnico Juridica', align: 'left', render: renderColumnJuridica, filter: juridicaConvocanteFilter, width: 250 },
        {
            id: 'options',
            label: 'Opciones',
            sort: false,
            render: renderColumnOptions
        },
        { id: 'estado', label: 'Estado', filter: statusFilter, align: 'left', render: renderColumnStatus },
    ];

    function renderColumnStatus(data: ReporteProcesoTableModel): ReactElement {
        const estado = data.estado_activo;
        const color = 'white';
        const background = ESTADO_J[estado];
        const texto = estado;
        return <StatusColumn status={texto} color={color} background={background} />;
    }

    const handleUpdateTable = (params: UpdateParams<ReporteProcesoTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        ReporteProcesoModuleService.getTableReporteProceso(params as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<ReporteProcesoTableModel> = {
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

    function renderColumnSolicitante(tableModel: ReporteProcesoTableModel): ReactElement {
        const imagen = tableModel.imagen;
        return  (
            <Box display="flex" flexDirection="row" alignContent="space-evenly" >
                <Box
                    component="img"
                    alt={tableModel.solicitante}
                    src={getAvatarURL(imagen)}
                    sx={{ width: 32, height: 32, borderRadius: 1.2, flexShrink: 0, mr: 1 }}
                />
                <Box display="flex" flexDirection="column">
                    <Typography variant="subtitle2">{tableModel.solicitante}</Typography>
                    <Typography color="tertiary" variant="caption" sx={{ fontSize: '10px'}}>{tableModel.area}</Typography>
                </Box>
            </Box>
        );
    }

    function renderColumnResponsable(tableModel: ReporteProcesoTableModel): ReactElement {
        const imagen = tableModel.imagen2;
        return  (
            <Box display="flex" flexDirection="row" alignContent="space-evenly" >
                <Box
                    component="img"
                    alt={tableModel.responsable}
                    src={getAvatarURL(imagen)}
                    sx={{ width: 32, height: 32, borderRadius: 1.2, flexShrink: 0, mr: 1 }}
                />
                <Box display="flex" flexDirection="column">
                    <Typography variant="subtitle2">{tableModel.responsable}</Typography>
                    <Typography color="tertiary" variant="caption" sx={{ fontSize: '10px'}}>{tableModel.area2}</Typography>
                </Box>
            </Box>
        );
    }


    function renderColumnJuridica(data: ReporteProcesoTableModel): ReactElement {
        const imagen = data.imagen3;
        return  (
            <Box display="flex" flexDirection="row" alignContent="space-evenly" >
                <Box
                    component="img"
                    alt={data.juridica}
                    src={getAvatarURL(imagen)}
                    sx={{ width: 32, height: 32, borderRadius: 1.2, flexShrink: 0, mr: 1 }}
                />
                <Box display="flex" flexDirection="column">
                    <Typography variant="subtitle2">{data.juridica}</Typography>
                    <Typography color="tertiary" variant="caption" sx={{ fontSize: '10px'}}>{data.area3}</Typography>
                </Box>
            </Box>
        );
    }

    function renderColumnOptions(data: ReporteProcesoTableModel): ReactElement {

        if(data.estado_activo==='SUSPENDIDO') return(
                <IconButton size="small">
                    <Block />
                </IconButton>
        );
        return (
            <>
                <IconButton size="small" onClick={() => onDetalleClick(data.id)} color="info">
                    <ListAltIcon />
                </IconButton>
                <IconButton size="small" disabled={loading===data.id} onClick={() => onImprimirClick(data)} color="error">
                    {loading===data.id ? <CircularProgress size={16}  />:<PictureAsPdfIcon />}
                </IconButton>
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
                onDownloadClick={onDownloadClick}
                isLoading={loading1}
                vScroll
            />
        </>
    );
};

export const ReporteProcesoTable = forwardRef(ReporteProcesoTableComponent);
