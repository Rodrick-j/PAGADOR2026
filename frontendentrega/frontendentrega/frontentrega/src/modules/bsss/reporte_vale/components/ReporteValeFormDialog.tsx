import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
import { SelectOption, FormGroup, FormDialog, FormValue } from 'components/core/FormDialog';
import { ReporteValeModuleService } from '../ReporteValeModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';

import { ENUM_TIPO_VEHICULO } from 'constants/enums';
import { Options2FormModel } from 'modules/Types';
import { isNumberValidTest } from 'components/core/FormDialog/yup-tests';
import { useSession } from 'hooks/session';
import { ValeModuleService } from 'modules/bsss/vale';

export type ReporteValeFormModel = {

    //Tabla original de meorandum
    id             ?: number;
    fecha_emision   : Date | null;
    fecha_validez   : Date | null;
    litros          : number | string;
    distancia       : number | string;
    concepto        : string;
    precio_unitario : number;
    precio_total    : number;
    observaciones   : string;
    destino         : string;
    destinos        : string;
    otros?          : boolean;
    vehiculo_id?    : string;
    asignacion_id?  : string;
    usuario_id?     : string;

//Fechas de actualizacion
    _createdBy?: string;
    _createdAt?: string;
    _updatedBy?: string;
    _updatedAt?: string;

  // nuevos campos memorandum

};

export type VehiculoAperturaResponse = {
    nombre       : string,
    placa        : string,
    area         : string,
    asignacion   : string,
    inicial      : string,
    restante     : string,
    asignacion_id: string,
    vehiculo_id  : string,
};

type datosVehiculoProps = {
    nombre     : string,
    placa      : string,
    area       : string,
}

type datosAperturaProps = {
    vehiculo_id: string,
    asignacion_id: string,
    asignacion   : string,
    inicial    : string,
    restante   : string,
}

type Props = {
    open: boolean;
    formModel?: ReporteValeFormModel;
    //formModel2?:ReporteValeFormModelDetall;
    onComplete: () => void;
};

