import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
import { SelectOption, FormGroup, FormDialog, FormValue } from 'components/core/FormDialog';
import { AreaModuleService } from '../AreaModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';

import { ENUM_SINO_2 } from 'constants/enums';
import { OptionsFormModel } from 'modules/Types';

export type AreaFormModel = {
    id      ?: number;
    sigla    : string;
    nombre   : string;
    indice    : string;
    padre    : number;
    activo   : boolean;
    area_id? : string | null;
};

type Props = {
    open: boolean;
    formModel?: AreaFormModel;
    onComplete: () => void;
};



export const AreaFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();

    const padreOptions: SelectOption[] = ENUM_SINO_2;

    const [areas, setAreas] = useState<OptionsFormModel[]>([]);
    const areasOptions: SelectOption[] = areas.map((item: OptionsFormModel) => ({ value: item.id || '', label: item.nombre }));

    const formLayout: FormGroup<AreaFormModel>[] = [
        {
            title: '',
            grid: [
                [{ name: 'nombre', label: 'Nombre del Proyecto/Programa/etc.', type: 'text', infoText: 'ej. Proyecto departamental' }],
                [{ name: 'area_id', label: 'Stria./Direccion/Unidad/Area', type: 'autocomplete', options: areasOptions }],
                [
                    { name: 'sigla', label: 'Sigla', type: 'text', infoText: 'ej. SDPD' },
                    { name: 'indice', label: 'Indice', type: 'text', infoText: 'ej. 0.1.1 (GADOR.SPDP.ATI)' },
                    { name: 'padre', label: 'Padre', type: 'radio-group', options: padreOptions, inlineDisplay: true },
                ]
            ]
        }
    ];

    const validationSchema = yup
        .object({
            nombre: yup.string().required(),
            sigla : yup.string().required(),
            padre : yup.string(),
            indice: yup.string().required(),
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await AreaModuleService.createOrUpdateArea(formData as unknown as AreaFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        return onComplete();
    };

    const handleCancel = () => {
        onComplete();
    };

    const zeroValues: AreaFormModel = {
        sigla                  : '',
        nombre                 : '',
        indice : '',
        padre                  : 0,
        activo                 : true,
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!isMounted()) return;
            const resultArea = await AreaModuleService.getAllArea();
            if (!resultArea || !resultArea.success) return;
            const newAreas = resultArea.rows || [];
            if (isMounted()) setAreas(newAreas);
        };
        if (open) {
            fetchData();
        }
    }, [open, isMounted, formModel]);

    const newFormModel = formModel && {
        id                      : formModel.id,
        sigla                   : formModel.sigla,
        nombre                  : formModel.nombre,
        indice  : formModel.indice,
        padre                   : formModel.padre,
        area_id                 : formModel.area_id,
        activo                  : formModel.activo,
    };

    return (
        <FormDialog
            addTitle="Agregar area"
            editTitle="Editar area"
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
