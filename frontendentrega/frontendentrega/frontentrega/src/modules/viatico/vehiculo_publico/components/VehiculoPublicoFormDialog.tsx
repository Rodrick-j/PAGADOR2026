import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
import { SelectOption, FormGroup, FormDialog, FormValue } from 'components/core/FormDialog';
import { VehiculoPublicoModuleService } from '../VehiculoPublicoModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';

import { ENUM_SINO_2 } from 'constants/enums';
import { OptionsFormModel } from 'modules/Types';

export type VehiculoPublicoFormModel = {
    id?             : number;
    razon_social    : string;
    num_boleto      : number;
    placa           : string;
    tipo_vehiculo   : string;
    precio_boleto   : number;

    _createdBy?: string;
    _createdAt?: string;
    _updatedBy?: string;
    _updatedAt?: string;
};

type Props = {
    open: boolean;
    formModel?: VehiculoPublicoFormModel;
    onComplete: () => void;
};

export const VehiculoPublicoFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();

    const padreOptions: SelectOption[] = ENUM_SINO_2;

    const [areas, setVehiculoPublicos] = useState<OptionsFormModel[]>([]);
    //Cambiar la parte de areas
    const areasOptions: SelectOption[] = areas.map((item: OptionsFormModel) => ({ value: item.id || '', label: item.nombre }));

    const formLayout: FormGroup<VehiculoPublicoFormModel>[] = [
        {
            title: '',
            grid: [
                [{ name: 'razon_social', label: 'Razon Social del Vehiculo', type: 'text', infoText: 'ej. Trans NASER' }],
                [
                    { name: 'num_boleto', label: 'Numero del Boleto', type: 'text', infoText: 'ej. 545521' }, //type: 'autocomplete', options: areasOptions
                    { name: 'placa', label: 'Placa del Vehiculo', type: 'text', infoText: 'ej. DGD-2424' }
                ],
                [
                    { name: 'tipo_vehiculo', label: 'Tipo de vehiculo', type: 'text', infoText: 'ej. Omnibus, minibus' },
                    { name: 'precio_boleto', label: 'Precio del Boleto', type: 'text', infoText: 'ej. 30 Bs.' }
                ]
            ]
        }
    ];

    const validationSchema = yup
        .object({
            razon_social    : yup.string().required(),
            num_boleto      : yup.number().required(),
            placa           : yup.string().required(),
            tipo_vehiculo   : yup.string().required(),
            precio_boleto   : yup.number().required()
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await VehiculoPublicoModuleService.createOrUpdateVehiculoPublico(formData as unknown as VehiculoPublicoFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        return onComplete();
    };

    const handleCancel = () => {
        onComplete();
    };

    const zeroValues: VehiculoPublicoFormModel = {
        razon_social    : '',
        num_boleto      : 0,
        placa           : '',
        tipo_vehiculo   : '',
        precio_boleto   : 0
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!isMounted()) return;
            const resultVehiculoPublico = await VehiculoPublicoModuleService.getAllVehiculoPublico();
            if (!resultVehiculoPublico || !resultVehiculoPublico.success) return;
            const newVehiculoPublicos = resultVehiculoPublico.rows || [];
            if (isMounted()) setVehiculoPublicos(newVehiculoPublicos);
        };
        if (open) {
            fetchData();
        }
    }, [open, isMounted, formModel]);

    const newFormModel = formModel && {
        id              : formModel.id,
        razon_social    : formModel.razon_social,
        num_boleto      : formModel.num_boleto,
        placa           : formModel.placa,
        tipo_vehiculo   : formModel.tipo_vehiculo,
        precio_boleto   : formModel.precio_boleto
    };

    return (
        <FormDialog
            addTitle="Agregar Vehiculo Publico"
            editTitle="Editar Vehiculo Publico"
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
