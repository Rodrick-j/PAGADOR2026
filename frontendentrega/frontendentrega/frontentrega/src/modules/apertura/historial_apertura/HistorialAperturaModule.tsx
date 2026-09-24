import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { HistorialAperturaFormDialog, HistorialAperturaFormModel } from './components/HistorialAperturaFormDialog';
import { HistorialAperturaTable, HistorialAperturaTableRefProps, ReporteAperturaGeneralTableModel } from './components/HistorialAperturaTable';
import HistorialAperturaDialog from './components/HistorialAperturaDialog';
//services
import { HistorialAperturaModuleService } from './HistorialAperturaModuleService';
import { useNotify } from 'services/notify';
import {useParams} from 'react-router-dom';
import { useIsMounted } from 'hooks/useIsMounted'
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography } from '@mui/material';
import { RUTAS } from 'constants/routes';
import { HistorialAperturaDetalleModuleService } from '../historial_apertura_detalle';

export const HistorialAperturaModule = (): ReactElement => {
    const notify = useNotify();
    const params = useParams();
    const isMounted = useIsMounted();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<string>("");

    const ID_CUENTA = params.id || '';

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openHistorialAperturaForm, setOpenHistorialAperturaForm] = useState(false);
    const [formModel, setFormModel] = useState<HistorialAperturaFormModel>();

    const handleClickView = async (id_apertura_viatico: string) => {
        const actividadFormResponse = await HistorialAperturaModuleService.getHistorialAperturaFormData(id_apertura_viatico);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenHistorialAperturaForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_apertura_viatico: string) => {
        const actividadFormResponse = await HistorialAperturaModuleService.getHistorialAperturaFormData(id_apertura_viatico);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    const handleClickImprimir = async (data: ReporteAperturaGeneralTableModel) => {
        if (loading) return;
        if (!isMounted()) return
        setLoading(data.id);       
        return HistorialAperturaModuleService.getReportHistorialAperturaPDF(data.id, data.apertura_programatica!).then(() => {
			
            setLoading("");
        });
    };

    const tableRef = useRef<HistorialAperturaTableRefProps>(null);
   


    return (
        <>
            <HistorialAperturaFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <HistorialAperturaDialog
                open={openHistorialAperturaForm}
                onComplete={() => {
                    setOpenHistorialAperturaForm(false);
                }}
                formModel={formModel}
            />
            <HistorialAperturaTable
                ref={tableRef}
                onViewClick={handleClickView}
                onAddClick={handleClickAdd}
                onEditClick={handleClickEdit}
                onDetalleClick={(idHistorialApertura) => navigate({
                    pathname: RUTAS.historial_apertura_detalle.getPath({ id: idHistorialApertura})
                })}
                onImprimirClick={handleClickImprimir}
                loading={loading}
            />        
        </>
    );
};
