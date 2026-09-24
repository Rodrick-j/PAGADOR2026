import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, Typography } from '@mui/material';
import Page from 'components/Page';
import Iconify from 'components/Iconify';
import { LoginForm } from 'modules/system/auth/login';

const RootStyle = styled('div')(({ theme }) => ({
    minHeight: '100vh',
    minHeight: '100dvh',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    position: 'relative',
    overflowX: 'hidden',
    overflowY: 'auto',
    backgroundColor: '#071820',
    backgroundImage: [
        `radial-gradient(circle at 17% 17%, ${alpha('#6998a8', 0.2)} 0%, transparent 30%)`,
        `linear-gradient(102deg, ${alpha('#06161d', 0.8)} 0%, ${alpha('#09212a', 0.86)} 60%, ${alpha('#06151b', 0.96)} 100%)`,
        'url("/static/images/fondo.jpg")'
    ].join(','),
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    [theme.breakpoints.down('md')]: {
        alignItems: 'center',
        justifyContent: 'center',
        overflowY: 'auto',
        padding: theme.spacing(3, 2)
    }
}));

const BrandPane = styled('section')(({ theme }) => ({
    position: 'relative',
    flex: '1 1 auto',
    minWidth: 0,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(11, 8),
    color: '#fff',
    '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        opacity: 0.23,
        backgroundImage: [
            `linear-gradient(${alpha('#ffffff', 0.12)} 1px, transparent 1px)`,
            `linear-gradient(90deg, ${alpha('#ffffff', 0.12)} 1px, transparent 1px)`
        ].join(','),
        backgroundSize: '64px 64px',
        maskImage: 'linear-gradient(90deg, black, transparent 72%)',
        pointerEvents: 'none'
    },
    [theme.breakpoints.down('lg')]: {
        padding: theme.spacing(10, 6)
    },
    [theme.breakpoints.down('md')]: {
        display: 'none'
    }
}));

const BrandHeader = styled('div')(({ theme }) => ({
    position: 'absolute',
    zIndex: 2,
    top: theme.spacing(5.5),
    left: theme.spacing(8),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.75),
    [theme.breakpoints.down('lg')]: {
        left: theme.spacing(6)
    }
}));

const BrandContent = styled('div')({
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: 760
});

const SectionLabel = styled('div')(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(1.25),
    color: alpha('#ffffff', 0.76),
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 2.1,
    '&::before': {
        content: '""',
        width: 34,
        height: 3,
        borderRadius: 99,
        background: 'linear-gradient(90deg, #d8aa2c, #f0d37a)'
    }
}));

const FeatureCard = styled('div')(({ theme }) => ({
    minWidth: 0,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.4),
    padding: theme.spacing(1.7),
    borderRadius: 14,
    color: alpha('#ffffff', 0.84),
    background: `linear-gradient(145deg, ${alpha('#ffffff', 0.115)}, ${alpha('#ffffff', 0.045)})`,
    border: `1px solid ${alpha('#ffffff', 0.15)}`,
    boxShadow: `inset 0 1px 0 ${alpha('#ffffff', 0.08)}`,
    backdropFilter: 'blur(10px)'
}));

