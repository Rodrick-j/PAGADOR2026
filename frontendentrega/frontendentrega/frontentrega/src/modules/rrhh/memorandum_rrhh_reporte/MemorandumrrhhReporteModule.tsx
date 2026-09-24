import React, { ReactElement, useState, useRef,useEffect } from 'react';
import * as XLSX from 'xlsx';
// @mui

// components
import { MemorandumrrhhReporteFormDialog, MemorandumrrhhReporteFormModel } from './components/MemorandumrrhhReporteFormDialog';
import { MemorandumrrhhReporteTableModel, MemorandumrrhhReporteTable, MemorandumrrhhReporteTableRefProps } from './components/MemorandumrrhhReporteTable';
import MemorandumrrhhReporteDialog from './components/MemorandumrrhhReporteDialog';
//services
import { MemorandumrrhhReporteModuleService } from './MemorandumrrhhReporteModuleService';
import { useNotify } from 'services/notify';
import { useNavigate, useParams } from 'react-router-dom';
import { RUTAS } from 'constants/routes';
import { useIsMounted } from 'hooks/useIsMounted';
import { SectionItem, SectionNav } from 'components/core/SectionNav';
import { ENUM_IMPRESION_MEMORANDUM_RRHH, ENUM_IMPRESION_VIATICO } from 'constants/enums';
import { Paper } from '@mui/material';
import { SectionNavRefProps } from 'components/core/SectionNav/SectionNav';
import { MemorandumrrhhModuleService } from '../memorandum_rrhh/MemorandumrrhhModuleService';
//import * as XLSX from 'xlsx'; // Importa la librería xlsx


export const MemorandumrrhhReporteModule = (): ReactElement => {
    const notify = useNotify();
    const [loading, setLoading] = React.useState(false);
    const [loadingE, setLoadingE] = React.useState(false);
      const [loading2, setLoading2] = useState<string>("");
    const navigate = useNavigate();
    const params = useParams();
   // const ID_VIATICO = params.id_memorandumrrhh || '';

    const [viaticoData, setMemorandumrrhhReporteData] = useState<MemorandumrrhhReporteFormModel>();
    const isMounted = useIsMounted();

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openMemorandumrrhhReporteForm, setOpenMemorandumrrhhReporteForm] = useState(false);
    const [formModel, setFormModel] = useState<MemorandumrrhhReporteFormModel>();
   // const [loading, setLoading] = useState<string>("");

    const handleClickView = async (id_memorandumrrhh: string) => {
        const actividadFormResponse = await MemorandumrrhhReporteModuleService.getMemorandumrrhhReporteFormData(id_memorandumrrhh);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenMemorandumrrhhReporteForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };
    
    const handleClickEdit = async (id_memorandumrrhh: string) => { 
              
        const viaticoFormResponse = await MemorandumrrhhReporteModuleService.getMemorandumrrhhReporteFormData(id_memorandumrrhh);
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
        return MemorandumrrhhReporteModuleService.getReportPDF(queryParams, fechaInicio!, fechaFin!, tipoFecha!).then(() => {
        setLoading(false);
        });
       
    };

    const handleClickDownloadExcel = async (fechaInicio?: string, fechaFin?: string,tipoReporte?: string) => {
        if (loadingE || !isMounted()) return;
        
        setLoadingE(true);
        const queryParams = tableRef.current?.getQueryParams();
      
        return MemorandumrrhhReporteModuleService.getReportJSON(fechaInicio!, fechaFin!, queryParams).then((response) => {
        
          setLoadingE(false);
        
        });
      };

     const handleClickImprimir = async (data: MemorandumrrhhReporteTableModel) => {
             if (loading) return;
             if (!isMounted()) return
             //setLoading(data.id);
             setLoading2(data.id);
             return MemorandumrrhhReporteModuleService.getReportMemorandumPDF(data.id, data.cod_depart_memo).then(() => {
              //   setLoading("");
                 setLoading2("");
             });
         }; 
    

    const sections: SectionItem[] = [];
    const tableRef = useRef<MemorandumrrhhReporteTableRefProps>(null);

    sections.push({
        id: '0',
        label: 'General',
        content: <MemorandumrrhhReporteTable
                    ref={tableRef}
                    onViewClick={handleClickView}
                    onAddClick={handleClickAdd}
                    onEditClick={handleClickEdit}                  
                    onDownloadClick={handleClickDownload}  
                    onDownloadExcel={handleClickDownloadExcel}
                    tipoReporte = {'GENERAL'} 
                    loading = {loading}
                     onDetalleMemorandumClick={(idMemorandum) => navigate({
                                        pathname: RUTAS.memorandum_detalle_rrhh.getPath({id: idMemorandum})
                                    })}
                                    
                                   /* onDetalleClick={(idMemorandum) => navigate({
                                        pathname: RUTAS.memorandum_detalle.getPath({ id: idMemorandum})
                                    })}*/
                    onImprimirClick={handleClickImprimir}
                    loading2={loading2}
                                                    
                />
    });

    ENUM_IMPRESION_MEMORANDUM_RRHH.map((e: { value: string, label: string }, index: number) => {       
        sections.push({
            id: String(index+1),
            label: e.label,
            content: <MemorandumrrhhReporteTable
                        ref={tableRef}
                        onViewClick={handleClickView}
                        onAddClick={handleClickAdd}
                        onEditClick={handleClickEdit}                       
                        onDownloadClick={handleClickDownload}
                        onDownloadExcel={handleClickDownloadExcel}
                        tipoReporte = {e.value}  
                        loading = {loading} 
                         onDetalleMemorandumClick={(idMemorandum) => navigate({
                                        pathname: RUTAS.memorandum_detalle_rrhh.getPath({id: idMemorandum})
                                    })}
                                    
                                   /* onDetalleClick={(idMemorandum) => navigate({
                                        pathname: RUTAS.memorandum_detalle.getPath({ id: idMemorandum})
                                    })}*/
                         onImprimirClick={handleClickImprimir}
                          loading2={loading2}
                                         
                    />
        });
    });

    const navRef = useRef<SectionNavRefProps>(null);
    
    return (
        <>
            <MemorandumrrhhReporteFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}           
                             
            />
            <MemorandumrrhhReporteDialog
                open={openMemorandumrrhhReporteForm}
                onComplete={() => {
                    setOpenMemorandumrrhhReporteForm(false);
                }}
                formModel={formModel}
            />
           

            <Paper>
                <SectionNav ref={navRef} sections={sections} />
            </Paper>
        </>
    );
    
    
};
