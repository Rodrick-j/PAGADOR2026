import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { CargoFormDialog, CargoFormModel } from './components/CargoFormDialog';
import { CargoTable, CargoTableRefProps } from './components/CargoTable';
import CargoDialog from './components/CargoDialog';
//services
import { CargoModuleService } from './CargoModuleService';
import { useNotify } from 'services/notify';

export const CargoModule = (): ReactElement => {
    const notify = useNotify();

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openCargoForm, setOpenCargoForm] = useState(false);
    const [formModel, setFormModel] = useState<CargoFormModel>();

    const handleClickView = async (id_actividad: string) => {
        const actividadFormResponse = await CargoModuleService.getCargoFormData(id_actividad);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenCargoForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_actividad: string) => {
        const actividadFormResponse = await CargoModuleService.getCargoFormData(id_actividad);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    const tableRef = useRef<CargoTableRefProps>(null);

    return (
        <>
            <CargoFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <CargoDialog
                open={openCargoForm}
                onComplete={() => {
                    setOpenCargoForm(false);
                }}
                formModel={formModel}
            />
            <CargoTable 
                ref={tableRef} 
                onViewClick={handleClickView} 
                onAddClick={handleClickAdd} 
                onEditClick={handleClickEdit}
            />
        </>
    );
};
