import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
import { FormGroup, FormDialog, FormValue, SelectOption } from 'components/core/FormDialog';
import { BitacoraDetalleModuleService } from '../BitacoraDetalleModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';
import { DestinoModuleService } from 'modules/bsss/destino';
import { Options2FormModel } from 'modules/Types';
import { SelectOptionFecha } from 'components/core/FormDialog/Types';

export type BitacoraDetalleFormModel = {
    id                ?: string;
    fid_bitacora_viaje : string;
    fecha_salida       : Date;
    fecha_retorno      : Date;
    hora_salida        : string;
    hora_retorno       : string;
    destino_salida     : string;
    destino_llegada    : string;
    km_salida          : number | string;
    km_llegada         : number | string;
    km_estimados       : number | string;
    cantidad_personas  : number | string;
};

type Props = {
    semana:number;
    open: boolean;
    formModel?: BitacoraDetalleFormModel;
    bitacoraViajeId: string;
    onComplete: () => void;
};


export const BitacoraDetalleFormDialog = ({ open, formModel, bitacoraViajeId, onComplete , semana}: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();

    const [destinos, setDestinos] = useState<Options2FormModel[]>([]);
    const destinosOptions: SelectOption[] = destinos.map((item: Options2FormModel) => ({ value: item.id || '', label: item.nombre, caption: item.concepto }));
    
    const getDiasSemanaOptions = (week: number,year = new Date().getFullYear()): SelectOptionFecha[] => {

            const dias = [
                'Lunes',
                'Martes',
                'Miércoles',
                'Jueves',
                'Viernes',
                'Sábado',
                'Domingo'
            ];

            const firstDayOfYear = new Date(year, 0, 1);
            const dayOfWeek = firstDayOfYear.getDay() || 7;

            const monday = new Date(firstDayOfYear);
            monday.setDate(firstDayOfYear.getDate() - dayOfWeek + 1 + (week - 1) * 7);

            return Array.from({ length: 7 }, (_, index) => {
                const fecha = new Date(monday);
                fecha.setDate(monday.getDate() + index);

                const dia = String(fecha.getDate()).padStart(2, '0');
                const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                const anio = fecha.getFullYear();

                return {
                    value: fecha,// 2025-06-16
                    label: `${dias[index]} ${dia}/${mes}/${anio}`
                };
            });
        };

   
    const isEdit = typeof formModel !== 'undefined';

    const formLayout: FormGroup<BitacoraDetalleFormModel>[] = [
        {
            title: '',
            grid: [
                (isEdit)?
                [
                    { name: 'fecha_salida', label: 'Fecha Salida',type : 'date' , disabled: true},
                    { name: 'fecha_retorno', label: 'Fecha Retorno', type: 'date' },
                ]:[{ name: 'fecha_salida', label: 'Fecha Salida',type : "autocomplete" ,options:  getDiasSemanaOptions(Number(semana))},],
                (isEdit)?
                [
                    { name: 'hora_salida', label: 'Hora Salida', type: 'time' , disabled: true},
                    { name: 'hora_retorno', label: 'Hora Retorno', type: 'time' },
                    { name: 'cantidad_personas', label: 'Cantidad Personas', type: 'text', disabled: true },
                ]:[{ name: 'hora_salida', label: 'Hora Salida', type: 'time' },
                   { name: 'cantidad_personas', label: 'Cantidad Personas', type: 'text' },],
                (isEdit)?
                [
                    { name: 'destino_salida', label: 'Destino Salida:', type: 'autocomplete', options: destinosOptions, infoText: 'ej. CHALLAPATA' },
                    { name: 'destino_llegada', label: 'Destino Llegada', type: 'autocomplete', options: destinosOptions, infoText: 'ej. CHALLAPATA', disabled: true },
                ]:[ { name: 'destino_llegada', label: 'Destino llegada:', type: 'autocomplete', options: destinosOptions, infoText: 'ej. CHALLAPATA' },],
                (isEdit)?
                [
                    { name: 'km_salida', label: 'kilometraje Salida', type: 'text', infoText: 'ej. 590881 kilometraje', onChange: (value, formik) => {
                        formik?.setFieldValue('km_salida', value);
                        const salida = Number(value) || 0;
                        const llegada = Number(formik?.values.km_llegada) || 0;

                        formik?.setFieldValue(
                            'km_estimados',
                            llegada >= salida ? llegada - salida : 0
                        );
                    } },
                    { name: 'km_llegada', label: 'kilometraje Llegada', type: 'text', infoText: 'ej. 590889 kilometraje', onChange: (value, formik) => {
                        formik?.setFieldValue('km_llegada', value);
                        const llegada = Number(value) || 0;
                        const salida = Number(formik?.values.km_salida) || 0;

                        formik?.setFieldValue(
                            'km_estimados',
                            llegada >= salida ? llegada - salida : 0
                        );
                    } },
                    { name: 'km_estimados', label: 'Km. Estimados', type: 'text' , disabled: true },
                ]:[],
            ]
        }
    ];
    
    // fecha si es memorandum o reposicion
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    //yup.date().required('La fecha inicio es obligatoria').min(hoy,'Para memorándum o reposicion no se permiten fechas pasadas'),
    const validationSchema = yup
        .object({
            fid_bitacora_viaje: yup.string().required(),
            fecha_salida: yup.date().required(),
            fecha_retorno: isEdit?yup.date().required('La fecha de retorno es obligatoria').min(hoy,'No se permiten fechas pasadas'):yup.string(),
            hora_salida: yup.string().required(),
            hora_retorno: isEdit?yup.string().required():yup.string(),
            destino_salida: isEdit?yup.string().required():yup.string(),
            destino_llegada: yup.string().required(),
            km_salida: isEdit?yup.string().required():yup.string(),
            km_llegada: isEdit?yup.string().required():yup.string(),
            km_estimados:isEdit?yup.string().required():yup.string(),
            cantidad_personas: yup.number().required(),
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await BitacoraDetalleModuleService.createOrUpdateBitacoraDetalle(formData as unknown as BitacoraDetalleFormModel);
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

            const resultDestinos = await DestinoModuleService.getAllDestinos();
            if (!resultDestinos || !resultDestinos.success) return notify.error(resultDestinos.msg);

            if (isMounted()) {
                setDestinos(resultDestinos.rows || []);
            }
        };

        if (open) fetchData();
    }, [open, isMounted]);

    const zeroValues: BitacoraDetalleFormModel = {
        fid_bitacora_viaje: bitacoraViajeId,
        fecha_salida: new Date(),
        fecha_retorno: new Date(),
        hora_salida: '',
        hora_retorno: '',
        destino_salida: '',
        destino_llegada: '',
        km_salida: 0,
        km_llegada: 0,
        km_estimados: 0,
        cantidad_personas: 0,
    };

    const newFormModel = formModel && {
        id: formModel.id,
        fid_bitacora_viaje: formModel.fid_bitacora_viaje || bitacoraViajeId,
        fecha_salida: formModel.fecha_salida,
        fecha_retorno: formModel.fecha_retorno,
        hora_salida: formModel.hora_salida,
        hora_retorno: formModel.hora_retorno,
        destino_salida: formModel.destino_salida,
        destino_llegada: formModel.destino_llegada,
        km_salida: formModel.km_salida,
        km_llegada: formModel.km_llegada,
        km_estimados: formModel.km_estimados,
        cantidad_personas: formModel.cantidad_personas,
    };

    return (
        <FormDialog
            addTitle="Agregar bitacora detalle"
            editTitle="Editar bitacora detalle"
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
