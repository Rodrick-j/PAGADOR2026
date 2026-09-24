import React, { ReactElement } from 'react';
import * as yup from 'yup';
import { FormGroup, FormDialog, FormValue } from 'components/core/FormDialog';

import { useNotify } from 'services/notify';

export type DatosGastoFormModel = {
    id?         : number;
    monto       : string;
    descripcion : string;
    adjuntos    : string;
};

type Props = {
    open: boolean;
    formModel: any;
    onComplete: () => void;
    cuentaId: string;
};

export const DatosGastoFormDialog = ({ open, formModel, onComplete, cuentaId }: Props): ReactElement => {
    const notify = useNotify(); 
        
    const formLayout: FormGroup<DatosGastoFormModel>[] = [
        {
            title: 'Ingrese los datos de la consiliacion',
            grid: [            
                [{ name: 'monto', label: 'Monto a consiliar', type: 'text', infoText: 'ej. 1200.15, 300123.98' }],
                [{ name: 'descripcion', label: 'Descripcion de la consiliacion', type: 'textarea', rows: 2 }],
                [{ name: 'adjuntos', label: 'Archivo Adjunto', type: 'dropzone' }],
            ]
        }
    ];

    const validationSchema = yup
        .object({
            monto      : yup.number().required(),
            descripcion: yup.string().required(),
            adjunto    : yup.string(),
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
     /*   const result = await DeudaModuleService.setDeudaHistorial(cuentaId, formModel, formData as unknown as DatosGastoFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        return onComplete();*/
    };

    const handleCancel = () => {
        onComplete();
    };
    
    const zeroValues: DatosGastoFormModel = {
        monto      : '',
        descripcion: '',
        adjuntos   : '[]',
    };

    return (
        <FormDialog
            addTitle=""
            open={open}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialValues={zeroValues}
            formLayout={formLayout}
            validationSchema={validationSchema}
            debug
            isEdit={false}
        />
    );
};

