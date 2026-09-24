import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { ObjetoGastoModule } from 'modules/apertura/objeto_gasto';

// ----------------------------------------------------------------------

export default function ObjetoGasto() {
    return (
        <Page title="ObjetoGasto">
            <Container maxWidth="xl">
                <Typography variant="h4">Objeto Gasto</Typography>
                <ObjetoGastoModule />
            </Container>
        </Page>
    );
}
