import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { DataTable, TableHeader, UpdateParams, HeaderFilter, StatusColumn, ActionColumn, ActiveColumn, OnUpdateOptions, DataTableRefProps } from 'components/core/DataTable';

import { QueryParams } from 'services/base/Types';
import { RutasModuleService } from 'modules/system/rutas/RutasModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';
import { useSession } from 'hooks/session';
import Iconify from 'components/Iconify';
import { useTheme } from '@mui/material/styles';
import { ESTADO_A } from 'constants/colors';

export type RutaTableModel = {
    id: string;
    name: string;
    path: string;
    title: string;
    icon: string;
    color: string;
    is_client: string;
    // para las columnas especiales
    actions: unknown;
};

export type RutaTableRefProps = {
    refresh: () => void;
};

const tableParamsInitialize: UpdateParams<RutaTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const fullNombreFilter: HeaderFilter = { type: 'text' };

type Props = {
    onAddUserClick: () => void;
    onEditClick: (idRuta: string) => Promise<void>;
};

export const RutaTableComponent = (props: Props, ref: React.Ref<RutaTableRefProps>): ReactElement => {
    const { onAddUserClick, onEditClick } = props;

    const theme: any = useTheme();
    const notify = useNotify();
    const authUser = useSession();
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<RutaTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    const tableHeaders: TableHeader<RutaTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false, render: renderColumnActions },
        { id: 'title', label: 'Titulo de la Ruta', align: 'left' },
        { id: 'name', label: 'Nombre de la Ruta', align: 'left', filter: fullNombreFilter },
        { id: 'path', label: 'Ruta', align: 'left' },
        { id: 'icon', label: 'Icono', align: 'left', render: renderColumnIcon },
        { id: 'is_client', label: 'Cliente', align: 'left', render: renderColumnClient },
        { id: 'color', label: 'Color', align: 'left', render: renderColumnColor },
    ];

    const handleUpdateTable = (params: UpdateParams<RutaTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        RutasModuleService.getTableRutas(params as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<RutaTableModel> = {
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
        refresh: () => tableRef.current?.refresh()
    });
    useImperativeHandle(ref, tableRefHandler, [tableParams]);

    function renderColumnActions(data: RutaTableModel): ReactElement {
        return (
            <ActionColumn
                onEditClick={() => onEditClick(data.id)}
                deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro?</div>
                        <br />
                        <div>
                            <strong>Nombre: </strong> {data.name}
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return RutasModuleService.destroyRuta(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Ruta eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnIcon(data: RutaTableModel): ReactElement {
        return  (
                <Iconify
                    icon={data.icon ?? 'radix-icons:value-none'}
                    sx={{ width: 24, height: 24, ml: 1 }}
                />
        );
    }

    function renderColumnColor(data: RutaTableModel): ReactElement {
        const COLOR_ITEM = theme.palette[data.color??'primary'].main || theme.palette['grey'][500];
        return  <StatusColumn status={COLOR_ITEM} background={COLOR_ITEM} color={'white'} />;
    }

    function renderColumnClient(data: RutaTableModel): ReactElement {
        const background = data.is_client? ESTADO_A[0] : ESTADO_A[1];
        const estado = data.is_client?'SI':data.is_client===null?'-':'NO';
        return <StatusColumn status={estado} color={'white'} background={background} />;
    }

    return (
        <DataTable
            ref={tableRef}
            headers={tableHeaders}
            updateParams={tableParams}
            onUpdate={handleUpdateTable}
            onActionAddClick={authUser.permisos.create ? onAddUserClick : undefined}
        />
    );
};

export const RutaTable = forwardRef(RutaTableComponent);
