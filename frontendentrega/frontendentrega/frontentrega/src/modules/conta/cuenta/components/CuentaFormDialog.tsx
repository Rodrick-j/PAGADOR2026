import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
import { FormGroup, FormDialog, FormValue, SelectOption } from 'components/core/FormDialog';
import { CuentaModuleService } from '../CuentaModuleService';
import { useNotify } from 'services/notify';
import { ENUM_MOTIVO_DEUDA, ENUM_SINCON_PROCESO, ENUM_SINO_2, ENUM_SINO_3, ENUM_TIPO_CUENTA } from 'constants/enums';

export type CuentaFormModel = {
    id?: number;
    tipo_cuenta             : string;
    nombre_deudor           : string;
    ci                      : string;
    direccion_domicilio     : string;
    telefono_celular        : string;

    confirmacion            : string;
    descripcion_confirmacion: string;
    motivo_deuda            : string;
    documentacion_respaldo  : string;
    incremento_deuda        : string;
    monto_incremento_deuda  : number;
    depositos_realizados    : string;
    gestion_generacion_deuda: string;
    saldo                   : number;
    adjuntos?               : string;
    descripcion_deuda        : string,
    estado_proceso           : string,
    observacion             : string;
    detalle_gestion_deuda   : string;
};

type Props = {
    open: boolean;
    formModel?: CuentaFormModel;
    onComplete: () => void;
};


export const CuentaFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();

    const tipoOptions: SelectOption[] = ENUM_TIPO_CUENTA;
    const confirmacionOptions: SelectOption[] = ENUM_SINO_3;
    const verificarProcesoOptions: SelectOption[] = ENUM_SINCON_PROCESO;
    const motivoDeudaOptions: SelectOption[] = ENUM_MOTIVO_DEUDA;
    const [showMotivoDeuda, setMotivoDeuda]=useState<string>('');

    // Inicializa el estado del formulario basado en formModel o valores predeterminados
    const [formValues, setFormValues] = useState<CuentaFormModel>(() => ({
        ...{
            motivo_deuda            : '',
            nombre_deudor           : '',
            tipo_cuenta             : '',
            ci                      : '',
            direccion_domicilio     : '',
            telefono_celular        : '',
            confirmacion            : '',
            documentacion_respaldo  : '',
            incremento_deuda        : '',
            monto_incremento_deuda  : 0,
            depositos_realizados    : '',
            descripcion_confirmacion: '',
            gestion_generacion_deuda: '',
            saldo                   : 0,
            adjuntos                : '[]',
            observacion             : '',
            descripcion_deuda : '',
            estado_proceso           : '',
            detalle_gestion_deuda   : '',

        },
        ...formModel // Sobrescribe valores predeterminados con los valores del formModel
    }));

       useEffect(() => {
        // Actualiza formValues cuando formModel cambie
        if (formModel) {
            setFormValues(prev => ({
                ...prev,
                ...formModel
            }));
            setMotivoDeuda(formModel.motivo_deuda);
        }
    }, [formModel]);


    const formLayout: FormGroup<CuentaFormModel>[] = [
        {
            title: 'Datos del Deudor',
            grid: [
                [{ name: 'nombre_deudor', label: 'Nombre completo', type: 'text' }],
                [
                    { name: 'ci', label: 'Carnet identidad', type: 'text', infoText: 'ej. 12345678-OR, 12345678-TJ, 12345678' },
                    { name: 'telefono_celular', label: 'Telefono / celular', type: 'text', infoText: 'ej. 7080000, 52-12345' },
                ],
                [{ name: 'direccion_domicilio', label: 'Direccion domicilio', type: 'text' }],
            ]
        },
        {
            title: 'Datos de la Deuda',
            grid: [
                [
                    { name: 'tipo_cuenta', label: 'Tipo de Cuenta', type: 'select', options: tipoOptions },
                    { name: 'confirmacion', label: 'Confirmacion', type: 'radio-group', options: confirmacionOptions, inlineDisplay: true }
                ],
                [ { name: 'descripcion_confirmacion', label: 'Descripcion Confirmacion', type: 'textarea', rows: 2 } ],
                [
                    { name: 'gestion_generacion_deuda', label: 'Gestion', type: 'text', infoText: 'ej. 2022, 2020-2021' },
                    { name: 'saldo', label: 'Saldo Real Deuda', type: 'text', infoText: 'ej. 1200.15, 300123.98' },
                ],
                [
                    {
                        name: 'motivo_deuda',
                        label: 'Motivo de Deuda',
                        type: 'multiselect',
                        options:motivoDeudaOptions,
                        onChange:(value,formik)=>{
                        formik.setFieldValue('motivo_deuda', value);
                        setMotivoDeuda(String(value));
                       },
                     },
                 ],
                 [
                     (showMotivoDeuda ==='OTRO')?
                     { name: 'motivo_deuda', label: 'Otro Motivo de Deuda', type: 'text'}
                     :{  type: 'empty' },
                 ],

                [ { name: 'descripcion_deuda', label: 'Descripcion de la Deuda', type: 'textarea' ,rows:2 } ],

                [ { name: 'documentacion_respaldo', label: 'Documento Respaldo', type: 'textarea', rows: 2 } ],
                [
                    { name: 'observacion', label: 'Observacion', type: 'textarea', rows: 2 },
                ],
                [
                    { name: 'estado_proceso', label: 'Estado Legal', type: 'radio-group', options: verificarProcesoOptions, inlineDisplay: true }
                 ],
                [
                    { name: 'adjuntos', label: 'Adjunto', type: 'dropzone' },
                ]
            ]
        }
    ];

    const validationSchema = yup
        .object({
            nombre_deudor           : yup.string().required(),
            tipo_cuenta             : yup.string().required(),
            ci                      : yup.string().required(),
            direccion_domicilio     : yup.string().required(),
            telefono_celular        : yup.string().required(),
            confirmacion            : yup.string().required(),
            gestion_generacion_deuda: yup.string().required(),
            adjuntos                : yup.string(),
            saldo                   : yup.number().required(),
            estado_proceso          : yup.string().required(),
        })
        .defined();

        const clearForm = () => {
            setFormValues(zeroValues);
            setMotivoDeuda('');
        };

    const handleSubmit = async (formData: FormValue) => {
        const result = await CuentaModuleService.createOrUpdateCuenta(formData as unknown as CuentaFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        clearForm();
        return onComplete();

    };

    const handleCancel = () => {
        onComplete();
    };

    const zeroValues: CuentaFormModel = {
        motivo_deuda            : '',
        nombre_deudor           : '',
        tipo_cuenta             : '',
        ci                      : '',
        direccion_domicilio     : '',
        telefono_celular        : '',
        confirmacion            : '',
        documentacion_respaldo  : '',
        incremento_deuda        : '',
        monto_incremento_deuda  : 0,
        depositos_realizados    : '',
        descripcion_confirmacion: '',
        gestion_generacion_deuda: '',
        saldo                   : 0,
        adjuntos                : '[]',
        observacion             : '',
        descripcion_deuda       : '',
        estado_proceso          : '',
        detalle_gestion_deuda   : '',
    };

    return (
        <FormDialog
            addTitle="Agregar Cuenta"
            editTitle="Editar Cuenta"
            open={open}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialValues={formValues}
            formLayout={formLayout}
            validationSchema={validationSchema}
            isEdit={typeof formModel !== 'undefined'}
        />
    );
};