export const ReporteValeFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();
    const authUser = useSession();

    const sinoOptions: SelectOption[] = ENUM_TIPO_VEHICULO;

    const [loading, setLoading] = useState<boolean>(false);
    const [option, setOption] = useState<boolean>(false);

    const [datosVehiculo, setDatosVehiculo] = useState<datosVehiculoProps | null>(null);
    const [datosApertura, setDatosApertura] = useState<datosAperturaProps | null>(null);

    const [vehiculos, setVehiculos] = useState<Options2FormModel[]>([]);
    const vehiculosOptions: SelectOption[] = vehiculos.map((item: Options2FormModel) => ({ value: item.id || '', label: item.nombre, caption: item.concepto }));
    const [asignacions, setAperturas] = useState<Options2FormModel[]>([]);
    const asignacionsOptions: SelectOption[] = asignacions.map((item: Options2FormModel) => ({ value: item.id || '', label: item.nombre, caption: item.concepto }));
    const [destinos, setDestinos] = useState<Options2FormModel[]>([]);
    const destinosOptions: SelectOption[] = destinos.map((item: Options2FormModel) => ({ value: item.id || '', label: item.nombre, caption: item.concepto }));


 // Inicializa el estado del formulario basado en formModel o valores predeterminados
 const [formValues, setFormValues] = useState<ReporteValeFormModel>(() => ({
    ...{
        fecha_emision   : new Date(),
        fecha_validez   : new Date(),
        litros          : '',
        distancia       : '',
        concepto        : '',
        destino         : '',
        precio_unitario : 0,
        precio_total    : 0,
        observaciones   : '',
        destinos        : '',
        vehiculo_id     : datosApertura?.vehiculo_id,
        asignacion_id   : datosApertura?.asignacion_id,

    },
    ...formModel // Sobrescribe valores predeterminados con los valores del formModel
}));

   useEffect(() => {
    // Actualiza formValues cuando formModel cambie
    if (formModel) {
        setFormValues(prev => ({
            ...prev,
            ...formModel
        }));
      //  setUsuarioId(formModel.usuario_id!);
    }
}, [formModel]);


    const formLayout: FormGroup<ReporteValeFormModel>[] = [
        {
            title: '',
            grid: [
                [
                    {
                        name: 'vehiculo_id',
                        label: 'Seleccionar Vehiculo',
                        type: 'autocomplete',
                        options: vehiculosOptions,
                        onChange: (value, formik) => {
                            if(datosApertura?.vehiculo_id!==value) notify.warning("Esta seleccionado otro vehiculo que no es de su asignacion.");
                            if(datosApertura?.vehiculo_id===value) notify.info("Esta seleccionando su vehiculo.");

                            formik.setFieldValue('vehiculo_id', value);
                        },
                    }
                ],
                [
                    {
                        name: 'asignacion_id',
                        label: 'Seleccionar Apertura Programatica',
                        type: 'autocomplete',
                        fieldRequired: 'vehiculo_id',
                        options: asignacionsOptions,
                        onChange: (value, formik) => {
                            if(datosApertura?.asignacion_id!==value) notify.warning("Esta seleccionado otra Apertura Programatica OJO!!!.");
                            if(datosApertura?.asignacion_id===value) notify.info("Esta seleccionando su asignacion.");
                            formik.setFieldValue('asignacion_id', value);
                        },
                    }
                ],
                [
                    {
                        name: 'otros',
                        label: 'Tu vehiculo es:',
                        type: 'radio-group',
                        inlineDisplay: true,
                        options: sinoOptions,
                        onChange: (value, formik) => {
                            formik.setFieldValue('otros', value);

                            if('1'===value) setOption(true);
                            if('0'===value) setOption(false);
                        },
                    }
                ]
            ]
        },
        {
            title: 'Formulario del Vale',
            grid: [
                [
                    { name: 'fecha_emision', label: 'Fecha de Carga', type: 'datetime', fieldRequired: 'asignacion_id' },
                    { name: 'fecha_validez', label: 'Fecha de Emision', type: 'datetime', fieldRequired: 'asignacion_id' }
                ],
                [
                    { name: 'litros', label: 'Cantidad en Litros', type: 'text', fieldRequired: 'asignacion_id', infoText: 'ej. 60' },
                    { name: 'distancia', label: 'Distancia en Km.', type: 'text', fieldRequired: 'asignacion_id', infoText: 'ej. 125' }
                ],
                [  ],
                [
                    { name: 'concepto', label: 'La Cantidad es:', type: 'text', fieldRequired: 'asignacion_id', infoText: 'ej. SESENTA' },
                    { name: 'destino', label: 'Especifique el destino:', type: 'autocomplete', fieldRequired: 'asignacion_id', options: destinosOptions, infoText: 'ej. CHALLAPATA' }
                ],
                [ { name: 'destinos', label: 'Ingrese los destinos:', type: 'textarea', fieldRequired: 'asignacion_id', rows: 2, infoText: 'ej. CHALLAPATA, POOPO, etc.' } ],
                [ { name: 'observaciones', label: 'Observaciones:', type: 'textarea', rows: 2, fieldRequired: 'asignacion_id' } ]
            ]
        },

    ];



      const validationSchema = yup
        .object({

            vehiculo_id  : yup.string().required(),
            asignacion_id: yup.string().required(),
            fecha_emision: yup.string().required(),
            fecha_validez: yup.string().required(),
            litros       : yup.number().required().test(isNumberValidTest()),
            distancia    : yup.number().required().test(isNumberValidTest()),
            concepto     : yup.string().required(),
            destino      : yup.string().required(),

        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await ReporteValeModuleService.createOrUpdateReporteVale(formData as unknown as ReporteValeFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        limpiarFormulario();
        return onComplete();
    };

    const handleCancel = () => {
        limpiarFormulario();
        onComplete();
    };

    const zeroValues: ReporteValeFormModel = {

        fecha_emision   : new Date(),
        fecha_validez   : new Date(),
        litros          : '',
        distancia       : '',
        concepto        : '',
        destino         : '',
        precio_unitario : 0,
        precio_total    : 0,
        observaciones   : '',
        destinos        : '',
        vehiculo_id     : datosApertura?.vehiculo_id,
        asignacion_id   : datosApertura?.asignacion_id,

    };

     // Función para limpiar el formulario
  const limpiarFormulario = () => {
    setFormValues(zeroValues); // Restablece el estado a su valor inicial
  };


    useEffect(() => {
        const fetchData = async () => {
            if (!isMounted()) return;
          const resultVehiculo = await ValeModuleService.getAllVehiculos({ id: option });
            if (!resultVehiculo || !resultVehiculo.success) return;
            const vehiculosRows = resultVehiculo.rows || [];
            const resultApertura = await ValeModuleService.getAllAperturas();
            if (!resultApertura || !resultApertura.success) return;
            const asignacionsRows = resultApertura.rows || [];
            const resultDestino = await ValeModuleService.getAllDestinos();
            if (!resultDestino || !resultDestino.success) return;
            const destinosRows = resultDestino.rows || [];

            const vehiculoAperturaResponse = await ReporteValeModuleService.obtenerDatosVehiculoApertura();
            if (!vehiculoAperturaResponse.success) return;
            const newVehiculoApertura = vehiculoAperturaResponse.data;
           if (isMounted()) {
                setVehiculos(vehiculosRows);
                setAperturas(asignacionsRows);
                setDestinos(destinosRows);
                setLoading(false);
                setDatosVehiculo({
                    nombre: newVehiculoApertura.nombre,
                    placa : newVehiculoApertura.placa,
                    area  : newVehiculoApertura.area
                });
                setDatosApertura({
                    vehiculo_id  : newVehiculoApertura.vehiculo_id,
                    asignacion_id: newVehiculoApertura.asignacion_id,
                    asignacion   : newVehiculoApertura.asignacion,
                    inicial      : newVehiculoApertura.inicial,
                    restante     : newVehiculoApertura.restante
                });
            };              //  setAreas(newAreas);
             
        };

        if (open) {
            fetchData();
        }
    }, [open, isMounted, formModel]);
     const newFormModel = formModel && {
        id                    : formModel.id,
       fecha_emision   : new Date(),
        fecha_validez   : new Date(),
        litros          : '',
        distancia       : '',
        concepto        : '',
        destino         : '',
        precio_unitario : 0,
        precio_total    : 0,
        observaciones   : '',
        destinos        : '',
        vehiculo_id     : datosApertura?.vehiculo_id,
        asignacion_id   : datosApertura?.asignacion_id,


    };



   /* const newFormModel2 = formModel2 && {
        id                    : formModel2.id,
        cod_depart_memo       : formModel2.cod_depart_memo,
        fecha_inicio_viaje    : formModel2.fecha_inicio_viaje,
        fecha_fin_viaje       : formModel2.fecha_fin_viaje,
        cantidad_dias         : formModel2.cantidad_dias,

    };*/

      return (
        <FormDialog
            addTitle="Agregar Memorandum"
            editTitle="Editar Memorandum"
            open={open}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialValues={formValues}
            formLayout={formLayout}
            validationSchema={validationSchema}
           // debug
            isEdit={typeof formModel !== 'undefined'}
        />
    );
};
