import React, { useState, ReactElement, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { DataTable, TableHeader, UpdateParams, HeaderFilter, StatusColumn, ActionColumn, ActiveColumn, OnUpdateOptions, DataTableRefProps } from 'components/core/DataTable';

import { QueryParams } from 'services/base/Types';
import { UsersModuleService } from 'modules/system/users/UsersModuleService';
import { useNotify } from 'services/notify';
import { UserTableItem } from './UserTableItem';
import { useIsMounted } from 'hooks/useIsMounted';
import { useSession } from 'hooks/session';
import { ESTADO_P } from 'constants/colors';

export type UsuarioTableModel = {
    id     : string;
    activo : boolean;
    is_jefe: boolean;
    nombre : string;
    email  : string;
    roles  : string;
    estado : string;

    // para las columnas especiales
    actions: unknown;
};

export type UserTableRefProps = {
    refresh: () => void;
};

const tableParamsInitialize: UpdateParams<UsuarioTableModel> = {
    rows: [],
    count: 0,
    rowsPerPage: 5,
    page: 1
};

const fullNameFilter: HeaderFilter = { type: 'text' };
const EmailFilter: HeaderFilter = { type: 'text' };
const RolesFilter: HeaderFilter = { type: 'text' };
const statusFilter: HeaderFilter = {
    type: 'select',
    options: [
        { value: 'ACTIVO', label: 'ACTIVO' },
        { value: 'INACTIVO', label: 'INACTIVO' }
    ]
};

type Props = {
    onAddUserClick: () => void;
    onEditClick: (idUsuario: string) => Promise<void>;
};

export const UserTableComponent = (props: Props, ref: React.Ref<UserTableRefProps>): ReactElement => {
    const { onAddUserClick, onEditClick } = props;
    const notify = useNotify();
    const authUser = useSession();
    const isMounted = useIsMounted();
    const [tableParams, setTableParams] = useState<UpdateParams<UsuarioTableModel>>(tableParamsInitialize);
    const tableRef = useRef<DataTableRefProps>(null);

    const tableHeaders: TableHeader<UsuarioTableModel>[] = [
        { id: 'actions', label: 'Acciones', sort: false, render: renderColumnActions },
        { id: 'activo', label: 'Activo', align: 'center', width: 80, render: renderColumnActive },
        { id: 'nombre', label: 'Nombre Completo/CI', align: 'left', filter: fullNameFilter },
        { id: 'email', label: 'Correo electrónico', align: 'left', filter: EmailFilter },
        { id: 'roles', label: 'Rol', align: 'left', filter: RolesFilter },
        { id: 'is_jefe', label: 'Es Jefe', align: 'left', render: renderColumnJefe },
        { id: 'estado', label: 'Estado', render: renderColumnStatus, filter: statusFilter }
    ];

    const handleUpdateTable = (params: UpdateParams<UsuarioTableModel>, opt: OnUpdateOptions) => {
        opt.setLoading(true);
        if (!isMounted()) return;
        UsersModuleService.getTableUsuarios(params as QueryParams).then((result) => {
            opt.setLoading(false);
            if (!result.success) return;
            const newTableParams: UpdateParams<UsuarioTableModel> = {
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

    function renderColumnActions(data: UsuarioTableModel): ReactElement {
        return (
            <ActionColumn
                onEditClick={() => onEditClick(data.id)}
                onLockOpenClick={async () => {
                    return UsersModuleService.resetPassword(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success(result.msg);
                    });
                }}
                onLockOpenMessage={
                    <div>
                        <div>¿Quiere reestablecer la contraseña del usuario?</div>
                        <br />
                        <div>
                            <strong>Nombre: </strong> {data.nombre} 
                        </div>
                        <br />
                        <div>
                            La nueva contraseña será enviada al correo electrónico <strong>{data.email}</strong>.
                        </div>
                    </div>
                }
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
                    return UsersModuleService.destroyUser(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Usuario eliminado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnActive(data: UsuarioTableModel): ReactElement {
        return (
            <ActiveColumn
                active={data.activo}
                onActiveChange={async (newValue: any) => {
                    return UsersModuleService.setActiveUser(data.id, newValue).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success('Estado actualizado exitosamente');
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    function renderColumnStatus(data: UsuarioTableModel): ReactElement {
        const color = data.estado === 'ACTIVO' ? 'white' : 'yellow';
        const background = data.estado === 'ACTIVO' ? '#74B220' : 'red';
        return <StatusColumn status={data.estado} color={color} background={background} />;
    }

    function renderColumnJefe(data: UsuarioTableModel): ReactElement {
        return <StatusColumn status={data.is_jefe?'SI':'NO'} color={'white'} background={data.is_jefe?ESTADO_P[0]:ESTADO_P[1]} />;
    }

    function renderMobileComponent(data: UsuarioTableModel) {
        return (
            <UserTableItem
                data={data}
                refresh={() => tableRef.current?.refresh()}
                onEditClick={() => onEditClick(data.id)}
                onDeleteClick={() => {
                    UsersModuleService.destroyUser(data.id).then((result) => {
                        if (!result.success) return notify.error(result.msg);
                        notify.success(result.msg);
                        tableRef.current?.refresh();
                    });
                }}
            />
        );
    }

    return (
        <DataTable
            ref={tableRef}
            headers={tableHeaders}
            updateParams={tableParams}
            onUpdate={handleUpdateTable}
            onActionAddClick={authUser.permisos.create ? onAddUserClick : undefined}
            mobileComponent={renderMobileComponent}
            vScroll
        />
    );
};

export const UserTable = forwardRef(UserTableComponent);
