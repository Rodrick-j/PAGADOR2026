import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { ReporteProcesoModule } from 'modules/contra/reporte';

// ----------------------------------------------------------------------

export default function ReporteProceso() {
    return (
        <Page title="Reporte Proceso">
            <Container maxWidth="xl">
                <Typography variant="h4">Reporte Proceso</Typography>
                <ReporteProcesoModule />
            </Container>
        </Page>
    );
}
