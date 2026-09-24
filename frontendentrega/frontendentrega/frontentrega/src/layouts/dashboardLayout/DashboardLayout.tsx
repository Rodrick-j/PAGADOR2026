/**
 * Proyecto: Plataforma PAGADOR
 * Autor técnico: Ing. Giancarlo Delgadillo Coca
 * Desarrollado para el Gobierno Autónomo Departamental de Oruro.
 *
 * Se reconoce la autoría técnica al Ing. Giancarlo Delgadillo Coca en la implementación de este
 * código fuente, sin perjuicio de la titularidad institucional aplicable.
 */
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
//
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
export const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')<{ minimized: boolean }>(({ theme, minimized }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(4),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: minimized ? theme.spacing(2) : theme.spacing(2),
    paddingRight: theme.spacing(2),
    transition: 'padding-left 0.3s'
  }
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const [minimizedSidebar, setMinimizedSidebar] = useState(false);

  return (
    <RootStyle>
      <DashboardNavbar
        onOpenSidebar={() => setOpen(true)}
        minimized={minimizedSidebar}
        toggleSidebar={() => setMinimizedSidebar(prev => !prev)}
      />
      <DashboardSidebar
        isOpenSidebar={open}
        onCloseSidebar={() => setOpen(false)}
        minimized={minimizedSidebar}
      />
      <MainStyle minimized={minimizedSidebar}>
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}
