import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { EscalaModule } from 'modules/viatico/escala';

// ----------------------------------------------------------------------

export default function Escala() {
    return (
        <Page title="Escala">
            <Container maxWidth="xl">
                <Typography variant="h4">Escala</Typography>
                <EscalaModule />
            </Container>
        </Page>
    );
}
