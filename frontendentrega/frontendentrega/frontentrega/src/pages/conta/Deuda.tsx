import React from 'react';

// @mui
import { Container, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
// components
import Page from '../../components/Page';
import { DeudaModule } from 'modules/conta/deuda';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function Deuda() {
    const navigate = useNavigate();
    return (
        <Page title="Deuda Detalle">
            <Container maxWidth="xl">
                    <Typography variant="h4">                         
                        <Tooltip title="Atras">
                            <IconButton 
                                onClick={() => navigate(-1)}
                            >
                                <KeyboardBackspaceIcon />
                            </IconButton>
                        </Tooltip>
                            {' '}Deuda Detalle
                    </Typography>
                <DeudaModule />
            </Container>
        </Page>
    );
}
