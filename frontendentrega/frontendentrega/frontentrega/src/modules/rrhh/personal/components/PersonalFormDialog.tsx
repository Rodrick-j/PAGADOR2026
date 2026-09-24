import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
import { SelectOption, FormGroup, FormDialog, FormValue } from 'components/core/FormDialog';
import { PersonalModuleService } from '../PersonalModuleService';
import { useNotify } from 'services/notify';
import { ENUM_AFP, ENUM_CIUDAD, ENUM_ESTADO_CIVIL, ENUM_GENERO, ENUM_SINO } from 'constants/enums';
import { useIsMounted } from 'hooks/useIsMounted';
import { UsersModuleService } from 'modules/system/users';
import { CargoModuleService } from 'modules/rrhh/cargo';
import { AreaModuleService } from 'modules/rrhh/area';
import { OptionsFormModel } from 'modules/Types';

export type PersonalFormModel = {
    id                    ?: number;
    nombres                : string;
    apellido_paterno       : string;
    apellido_materno       : string;
    apellido_casada        : string;
    ci                     : string;
    expedicion             : string;
    sexo                   : string;
    fecha_nacimiento       : Date;
    fecha_ingreso          : Date;
    estado_civil           : string;
    profesion              : string;
    telefono               : string;
    direccion              : string;
    afp                    : string;
    activo                 : boolean;
    rentista               : number;
    fecha_presentacion_cas : Date | null;
    anhos_antiguedad_gador : number;
    anhos_antiguedad_cas   : number;
    meses_antiguedad_cas   : number;
    dias_antiguedad_cas    : number;
    usuario_id?            : string | null;
    area_id?               : string | null;
    cargo_id?              : string | null;

    _createdBy?: string;
    _createdAt?: string;
    _updatedBy?: string;
    _updatedAt?: string;
};

type Props = {
    open: boolean;
    formModel?: PersonalFormModel;
    onComplete: () => void;
};

