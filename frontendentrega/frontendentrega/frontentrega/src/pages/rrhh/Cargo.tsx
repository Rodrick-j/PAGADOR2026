import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { CargoModule } from 'modules/rrhh/cargo';

// ----------------------------------------------------------------------

export default function Cargo() {
    return (
        <Page title="Cargo">
            <Container maxWidth="xl">
                <Typography variant="h4">Cargo</Typography>
                <CargoModule />
            </Container>
        </Page>
    );
}
