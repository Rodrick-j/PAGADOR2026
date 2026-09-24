import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
// components
import Page from '../../components/Page';
//import { ProcesoDetalleModule } from 'modules/contra/procesodetalle';
import { useNavigate } from 'react-router-dom';
import { MemorandumDetalleModule } from 'modules/viatico/memorandumdetalle';

// ----------------------------------------------------------------------

export default function MemorandumDetalle() {
    const navigate = useNavigate();
    return (
        <Page title="Memorandum Detalle Viaticos">
            <Container maxWidth="xl">
                    <Typography variant="h4">
                        <Tooltip title="Atras">
                            <IconButton
                                onClick={() => navigate(-1)}
                            >
                                <KeyboardBackspaceIcon />
                            </IconButton>
                        </Tooltip>
                            {' '}Memorandum Detalle Viaticos
                    </Typography>
                <MemorandumDetalleModule />
            </Container>
        </Page>
    );
}
