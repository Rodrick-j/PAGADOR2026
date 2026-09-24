import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { BitacoraViajeModule } from 'modules/bsss/bitacora_viaje';

// ----------------------------------------------------------------------

export default function BitacoraViaje() {
    return (
        <Page title="Bitacora de Viaje">
            <Container maxWidth="xl">
                <Typography variant="h4">Bitacora de Viaje</Typography>
                <BitacoraViajeModule />
            </Container>
        </Page>
    );
}
