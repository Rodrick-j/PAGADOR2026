import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { VehiculoModule } from 'modules/bsss/vehiculo';

// ----------------------------------------------------------------------

export default function Vehiculo() {
    return (
        <Page title="Vehiculo">
            <Container maxWidth="xl">
                <Typography variant="h4">Vehiculo</Typography>
                <VehiculoModule />
            </Container>
        </Page>
    );
}
