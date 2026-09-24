import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
// components
import Page from '../../components/Page';
import { ActaModule } from 'modules/archivo/acta';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function Acta() {
    return (
        <Page title="Acta Detalle">
            <Container maxWidth="xl">
                <Typography variant="h4">Acta</Typography>
                <ActaModule />
            </Container>
        </Page>
    );
}
