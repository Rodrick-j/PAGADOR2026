import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
//components
import { DataTable, TableHeader, UpdateParams, HeaderFilter, StatusColumn, ActionColumn, OnUpdateOptions, DataTableRefProps, ChangeStateColumn } from 'components/core/DataTable';
import { DocumentoAdjuntoItem, parseAdjuntos, getAdjuntoFileName, getAdjuntoDisplayName, getAdjuntoKey } from 'utils/formatFile';
//@mui
import { Box, Chip, Typography } from '@mui/material';
//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { DocumentoModuleService } from 'modules/archivo/documento/DocumentoModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
import { useSession } from 'hooks/session';
//const
import { BGCOLORS, ENUM_COLOR_TIPO_ACTA } from 'constants/colors';
import { ENUM_GESTION, ENUM_IS_SUPERADMINISTRADOR, ENUM_PERMISO, ENUM_TIPO_ACTA, ENUM_TIPO_ACTA2, ENUM_TIPO_DOCUMENTO } from 'constants/enums';
//config
import { truncateText } from 'utils/formatText';
import { STORAGE_URL } from 'config/app-config';

export type DocumentoTableModel = {
    id         : string;
    nro        : number;
    tipo       : string;
    descripcion: string;
    monto      : string;
    doc_adjunto: string;
    gestion    : string;
    fecha      : string;
    hojas_ruta : string;
    grupo_gasto: string;
    ubicacion  : string;
    nrofolio   : string;
    estado     : string;
    permiso    : string;
    adjuntos   : string;

    // para las columnas especiales
    actions: unknown;
};


