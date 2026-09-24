import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { VacacionFormDialog, VacacionFormModel } from './components/VacacionFormDialog';
import { VacacionTable, VacacionTableRefProps } from './components/VacacionTable';
import VacacionDialog from './components/VacacionDialog';
//services
import { VacacionModuleService } from './VacacionModuleService';
import { useNotify } from 'services/notify';
import { RUTAS } from 'constants/routes';
import { useNavigate } from 'react-router-dom';

export const VacacionModule = (): ReactElement => {
    const notify = useNotify();
    const navigate = useNavigate();

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openVacacionForm, setOpenVacacionForm] = useState(false);
    const [formModel, setFormModel] = useState<VacacionFormModel>();

    const handleClickView = async (id_vacacion: string) => {
        const actividadFormResponse = await VacacionModuleService.getVacacionFormData(id_vacacion);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenVacacionForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_vacacion: string) => {
        const actividadFormResponse = await VacacionModuleService.getVacacionFormData(id_vacacion);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    const tableRef = useRef<VacacionTableRefProps>(null);

    return (
        <>
            <VacacionFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <VacacionDialog
                open={openVacacionForm}
                onComplete={() => {
                    setOpenVacacionForm(false);
                }}
                formModel={formModel}
            />
            <VacacionTable
                ref={tableRef}
                onViewClick={handleClickView}
                onAddClick={handleClickAdd}
                onVacacionClick={(idVacacion) => navigate({
                    //pathname: RUTAS.solicitud_vacacion.getPath({ id: idVacacion})
                })}
                onEditClick={handleClickEdit}
            />
        </>
    );
};
