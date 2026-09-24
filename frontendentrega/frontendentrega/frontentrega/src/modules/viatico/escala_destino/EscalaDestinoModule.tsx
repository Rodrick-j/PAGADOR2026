import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { EscalaDestinoFormDialog, EscalaDestinoFormModel } from './components/EscalaDestinoFormDialog';
import { EscalaDestinoTable, EscalaDestinoTableRefProps } from './components/EscalaDestinoTable';
import EscalaDestinoDialog from './components/EscalaDestinoDialog';
//services
import { EscalaDestinoModuleService } from './EscalaDestinoModuleService';
import { useNotify } from 'services/notify';

export const EscalaDestinoModule = (): ReactElement => {
    const notify = useNotify();

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openEscalaDestinoForm, setOpenEscalaDestinoForm] = useState(false);
    const [formModel, setFormModel] = useState<EscalaDestinoFormModel>();

    const handleClickView = async (id_area: string) => {
        const actividadFormResponse = await EscalaDestinoModuleService.getEscalaDestinoFormData(id_area);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenEscalaDestinoForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_area: string) => {
        const actividadFormResponse = await EscalaDestinoModuleService.getEscalaDestinoFormData(id_area);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    const tableRef = useRef<EscalaDestinoTableRefProps>(null);

    return (
        <>
            <EscalaDestinoFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <EscalaDestinoDialog
                open={openEscalaDestinoForm}
                onComplete={() => {
                    setOpenEscalaDestinoForm(false);
                }}
                formModel={formModel}
            />
            <EscalaDestinoTable
                ref={tableRef}
                onViewClick={handleClickView}
                onAddClick={handleClickAdd}
                onEditClick={handleClickEdit}
            />
        </>
    );
};
