import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { RutaFormDialog, RutaFormModel } from './components/RutaFormDialog';
import { RutaTable, RutaTableRefProps } from './components/RutaTable';
import { RutasModuleService } from './RutasModuleService';
import { useNotify } from 'services/notify';

export const RutasModule = (): ReactElement => {
    const notify = useNotify();

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [formModel, setFormModel] = useState<RutaFormModel>();

    const handleClickAddUser = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (idRuta: string) => {
        const rutaFormResponse = await RutasModuleService.getRutaFormData(idRuta);
        if (!rutaFormResponse.success) return notify.error(rutaFormResponse.msg);
        const newFormModel = rutaFormResponse.data;
        setFormModel(newFormModel);

        setFormOpen(true);
    };

    const tableRef = useRef<RutaTableRefProps>(null);

    return (
        <>
            <RutaFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <RutaTable ref={tableRef} onAddUserClick={handleClickAddUser} onEditClick={handleClickEdit} />
        </>
    );
};
