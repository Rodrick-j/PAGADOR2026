import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { ProcesoFormDialog, ProcesoFormModel } from './components/ProcesoFormDialog';
import { ProcesoTable, ProcesoTableRefProps } from './components/ProcesoTable';
import ProcesoDialog from './components/ProcesoDialog';
//services
import { ProcesoModuleService } from './ProcesoModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';
import { useNavigate } from 'react-router-dom';
import { RUTAS } from 'constants/routes';

export const ProcesoModule = (): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();
    const navigate = useNavigate();

    const [loading, setLoading] = React.useState(false);
    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openProcesoForm, setOpenProcesoForm] = useState(false);
    const [formModel, setFormModel] = useState<ProcesoFormModel>();

    const handleClickView = async (id_proceso: string) => {
        const actividadFormResponse = await ProcesoModuleService.getProcesoFormData(id_proceso);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenProcesoForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_proceso: string) => {
        const actividadFormResponse = await ProcesoModuleService.getProcesoFormData(id_proceso);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    const handleClickDownload = async (id_cuenta?: string) => {
        if (loading) return;
        if (!isMounted()) return
        
    };

    const tableRef = useRef<ProcesoTableRefProps>(null);

    return (
        <>
            <ProcesoFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <ProcesoDialog
                open={openProcesoForm}
                onComplete={() => {
                    setOpenProcesoForm(false);
                }}
                formModel={formModel}
            />
            <ProcesoTable 
                ref={tableRef} 
                onViewClick={handleClickView} 
                onAddClick={handleClickAdd} 
                onEditClick={handleClickEdit}
                onDetalleClick={(idProceso) => navigate({
                    pathname: RUTAS.proceso_detalle.getPath({ id: idProceso})
                })}
            />
        </>
    );
};
