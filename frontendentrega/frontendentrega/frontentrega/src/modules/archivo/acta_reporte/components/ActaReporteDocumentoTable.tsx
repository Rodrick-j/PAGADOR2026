import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { useIsMounted } from 'hooks/useIsMounted';
//components
import { TableHeader, UpdateParams, HeaderFilter, OnUpdateOptions, DataTableRefProps, DataTable, ActionColumn, StatusColumn } from 'components/core/DataTable';
import { DocumentoAdjuntoItem, parseAdjuntos, getAdjuntoFileName, getAdjuntoDisplayName, getAdjuntoKey } from 'utils/formatFile';
//@mui
import { Box, Chip, Typography } from '@mui/material';
//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { ActaReporteModuleService } from 'modules/archivo/acta_reporte/ActaReporteModuleService';
//hooks
import { ENUM_GESTION, ENUM_TIPO_DOCUMENTO } from 'constants/enums';
import { BGCOLORS } from 'constants/colors';
import { truncateText } from 'utils/formatText';
import { STORAGE_URL } from 'config/app-config';

export type ActaReporteDocumentoTableModel = {
    id            : string;
    nro           : string;
    grupo_gasto   : string;
    gestion       : string;
    descripcion   : string;
    mes           : string;
    tipo          : string;
    monto         : string;
    fecha         : string;
    doc_adjunto   : string;
    adjuntos      : string;
    area          : string;
    nombre        : string;
};

export type ActaReporteDocumentoTableRefProps = {
    refresh: (updateParams?: UpdateParams<ActaReporteDocumentoTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<ActaReporteDocumentoTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const documentoFilter: HeaderFilter = { type: 'text' };
const descripcionFilter: HeaderFilter = { type: 'text' };
const docAdjuntoFilter: HeaderFilter = { type: 'text' };
const tipoFilter: HeaderFilter    = {
    type   : 'select',
    options: ENUM_TIPO_DOCUMENTO,
};
const gestionFilter: HeaderFilter = { type: 'select', options: ENUM_GESTION };
const montoFilter: HeaderFilter = { type: 'text' };
const fechaFilter: HeaderFilter = { type: 'date' };
type Props = {
    onDownloadClick?: () => void;
    onDownloadExcel?: () => void;
    loading         : boolean;
    loadingE        : boolean;
};

export const ActaReporteTableComponent = (props: Props, ref: React.Ref<ActaReporteDocumentoTableRefProps>): ReactElement => {
    const { onDownloadClick, onDownloadExcel, loading, loadingE } = props;
    console.log("🚀 ~ ActaReporteTableComponent ~ loadingE:", loadingE)
    const notify = useNotify();
    const isMounted = useIsMounted();

    const [tableParams, setTableParams] = useState<UpdateParams<ActaReporteDocumentoTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    const tableHeaders: TableHeader<ActaReporteDocumentoTableModel>[] = [
        { id: 'nro', label: 'Nro Documento', sort: false, align: 'left', filter: documentoFilter },
        { id: 'gestion', label: 'Gestion', sort: false, align: 'left', filter: gestionFilter },
        { id: 'tipo', label: 'Tipo', sort: false, align: 'left', width: 180, filter: tipoFilter, render: renderColumnTipo },
        { id: 'fecha', label: 'Fecha', sort: false, align: 'left', filter: fechaFilter },
        { id: 'grupo_gasto', label: 'Grupo Gasto', sort: false, width: 180, align: 'left' },
        { id: 'monto', label: 'Monto', sort: false, align: 'left', filter: montoFilter },
        { id: 'descripcion', label: 'Descripcion/Glosa', sort: false, align: 'left', width: 180, filter: descripcionFilter, render: renderColumnDescripcion },
        { id: 'doc_adjunto', label: 'Doc. Adjunto', sort: false, align: 'left', width: 180, render: renderColumnDocAdjuntos },
        { id: 'adjuntos', label: 'Archivos Digitales', align: 'right', render: renderColumnAdjunto },
    ];

    const handleUpdateTable = (params: UpdateParams<ActaReporteDocumentoTableModel>, opt: OnUpdateOptions) => {
        if (!isMounted()) return;
        const newParams = {
            ...params,
            filters: { ...params.filters },
        };
        opt.setLoading(true);
        ActaReporteModuleService.getTableActaReporteDocumento(newParams as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<ActaReporteDocumentoTableModel> = {
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

    function renderColumnAdjunto(tableModel: ActaReporteDocumentoTableModel): ReactElement {
        const adjuntos: DocumentoAdjuntoItem[] = parseAdjuntos(tableModel.adjuntos);

        if (adjuntos.length === 0) return <></>;

        return (
            <React.Fragment>
                <Box display="flex" alignItems="left" flexDirection="column">
                    <div>
                        {adjuntos.map((item: DocumentoAdjuntoItem, index: number) => {
                            const fileName: string = getAdjuntoFileName(item);

                            return (
                                <Chip
                                    key={getAdjuntoKey(item, index)}
                                    label={truncateText(getAdjuntoDisplayName(item))}
                                    component="a"
                                    onClick={() => {
                                        window.open(`${STORAGE_URL}/${fileName}`);
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

    function renderColumnDocAdjuntos(tableModel: ActaReporteDocumentoTableModel): ReactElement {
        return (
                <Typography variant="caption" component="p" sx={{ fontSize: '12px', p: 1 }}>{tableModel.doc_adjunto}</Typography>
            );
    }

    function renderColumnDescripcion(tableModel: ActaReporteDocumentoTableModel): ReactElement {
        return (
                <Typography variant="caption" component="p" sx={{ fontSize: '10px', p: 1 }}>{tableModel.descripcion}</Typography>
            );
    }

    function renderColumnTipo(data: ActaReporteDocumentoTableModel): ReactElement {
        const tipo: string = ENUM_TIPO_DOCUMENTO.find((t) => t.value===data.tipo)?.label || "-";
        const color = 'white';
        const background = BGCOLORS[4];
        return <StatusColumn status={tipo} color={color} background={background} />;
    }

    return (
        <>
            <DataTable
                ref={tableRef}
                headers={tableHeaders}
                updateParams={tableParams}
                onUpdate={handleUpdateTable}
                onDownloadClick={onDownloadClick}
                onDownloadExcel={onDownloadExcel}
                isLoadingE={loadingE}
                isLoading={loading}
                vScroll
            />
        </>
    );
};

export const ActaReporteDocumentoTable = forwardRef(ActaReporteTableComponent);
