import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { MemorandumFormDialog, MemorandumFormModel } from './components/MemorandumFormDialog';
import { MemorandumTable, MemorandumTableModel, MemorandumTableRefProps, ReporteMemorandumTableModel } from './components/MemorandumTable';
import MemorandumDialog from './components/MemorandumDialog';
//services
import { MemorandumModuleService } from './MemorandumModuleService';
import { useNotify } from 'services/notify';
import { useNavigate } from 'react-router-dom';
import { RUTAS } from 'constants/routes';
import { useIsMounted } from 'hooks/useIsMounted';


export const MemorandumModule = (): ReactElement => {
    const notify = useNotify();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<string>(""); 
    const [loading2, setLoading2] = useState<string>("");
    const [loading3, setLoading3] = useState<string>("");
    const isMounted = useIsMounted();

    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openMemorandumForm, setOpenMemorandumForm] = useState(false);
    const [formModel, setFormModel] = useState<MemorandumFormModel>();

    const handleClickImprimir = async (data: ReporteMemorandumTableModel) => {
        if (loading) return;
        if (!isMounted()) return
        setLoading(data.id);
        setLoading2(data.id);
        return MemorandumModuleService.getReportMemorandumPDF(data.id, data.cod_depart_memo).then(() => {
            setLoading("");
            setLoading2("");
        });
    };

    const handleClickView = async (id_area: string) => {
        const actividadFormResponse = await MemorandumModuleService.getMemorandumFormData(id_area);
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
        const actividadFormResponse = await MemorandumModuleService.getMemorandumFormData(id_area);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    const tableRef = useRef<MemorandumTableRefProps>(null);

    return (
        <>
            <MemorandumFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <MemorandumDialog
                open={openMemorandumForm}
                onComplete={() => {
                    setOpenMemorandumForm(false);
                }}
                formModel={formModel}
            />
            <MemorandumTable
                ref={tableRef}
                onViewClick={handleClickView}
                onAddClick={handleClickAdd}
                onEditClick={handleClickEdit}
                onDetalleMemorandumClick={(idMemorandum) => navigate({
                    pathname: RUTAS.memorandum_detalle.getPath({id: idMemorandum})
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
