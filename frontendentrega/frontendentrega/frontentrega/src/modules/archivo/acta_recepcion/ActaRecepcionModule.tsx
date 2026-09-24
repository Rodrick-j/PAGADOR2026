import React, { ReactElement, useState, useRef } from 'react';
// @mui
import { ConfirmDialog } from 'components/core/ConfirmDialog';
// components
import { ActaRecepcionFormDialog, ActaRecepcionFormModel } from './components/ActaRecepcionFormDialog';
import { ActaRecepcionTable, ActaRecepcionTableModel, ActaRecepcionTableRefProps } from './components/ActaRecepcionTable';
import ActaRecepcionDialog from './components/ActaRecepcionDialog';
//services
import { ActaRecepcionModuleService } from './ActaRecepcionModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';
import { useNavigate } from 'react-router-dom';
import { RUTAS } from 'constants/routes';



export const ActaRecepcionModule = (): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();
    const navigate = useNavigate();

    const [loading, setLoading] = useState<string>("");
    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openActaRecepcionForm, setOpenActaRecepcionForm] = useState(false);
    const [formModel, setFormModel] = useState<ActaRecepcionFormModel>();

    const handleClickView = async (id_acta: string) => {
        const actaFormResponse = await ActaRecepcionModuleService.getActaRecepcionFormData(id_acta);
        if (!actaFormResponse.success) return notify.error(actaFormResponse.msg);
        const newFormModel = actaFormResponse.data;
        setFormModel(newFormModel);
        setOpenActaRecepcionForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_acta: string) => {
        const actaFormResponse = await ActaRecepcionModuleService.getActaRecepcionFormData(id_acta);
        if (!actaFormResponse.success) return notify.error(actaFormResponse.msg);
        const newFormModel = actaFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    const handleClickSellar = async (id_acta: string) => {
        setLoading(id_acta);
        setOpen1(true);
    };

    const handleClickImprimir = async (data: ActaRecepcionTableModel) => {
        if (loading) return;
        if (!isMounted()) return
        setLoading(data.id);
        return ActaRecepcionModuleService.getReportPDF(data.id, data.cod_acta).then(() => {
            setLoading("");
        });
    };

    const tableRef1 = useRef<ActaRecepcionTableRefProps>(null);
    const [open1, setOpen1] = useState<boolean>(false);

    return (
        <>
            <ConfirmDialog
                    title={'Confirmar'}
                    message={'¿Esta seguro que quiere sellar el acta de recepcion?'}
                    open={open1}
                    onAccept={async () => {
                        setOpen1(false);
                        const actaFormResponse = await ActaRecepcionModuleService.getActaRecepcionSellar(loading);
                        if(actaFormResponse.success) notify.success('Se actualizo exitosamente'); else notify.error(actaFormResponse.msg);
                        tableRef1.current?.refresh();
                        setLoading("");
                    }}
                    onCancel={() => { isMounted() && setOpen1(false); tableRef1.current?.refresh(); setLoading("");}}
            />
            <ActaRecepcionFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef1.current?.refresh();
                }}
            />
            <ActaRecepcionDialog
                open={openActaRecepcionForm}
                onComplete={() => {
                    setOpenActaRecepcionForm(false);
                }}
                formModel={formModel}
            />
            <ActaRecepcionTable
                ref={tableRef1}
                onViewClick={handleClickView}
                onAddClick={handleClickAdd}
                onEditClick={handleClickEdit}
                onSellarClick={handleClickSellar}
                onImprimirClick={handleClickImprimir}
                onDetalleClick={(idActaRecepcion) => navigate({
                    pathname: RUTAS.acta_recepcion_detalle.getPath({ id: idActaRecepcion})
                })}
                loading={loading}
            />
        </>
    );
};
