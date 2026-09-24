import React from 'react';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, Badge } from '@mui/material';
// components
import AccountPopover from './AccountPopover';

import { useSession } from 'hooks/session';
import { getVersionInfoFromStorage } from 'services/version/versionService';
import { ENUM_IS_SUPERADMINISTRADOR } from 'constants/enums';
import useResponsive from 'hooks/useResponsive';
import { APP_BAR_DESKTOP } from './DashboardLayout';

const APPBAR_MOBILE = 64;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  backgroundColor: alpha(theme.palette.background.default, 0.72),
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  backgroundColor: alpha(theme.palette.primary.dark, 0.28),
  [theme.breakpoints.up('lg')]: {
    minHeight: APP_BAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

export default function DashboardNavbarLanding() {
  const authUser = useSession();
  const es_super_administrador = authUser.roles === ENUM_IS_SUPERADMINISTRADOR;
  const versionAlert = getVersionInfoFromStorage();
  const isMobile = useResponsive('down', 'md');
  const hasVersionAlert = (): boolean => {
        return !versionAlert.isLatestVersion;
    };
  return (
    <RootStyle>
      <ToolbarStyle
        sx={[
          es_super_administrador && {
            backgroundColor: 'warning.main',
          },
        ]}
      >
        <Box
            component="img"
            src="/static/images/poder.png"
            alt="Logo"
            sx={{ height: isMobile? 35: 60, mr: 2 }}
        />
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <AccountPopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
