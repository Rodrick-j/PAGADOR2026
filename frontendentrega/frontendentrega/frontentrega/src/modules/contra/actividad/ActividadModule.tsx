import React, { ReactElement, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui

// components
import { ActividadTable, ActividadTableRefProps } from './components/ActividadTable';
//services
import { RUTAS } from 'constants/routes';

export const ActividadModule = (): ReactElement => {
    const navigate = useNavigate();

    const tableRef = useRef<ActividadTableRefProps>(null);

    return (
        <>
            <ActividadTable
                ref={tableRef}
                onDetalleClick={(idProceso) => navigate({
                    pathname: RUTAS.actividad_detalle.getPath({ id: idProceso})
                })}
            />
        </>
    );
};
