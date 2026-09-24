import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { ReporteViaticoModule } from 'modules/viatico/reporte_viatico';

// ----------------------------------------------------------------------

export default function ReporteViatico() {
    return (
        <Page title="Reporte Viatico">
            <Container maxWidth="xl">
                <Typography variant="h4">Reporte Viatico</Typography>
                <ReporteViaticoModule />
            </Container>
        </Page>
    );
}
