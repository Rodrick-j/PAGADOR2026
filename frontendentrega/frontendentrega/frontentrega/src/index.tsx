/**
 * Proyecto: Plataforma PAGADOR
 * Autor técnico del desarrollo e implementación: Ing. Giancarlo Delgadillo Coca
 * Sistema desarrollado para el Gobierno Autónomo Departamental de Oruro.
 *
 * Se deja constancia de la participación, autoría técnica e implementación
 * directa del Ing. Giancarlo Delgadillo Coca en el análisis, diseño, desarrollo, integración,
 * adecuación, mantenimiento y mejora continua del sistema PAGADOR.
 *
 * La presente mención reconoce la autoría técnica del desarrollador sobre
 * este código fuente, sin perjuicio de la titularidad institucional que
 * corresponda conforme a la normativa aplicable y a las condiciones de
 * contratación.
 */
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';

import { App } from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
    <StrictMode>
        <HelmetProvider>
            <App />
        </HelmetProvider>
    </StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
