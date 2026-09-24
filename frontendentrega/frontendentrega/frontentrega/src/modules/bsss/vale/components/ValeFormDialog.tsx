import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
import { SelectOption, FormGroup, FormDialog, FormValue, MyFormModel } from 'components/core/FormDialog';
import { ValeModuleService } from '../ValeModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';
import { LinearProgress, Stack } from '@mui/material';
import Cardify from 'components/Cardify';
import { Options2FormModel } from 'modules/Types';

import useResponsive from 'hooks/useResponsive';
import { FormikProps } from 'formik';
import { PENDIENTE } from 'constants/enums';

export type ValeFormModel = {
    id             ?: number;
    fecha_emision   : Date;
    fecha_validez   : Date;
    litros          : number | string;
    distancia       : number | string;
    observaciones   : string;
    destino         : string;
    destinos        : string;
    otro_vehiculo   : string;
    cod_vale        : string;
    vehiculo_id?    : string;
    asignacion_id?  : string;
    usuario_id?     : string;
    numero_recibo?  : number;

    litros_reales?  : number;
    precio_real?    : number;
    numero_factura? : number;
    fecha_factura?  : Date;
    estado_ejecutado?: string; 
    pre_asignacion?   : number; 
};

type Props = {
    open: boolean;
    formModel?: ValeFormModel | undefined;
    onComplete: () => void;
};

const sino = [
    { id: 1, label: 'Otro Vehiculo' },
    { id: 0, label: 'Propio' },
];

export type VehiculoAperturaResponse = {
    nombre       : string,
    placa        : string,
    area         : string,
    apertura     : string,
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
    vehiculo_id  : string,
    asignacion_id: string,
    asignacion   : string,
    inicial      : string,
    restante     : string,
}

