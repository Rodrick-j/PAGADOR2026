import React from 'react';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton, Badge } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
//
import AccountPopover from './AccountPopover';

import { useSession } from 'hooks/session';

import { getVersionInfoFromStorage } from 'services/version/versionService';

import { ENUM_IS_SUPERADMINISTRADOR } from 'constants/enums';
import { APP_BAR_DESKTOP } from './DashboardLayout';

const DRAWER_WIDTH   = 280;
const APPBAR_MOBILE  = 64;

const RootStyle = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'minimized',
})<{ minimized: boolean }>(({ theme, minimized }) => ({
    boxShadow: 'none',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    backgroundColor: alpha(theme.palette.background.default, 0.72),
    [theme.breakpoints.up('lg')]: {
        width: `calc(100% - ${minimized ? 56 : DRAWER_WIDTH}px)`,
        transition: 'width 0.3s',
    },
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
    minHeight: APPBAR_MOBILE,
    backgroundColor: alpha(theme.palette.primary.dark, 0.28),
    [theme.breakpoints.up('lg')]: {
        minHeight: APP_BAR_DESKTOP,
        padding: theme.spacing(0, 2)
    }
}));

const CiudadaniaImage = styled('img')(({ theme }) => ({
    height: APPBAR_MOBILE - 20,
    [theme.breakpoints.up('lg')]: {
        height: APP_BAR_DESKTOP - 30
    },
    marginLeft: theme.spacing(1)
}));

// ----------------------------------------------------------------------

type Props = {
  onOpenSidebar: () => void;
  minimized: boolean;
  toggleSidebar: () => void;
};

export default function DashboardNavbar({ onOpenSidebar, minimized, toggleSidebar }: Props) {
    const authUser = useSession();
    const authToken = localStorage.getItem('CD');
    const es_super_administrador = authUser.roles === ENUM_IS_SUPERADMINISTRADOR;
    const versionAlert = getVersionInfoFromStorage();
    const hasVersionAlert = (): boolean => {
        return !versionAlert.isLatestVersion;
    };
    return (
        <RootStyle minimized={minimized}>
            <ToolbarStyle
                sx={[es_super_administrador && {
                    backgroundColor: 'warning.main',
                }]}
            >
                <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary', display: { lg: 'none' } }}>
                    <Badge color="info" variant="dot" invisible={!hasVersionAlert()}>
                        <Iconify icon="eva:menu-2-fill" />
                    </Badge>
                </IconButton>

                <IconButton
                    onClick={toggleSidebar}
                    sx={{ mr: 1, color: 'text.primary', display: { xs: 'none', lg: 'inline-flex' } }}
                >
                    <Iconify icon="eva:menu-outline" />
                </IconButton>
                {
                    Boolean(authToken) && <CiudadaniaImage src="/static/images/logociudadania.png" alt="Ciudadania" />
                }
                <Box sx={{ flexGrow: 1 }} />
                <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
                    <AccountPopover />
                </Stack>
            </ToolbarStyle>
        </RootStyle>
    );
}
