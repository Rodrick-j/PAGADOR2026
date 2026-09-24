import React, { FormEvent, useState } from 'react';
import * as Yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import * as routes from 'constants/routes';
import packageJson from '../../../../../package.json';
// material
import { Link, Stack, Checkbox, TextField, IconButton, InputAdornment, FormControlLabel, Typography, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../../components/Iconify';
import { auth } from 'services/auth';
import { useNotify } from 'services/notify';
import useResponsive from 'hooks/useResponsive';
import { generateRandomString } from 'utils';
import { AUTH_URL } from 'config/app-config';

// ----------------------------------------------------------------------

export default function LoginForm() {
    const navigate = useNavigate();
    const notify = useNotify();
    const isMobile = useResponsive('down', 'md');

    const [showPassword, setShowPassword] = useState(false);

    const LoginSchema = Yup.object().shape({
        email: Yup.string().email('El correo electrónico debe ser una dirección válida').required('Correo electronico es requerido'),
        password: Yup.string().required('Se requiere contraseña')
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            remember: true
        },
        validationSchema: LoginSchema,
        onSubmit: (values) => {
            auth.doSignIn(values.email.trim(), values.password.trim()).then((result) => {
                if (!result.success) {
                    setSubmitting(false);
                    return notify.error(result.msg);
                }
                // Redirect to HomePage
                navigate(routes.LANDING);
                //navigate(routes.DASHBOARD);
            });
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, setSubmitting, getFieldProps } = formik;

    const handleShowPassword = () => {
        setShowPassword((show) => !show);
    };

    const handleLogInCD = () => {
        const state = generateRandomString(30);
        const nonce = generateRandomString(30);

        sessionStorage.setItem('state', state);
        sessionStorage.setItem('nonce', nonce);

        const authURL = AUTH_URL + '&state=' + state + '&nonce=' + nonce;

        window.location.href = authURL;
    };

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Stack spacing={3}>
                    <Stack spacing={1} alignItems="center" textAlign={'center'}>
                        <img src="/static/images/logo3.png" alt="logo" style={{ width: isMobile ? 120:180, height: 'auto', maxWidth: '100%' }} />
                        { isMobile && <Typography variant="h5" gutterBottom>.:: Plataforma de Atención ::. - P.A.GADOR</Typography>  }
                    </Stack>

                    {/* Campo Correo */}
                    <TextField
                        fullWidth
                        autoComplete="username"
                        type="email"
                        label="Correo"
                        {...getFieldProps('email')}
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email}
                        variant="filled"
                        sx={{ backgroundColor: 'white' }}
                    />

                    {/* Campo Contraseña */}
                    <TextField
                        fullWidth
                        autoComplete="current-password"
                        type={showPassword ? 'text' : 'password'}
                        label="Contraseña"
                        {...getFieldProps('password')}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleShowPassword} edge="end">
                                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        error={Boolean(touched.password && errors.password)}
                        helperText={touched.password && errors.password}
                        variant="filled"
                        sx={{ backgroundColor: 'white' }}
                    />
                </Stack>

                {/* Recordarme */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
                    <FormControlLabel control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />} label="Recordarme" />
                </Stack>

                {/* Botón ingresar */}
                <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                    INGRESAR
                </LoadingButton>

                {/* Enlaces adicionales */}

                { isMobile &&
                    <Stack direction="row" justifyContent={'center'} sx={{ mt: 1 }}>
                        <Button
                            variant="text"
                            sx={{ p: 0, minWidth: 'auto' }}
                            onClick={handleLogInCD}
                        >
                            <img
                                src="/static/images/ciudadania.png"
                                alt="Ciudadanía Digital"
                                width={120}
                                height="auto"
                                style={{ display: 'block' }}
                            />
                        </Button>
                    </Stack>
                }
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
                    <Typography
                        variant="caption"
                        color="text.primary"
                    >
                        Derechos Reservados ATI
                    </Typography>
                    <Typography
                        variant="caption"
                        color="text.primary"
                    >
                        versión {packageJson.version}-rc
                    </Typography>
                </Stack>
            </Form>
        </FormikProvider>
    );
}
