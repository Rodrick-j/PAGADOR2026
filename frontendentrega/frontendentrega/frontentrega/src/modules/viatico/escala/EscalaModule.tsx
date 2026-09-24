import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { EscalaFormDialog, EscalaFormModel } from './components/EscalaFormDialog';
import { EscalaTable, EscalaTableRefProps } from './components/EscalaTable';
import EscalaDialog from './components/EscalaDialog';
//services
import { EscalaModuleService } from './EscalaModuleService';
import { useNotify } from 'services/notify';

export const EscalaModule = (): ReactElement => {
    const notify = useNotify();

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openEscalaForm, setOpenEscalaForm] = useState(false);
    const [formModel, setFormModel] = useState<EscalaFormModel>();

    const handleClickView = async (id_area: string) => {
        const actividadFormResponse = await EscalaModuleService.getEscalaFormData(id_area);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenEscalaForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_area: string) => {
        const actividadFormResponse = await EscalaModuleService.getEscalaFormData(id_area);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    const tableRef = useRef<EscalaTableRefProps>(null);

    return (
        <>
            <EscalaFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <EscalaDialog
                open={openEscalaForm}
                onComplete={() => {
                    setOpenEscalaForm(false);
                }}
                formModel={formModel}
            />
            <EscalaTable
                ref={tableRef}
                onViewClick={handleClickView}
                onAddClick={handleClickAdd}
                onEditClick={handleClickEdit}
            />
        </>
    );
};
