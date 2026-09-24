import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { VehiculoFormDialog, VehiculoFormModel } from './components/VehiculoFormDialog';
import { VehiculoTable, VehiculoTableRefProps } from './components/VehiculoTable';
import VehiculoDialog from './components/VehiculoDialog';
//services
import { VehiculoModuleService } from './VehiculoModuleService';
import { useNotify } from 'services/notify';

export const VehiculoModule = (): ReactElement => {
    const notify = useNotify();

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openVehiculoForm, setOpenVehiculoForm] = useState(false);
    const [formModel, setFormModel] = useState<VehiculoFormModel>();

    const handleClickView = async (id_actividad: string) => {
        const actividadFormResponse = await VehiculoModuleService.getVehiculoFormData(id_actividad);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenVehiculoForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_actividad: string) => {
        const actividadFormResponse = await VehiculoModuleService.getVehiculoFormData(id_actividad);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    const tableRef = useRef<VehiculoTableRefProps>(null);

    return (
        <>
            <VehiculoFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <VehiculoDialog
                open={openVehiculoForm}
                onComplete={() => {
                    setOpenVehiculoForm(false);
                }}
                formModel={formModel}
            />
            <VehiculoTable 
                ref={tableRef} 
                onViewClick={handleClickView} 
                onAddClick={handleClickAdd} 
                onEditClick={handleClickEdit}
            />
        </>
    );
};
