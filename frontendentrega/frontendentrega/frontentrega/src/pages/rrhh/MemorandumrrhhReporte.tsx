import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { MemorandumrrhhReporteModule } from 'modules/rrhh/memorandum_rrhh_reporte';

// ----------------------------------------------------------------------

export default function MemorandumrrhhReporte() {
    return (
        <Page title="Reporte Memorandum RRHH">
            <Container maxWidth="xl">
                <Typography variant="h4">Reporte Memorandum RRHH</Typography>
                <MemorandumrrhhReporteModule />
            </Container>
        </Page>
    );
}
