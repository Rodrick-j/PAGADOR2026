import React, { ReactElement } from 'react';
import * as yup from 'yup';
//@mui
import { FormGroup, FormDialog, FormValue, SelectOption } from 'components/core/FormDialog';

import { RutasModuleService } from '../RutasModuleService';

import { useNotify } from 'services/notify';
import { ENUM_COLOR } from 'constants/colors';
import { ENUM_SINO } from 'constants/enums';

export type RutaFormModel = {
    id?: number;
    name: string;
    path: string;
    title: string;
    icon: string;
    color: string;
    is_client: boolean | null;

    _createdBy?: string;
    _createdAt?: string;
    _updatedBy?: string;
    _updatedAt?: string;
};


type Props = {
    open: boolean;
    formModel?: RutaFormModel;
    onComplete: () => void;
};

export const RutaFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const colorOptions: SelectOption[] = ENUM_COLOR;
    const clientOptions: SelectOption[] = ENUM_SINO;
    
    const formLayout: FormGroup<RutaFormModel>[] = [        
        {
            title: '',
            grid: [
                [   
                    { name: 'title', label: 'Titulo', type: 'text', infoText: 'ej. Ruta'},
                    { name: 'name', label: 'Nombre del Ruta', type: 'text', infoText: 'ej. ruta' }
                ],
                [
                    { name: 'path', label: 'Ruta', type: 'text', infoText: 'ej. /dashboard/ruta'},
                    { name: 'icon', label: 'Icono', type: 'text', infoText: 'ej. file-icons:default  | sacar de: https://icon-sets.iconify.design/'},
                ],
                [                    
                    { name: 'color', label: 'Color', type: 'select', options: colorOptions}, 
                    { name: 'is_client', label: 'Es Cliente', type: 'radio-group', options: clientOptions, inlineDisplay: true }, 
                    
                ],
            ]
        }
    ];

    const validationSchema = yup
        .object({
            name  : yup.string().required(),
            path    : yup.string().required(),
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        let result = { success: false, msg: 'Error de Guardado' };
        const isEdit = typeof formModel !== 'undefined';
        isEdit ? (result = await RutasModuleService.updateRuta(formData as RutaFormModel)) 
            : (result = await RutasModuleService.createRuta(formData as RutaFormModel));     
        if (!result.success) return notify.error(result.msg);
        notify.success(isEdit ? 'Rol modificado exitosamente' : 'Rol creado exitosamente');
        return onComplete();
    };

    const handleCancel = () => {
        onComplete();
    };

    const zeroValues: RutaFormModel = {       
        name: '',
        path: '',
        title: '',
        icon: '',
        color: '',
        is_client: null,
    };

    const newFormModel = formModel && {
        id       : formModel.id,
        name: formModel.name,
        path: formModel.path,
        title: formModel.title,
        icon: formModel.icon,
        color: formModel.color       
    };

    return (
        <FormDialog
            addTitle="Agregar ruta"
            editTitle="Editar ruta"
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
