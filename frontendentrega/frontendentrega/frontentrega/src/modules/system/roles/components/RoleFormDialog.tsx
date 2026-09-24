import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
//@mui
import { SelectOption, FormGroup, FormDialog, FormValue } from 'components/core/FormDialog';

import { RolesModuleService } from '../RolesModuleService';

import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';

import { ENUM_PERMISOS } from 'constants/enums';

export type RoleFormModel = {
    id?: number;
    nombre: string;
    tipo: string;
    permisos: string;
    modulos: string[];

    _createdBy?: string;
    _createdAt?: string;
    _updatedBy?: string;
    _updatedAt?: string;
};

type optionsFormModel = {
    id: string;
    nombre: string;
}

type Props = {
    open: boolean;
    formModel?: RoleFormModel;
    onComplete: () => void;
};

export const RoleFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();
    
    const [modulos, setModulos] = useState<optionsFormModel[]>([]);

    const permisosOptions: SelectOption[] = ENUM_PERMISOS;
    const modulosOptions: SelectOption[] = modulos.map((item: optionsFormModel) => ({ value: item.nombre || '', label: item.nombre }));
    
    const formLayout: FormGroup<RoleFormModel>[] = [        
        {
            title: '',
            grid: [
                [{ name: 'nombre', label: 'Nombre del Rol', type: 'text' }],
                [{ name: 'tipo', label: 'Rol', type: 'text', disabled: true }],
                [
                    { name: 'permisos', label: 'Permisos', type: 'multiselect', options: permisosOptions },
                    { name: 'modulos', label: 'Modulos', type: 'multiselect', options: modulosOptions }
                ],                
            ]
        }
    ];

    const validationSchema = yup
        .object({
            nombre  : yup.string().required(),
            permisos: yup.array().of(yup.string().required()).required(),
            modulos : yup.array().of(yup.string().required()).required(),
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        let result = { success: false, msg: 'Error de Guardado' };
        const isEdit = typeof formModel !== 'undefined';
        isEdit ? (result = await RolesModuleService.updateRole(formData as RoleFormModel)) 
            : (result = await RolesModuleService.createRole(formData as RoleFormModel));     
        if (!result.success) return notify.error(result.msg);
        notify.success(isEdit ? 'Rol modificado exitosamente' : 'Rol creado exitosamente');
        return onComplete();
    };

    const handleCancel = () => {
        onComplete();
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!isMounted()) return;
            const resultRutas = await RolesModuleService.getAllRutas();
            if (!resultRutas || !resultRutas.success) return;
            const newRutas = resultRutas.rows || [];
            if (isMounted()) setModulos(newRutas); //Asignamos los valores de las rutas para crear los modulos
        };
        if (open) {
            fetchData();
        }
    }, [open, isMounted, formModel]);
    
    const zeroValues: RoleFormModel = {       
        nombre  : '',
        tipo    : '',
        permisos: '',
        modulos : [],
    };

    const newFormModel = formModel && {
        id       : formModel.id,
        nombre   : formModel.nombre,
        tipo     : formModel.tipo,
        permisos : formModel.permisos,
        modulos  : formModel.modulos,
    };

    return (
        <FormDialog
            addTitle="Agregar role"
            editTitle="Editar role"
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
