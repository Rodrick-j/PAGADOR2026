import React, { useState, useEffect, useCallback } from 'react';
import { useIsMounted } from 'hooks/useIsMounted';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { SettingModule } from '../../modules/system/setting';

// ----------------------------------------------------------------------

export default function Setting() {
    return (
        <Page title="Configuraciones">
            <Container maxWidth="xl">
                <Typography variant="h4">Configuraciones</Typography>
                <SettingModule />
            </Container>
        </Page>
    );
}
