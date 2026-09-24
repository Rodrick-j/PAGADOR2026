import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import {AsignacionModule } from 'modules/bsss/asignacion';

// ----------------------------------------------------------------------

export default function Asignacion() {
    return (
        <Page title="Asignacion">
            <Container maxWidth="xl">
                <Typography variant="h4">Asignacion Usuario</Typography>
                <AsignacionModule />
            </Container>
        </Page>
    );
}
