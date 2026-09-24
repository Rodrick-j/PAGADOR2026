import React, { ReactElement, useState, useRef, useEffect } from 'react';
// @mui

// components
import { ValeFormDialog, ValeFormModel } from './components/ValeFormDialog';
import { ValeTable, ValeTableModel, ValeTableRefProps } from './components/ValeTable';
import ValeDialog from './components/ValeDialog';
//services
import { ValeModuleService } from './ValeModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';
import useLocalStorage from 'hooks/localstorage/useLocalStorage';

export const ValeModule = (): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();

    const [loading, setLoading] = useState<string>("");
    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openValeForm, setOpenValeForm] = useState(false);
    const [formModel, setFormModel] = useState<ValeFormModel>();
    
    const [habilitado] = useLocalStorage<any>('valeCombustibleHabilitado', false);
    const [estadoPresupuesto] = useLocalStorage<any>('valeCombustiblePresupuesto', false);

    const handleClickView = async (id_vale: string) => {
        const actividadFormResponse = await ValeModuleService.getValeFormData(id_vale);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenValeForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickImprimir = async (data: ValeTableModel) => {
        if (loading) return;
        if (!isMounted()) return
        setLoading(data.id);
        return ValeModuleService.getReportPDF(data.id, data.cod_vale).then(() => {
            setLoading("");
        });
    };

    const handleClickEdit = async (id_vale: string) => {
        const actividadFormResponse = await ValeModuleService.getValeFormData(id_vale);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    const tableRef = useRef<ValeTableRefProps>(null);

    return (
        <>
            <ValeFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <ValeDialog
                open={openValeForm}
                onComplete={() => {
                    setOpenValeForm(false);
                }}
                formModel={formModel}
            />
            <ValeTable 
                ref={tableRef} 
                onViewClick={handleClickView} 
                onAddClick={handleClickAdd} 
                onEditClick={handleClickEdit}
                onImprimirClick={handleClickImprimir}
                habilitado={habilitado}
                estadoPresupuesto={estadoPresupuesto}
                loading={loading}
            />
        </>
    );
};
