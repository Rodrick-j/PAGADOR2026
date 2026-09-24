/**
 * Proyecto: Plataforma PAGADOR
 * Autor técnico: Ing. Giancarlo Delgadillo Coca
 * Desarrollado para el Gobierno Autónomo Departamental de Oruro.
 *
 * Se reconoce la autoría técnica al Ing. Giancarlo Delgadillo Coca en la implementación de este
 * código fuente, sin perjuicio de la titularidad institucional aplicable.
 */
import React, { useEffect, useState } from 'react';
// @mui
import { Grid, Container, Typography, Box } from '@mui/material';
// components
import Page from '../components/Page';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import { useSession } from 'hooks/session';
// hooks
import useResponsive from 'hooks/useResponsive';
import { ValeModuleService } from 'modules/bsss/vale/ValeModuleService';
// ----------------------------------------------------------------------
const FORMAT = 'EEEE, dd MMMM yyyy hh:mm a';

export default function DashboardApp() {

    const authUser = useSession();
    const smUp = useResponsive('up', 'sm');

    const generoMasculino = authUser.genero === 'MASCULINO';
    const bienvenidoText = generoMasculino ? 'Bienvenido' : 'Bienvenida';
    const fechaActual = format(new Date(), FORMAT,{ locale: es }).toString();

    const [valeCombustible, setValeCombustible] = useState<string | null>(localStorage.getItem('valeCombustibleHabilitado'));
    const MODULOS = authUser.modulos.find((a:any) => a.name==='vale');
    const is_vale = (MODULOS && typeof MODULOS === 'object') || false;

    useEffect(() => {
        const fetchData = async () => {
            const vehiculoAperturaResponse = await ValeModuleService.getEstadoVale();
            console.log("🚀 ~ fetchData ~ vehiculoAperturaResponse:", vehiculoAperturaResponse)
            if (vehiculoAperturaResponse.success) {
                localStorage.setItem('valeCombustibleHabilitado',vehiculoAperturaResponse.data.estado);
                localStorage.setItem('valeCombustiblePresupuesto',vehiculoAperturaResponse.data.estado_presupuesto);
                setValeCombustible(vehiculoAperturaResponse.data.estado);
            }
        };

        if (!valeCombustible && is_vale) {
            fetchData();
        }
    }, [valeCombustible]);

    return (
        <Page title="Panel">
            <Container maxWidth="xl">
                <Box mb={5} sx={{
                                ...(smUp && { display: 'flex', justifyContent:'space-between' })
                                }}
                >
                    <Typography variant="h4">Hola, {bienvenidoText}</Typography>
                    <Typography variant="caption">{fechaActual}</Typography>
                </Box>
                <Grid container spacing={3}>
                    {/* PANEL */}
                    <Grid item xs={12} md={6} lg={12}>

                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
}
