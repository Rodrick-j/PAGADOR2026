import React, { ReactElement, useState, useEffect, useRef } from 'react';
// @mui

// components

//services
import { useNotify } from 'services/notify';
import {useParams} from 'react-router-dom';

import { ActaRecepcionDetalleFormDialog, ActaRecepcionDetalleFormModel } from './components/ActaRecepcionDetalleFormDialog';
import { ActaRecepcionDetalleTable, ActaRecepcionDetalleTableRefProps } from './components/ActaRecepcionDetalleTable';
import { ActaRecepcionDetalleModuleService } from './ActaRecepcionDetalleModuleService';


export type ActaRecepcionDetalleProps = {
    id?: string;
    titulo                  : string;
    subtitulo               : string;
    descripcion             : string;
    tiempo                  : string;
    notificacion            : boolean;
    notificacion_solicitante: boolean;
    observacion             : string;
    fecha                   : string;
    fecha_limite            : string;
    type                    : string;
    fecha_envio             : string;
    imagen                  : string;
    estado                  : string;

    usuario_id  : string;
    proceso_id  : string;
}

export const ActaRecepcionDetalleModule = (): ReactElement => {
    const params = useParams();
    const notify = useNotify();

    const ID_ACTA_RECEPCION = params.id || '';

    const [formOpen, setFormOpen] = useState<boolean>(false);

    const [formModel, setFormModel] = useState<ActaRecepcionDetalleFormModel>();

    const tableRef1 = useRef<ActaRecepcionDetalleTableRefProps>(null);

    const handleClickAdd = async () => {
        setFormModel(undefined);
        setFormOpen(true);
    };

    const handleClickEdit = async (id_acta_recepcion_detalle: string) => {
        const actaFormResponse = await ActaRecepcionDetalleModuleService.getActaRecepcionDetalleFormData(id_acta_recepcion_detalle);
        if (!actaFormResponse.success) return notify.error(actaFormResponse.msg);
        const newFormModel = actaFormResponse.data;
        setFormModel(newFormModel);
        setFormOpen(true);
    };

    return (
        <>
            <ActaRecepcionDetalleFormDialog
                open={formOpen}
                formModel={formModel}
                onComplete={() => {
                    setFormOpen(false);
                    tableRef1.current?.refresh();
                }}
                actaRecepcionId={ID_ACTA_RECEPCION}
            />
            <ActaRecepcionDetalleTable
                ref={tableRef1}
                onAddClick={handleClickAdd}
                onEditClick={handleClickEdit}
                actaRecepcionId={ID_ACTA_RECEPCION}
            />
        </>
    );
};
