import React, { useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import * as routes from 'constants/routes';
import packageJson from '../../../../../package.json';
import { alpha, styled } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../../../components/Iconify';
import { auth } from 'services/auth';
import { useNotify } from 'services/notify';
import { generateRandomString } from 'utils';
import { AUTH_URL } from 'config/app-config';

const CardStyle = styled('div')(({ theme }) => ({
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: 460,
    minWidth: 0,
    boxSizing: 'border-box',
    padding: theme.spacing(4.5),
    overflow: 'hidden',
    borderRadius: 24,
    background: alpha('#ffffff', 0.96),
    border: `1px solid ${alpha('#2f5766', 0.12)}`,
    boxShadow: '0 28px 80px -28px rgba(15, 48, 61, 0.5), 0 10px 30px -18px rgba(15, 48, 61, 0.25)',
    backdropFilter: 'blur(18px)',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 5,
        background: 'linear-gradient(90deg, #d7a828 0 25%, #164b65 25% 75%, #9d2338 75% 100%)'
    },
    '@media (min-width: 900px) and (max-height: 850px)': {
        padding: theme.spacing(2.75, 4),
        borderRadius: 20,
        '& .login-crest': { width: 62, height: 71 },
        '& .login-crest img': { width: 62 },
        '& .login-header-divider': { marginTop: 16, marginBottom: 16 },
        '& .login-intro': { marginBottom: 12 },
        '& .login-fields': { gap: 12 },
        '& .login-options': { marginTop: 6, marginBottom: 6 },
        '& .login-security': { marginTop: 12, paddingTop: 6, paddingBottom: 6 },
        '& .login-method-divider': { marginTop: 14, marginBottom: 14 },
        '& .login-footer': { marginTop: 16 }
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(3, 2.5),
        borderRadius: 18
    }
}));

const CrestViewport = styled('div')({
    flex: '0 0 auto',
    width: 75,
    height: 86,
    overflow: 'hidden',
    filter: 'drop-shadow(0 8px 14px rgba(13, 43, 55, 0.18))'
});

const Crest = styled('img')({
    width: 75,
    height: 'auto',
    display: 'block'
});

