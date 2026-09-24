import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { ValeModule } from 'modules/bsss/vale_admin';

// ----------------------------------------------------------------------

export default function Vale() {
    return (
        <Page title="Vale">
            <Container maxWidth="xl">
                <Typography variant="h4">Vale</Typography>
                <ValeModule />
            </Container>
        </Page>
    );
}
