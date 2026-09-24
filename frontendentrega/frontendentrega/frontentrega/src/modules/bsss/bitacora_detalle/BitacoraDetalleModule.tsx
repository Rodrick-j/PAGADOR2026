import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { BitacoraDetalleFormDialog, BitacoraDetalleFormModel } from './components/BitacoraDetalleFormDialog';
import { BitacoraDetalleTable, BitacoraDetalleTableRefProps } from './components/BitacoraDetalleTable';
import BitacoraDetalleDialog from './components/BitacoraDetalleDialog';
//services
import { BitacoraDetalleModuleService } from './BitacoraDetalleModuleService';
import { useNotify } from 'services/notify';
import { useParams } from 'react-router-dom';

export const BitacoraDetalleModule = (): ReactElement => {
    const params = useParams();	
    const SEMANA = params.semana;// params.id || '';
    const notify = useNotify();
    const ID_BITACORA_VIAJE = params.id || '';

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openBitacoraDetalleForm, setOpenBitacoraDetalleForm] = useState(false);
    const [formModel, setFormModel] = useState<BitacoraDetalleFormModel>();

    const handleClickView = async (id_bitacora_detalle: string) => {
        const actividadFormResponse = await BitacoraDetalleModuleService.getBitacoraDetalleFormData(id_bitacora_detalle);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenBitacoraDetalleForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_bitacora_detalle: string) => {
        const actividadFormResponse = await BitacoraDetalleModuleService.getBitacoraDetalleFormData(id_bitacora_detalle);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    const tableRef = useRef<BitacoraDetalleTableRefProps>(null);

    return (
        <>
            <BitacoraDetalleFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
                bitacoraViajeId={ID_BITACORA_VIAJE}
                semana={Number(SEMANA)}
            />
            <BitacoraDetalleDialog
                open={openBitacoraDetalleForm}
                onComplete={() => {
                    setOpenBitacoraDetalleForm(false);
                }}
                formModel={formModel}
            />
            <BitacoraDetalleTable 
                ref={tableRef} 
                onViewClick={handleClickView} 
                onAddClick={handleClickAdd} 
                onEditClick={handleClickEdit}
                bitacoraViajeId={ID_BITACORA_VIAJE}
            />
        </>
    );
};
