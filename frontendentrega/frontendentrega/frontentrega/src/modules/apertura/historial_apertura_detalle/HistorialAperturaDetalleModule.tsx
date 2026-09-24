import React, { ReactElement, useState, useRef, useEffect } from 'react';
// @mui

// components
import { HistorialAperturaDetalleFormDialog, HistorialAperturaDetalleFormModel } from './components/HistorialAperturaDetalleFormDialog';
import { HistorialAperturaDetalleTable, HistorialAperturaDetalleTableRefProps } from './components/HistorialAperturaDetalleTable';
import HistorialAperturaDetalleDialog from './components/HistorialAperturaDetalleDialog';
//services
import { HistorialAperturaDetalleModuleService } from './HistorialAperturaDetalleModuleService';
import { useNotify } from 'services/notify';
import {useParams} from 'react-router-dom';
import { useIsMounted } from 'hooks/useIsMounted'
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography } from '@mui/material';
import { HistorialGastoTable, HistorialGastoTableRefProps } from './components/HistorialGastoTable';
import { RUTAS } from 'constants/routes';
import { AperturaGeneralModuleService } from '../apertura_general';
import { AperturaGeneralFormModel } from '../apertura_general/components/AperturaGeneralFormDialog';

export type AperturaGeneralProps= {
    id: string;
    ue                            : number;
    nombre_area                    : string;
    sigla_area                     : string;        
    apertura_programatica          : string;
    cod_fte                        : number;
    cod_org                        : number;
    objeto                         : string;
    descripcion_objeto_gasto       : string;    
    presupuesto_inicial            : number;
    presupuesto_restante           : number;
    mod_aprobada                    : number;
    presupuesto_vigente             : number;
    pagado                         : number;
    saldo_ejecutar                  : number;
    estado                         : string;
    sisin                          : string;
    gestion                        : string;
    areaId                         : string; 
    estado_activo                  : boolean;
};


export const HistorialAperturaDetalleModule = (): ReactElement => {
    const notify = useNotify();
    const params = useParams();
    const isMounted = useIsMounted();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<string>("");

    const ID_HISTORIAL_APERTURA = params.id || '';

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openHistorialAperturaDetalleForm, setOpenHistorialAperturaDetalleForm] = useState(false);
    const [formModel, setFormModel] = useState<HistorialAperturaDetalleFormModel>();
    const [aperturaGeneralData, setAperturaGeneralData] = useState<AperturaGeneralFormModel>();

    const handleClickView = async (id_apertura_viatico: string) => {
        const actividadFormResponse = await HistorialAperturaDetalleModuleService.getHistorialAperturaDetalleFormData(id_apertura_viatico);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenHistorialAperturaDetalleForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_apertura_viatico: string) => {
        const actividadFormResponse = await HistorialAperturaDetalleModuleService.getHistorialAperturaDetalleFormData(id_apertura_viatico);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

  

    useEffect(() => {
        const fetchData = async () => {
            if (!isMounted()) return;
            const aperturaFormResponse = await AperturaGeneralModuleService.getAperturaGeneralFormData(ID_HISTORIAL_APERTURA);
            if (!aperturaFormResponse.success) return notify.error(aperturaFormResponse.msg);
            const newFormModel: AperturaGeneralFormModel | null = aperturaFormResponse.data || null;
            if (isMounted()) {
                if (newFormModel !== null)
                    setAperturaGeneralData(newFormModel);
            }
        };
        if(ID_HISTORIAL_APERTURA) fetchData();

    }, [ID_HISTORIAL_APERTURA]);

    const tableRef1 = useRef<HistorialAperturaDetalleTableRefProps>(null);
    const tableRef2 = useRef<HistorialGastoTableRefProps>(null);


    return (
        <>
            <HistorialAperturaDetalleFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef1.current?.refresh();
                    tableRef2.current?.refresh();
                }}
                aperturaId={ID_HISTORIAL_APERTURA}
            />
            <HistorialAperturaDetalleDialog
                open={openHistorialAperturaDetalleForm}
                onComplete={() => {
                    setOpenHistorialAperturaDetalleForm(false);
                }}
                formModel={formModel}
            />          

            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography noWrap variant="h6">Detalle Descripcion Objeto Gasto</Typography>
                        <HistorialAperturaDetalleTable
                            ref={tableRef1}
                            onViewClick={handleClickView}
                            onAddClick={handleClickAdd}
                            onEditClick={handleClickEdit}
                            onDetalleClick={(idHistorialAperturaDetalle) => navigate({
                                pathname: RUTAS.historial_apertura_detalle.getPath({ id: idHistorialAperturaDetalle})
                            })}
                          //  onRegularizarClick={handleRegularizarClick}
                            aperturaId={ID_HISTORIAL_APERTURA}
                            data={aperturaGeneralData || null}                            
                        />
                    </Grid>
                   <Grid item xs={12} md={6}>
                        <Typography noWrap variant="h6">Historial Gasto por Objeto</Typography>
                        <HistorialGastoTable
                            ref={tableRef2}
                            onComplete={() => {
                                tableRef1.current?.refresh();
                            }}
                            aperturaId={ID_HISTORIAL_APERTURA}
                        />
                    </Grid>
                </Grid>
            </Box>    
        </>
    );
};
