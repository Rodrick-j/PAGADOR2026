import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
import { FormGroup, FormDialog, FormValue, SelectOption } from 'components/core/FormDialog';
import { ActividadModuleService } from '../ActividadModuleService';

import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';

import { OptionsFormModel } from 'modules/Types';

import { UsersModuleService } from 'modules/system/users';
import { ProcesoModuleService } from 'modules/contra/proceso';
import { ENUM_NOTIFICADO } from 'constants/enums';

export type ActividadFormModel = {
    id                      ?: number;
    titulo                   : string;
    descripcion              : string;
    paso                     : number;
    tiempo                   : string;
    notificacion             : boolean;
    notificacion_solicitante?: boolean;
    observacion              : string;
    observacion2             : string;
    estado                   : string;
    fecha                    : Date;
    fecha_limite             : Date;
    fecha_envio?             : Date;
    usuario_solicitante_id ? : string;
    usuario_solicitante2_id? : string;
    usuario_solicitante3_id? : string;
    usuarios_id?             : string[];
    proceso_id?              : string;
    estado_actividad? : boolean;


    _createdBy?: string;
    _createdAt?: string;
    _updatedBy?: string;
    _updatedAt?: string;
};

type Props = {
    open: boolean;
    formModel?: ActividadFormModel;
    onComplete: () => void;
};

export const ActividadFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();

    const [usuarios, setUsuarios] = useState<OptionsFormModel[]>([]);
    const usuariosOptions: SelectOption[] = usuarios.map((item: OptionsFormModel) => ({ value: item.id || '', label: item.nombre }));

    const [areas, setAreas] = useState<OptionsFormModel[]>([]);
    const areasOptions: SelectOption[] = areas.map((item: OptionsFormModel) => ({ value: item.id || '', label: item.nombre }));

    const sinoOptions: SelectOption[] = ENUM_NOTIFICADO;

    const formLayout: FormGroup<ActividadFormModel>[] = [
        {
            title: '',
            grid: [
                [{ name: 'titulo', label: 'Nombre del Actividad', type: 'text' }],
                [{ name: 'descripcion', label: 'Descripcion de la Actividad', type: 'textarea', rows: 3 }],
                [
                    { name: 'tiempo', label: 'Tiempo de la Actividad', type: 'text', infoText: 'ej. 2d-8h-3m-15s' },
                    { name: 'paso', label: 'Paso', type: 'text', infoText: 'ej. 1' }
                ],
                [{ name: 'observacion2', label: 'Observacion de la Actividad', type: 'textarea', rows: 3 }],

                [
                    { name: 'fecha', label: 'Fecha Inicio Paso', type: 'datetime' },
                    { name: 'fecha_limite', label: 'Fecha Limite Paso', type: 'datetime' },
                ],

                [{ name: 'proceso_id', label: 'Proceso', type: 'autocomplete', options: areasOptions }],
                [{ name: 'usuarios_id', label: 'Responsable Solicitante', type: 'multiselect2', options: usuariosOptions, infoText:"" }],
                [
                    {
                        name: 'estado_actividad',
                        label: 'Marcar si la linea de tiempo es ignorada',
                        type: 'checkbox',
                        infoText: 'Marcar si la fecha de la actividad se encuentra en el rango de fecha actual, teniendose actividades retrasadas por el incumpliemto en el envio de la actividades anteriores, puede enviar las observaciones de la actividad correspondiente, ademas se enviara la fecha de envio y se cambiara el estado a ATENDIDO.'
                    },

                ],
            ]
        }
    ];

    const isDateUnique = async (nro: Date, proceso_id:string, paso:number) => {

        const formModelDate = formModel && formModel.fecha_limite ? new Date(formModel.fecha_limite) : new Date();
        if(formModelDate && formModelDate.getTime() === nro.getTime()){
            const result = await ActividadModuleService.getFechaLimiteData(nro, proceso_id,paso);
            const exists = Boolean(result.data.nro);
            return !exists;
        }
        return true;
    };

    const validationSchema = yup
        .object({
            titulo   : yup.string().required(),
         //   fecha    : yup.date().required(),
           //fecha_limite : yup.date().required(),

           /* fecha_limite               : yup.date().required().test('is-unique', 'La fecha Limite debe cambiarse, debe ingresar una nueva fecha Limite si cambia la fecha de inicio',
                async (value) => {
               if (value !== undefined) {
                   return await isDateUnique(value, formModel?.proceso_id!, formModel?.paso!);
                   }
                   return true;
               }),*/

             observacion2: yup.string().required("Si realiza alguna modificacion, debe especificar el porque de la modificacion"),
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await ActividadModuleService.createOrUpdateActividad(formData as unknown as ActividadFormModel);
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
            const resultArea = await ProcesoModuleService.getAllProceso();
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

    const zeroValues: ActividadFormModel = {
        titulo      : '',
        descripcion : '',
        paso        : 0,
        tiempo      : '',
        estado      : 'PENDIENTE',
        notificacion: false,
        observacion : '',
        observacion2: '',
        fecha       : new Date(),
        fecha_limite: new Date(),
        estado_actividad: false,
    };

    const newFormModel = formModel && {
        id                      : formModel.id,
        titulo                  : formModel.titulo,
        descripcion             : formModel.descripcion,
        paso                    : formModel.paso,
        tiempo                  : formModel.tiempo,
        notificacion            : Number(formModel.notificacion),
        notificacion_solicitante: formModel.notificacion_solicitante,
        observacion             : formModel.observacion,
        observacion2            : formModel.observacion2,
        fecha                   : formModel.fecha,
        fecha_limite            : formModel.fecha_limite,
        fechaEnvio              : formModel.fecha_envio,
        estado                  : formModel.estado,
        usuario_id              : formModel.usuarios_id,
        proceso_id              : formModel.proceso_id,
        estado_actividad        : formModel.estado_actividad,

    };

    return (
        <FormDialog
            addTitle="Agregar actividad"
            editTitle="Editar actividad"
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
