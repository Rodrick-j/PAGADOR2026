import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
// components
import Page from '../../components/Page';
import { ProcesoDetalleModule } from 'modules/contra/procesodetalle';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function ProcesoDetalle() {
    const navigate = useNavigate();
    return (
        <Page title="Proceso Detalle">
            <Container maxWidth="xl">
                    <Typography variant="h4">
                        <Tooltip title="Atras">
                            <IconButton
                                onClick={() => navigate(-1)}
                            >
                                <KeyboardBackspaceIcon />
                            </IconButton>
                        </Tooltip>
                            {' '}Proceso Detalle
                    </Typography>
                <ProcesoDetalleModule />
            </Container>
        </Page>
    );
}
