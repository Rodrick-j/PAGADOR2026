import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { CuentaModule } from 'modules/conta/cuenta';

// ----------------------------------------------------------------------

export default function Cuenta() {
    return (
        <Page title="Cuenta">
            <Container maxWidth="xl">
                <Typography variant="h4">Cuenta</Typography>
                <CuentaModule />
            </Container>
        </Page>
    );
}
