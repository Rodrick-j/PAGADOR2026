/**
 * Proyecto: Plataforma PAGADOR
 * Autor técnico: Ing. Giancarlo Delgadillo Coca
 * Desarrollado para el Gobierno Autónomo Departamental de Oruro.
 *
 * Se reconoce la autoría técnica al Ing. Giancarlo Delgadillo Coca en la implementación de este
 * código fuente, sin perjuicio de la titularidad institucional aplicable.
 */
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { auth, isAuthenticated } from 'services/auth';
import { SessionProvider } from 'hooks/session';
import * as routes from 'constants/routes';

const PrivateRoute = ({ children }: any) => {
    const navigate = useNavigate();

    if (!isAuthenticated()) {
        auth.doSignOut().then(() => navigate(routes.LOGIN));
        return <Navigate to={routes.LOGIN} replace />;
    }

    return isAuthenticated() ? <SessionProvider>{children}</SessionProvider> : <Navigate to={routes.LOGIN} replace />;
};

export default PrivateRoute;
