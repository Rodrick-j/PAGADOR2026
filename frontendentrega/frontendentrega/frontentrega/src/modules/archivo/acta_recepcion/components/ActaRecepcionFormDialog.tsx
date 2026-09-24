import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
import { FormGroup, FormDialog, FormValue, SelectOption } from 'components/core/FormDialog';
import { ActaRecepcionModuleService } from '../ActaRecepcionModuleService';

import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';

import { ENUM_GESTION, ENUM_TIPO_DOCUMENTO } from 'constants/enums';
import { AreaModuleService } from 'modules/rrhh/area';
import { PersonalModuleService } from 'modules/rrhh/personal';
import { DocumentoModuleService } from 'modules/archivo/documento';

export type ActaRecepcionFormModel = {
    id?           : number;
    fecha_registro: Date;
    observacion   : string;
    cod_acta      : string;
    documentos?   : string[];
    documentos_id : string[];
    estado        : boolean;
    area_id       : string;
    personal_id   : string;

};

type Props = {
    open: boolean;
    formModel?: ActaRecepcionFormModel;
    onComplete: () => void;
};

export const ActaRecepcionFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();

    const [areas, setAreas] = useState<{id: string; nombre: string;}[]>([]);
    const [personals, setPersonals] = useState<{id: string; nombre: string; id_area: string}[]>([]);

    const areasOptions = (formValue: FormValue): SelectOption[] => {
        return areas
            .map((a: any) => ({
                value: a.id || '',
                label: a.nombre
            }));
    };

    const personalOptions = (formValue: FormValue): SelectOption[] => {
        const areasId = formValue.area_id;
        return personals.filter((item) => areasId===item.id_area)
            .map((a: any) => ({
                value: a.id || '',
                label: a.nombre,
            }));
    };

    const formLayout: FormGroup<ActaRecepcionFormModel>[] = [
        {
            title: 'Datos del Acta Recepcion',
            grid: [
                [
                    { name: 'fecha_registro', label: 'Fecha de Registro', type: 'date' }
                ],
                [
                    {
                        name: 'area_id',
                        label: 'Secretaria/Unidad/Area o Programa',
                        type: 'autocomplete',
                        options: areasOptions,
                        onChange: (value, formik) => {
                            formik.setFieldValue('area_id', value);
                            formik.setFieldValue('personal_id', []);
                        }
                    }
                ],
                [{ name: 'personal_id', label: 'Nombre del personal a cargo', type: 'autocomplete', options: personalOptions, fieldRequired: 'area_id' }],
                [{ name: 'observacion', label: 'Observacion para el Acta', type: 'textarea', rows: 3 }]
            ]
        },
       /*  {
            title: 'Entregado por',
            grid: [
                [
                    {
                        name: 'adjuntos',
                        label: 'Archivos Digitales',
                        type: 'dropzone',
                        maxFileSize: 30 * 1024 * 1024,
                        dropzoneText: `Arrastre y suelte un archivo aquí o haga click. (Tamaño máximo: 30MB)`
                    },
                ]
            ]
        }*/
    ];

    const validationSchema = yup
        .object({
            observacion    : yup.string().required(),
            fecha_registro : yup.date().required(),
            area_id        : yup.string().required(),
            personal_id    : yup.string().required(),
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await ActaRecepcionModuleService.createOrUpdateActaRecepcion(formData as unknown as ActaRecepcionFormModel);
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
            const resultArea = await AreaModuleService.getAllArea();
            if (!resultArea || !resultArea.success) return;
            const areas = resultArea.rows || [];
            const resultPersonal = await PersonalModuleService.getAllPersonal();
            if (!resultPersonal || !resultPersonal.success) return;
            const newPersonals = resultPersonal.rows || [];
            if (isMounted()) {
                setPersonals(newPersonals);
                setAreas(areas);
            };
        };
        if (open) {
            fetchData();
        }
    }, [open, isMounted, formModel]);

    const zeroValues: ActaRecepcionFormModel = {
        fecha_registro: new Date(),
        observacion   : '',
        cod_acta      : '',
        estado        : true,
        area_id       : '',
        documentos_id : [],
        personal_id   : ''
    };

    const newFormModel = formModel && {
        id            : formModel.id,
        observacion   : formModel.observacion,
        documentos_id : formModel.documentos_id,
        fecha_registro: formModel.fecha_registro,
        estado        : formModel.estado,
        cod_acta      : formModel.cod_acta,
        area_id       : formModel.area_id,
        personal_id   : formModel.personal_id,
    };

    return (
        <FormDialog
            addTitle="Agregar Acta Recepcion"
            editTitle="Editar Acta Recepcion"
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

