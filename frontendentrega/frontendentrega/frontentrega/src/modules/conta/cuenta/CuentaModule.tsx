import React, { ReactElement, useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
// @mui
import { Paper } from '@mui/material';

// components
import { CuentaFormDialog, CuentaFormModel } from './components/CuentaFormDialog';
import { CuentaTable, CuentaTableModel, CuentaTableRefProps } from './components/CuentaTable';
import { SectionItem, SectionNavRefProps } from 'components/core/SectionNav/SectionNav';
import CuentaDialog from './components/CuentaDialog';
import { ConfirmInputDialog } from 'components/core/ConfirmDialog';
//services
import { CuentaModuleService } from './CuentaModuleService';
//hook
import { useNotify } from 'services/notify';
import { useNavigate } from 'react-router-dom';
import { useIsMounted } from 'hooks/useIsMounted';

import { RUTAS } from 'constants/routes';
import { SectionNav } from 'components/core/SectionNav';
import { ENUM_TIPO_CUENTA } from 'constants/enums';
import { SeguimientoModuleService } from '../seguimiento';
import { ComponentToPrintSeguimiento } from './components/ComponentToPrintSeguimiento';


export type SeguimientoHTMLData = {
    id             : string;
    cite           : string;
    fecha_impresion: string;
    nombre_completo: string;
    fecha_saldo    : string;
    saldo_numeral  : string;
    saldo_literal  : string;
    concepto       : string;
};

export const CuentaModule = (): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();
    const navigate = useNavigate();
    const navRef = useRef<SectionNavRefProps>(null);

    const [loading, setLoading] = React.useState(false);
    const [loading2, setLoading2] = useState<string>("");
    const [loading3, setLoading3] = useState<string>("");

    const [htmlSeguimientoOpen, setHTMLSeguimientoOpen] = useState<SeguimientoHTMLData  | null>(null);

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openCuentaForm, setOpenCuentaForm] = useState(false);
    const [formModel, setFormModel] = useState<CuentaFormModel>();

    const contentRef = useRef<HTMLDivElement>(null);
    const handleSeguimientoPrint = useReactToPrint({
        contentRef,
        pageStyle: `@media print {
            @page {
              margin: 1rem;
            }
        }`,
        onAfterPrint: () => {
            setHTMLSeguimientoOpen(null);
        }
    });

    const handleClickView = async (id_cuenta: string) => {
        const actividadFormResponse = await CuentaModuleService.getCuentaFormData(id_cuenta);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenCuentaForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_cuenta: string) => {
        const actividadFormResponse = await CuentaModuleService.getCuentaFormData(id_cuenta);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    const handleClickDownload = async (id_cuenta?: string) => {
        if (loading) return;
        if (!isMounted()) return
        setLoading(true);
        return CuentaModuleService.getReportPDF(tableRef.current?.getQueryParams()).then(() => {
            setLoading(false);
        });
    };

    const handleClickImprimirReporteIndividual = async (data: CuentaTableModel) => {
        if (loading) return;
        if (!isMounted()) return
        setLoading2(data.id);
        return CuentaModuleService.getReportDeudaPDF(data.id).then(() => {
            setLoading2("");
        });
    };

    const [handleSeguimiento, setHandleSeguimiento] = useState<any>(null);
    const handleClickImprimirSeguimiento = async (data: CuentaTableModel, input1: string) => {
        if (loading) return;
        if (!isMounted()) return;
        setLoading3(data.id);
        SeguimientoModuleService.getReportSeguimientoPDF(data.id, input1).then((result) => {
            setLoading3("");
            if (!result.success) return notify.error(result.msg);
            if (isMounted()) {
                setHTMLSeguimientoOpen(result.data as SeguimientoHTMLData);
            }
        });
    };

    useEffect(() => {
        if(htmlSeguimientoOpen) {
            handleSeguimientoPrint();
        }
    }, [htmlSeguimientoOpen, handleSeguimientoPrint]);

    const tableRef = useRef<CuentaTableRefProps>(null);

    const sections: SectionItem[] = [];

    sections.push({
        id: '0',
        label: 'General',
        content: <CuentaTable
                    ref={tableRef}
                    onViewClick={handleClickView}
                    onAddClick={handleClickAdd}
                    onEditClick={handleClickEdit}
                    onDetalleClick={(idCuenta) => navigate({
                        pathname: RUTAS.deuda_detalle.getPath({ id: idCuenta})
                    })}
                    onDetalle2Click={(idCuenta) => navigate({
                        pathname: RUTAS.seguimiento_detalle.getPath({ id: idCuenta})
                    })}
                    onDownloadClick={handleClickDownload}
                    onImprimirReporteIndividualClick={handleClickImprimirReporteIndividual}
                    onImprimirSeguimientoClick={(data: CuentaTableModel) => {setDialogOpen(true); setHandleSeguimiento(data);}}
                    loading={loading}
                    loading2={loading2}
                    loading3={loading3}
                    tipoCuenta={""}
                />
    });

    ENUM_TIPO_CUENTA.map((e: { value: string, label: string }, index: number) => {
        sections.push({
            id: String(index+1),
            label: e.label,
            content: <CuentaTable
                        ref={tableRef}
                        onViewClick={handleClickView}
                        onEditClick={handleClickEdit}
                        onDetalleClick={(idCuenta) => navigate({
                            pathname: RUTAS.deuda_detalle.getPath({ id: idCuenta})
                        })}
                        onDownloadClick={handleClickDownload}
                        onImprimirReporteIndividualClick={handleClickImprimirReporteIndividual}
                        loading={loading}
                        loading2={loading2}
                        tipoCuenta={e.value}
                    />
        });
    });

    const [dialogOpen, setDialogOpen] = useState(false);
    const handleAccept = async (input1: string, input2?: string) => {
        setDialogOpen(false);
        handleClickImprimirSeguimiento(handleSeguimiento, input1);
    };

    return (
        <>
            <ConfirmInputDialog
                open={dialogOpen}
                onAccept={handleAccept}
                onCancel={() => setDialogOpen(false)}
                labels={['Nro Cite']}
                title="Confirmación"
                message="Por favor, introduce el numero de CITE."
            />
            <CuentaFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <CuentaDialog
                open={openCuentaForm}
                onComplete={() => {
                    setOpenCuentaForm(false);
                }}
                formModel={formModel}
            />
            {<div style={{ overflow: 'hidden', height: 0 }}>
                <ComponentToPrintSeguimiento ref={contentRef} htmlData={htmlSeguimientoOpen} />
            </div>}
            <Paper>
                <SectionNav ref={navRef} sections={sections} />
            </Paper>
        </>
    );
};
