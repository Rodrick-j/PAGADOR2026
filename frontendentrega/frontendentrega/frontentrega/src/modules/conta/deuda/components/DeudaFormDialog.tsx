import React, { ReactElement } from 'react';
import * as yup from 'yup';
import { FormGroup, FormDialog, FormValue } from 'components/core/FormDialog';
import { DeudaModuleService } from '../DeudaModuleService';
import { useNotify } from 'services/notify';

export type DeudaFormModel = {
    id?         : number;
    cod_activo  : string;
    titulo      : string;
    descripcion : string;
    gestion_deuda : string;
    monto_deuda : number;
    cuenta_id   : string;

    _createdBy?: string;
    _createdAt?: string;
    _updatedBy?: string;
    _updatedAt?: string;
};

type Props = {
    open: boolean;
    formModel?: DeudaFormModel;
    onComplete: () => void;
    cuentaId: string;
};

export const DeudaFormDialog = ({ open, formModel, onComplete, cuentaId }: Props): ReactElement => {
    const notify = useNotify();

    const formLayout: FormGroup<DeudaFormModel>[] = [
        {
            title: 'Datos del Adeudado',
            grid: [
                [
                    { name: 'titulo', label: 'Titulo Deuda', type: 'text' },
                ],
                [
                    //  { name: 'cod_activo', label: 'Codigo de Deuda', type: 'text', infoText: 'ej. 05-12345' },
                    { name: 'monto_deuda', label: 'Monto de la Deuda', type: 'text', infoText: 'ej. 250' },
                    { name: 'gestion_deuda', label: 'Gestion de la Deuda', type: 'text', infoText: 'ej. 2021, 2022, 2023' },
                  ],
                [
                    { name: 'descripcion', label: 'Descripcion Deuda', type: 'textarea', rows: 3 },
                ]
            ]
        }
    ];

    const validationSchema = yup
        .object({
            cod_activo : yup.string(),
            titulo     : yup.string().required(),
            descripcion: yup.string().required(),
            cuenta_id  : yup.string().required(),
            gestion_deuda: yup.string().required(),
            monto_deuda : yup.number().required(),
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await DeudaModuleService.createOrUpdateDeuda(formData as unknown as DeudaFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        return onComplete();
    };

    const handleCancel = () => {
        onComplete();
    };

    const zeroValues: DeudaFormModel = {
        cod_activo   : '',
        titulo       : '',
        descripcion  : '',
        gestion_deuda: '',
        monto_deuda  : 0,
        cuenta_id    : cuentaId,
    };

    const newFormModel = formModel && {
        id           : formModel.id,
        cod_activo   : formModel.cod_activo,
        titulo       : formModel.titulo,
        descripcion  : formModel.descripcion,
        gestion_deuda: formModel.gestion_deuda,
        monto_deuda  : formModel.monto_deuda,
        cuenta_id    : formModel.cuenta_id,
    };

    return (
        <FormDialog
            addTitle="Agregar Solicitud Cuenta"
            editTitle="Editar Solicitud Cuenta"
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

