import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
import { FormGroup, FormDialog, FormValue, SelectOption } from 'components/core/FormDialog';
import { ProcesoModuleService } from '../ProcesoModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';

import { ENUM_TIPO_CONTRA } from 'constants/enums';
import { OptionsFormModel } from 'modules/Types';

import { UsersModuleService } from 'modules/system/users';
import { AreaModuleService } from 'modules/rrhh/area';
import { Formik } from 'formik';

export type ProcesoFormModel = {
    id                     ?: number;
    objeto_contratacion     : string;
    modalidad_descripcion   : string;
    modalidad_sigla         : string;
    codigo_interno_entidad  : string;
    cuce                    : string;
    fecha_registro          : Date;
    gestion                 : string;
    estado                  : string;
    hoja_ruta               : string;
    usuario_solicitante_id ?: string;
    usuario_solicitante2_id?: string;
    usuario_solicitante3_id?: string;
    usuario_id?              : string;
    estado_activo           :string;
    //usuario_juridica?       : string;
    area_id                ?: string;

    _createdBy?: string;
    _createdAt?: string;
    _updatedBy?: string;
    _updatedAt?: string;
};

type Props = {
    open: boolean;
    formModel?: ProcesoFormModel;
    onComplete: () => void;
};


export const ProcesoFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();

    const siglaOptions: SelectOption[] = ENUM_TIPO_CONTRA;
    const [modalidad, setModalidad] = useState<string>('');

    const [usuarios, setUsuarios] = useState<OptionsFormModel[]>([]);
    const usuariosOptions: SelectOption[] = usuarios.map((item: OptionsFormModel) => ({ value: item.id || '', label: item.nombre }));

    const [areas, setAreas] = useState<OptionsFormModel[]>([]);
    const areasOptions: SelectOption[] = areas.map((item: OptionsFormModel) => ({ value: item.id || '', label: item.nombre }));

    const formLayout: FormGroup<ProcesoFormModel>[] = [
        {
            title: '',
            grid: [
                [{
                    name: 'modalidad_sigla',
                    label: 'Modalidad de Contratacion',
                    type: 'select',
                    options: siglaOptions,
                    onChange: (value, formik) => {
                        setModalidad(String(value));
                        formik.setFieldValue('modalidad_sigla', value);
                    },
                }],
                [{ name: 'area_id', label: 'Unidad Solicitante', type: 'autocomplete', options: areasOptions }],
                [{ name: 'usuario_solicitante_id', label: 'Responsable del Proceso (RPA - RPC)', type: 'autocomplete', options: usuariosOptions }],
                [{ name: 'usuario_solicitante2_id', label: 'Tecnico Encargado de Seguimiento del Proceso (TES)', type: 'autocomplete', options: usuariosOptions }],
                [{ name: 'usuario_solicitante3_id', label: 'Tecnico de Juridica', type: 'autocomplete', options: usuariosOptions }],
                [
                    { name: 'hoja_ruta', label: 'Hoja de Ruta', type: 'text', infoText: "Ej. GAD ORU/ANPE-CIL-12/2023" },
                    { name: 'codigo_interno_entidad', label: 'Codigo Interno por la Entidad', type: 'text', infoText: "Ej. GAD-OR-CM-12/2024" }
                ],
                [
                    { name: 'gestion', label: 'Gestion', type: 'text', disabled: true  },
                    { name: 'fecha_registro', label: 'Fecha Inicio de Proceso', type: 'datetime', disabled: formModel?.id!== undefined },
                ],
                [{ name: 'cuce', label: 'CUCE', type: 'text', infoText: "Ej. 01-1234-02-1234567-1-1" }],
                [{ name: 'objeto_contratacion', label: 'Objeto de la Contratacion', type: 'textarea', rows: 3 }],
            ]
        }
    ];

    const validationSchema = yup
        .object({
            modalidad_sigla        : yup.string().required(),
            codigo_interno_entidad : yup.string().required(),
            area_id                : yup.string().required(),
            usuario_solicitante_id : yup.string().required(),
            usuario_solicitante2_id: yup.string().required(),
            usuario_solicitante3_id: yup.string().required(),
            fecha_registro         : yup.string().required(),
            gestion                : yup.string().required(),
            objeto_contratacion    : yup.string().required(),
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await ProcesoModuleService.createOrUpdateProceso(formData as unknown as ProcesoFormModel);
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
            const resultPersonal = await UsersModuleService.getAllUsuarios();
            if (!resultPersonal || !resultPersonal.success) return;
            const newPersonals = resultPersonal.rows || [];
            const resultArea = await AreaModuleService.getAllArea();
            if (!resultArea || !resultArea.success) return;
            const newAreas = resultArea.rows || [];

            if (isMounted()) {
                setUsuarios(newPersonals);
                setAreas(newAreas);
            };
        };
        if (open) {
            fetchData();
        }
    }, [open, isMounted, formModel]);

    const zeroValues: ProcesoFormModel = {
        modalidad_sigla       : modalidad,
        modalidad_descripcion : ENUM_TIPO_CONTRA.find((md) => md.value === modalidad)?.label || "",
        hoja_ruta             : '',
        codigo_interno_entidad: '',
        fecha_registro        : new Date(),
        cuce                  : '',
        estado                : 'PENDIENTE',
        gestion               : new Date().getFullYear().toString(),
        objeto_contratacion   : '',
        estado_activo         :'ABIERTO',
    };

    const newFormModel = formModel && {
        id                     : formModel.id,
        modalidad_descripcion  : formModel.modalidad_descripcion,
        modalidad_sigla        : formModel.modalidad_sigla,
        codigo_interno_entidad : formModel.codigo_interno_entidad,
        hoja_ruta              : formModel.hoja_ruta,
        fecha_registro         : formModel.fecha_registro,
        cuce                   : formModel.cuce,
        gestion                : formModel.gestion,
        usuario_solicitante_id : formModel.usuario_solicitante_id,
        usuario_solicitante2_id: formModel.usuario_solicitante2_id,
        usuario_solicitante3_id: formModel.usuario_solicitante3_id,
        area_id                : formModel.area_id,
        objeto_contratacion    : formModel.objeto_contratacion,
    };

    return (
        <FormDialog
            addTitle="Agregar proceso"
            editTitle="Editar proceso"
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
