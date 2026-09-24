import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { ValeFormDialog, ValeFormModel } from './components/ValeAdminFormDialog';
import { ValeTable, ValeTableModel, ValeTableRefProps } from './components/ValeAdminTable';
import ValeDialog from './components/ValeAdminDialog';
//services
import { ValeModuleService } from './ValeAdminModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';

export const ValeModule = (): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();

    const [loading, setLoading] = React.useState(false);
    const [loading1, setLoading1] = useState<string>("");
    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openValeForm, setOpenValeForm] = useState(false);
    const [formModel, setFormModel] = useState<ValeFormModel>();

    const handleClickView = async (id_vale: string) => {
        const valeFormResponse = await ValeModuleService.getValeFormData(id_vale);
        if (!valeFormResponse.success) return notify.error(valeFormResponse.msg);
        const newFormModel = valeFormResponse.data;
        setFormModel(newFormModel);
        setOpenValeForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_vale: string) => {
        const valeFormResponse = await ValeModuleService.getValeFormData(id_vale);
        if (!valeFormResponse.success) return notify.error(valeFormResponse.msg);
        const newFormModel = valeFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    const handleClickImprimir = async (data: ValeTableModel) => {
        if (loading1) return;
        if (!isMounted()) return
        setLoading1(data.id);
        return ValeModuleService.getReportPDFVale(data.id, data.cod_vale).then(() => {
            setLoading1("");
        });
    };

    const handleClickDownload = async () => {
        if (loading) return;
        if (!isMounted()) return
        setLoading(true);
        return ValeModuleService.getReportPDF(tableRef.current?.getQueryParams()).then(() => {
            setLoading(false);
        });
    };

    const tableRef = useRef<ValeTableRefProps>(null);

    return (
        <>
            <ValeFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <ValeDialog
                open={openValeForm}
                onComplete={() => {
                    setOpenValeForm(false);
                }}
                formModel={formModel}
            />
            <ValeTable
                ref={tableRef}
                onViewClick={handleClickView}
                onAddClick={handleClickAdd}
                onEditClick={handleClickEdit}
                onImprimirClick={handleClickImprimir}
                onDownloadClick={handleClickDownload}
                loading={loading}
                loading1={loading1}
            />
        </>
    );
};
