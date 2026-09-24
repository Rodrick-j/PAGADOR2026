import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { EscalaDestinoModule } from 'modules/viatico/escala_destino';

// ----------------------------------------------------------------------

export default function EscalaDestino() {
    return (
        <Page title="EscalaDestino">
            <Container maxWidth="xl">
                <Typography variant="h4">Escala Destino</Typography>
                <EscalaDestinoModule />
            </Container>
        </Page>
    );
}
