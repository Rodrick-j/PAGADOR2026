import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { PersonalModule } from 'modules/rrhh/personal';

// ----------------------------------------------------------------------

export default function Personal() {
    return (
        <Page title="Personal">
            <Container maxWidth="xl">
                <Typography variant="h4">Personal</Typography>
                <PersonalModule />
            </Container>
        </Page>
    );
}
