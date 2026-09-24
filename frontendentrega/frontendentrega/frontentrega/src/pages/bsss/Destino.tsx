import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { DestinoModule } from 'modules/bsss/destino';

// ----------------------------------------------------------------------

export default function Destino() {
    return (
        <Page title="Destino">
            <Container maxWidth="xl">
                <Typography variant="h4">Destino</Typography>
                <DestinoModule />
            </Container>
        </Page>
    );
}
