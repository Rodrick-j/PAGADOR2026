import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { AreaModule } from 'modules/rrhh/area';

// ----------------------------------------------------------------------

export default function Area() {
    return (
        <Page title="Area">
            <Container maxWidth="xl">
                <Typography variant="h4">Area</Typography>
                <AreaModule />
            </Container>
        </Page>
    );
}
