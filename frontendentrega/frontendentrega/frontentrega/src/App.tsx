/**
 * Proyecto: Plataforma PAGADOR
 * Autor técnico: Ing. Giancarlo Delgadillo Coca
 * Desarrollado para el Gobierno Autónomo Departamental de Oruro.
 *
 * Se reconoce la autoría técnica al Ing. Giancarlo Delgadillo Coca en la implementación de este
 * código fuente, sin perjuicio de la titularidad institucional aplicable.
 */
import React, { ReactElement, useCallback, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// theme
import ThemeProvider from 'theme';
// layouts
import DashboardLayout from 'layouts/dashboardLayout/DashboardLayout';
import LandingPageLayout from 'layouts/dashboardLayout/LandingPageLayout';

//paquetes
import packageInfo from '../package.json';
import { CacheBuster } from 'CacheBuster';
import * as routes from 'constants/routes';
//servicios
import { NotistackProvider } from 'services/notify';
import PrivateRoute from 'services/PrivateRoute';
import { getSessionInfoFromLocalStorage, isAuthenticated } from 'services/auth/AuthService';
/* PAGES */
import Login from 'pages/system/Login';
import NotFound from 'pages/Page404';
import DashboardApp from 'pages/DashboardApp';
import Users from 'pages/system/Users';
import Personal from 'pages/rrhh/Personal';
//import Notificacion from 'pages/system/Notificacion';
import Cargo from 'pages/rrhh/Cargo';
import Vacacion from 'pages/rrhh/Vacacion';
import Area from 'pages/rrhh/Area';
import Roles from 'pages/system/Roles';
import Rutas from 'pages/system/Rutas';
import Setting from 'pages/system/Setting';
import Vale from 'pages/bsss/Vale';
import Vehiculo from 'pages/bsss/Vehiculo';
import Destino from 'pages/bsss/Destino';
import Apertura from 'pages/bsss/Apertura';
import Cuenta from 'pages/conta/Cuenta';
import Deuda from 'pages/conta/Deuda';
import Seguimiento from 'pages/conta/Seguimiento';
import General from 'pages/contra/General';
import Proceso from 'pages/contra/Proceso';
import ProcesoDetalle from 'pages/contra/ProcesoDetalle';
import Actividad from 'pages/contra/Actividad';
import ActividadDetalle from 'pages/contra/ActividadDetalle';
import ReporteProceso from 'pages/contra/ReporteProceso';
import Documento from 'pages/archivo/Documento';
import Acta from 'pages/archivo/Acta';
import ActaRecepcion from 'pages/archivo/ActaRecepcion';
import ActaReporte from 'pages/archivo/ActaReporte';
import Memorandum from 'pages/viatico/Memorandum';
import Descargo from 'pages/viatico/Descargo';
import Escala from 'pages/viatico/Escala';
import DetalleDestino from 'pages/viatico/DetalleDestino';
import VehiculoPublico from 'pages/viatico/VehiculoPublico';
import AperturaViatico from 'pages/viatico/AperturaViatico';
import Viatico from 'pages/viatico/Viatico';
import MemorandumDetalle from 'pages/viatico/MemorandumDetalle';
//import ReporteMemorandum from 'pages/viatico/ReporteMemorandum';
import ViaticoDetalle from 'pages/viatico/ViaticoDetalle';
import EscalaDestino from 'pages/viatico/EscalaDestino';
import ActaRecepcionDetalle from 'pages/archivo/ActaRecepcionDetalle';
import AperturaGeneral from 'pages/apertura/AperturaGeneral';
import ObjetoGasto from 'pages/apertura/ObjetoGasto';
import HistorialApertura from 'pages/apertura/HistorialApertura';
import HistorialAperturaDetalle from 'pages/apertura/HistorialAperturaDetalle';
import ReporteViatico from 'pages/viatico/ReporteViatico';
import MemorandumRRHH from 'pages/rrhh/MemorandumRRHH';
import MemorandumDetalleRRHH from 'pages/rrhh/MemorandumDetalleRRHH';
import MemorandumrrhhReporte from 'pages/rrhh/MemorandumrrhhReporte';
import Cites from 'pages/correspondencia/Cites';
import { setLatestVersionToStorage } from 'services/version/versionService';
import ValeCombustible from 'pages/bsss/ValeCombustible';
import LandingPage from 'pages/LandingPage';
import Callback from 'pages/system/Callback';
import ReporteVale from 'pages/bsss/ReporteVale';
import Bitacora from 'pages/system/Bitacora';
import BitacoraViaje from 'pages/bsss/BitacoraViaje';
import BitacoraDetalle from 'pages/bsss/BitacoraDetalle';

//import MemorandumDetalle from 'pages/viatico/MemorandumDetalle';

const closeLoader = () => {
    const $loader = document.querySelector('.app-loader');
    if (!$loader) return;
    $loader.classList.add('app-loader--hide');
    setTimeout(() => $loader.parentElement?.removeChild($loader), 300);
};

const AppComponent = (): ReactElement => {
    const validateVersion = useCallback(async (): Promise<void> => {
        const isLatestVersion = await CacheBuster.isLatestVersion();

        await setLatestVersionToStorage();

        if (!isLatestVersion) {
            await CacheBuster.updateToLastVersion(true);
        }
    }, []);

    const load = async () => {
        await validateVersion();

        const isLogged = isAuthenticated();
        if (!isLogged) return closeLoader();

        // INI - Update dashboard menu
        const dashboardGridItem = localStorage.getItem('dashboardMenu');
        if (dashboardGridItem) return closeLoader();
        const sessionInfo = getSessionInfoFromLocalStorage();
        const modulos: string[] = sessionInfo?.modulos || [];
        localStorage.setItem('dashboardMenu', JSON.stringify(modulos));
        // END - Update dashboard menu

        return closeLoader();
    };

    const loadCallback = useCallback(load, []);

    useEffect(() => {
        loadCallback();
    }, [loadCallback]);

    useEffect(() => {
        const handleFocus = (): void => {
            void validateVersion();
        };

        const handleVisibilityChange = (): void => {
            if (document.visibilityState === 'visible') {
                void validateVersion();
            }
        };

        const intervalId: number = window.setInterval((): void => {
            void validateVersion();
        }, 2 * 60 * 1000);

        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return (): void => {
            window.clearInterval(intervalId);
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [validateVersion]);

    return (
        <ThemeProvider>
            <BrowserRouter basename={packageInfo.homepage}>
                <NotistackProvider>
                    <Routes>
                        <Route path={routes.LOGIN} element={<Login />} />
                        <Route path={routes.CALLBACK} element={<Callback />} />
                        <Route
                            path={routes.HOME}
                            element={
                                <PrivateRoute>
                                    <DashboardLayout />
                                </PrivateRoute>
                            }
                        >
                            <Route index element={<DashboardApp />}></Route>
                        </Route>
                        <Route
                            path={routes.LANDING}
                            element={
                                <PrivateRoute>
                                    <LandingPageLayout />
                                </PrivateRoute>
                            }
                        >
                            <Route index element={<LandingPage />}></Route>
                        </Route>
                        <Route
                            path={routes.DASHBOARD}
                            element={
                                <PrivateRoute>
                                    <DashboardLayout />
                                </PrivateRoute>
                            }
                        >
                            <Route index element={<DashboardApp />} />
                            <Route path={routes.DASHBOARD_USER} element={<Users />} />
                            <Route path={routes.DASHBOARD_ROLE} element={<Roles />} />
                            <Route path={routes.DASHBOARD_RUTA} element={<Rutas />} />
                            <Route path={routes.DASHBOARD_SETTING} element={<Setting />} />
                        </Route>
                        <Route
                            path={routes.RRHH}
                            element={
                                <PrivateRoute>
                                    <DashboardLayout />
                                </PrivateRoute>
                            }
                        >
                            <Route index element={<DashboardApp />} />
                            <Route path={routes.RRHH_PERSONAL} element={<Personal />} />
                            <Route path={routes.RRHH_AREA} element={<Area />} />
                            <Route path={routes.RRHH_CARGO} element={<Cargo />} />
                            <Route path={routes.RRHH_VACACION} element={<Vacacion />} />
                            <Route path={routes.RRHH_MEMORANDUM_RRHH} element={<MemorandumRRHH />} />
                            <Route path={routes.RRHH_MEMORANDUM_DETALLE} element={<MemorandumDetalleRRHH />} />
                            <Route path={routes.RRHH_MEMORANDUM_REPORTE} element={<MemorandumrrhhReporte />} />
                        </Route>
                        <Route
                            path={routes.BSSS}
                            element={
                                <PrivateRoute>
                                    <DashboardLayout />
                                </PrivateRoute>
                            }
                        >
                            <Route index element={<DashboardApp />} />
                            <Route path={routes.BSSS_VALE} element={<ValeCombustible />} />
                            <Route path={routes.BSSS_VALE_ADMIN} element={<Vale />} />
                            <Route path={routes.BSSS_VEHICULO} element={<Vehiculo />} />
                            <Route path={routes.BSSS_DESTINO} element={<Destino />} />
                            <Route path={routes.BSSS_ASIGNACION} element={<Apertura />} />
                            <Route path={routes.BSSS_BITACORA_VIAJE} element={<BitacoraViaje />} />
                            <Route path={routes.BSSS_BITACORA_DETALLE} element={<BitacoraDetalle />} />
                            <Route path={routes.BSSS_BITACORA_DETALLE_ID} element={<BitacoraDetalle />} />
                            <Route path={routes.BSSS_REPORTE_VALE} element={<ReporteVale />} />
                        </Route>
                        <Route
                            path={routes.CONTA}
                            element={
                                <PrivateRoute>
                                    <DashboardLayout />
                                </PrivateRoute>
                            }
                        >
                            <Route index element={<DashboardApp />} />
                            <Route path={routes.CONTA_CUENTA} element={<Cuenta />} />
                            <Route path={routes.CONTA_DEUDA_DETALLE} element={<Deuda />} />
                            <Route path={routes.CONTA_SEGUIMIENTO_DETALLE} element={<Seguimiento />} />
                        </Route>
                        <Route
                            path={routes.CONTRA}
                            element={
                                <PrivateRoute>
                                    <DashboardLayout />
                                </PrivateRoute>
                            }
                        >
                            <Route index element={<DashboardApp />} />
                            <Route path={routes.CONTRA_GENERAL} element={<General />} />
                            <Route path={routes.CONTRA_PROCESO} element={<Proceso />} />
                            <Route path={routes.CONTRA_ACTIVIDAD} element={<Actividad />} />
                            <Route path={routes.CONTRA_ACTIVIDAD_DETALLE} element={<ActividadDetalle />} />
                            <Route path={routes.CONTRA_REPORTE} element={<ReporteProceso />} />
                            <Route path={routes.CONTRA_PROCESO_DETALLE} element={<ProcesoDetalle />} />
                        </Route>
                        <Route
                            path={routes.ARCHIVO}
                            element={
                                <PrivateRoute>
                                    <DashboardLayout />
                                </PrivateRoute>
                            }
                        >
                            <Route index element={<DashboardApp />} />
                            <Route path={routes.ARCHIVO_DOCUMENTO} element={<Documento />} />
                            <Route path={routes.ARCHIVO_ACTA} element={<Acta />} />
                            <Route path={routes.ARCHIVO_ACTA_REPORTE} element={<ActaReporte />} />
                            <Route path={routes.ARCHIVO_ACTA_RECEPCION} element={<ActaRecepcion />} />
                            <Route path={routes.ARCHIVO_ACTA_RECEPCION_DETALLE} element={<ActaRecepcionDetalle />} />
                        </Route>
                        <Route
                            path={routes.VIATICO}
                            element={
                                <PrivateRoute>
                                    <DashboardLayout />
                                </PrivateRoute>
                            }
                        >
                            <Route index element={<DashboardApp />} />
                            <Route path={routes.VIATICO_VIATICO_ADMIN} element={<Viatico />} />
                            <Route path={routes.VIATICO_MEMORANDUM} element={<Memorandum />} />
                            <Route path={routes.VIATICO_DESCARGO} element={<Descargo />} />
                            <Route path={routes.VIATICO_ESCALA} element={<Escala />} />
                            <Route path={routes.VIATICO_DETALLE_DESTINO} element={<DetalleDestino />} />
                            <Route path={routes.VIATICO_VEHICULO_PUBLICO} element={<VehiculoPublico />} />
                            <Route path={routes.VIATICO_APERTURA_VIATICO} element={<AperturaViatico />} />
                            <Route path={routes.VIATICO_MEMORANDUM_DETALLE} element={<MemorandumDetalle />} />
                            {/* <Route path={routes.VIATICO_REPORTE_VIATICO} element={<MemorandumDetalle />} />*/}
                            <Route path={routes.VIATICO_VIATICO_DETALLE} element={<ViaticoDetalle />} />
                            <Route path={routes.VIATICO_ESCALA_DESTINO} element={<EscalaDestino />} />
                            <Route path={routes.VIATICO_REPORTE_VIATICO} element={<ReporteViatico />} />
                        </Route>
                        <Route
                            path={routes.APERTURA}
                            element={
                                <PrivateRoute>
                                    <DashboardLayout />
                                </PrivateRoute>
                            }
                        >
                            <Route index element={<DashboardApp />} />
                            <Route path={routes.APERTURA_GENERAL} element={<AperturaGeneral />} />
                            <Route path={routes.OBJETO_GASTO_APERTURA} element={<ObjetoGasto />} />
                            <Route path={routes.APERTURA_HISTORIAL} element={<HistorialApertura />} />
                            <Route path={routes.APERTURA_HISTORIAL_DETALLE} element={<HistorialAperturaDetalle />} />
                        </Route>
                        <Route
                            path={routes.CORRESPONDENCIA}
                            element={
                                <PrivateRoute>
                                    <DashboardLayout />
                                </PrivateRoute>
                            }
                        >
                            <Route index element={<DashboardApp />} />
                            <Route path={routes.CORRESPONDENCIA_CITES} element={<Cites />} />
                        </Route>

                        <Route
                            path={routes.AUDITORIA}
                            element={
                                <PrivateRoute>
                                    <DashboardLayout />
                                </PrivateRoute>
                            }
                        >
                            <Route index element={<DashboardApp />} />
                            <Route path={routes.AUDITORIA_BITACORA} element={<Bitacora />} />
                        </Route>

                        <Route path={routes.NOT_FOUND} element={<NotFound />} />
                    </Routes>
                </NotistackProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
};

export const App = AppComponent;
