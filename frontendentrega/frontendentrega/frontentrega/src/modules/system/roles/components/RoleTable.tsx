import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { DataTable, TableHeader, UpdateParams, HeaderFilter, StatusColumn, ActionColumn, ActiveColumn, OnUpdateOptions, DataTableRefProps } from 'components/core/DataTable';

import { QueryParams } from 'services/base/Types';
import { RolesModuleService } from 'modules/system/roles/RolesModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';
import { useSession } from 'hooks/session';
import { ENUM_PERMISOS } from 'constants/enums';

export type RoleTableModel = {
    id      : string;
    nombre  : string;
    tipo    : string;
    permisos: string;
    modulos : string[];
    // para las columnas especiales
    actions: unknown;
};


export type Permiso = {
    read: boolean;
    create: boolean;
    edit: boolean;
    remove: boolean;
    send: boolean;
    download: boolean;
    approve: boolean;
}

export interface Modulos {
    id: string;
    name: string;
    path: string,
    title: string,
    icon: string,
    color: string,
}


export type RoleTableRefProps = {
    refresh: () => void;
};

const tableParamsInitialize: UpdateParams<RoleTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const fullNombreFilter: HeaderFilter = { type: 'text' };
const fullTipoFilter: HeaderFilter = { type: 'text' };

type Props = {
    onAddUserClick: () => void;
    onEditClick: (idRole: string) => Promise<void>;
};

export const RoleTableComponent = (props: Props, ref: React.Ref<RoleTableRefProps>): ReactElement => {
    const { onAddUserClick, onEditClick } = props;
    const notify = useNotify();
    const authUser = useSession();
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<RoleTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    const tableHeaders: TableHeader<RoleTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false, render: renderColumnActions },
        { id: 'nombre', label: 'Nombre del Rol', align: 'left', filter: fullNombreFilter },
        { id: 'tipo', label: 'Tipo', align: 'left', filter: fullTipoFilter },
        { id: 'permisos', label: 'Permisos', align: 'center', render: renderColumnPermisos },
        { id: 'modulos', label: 'Modulos Permitidos', align: 'left', render: renderColumnModulos },
    ];

    const handleUpdateTable = (params: UpdateParams<RoleTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        RolesModuleService.getTableRoles(params as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<RoleTableModel> = {
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

    function renderColumnActions(data: RoleTableModel): ReactElement {
        return (
            <ActionColumn
                onEditClick={() => onEditClick(data.id)}  
                deleteMessage={
                    <div>
                        <div>¿Quiere eliminar el registro?</div>
                        <br />
                        <div>
                            <strong>Nombre: </strong> {data.nombre}
                        </div>
                    </div>
                }
                onDeleteClick={async () => {
                    return RolesModuleService.destroyRole(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Role eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }
    
    function renderColumnPermisos(data: RoleTableModel): ReactElement {
        const permisos = JSON.parse(data.permisos) as Permiso;
        const permisosArray = Object.keys(permisos);
        return  (
            <p style={{textAlign: 'left'}}>
                    {
                        ENUM_PERMISOS.map((r: any, index) => {
                            if(permisosArray.includes(r.value)) return <span key={index}> {r.label},</span>
                        })
                    }
            </p>
        );
    }

    function renderColumnModulos(data: RoleTableModel): ReactElement {
        const modulos: string[] = data.modulos || [];
        return  <>
                    {
                        modulos.map((r: any, index) => (
                               <span key={index}> {r.title},</span>
                            )
                        )
                    }
                </>;
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

export const RoleTable = forwardRef(RoleTableComponent);
