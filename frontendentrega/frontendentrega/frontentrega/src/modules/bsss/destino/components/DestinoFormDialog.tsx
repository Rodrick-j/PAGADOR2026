import React, { ReactElement } from 'react';
import * as yup from 'yup';
import { FormGroup, FormDialog, FormValue } from 'components/core/FormDialog';
import { DestinoModuleService } from '../DestinoModuleService';
import { useNotify } from 'services/notify';

export type DestinoFormModel = {
    id?: number;
    nombre   : string;
    distancia: string;
    litros   : string;
};

type Props = {
    open: boolean;
    formModel?: DestinoFormModel;
    onComplete: () => void;
};


export const DestinoFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();

    const formLayout: FormGroup<DestinoFormModel>[] = [
        {
            title: '',
            grid: [
                [{ name: 'nombre', label: 'Nombre del Destino', type: 'text' }],
                [
                    { name: 'distancia', label: 'Distancia Km. (aprox)', type: 'text' },
                    { name: 'litros', label: 'Litros (aprox)', type: 'text' },
                ],
            ]
        }
    ];

    const validationSchema = yup
        .object({
            nombre   : yup.string().required(),
            distancia: yup.number().required(),
            litros   : yup.number().required(),
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await DestinoModuleService.createOrUpdateDestino(formData as unknown as DestinoFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        return onComplete();
    };

    const handleCancel = () => {
        onComplete();
    };

    const zeroValues: DestinoFormModel = {
        nombre   : '',
        distancia: '',
        litros   : '',
    };

    const newFormModel = formModel && {
        id       : formModel.id,
        nombre   : formModel.nombre,
        distancia: formModel.distancia,
        litros   : formModel.litros,
    };

    return (
        <FormDialog
            addTitle="Agregar destino"
            editTitle="Editar destino"
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
