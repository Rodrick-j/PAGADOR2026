import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { AsignacionFormDialog, AsignacionFormModel } from './components/AsignacionFormDialog';
import { AsignacionTable, AsignacionTableRefProps } from './components/AsignacionTable';
import AsignacionDialog from './components/AsignacionDialog';
//services
import { AsignacionModuleService } from './AsignacionModuleService';
import { useNotify } from 'services/notify';

export const AsignacionModule = (): ReactElement => {
    const notify = useNotify();

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openAsignacionForm, setOpenAsignacionForm] = useState(false);
    const [formModel, setFormModel] = useState<AsignacionFormModel>();

    const handleClickView = async (id_asignacion: string) => {
        const asignacionFormResponse = await AsignacionModuleService.getAsignacionFormData(id_asignacion);
        if (!asignacionFormResponse.success) return notify.error(asignacionFormResponse.msg);
        const newFormModel = asignacionFormResponse.data;
        setFormModel(newFormModel);
        setOpenAsignacionForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_asignacion: string) => {
        const asignacionFormResponse = await AsignacionModuleService.getAsignacionFormData(id_asignacion);
        if (!asignacionFormResponse.success) return notify.error(asignacionFormResponse.msg);
        const newFormModel = asignacionFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    const tableRef = useRef<AsignacionTableRefProps>(null);

    return (
        <>
            <AsignacionFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <AsignacionDialog
                open={openAsignacionForm}
                onComplete={() => {
                    setOpenAsignacionForm(false);
                }}
                formModel={formModel}
            />
            <AsignacionTable
                ref={tableRef}
                onViewClick={handleClickView}
                onAddClick={handleClickAdd}
                onEditClick={handleClickEdit}
            />
        </>
    );
};
