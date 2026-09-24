import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { useIsMounted } from 'hooks/useIsMounted';
//components
import { TableHeader, UpdateParams, HeaderFilter, OnUpdateOptions, DataTableRefProps, DataTable, ActionColumn, StatusColumn } from 'components/core/DataTable';
import { FileItem } from 'components/core/FormDialog';
//@mui
import { Box, Chip } from '@mui/material';
//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { ActaReporteModuleService } from '../ActaReporteModuleService';
//hooks
import { ENUM_TIPO_ACTA3 } from 'constants/enums';
import { ENUM_COLOR_TIPO_ACTA } from 'constants/colors';
import { truncateText } from 'utils/formatText';
import { STORAGE_URL } from 'config/app-config';

export type ActaReporteActaTableModel = {
    id               : string;
    tipo             : string;
    descripcion      : string;
    cod_acta         : string;
    fecha_registro   : string;
    fecha_devolucion : string;
    documentos       : string[];
    adjuntos         : string;
    nombre           : string;
    area             : string;
};

export type ActaReporteActaTableRefProps = {
    refresh: (updateParams?: UpdateParams<ActaReporteActaTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<ActaReporteActaTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const codigoFilter: HeaderFilter    = { type: 'text' };
const fechaFilter: HeaderFilter     = { type: 'date' };
const documentoFilter: HeaderFilter = { type: 'text' };
const personalFilter: HeaderFilter  = { type: 'text' };
const areaFilter: HeaderFilter      = { type: 'text' };
const tipoFilter: HeaderFilter    = {
    type   : 'select',
    options: ENUM_TIPO_ACTA3,
};

type Props = {
    onDownloadClick?: () => void;
    loading    : boolean;
};

export const ActaReporteTableComponent = (props: Props, ref: React.Ref<ActaReporteActaTableRefProps>): ReactElement => {
    const { onDownloadClick, loading } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();

    const [tableParams, setTableParams] = useState<UpdateParams<ActaReporteActaTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    const tableHeaders: TableHeader<ActaReporteActaTableModel>[] = [
        { id: 'cod_acta', label: 'Cod. acta', sort: false, align: 'left', filter: codigoFilter },
        { id: 'tipo', label: 'Tipo', sort: false, align: 'left', width: 150, filter: tipoFilter, render: renderColumnTipo },
        { id: 'documentos', label: 'Nro Documentos', sort: false, align: 'left', filter: documentoFilter, render: renderColumnDocumentos },
        { id: 'fecha_registro', label: 'Fecha Registro', sort: false, align: 'left', filter: fechaFilter },
        { id: 'fecha_devolucion', label: 'Fecha Devolucion', sort: false, align: 'center' },
        { id: 'nombre', label: 'Responsable/CI', sort: false, align: 'left', filter: personalFilter },
        { id: 'area', label: 'Area/Unidad/Secretaria', sort: false, align: 'left', filter: areaFilter },
        { id: 'adjuntos', label: 'Doc. Adjuntos', align: 'right', render: renderColumnAdjunto },
    ];

    const handleUpdateTable = (params: UpdateParams<ActaReporteActaTableModel>, opt: OnUpdateOptions) => {
        if (!isMounted()) return;
        const newParams = {
            ...params,
            filters: { ...params.filters },
        };
        opt.setLoading(true);
        ActaReporteModuleService.getTableActaReporteActa(newParams as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<ActaReporteActaTableModel> = {
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

    function renderColumnDocumentos(data: ActaReporteActaTableModel): ReactElement {
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

    function renderColumnTipo(data: ActaReporteActaTableModel): ReactElement {
        const tipo: string = ENUM_TIPO_ACTA3.find((t) => t.value===data.tipo)?.label || "-";
        const color = 'white';
        const background = ENUM_COLOR_TIPO_ACTA[data.tipo];
        return <StatusColumn status={tipo} color={color} background={background} />;
    }

    function renderColumnAdjunto(tableModel: ActaReporteActaTableModel): ReactElement {
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
            <DataTable
                ref={tableRef}
                headers={tableHeaders}
                updateParams={tableParams}
                onUpdate={handleUpdateTable}
                onDownloadClick={onDownloadClick}
                isLoading={loading}
                vScroll
            />
        </>
    );
};

export const ActaReporteActaTable = forwardRef(ActaReporteTableComponent);
