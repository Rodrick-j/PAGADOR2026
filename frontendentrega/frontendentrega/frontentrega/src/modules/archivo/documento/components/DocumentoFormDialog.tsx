import React, { useState, ReactElement } from 'react';
import * as yup from 'yup';
import { FormikHelpers } from 'formik';
import { FileItem, FormGroup, FormDialog, FormValue, SelectOption } from 'components/core/FormDialog';
import { serializeAdjuntosCompact } from 'utils/formatFile';
import { DocumentoModuleService } from '../DocumentoModuleService';
import { useNotify } from 'services/notify';
import { ENUM_GESTION, ENUM_TIPO_DOCUMENTO } from 'constants/enums';

export type DocumentoFormModel = {
    id         ?: number;
    nro        ?: number;
    tipo        : string;
    descripcion : string;
    doc_adjunto : string;
    gestion     : string;
    fecha       : Date | null;
    nrofolio    : string;
    hojas_ruta  : string;
    grupo_gasto : string;
    ubicacion   : string;
    monto      ?: number;
    estado      : string;
    permiso     : string;
    adjuntos?   : string;
};

type Props = {
    open: boolean;
    formModel?: DocumentoFormModel;
    onComplete: () => void;
};

export const DocumentoFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {

    const notify = useNotify();
    const gestion = new Date().getFullYear().toString();
    const tipoOptions: SelectOption[] = ENUM_TIPO_DOCUMENTO;
    const gestionOptions: SelectOption[] = ENUM_GESTION;
    const handleAdjuntosChange = (_value: string | number | boolean | null | (string | number | boolean | null)[], formik?: any, fieldValue?: unknown): void => {
        if (!formik) return;

        if (!Array.isArray(fieldValue)) {
            formik.setFieldValue('adjuntos', '[]');
            return;
        }

        const files: FileItem[] = fieldValue as FileItem[];
        formik.setFieldValue('adjuntos', serializeAdjuntosCompact(files));
    };
    const formLayout: FormGroup<DocumentoFormModel>[] = [
        {
            title: '',
            grid: [
                [
                    { name: 'gestion', label: 'Gestion', type: 'select', options: gestionOptions },
                    { name: 'tipo', label: 'Tipo', type: 'select', options: tipoOptions },
                    { name: 'nro', label: 'Nro Documento', type: 'text', disabled: formModel !== undefined},
                ],
                [
                    { name: 'nrofolio', label: 'Nro Folio', type: 'text' },
                    { name: 'fecha', label: 'Fecha ingreso archivo', type: 'date' },
                    { name: 'monto', label: 'Monto', type: 'text', infoText: 'ej. 1200.15, 300123.98' },
                ],
                [{ name: 'grupo_gasto', label: 'Beneficiario', type: 'text' }],
                [{ name: 'hojas_ruta', label: 'Hojas de Ruta', type: 'textarea', rows: 2 }],
                [{ name: 'descripcion', label: 'Descripcion/Glosa', type: 'textarea', rows: 2 }],
                [{ name: 'doc_adjunto', label: 'Documentos Adjuntos', type: 'textarea', rows: 2 }],
                [{ name: 'ubicacion', label: 'Observaciones/Ubicacion', type: 'textarea', rows: 2 }],
                [
                    {
                        name: 'adjuntos',
                        label: 'Archivos Adjuntos',
                        type: 'dropzone',
                        onChange: handleAdjuntosChange,
                        maxFileSize: 50 * 1024 * 1024,
                        dropzoneText: `Arrastre y suelte un archivo aquí o haga click. (Tamaño máximo: 50MB)`
                    },
                ]
            ]
        }
    ];

    const validationSchema = yup
                            .object({
                                nro         : yup
                                                .string()
                                                .required('Requerido')
                                                .test('no-spaces', 'No uses espacios', (v?: string) => !!v && !/\s/.test(v))
                                                .matches(/^(?:0|[1-9]\d*)(?:\.\d+)?$/, 'Solo números válidos')
                                                .test('is-unique', 'El número ya existe', async function (value) {
                                                    const { parent } = this as yup.TestContext & { parent: any };
                                                    const original = formModel?.id ?? null;

                                                    const gestion = parent?.gestion;
                                                    const tipo    = parent?.tipo;

                                                    if (value == null || !gestion || !tipo) return true;

                                                    if (original) return true;

                                                    const r = await DocumentoModuleService.getNroDocumentoData(
                                                        Number(value),
                                                        String(gestion),
                                                        String(tipo)
                                                    );
                                                    return !r?.data?.nro;
                                                }),
                                tipo       : yup.string().required(),
                                descripcion: yup.string().required(),
                                nrofolio   : yup.number().required(),
                                gestion    : yup.string()
                                            .matches(/^\d{4}$/, 'El campo gestion debe ser un año de 4 dígitos')
                                            .required('El campo gestion es requerido'),
                                fecha      : yup.string().required(),
                                grupo_gasto: yup.string().required(),
                                hojas_ruta : yup.string().required(),
                                ubicacion  : yup.string().required(),
                                adjuntos   : yup.string(),
                                adjuntos2  : yup.string(),
                                monto      : yup.number().required(),
                            })
                            .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await DocumentoModuleService.createOrUpdateDocumento(formData as unknown as DocumentoFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        return onComplete();
    };

    const handleCancel = () => {
        onComplete();
    };

    const zeroValues: DocumentoFormModel = {
        nro        : undefined,
        tipo       : '',
        descripcion: '',
        doc_adjunto: '',
        nrofolio   : '',
        gestion    : gestion,
        fecha      : new Date(),
        grupo_gasto: '',
        hojas_ruta : '',
        ubicacion  : '',
        monto      : undefined,
        estado     : '-',
        permiso    : 'NORMAL',
        adjuntos   : '[]'
    };

    const newFormModel = formModel && {
        id         : formModel.id,
        nro        : formModel.nro,
        tipo       : formModel.tipo,
        descripcion: formModel.descripcion,
        doc_adjunto: formModel.doc_adjunto,
        gestion    : formModel.gestion,
        nrofolio   : formModel.nrofolio,
        fecha      : formModel.fecha,
        monto      : formModel.monto,
        estado     : formModel.estado,
        permiso    : formModel.permiso,
        grupo_gasto: formModel.grupo_gasto,
        hojas_ruta : formModel.hojas_ruta,
        ubicacion  : formModel.ubicacion,
        adjuntos   : formModel?.adjuntos || '[]',
    };

    return (
        <FormDialog
            addTitle="Agregar Documento"
            editTitle="Editar Documento"
            open={open}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialValues={newFormModel || zeroValues}
            formLayout={formLayout}
            validationSchema={validationSchema}
            validateOnChange={true}
            validateOnBlur={true}
            isEdit={typeof formModel !== 'undefined'}
        />
    );
};
