import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { DocumentoFormDialog, DocumentoFormModel } from './components/DocumentoFormDialog';
import { DocumentoTable, DocumentoTableRefProps } from './components/DocumentoTable';
import DocumentoDialog from './components/DocumentoDialog';
//services
import { DocumentoModuleService } from './DocumentoModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';

export const DocumentoModule = (): ReactElement => {
    const notify = useNotify();

    const [loading, setLoading] = React.useState(false);
    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openDocumentoForm, setOpenDocumentoForm] = useState(false);
    const [formModel, setFormModel] = useState<DocumentoFormModel>();

    const handleClickView = async (id_documento: string) => {
        const actividadFormResponse = await DocumentoModuleService.getDocumentoFormData(id_documento);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenDocumentoForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_documento: string) => {
        const actividadFormResponse = await DocumentoModuleService.getDocumentoFormData(id_documento);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    const tableRef = useRef<DocumentoTableRefProps>(null);

    return (
        <>
            <DocumentoFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <DocumentoDialog
                open={openDocumentoForm}
                onComplete={() => {
                    setOpenDocumentoForm(false);
                }}
                formModel={formModel}
            />
            <DocumentoTable
                ref={tableRef}
                onViewClick={handleClickView}
                onAddClick={handleClickAdd}
                onEditClick={handleClickEdit}
                loading={loading}
                tipoDocumento={""}
            />
        </>
    );
};
