import { styled } from '@mui/material/styles';
import { Box, Button, Card, Container, Typography } from '@mui/material';
import Page from 'components/Page';
import { LoginForm } from 'modules/system/auth/login';
import { generateRandomString } from 'utils';
import { AUTH_URL } from 'config/app-config';

const RootStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#fff',
    backgroundImage: 'url("/static/images/fondo.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column'
    }
}));

const LeftSection = styled('div')(({ theme }) => ({
    flex: 1,
    color: '#263238',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(4),
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
        display: 'none'
    }
}));

const RightSection = styled(Container)(({ theme }) => ({
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4)
}));

const CardStyle = styled(Card)(({ theme }) => ({
    width: '100%',
    maxWidth: 400,
    padding: theme.spacing(4),
    boxShadow: theme.shadows[24],
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4)
    }
}));
export default function LoginPage() {
    const handleLogInCD = () => {

        const state = generateRandomString(30);
        const nonce = generateRandomString(30);

        sessionStorage.setItem('state', state);
        sessionStorage.setItem('nonce', nonce);

        const authURL = AUTH_URL + '&state=' + state + '&nonce=' + nonce;

        window.location.href = authURL;
    };
    return (
        <Page title="Iniciar sesión">
            <RootStyle>
                <LeftSection>
                    <Typography
                        variant="h2"
                        gutterBottom
                        sx={{
                            textShadow: '1px 1px 3px #00000099'
                        }}
                    >
                        .:: Plataforma de Atención ::.
                    </Typography>
                    <Typography
                        variant="h4"
                        sx={{
                            textShadow: '1px 1px 3px #00000099'
                        }}
                    >
                        P.A.GADOR
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 2, // espacio entre imágenes
                            mt: 2 // margen superior
                        }}
                    >
                        <img src="/static/images/bicentenario.jpg" alt="logo1" width={90} height="auto" />
                        <Button
                            variant="text"
                            sx={{ p: 0, minWidth: 'auto' }}
                            onClick={handleLogInCD}
                        >
                            <img
                                src="/static/images/ciudadania.png"
                                alt="Ciudadanía Digital"
                                width={150}
                                height="auto"
                                style={{ display: 'block' }}
                            />
                        </Button>
                    </Box>
                </LeftSection>

                <RightSection maxWidth="sm">
                    <CardStyle>
                        <LoginForm />
                    </CardStyle>
                </RightSection>
            </RootStyle>
        </Page>
    );
}
