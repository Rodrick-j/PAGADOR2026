import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { AperturaViaticoFormDialog, AperturaViaticoFormModel } from './components/AperturaViaticoFormDialog';
import { AperturaViaticoTable, AperturaViaticoTableRefProps } from './components/AperturaViaticoTable';
import AperturaViaticoDialog from './components/AperturaViaticoDialog';
//services
import { AperturaViaticoModuleService } from './AperturaViaticoModuleService';
import { useNotify } from 'services/notify';

export const AperturaViaticoModule = (): ReactElement => {
    const notify = useNotify();

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openAperturaViaticoForm, setOpenAperturaViaticoForm] = useState(false);
    const [formModel, setFormModel] = useState<AperturaViaticoFormModel>();

    const handleClickView = async (id_apertura_viatico: string) => {
        const actividadFormResponse = await AperturaViaticoModuleService.getAperturaViaticoFormData(id_apertura_viatico);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenAperturaViaticoForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_apertura_viatico: string) => {
        const actividadFormResponse = await AperturaViaticoModuleService.getAperturaViaticoFormData(id_apertura_viatico);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    const tableRef = useRef<AperturaViaticoTableRefProps>(null);

    return (
        <>
            <AperturaViaticoFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <AperturaViaticoDialog
                open={openAperturaViaticoForm}
                onComplete={() => {
                    setOpenAperturaViaticoForm(false);
                }}
                formModel={formModel}
            />
            <AperturaViaticoTable
                ref={tableRef}
                onViewClick={handleClickView}
                onAddClick={handleClickAdd}
                onEditClick={handleClickEdit}
            />
        </>
    );
};
