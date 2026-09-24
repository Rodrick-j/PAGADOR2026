import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { CitesFormDialog, CitesFormModel } from './components/CitesFormDialog';
import { CitesTable, CitesTableModel, CitesTableRefProps } from './components/CitesTable';
import CitesDialog from './components/CitesDialog';

//services
import { CitesModuleService } from './CitesModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';

export const CitesModule = (): ReactElement => {
    const notify = useNotify();
     //const [loading, setLoading] = React.useState(false);
     const [loading, setLoading] = useState<string>(""); 
     const [loading1, setLoading1] = React.useState(false);

      const isMounted = useIsMounted();

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openCitesForm, setOpenCitesForm] = useState(false);
    const [formModel, setFormModel] = useState<CitesFormModel>();

    const handleClickView = async (id_cite: string) => {
        const citeFormResponse = await CitesModuleService.getCitesFormData(id_cite);
        if (!citeFormResponse.success) return notify.error(citeFormResponse.msg);
        const newFormModel = citeFormResponse.data;
        setFormModel(newFormModel);
        setOpenCitesForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_cite: string) => {
        const citeFormResponse = await CitesModuleService.getCitesFormData(id_cite);	
        if (!citeFormResponse.success) return notify.error(citeFormResponse.msg);
        const newFormModel = citeFormResponse.data;		
        setFormModel(newFormModel);
        setFormOpen(true);
    };

     const handleClickDownload = async (tipoReporte?: string) => {
            if (loading1) return;
            if (!isMounted()) return
            setLoading1(true);
            // Obtener los parámetros de consulta, que probablemente incluyan los filtros.
            const queryParams = tableRef.current?.getQueryParams(); 
            return CitesModuleService.getReporteCitesPDF(queryParams).then(() => {
            setLoading1(false);
            });
           
        };

        const handleClickImprimir = async (data: CitesTableModel) => {
                if (loading) return;
                if (!isMounted()) return
                setLoading(data.id);
               // setLoading2(data.id);
                return CitesModuleService.getAllCitesPDF(data.id, data.cite_completo).then(() => {
                    setLoading("");
                 //   setLoading2("");
                });
            };

    const tableRef = useRef<CitesTableRefProps>(null);

    return (
        <>
            <CitesFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <CitesDialog
                open={openCitesForm}
                onComplete={() => {
                    setOpenCitesForm(false);
                }}
                formModel={formModel}
            />
            <CitesTable
                ref={tableRef}
                onViewClick={handleClickView}
                onAddClick={handleClickAdd}
                onEditClick={handleClickEdit}
                onDownloadClick={handleClickDownload}
                onImprimirClick={handleClickImprimir}
                loading={loading}
            />
        </>
    );
};
