import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
import { SelectOption, FormGroup, FormDialog, FormValue } from 'components/core/FormDialog';
import { DetalleDestinoModuleService } from '../DetalleDestinoModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';
import { parse as dateParse } from 'date-fns';

import { ENUM_SINO_2, ENUM_TIPO_TRANSPORTE_OP, TIME_FORMAT } from 'constants/enums';
import { OptionsFormModel } from 'modules/Types';
import { dateTest } from 'components/core/FormDialog/yup-tests';

export type DetalleDestinoFormModel = {
    id?                     : string;
    tipo_vehiculo_op        : string;
    objetivo_viaje          : string;
    destino_reg             : string;
    fecha_dia               : Date | null;
    hora_inicio             : string;
    hora_fin                : string;
    pernocte                : string;
    pasaje_ida              : number;
    pasaje_retorno          : number;
    total_pasaje_dia        : number;
    tipo_vehiculo_opvida     : string;
    tipo_vehiculo_opvuelta   : string;
    estado                  : string;

    modificacion?           : boolean;
    observacion?            : string;
    estado_observacion?      : string;  
    memorandum_id?          : string | null;
    viatico_id?             : string | null;
    vehiculo_id?            : string | null;
    destino_id?             : string | null;
    destino_id2?             : string | null;
    tipo_pcp?                :string;
    hay_viaje?              : string;
    provincia?               : string;

    _createdBy?: string;
    _createdAt?: string;
    _updatedBy?: string;
    _updatedAt?: string;
};

export type DetalleDestinoSumaPasajesFormModel = {
    id                           : string;
    pasaje_ida_suma              : string;
    pasaje_retorno_suma          : string;
    total_pasaje_dia             : string;   
};

type Props = {
    open: boolean;
    formModel?: DetalleDestinoFormModel;
    onComplete: () => void;
};

export const DetalleDestinoFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();

    const vehiculoOPOptions: SelectOption[] = ENUM_TIPO_TRANSPORTE_OP;

    const [areas, setDetalleDestinos] = useState<OptionsFormModel[]>([]);
    //corregir lo de areas
    const areasOptions: SelectOption[] = areas.map((item: OptionsFormModel) => ({ value: item.id || '', label: item.nombre }));

    const formLayout: FormGroup<DetalleDestinoFormModel>[] = [
        {
            title: '',
            grid: [
                [{ name: 'tipo_vehiculo_op', label: 'Tipo de vehiculo Oficial o publico', type: 'autocomplete', options:vehiculoOPOptions }],
                [{ name: 'objetivo_viaje', label: 'Describa el objetivo de viaje', type: 'textarea', infoText: 'ej. ' }], //type: 'autocomplete', options: areasOptions
                [{ name: 'destino_reg', label: 'Destino de Viaje', type: 'text', infoText: 'ej. Challapata' }], //type: 'autocomplete', options: areasOptions
                [
                    { name: 'fecha_dia', label: 'Fecha dia', type: 'datetime', infoText: 'ej. 12/02/2024' },
                    { name: 'hora_inicio', label: 'Hora inicio', type: 'time', infoText: 'HH:MM', format: TIME_FORMAT },
                    { name: 'hora_fin', label: 'Hora fin', type: 'time',infoText: 'HH:MM', format: TIME_FORMAT } // type: 'radio-group', options: padreOptions, inlineDisplay: true
                ],
                [
                    { name: 'pasaje_ida', label: 'Pasaje Ida', type: 'text', infoText: 'ej. 20' },
                    { name: 'pasaje_retorno', label: 'Pasaje Retorno', type: 'text', infoText: 'ej. 20' },
                    { name: 'total_pasaje_dia', label: 'Total pasaje', type: 'text', infoText: 'ej. 40' } // type: 'radio-group', options: padreOptions, inlineDisplay: true
                ]
            ]
        }
    ];

    const validationSchema = yup
        .object({
            tipo_vehiculo_op        : yup.string().required(),
            objetivo_viaje          : yup.string().required(),
            destino_reg             : yup.string().required(),
            fecha_dia               : yup.date().required(),
            hora_inicio             : yup.string().required().test(dateTest(TIME_FORMAT)),
            hora_fin                : yup.string().required().test(dateTest(TIME_FORMAT)), 
            pernocte                : yup.string().required(),           
            pasaje_ida              : yup.number().required(),
            pasaje_retorno          : yup.number().required(),
            total_pasaje_dia        : yup.number().required()
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await DetalleDestinoModuleService.createOrUpdateDetalleDestino(formData as unknown as DetalleDestinoFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        return onComplete();
    };

    const handleCancel = () => {
        onComplete();
    };

    const zeroValues: DetalleDestinoFormModel = {
        tipo_vehiculo_op         : '',
        objetivo_viaje           : '',
        destino_reg              : '',
        fecha_dia                : new Date(),
        hora_inicio              : '',
        hora_fin                 : '',
        pernocte                 : 'SIN PERNOCTE', 
        pasaje_ida               : 0,
        pasaje_retorno           : 0,
        total_pasaje_dia         : 0,
        tipo_vehiculo_opvida     : '',
        tipo_vehiculo_opvuelta   : '',
        estado                   : 'PENDIENTE',
        hay_viaje                : '',
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!isMounted()) return;
            const resultDetalleDestino = await DetalleDestinoModuleService.getAllDetalleDestino();
            if (!resultDetalleDestino || !resultDetalleDestino.success) return;
            const newDetalleDestinos = resultDetalleDestino.rows || [];
            if (isMounted()) setDetalleDestinos(newDetalleDestinos);
        };
        if (open) {
            fetchData();
        }
    }, [open, isMounted, formModel]);

    const newFormModel = formModel && {
        id                     : formModel.id,
        tipo_vehiculo_op       : formModel.tipo_vehiculo_op,
        objetivo_viaje         : formModel.objetivo_viaje,
        destino_reg            : formModel.destino_reg,
        fecha_dia              : formModel.fecha_dia,
        hora_inicio            : dateParse(formModel.hora_inicio, TIME_FORMAT, new Date()), 
        hora_fin               : dateParse(formModel.hora_fin, TIME_FORMAT, new Date()), 
        pernocte               : formModel.pernocte,
        pasaje_ida             : formModel.pasaje_ida,
        pasaje_retorno         : formModel.pasaje_retorno,
        total_pasaje_dia       : formModel.total_pasaje_dia,
        tipo_vehiculo_opvida   : formModel.tipo_vehiculo_opvida,
        tipo_vehiculo_opvuelta : formModel.tipo_vehiculo_opvuelta,
        estado                 : formModel.estado,  
        modificacion           : formModel.modificacion,
        observacion            : formModel.observacion,
        estado_observacion     : formModel.estado_observacion,
        memorandum_id       : formModel.memorandum_id,
        viatico_id          : formModel.viatico_id,
        vehiculo_id         : formModel.vehiculo_id,
        destino_id          : formModel.destino_id,
        destino_id2         : formModel.destino_id2,
        hay_viaje           : formModel.hay_viaje,
    };

    return (
        <FormDialog
            addTitle="Agregar Detalle Destino"
            editTitle="Editar Detalle Destino"
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
