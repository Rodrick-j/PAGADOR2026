import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { VacacionModule } from 'modules/rrhh/vacacion';

// ----------------------------------------------------------------------

export default function Vacacion() {
    return (
        <Page title="Vacacion">
            <Container maxWidth="xl">
                <Typography variant="h4">Vacacion</Typography>
                <VacacionModule />
            </Container>
        </Page>
    );
}
