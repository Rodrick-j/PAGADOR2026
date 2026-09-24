import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { ActividadModule } from 'modules/contra/actividad';

// ----------------------------------------------------------------------

export default function Actividad() {
    return (
        <Page title="Actividad">
            <Container maxWidth="xl">
                <Typography variant="h4">Actividad</Typography>
                <ActividadModule />
            </Container>
        </Page>
    );
}
