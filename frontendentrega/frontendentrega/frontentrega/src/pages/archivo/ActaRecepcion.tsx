import React from 'react';
import { useNavigate } from 'react-router-dom';

// @mui
import { Container, Typography } from '@mui/material';

// components
import Page from '../../components/Page';
import { ActaRecepcionModule } from 'modules/archivo/acta_recepcion';

// ----------------------------------------------------------------------

export default function ActaRecepcion() {
    return (
        <Page title="Acta Detalle">
            <Container maxWidth="xl">
                <Typography variant="h4">Acta Recepcion</Typography>
                <ActaRecepcionModule />
            </Container>
        </Page>
    );
}
