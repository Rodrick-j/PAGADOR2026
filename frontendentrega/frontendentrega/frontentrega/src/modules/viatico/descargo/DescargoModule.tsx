import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { DescargoFormDialog, DescargoFormModel } from './components/DescargoFormDialog';
import { DescargoTable, DescargoTableRefProps } from './components/DescargoTable';
import DescargoDialog from './components/DescargoDialog';
//services
import { DescargoModuleService } from './DescargoModuleService';
import { useNotify } from 'services/notify';

export const DescargoModule = (): ReactElement => {
    const notify = useNotify();

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openDescargoForm, setOpenDescargoForm] = useState(false);
    const [formModel, setFormModel] = useState<DescargoFormModel>();

    const handleClickView = async (id_area: string) => {
        const actividadFormResponse = await DescargoModuleService.getDescargoFormData(id_area);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenDescargoForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_area: string) => {
        const actividadFormResponse = await DescargoModuleService.getDescargoFormData(id_area);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    const tableRef = useRef<DescargoTableRefProps>(null);

    return (
        <>
            <DescargoFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <DescargoDialog
                open={openDescargoForm}
                onComplete={() => {
                    setOpenDescargoForm(false);
                }}
                formModel={formModel}
            />
            <DescargoTable
                ref={tableRef}
                onViewClick={handleClickView}
                onAddClick={handleClickAdd}
                onEditClick={handleClickEdit}
            />
        </>
    );
};
