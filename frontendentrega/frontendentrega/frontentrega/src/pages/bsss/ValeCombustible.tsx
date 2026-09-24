import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { ValeModule } from 'modules/bsss/vale';

// ----------------------------------------------------------------------

export default function ValeCombustible() {
    return (
        <Page title="Vale">
            <Container maxWidth="xl">
                <Typography variant="h4">Vale Combustible</Typography>
                <ValeModule />
            </Container>
        </Page>
    );
}
