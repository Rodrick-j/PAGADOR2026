import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from 'react-router-dom';

// components
import Page from '../../components/Page';
import { HistorialAperturaDetalleModule } from 'modules/apertura/historial_apertura_detalle';

// ----------------------------------------------------------------------

export default function HistorialAperturaDetalle() {
    const navigate = useNavigate();
    return (
        <Page title="Historial Apertura Detalle">
        <Container maxWidth="xl">
                <Typography variant="h4">
                    <Tooltip title="Atras">
                        <IconButton
                            onClick={() => navigate(-1)}
                        >
                            <KeyboardBackspaceIcon />
                        </IconButton>
                    </Tooltip>
                        {' '}Historial Apertura Detalle
                </Typography>
            <HistorialAperturaDetalleModule/>
        </Container>
    </Page>
    );
}
