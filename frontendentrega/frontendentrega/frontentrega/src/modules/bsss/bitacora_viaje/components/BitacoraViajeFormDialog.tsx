import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
import { FormGroup, FormDialog, FormValue, SelectOption } from 'components/core/FormDialog';
import { BitacoraViajeModuleService } from '../BitacoraViajeModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';
import { VehiculoModuleService } from 'modules/bsss/vehiculo';
import { OptionsFormModel } from 'modules/Types';

export type BitacoraViajeFormModel = {
    id         ?: string;
    area_id     : string;
    semana      : string;
    vehiculo_id : string;
};

type Props = {
    open: boolean;
    formModel?: BitacoraViajeFormModel;
    onComplete: () => void;
};


export const BitacoraViajeFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();

    const [vehiculos, setVehiculos] = useState<OptionsFormModel[]>([]);

    const vehiculoOptions: SelectOption[] = vehiculos.map((item) => ({ value: item.id || '', label: item.nombre }));

    const getSemanaOptions = (): SelectOption[] => {
        const year = new Date().getFullYear();

        const meses = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];

        const formatDate = (date: Date): string => {
            return `${date.getDate()} de ${meses[date.getMonth()]}`;
        };

        const getMondayByWeek = (week: number): Date => {
            const firstDayOfYear = new Date(year, 0, 1);
            const dayOfWeek = firstDayOfYear.getDay() || 7;

            const monday = new Date(firstDayOfYear);
            monday.setDate(firstDayOfYear.getDate() - dayOfWeek + 1 + (week - 1) * 7);

            return monday;
        };

        return Array.from({ length: 53 }, (_, index) => {
            const week = index + 1;

            const startDate = getMondayByWeek(week);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);

            return {
                value: String(week),
                label: `Semana ${week} (${formatDate(startDate)} al ${formatDate(endDate)})`
            };
        });
    };

    const getCurrentWeek = (): string => {
        const now = new Date();
        const year = now.getFullYear();

        const firstDayOfYear = new Date(year, 0, 1);
        const dayOfWeek = firstDayOfYear.getDay() || 7;

        const firstMonday = new Date(firstDayOfYear);
        firstMonday.setDate(firstDayOfYear.getDate() - dayOfWeek + 1);

        const diff = now.getTime() - firstMonday.getTime();

        return String(Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1);
    };

    const semanaOptions: SelectOption[] = getSemanaOptions();

    const formLayout: FormGroup<BitacoraViajeFormModel>[] = [
        {
            title: '',
            grid: [
                [{ name: 'semana', label: 'Semana', type: 'select', options: semanaOptions }],
                [{ name: 'vehiculo_id', label: 'Vehiculo', type: 'autocomplete', options: vehiculoOptions }],
            ]
        }
    ];

    const validationSchema = yup
        .object({
            semana     : yup.string().required(),
            vehiculo_id: yup.string().required(),
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await BitacoraViajeModuleService.createOrUpdateBitacoraViaje(formData as unknown as BitacoraViajeFormModel);
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

            const resultVehiculo = await VehiculoModuleService.getAllVehiculos();
            if (!resultVehiculo || !resultVehiculo.success) return notify.error(resultVehiculo.msg);

            if (isMounted()) {
                setVehiculos(resultVehiculo.rows || []);
            }
        };

        if (open) fetchData();
    }, [open, isMounted]);

    const zeroValues: BitacoraViajeFormModel = {
        semana     : getCurrentWeek(),
        area_id    : '',
        vehiculo_id: '',
    };

    const newFormModel = formModel && {
        id         : formModel.id,
        area_id    : formModel.area_id,
        semana     : formModel.semana,
        vehiculo_id: formModel.vehiculo_id,
    };

    return (
        <FormDialog
            addTitle="Agregar BitacoraViaje"
            editTitle="Editar BitacoraViaje"
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
