import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { CitesModule } from 'modules/correspondecia/cites';

// ----------------------------------------------------------------------

export default function Cites() {
    return (
        <Page title="Cites">
            <Container maxWidth="xl">
                <Typography variant="h4">Cites</Typography>
                <CitesModule />
            </Container>
        </Page>
    );
}
