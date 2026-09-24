import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { VehiculoPublicoFormDialog, VehiculoPublicoFormModel } from './components/VehiculoPublicoFormDialog';
import { VehiculoPublicoTable, VehiculoPublicoTableRefProps } from './components/VehiculoPublicoTable';
import VehiculoPublicoDialog from './components/VehiculoPublicoDialog';
//services
import { VehiculoPublicoModuleService } from './VehiculoPublicoModuleService';
import { useNotify } from 'services/notify';

export const VehiculoPublicoModule = (): ReactElement => {
    const notify = useNotify();

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openVehiculoPublicoForm, setOpenVehiculoPublicoForm] = useState(false);
    const [formModel, setFormModel] = useState<VehiculoPublicoFormModel>();

    const handleClickView = async (id_area: string) => {
        const actividadFormResponse = await VehiculoPublicoModuleService.getVehiculoPublicoFormData(id_area);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenVehiculoPublicoForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_area: string) => {
        const actividadFormResponse = await VehiculoPublicoModuleService.getVehiculoPublicoFormData(id_area);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    const tableRef = useRef<VehiculoPublicoTableRefProps>(null);

    return (
        <>
            <VehiculoPublicoFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <VehiculoPublicoDialog
                open={openVehiculoPublicoForm}
                onComplete={() => {
                    setOpenVehiculoPublicoForm(false);
                }}
                formModel={formModel}
            />
            <VehiculoPublicoTable
                ref={tableRef}
                onViewClick={handleClickView}
                onAddClick={handleClickAdd}
                onEditClick={handleClickEdit}
            />
        </>
    );
};
