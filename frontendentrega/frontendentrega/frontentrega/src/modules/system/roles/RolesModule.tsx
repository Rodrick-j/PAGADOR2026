import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { RoleFormDialog, RoleFormModel } from './components/RoleFormDialog';
import { RoleTable, RoleTableRefProps } from './components/RoleTable';
import { RolesModuleService } from './RolesModuleService';
import { useNotify } from 'services/notify';

export const RolesModule = (): ReactElement => {
    const notify = useNotify();

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [formModel, setFormModel] = useState<RoleFormModel>();

    const handleClickAddUser = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (idRole: string) => {
        const roleFormResponse = await RolesModuleService.getRoleFormData(idRole);
        if (!roleFormResponse.success) return notify.error(roleFormResponse.msg);
        const newFormModel = roleFormResponse.data;
        setFormModel(newFormModel);

        setFormOpen(true);
    };

    const tableRef = useRef<RoleTableRefProps>(null);

    return (
        <>
            <RoleFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <RoleTable ref={tableRef} onAddUserClick={handleClickAddUser} onEditClick={handleClickEdit} />
        </>
    );
};
