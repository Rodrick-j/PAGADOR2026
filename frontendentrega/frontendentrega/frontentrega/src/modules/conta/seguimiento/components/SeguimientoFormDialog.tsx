import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
import { FormGroup, FormDialog, FormValue } from 'components/core/FormDialog';
import { SeguimientoModuleService } from '../SeguimientoModuleService';
import { useNotify } from 'services/notify';

export type SeguimientoFormModel = {
    id?        : number;
    fecha      : Date;
    descripcion: string;
    observacion: string;
    dias       : number;
    estado     : boolean;
    adjuntos?  : string;
    cuenta_id  : string;
};

type Props = {
    open       : boolean;
    formModel ?: SeguimientoFormModel;
    onComplete : () => void;
    cuentaId   : string;
};


export const SeguimientoFormDialog = ({ open, formModel, onComplete, cuentaId }: Props): ReactElement => {
    const notify = useNotify();

    const formLayout: FormGroup<SeguimientoFormModel>[] = [
        {
            title: 'Datos del Seguimento',
            grid: [
                [
                    { name: 'fecha', label: 'Fecha Registro', type: 'date' },
                    { name: 'dias', label: 'Dias Alerta', type: 'text' },
                    { type:'empty'}
                 ],
                [ { name: 'descripcion', label: 'Descripcion', type: 'textarea' ,rows:2 } ],
                [ { name: 'observacion', label: 'Observacion', type: 'textarea', rows: 2 } ],
                [ { name: 'adjuntos', label: 'Adjunto', type: 'dropzone' } ]
            ]
        }
    ];

    const validationSchema = yup
                            .object({
                                fecha      : yup.date().required(),
                                dias       : yup.number().required(),
                                descripcion: yup.string().required(),
                                observacion: yup.string().required(),
                                adjuntos   : yup.string(),
                            })
                            .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await SeguimientoModuleService.createOrUpdateSeguimiento(formData as unknown as SeguimientoFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        return onComplete();
    };

    const handleCancel = () => {
        onComplete();
    };

    const zeroValues: SeguimientoFormModel = {
        fecha      : new Date(),
        dias       : 0,
        descripcion: '',
        observacion: '',
        adjuntos   : '[]',
        estado     : true,
        cuenta_id  : cuentaId,
    };

    const newFormModel = formModel && {
        id         : formModel.id,
        fecha      : formModel.fecha,
        dias       : formModel.dias,
        descripcion: formModel.descripcion,
        observacion: formModel.observacion,
        adjuntos   : formModel?.adjuntos || '[]',
        estado     : formModel.estado,
        cuenta_id  : formModel.cuenta_id
    };

    return (
        <FormDialog
            addTitle="Agregar Seguimiento"
            editTitle="Editar Seguimiento"
            open={open}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialValues={newFormModel || zeroValues}
            formLayout={formLayout}
            validationSchema={validationSchema}
            isEdit={typeof formModel !== 'undefined'}
        />
    );
};
