import React, { ReactElement } from 'react';
import * as yup from 'yup';
import { SelectOption, FormGroup, FormDialog, FormValue } from 'components/core/FormDialog';
import { CargoModuleService } from '../CargoModuleService';
import { useNotify } from 'services/notify';
import { ENUM_GESTION, ENUM_SINO, ENUM_TIPO_CARGO } from 'constants/enums';

export type CargoFormModel = {
    id?: number;
    nombre           : string;
    item             : string;
    gestion_creacion : string;
    tipo             : string;
    salario          : number;
    libre            : boolean;
    nivel            : number;
    activo           : boolean;

    _createdBy?: string;
    _createdAt?: string;
    _updatedBy?: string;
    _updatedAt?: string;
};

type Props = {
    open: boolean;
    formModel?: CargoFormModel;
    onComplete: () => void;
};


export const CargoFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();

    const gestionOptions: SelectOption[] = ENUM_GESTION;
    const tipoOptions: SelectOption[] = ENUM_TIPO_CARGO;
    const libreOptions: SelectOption[] = ENUM_SINO;

    const formLayout: FormGroup<CargoFormModel>[] = [
        {
            title: '',
            grid: [
                [{ name: 'nombre', label: 'Nombre del Cargo', type: 'text' }],
                [
                    { name: 'item', label: 'Num. Item', type: 'text' },
                    { name: 'gestion_creacion', label: 'Gestion', type: 'select', options: gestionOptions },
                ],
                [
                    { name: 'tipo', label: 'Tipo', type: 'select', options: tipoOptions },
                    { name: 'salario', label: 'Salario', type: 'text' },
                ],
                [
                    { name: 'libre', label: 'Libre', type: 'radio-group', options: libreOptions, inlineDisplay: true },
                    { name: 'nivel', label: 'Nivel', type: 'text' },
                ],
            ]
        }
    ];

    const validationSchema = yup
        .object({
            nombre: yup.string().required(),
            item: yup.string().required(),
            tipo: yup.string().required(),
            salario: yup.number().required(),
            nivel: yup.number().required(),
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await CargoModuleService.createOrUpdateCargo(formData as unknown as CargoFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        return onComplete();
    };

    const handleCancel = () => {
        onComplete();
    };

    const zeroValues: CargoFormModel = {
        nombre           : '',
        item             : '',
        gestion_creacion : '',
        tipo             : '',
        salario          : 0,
        libre            : false,
        nivel            : 0,
        activo           : true,
    };

    const newFormModel = formModel && {
        id: formModel.id,
        nombre           : formModel.nombre,
        item             : formModel.item,
        gestion_creacion : formModel.gestion_creacion,
        tipo             : formModel.tipo,
        salario          : formModel.salario,
        libre            : formModel.libre,
        nivel            : formModel.nivel,
    };

    return (
        <FormDialog
            addTitle="Agregar cargo"
            editTitle="Editar cargo"
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
