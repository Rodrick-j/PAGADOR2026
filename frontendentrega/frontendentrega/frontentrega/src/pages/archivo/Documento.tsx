import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { DocumentoModule } from 'modules/archivo/documento';

// ----------------------------------------------------------------------

export default function Documento() {
    return (
        <Page title="Documento">
            <Container maxWidth="xl">
                <Typography variant="h4">Documento</Typography>
                <DocumentoModule />
            </Container>
        </Page>
    );
}
