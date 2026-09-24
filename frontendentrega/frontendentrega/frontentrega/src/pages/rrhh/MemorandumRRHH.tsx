import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { MemorandumrrhhModule } from 'modules/rrhh/memorandum_rrhh';

// ----------------------------------------------------------------------

export default function MemorandumRRHH() {
    return (
        <Page title="Memorandum RR.HH.">
            <Container maxWidth="xl">
                <Typography variant="h4">Memorandum RR.HH.</Typography>
                <MemorandumrrhhModule />
            </Container>
        </Page>
    );
}
