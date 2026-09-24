import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
import { SelectOption, FormGroup, FormDialog, FormValue, MyFormModel } from 'components/core/FormDialog';
import { VacacionModuleService } from '../VacacionModuleService';
import { useNotify } from 'services/notify';
import { ENUM_GESTION_PERIODO, ENUM_TIPO_VACACION } from 'constants/enums';
import { useIsMounted } from 'hooks/useIsMounted';
import { OptionsFormModel } from 'modules/Types';
import { AreaModuleService } from 'modules/rrhh/area';
import { afterDateTest, dateTest } from 'components/core/FormDialog/yup-tests';
import { FormikProps } from 'formik';

export type VacacionFormModel = {
    id?           : number;
    fecha_registro: Date;
    tipo_vacacion : string;
    fecha_ini     : Date;
    fecha_fin     : Date;
    estado        : string;
    gestion       : string;
    usuario_id    : string;
    jefe_id       : string;
    area_id       : string;

    _createdBy?: string;
    _createdAt?: string;
    _updatedBy?: string;
    _updatedAt?: string;
};

type Props = {
    open: boolean;
    formModel?: VacacionFormModel;
    onComplete: () => void;
};

export type PersonalOptionsFormModel  = {
    id: string;
    nombre: string;
}

const FORMAT = 'dd/MM/yyyy HH:mm';

export const VacacionFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();
    const [usuarios, setUsuarios] = useState<OptionsFormModel[]>([]);
    const usuariosOptions: SelectOption[] = usuarios.map((item: OptionsFormModel) => ({ value: item.id || '', label: item.nombre }));

    const [areas, setAreas] = useState<OptionsFormModel[]>([]);
    const areasOptions: SelectOption[] = areas.map((item: OptionsFormModel) => ({ value: item.id || '', label: item.nombre }));

    const [areaId, setAreaId] = useState<string>("");

    const tipoVacacionOptions: SelectOption[] = ENUM_TIPO_VACACION;
    const gestionOptions: SelectOption[] = ENUM_GESTION_PERIODO;

    const actualizarJefe = async (area_id: string, formik?: FormikProps<MyFormModel>) => {
        if(area_id) {
            const datosVehiculoResult = await VacacionModuleService.getAllUsuarioArea(area_id);
            if (!datosVehiculoResult.success) return notify.error(datosVehiculoResult.msg);
            setUsuarios(datosVehiculoResult.rows || []);
            setAreaId(area_id);
        }
    }

    const formLayout: FormGroup<VacacionFormModel>[] = [
        {
            title: 'Seleccion Area  y Jefe Inmediato',
            grid: [
                [
                    {
                        name: 'area_id',
                        label: 'Seleccionar Area',
                        type: 'autocomplete',
                        options: areasOptions,
                        onChange: (value, formik) => {
                            formik.setFieldValue('area_id', value);
                            actualizarJefe(String(value), formik);
                        },
                    }
                ],
                [{ name: 'jefe_id', label: 'Jefe Inmediato', type: 'autocomplete', options: usuariosOptions }],
            ]
        },
        {
            title: '',
            grid: [
                [
                    { name: 'tipo_vacacion', label: 'Tipo de Vacacion', type: 'select', options: tipoVacacionOptions },
                    { name: 'gestion', label: 'Gestion', type: 'select', options: gestionOptions },
                ],
                [
                    { name: 'fecha_ini', label: 'Fecha Inicio', type: 'datetime', format: FORMAT  },
                    { name: 'fecha_fin', label: 'Fecha Final', type: 'datetime', format: FORMAT  }
                ]
            ]
        }
    ];

    const whenFechaInicio = (fechaInicioValue: string, schema: yup.StringSchema) => {
        return schema.test(afterDateTest(fechaInicioValue, FORMAT, 'Debe ser posterior a la Fecha de inicio'));
    };

    const validationSchema = yup
        .object({
            fecha_ini    : yup.string().required().test(dateTest(FORMAT)),
            fecha_fin    : yup.string().required().test(dateTest(FORMAT)).when('fecha_ini', whenFechaInicio),
            gestion      : yup.string().required(),
            tipo_vacacion: yup.string().required(),
            area_id      : yup.string().required(),
            jefe_id      : yup.string().required(),
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await VacacionModuleService.createOrUpdateVacacion(formData as unknown as VacacionFormModel);
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

            if (isMounted()) setAreas(areas);
        };
        if (open) {
            fetchData();
        }
    }, [open, isMounted]);

    const zeroValues: VacacionFormModel = {
        fecha_registro: new Date(),
        tipo_vacacion : '',
        fecha_ini     : new Date(),
        fecha_fin     : new Date(),
        estado        : 'PENDIENTE',
        gestion       : '',
        usuario_id    : '',
        jefe_id       : '',
        area_id       : areaId,
    };

    const newFormModel = formModel && {
        id            : formModel.id,
        fecha_registro: formModel.fecha_registro,
        tipo_vacacion : formModel.tipo_vacacion,
        fecha_ini     : formModel.fecha_ini,
        fecha_fin     : formModel.fecha_fin,
        estado        : formModel.estado,
        gestion       : formModel.gestion,
        usuario_id    : formModel.usuario_id,
        jefe_id       : formModel.jefe_id,
        area_id       : formModel.area_id,
    };

    return (
        <FormDialog
            addTitle="Agregar vacacion"
            editTitle="Editar vacacion"
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

