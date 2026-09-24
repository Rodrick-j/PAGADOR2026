import React, { ReactElement, useState, useRef,useEffect } from 'react';
import * as XLSX from 'xlsx';
// @mui

// components
import { ReporteValeFormDialog, ReporteValeFormModel } from './components/ReporteValeFormDialog';
import { ReporteValeTableModel, ReporteValeTable, ReporteValeTableRefProps } from './components/ReporteValeTable';
import ReporteValeDialog from './components/ReporteValeDialog';
//services
import { ReporteValeModuleService } from './ReporteValeModuleService';
import { useNotify } from 'services/notify';
import { useNavigate } from 'react-router-dom';
import { RUTAS } from 'constants/routes';
import { useIsMounted } from 'hooks/useIsMounted';
import { SectionItem, SectionNav } from 'components/core/SectionNav';
import {  ENUM_IMPRESION_VALE_COMBUSTIBLE } from 'constants/enums';
import { Paper } from '@mui/material';
import { SectionNavRefProps } from 'components/core/SectionNav/SectionNav';

//import * as XLSX from 'xlsx'; // Importa la librería xlsx


export const ReporteValeModule = (): ReactElement => {
    const notify = useNotify();
    const [loading, setLoading] = React.useState(false);
    const [loadingE, setLoadingE] = React.useState(false);
      const [loading2, setLoading2] = useState<string>("");
    const navigate = useNavigate();
    //const params = useParams();
    const isMounted = useIsMounted();

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openReporteValeForm, setOpenReporteValeForm] = useState(false);
    const [formModel, setFormModel] = useState<ReporteValeFormModel>();
   // const [loading, setLoading] = useState<string>("");

    const handleClickView = async (id_memorandumrrhh: string) => {
        const actividadFormResponse = await ReporteValeModuleService.getReporteValeFormData(id_memorandumrrhh);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenReporteValeForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };
    
    const handleClickEdit = async (id_memorandumrrhh: string) => { 
              
        const viaticoFormResponse = await ReporteValeModuleService.getReporteValeFormData(id_memorandumrrhh);
        if (!viaticoFormResponse.success) return notify.error(viaticoFormResponse.msg);
        const newFormModel = viaticoFormResponse.data;
        setFormModel(newFormModel);        
        setFormOpen(true);
       
    };
    

    const handleClickDownload = async (fechaInicio?: string, fechaFin?: string, tipoFecha?: number) => {
		
        if (loading) return;
        if (!isMounted()) return
        setLoading(true);
        // Obtener los parámetros de consulta, que probablemente incluyan los filtros.
        const queryParams = tableRef.current?.getQueryParams();        
        return ReporteValeModuleService.getReportPDF(queryParams, fechaInicio!, fechaFin!, tipoFecha!).then(() => {
        setLoading(false);
        });
       
    };

    const handleClickDownloadExcel = async (fechaInicio?: string, fechaFin?: string,tipoReporte?: string) => {
        if (loadingE || !isMounted()) return;
        
        setLoadingE(true);
        const queryParams = tableRef.current?.getQueryParams();
      
        return ReporteValeModuleService.getReportJSON(fechaInicio!, fechaFin!, queryParams).then((response) => {
        
          setLoadingE(false);
        
        });
      };

     const handleClickImprimir = async (data: ReporteValeTableModel) => {
             if (loading) return;
             if (!isMounted()) return
             //setLoading(data.id);
             setLoading2(data.id);
             //return ReporteValeModuleService.getReportMemorandumPDF(data.id, data.cod_depart_memo).then(() => {
              //   setLoading("");
                 setLoading2("");
          //   });
         }; 
    

    const sections: SectionItem[] = [];
    const tableRef = useRef<ReporteValeTableRefProps>(null);

    sections.push({
        id: '0',
        label: 'General',
        content: <ReporteValeTable
                    ref={tableRef}
                    onViewClick={handleClickView}
                    onAddClick={handleClickAdd}
                    onEditClick={handleClickEdit}                  
                    onDownloadClick={handleClickDownload}  
                    onDownloadExcel={handleClickDownloadExcel}
                    tipoReporte = {'GENERAL'} 
                    loading = {loading}
                    
                    onImprimirClick={handleClickImprimir}
                    loading2={loading2}
                                                    
                />
    });

    ENUM_IMPRESION_VALE_COMBUSTIBLE.map((e: { value: string, label: string }, index: number) => {       
        sections.push({
            id: String(index+1),
            label: e.label,
            content: <ReporteValeTable
                        ref={tableRef}
                        onViewClick={handleClickView}
                        onAddClick={handleClickAdd}
                        onEditClick={handleClickEdit}                       
                        onDownloadClick={handleClickDownload}
                        onDownloadExcel={handleClickDownloadExcel}
                        tipoReporte = {e.value}  
                        loading = {loading} 
                        
                         onImprimirClick={handleClickImprimir}
                          loading2={loading2}
                                         
                    />
        });
    });

    const navRef = useRef<SectionNavRefProps>(null);
    
    return (
        <>
            <ReporteValeFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}           
                             
            />
            <ReporteValeDialog
                open={openReporteValeForm}
                onComplete={() => {
                    setOpenReporteValeForm(false);
                }}
                formModel={formModel}
            />
           

            <Paper>
                <SectionNav ref={navRef} sections={sections} />
            </Paper>
        </>
    );
    
    
};
