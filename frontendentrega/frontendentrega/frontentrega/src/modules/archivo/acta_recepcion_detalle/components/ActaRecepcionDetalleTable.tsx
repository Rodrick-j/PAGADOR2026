import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
//components
import { TableHeader, UpdateParams, HeaderFilter, OnUpdateOptions, DataTableRefProps, DataTable, ActionColumn, StatusColumn } from 'components/core/DataTable';
//@mui

//services
import { QueryParams } from 'services/base/Types';
import { useNotify } from 'services/notify';
//model
import { ActaRecepcionDetalleModuleService } from '../ActaRecepcionDetalleModuleService';
//hooks
import { useIsMounted } from 'hooks/useIsMounted';
//const
import { ENUM_TIPO_DOCUMENTO } from 'constants/enums';
import { BGCOLORS } from 'constants/colors';

export type ActaRecepcionDetalleTableModel = {
    id         : string;
    nrodoc     : string;
    tipo       : string;
    nrofolio   : string;
    gestion    : string;
    descripcion: string;

    actions: unknown;
};

export type ActaRecepcionDetalleTableRefProps = {
    refresh: (updateParams?: UpdateParams<ActaRecepcionDetalleTableModel>) => void;
    getQueryParams: () => QueryParams;
};

export type ReportFilters = {
    [key: string]: string | number | boolean | (string | number | boolean)[];
};

const tableParamsInitialize: UpdateParams<ActaRecepcionDetalleTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const documentoFilter: HeaderFilter = { type: 'text' };
const descripcionFilter: HeaderFilter = { type: 'text' };
const tipoFilter: HeaderFilter    = {
    type   : 'select',
    options: ENUM_TIPO_DOCUMENTO,
};
const gestionFilter: HeaderFilter = { type: 'text' };
const montoFilter: HeaderFilter = { type: 'text' };


type Props = {
    actaRecepcionId: string;
    onAddClick     : () => void;
    onEditClick    : (idActaRecepcion: string) => Promise<void>;
};

export const ActaRecepcionDetalleTableComponent = (props: Props, ref: React.Ref<ActaRecepcionDetalleTableRefProps>): ReactElement => {
    const { onAddClick, onEditClick, actaRecepcionId } = props;
    const notify = useNotify();
    const isMounted = useIsMounted();

    const [tableParams, setTableParams] = useState<UpdateParams<ActaRecepcionDetalleTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    const tableHeaders: TableHeader<ActaRecepcionDetalleTableModel>[] = [
        { id: 'actions', label: 'Acciones', render: renderColumnActions, sort: false },
        { id: 'nrodoc', label: 'Nro Documento', sort: false, align: 'left', filter: documentoFilter },
        { id: 'tipo', label: 'Tipo', sort: false, align: 'left', width: 180, filter: tipoFilter, render: renderColumnTipo },
        { id: 'nrofolio', label: 'Nro Folio', sort: false, align: 'left' },
        { id: 'gestion', label: 'Gestion', sort: false, align: 'left', filter: gestionFilter },
        { id: 'descripcion', label: 'Descripcion/Glosa', sort: false, align: 'left', filter: descripcionFilter },
    ];

    const handleUpdateTable = (params: UpdateParams<ActaRecepcionDetalleTableModel>, opt: OnUpdateOptions) => {
        if (!isMounted()) return;
        const newParams = {...params, filters: { ...params.filters, acta_recepcion_id: actaRecepcionId }};
        opt.setLoading(true);
        ActaRecepcionDetalleModuleService.getTableActaRecepcionDetalle(newParams as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<ActaRecepcionDetalleTableModel> = {
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


    function renderColumnTipo(data: ActaRecepcionDetalleTableModel): ReactElement {
        const tipo: string = ENUM_TIPO_DOCUMENTO.find((t) => t.value===data.tipo)?.label || "-";
        const color = 'white';
        const background = BGCOLORS[4];
        return <StatusColumn status={tipo} color={color} background={background} />;
    }

    function renderColumnActions(data: ActaRecepcionDetalleTableModel): ReactElement {
        return (
            <ActionColumn
                onEditClick={() => onEditClick(data.id)}
                deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro?</div>
                        <br />
                        <div>
                            <strong>Nro: </strong> {data.nrodoc}
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return ActaRecepcionDetalleModuleService.destroyActaRecepcionDetalle(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Documento eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
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
                onActionAddClick={onAddClick}
                vScroll
            />
        </>
    );
};

export const ActaRecepcionDetalleTable = forwardRef(ActaRecepcionDetalleTableComponent);
