import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { BitacoraViajeFormDialog, BitacoraViajeFormModel } from './components/BitacoraViajeFormDialog';
import { BitacoraViajeTable, BitacoraViajeTableRefProps } from './components/BitacoraViajeTable';
import BitacoraViajeDialog from './components/BitacoraViajeDialog';
//services
import { BitacoraViajeModuleService } from './BitacoraViajeModuleService';
import { useNotify } from 'services/notify';
import { useNavigate } from 'react-router-dom';
import { RUTAS } from 'constants/routes';

export const BitacoraViajeModule = (): ReactElement => {
    const notify = useNotify();
    const navigate = useNavigate();

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openBitacoraViajeForm, setOpenBitacoraViajeForm] = useState(false);
    const [formModel, setFormModel] = useState<BitacoraViajeFormModel>();

    const handleClickView = async (id_bitacora_viaje: string) => {
        const actividadFormResponse = await BitacoraViajeModuleService.getBitacoraViajeFormData(id_bitacora_viaje);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenBitacoraViajeForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_bitacora_viaje: string) => {
        const actividadFormResponse = await BitacoraViajeModuleService.getBitacoraViajeFormData(id_bitacora_viaje);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    const tableRef = useRef<BitacoraViajeTableRefProps>(null);

    return (
        <>
            <BitacoraViajeFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <BitacoraViajeDialog
                open={openBitacoraViajeForm}
                onComplete={() => {
                    setOpenBitacoraViajeForm(false);
                }}
                formModel={formModel}
            />
            <BitacoraViajeTable 
                ref={tableRef} 
                onViewClick={handleClickView} 
                onAddClick={handleClickAdd} 
                onEditClick={handleClickEdit}
                onDetalleClick={(idBitacoraViaje, semana) => navigate({
                    pathname: RUTAS.bitacora_detalle.getPath({ id: idBitacoraViaje, semana: String(semana) })
                })}
            />
        </>
    );
};
