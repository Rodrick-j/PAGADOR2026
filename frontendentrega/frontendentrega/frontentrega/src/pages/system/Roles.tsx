// @mui
import { Container, Typography } from '@mui/material';
import Page from '../../components/Page';
// components
import { RolesModule } from 'modules/system/roles';

// ----------------------------------------------------------------------

export default function Roles() {
    return (
        <Page title="Roles">
            <Container maxWidth="xl">
                <Typography variant="h4">Modulo de roles</Typography>
                <RolesModule />
            </Container>
        </Page>
    );
}