const FormPane = styled('main')(({ theme }) => ({
    position: 'relative',
    zIndex: 3,
    flex: '0 0 clamp(560px, 38vw, 660px)',
    minWidth: 0,
    minHeight: '100vh',
    minHeight: '100dvh',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(6),
    overflowX: 'hidden',
    overflowY: 'auto',
    background: 'linear-gradient(145deg, #edf3f5 0%, #f8fafb 47%, #e8eff2 100%)',
    boxShadow: '-30px 0 80px rgba(0, 0, 0, 0.26)',
    '&::before': {
        content: '""',
        position: 'absolute',
        width: 420,
        height: 420,
        top: -260,
        right: -170,
        borderRadius: '50%',
        border: `1px solid ${alpha('#365d6c', 0.1)}`,
        boxShadow: `0 0 0 55px ${alpha('#365d6c', 0.025)}, 0 0 0 110px ${alpha('#365d6c', 0.018)}`
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        width: 250,
        height: 250,
        left: -155,
        bottom: -120,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${alpha('#c89f2f', 0.11)}, transparent 68%)`
    },
    [theme.breakpoints.down('lg')]: {
        flexBasis: 520,
        padding: theme.spacing(4)
    },
    [theme.breakpoints.down('md')]: {
        flex: '1 1 auto',
        width: '100%',
        maxWidth: 500,
        minHeight: 'auto',
        padding: theme.spacing(2),
        borderRadius: 28,
        boxShadow: '0 30px 90px rgba(0, 0, 0, 0.42)'
    },
    [theme.breakpoints.down('sm')]: {
        borderRadius: 22,
        padding: theme.spacing(1.25)
    }
}));

const modules = [
    { icon: 'eva:briefcase-outline', title: 'Administración', caption: 'Gestión operativa' },
    { icon: 'eva:people-outline', title: 'Talento humano', caption: 'Procesos de RR.HH.' },
    { icon: 'eva:pie-chart-outline', title: 'Control financiero', caption: 'Seguimiento integral' }
];

export default function LoginPage() {
    return (
        <Page title="Iniciar sesión">
            <RootStyle>
                <BrandPane aria-label="Presentación institucional">
                    <BrandHeader>
                        <Box sx={{ width: 4, height: 38, borderRadius: 99, bgcolor: '#d8aa2c' }} />
                        <Box>
                            <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.65, lineHeight: 1.3 }}>
                                GOBIERNO AUTÓNOMO DEPARTAMENTAL
                            </Typography>
                            <Typography sx={{ fontSize: 11, color: alpha('#ffffff', 0.58), letterSpacing: 2.8 }}>
                                ORURO · BOLIVIA
                            </Typography>
                        </Box>
                    </BrandHeader>

                    <BrandContent>
                        <SectionLabel>PORTAL ADMINISTRATIVO</SectionLabel>

                        <Typography
                            component="h1"
                            sx={{
                                mt: 3.5,
                                fontSize: { lg: 64, md: 52 },
                                fontWeight: 800,
                                lineHeight: 1.03,
                                letterSpacing: '-0.042em',
                                textShadow: '0 4px 30px rgba(0,0,0,0.35)'
                            }}
                        >
                            Plataforma de
                            <br />
                            Atención
                        </Typography>

                        <Typography
                            sx={{
                                mt: 2,
                                color: '#e3bf58',
                                fontSize: 18,
                                fontWeight: 800,
                                letterSpacing: 5.8
                            }}
                        >
                            P.A.GADOR
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                mt: 3,
                                maxWidth: 610,
                                color: alpha('#ffffff', 0.72),
                                fontWeight: 400,
                                lineHeight: 1.65
                            }}
                        >
                            Un espacio integrado para administrar procesos institucionales con seguridad, trazabilidad y eficiencia.
                        </Typography>

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                                gap: 1.5,
                                mt: 5.5,
                                maxWidth: 740
                            }}
                        >
                            {modules.map((item) => (
                                <FeatureCard key={item.title}>
                                    <Box
                                        sx={{
                                            flex: '0 0 auto',
                                            width: 38,
                                            height: 38,
                                            display: 'grid',
                                            placeItems: 'center',
                                            borderRadius: 1.25,
                                            bgcolor: alpha('#d8aa2c', 0.16),
                                            color: '#f0ce6d'
                                        }}
                                    >
                                        <Iconify icon={item.icon} width={21} height={21} />
                                    </Box>
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography sx={{ fontSize: 13, fontWeight: 700, lineHeight: 1.35 }}>
                                            {item.title}
                                        </Typography>
                                        <Typography sx={{ fontSize: 10.5, color: alpha('#ffffff', 0.48), lineHeight: 1.4 }}>
                                            {item.caption}
                                        </Typography>
                                    </Box>
                                </FeatureCard>
                            ))}
                        </Box>
                    </BrandContent>

                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.2}
                        sx={{ position: 'absolute', left: { lg: 64, md: 48 }, bottom: 42, zIndex: 2 }}
                    >
                        <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#70b898', boxShadow: '0 0 0 5px rgba(112,184,152,.12)' }} />
                        <Typography variant="caption" sx={{ color: alpha('#ffffff', 0.55), letterSpacing: 0.45 }}>
                            Sistema institucional · Acceso restringido
                        </Typography>
                    </Stack>

                    <Typography
                        aria-hidden="true"
                        sx={{
                            position: 'absolute',
                            right: -18,
                            bottom: -36,
                            color: alpha('#ffffff', 0.028),
                            fontSize: 150,
                            fontWeight: 900,
                            lineHeight: 1,
                            letterSpacing: '-0.06em',
                            userSelect: 'none'
                        }}
                    >
                        ORURO
                    </Typography>
                </BrandPane>

                <FormPane>
                    <LoginForm />
                </FormPane>
            </RootStyle>
        </Page>
    );
}