export type DocumentoTableRefProps = {
    refresh: (updateParams?: UpdateParams<DocumentoTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<DocumentoTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const nroFilter: HeaderFilter         = { type: 'text' };
const hojasFilter: HeaderFilter       = { type: 'text' };
const grupoFilter: HeaderFilter       = { type: 'text' };
const fechaFilter: HeaderFilter       = { type: 'date' };
const adjuntoFilter: HeaderFilter     = { type: 'text' };
const descripcionFilter: HeaderFilter = { type: 'text' };
const gestionFilter: HeaderFilter = { type: 'select', options: ENUM_GESTION };
const tipoFilter: HeaderFilter        = { type   : 'select', options: ENUM_TIPO_DOCUMENTO };
const estadoFilter: HeaderFilter      = { type   : 'select', options: ENUM_TIPO_ACTA };

type Props = {
    onAddClick   ?: () => void;
    onViewClick   : (idDocumento: string) => Promise<void>;
    onEditClick   : (idDocumento: string) => Promise<void>;
    tipoDocumento : string;
    loading       : boolean;
};

export const DocumentoTableComponent = (props: Props, ref: React.Ref<DocumentoTableRefProps>): ReactElement => {
    const { onViewClick, onAddClick, onEditClick, tipoDocumento, loading } = props;

    const authUser = useSession();
    const notify = useNotify();
    const isMounted = useIsMounted();

    const optionsPermiso = ENUM_PERMISO;
    const es_super_administrador = authUser.roles === ENUM_IS_SUPERADMINISTRADOR;
    const es_jefe_administrador = authUser.is_jefe;

    const [tableParams, setTableParams] = useState<UpdateParams<DocumentoTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    let tableHeaders: TableHeader<DocumentoTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false, render: renderColumnActions, width: 180 },
        { id: 'nro', label: 'Nro Documento', align: 'left', filter: nroFilter },
        { id: 'tipo', label: 'Tipo', align: 'left', sort: false, width: 180, filter: tipoFilter, render: renderColumnTipo },
        { id: 'gestion', label: 'Gestion', sort: false, align: 'left', filter: gestionFilter },
        { id: 'fecha', label: 'Fecha Ingreso', sort: false, align: 'center', filter: fechaFilter },
        { id: 'monto', label: 'Monto Bs.', sort: false, align: 'left' },
        { id: 'descripcion', label: 'Descripcion/Glosa', sort: false, align: 'center', filter: descripcionFilter, render: renderColumnDescripcion },
        { id: 'hojas_ruta', label: 'Hojas Ruta', sort: false, align: 'left', filter: hojasFilter },
        { id: 'grupo_gasto', label: 'Grupo Gasto', sort: false, align: 'left'  },
        { id: 'doc_adjunto', label: 'Doc. Adjuntos', sort: false, align: 'left' },
        { id: 'adjuntos', label: 'Archivos Digitales', sort: false, align: 'left', render: renderColumnAdjunto },
        { id: 'estado', label: 'Estado', sort: false, align: 'left', render: renderColumnStatus, filter: estadoFilter },
    ];

    if (es_jefe_administrador || es_super_administrador) {
        tableHeaders.splice(11, 0, { id: 'permiso', label: 'Permiso', sort: false, align: 'center', render: renderPermisoColumnChange });
    }

    const handleUpdateTable = (params: UpdateParams<DocumentoTableModel>, opt: OnUpdateOptions) => {
        if (!isMounted()) return;
        const newParams = {
            ...params,
            filters: { ...params.filters },
        };
        opt.setLoading(true);
        DocumentoModuleService.getTableDocumento(newParams as QueryParams).then((result: any) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<DocumentoTableModel> = {
                ...params,
                rows: result.rows || [],
                count: result.count || 0
            };
            if (isMounted()) setTableParams(newTableParams);
        });
    };



    function renderColumnDescripcion(tableModel: DocumentoTableModel): ReactElement {
        return (
            <React.Fragment>
                <Box display='inline-block' overflow='hidden' width='150px'>
                        <Typography variant="body2" noWrap={true}>{tableModel.descripcion}</Typography>
                </Box>
            </React.Fragment>
            );
    }

    function renderColumnAdjunto(tableModel: DocumentoTableModel): ReactElement {
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

    function renderPermisoColumnChange(data: DocumentoTableModel): ReactElement {
        return (
            <ChangeStateColumn
                data={data.permiso}
                options={optionsPermiso}
                onChange={async (newValue: any) => {
                    return DocumentoModuleService.setCambiarPermiso(data.id, newValue).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Se actualizo exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
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
                filters: { ...tableParams.filters, tipo_documento: tipoDocumento },
            };
            return newParams;
        }
    });

    useImperativeHandle(ref, tableRefHandler, [tableParams]);

    function renderColumnActions(data: DocumentoTableModel): ReactElement {
        if(es_jefe_administrador || es_super_administrador || data.estado==='-')
            return (
                <ActionColumn
                    onViewClick={() => onViewClick(data.id)}
                    onEditClick={() => onEditClick(data.id)}
                    deleteMessage={
                        <div>
                            <div>¿Quiere eliminar el registro?</div>
                            <br />
                            <div>
                                <strong>Nro: </strong> {data.nro}
                            </div>
                        </div>
                    }
                    onDeleteClick={async () => {
                        return DocumentoModuleService.destroyDocumento(data.id).then((result) => {
                            if (!result.success) return notify.error(result.msg);
                            notify.success('Documento eliminado exitosamente');
                            tableRef.current?.refresh();
                        });
                    }}
                />
            );

        if(data.permiso==='ELIMINAR')
            return (
                <ActionColumn
                    onViewClick={() => onViewClick(data.id)}
                    deleteMessage={
                        <div>
                            <div>¿Quiere eliminar el registro?</div>
                            <br />
                            <div>
                                <strong>Nro: </strong> {data.nro}
                            </div>
                        </div>
                    }
                    onDeleteClick={async () => {
                        return DocumentoModuleService.destroyDocumento(data.id).then((result) => {
                            if (!result.success) return notify.error(result.msg);
                            notify.success('Documento eliminado exitosamente');
                            tableRef.current?.refresh();
                        });
                    }}
                />
            );
            if(data.permiso==='EDITAR')
            return (
                <ActionColumn
                    onViewClick={() => onViewClick(data.id)}
                    onEditClick={() => onEditClick(data.id)}
                />
            );

        return (
            <ActionColumn
                onViewClick={() => onViewClick(data.id)}
            />
        );
    }

    function renderColumnTipo(data: DocumentoTableModel): ReactElement {
        const tipo: string = ENUM_TIPO_DOCUMENTO.find((t) => t.value===data.tipo)?.label || "-";
        const color = 'white';
        const background = BGCOLORS[4];
        return <StatusColumn status={tipo} color={color} background={background} />;
    }

    function renderColumnStatus(data: DocumentoTableModel): ReactElement {
        const estado: string = ENUM_TIPO_ACTA2.find((t) => t.value===data.estado)?.label || "-";
        const color = 'white';
        const background = ENUM_COLOR_TIPO_ACTA[data.estado];
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
                isLoading={loading}
                vScroll
            />
        </>
    );
};

export const DocumentoTable = forwardRef(DocumentoTableComponent);
