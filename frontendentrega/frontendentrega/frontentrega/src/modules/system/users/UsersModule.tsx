import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { UserFormDialog, UsuarioFormModel } from './components/UserFormDialog';
import { UserTable, UserTableRefProps } from './components/UserTable';
import { UsersModuleService } from './UsersModuleService';
import { useNotify } from 'services/notify';

export const UsersModule = (): ReactElement => {
    const notify = useNotify();

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [formModel, setFormModel] = useState<UsuarioFormModel>();

    const handleClickAddUser = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (idUsuario: string) => {
        const usuarioFormResponse = await UsersModuleService.getUserFormData(idUsuario);
        if (!usuarioFormResponse.success) return notify.error(usuarioFormResponse.msg);
        const newFormModel = usuarioFormResponse.data;
        setFormModel(newFormModel);

        setFormOpen(true);
    };

    const tableRef = useRef<UserTableRefProps>(null);

    return (
        <>
            <UserFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <UserTable ref={tableRef} onAddUserClick={handleClickAddUser} onEditClick={handleClickEdit} />
        </>
    );
};
