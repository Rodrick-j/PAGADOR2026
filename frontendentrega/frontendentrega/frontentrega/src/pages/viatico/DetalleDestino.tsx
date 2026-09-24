import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { DetalleDestinoModule } from 'modules/viatico/detalle_destino';

// ----------------------------------------------------------------------

export default function DetalleDestino() {
    return (
        <Page title="DetalleDestino">
            <Container maxWidth="xl">
                <Typography variant="h4">Detalle Destino</Typography>
                <DetalleDestinoModule />
            </Container>
        </Page>
    );
}
