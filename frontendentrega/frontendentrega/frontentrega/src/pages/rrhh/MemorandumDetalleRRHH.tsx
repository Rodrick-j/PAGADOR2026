import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
// components
import Page from '../../components/Page';
import { useNavigate } from 'react-router-dom';
import { MemorandumDetallerrhhModule } from 'modules/rrhh/memorandum_detalle_rrhh';

// ----------------------------------------------------------------------

export default function MemorandumDetalleRRHH() {
    const navigate = useNavigate();
    return (
        <Page title="Memorandum Detalle RR.HH.">
            <Container maxWidth="xl">
                    <Typography variant="h4">
                        <Tooltip title="Atras">
                            <IconButton
                                onClick={() => navigate(-1)}
                            >
                                <KeyboardBackspaceIcon />
                            </IconButton>
                        </Tooltip>
                            {' '}Memorandum Detalle RR.HH.
                    </Typography>
                <MemorandumDetallerrhhModule />
            </Container>
        </Page>
    );
}
