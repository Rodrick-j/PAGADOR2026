import React, { ReactElement, useState, useRef } from 'react';
// @mui

// components
import { ActaFormDialog, ActaFormModel } from './components/ActaFormDialog';
import { ActaTable, ActaTableModel, ActaTableRefProps } from './components/ActaTable';
import ActaDialog from './components/ActaDialog';
//services
import { ActaModuleService } from './ActaModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';

export type documentoProps = {
    nombre_deudor           : string;
    tipo_documento             : string;
    ci                      : string;
    gestion_generacion_acta: string;
    documentacion_respaldo  : string;
    direccion_domicilio     : string;
    telefono_celular        : string;
    confirmacion            : string;
    descripcion_confirmacion: string;
    incremento_acta        : string;
    monto_incremento_acta  : number;
    depositos_realizados    : string;
    observacion             : string;
    saldo                   : number;
    descripcion_deuda       : string;
    estado_proceso          : string;
}

export const ActaModule = (): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();

    const [loading, setLoading] = useState<string>("");
    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openActaForm, setOpenActaForm] = useState(false);
    const [formModel, setFormModel] = useState<ActaFormModel>();

    const handleClickView = async (id_acta: string) => {
        const actaFormResponse = await ActaModuleService.getActaFormData(id_acta);
        if (!actaFormResponse.success) return notify.error(actaFormResponse.msg);
        const newFormModel = actaFormResponse.data;
        setFormModel(newFormModel);
        setOpenActaForm(true);
    };

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_acta: string) => {
        const actaFormResponse = await ActaModuleService.getActaFormData(id_acta);
        if (!actaFormResponse.success) return notify.error(actaFormResponse.msg);
        const newFormModel = actaFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    const handleClickImprimir = async (data: ActaTableModel) => {
        if (loading) return;
        if (!isMounted()) return
        setLoading(data.id);
        return ActaModuleService.getReportPDF(data.id, data.tipo, data.cod_acta).then(() => {
            setLoading("");
        });
    };

    const handleClickDevolucion = async (data: ActaTableModel) => {
        if (!isMounted()) return;
        const result = await ActaModuleService.devolverActa(data.id);
        if (!result.success) return notify.error(result.msg);
        const responseData = result.data as { msg?: string } | undefined;
        notify.success(responseData?.msg || result.msg);
        tableRef1.current?.refresh();
    };

    const tableRef1 = useRef<ActaTableRefProps>(null);

    return (
        <>
            <ActaFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef1.current?.refresh();
                }}
            />
            <ActaDialog
                open={openActaForm}
                onComplete={() => {
                    setOpenActaForm(false);
                }}
                formModel={formModel}
            />
            <ActaTable
                ref={tableRef1}
                onViewClick={handleClickView}
                onAddClick={handleClickAdd}
                onEditClick={handleClickEdit}
                onImprimirClick={handleClickImprimir}
                 onDevolucionClick={handleClickDevolucion}
                loading={loading}
            />
        </>
    );
};
