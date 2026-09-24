import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { ObjetoGastoFormDialog, ObjetoGastoFormModel } from './components/ObjetoGastoFormDialog';
import { ObjetoGastoTable, ObjetoGastoTableRefProps } from './components/ObjetoGastoTable';
import ObjetoGastoDialog from './components/ObjetoGastoDialog';
//services
import { ObjetoGastoModuleService } from './ObjetoGastoModuleService';
import { useNotify } from 'services/notify';

export const ObjetoGastoModule = (): ReactElement => {
    const notify = useNotify();

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openObjetoGastoForm, setOpenObjetoGastoForm] = useState(false);
    const [formModel, setFormModel] = useState<ObjetoGastoFormModel>();

    const handleClickView = async (id_objeto_gasto: string) => {
        const actividadFormResponse = await ObjetoGastoModuleService.getObjetoGastoFormData(id_objeto_gasto);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenObjetoGastoForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_objeto_gasto: string) => {
        const actividadFormResponse = await ObjetoGastoModuleService.getObjetoGastoFormData(id_objeto_gasto);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    const tableRef = useRef<ObjetoGastoTableRefProps>(null);

    return (
        <>
            <ObjetoGastoFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <ObjetoGastoDialog
                open={openObjetoGastoForm}
                onComplete={() => {
                    setOpenObjetoGastoForm(false);
                }}
                formModel={formModel}
            />
            <ObjetoGastoTable
                ref={tableRef}
                onViewClick={handleClickView}
                onAddClick={handleClickAdd}
                onEditClick={handleClickEdit}
            />
        </>
    );
};