export const PersonalFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();
    const initValueDate = new Date();
    const generoOptions: SelectOption[] = ENUM_GENERO;
    const afpOptions: SelectOption[] = ENUM_AFP;
    const expedicionOptions: SelectOption[] = ENUM_CIUDAD;
    const estadoCivilOptions: SelectOption[] = ENUM_ESTADO_CIVIL;
    const rentistaOptions: SelectOption[] = ENUM_SINO;

    const [usuarios, setUsuarios] = useState<OptionsFormModel[]>([]);
    const [cargos, setCargos] = useState<OptionsFormModel[]>([]);
    const [areas, setAreas] = useState<OptionsFormModel[]>([]);
    const usuariosOptions: SelectOption[] = usuarios.map((item: OptionsFormModel) => ({ value: item.id || '', label: item.nombre }));
    const cargosOptions: SelectOption[] = cargos.map((item: OptionsFormModel) => ({ value: item.id || '', label: item.nombre }));
    const areasOptions: SelectOption[] = areas.map((item: OptionsFormModel) => ({ value: item.id || '', label: item.nombre }));

    const formLayout: FormGroup<PersonalFormModel>[] = [
        {
            title: '',
            grid: [
                [{ name: 'nombres', label: 'Nombres', type: 'text' }],
                [
                    { name: 'apellido_paterno', label: 'Ap. Paterno', type: 'text' },
                    { name: 'apellido_materno', label: 'Ap. Materno', type: 'text' },
                    { name: 'apellido_casada', label: 'Ap. Casada', type: 'text' },
                ],
                [
                    { name: 'ci', label: 'Carnet', type: 'text' },
                    { name: 'expedicion', label: 'Exp', type: 'select', options: expedicionOptions },
                    { name: 'sexo', label: 'Genero', type: 'select', options: generoOptions }
                ],
                [
                    { name: 'profesion', label: 'Profesion', type: 'text' },
                ],
                [
                    { name: 'fecha_ingreso', label: 'Fecha Ingreso', type: 'date' },
                    { name: 'fecha_nacimiento', label: 'Fecha Nacimiento', type: 'datetime' },
                    { name: 'estado_civil', label: 'Estado Civil', type: 'select', options: estadoCivilOptions },
                ],
                [
                    { name: 'direccion', label: 'Direccion', type: 'text'},
                ],
                [
                    { name: 'telefono', label: 'Telefono', type: 'text'},
                    { name: 'afp', label: 'AFP', type: 'select', options: afpOptions},
                    { name: 'rentista', label: 'Rentista', type: 'radio-group', options: rentistaOptions, inlineDisplay: true },
                ]
            ]
        },
        {
            title: 'Registro CAS',
            grid: [
                [
                    { name: 'anhos_antiguedad_gador', label: 'Años Antiguedad GADOR', type: 'text' },
                    { name: 'fecha_presentacion_cas', label: 'Fecha Presentacion CAS', type: 'datetime' },
                ],
                [
                    { name: 'anhos_antiguedad_cas', label: 'Años Antiguedad CAS', type: 'text' },
                    { name: 'meses_antiguedad_cas', label: 'Meses Antiguedad CAS', type: 'text' },
                    { name: 'dias_antiguedad_cas', label: 'Dias Antiguedad CAS', type: 'text' },
                ],
            ]
        },
        {
            title: 'Registro a la institucion',
            grid: [
                [{ name: 'area_id', label: 'Area/ Unidad / Secretaria', type: 'autocomplete', options: areasOptions }],
                [{ name: 'cargo_id', label: 'Cargo', type: 'autocomplete', options: cargosOptions }],
            ]
        },
        {
            title: 'Registro de usuario',
            grid: [
                [{ name: 'usuario_id', label: 'Usuario', type: 'autocomplete', options: usuariosOptions }],
            ]
        }
    ];

    const validationSchema = yup
        .object({
            nombres: yup.string().required(),
            apellido_paterno: yup.string().required(),
            apellido_materno: yup.string(),
            ci: yup.string().required(),
            sexo: yup.string().required(),
            fecha_ingreso : yup.string().required(),
            fecha_nacimiento : yup.string().required(),
            estado_civil: yup.string().required(),
            telefono : yup.string().required()
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await PersonalModuleService.createOrUpdatePersonal(formData as unknown as PersonalFormModel);
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
            const resultUsuario = await UsersModuleService.getAllUsuarios();
            if (!resultUsuario || !resultUsuario.success) return;
            const newUsuarios = resultUsuario.rows || [];
            const resultCargos = await CargoModuleService.getAllCargos();
            if (!resultCargos || !resultCargos.success) return;
            const newCargos = resultCargos.rows || [];
            const resultAreas = await AreaModuleService.getAllArea();
            if (!resultAreas || !resultAreas.success) return;
            const newAreas = resultAreas.rows || [];
            if (isMounted()) {

                setUsuarios(newUsuarios);
                setCargos(newCargos);
                setAreas(newAreas);
            };
        };
        if (open) {
            fetchData();
        }
    }, [open, isMounted, formModel]);

    const zeroValues: PersonalFormModel = {
        nombres               : '',
        apellido_paterno      : '',
        apellido_materno      : '',
        apellido_casada       : '',
        ci                    : '',
        expedicion            : '',
        sexo                  : '',
        fecha_nacimiento      : initValueDate,
        fecha_ingreso         : initValueDate,
        estado_civil          : '',
        profesion             : '',
        telefono              : '',
        direccion             : '',
        afp                   : '',
        activo                : true,
        rentista              : 0,
        fecha_presentacion_cas: null,
        anhos_antiguedad_gador: 0,
        anhos_antiguedad_cas  : 0,
        meses_antiguedad_cas  : 0,
        dias_antiguedad_cas   : 0,
        usuario_id            : '',
        area_id               : '',
        cargo_id              : '',
    };

    const newFormModel = formModel && {
        id                    : formModel.id,
        nombres               : formModel.nombres,
        apellido_paterno      : formModel.apellido_paterno,
        apellido_materno      : formModel.apellido_materno,
        apellido_casada       : formModel.apellido_casada,
        ci                    : formModel.ci,
        expedicion            : formModel.expedicion,
        sexo                  : formModel.sexo,
        fecha_nacimiento      : formModel.fecha_nacimiento,
        fecha_ingreso         : formModel.fecha_ingreso,
        estado_civil          : formModel.estado_civil,
        profesion             : formModel.profesion,
        telefono              : formModel.telefono,
        direccion             : formModel.direccion,
        afp                   : formModel.afp,
        rentista              : formModel.rentista,
        activo                : formModel.activo,
        fecha_presentacion_cas: formModel.fecha_presentacion_cas || null,
        anhos_antiguedad_gador: formModel.anhos_antiguedad_gador,
        anhos_antiguedad_cas  : formModel.anhos_antiguedad_cas,
        meses_antiguedad_cas  : formModel.meses_antiguedad_cas,
        dias_antiguedad_cas   : formModel.dias_antiguedad_cas,
        usuario_id            : formModel.usuario_id,
        area_id               : formModel.area_id,
        cargo_id              : formModel.cargo_id,
    };

    return (
        <FormDialog
            addTitle="Agregar personal"
            editTitle="Editar personal"
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

