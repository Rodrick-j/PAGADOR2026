import React, { ReactElement, useState, useRef, useEffect } from 'react';
import {useParams} from 'react-router-dom';
// @mui

// components

//services
import { ActividadModuleService } from './ActividadModuleService';
import { ActividadDetalleTable, ActividadTableRefProps } from './components/ActividadDetalleTable';

import { useIsMounted } from 'hooks/useIsMounted';
import { useNotify } from 'services/notify';
import { ActividadFormDialog, ActividadFormModel } from './components/ActividadFormDialog';
import ActividadDialog from './components/ActividadDialog';

export type actividadProps = {
    titulo                   : string;
    descripcion              : string;
    paso                     : number;
    tiempo                   : string;
    notificacion             : boolean;
    notificacion_solicitante?: boolean;
    observacion              : string;
    estado                   : string;
    fecha                    : Date;
    fecha_envio?             : Date;
    usuario_id?              : string;
    proceso_id?              : string;
}

export const ActividadDetalleModule = (): ReactElement => {
    const notify = useNotify();
    const params = useParams();
    const isMounted = useIsMounted();
    const ID_PROCESO = params.id || '';

    const [ActividadData, setActividadData] = useState<actividadProps>();
    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [openActividadForm, setOpenActividadForm] = useState(false);

    const [formModel, setFormModel] = useState<ActividadFormModel>();

    const tableRef = useRef<ActividadTableRefProps>(null);

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickView = async (id_deuda: string) => {
        const actividadFormResponse = await ActividadModuleService.getActividadFormData(id_deuda);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setOpenActividadForm(true);
    };

    const handleClickEdit = async (id_deuda: string) => {
        const actividadFormResponse = await ActividadModuleService.getActividadFormData(id_deuda);
        if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
        const newFormModel = actividadFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };


    /* useEffect(() => {
        const fetchData = async () => {
            if (!isMounted()) return;
            const actividadFormResponse = await ActividadModuleService.getTableActividadDetalle(ID_PROCESO);
            if (!actividadFormResponse.success) return notify.error(actividadFormResponse.msg);
            const newFormModel: ActividadFormModel | null = actividadFormResponse.data || null;
            if (isMounted()) {
                if (newFormModel !== null)
                    setActividadData(newFormModel);
            }
        };
        if(ID_PROCESO) fetchData();
    }, [ID_PROCESO]); */

    return (
        <>
            <ActividadFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef.current?.refresh();
                }}
            />
            <ActividadDialog
                open={openActividadForm}
                onComplete={() => {
                    setOpenActividadForm(false);
                }}
                formModel={formModel}
            />
            <ActividadDetalleTable
                ref={tableRef}
                onViewClick={handleClickView}
                onAddClick={handleClickAdd}
                onEditClick={handleClickEdit}
                procesoId={ID_PROCESO}
            />
        </>
    );
};
