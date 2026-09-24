// @mui
import { Container, Typography } from '@mui/material';
import Page from '../../components/Page';
// components
import { RutasModule } from 'modules/system/rutas';

// ----------------------------------------------------------------------

export default function Rutas() {
    return (
        <Page title="Rutas">
            <Container maxWidth="xl">
                <Typography variant="h4">Modulo de rutas</Typography>
                <RutasModule />
            </Container>
        </Page>
    );
}