const fieldSx = {
    '& .MuiOutlinedInput-root': {
        minHeight: 58,
        borderRadius: 1.5,
        backgroundColor: '#f5f8f9',
        transition: 'background-color 160ms ease, box-shadow 160ms ease',
        '& fieldset': { borderColor: '#d4dee2' },
        '&:hover fieldset': { borderColor: '#8fa4ad' },
        '&.Mui-focused': {
            backgroundColor: '#fff',
            boxShadow: `0 0 0 4px ${alpha('#3f6b7a', 0.1)}`
        },
        '&.Mui-focused fieldset': { borderColor: '#3f6b7a', borderWidth: 1.5 }
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#315a69' },
    '& .MuiFormHelperText-root': { marginLeft: 0.5 }
};

export default function LoginForm() {
    const navigate = useNavigate();
    const notify = useNotify();
    const [showPassword, setShowPassword] = useState(false);

    const LoginSchema = Yup.object().shape({
        email: Yup.string()
            .email('Ingrese una dirección de correo válida')
            .required('El correo electrónico es obligatorio'),
        password: Yup.string().required('La contraseña es obligatoria')
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
                navigate(routes.LANDING);
            });
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, setSubmitting, getFieldProps } = formik;

    const handleLogInCD = () => {
        const state = generateRandomString(30);
        const nonce = generateRandomString(30);

        sessionStorage.setItem('state', state);
        sessionStorage.setItem('nonce', nonce);
        window.location.href = `${AUTH_URL}&state=${state}&nonce=${nonce}`;
    };

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>
                <CardStyle>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={{ xs: 1.25, sm: 2.25 }}
                        alignItems="center"
                        textAlign={{ xs: 'center', sm: 'left' }}
                    >
                        <CrestViewport className="login-crest">
                            <Crest src="/static/images/gador-escudo-2026.png" alt="Escudo del Departamento de Oruro" />
                        </CrestViewport>

                        <Box sx={{ minWidth: 0 }}>
                            <Stack direction="row" spacing={0.8} alignItems="center" justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#65a687' }} />
                                <Typography
                                    variant="overline"
                                    sx={{ color: '#607d88', fontWeight: 800, letterSpacing: 1.35, lineHeight: 1.4 }}
                                >
                                    ACCESO INSTITUCIONAL
                                </Typography>
                            </Stack>

                            <Typography
                                component="h2"
                                variant="h3"
                                sx={{ mt: 0.65, color: '#142d37', fontWeight: 800, letterSpacing: '-0.03em' }}
                            >
                                Iniciar sesión
                            </Typography>

                            <Typography variant="body2" sx={{ mt: 0.6, color: '#718087', lineHeight: 1.5 }}>
                                Plataforma P.A.GADOR
                            </Typography>
                        </Box>
                    </Stack>

                    <Divider className="login-header-divider" sx={{ my: 3.25 }} />

                    <Typography className="login-intro" variant="body2" sx={{ mb: 2.5, color: '#5e6d74', lineHeight: 1.6 }}>
                        Ingrese sus credenciales asignadas para acceder al panel administrativo.
                    </Typography>

                    <Stack className="login-fields" spacing={2.5}>
                        <TextField
                            fullWidth
                            autoComplete="username"
                            type="email"
                            label="Correo institucional"
                            placeholder="usuario@correo.com"
                            {...getFieldProps('email')}
                            error={Boolean(touched.email && errors.email)}
                            helperText={touched.email && errors.email}
                            sx={fieldSx}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Iconify icon="eva:email-outline" sx={{ width: 21, height: 21, color: '#78909a' }} />
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField
                            fullWidth
                            autoComplete="current-password"
                            type={showPassword ? 'text' : 'password'}
                            label="Contraseña"
                            {...getFieldProps('password')}
                            error={Boolean(touched.password && errors.password)}
                            helperText={touched.password && errors.password}
                            sx={fieldSx}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Iconify icon="eva:lock-outline" sx={{ width: 21, height: 21, color: '#78909a' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            type="button"
                                            onClick={() => setShowPassword((visible) => !visible)}
                                            edge="end"
                                            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                        >
                                            <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Stack>

                    <Stack className="login-options" direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 1.5 }}>
                        <FormControlLabel
                            sx={{ ml: -0.75 }}
                            control={<Checkbox size="small" {...getFieldProps('remember')} checked={values.remember} />}
                            label={<Typography variant="body2" sx={{ color: '#45565d' }}>Mantener mi sesión</Typography>}
                        />
                        <Typography variant="caption" sx={{ color: '#819198' }}>
                            Personal autorizado
                        </Typography>
                    </Stack>

                    <LoadingButton
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                        endIcon={<Iconify icon="eva:arrow-forward-outline" width={19} height={19} />}
                        sx={{
                            py: 1.35,
                            borderRadius: 1.5,
                            textTransform: 'none',
                            fontSize: 16,
                            fontWeight: 800,
                            letterSpacing: 0.2,
                            color: '#fff',
                            background: 'linear-gradient(135deg, #173f50 0%, #4e7583 100%)',
                            boxShadow: '0 14px 30px -13px rgba(29, 70, 85, 0.78)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #0f3443 0%, #3e6574 100%)',
                                boxShadow: '0 16px 34px -13px rgba(29, 70, 85, 0.9)'
                            }
                        }}
                    >
                        Acceder al sistema
                    </LoadingButton>

                    <Box
                        className="login-security"
                        sx={{
                            mt: 2,
                            px: 1.75,
                            py: 1.25,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.15,
                            borderRadius: 1.5,
                            color: '#58707a',
                            bgcolor: '#f1f6f7',
                            border: '1px solid #e2eaed'
                        }}
                    >
                        <Box
                            sx={{
                                width: 30,
                                height: 30,
                                flex: '0 0 auto',
                                display: 'grid',
                                placeItems: 'center',
                                borderRadius: '50%',
                                color: '#376778',
                                bgcolor: '#e1ecef'
                            }}
                        >
                            <Iconify icon="eva:shield-outline" width={17} height={17} />
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: 12, fontWeight: 700, lineHeight: 1.35 }}>
                                Conexión protegida
                            </Typography>
                            <Typography sx={{ fontSize: 10.5, color: '#819198', lineHeight: 1.4 }}>
                                Sus credenciales se validan de forma segura.
                            </Typography>
                        </Box>
                    </Box>

                    <Divider className="login-method-divider" sx={{ my: 2.75, color: '#9aa7ad', fontSize: 11.5 }}>
                        OTRO MÉTODO DE ACCESO
                    </Divider>

                    <Button
                        fullWidth
                        type="button"
                        onClick={handleLogInCD}
                        variant="outlined"
                        sx={{
                            py: 1.1,
                            borderRadius: 1.5,
                            borderColor: '#d1dce0',
                            color: '#263941',
                            bgcolor: '#fff',
                            textTransform: 'none',
                            fontWeight: 700,
                            '&:hover': { borderColor: '#829ca7', bgcolor: '#f6f9fa' }
                        }}
                        startIcon={<img src="/static/images/ciudadania.png" alt="" style={{ height: 23, width: 'auto' }} />}
                    >
                        Ingresar con Ciudadanía Digital
                    </Button>

                    <Stack className="login-footer" direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 3.5 }}>
                        <Typography variant="caption" sx={{ color: '#9aa7ad' }}>
                            © ATI · GADOR
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#9aa7ad' }}>
                            Versión {packageJson.version}-rc
                        </Typography>
                    </Stack>
                </CardStyle>
            </Form>
        </FormikProvider>
    );
}
