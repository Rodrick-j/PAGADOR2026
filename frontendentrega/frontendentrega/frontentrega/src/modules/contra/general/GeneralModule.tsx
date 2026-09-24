import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { GeneralFormDialog, GeneralFormModel } from './components/GeneralFormDialog';
import { GeneralTable, GeneralTableRefProps } from './components/GeneralTable';
import GeneralDialog from './components/GeneralDialog';
//services
import { GeneralModuleService } from './GeneralModuleService';
import { useNotify } from 'services/notify';

export const GeneralModule = (): ReactElement => {
    const notify = useNotify();

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openGeneralForm, setOpenGeneralForm] = useState(false);
    const [formModel, setFormModel] = useState<GeneralFormModel>();

    const handleClickView = async (id_general: string) => {
        const actividadFormResponse = await GeneralModuleService.getGeneralFormData(id_general);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenGeneralForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_general: string) => {
        const actividadFormResponse = await GeneralModuleService.getGeneralFormData(id_general);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    const tableRef = useRef<GeneralTableRefProps>(null);

    return (
        <>
            <GeneralFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <GeneralDialog
                open={openGeneralForm}
                onComplete={() => {
                    setOpenGeneralForm(false);
                }}
                formModel={formModel}
            />
            <GeneralTable 
                ref={tableRef} 
                onViewClick={handleClickView} 
                onAddClick={handleClickAdd} 
                onEditClick={handleClickEdit}
            />
        </>
    );
};
