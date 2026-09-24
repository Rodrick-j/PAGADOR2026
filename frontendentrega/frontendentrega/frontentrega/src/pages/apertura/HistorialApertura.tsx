import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { HistorialAperturaModule } from 'modules/apertura/historial_apertura';

// ----------------------------------------------------------------------

export default function HistorialApertura() {
    return (
        <Page title="HistorialApertura">
            <Container maxWidth="xl">
                <Typography variant="h4">Historial Apertura</Typography>
                <HistorialAperturaModule />
            </Container>
        </Page>
    );
}
