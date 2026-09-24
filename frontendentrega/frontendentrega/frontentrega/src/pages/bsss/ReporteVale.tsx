import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { ReporteValeModule } from 'modules/bsss/reporte_vale';

// ----------------------------------------------------------------------

export default function ReporteVale() {
    return (
        <Page title="Reporte Vale de Combustible">
            <Container maxWidth="xl">
                <Typography variant="h4">Reporte Vale de Combustible</Typography>
                <ReporteValeModule />
            </Container>
        </Page>
    );
}
