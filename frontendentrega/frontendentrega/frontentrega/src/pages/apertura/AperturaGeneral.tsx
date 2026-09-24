import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { AperturaGeneralModule } from 'modules/apertura/apertura_general';

// ----------------------------------------------------------------------

export default function AperturaGeneral() {
    return (
        <Page title="AperturaGeneral">
            <Container maxWidth="xl">
                <Typography variant="h4">Apertura General</Typography>
                <AperturaGeneralModule />
            </Container>
        </Page>
    );
}
