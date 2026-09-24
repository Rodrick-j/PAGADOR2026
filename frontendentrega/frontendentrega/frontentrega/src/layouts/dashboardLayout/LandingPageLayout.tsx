import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
//
import DashboardNavbarLanding from './DashboardNavbarLanding';
import { APP_BAR_DESKTOP } from './DashboardLayout';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;

const RootStyle = styled('div')({
    display: 'flex',
    minHeight: '100%',
    overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
    flexGrow: 1,
    overflow: 'auto',
    minHeight: '100%',
    paddingTop: APP_BAR_MOBILE + 24,
    paddingBottom: theme.spacing(4),
    [theme.breakpoints.up('lg')]: {
        paddingTop: APP_BAR_DESKTOP + 24,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)
    }
}));

// ----------------------------------------------------------------------

export default function LandingPageLayout() {
    return (
        <RootStyle>
            <DashboardNavbarLanding />
            <MainStyle>
                <Outlet />
            </MainStyle>
        </RootStyle>
    );
}
