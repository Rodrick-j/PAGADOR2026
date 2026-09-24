import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { MemorandumModule } from 'modules/viatico/memorandum';

// ----------------------------------------------------------------------

export default function Memorandum() {
    return (
        <Page title="Memorandum Viaticos">
            <Container maxWidth="xl">
                <Typography variant="h4">Memorandum Viaticos</Typography>
                <MemorandumModule />
            </Container>
        </Page>
    );
}
