import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { DetalleDestinoFormDialog, DetalleDestinoFormModel } from './components/DetalleDestinoFormDialog';
import { DetalleDestinoTable, DetalleDestinoTableRefProps } from './components/DetalleDestinoTable';
import DetalleDestinoDialog from './components/DetalleDestinoDialog';
//services
import { DetalleDestinoModuleService } from './DetalleDestinoModuleService';
import { useNotify } from 'services/notify';

export const DetalleDestinoModule = (): ReactElement => {
    const notify = useNotify();

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openDetalleDestinoForm, setOpenDetalleDestinoForm] = useState(false);
    const [formModel, setFormModel] = useState<DetalleDestinoFormModel>();

    const handleClickView = async (id_area: string) => {
        const actividadFormResponse = await DetalleDestinoModuleService.getDetalleDestinoFormData(id_area);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenDetalleDestinoForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_area: string) => {
        const actividadFormResponse = await DetalleDestinoModuleService.getDetalleDestinoFormData(id_area);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    const tableRef = useRef<DetalleDestinoTableRefProps>(null);

    return (
        <>
            <DetalleDestinoFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <DetalleDestinoDialog
                open={openDetalleDestinoForm}
                onComplete={() => {
                    setOpenDetalleDestinoForm(false);
                }}
                formModel={formModel}
            />
            <DetalleDestinoTable
                ref={tableRef}
                onViewClick={handleClickView}
                onAddClick={handleClickAdd}
                onEditClick={handleClickEdit}
            />
        </>
    );
};
