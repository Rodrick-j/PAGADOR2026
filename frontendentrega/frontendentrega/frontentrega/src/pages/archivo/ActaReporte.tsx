import React from 'react';
import { useNavigate } from 'react-router-dom';

// @mui
import { Container, Typography } from '@mui/material';

// components
import Page from '../../components/Page';
import { ActaReporteModule } from 'modules/archivo/acta_reporte';

// ----------------------------------------------------------------------

export default function ActaReporte() {
    return (
        <Page title="Acta Reporte">
            <Container maxWidth="xl">
                <Typography variant="h4">Reportes Actas/Documentos</Typography>
                <ActaReporteModule />
            </Container>
        </Page>
    );
}
