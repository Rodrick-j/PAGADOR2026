import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
// components
import Page from 'components/Page';
import { useNavigate } from 'react-router-dom';
import { ActividadDetalleModule } from 'modules/contra/actividad';

// ----------------------------------------------------------------------

export default function ActividadDetalle() {
    const navigate = useNavigate();
    return (
        <Page title="Actividad Detalle">
            <Container maxWidth="xl">
                    <Typography variant="h4">
                        <Tooltip title="Atras">
                            <IconButton
                                onClick={() => navigate(-1)}
                            >
                                <KeyboardBackspaceIcon />
                            </IconButton>
                        </Tooltip>
                            {' '}Actividad Detalle
                    </Typography>
                <ActividadDetalleModule />
            </Container>
        </Page>
    );
}
