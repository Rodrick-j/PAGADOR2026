import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { DestinoFormDialog, DestinoFormModel } from './components/DestinoFormDialog';
import { DestinoTable, DestinoTableRefProps } from './components/DestinoTable';
import DestinoDialog from './components/DestinoDialog';
//services
import { DestinoModuleService } from './DestinoModuleService';
import { useNotify } from 'services/notify';

export const DestinoModule = (): ReactElement => {
    const notify = useNotify();

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openDestinoForm, setOpenDestinoForm] = useState(false);
    const [formModel, setFormModel] = useState<DestinoFormModel>();

    const handleClickView = async (id_destino: string) => {
        const actividadFormResponse = await DestinoModuleService.getDestinoFormData(id_destino);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenDestinoForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_destino: string) => {
        const actividadFormResponse = await DestinoModuleService.getDestinoFormData(id_destino);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    const tableRef = useRef<DestinoTableRefProps>(null);

    return (
        <>
            <DestinoFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <DestinoDialog
                open={openDestinoForm}
                onComplete={() => {
                    setOpenDestinoForm(false);
                }}
                formModel={formModel}
            />
            <DestinoTable 
                ref={tableRef} 
                onViewClick={handleClickView} 
                onAddClick={handleClickAdd} 
                onEditClick={handleClickEdit}
            />
        </>
    );
};
