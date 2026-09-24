import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { ReporteProcesoTable, ReporteProcesoTableModel, ReporteProcesoTableRefProps } from './components/ReporteProcesoTable';
//services
import { useNotify } from 'services/notify';
import { useNavigate } from 'react-router-dom';
import { RUTAS } from 'constants/routes';

import { useIsMounted } from 'hooks/useIsMounted';
import { ReporteProcesoModuleService } from './ReporteProcesoModuleService';
import { Paper } from '@mui/material';
import { SectionNav } from 'components/core/SectionNav';
import { SectionItem, SectionNavRefProps } from 'components/core/SectionNav/SectionNav';
import { ReporteProceso500Table, ReporteProceso500TableRefProps } from './components/ReporteProceso500Table';

export const ReporteProcesoModule = (): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();
    const navigate = useNavigate();

    const [loading, setLoading] = useState<string>("");

    const [loading1, setLoading1] = React.useState(false);
    const [loading2, setLoading2] = React.useState(false);

    const navRef = useRef<SectionNavRefProps>(null);

    const tableRef1 = useRef<ReporteProcesoTableRefProps>(null);
    const tableRef2 = useRef<ReporteProceso500TableRefProps>(null);

    const handleClickImprimir = async (data: ReporteProcesoTableModel) => {
        if (loading) return;
        if (!isMounted()) return
        setLoading(data.id);
        return ReporteProcesoModuleService.getProcesoDetalleReportPDF(data.id, data.codigo_interno_entidad).then(() => {
            setLoading("");
        });
    };

    const handleClickProcesoDownload1 = async () => {
        if (loading1) return;
        if (!isMounted()) return
        setLoading1(true);
        return ReporteProcesoModuleService.getReportProcesoPDF1(tableRef2.current?.getQueryParams()).then(() => {
            setLoading1(false);
        });
    };

    const handleClickProcesoDownload = async () => {
        if (loading2) return;
        if (!isMounted()) return
        setLoading2(true);
        return ReporteProcesoModuleService.getReportProcesoPDF(tableRef2.current?.getQueryParams()).then(() => {
            setLoading2(false);
        });
    };

    const sections: SectionItem[] = [];

    sections.push({
        id: '0',
        label: 'Reporte General',
        content: <ReporteProcesoTable
                    ref={tableRef1}
                    onDetalleClick={(idProceso) => navigate({
                        pathname: RUTAS.proceso_detalle.getPath({ id: idProceso})
                    })}
                    onImprimirClick={handleClickImprimir}
                    onDownloadClick={handleClickProcesoDownload1}
                    loading={loading}
                    loading1={loading1}
                />
    });

    sections.push({
        id: '1',
        label: 'Formulario 500',
        content: <ReporteProceso500Table
                    ref={tableRef2}
                    onDownloadClick={handleClickProcesoDownload}
                    loading={loading2}
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
