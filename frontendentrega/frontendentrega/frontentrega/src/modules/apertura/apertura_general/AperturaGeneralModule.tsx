import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { AperturaGeneralFormDialog, AperturaGeneralFormModel } from './components/AperturaGeneralFormDialog';
import { AperturaGeneralTable, AperturaGeneralTableRefProps } from './components/AperturaGeneralTable';
import AperturaGeneralDialog from './components/AperturaGeneralDialog';
//services
import { AperturaGeneralModuleService } from './AperturaGeneralModuleService';
import { useNotify } from 'services/notify';

export const AperturaGeneralModule = (): ReactElement => {
    const notify = useNotify();

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openAperturaGeneralForm, setOpenAperturaGeneralForm] = useState(false);
    const [formModel, setFormModel] = useState<AperturaGeneralFormModel>();

    const handleClickView = async (id_apertura_viatico: string) => {
        const actividadFormResponse = await AperturaGeneralModuleService.getAperturaGeneralFormData(id_apertura_viatico);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenAperturaGeneralForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_apertura_viatico: string) => {
        const actividadFormResponse = await AperturaGeneralModuleService.getAperturaGeneralFormData(id_apertura_viatico);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    const tableRef = useRef<AperturaGeneralTableRefProps>(null);

    return (
        <>
            <AperturaGeneralFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <AperturaGeneralDialog
                open={openAperturaGeneralForm}
                onComplete={() => {
                    setOpenAperturaGeneralForm(false);
                }}
                formModel={formModel}
            />
            <AperturaGeneralTable
                ref={tableRef}
                onViewClick={handleClickView}
                onAddClick={handleClickAdd}
                onEditClick={handleClickEdit}
            />
        </>
    );
};
