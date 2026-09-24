import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { BitacoraTable, BitacoraTableModel, BitacoraTableRefProps } from './components/BitacoraTable';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';
import BitacoraDialog, { BitacoraFormModel } from './components/BitacoraDialog';
import { BitacoraModuleService } from './BitacoraModuleService';

export const BitacoraModule = (): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();

    const [loading, setLoading] = React.useState(false);
    const [formModel, setFormModel] = useState<BitacoraFormModel>();
    const [openValeForm, setOpenBitacoraForm] = useState(false);

    const handleClickView = async (id: string) => {
        const actividadFormResponse = await BitacoraModuleService.getBitacoraFormData(id);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenBitacoraForm(true);
    };

    const tableRef = useRef<BitacoraTableRefProps>(null);

    const handleClickBitacoraDownload = async () => {
        if (loading) return;
        if (!isMounted()) return
        setLoading(true);
        return BitacoraModuleService.getReportBitacoraPDF(tableRef.current?.getQueryParams()).then(() => {
            setLoading(false);
        });
    };


    return (
        <>
            <BitacoraDialog
                open={openValeForm}
                onComplete={() => {
                    setOpenBitacoraForm(false);
                }}
                formModel={formModel}
            />
            <BitacoraTable
                ref={tableRef}
                onViewClick={handleClickView}
                onDownloadClick={handleClickBitacoraDownload}
                loading={loading}
            />
        </>
    );
};
