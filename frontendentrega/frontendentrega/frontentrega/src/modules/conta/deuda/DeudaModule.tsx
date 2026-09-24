import React, { ReactElement, useState, useRef, useEffect } from 'react';
// @mui

// components
import { DeudaFormDialog, DeudaFormModel } from './components/DeudaFormDialog';
import { DeudaTable, DeudaTableRefProps } from './components/DeudaTable';
import DeudaDialog from './components/DeudaDialog';
//services
import { DeudaModuleService } from './DeudaModuleService';
import { useNotify } from 'services/notify';
import {useParams} from 'react-router-dom';
import { useIsMounted } from 'hooks/useIsMounted';
import { CuentaModuleService } from '../cuenta';
import { CuentaFormModel } from '../cuenta/components/CuentaFormDialog';
import { Box, Grid, Typography } from '@mui/material';
import { HistorialTable, HistorialTableRefProps } from './components/HistorialTable';
import { PagoDeudaFormDialog } from './components/PagoDeudaFormDialog';

export type cuentaProps = {
    nombre_deudor           : string;
    tipo_cuenta             : string;
    ci                      : string;
    gestion_generacion_deuda: string;
    documentacion_respaldo  : string;
    direccion_domicilio     : string;
    telefono_celular        : string;
    confirmacion            : string;
    descripcion_confirmacion: string;
    incremento_deuda        : string;
    monto_incremento_deuda  : number;
    depositos_realizados    : string;
    observacion             : string;
    saldo                   : number;
    descripcion_deuda       : string;
    estado_proceso          : string;


}

export type historialProps = {
    nombre_deudor           : string;
    tipo_cuenta             : string;
    ci                      : string;
    gestion_generacion_deuda: string;
    documentacion_respaldo  : string;
    direccion_domicilio     : string;
    telefono_celular        : string;
    confirmacion            : string;
    descripcion_confirmacion: string;
    incremento_deuda        : string;
    monto_incremento_deuda  : number;
    depositos_realizados    : string;
    observacion             : string;
    saldo                   : number;
}

export const DeudaModule = (): ReactElement => {
    const notify = useNotify();
    const params = useParams();
    const isMounted = useIsMounted();

    const ID_CUENTA = params.id || '';

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openDeudaForm, setOpenDeudaForm] = useState(false);
    const [openPagoDeudaForm, setOpenPagoDeudaForm] = useState(false);
    const [formModel, setFormModel] = useState<DeudaFormModel>();
    const [cuentaData, setCuentaData] = useState<cuentaProps>();
    const [regularizacionData, setRegularizacionData] = useState<string[]>([]);

    const handleClickView = async (id_deuda: string) => {
        const deudaFormResponse = await DeudaModuleService.getDeudaFormData(id_deuda);
        if (!deudaFormResponse.success) return notify.error(deudaFormResponse.msg);
        const newFormModel = deudaFormResponse.data;
        setFormModel(newFormModel);
        setOpenDeudaForm(true);
    };

    const handleRegularizarClick = async (ids: string[]) => {
        setRegularizacionData(ids);
        setOpenPagoDeudaForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_deuda: string) => {
        const deudaFormResponse = await DeudaModuleService.getDeudaFormData(id_deuda);
        if (!deudaFormResponse.success) return notify.error(deudaFormResponse.msg);
        const newFormModel = deudaFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!isMounted()) return;
            const deudaFormResponse = await CuentaModuleService.getCuentaFormData(ID_CUENTA);
            if (!deudaFormResponse.success) return notify.error(deudaFormResponse.msg);
            const newFormModel: CuentaFormModel | null = deudaFormResponse.data || null;
            if (isMounted()) {
                if (newFormModel !== null)
                    setCuentaData(newFormModel);
            }
        };
        if(ID_CUENTA) fetchData();

    }, [ID_CUENTA]);

    const tableRef1 = useRef<DeudaTableRefProps>(null);
    const tableRef2 = useRef<HistorialTableRefProps>(null);

    return (
        <>
            <DeudaFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef1.current?.refresh();
                }}
                cuentaId={ID_CUENTA}
            />
            <PagoDeudaFormDialog
                open={openPagoDeudaForm}
                ids={regularizacionData}
                onComplete={() => {
                    setOpenPagoDeudaForm(false);
                    tableRef1.current?.refresh();
                    tableRef2.current?.refresh();
                }}
                cuentaId={ID_CUENTA}
            />
            <DeudaDialog
                open={openDeudaForm}
                onComplete={() => {
                    setOpenDeudaForm(false);
                }}
                formModel={formModel}
            />
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography noWrap variant="h6">Detalle Deuda</Typography>
                        <DeudaTable
                            ref={tableRef1}
                            onViewClick={handleClickView}
                            onAddClick={handleClickAdd}
                            onEditClick={handleClickEdit}
                            onRegularizarClick={handleRegularizarClick}
                            cuentaId={ID_CUENTA}
                            data={cuentaData || null}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography noWrap variant="h6">Historial de Deuda</Typography>
                        <HistorialTable
                            ref={tableRef2}
                            onComplete={() => {
                                tableRef1.current?.refresh();
                            }}
                            cuentaId={ID_CUENTA}
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};
