import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
import { SelectOption, FormGroup, FormDialog, FormValue } from 'components/core/FormDialog';
import { UsersModuleService } from '../UsersModuleService';
import { ENUM_GENERO, ENUM_SINO } from 'constants/enums';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';
import { isEmailValidTest, isNumberValidTest, isPhoneNumberValidTest } from 'components/core/FormDialog/yup-tests';
import { RolesModuleService } from 'modules/system/roles';

export type UsuarioFormModel = {
    id?              : number;
    username         : string;
    password         : string;
    ci               : number;
    email            : string;
    nombre           : string;
    primer_apellido? : string;
    segundo_apellido?: string;
    direccion?       : string;
    is_jefe?         : boolean;
    telefono         : string;
    genero           : string;
    role_id          : string;
};

type optionsFormModel = {
    id: string;
    nombre: string;
}

type Props = {
    open: boolean;
    formModel?: UsuarioFormModel;
    onComplete: () => void;
};

export const UserFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();

    const generoOptions: SelectOption[] = ENUM_GENERO;
    const esjefeOptions: SelectOption[] = ENUM_SINO;

    const [roles, setRoles] = useState<optionsFormModel[]>([]);
    const rolesOptions: SelectOption[] = roles.map((item: optionsFormModel) => ({ value: item.id || '', label: item.nombre }));


    const formLayout: FormGroup<UsuarioFormModel>[] = [
        {
            title: 'Datos de usuario',
            grid: [
                typeof formModel === 'undefined'
                    ? [
                          { name: 'email', label: 'Correo electrónico', type: 'text' },
                          { name: 'password', label: 'Contraseña', type: 'password' }
                      ]
                    : [
                          { name: 'email', label: 'Correo electrónico', type: 'text' },
                          { name: 'password', label: 'Contraseña', type: 'password', disabled: true }
                      ],
                [
                    { name: 'ci', label: 'Carnet Identidad', type: 'text' },
                    { name: 'role_id', label: 'Rol', type: 'autocomplete', options: rolesOptions },
                ]
            ]
        },
        {
            title: 'Datos personales',
            grid: [
                [
                    { name: 'nombre', label: 'Nombre(s)', type: 'text' },
                    { name: 'primer_apellido', label: 'Primer apellido', type: 'text' },
                    { name: 'segundo_apellido', label: 'Segundo apellido', type: 'text' }
                ],
                [{ name: 'direccion', label: 'Dirección', type: 'text', rows: 2 }],
                [
                    { name: 'telefono', label: 'Teléfono', type: 'text' },
                    { name: 'genero', label: 'Genero', type: 'select', options: generoOptions },
                    { name: 'is_jefe', label: 'Es Jefe', type: 'radio-group', options: esjefeOptions, inlineDisplay: true }
                ]
            ]
        }
    ];

    const validationSchema = yup
        .object({
            password        : yup.string().min(6),
            email           : yup.string().required().test(isEmailValidTest()),
            ci              : yup.string().required().test(isNumberValidTest()),
            nombre          : yup.string().required(),
            primer_apellido : yup.string().required(),
            segundo_apellido: yup.string(),
            direccion       : yup.string(),
            telefono        : yup.string().required().test(isPhoneNumberValidTest()),
            genero          : yup.string().required(),
            role_id         : yup.string().required(),
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        let result = { success: false, msg: 'Error de Guardado' };
        const isEdit = typeof formModel !== 'undefined';
        isEdit ? (result = await UsersModuleService.updateUser(formData as UsuarioFormModel))
            : (result = await UsersModuleService.createUser(formData as UsuarioFormModel));
        if (!result.success) return notify.error(result.msg);
        notify.success(isEdit ? 'Usuario modificado exitosamente' : 'Usuario creado exitosamente');
        return onComplete();
    };

    const handleCancel = () => {
        onComplete();
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!isMounted()) return;
            const resultRoles = await RolesModuleService.getAllRoles();
            if (!resultRoles || !resultRoles.success) return;
            const newRoles = resultRoles.rows || [];
            if (isMounted()) setRoles(newRoles);
        };
        if (open) {
            fetchData();
        }
    }, [open, isMounted, formModel]);

    const zeroValues: UsuarioFormModel = {
        username        : 'autogenerated',
        password        : '',
        ci              : 0,
        email           : '',
        nombre          : '',
        primer_apellido : '',
        segundo_apellido: '',
        direccion       : '',
        telefono        : '',
        is_jefe         : false,
        genero          : '',
        role_id         : '',
    };

    return (
        <FormDialog
            addTitle="Agregar usuario"
            editTitle="Editar usuario"
            open={open}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialValues={formModel || zeroValues}
            formLayout={formLayout}
            validationSchema={validationSchema}
            isEdit={typeof formModel !== 'undefined'}
        />
    );
};
