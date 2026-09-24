import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
import { FormGroup, FormDialog, FormValue } from 'components/core/FormDialog';
import { DeudaModuleService } from '../DeudaModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';

export type PagoDeudaFormModel = {
    id?           : string;
    monto         : number;
    fecha         : Date;
    concepto_deuda: string;
    descripcion   : string;
    adjuntos      : string;
};

export type DetalleDeudaFormModel ={
    id          : string;
    cod_activo  : string;
    titulo      : string;
    descripcion : string;
    gestion_deuda : string;
    monto_deuda : number;
    cuenta_id   : string;
}

type Props = {
    open: boolean;
    ids: string[];
    onComplete: () => void;
    cuentaId: string;
};

export const PagoDeudaFormDialog = ({ open, ids, onComplete, cuentaId }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();

    const [showDetalleDeuda, setDetalleDeuda] = useState<DetalleDeudaFormModel>();

    const formLayout: FormGroup<PagoDeudaFormModel>[] = [
        {
            title: 'Ingrese los datos de la conciliación',
            grid: [
                [{ name: 'monto', label: 'Monto', type: 'text', infoText: 'ej. 1200.15, 300123.98' },
                 { name: 'fecha', label: 'Fecha de Registro', type: 'datetime', infoText: 'Fecha registro conciliación' }
                ],
                [{ name: 'concepto_deuda', label: 'Concepto de Deuda', type: 'text'}],
                [{ name: 'descripcion', label: 'Descripcion de la conciliación', type: 'textarea', rows: 2 }],
                [{ name: 'adjuntos', label: 'Archivo Adjunto', type: 'dropzone' }],
            ]
        }
    ];

    const validationSchema = yup
        .object({
            monto         : yup.number().required(),
            fecha         : yup.date().required(),
            concepto_deuda: yup.string().required(),
            descripcion   : yup.string().required(),
            adjunto       : yup.string(),
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await DeudaModuleService.setDeudaHistorial(cuentaId, ids, formData as unknown as PagoDeudaFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        return onComplete();
    };

    const handleCancel = () => {
        onComplete();
    };

    useEffect(() => {
        const fetchData = async () => {
            const detalleDeuda = await DeudaModuleService.getDeudaDetalle(ids);
            console.log("🚀 ~ fetchData ~ detalleDeuda:", detalleDeuda)
            if (!detalleDeuda || !detalleDeuda.success) return;
            const newDetalleDeuda = detalleDeuda.data;
            if (isMounted())
                setDetalleDeuda(newDetalleDeuda);
        };
        if (open) {
            fetchData();
        }
    }, [open, isMounted, ids]);

    const zeroValues: PagoDeudaFormModel = {
        monto         : 0,
        concepto_deuda: '',
        descripcion   : '',
        fecha         : new Date(),
        adjuntos      : '[]',
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
        />
    );
};

