import React from 'react';
import { useNavigate } from 'react-router-dom';

// @mui
import { Container, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
// components
import Page from '../../components/Page';
import { ActaRecepcionDetalleModule } from 'modules/archivo/acta_recepcion_detalle';

// ----------------------------------------------------------------------

export default function ActaRecepcionDetalle() {
    const navigate = useNavigate();
    return (
        <Page title="Acta Recepcion Detalle">
            <Container maxWidth="xl">
                <Typography variant="h4">
                    <Tooltip title="Atras">
                        <IconButton
                            onClick={() => navigate(-1)}
                        >
                            <KeyboardBackspaceIcon />
                        </IconButton>
                    </Tooltip>
                        {' '}Acta Recepcion Detalle
                </Typography>
                <ActaRecepcionDetalleModule />
            </Container>
        </Page>
    );
}
