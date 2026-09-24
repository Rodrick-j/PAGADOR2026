import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { VehiculoPublicoModule } from 'modules/viatico/vehiculo_publico';

// ----------------------------------------------------------------------

export default function VehiculoPublico() {
    return (
        <Page title="VehiculoPublico">
            <Container maxWidth="xl">
                <Typography variant="h4">Vehiculo Publico</Typography>
                <VehiculoPublicoModule />
            </Container>
        </Page>
    );
}
