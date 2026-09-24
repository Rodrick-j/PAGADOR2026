import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNotify } from 'services/notify';
import * as routes from 'constants/routes';
import { Box, CircularProgress, Container, Paper, Typography } from '@mui/material';
import { CallBackModuleService } from './CallBackModuleService';
import { doSignInCD } from 'services/auth';
import { TOKEN_KEY } from 'config/app-config';

export default function CallBackModule() {
    const navigate = useNavigate();
    const notify = useNotify();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const code = searchParams.get('code');
        if (!code) {
            notify.error('No se encontró el código de autorización.');
            navigate(routes.LOGIN);
            return;
        }
        const stateFromUrl = searchParams.get('state');
        const storedState = sessionStorage.getItem('state');

        if (stateFromUrl !== storedState) {
            //notify.error('Estado inválido. Posible ataque CSRF.');
            //navigate(routes.LOGIN);
            return;
        }

        sessionStorage.removeItem('state');

        const exchangeCodeForToken = async () => {
            try {
                const response = await CallBackModuleService.getCallBack(code);
                if (!response.success) return notify.error(response.msg);
                const { token } = response.data as any;

                localStorage.setItem(TOKEN_KEY, token);

                const signInResponse = await doSignInCD(token);
                if (!signInResponse.success) return notify.error(signInResponse.msg);
                localStorage.setItem('CD', "true");
                notify.success('¡Autenticación exitosa!');

                navigate(routes.LANDING);
            } catch (error) {
                notify.error('Error en la autenticación.');
                navigate(routes.LOGIN);
            }
        };

        exchangeCodeForToken();
    }, [searchParams, navigate]);

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ mt: 8, p: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Procesando autenticación...
                </Typography>
            </Paper>
        </Container>
    );
}
