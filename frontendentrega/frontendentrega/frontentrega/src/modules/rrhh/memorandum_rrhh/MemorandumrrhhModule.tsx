import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { MemorandumrrhhFormDialog, MemorandumrrhhFormModel } from './components/MemorandumrrhhFormDialog';
import { MemorandumrrhhTable, MemorandumrrhhTableModel, MemorandumTableRefProps, ReporteMemorandumrrhhTableModel } from './components/MemorandumrrhhTable';
import MemorandumrrhhDialog from './components/MemorandumrrhhDialog';
//services
import { MemorandumrrhhModuleService } from './MemorandumrrhhModuleService';
import { useNotify } from 'services/notify';
import { useNavigate } from 'react-router-dom';
import { RUTAS } from 'constants/routes';
import { useIsMounted } from 'hooks/useIsMounted';


export const MemorandumrrhhModule = (): ReactElement => {
    const notify = useNotify();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<string>(""); 
    const [loading2, setLoading2] = useState<string>("");
    const [loading3, setLoading3] = useState<string>("");
    const isMounted = useIsMounted();

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openMemorandumForm, setOpenMemorandumForm] = useState(false);
    const [formModel, setFormModel] = useState<MemorandumrrhhFormModel>();

    const handleClickImprimir = async (data: ReporteMemorandumrrhhTableModel) => {
        if (loading) return;
        if (!isMounted()) return
        setLoading(data.id);
        setLoading2(data.id);
        return MemorandumrrhhModuleService.getReportMemorandumPDF(data.id, data.cod_depart_memo).then(() => {
            setLoading("");
            setLoading2("");
        });
    };

    const handleClickView = async (id_area: string) => {
        const actividadFormResponse = await MemorandumrrhhModuleService.getMemorandumFormData(id_area);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenMemorandumForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_area: string) => {
        const actividadFormResponse = await MemorandumrrhhModuleService.getMemorandumFormData(id_area);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    const tableRef = useRef<MemorandumTableRefProps>(null);

    return (
        <>
            <MemorandumrrhhFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <MemorandumrrhhDialog
                open={openMemorandumForm}
                onComplete={() => {
                    setOpenMemorandumForm(false);
                }}
                formModel={formModel}
            />
            <MemorandumrrhhTable
                ref={tableRef}
                onViewClick={handleClickView}
                onAddClick={handleClickAdd}
                onEditClick={handleClickEdit}
                onDetalleMemorandumClick={(idMemorandum) => navigate({
                    pathname: RUTAS.memorandum_detalle_rrhh.getPath({id: idMemorandum})
                })}
                
               /* onDetalleClick={(idMemorandum) => navigate({
                    pathname: RUTAS.memorandum_detalle.getPath({ id: idMemorandum})
                })}*/
                onImprimirClick={handleClickImprimir}
                loading={loading}
                loading2={loading2}
            />
        </>
    );
};
