import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import * as yup from 'yup';
import { FormGroup, FormDialog, FormValue, SelectOption } from 'components/core/FormDialog';
import { ActaModuleService } from '../ActaModuleService';

import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';

import { ENUM_SINO } from 'constants/enums';
import { Options2FormModel } from 'modules/Types';
import { AreaModuleService } from 'modules/rrhh/area';
import { PersonalModuleService } from 'modules/rrhh/personal';
import { DocumentoModuleService } from 'modules/archivo/documento';

const TIPO_ACTA_PRESTAMO = 'ACT_PRE';

export type ActaFormModel = {
    id?                  : number;
    dias?                : number;
    tipo?                : string;
    descripcion          : string;
    fecha_devolucion?    : Date | null;
    cod_acta?            : string;
    documentos_id        : string[];
    externo              : string;
    descripcion_externo? : string;
    adjuntos?            : string;
    area_id              : string;
    personal_id          : string;

};

type Props = {
    open: boolean;
    formModel?: ActaFormModel;
    onComplete: () => void;
};

export const ActaFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();

    const externoInternoOptions: SelectOption[] = ENUM_SINO;

    const [documentos, setDocumentos] = useState<Options2FormModel[]>([]);
    const documentosOptions: SelectOption[] = documentos.map((item: Options2FormModel) => ({ value: item.id || '', label: item.nombre, caption: item.concepto }));

    const [showExterno, setShowExterno] = useState<string>('0');

    const [areas, setAreas] = useState<{id: string; nombre: string;}[]>([]);
    const [personals, setPersonals] = useState<{id: string; nombre: string; id_area: string}[]>([]);

    const areasOptions = (formValue: FormValue): SelectOption[] => {
        return areas
            .map((a: any) => ({
                value: a.id || '',
                label: a.nombre
            }));
    };

    const personalsOptions = (formValue: FormValue): SelectOption[] => {
        const areasId = formValue.area_id;
        return personals.filter((item) => areasId===item.id_area)
            .map((a: any) => ({
                value: a.id || '',
                label: a.nombre,
            }));
    };

    const buscarDocumentos = useCallback(async (searchText: string, _formValue?: FormValue, _selectedValues: (string | number)[] = [], page = 1): Promise<SelectOption[]> => {
        const resultDocumento = await DocumentoModuleService.getAllDocumento(TIPO_ACTA_PRESTAMO, {
            page,
            rowsPerPage: 25,
            searchText,
        });

        if (!resultDocumento || !resultDocumento.success) return [];

        return (resultDocumento.rows || []).map((item: Options2FormModel) => ({
            value  : item.id || '',
            label  : item.nombre,
            caption: item.concepto,
        }));
    }, []);


    const formLayout: FormGroup<ActaFormModel>[] = [
        {
            title: 'Datos del Acta',
            grid: [
                [
                    {
                        name: 'externo',
                        label: 'Externo',
                        type: 'radio-group',
                        options: externoInternoOptions,
                        inlineDisplay: true,
                        onChange: (value, formik) => {
                            formik.setFieldValue('externo', value);
                            setShowExterno(String(value));
                        },
                    },
                    { name: 'dias', label: 'Nro Dias', type: 'text', infoText: "Limite de dias par el Prestamo" },
                ],
            ]
        },
        {
            title: 'Documentos para el Acta',
            grid: [
                [{
                    name: 'documentos_id',
                    label: 'Documentos',
                    type: 'multiselect2',
                    options: documentosOptions,
                    remoteSearch: buscarDocumentos,
                }],
                [{ name: 'descripcion', label: 'Descripcion/Observacion', type: 'textarea', rows: 3 }]
            ]
        },
        {
            title: 'Dirigido a',
            grid: [
                [
                    showExterno==='1'?
                    { name: 'descripcion_externo', label: 'Datos del Externo', type: 'textarea', rows: 2 }
                    :{ type: 'empty'}
                ],
                [
                    showExterno==='0'?{
                        name: 'area_id',
                        label: 'Secretaria/Unidad/Area o Programa',
                        type: 'autocomplete',
                        options: areasOptions,
                        onChange: (value, formik) => {
                            formik.setFieldValue('area_id', value);
                            formik.setFieldValue('personal_id', []);
                        }
                    }
                    :{ type: 'empty'}
                ],
                [
                    showExterno==='0'?{ name: 'personal_id', label: 'Nombre del personal a cargo', type: 'autocomplete', options: personalsOptions, fieldRequired: 'area_id' }
                    :{ type: 'empty'}
                ],
                [
                    {
                        name: 'adjuntos',
                        label: 'Documentos Adjunto',
                        type: 'dropzone',
                        maxFileSize: 30 * 1024 * 1024,
                        dropzoneText: `Arrastre y suelte un archivo aquí o haga click. (Tamaño máximo: 30MB)`
                    },
                ],
            ]
        }
    ];

    const validationSchema = yup
        .object({
            descripcion     : yup.string().required(),
            dias            : yup.number().required(),
            documentos_id: yup.array().of(yup.string().required())
                            .required('Documentos son requeridos')
                            .test('is-empty', 'El campo no debe estar vacío', (value) => {
                                return Array.isArray(value) && value.length > 0;
                            }),
            area_id      : yup.string().when('externo', (externo, schema) => {
                return externo === '0'
                    ? schema.required()
                    :  schema;
            }),
            descripcion_externo: yup.string().when('externo', (externo, schema) => {
                return externo === '1'
                    ? schema.required()
                    : schema;
            }),
            personal_id: yup.string().when('externo', (externo, schema) => {
                return externo === '0'
                    ? schema.required()
                    : schema;
            }),
            adjuntos   : yup.string(),
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await ActaModuleService.createOrUpdateActa({ ...formData, tipo: TIPO_ACTA_PRESTAMO, fecha_devolucion: null } as unknown as ActaFormModel);
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
            if(formModel){
                const resultDocumento = await DocumentoModuleService.getAllDocumento2({
                    filters: { ids: formModel.documentos_id || [] },
                    rowsPerPage: formModel.documentos_id?.length || 25,
                    page: 1,
                });
                if (!resultDocumento || !resultDocumento.success) return;
                const documentos = resultDocumento.rows || [];
                if (isMounted()) {
                    setDocumentos(documentos);
                };
            } else if (isMounted()) {
                setDocumentos([]);
            }
            if (isMounted()) {
                setPersonals(newPersonals);
                setAreas(areas);
            };
        };
        if (open) {
            fetchData();
        }
    }, [open, isMounted, formModel]);

    const zeroValues: ActaFormModel = {
        dias               : 0,
        descripcion        : '',
        documentos_id      : [],
        area_id            : '',
        externo            : showExterno,
        adjuntos           : '[]',
        descripcion_externo: '',
        personal_id        : '',
    };

    const newFormModel = formModel && {
        id                 : formModel.id,
        dias               : formModel.dias,
        descripcion        : formModel.descripcion,
        documentos_id      : formModel.documentos_id,
        externo            : String(Number(formModel.externo)),
        descripcion_externo: formModel.descripcion_externo,
        adjuntos           : formModel?.adjuntos || '[]',
        area_id            : formModel.area_id,
        personal_id        : formModel.personal_id,
    };

    return (
        <FormDialog
            addTitle="Agregar Acta"
            editTitle="Editar Acta"
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
