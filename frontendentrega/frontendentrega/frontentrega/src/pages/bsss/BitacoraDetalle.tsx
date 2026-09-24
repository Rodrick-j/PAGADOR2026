import React from 'react';
import { useNavigate } from 'react-router-dom';

// @mui
import { Container, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
// components
import Page from '../../components/Page';
import { BitacoraDetalleModule } from 'modules/bsss/bitacora_detalle';

// ----------------------------------------------------------------------

export default function BitacoraDetalle() {
    const navigate = useNavigate();
    return (
        <Page title="Bitacora de Viaje">
            <Container maxWidth="xl">
                <Typography variant="h4">
                    <Tooltip title="Atras">
                        <IconButton
                            onClick={() => navigate(-1)}
                        >
                            <KeyboardBackspaceIcon />
                        </IconButton>
                    </Tooltip>
                        {' '}Bitacora Detalle
                </Typography>
                <BitacoraDetalleModule />
            </Container>
        </Page>
    );
}
