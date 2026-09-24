// @mui
import { Container, Typography } from '@mui/material';
import Page from '../../components/Page';
// components
import { UsersModule } from 'modules/system/users';

// ----------------------------------------------------------------------

export default function Users() {
    return (
        <Page title="Usuarios">
            <Container maxWidth="xl">
                <Typography variant="h4">Modulo de Usuario</Typography>
                <UsersModule />
            </Container>
        </Page>
    );
}
