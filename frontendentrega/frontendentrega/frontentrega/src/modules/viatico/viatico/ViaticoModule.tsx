import React, { ReactElement, useState, useRef,useEffect } from 'react';
// @mui

// components
import { ViaticoAnularFormModel, ViaticoFormDialog, ViaticoFormModel } from './components/ViaticoFormDialog';
import { ReporteViaticoTableModel, ViaticoTable, ViaticoTableModel, ViaticoTableRefProps } from './components/ViaticoTable';
import ViaticoDialog from './components/ViaticoDialog';
//services
import { ViaticoModuleService } from './ViaticoModuleService';
import { useNotify } from 'services/notify';
import { useNavigate, useParams } from 'react-router-dom';
import { RUTAS } from 'constants/routes';
import { useIsMounted } from 'hooks/useIsMounted';
import { SeguimientoHTMLData } from 'modules/conta/cuenta/CuentaModule';
import { useReactToPrint } from 'react-to-print';
import { MemorandumModuleService } from '../memorandum';
import ViaticoAnularDialog from './components/ViaticoAnularDialog';

export const ViaticoModule = (): ReactElement => {
    const notify = useNotify();
    const navigate = useNavigate();
    const params = useParams();

    
   // const ID_VIATICO = params.id_viatico || '';

    const [viaticoData, setViaticoData] = useState<ViaticoFormModel>();
    const isMounted = useIsMounted();

    const [formOpen, setFormOpen] = useState<boolean>(false);
     const [formOpenAnular, setFormOpenAnular] = useState<boolean>(false);
    const [openViaticoForm, setOpenViaticoForm] = useState(false);
    const [formModel, setFormModel] = useState<ViaticoFormModel>();
    const [formModelAnular, setFormModelAnular] = useState<ViaticoAnularFormModel>();
    const [loading, setLoading] = useState<string>("");
    const [loading2, setLoading2] = useState<string>("");
    const [loading3, setLoading3] = useState<string>("");

    const [htmlSeguimientoOpen, setHTMLSeguimientoOpen] = useState<SeguimientoHTMLData  | null>(null);

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

    const handleClickView = async (id_viatico: string) => {
        const actividadFormResponse = await ViaticoModuleService.getViaticoFormData(id_viatico);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenViaticoForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };
    const handleClickAnular = async () => {
   /* setFormModelAnular({
        id_viatico: data.id_viatico,
        nume_recibo: data.nume_recibo || '',
        observacion_anulacion: '',
        fecha_anulacion: new Date()
    });*/

    setFormOpenAnular(true);
};
    
    const handleClickEdit = async (id_viatico: string) => { 
              
        const viaticoFormResponse = await ViaticoModuleService.getViaticoFormData(id_viatico);
        if (!viaticoFormResponse.success) return notify.error(viaticoFormResponse.msg);
        const newFormModel = viaticoFormResponse.data;
        setFormModel(newFormModel);        
        setFormOpen(true);
       
    };
    const handleClickImprimir = async (data: ReporteViaticoTableModel) => {
        if (loading) return;
        if (!isMounted()) return
        setLoading(data.id);
        return ViaticoModuleService.getReportViaticoPDF(data.id, data.nume_recibo).then(() => {
            setLoading("");
        });
    };

  const handleClickImprimirMemorandum = async (data: ViaticoTableModel) => {
          if (loading) return;
          if (!isMounted()) return
         // setLoading(data.id);
          setLoading2(data.id);
          return MemorandumModuleService.getReportMemorandumPDF(data.memorandum_id||"-", data.cod_memorandum).then(() => {
         //     setLoading("");
              setLoading2("");
          });
      };
   
    const tableRef = useRef<ViaticoTableRefProps>(null);
    
    return (
        <>
            <ViaticoFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}           
                             
            />
            <ViaticoDialog
                open={openViaticoForm}
                onComplete={() => {
                    setOpenViaticoForm(false);
                }}
                formModel={formModel}
            />
            <ViaticoTable
                ref={tableRef}
                onViewClick={handleClickView}
                onAddClick={handleClickAdd}
                onAnularClick={handleClickAnular}
                onEditClick={handleClickEdit}
                onPagoClick={(idViatico,memoId) => navigate({
                    pathname: RUTAS.viatico_detalle.getPath({id: idViatico,memoId:memoId})
                })}  
                onImprimirClick={handleClickImprimir}    
                onImprimirClickMemorandum ={handleClickImprimirMemorandum}       
                loading={loading}        
                loading2={loading2}             
            />
            <ViaticoAnularDialog
                open={formOpenAnular}
                formModel={formModelAnular}
                onComplete={() => {
                    setFormOpenAnular(false);
                    tableRef.current?.refresh();
                }}
                onCancel={() => {
                    setFormOpenAnular(false);
                }}
            />
        </>
    );
    
    
};
