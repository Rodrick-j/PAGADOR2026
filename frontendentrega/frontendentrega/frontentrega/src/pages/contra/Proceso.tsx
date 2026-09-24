import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { ProcesoModule } from 'modules/contra/proceso';

// ----------------------------------------------------------------------

export default function Proceso() {
    return (
        <Page title="Proceso">
            <Container maxWidth="xl">
                <Typography variant="h4">Proceso</Typography>
                <ProcesoModule />
            </Container>
        </Page>
    );
}
