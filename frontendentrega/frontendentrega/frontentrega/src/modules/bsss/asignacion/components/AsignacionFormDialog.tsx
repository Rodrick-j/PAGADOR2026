import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
import { SelectOption, FormGroup, FormDialog, FormValue } from 'components/core/FormDialog';
import { AsignacionModuleService } from '../AsignacionModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';
import { Options2FormModel, OptionsFormModel } from 'modules/Types';
import { UsersModuleService } from 'modules/system/users';

export type AsignacionFormModel = {
    id         ?: number;
    observacion : string;
    estado      : boolean;
    apertura_id : string;
    usuario_id  : string;
    contrato?   : string;
};

type Props = {
    open: boolean;
    formModel?: AsignacionFormModel;
    onComplete: () => void;
};

export const AsignacionFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();

    const [aperturas, setAperturas] = useState<OptionsFormModel[]>([]);
    const aperturasOptions: SelectOption[] = aperturas.map((item: Options2FormModel) => ({ value: item.id || '', label: item.nombre, caption: item.concepto }));


    const [usuarios, setUsuarios] = useState<OptionsFormModel[]>([]);
    const usuariosOptions: SelectOption[] = usuarios.map((item: OptionsFormModel) => ({ value: item.id || '', label: item.nombre }));

    const formLayout: FormGroup<AsignacionFormModel>[] = [
        {
            title: 'Asignacion Programatica',
            grid: [
                [{
                    name: 'apertura_id',
                    label: 'Apertura Programatica',
                    type: 'autocomplete',
                    options: aperturasOptions,

                }],
                [{name: 'contrato', label: 'Codigo Contrato', type: 'textarea'}],
                [{name: 'observacion', label: 'Observacion', type: 'textarea', rows: 2 }]
            ]
        },
        {
            title: 'Usuario Asociado',
            grid: [
                [{ name: 'usuario_id', label: 'Usuario', type: 'autocomplete', options: usuariosOptions }],
            ]
        },
    ];

    const validationSchema = yup
        .object({
            apertura_id: yup.string().required(),
            usuario_id: yup.string().required(),
            contrato: yup.string().required("Debe ingresar el Codigo de Contrato perteneciente a la apertura"),
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await AsignacionModuleService.createOrUpdateAsignacion(formData as unknown as AsignacionFormModel);
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
            const resultApertura = await AsignacionModuleService.getAllAperturaGeneral();
            if (!resultApertura || !resultApertura.success) return;
            const aperturas = resultApertura.rows || [];
            const resultUsuarios = await UsersModuleService.getAllUsuarios();
            if (!resultUsuarios || !resultUsuarios.success) return;
            const newUsuarios = resultUsuarios.rows || [];

            if (isMounted()) {
                setAperturas(aperturas);
                setUsuarios(newUsuarios);
            };
        };
        if (open) {
            fetchData();
        }
    }, [open, isMounted, formModel]);

    const zeroValues: AsignacionFormModel = {
        observacion: '',
        estado     : true,
        apertura_id: '',
        usuario_id : '',
        contrato   : '',
    };

    const newFormModel = formModel && {
        id         : formModel.id,
        observacion: formModel.observacion,
        apertura_id: formModel.apertura_id,
        estado     : formModel.estado,
        usuario_id : formModel.usuario_id,
        contrato   : formModel.contrato,
    };

    return (
        <FormDialog
            addTitle="Agregar Asignacion"
            editTitle="Editar Asignacion"
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
