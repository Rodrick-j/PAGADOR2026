import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { AperturaViaticoModule } from 'modules/viatico/apertura_viatico';

// ----------------------------------------------------------------------

export default function AperturaViatico() {
    return (
        <Page title="AperturaViatico">
            <Container maxWidth="xl">
                <Typography variant="h4">Apertura Viatico</Typography>
                <AperturaViaticoModule />
            </Container>
        </Page>
    );
}
