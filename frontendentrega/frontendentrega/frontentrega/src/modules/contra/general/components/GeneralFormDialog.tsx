import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
import { FormGroup, FormDialog, FormValue, SelectOption } from 'components/core/FormDialog';
import { GeneralModuleService } from '../GeneralModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';

import { ENUM_TIPO_CONTRA } from 'constants/enums';
import { OptionsFormModel } from 'modules/Types';
import { UsersModuleService } from 'modules/system/users';

export type GeneralFormModel = {
    id        ?: number;
    nombre     : string;
    tiempo     : string;
    tipo       : string;
    paso       : number;
    usuario_id : string;

    _createdBy?: string;
    _createdAt?: string;
    _updatedBy?: string;
    _updatedAt?: string;
};

type Props = {
    open: boolean;
    formModel?: GeneralFormModel;
    onComplete: () => void;
};


export const GeneralFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();

    const tipoOptions: SelectOption[] = ENUM_TIPO_CONTRA;
    
    const [usuarios, setUsuarios] = useState<OptionsFormModel[]>([]);
    const usuariosOptions: SelectOption[] = usuarios.map((item: OptionsFormModel) => ({ value: item.id || '', label: item.nombre }));
   
    const formLayout: FormGroup<GeneralFormModel>[] = [        
        {
            title: '',
            grid: [
                [{ name: 'nombre', label: 'Nombre de la Actividad', type: 'text' }],
                [{ name: 'tipo', label: 'Tipo', type: 'select', options: tipoOptions  }],
                [
                    { name: 'tiempo', label: 'Tiempo', type: 'text', infoText: 'ej. 2d-8h-3m-15s' },
                    { name: 'paso', label: 'Paso', type: 'text', infoText: 'ej. 3' },
                ], 
                [{ name: 'usuario_id', label: 'Usuario', type: 'autocomplete', options: usuariosOptions }],
            ]
        }
    ];

    const validationSchema = yup
        .object({
            nombre: yup.string().required(),
            tiempo: yup.string().required(),
            tipo  : yup.string().required(),
            paso  : yup.number().required(),
            usuario_id  : yup.string().required(),
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await GeneralModuleService.createOrUpdateGeneral(formData as unknown as GeneralFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        return onComplete();
    };

    const handleCancel = () => {
        onComplete();
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!isMounted()) return;
            const resultPersonal = await UsersModuleService.getAllUsuarios();
            if (!resultPersonal || !resultPersonal.success) return;
            const newPersonals = resultPersonal.rows || [];
            if (isMounted()) setUsuarios(newPersonals);
        };
        if (open) {
            fetchData();
        }
    }, [open, isMounted, formModel]);

    const zeroValues: GeneralFormModel = {
        nombre: '',
        tiempo: '',
        tipo  : '',
        paso  : 0,
        usuario_id  : '',
    };

    const newFormModel = formModel && {
        id    : formModel.id,
        nombre: formModel.nombre,
        tiempo: formModel.tiempo,
        tipo  : formModel.tipo,
        paso  : formModel.paso,
        usuario_id  : formModel.usuario_id,
    };

    return (
        <FormDialog
            addTitle="Agregar General"
            editTitle="Editar General"
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
