import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { ViaticoModule } from 'modules/viatico/viatico';

// ----------------------------------------------------------------------

export default function Viatico() {
    return (
        <Page title="Viatico">
            <Container maxWidth="xl">
                <Typography variant="h4">Viatico</Typography>
                <ViaticoModule />
            </Container>
        </Page>
    );
}
