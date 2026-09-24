import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { AreaFormDialog, AreaFormModel } from './components/AreaFormDialog';
import { AreaTable, AreaTableRefProps } from './components/AreaTable';
import AreaDialog from './components/AreaDialog';
//services
import { AreaModuleService } from './AreaModuleService';
import { useNotify } from 'services/notify';

export const AreaModule = (): ReactElement => {
    const notify = useNotify();

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openAreaForm, setOpenAreaForm] = useState(false);
    const [formModel, setFormModel] = useState<AreaFormModel>();

    const handleClickView = async (id_area: string) => {
        const actividadFormResponse = await AreaModuleService.getAreaFormData(id_area);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenAreaForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_area: string) => {
        const actividadFormResponse = await AreaModuleService.getAreaFormData(id_area);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    const tableRef = useRef<AreaTableRefProps>(null);

    return (
        <>
            <AreaFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <AreaDialog
                open={openAreaForm}
                onComplete={() => {
                    setOpenAreaForm(false);
                }}
                formModel={formModel}
            />
            <AreaTable 
                ref={tableRef} 
                onViewClick={handleClickView} 
                onAddClick={handleClickAdd} 
                onEditClick={handleClickEdit}
            />
        </>
    );
};
