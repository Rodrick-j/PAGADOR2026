import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { DescargoModule } from 'modules/viatico/descargo';

// ----------------------------------------------------------------------

export default function Descargo() {
    return (
        <Page title="Descargo">
            <Container maxWidth="xl">
                <Typography variant="h4">Descargo</Typography>
                <DescargoModule />
            </Container>
        </Page>
    );
}
