import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
import { SelectOption, FormGroup, FormDialog, FormValue } from 'components/core/FormDialog';
import { VehiculoModuleService } from '../VehiculoModuleService';
import { useNotify } from 'services/notify';
import { ENUM_TIPO_VEHICULO } from 'constants/enums';
import { AreaModuleService } from 'modules/rrhh/area';
import { useIsMounted } from 'hooks/useIsMounted';
import { OptionsFormModel } from 'modules/Types';
import { PersonalModuleService } from 'modules/rrhh/personal';

export type VehiculoFormModel = {
    id?: number;
    cod_activo : string;
    num_placa  : string;
    tipo       : string;
    marca      : string;
    carga      : string;
    observacion: string;
    estado     : boolean;
    personal_id?: string;
    area_id?    : string;

    _createdBy?: string;
    _createdAt?: string;
    _updatedBy?: string;
    _updatedAt?: string;
};

type Props = {
    open: boolean;
    formModel?: VehiculoFormModel;
    onComplete: () => void;
};

export const VehiculoFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();

    const tipoOptions: SelectOption[] = ENUM_TIPO_VEHICULO;

    const [areas, setArea] = useState<OptionsFormModel[]>([]);
    const areaOptions: SelectOption[] = areas.map((item: OptionsFormModel) => ({ value: item.id || '', label: item.nombre }));

    const [personals, setPersonal] = useState<OptionsFormModel[]>([]);
    const personalOptions: SelectOption[] = personals.map((item: OptionsFormModel) => ({ value: item.id || '', label: item.nombre }));

    const formLayout: FormGroup<VehiculoFormModel>[] = [
        {
            title: 'Emparejamiento con el Vehiculo/Personal',
            grid: [
                [{ name: 'area_id', label: 'Secretaria/Unidad o Programa', type: 'autocomplete', options: areaOptions }],
                [{ name: 'personal_id', label: 'Nombre del Conductor', type: 'autocomplete', options: personalOptions }],
            ]
        },
        {
            title: 'Datos del Vehiculo',
            grid: [
                [
                    { name: 'cod_activo', label: 'Codigo Activo', type: 'text', infoText: 'ej. 05-12345' },
                    { name: 'num_placa', label: 'Nro. Placa/Chasis', type: 'text', infoText: 'ej. 1234-ABC/12345678901011ABC' },
                ],
                [
                    { name: 'carga', label: 'Carga', type: 'select', options: tipoOptions },
                    { name: 'tipo', label: 'Tipo', type: 'text', infoText: 'ej. VAGONETA' },
                    { name: 'marca', label: 'Marca', type: 'text', infoText: 'ej. NISSAN' },
                ],
                [{ name: 'observacion', label: 'Observacion', type: 'textarea', rows: 2 }]
            ]
        }
    ];

    const validationSchema = yup
        .object({
            cod_activo : yup.string().required(),
            num_placa  : yup.string().required(),
            marca      : yup.string().required(),
            tipo       : yup.string().required(),
            carga      : yup.string().required(),
            personal_id: yup.string().required(),
            area_id    : yup.string().required(),
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await VehiculoModuleService.createOrUpdateVehiculo(formData as unknown as VehiculoFormModel);
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
                setPersonal(newPersonals);
                setArea(areas);
            };
        };
        if (open) {
            fetchData();
        }
    }, [open, isMounted, formModel]);

    const zeroValues: VehiculoFormModel = {
        cod_activo : '',
        num_placa  : '',
        tipo       : '',
        marca      : '',
        carga      : '',
        estado     : true,
        observacion: '',
    };

    const newFormModel = formModel && {
        id         : formModel.id,
        cod_activo : formModel.cod_activo,
        num_placa  : formModel.num_placa,
        tipo       : formModel.tipo,
        marca      : formModel.marca,
        carga      : formModel.carga,
        observacion: formModel.observacion,
        estado     : formModel.estado,
        personal_id: formModel.personal_id,
        area_id    : formModel.area_id,
    };

    return (
        <FormDialog
            addTitle="Agregar vehiculo"
            editTitle="Editar vehiculo"
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
