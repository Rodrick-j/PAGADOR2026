import React, { ReactElement, useState, useRef,useEffect } from 'react';
import * as XLSX from 'xlsx';
// @mui

// components
import { ReporteViaticoFormDialog, ReporteViaticoFormModel } from './components/ReporteViaticoFormDialog';
import { ReporteViaticoTableModel, ReporteViaticoTable, ReporteViaticoTableRefProps } from './components/ReporteViaticoTable';
import ReporteViaticoDialog from './components/ReporteViaticoDialog';
//services
import { ReporteViaticoModuleService } from './ReporteViaticoModuleService';
import { useNotify } from 'services/notify';
import { useNavigate, useParams } from 'react-router-dom';
import { RUTAS } from 'constants/routes';
import { useIsMounted } from 'hooks/useIsMounted';
import { SectionItem, SectionNav } from 'components/core/SectionNav';
import { ENUM_IMPRESION_VIATICO } from 'constants/enums';
import { Paper } from '@mui/material';
import { SectionNavRefProps } from 'components/core/SectionNav/SectionNav';
//import * as XLSX from 'xlsx'; // Importa la librería xlsx


export const ReporteViaticoModule = (): ReactElement => {
    const notify = useNotify();
    const [loading, setLoading] = React.useState(false);
    const [loadingE, setLoadingE] = React.useState(false);
    const navigate = useNavigate();
    const params = useParams();
   // const ID_VIATICO = params.id_viatico || '';

    const [viaticoData, setReporteViaticoData] = useState<ReporteViaticoFormModel>();
    const isMounted = useIsMounted();

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openReporteViaticoForm, setOpenReporteViaticoForm] = useState(false);
    const [formModel, setFormModel] = useState<ReporteViaticoFormModel>();
   // const [loading, setLoading] = useState<string>("");

    const handleClickView = async (id_viatico: string) => {
        const actividadFormResponse = await ReporteViaticoModuleService.getReporteViaticoFormData(id_viatico);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenReporteViaticoForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };
    
    const handleClickEdit = async (id_viatico: string) => { 
              
        const viaticoFormResponse = await ReporteViaticoModuleService.getReporteViaticoFormData(id_viatico);
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
        return ReporteViaticoModuleService.getReportPDF(queryParams, fechaInicio!, fechaFin!, tipoFecha!).then(() => {
        setLoading(false);
        });
       
    };

    const handleClickDownloadExcel = async (fechaInicio?: string, fechaFin?: string,tipoReporte?: string) => {
        if (loadingE || !isMounted()) return;
        
        setLoadingE(true);
        const queryParams = tableRef.current?.getQueryParams();
      
        return ReporteViaticoModuleService.getReportJSON(fechaInicio!, fechaFin!,queryParams).then((response) => {
        
          setLoadingE(false);
        
        });
      };

      
    

    const sections: SectionItem[] = [];
    const tableRef = useRef<ReporteViaticoTableRefProps>(null);

    sections.push({
        id: '0',
        label: 'General',
        content: <ReporteViaticoTable
                    ref={tableRef}
                    onViewClick={handleClickView}
                    onAddClick={handleClickAdd}
                    onEditClick={handleClickEdit}                  
                    onDownloadClick={handleClickDownload}  
                    onDownloadExcel={handleClickDownloadExcel}
                    tipoReporte = {'GENERAL'} 
                    loading = {loading}
                                                    
                />
    });

    ENUM_IMPRESION_VIATICO.map((e: { value: string, label: string }, index: number) => {       
        sections.push({
            id: String(index+1),
            label: e.label,
            content: <ReporteViaticoTable
                        ref={tableRef}
                        onViewClick={handleClickView}
                        onAddClick={handleClickAdd}
                        onEditClick={handleClickEdit}                       
                        onDownloadClick={handleClickDownload}
                        onDownloadExcel={handleClickDownloadExcel}
                        tipoReporte = {e.value}  
                        loading = {loading} 
                                         
                    />
        });
    });

    const navRef = useRef<SectionNavRefProps>(null);
    
    return (
        <>
            <ReporteViaticoFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}           
                             
            />
            <ReporteViaticoDialog
                open={openReporteViaticoForm}
                onComplete={() => {
                    setOpenReporteViaticoForm(false);
                }}
                formModel={formModel}
            />
           

            <Paper>
                <SectionNav ref={navRef} sections={sections} />
            </Paper>
        </>
    );
    
    
};
