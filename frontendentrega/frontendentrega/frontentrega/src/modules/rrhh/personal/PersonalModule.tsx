import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { PersonalFormDialog, PersonalFormModel } from './components/PersonalFormDialog';
import { PersonalTable, PersonalTableRefProps } from './components/PersonalTable';
import PersonalDialog from './components/PersonalDialog';
//services
import { PersonalModuleService } from './PersonalModuleService';
import { useNotify } from 'services/notify';

export const PersonalModule = (): ReactElement => {
    const notify = useNotify();

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openPersonalForm, setOpenPersonalForm] = useState(false);
    const [formModel, setFormModel] = useState<PersonalFormModel>();

    const handleClickView = async (id_personal: string) => {
        const actividadFormResponse = await PersonalModuleService.getPersonalFormData(id_personal);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenPersonalForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_personal: string) => {
        const actividadFormResponse = await PersonalModuleService.getPersonalFormData(id_personal);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    const tableRef = useRef<PersonalTableRefProps>(null);

    return (
        <>
            <PersonalFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <PersonalDialog
                open={openPersonalForm}
                onComplete={() => {
                    setOpenPersonalForm(false);
                }}
                formModel={formModel}
            />
            <PersonalTable 
                ref={tableRef} 
                onViewClick={handleClickView} 
                onAddClick={handleClickAdd} 
                onEditClick={handleClickEdit}
            />
        </>
    );
};
