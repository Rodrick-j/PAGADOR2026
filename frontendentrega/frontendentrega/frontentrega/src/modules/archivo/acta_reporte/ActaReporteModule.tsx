import React, { ReactElement, useState, useRef } from 'react';
// @mui
import { Paper } from '@mui/material';

// components
import { SectionNav } from 'components/core/SectionNav';
import { SectionItem, SectionNavRefProps } from 'components/core/SectionNav/SectionNav';
//hook
import { useIsMounted } from 'hooks/useIsMounted';
//services
import { ActaReporteDocumentoTable, ActaReporteDocumentoTableRefProps } from './components/ActaReporteDocumentoTable';
import { ActaReporteActaTable, ActaReporteActaTableRefProps } from './components/ActaReporteActaTable';
import { ActaReporteModuleService } from './ActaReporteModuleService';

export type documentoProps = {
    nombre_deudor           : string;
    tipo_documento          : string;
    ci                      : string;
    gestion_generacion_acta : string;
    documentacion_respaldo  : string;
    direccion_domicilio     : string;
    telefono_celular        : string;
    confirmacion            : string;
    descripcion_confirmacion: string;
    incremento_acta         : string;
    monto_incremento_acta   : number;
    depositos_realizados    : string;
    observacion             : string;
    saldo                   : number;
    descripcion_deuda       : string;
    estado_proceso          : string;
}

export const ActaReporteModule = (): ReactElement => {
    const isMounted = useIsMounted();
    const [loading, setLoading] = React.useState(false);
    const [loadingE, setLoadingE] = React.useState(false);

    const navRef = useRef<SectionNavRefProps>(null);

    const tableRef1 = useRef<ActaReporteDocumentoTableRefProps>(null);
    const tableRef2 = useRef<ActaReporteActaTableRefProps>(null);


    const handleClickDocumentosDownload = async () => {
        if (loading) return;
        if (!isMounted()) return
        setLoading(true);
        return ActaReporteModuleService.getReportDocumentoPDF(tableRef1.current?.getQueryParams()).then(() => {
            setLoading(false);
        });
    };

    const handleClickDownloadExcel = async () => {
        if (loadingE || !isMounted()) return;
        setLoadingE(true);
        return ActaReporteModuleService.getReportDocumentoJSON(tableRef1.current?.getQueryParams()).then(() => {
            setLoadingE(false);
        });
    };

    const handleClickActasDownload = async () => {
        if (loading) return;
        if (!isMounted()) return
        setLoading(true);
        return ActaReporteModuleService.getReportActaPDF(tableRef2.current?.getQueryParams()).then(() => {
            setLoading(false);
        });
    };

    const sections: SectionItem[] = [];

    sections.push({
        id: '0',
        label: 'Documentos',
        content: <ActaReporteDocumentoTable
                    ref={tableRef1}
                    onDownloadClick={handleClickDocumentosDownload}
                    onDownloadExcel={handleClickDownloadExcel}
                    loading={loading}
                    loadingE={loadingE}
                />
    });

    sections.push({
        id: '1',
        label: 'Actas',
        content: <ActaReporteActaTable
                    ref={tableRef2}
                    onDownloadClick={handleClickActasDownload}
                    loading={loading}
                />
    });


    return (
        <>
            <Paper>
                <SectionNav ref={navRef} sections={sections} />
            </Paper>
        </>
    );
};
