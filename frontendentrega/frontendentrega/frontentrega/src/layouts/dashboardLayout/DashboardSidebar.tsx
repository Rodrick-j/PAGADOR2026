import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Divider } from '@mui/material';
import packageJson from '../../../package.json';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
import useLocalStorage from '../../hooks/localstorage/useLocalStorage';
//
import navConfig from './NavConfig';
import { getVersionInfoFromStorage } from '../../services/version/versionService';
import { useSession } from '../../hooks/session';
import { truncateTextLong } from '../../utils/formatText';
import { useNotify } from '../../services/notify';
import { CacheBuster } from 'CacheBuster';
import { ENUM_IS_SUPERADMINISTRADOR } from 'constants/enums';
// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const DRAWER_MINIMIZED_WIDTH = 56;
const APPBAR_DESKTOP = 92;

const RootStyle = styled('div', {
    shouldForwardProp: (prop) => prop !== 'minimized'
})<{ minimized: boolean }>(({ theme, minimized }) => ({
    [theme.breakpoints.up('lg')]: {
        flexShrink: 0,
        width: minimized ? DRAWER_MINIMIZED_WIDTH : DRAWER_WIDTH
    }
}));

const AccountStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 1)
}));

// ----------------------------------------------------------------------

type Props = {
    isOpenSidebar: boolean;
    onCloseSidebar: () => void;
    minimized: boolean;
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar, minimized }: Props) {
    const { pathname } = useLocation();
    const authUser = useSession();

    const notify = useNotify();
    const [updatingVersion, setUpdatingVersion] = useState<boolean>(false);
    const isDesktop = useResponsive('up', 'lg');
    const es_super_administrador = authUser.roles === ENUM_IS_SUPERADMINISTRADOR;

    const versionAlert = getVersionInfoFromStorage();

    //Menu
    const [dashboardGrid] = useLocalStorage<any>('dashboardMenu', []);
    const rutasAuth = dashboardGrid as Array<any>;
    const menuAuth = navConfig(rutasAuth);

    const hasVersionAlert = (): boolean => {
        return !versionAlert.isLatestVersion;
    };

    const handleUpdateVersionClick = async () => {
        if (updatingVersion) return;
        setUpdatingVersion(true);
        const updated = await CacheBuster.updateToLastVersion();
        if (!updated) {
            setTimeout(() => {
                setUpdatingVersion(false);
                notify.info('La última versión ya esta instalada.');
            }, 2000);
        }
    };

    useEffect(() => {
        if (isOpenSidebar) {
            onCloseSidebar();
        }
    }, [pathname]);

    const renderContent = (isDraw: boolean) => (
        <Scrollbar
            sx={{
                backgroundImage: `url("/static/images/fondo2.jpg")`,
                backgroundPosition: 'bottom center',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                height: 1,
                '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' }
            }}
        >
            <Box
                sx={[
                    {
                        px: minimized ? 0 : 1.5,
                        py: '25.4px',
                        display: 'flex',
                        justifyContent: 'center',
                        backgroundColor: 'primary.dark'
                    },
                    es_super_administrador && {
                        backgroundColor: 'warning.dark'
                    }
                ]}
            >
                <Logo
                    title={minimized ? '' : '.:: Plataforma Atención - PAGADOR ::.'}
                    isDraw={isDraw}
                    url="/landing"
                    colorText="common.white"
                    sx={{ width: minimized ? 40 : 92, height: minimized ? 40 : 92, transition: 'width 0.3s, height 0.3s' }}
                />
            </Box>
            {!minimized && (
                <Box
                    sx={{
                        backgroundImage: (theme: any) => `linear-gradient(135deg, ${alpha(theme.palette['primary'].dark, 0)} 0%, ${alpha(theme.palette['primary'].dark, 0.34)} 100%)`
                    }}
                >
                    <Link underline="none" component={RouterLink} to="#">
                        <AccountStyle>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 0.5
                                }}
                            >
                                <Typography variant="subtitle2" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                                    {authUser.nombre}
                                </Typography>

                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {truncateTextLong(authUser.username, 30)}
                                </Typography>

                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {authUser.roles}
                                </Typography>

                                <Divider sx={{ my: 0.5 }} />

                                <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
                                    {authUser.area}
                                </Typography>

                                <Typography variant="caption" sx={{ color: 'text.tertiary', fontStyle: 'italic' }}>
                                    {authUser.cargo}
                                </Typography>
                            </Box>
                        </AccountStyle>
                    </Link>
                </Box>
            )}
            <Divider />
            <NavSection navConfig={menuAuth} minimized={minimized} />
            <Box sx={{ flexGrow: 1, overflow: 'auto' }} />
            <Box
                sx={{
                    px: 2,
                    pb: 3,
                    mt: 4,
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: 240,
                        borderRadius: 3,
                        px: 2,
                        py: 2.5,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                    }}
                >
                    {!versionAlert.isLatestVersion && (
                        <>
                            <Box
                                component="img"
                                src="/static/images/version.png"
                                alt="Actualizar versión"
                                sx={{
                                    width: 78,
                                    height: 78,
                                    objectFit: 'contain',
                                    mb: 1.5,
                                    filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.18))'
                                }}
                            />

                            <Typography
                                variant="caption"
                                sx={{
                                    mb: 1.5,
                                    color: 'text.secondary',
                                    fontWeight: 500,
                                    lineHeight: 1.4
                                }}
                            >
                                Hay una nueva versión disponible
                            </Typography>

                            <Button
                                onClick={handleUpdateVersionClick}
                                variant="contained"
                                fullWidth
                                disabled={updatingVersion}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    py: 1,
                                    boxShadow: '0 8px 18px rgba(0,0,0,0.18)'
                                }}
                            >
                                {updatingVersion ? 'Actualizando...' : 'Actualizar versión'}
                            </Button>
                        </>
                    )}

                    {versionAlert.isLatestVersion && (
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'text.secondary',
                                fontWeight: 600,
                                textAlign: 'center'
                            }}
                        >
                            versión {packageJson.version}-rc
                        </Typography>
                    )}
                </Box>
            </Box>
        </Scrollbar>
    );

    return (
        <RootStyle minimized={minimized}>
            {!isDesktop && (
                <Drawer
                    open={isOpenSidebar}
                    onClose={onCloseSidebar}
                    PaperProps={{
                        sx: { width: DRAWER_WIDTH }
                    }}
                >
                    {renderContent(!isDesktop)}
                </Drawer>
            )}

            {isDesktop && (
                <Drawer
                    open={isDesktop ? true : isOpenSidebar}
                    onClose={onCloseSidebar}
                    variant={isDesktop ? 'persistent' : 'temporary'}
                    PaperProps={{
                        sx: {
                            width: minimized ? DRAWER_MINIMIZED_WIDTH : DRAWER_WIDTH,
                            transition: 'width 0.3s',
                            overflowX: 'hidden'
                        }
                    }}
                >
                    {renderContent(true)}
                </Drawer>
            )}
        </RootStyle>
    );
}