export const ValeFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();
    const isMobile = useResponsive('down', 'md');

    const [loading, setLoading] = useState<boolean>(false);
    const isValid = (formModel?.vehiculo_id?.length ?? 0) > 0;
    const [option, setOption] = useState<boolean>(isValid);

    const [vehiculoId, setVehiculoId] = useState<string>(formModel?.vehiculo_id || "");
    const [asignacionId, setAsignacionId] = useState<string>(formModel?.asignacion_id || "");

    const [datosVehiculo, setDatosVehiculo] = useState<datosVehiculoProps | null>(null);
    const [datosApertura, setDatosApertura] = useState<datosAperturaProps | null>(null);

    const [aperturas, setAperturas] = useState<Options2FormModel[]>([]);
    const aperturasOptions: SelectOption[] = aperturas.map((item: Options2FormModel) => ({ value: item.id || '', label: item.nombre, caption: item.concepto }));

    const [vehiculos, setVehiculos] = useState<Options2FormModel[]>([]);
    const vehiculosOptions: SelectOption[] = vehiculos.map((item: Options2FormModel) => ({ value: item.id || '', label: item.nombre, caption: item.concepto }));

    const [destinos, setDestinos] = useState<Options2FormModel[]>([]);
    const destinosOptions: SelectOption[] = destinos.map((item: Options2FormModel) => ({ value: item.id || '', label: item.nombre, caption: item.concepto }));

    const sinoOptions: SelectOption[] = sino.map((item) => ({ value: item.id, label: item.label }));

    const actualizarAsignacion = async (asignacionId: string, formik: FormikProps<MyFormModel>) => {
        const datosAperturaResult = await ValeModuleService.getByIdApertura(asignacionId);
        if (!datosAperturaResult.success) return notify.error(datosAperturaResult.msg);
        const dataApertura = datosAperturaResult.data;
        setAsignacionId(asignacionId);
        datosApertura && setDatosApertura({
            vehiculo_id  : dataApertura.vehiculo_id,
            asignacion_id: dataApertura.asignacion_id,
            asignacion   : dataApertura.asignacion,
            inicial      : dataApertura.inicial,
            restante     : dataApertura.restante
        });
        const datosVehiculoResult = await ValeModuleService.getByIdVehiculo(dataApertura.vehiculo_id || null);
        if (!datosVehiculoResult.success) {
            setVehiculoId("");
            setDatosVehiculo({
                nombre: "",
                placa: "",
                area: ""
            });
            return notify.error(datosVehiculoResult.msg);
        }
        setDatosVehiculo(datosVehiculoResult.data);
        setVehiculoId(dataApertura.vehiculo_id);
    }

    const actualizarVehiculo = async (vehiculoId: string, formik: FormikProps<MyFormModel>) => {
        const datosVehiculoResult = await ValeModuleService.getByIdVehiculo(vehiculoId || null);
        if (!datosVehiculoResult.success) return notify.error(datosVehiculoResult.msg);
        setDatosVehiculo(datosVehiculoResult.data);
        setVehiculoId(vehiculoId);
    }

    const formLayout: FormGroup<ValeFormModel>[] = [
        {
            title: '',
            grid: [
                [
                    {
                        name: 'otro_vehiculo',
                        label: 'Tu vehiculo es:',
                        type: 'radio-group',
                        inlineDisplay: true,
                        options: sinoOptions,
                        onChange: (value, formik) => {
                            formik.setFieldValue('otro_vehiculo', value);
                            if('1'===value) setOption(true);
                            if('0'===value) setOption(false);
                        },
                        disabled: formModel !== undefined
                    }
                ],
                [
                    {
                        name: 'asignacion_id',
                        label: 'Seleccionar Apertura',
                        type: 'autocomplete',
                        options: aperturasOptions,
                        onChange: (value, formik) => {
                            formik.setFieldValue('asignacion_id', value);
                            if(value) actualizarAsignacion(String(value), formik);
                        },
                        disabled: formModel !== undefined
                    }
                ],
                [
                    {
                        name: 'vehiculo_id',
                        label: 'Seleccionar Vehiculo',
                        type: 'autocomplete',
                        fieldRequired: 'asignacion_id',
                        options: vehiculosOptions,
                        onChange: (value, formik) => {
                            formik.setFieldValue('vehiculo_id', value);
                            if(value) actualizarVehiculo(String(value), formik);
                            if(datosApertura?.vehiculo_id!==value) notify.warning("Esta seleccionado otro vehiculo que no es de su apertura.");
                        },
                        disabled: formModel !== undefined
                    }
                ]
            ]
        },
        {
            title: 'Formulario del Vale',
            grid: [
                [
                    { name: 'fecha_emision', label: 'Fecha de Carga', type: 'datetime', fieldRequired: 'asignacion_id' },
                    { name: 'fecha_validez', label: 'Fecha de Validez', type: 'datetime', fieldRequired: 'asignacion_id' }
                ],
                [{ name: 'destino', label: 'Ingrese el destino:', type: 'autocomplete', options: destinosOptions, fieldRequired: 'asignacion_id', infoText: 'ej. CHALLAPATA' }],
                [
                    { name: 'litros', label: 'Cantidad en Litros', type: 'text', infoText: 'ej. 60', fieldRequired: 'asignacion_id' },
                    { name: 'distancia', label: 'Distancia en Km.', type: 'text', infoText: 'ej. 125', fieldRequired: 'asignacion_id' },
                    { name: 'numero_recibo', label: 'Nº Vale Manual', type: 'text', infoText: 'ej. 000965', fieldRequired: 'asignacion_id' }
                ],
                [ { name: 'destinos', label: 'Especifique los destinos:', type: 'textarea', rows: 2, fieldRequired: 'asignacion_id', infoText: 'ej. CHALLAPATA, POOPO, etc.' } ],
                [ { name: 'observaciones', label: 'Observaciones:', type: 'textarea', rows: 2, fieldRequired: 'asignacion_id' } ]
            ]
        },
    ];

    const isSinPresupuesto = async (litros: number, idAsignacion: string, idVehiculo: string) => {
        const result = await ValeModuleService.getSinPresupuestoData(litros, idAsignacion, idVehiculo);
        const exists = Boolean(result.data.saldo);
        return !exists;
    };

    const validationSchema = yup
        .object({
            vehiculo_id  : yup.string().required(),
            fecha_emision: yup.date().required(),
            fecha_validez: yup.date().min(yup.ref('fecha_emision'), 'La fecha validez no puede ser anterior a la fecha carga'),
            litros       : yup.string()
                                    .required('Los litros es requerido.')
                                    .matches(/^\d+(\.\d{1,2})?$/, 'El valor debe ser un número válido con hasta dos decimales.')
                                    .test('sin-espacios', 'El número no debe contener espacios en blanco.', function (value) {
                                        return value === value?.trim();
                                    })
                                    .test('sin-presupuesto', 'No cuenta con saldo restante suficiente.', async (value, context) => {
                                        const asignacion_id = context.parent.asignacion_id;
                                        const vehiculo_id = context.parent.vehiculo_id;
                                        if (value !== undefined && asignacion_id!== undefined && vehiculo_id!== undefined) {
                                            return await isSinPresupuesto(Number(value), asignacion_id, vehiculo_id);
                                        }
                                        return true;
                                    })
                                    .min(1,"Debe ser Mayor o igual a 1 (uno)"),
            distancia    : yup.string().required('La distancia es requerida.')
                                    .matches(/^\d+$/, 'El valor debe ser un número sin espacios ni caracteres no válidos.')
                                    .test('sin-espacios', 'El número no debe contener espacios en blanco.', function (value) {
                                        return value === value?.trim();
                                    }),
            destino      : yup.string().required(),
            numero_recibo: yup.number().required("Debe ingresar el numero de recibo del vale manual"),
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
            const result = await ValeModuleService.createOrUpdateVale(formData as unknown as ValeFormModel);
            if (!result.success) return notify.error(result.msg);
            notify.success(result.msg);
            setOption(false);
            return onComplete();
    };

    const handleCancel = () => {
        onComplete();
    };

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            if (!isMounted()) return;
            const resultVehiculo = await ValeModuleService.getAllVehiculos({ id: isValid || option });
            if (!resultVehiculo || !resultVehiculo.success) {setLoading(false); return notify.error(resultVehiculo.msg);}
            const vehiculosRows = resultVehiculo.rows || [];

            const resultDestino = await ValeModuleService.getAllDestinos();
            if (!resultDestino || !resultDestino.success) {setLoading(false); return notify.error(resultDestino.msg);}
            const destinosRows = resultDestino.rows || [];

            const resultAperturas = await ValeModuleService.getAllAperturas();
            if (!resultAperturas || !resultAperturas.success) {setLoading(false); return notify.error(resultDestino.msg);}
            const aperturasRows = resultAperturas.rows || [];

            const vehiculoAperturaResponse = await ValeModuleService.obtenerDatosVehiculoApertura(String(formModel?.id) || "");
            if (!vehiculoAperturaResponse.success) {setLoading(false); return notify.error(vehiculoAperturaResponse.msg);}
            const newVehiculoApertura = vehiculoAperturaResponse.data;
            if (isMounted()) {
                setVehiculos(vehiculosRows);
                setDestinos(destinosRows);
                setAperturas(aperturasRows);
                setLoading(false);
                setDatosVehiculo({
                    nombre: newVehiculoApertura.nombre,
                    placa: newVehiculoApertura.placa,
                    area: newVehiculoApertura.area
                });
                setDatosApertura({
                    vehiculo_id: newVehiculoApertura.vehiculo_id,
                    asignacion_id:  newVehiculoApertura.asignacion_id,
                    asignacion: newVehiculoApertura.asignacion,
                    inicial: newVehiculoApertura.inicial,
                    restante: newVehiculoApertura.restante
                });
                setVehiculoId(newVehiculoApertura.vehiculo_id);
                setAsignacionId(newVehiculoApertura.asignacion_id);
            };
        };
        if (open || isValid || option) {
            fetchData();
        }
    }, [open, isMounted, formModel, isValid, option]);

    const zeroValues: ValeFormModel = {
        fecha_emision   : new Date(),
        fecha_validez   : new Date(),
        litros          : '',
        distancia       : '',
        destino         : '',
        otro_vehiculo   : option?'1':'0',
        observaciones   : '',
        destinos        : '',
        vehiculo_id     : vehiculoId || '',
        asignacion_id   : asignacionId || '',
        cod_vale        : '',
        numero_recibo   : 0,
        litros_reales   : 0,
        precio_real     : 0,
        numero_factura  : 0,
        fecha_factura   : new Date(),
        estado_ejecutado: PENDIENTE,  
        pre_asignacion  : 0,
    };

    const newFormModel = formModel && {
        id           : formModel.id,
        fecha_emision: formModel.fecha_emision,
        fecha_validez: formModel.fecha_validez,
        litros       : formModel.litros,
        distancia    : formModel.distancia,
        destino      : formModel.destino,
        otro_vehiculo: formModel.otro_vehiculo?'1':'0',
        observaciones: formModel.observaciones,
        destinos     : formModel.destinos,
        cod_vale     : formModel.cod_vale,
        vehiculo_id  : vehiculoId,
        asignacion_id: asignacionId,
        numero_recibo: formModel.numero_recibo,
        litros_reales   : formModel.litros_reales,
        precio_real     : formModel.precio_real,
        numero_factura  : formModel.numero_factura,
        fecha_factura   : formModel.fecha_factura,
        estado_ejecutado: formModel.estado_ejecutado,
        pre_asignacion  : formModel.pre_asignacion,  
    };

    function renderHeaderComponent(): ReactElement {

        const direccion = isMobile ? "column": "row";
        if(loading) return <LinearProgress />
        else
        return (
            <Stack direction={direccion} spacing={1} mb={1}>
                <Cardify
                    title={datosApertura?.inicial || ""}
                    subtitle={datosApertura?.restante || ""}
                    description={datosApertura?.asignacion || ""}
                    color={"success"}
                    icon={"bi:cash-coin"}
                />
                <Cardify
                    title={datosVehiculo?.nombre || ""}
                    subtitle={datosVehiculo?.placa || ""}
                    description={datosVehiculo?.area || ""}
                    color={"primary"}
                    icon={"tabler:car"}
                />
            </Stack>
        );
    }

    return (
        <>
            <FormDialog
                addTitle="Agregar vale"
                editTitle="Editar vale"
                open={open}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                initialValues={newFormModel || zeroValues}
                formLayout={formLayout}
                validationSchema={validationSchema}
                isEdit={typeof formModel !== 'undefined'}
                headerComponent={renderHeaderComponent}
            />
        </>
    );
};
