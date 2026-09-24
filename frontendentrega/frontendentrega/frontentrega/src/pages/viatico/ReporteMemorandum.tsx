import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { ReporteProcesoModule } from 'modules/contra/reporte';

// ----------------------------------------------------------------------

export default function ReporteMemorandum() {
    return (
        <Page title="Reporte Memorandum Viaticos">
            <Container maxWidth="xl">
                <Typography variant="h4">Reporte Memorandum Viaticos</Typography>
                <ReporteProcesoModule />
            </Container>
        </Page>
    );
}
