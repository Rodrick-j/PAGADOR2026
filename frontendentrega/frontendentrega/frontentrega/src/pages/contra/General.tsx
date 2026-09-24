import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { GeneralModule } from 'modules/contra/general';

// ----------------------------------------------------------------------

export default function General() {
    return (
        <Page title="General">
            <Container maxWidth="xl">
                <Typography variant="h4">General</Typography>
                <GeneralModule />
            </Container>
        </Page>
    );
}
