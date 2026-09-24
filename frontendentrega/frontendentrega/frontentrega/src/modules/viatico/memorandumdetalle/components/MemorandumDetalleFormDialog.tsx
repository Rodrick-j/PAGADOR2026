import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
import { SelectOption, FormGroup, FormDialog, FormValue } from 'components/core/FormDialog';
//import { DetalleDestinoModuleServi } from '../DetalleDestinoModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';
import { parse as dateParse } from 'date-fns';

import {  ENUM_DEPARTAMENTOS, ENUM_HAY_VIAJE, ENUM_HORA_FIN, ENUM_HORA_INICIO, ENUM_PERNOCTE, ENUM_PROVINCIAS, ENUM_TIPO_TRANSPORTE_OP, TIME_FORMAT } from 'constants/enums';
import { Options2FormModel, OptionsFormModel, OptionsFormModelFecha } from 'modules/Types';
import { DetalleDestinoModuleService } from 'modules/viatico/detalle_destino';
import { dateTest } from 'components/core/FormDialog/yup-tests';
import { MemorandumModuleService } from 'modules/viatico/memorandum/MemorandumModuleService';
import { VehiculoModuleService } from 'modules/bsss/vehiculo';
import { EscalaDestinoModuleService } from 'modules/viatico/escala_destino';
import { SelectOptionFecha } from 'components/core/FormDialog/Types';

export type MemorandumDetalleDestinoFormModel = {
    id?                     : string;
    tipo_vehiculo_op        : string;
    objetivo_viaje          : string;
    destino_reg             : string;
    fecha_dia               : Date | null;
    hora_inicio             : string;
    hora_fin                : string;
    pernocte                : string;
    hay_viaje?               : string;
    pasaje_ida              : number;
    pasaje_retorno          : number;
    total_pasaje_dia        : number;
    tipo_vehiculo_opvida        : string;
    tipo_vehiculo_opvuelta        : string;
    estado                    : string;
    modificacion?           : boolean;
    observacion?             : string;
    estado_observacion?      : string;    
    memorandum_id?          : string | null;
    viatico_id?             : string | null;
    vehiculo_id?            : string | null;
    destino_id?             : string | null;
    destino_id2?             : string | null;
    //campos de EscalaDestino para llenar los datos de destino mas facilmente
    tipo_pcp? :string;
    provincia? : string;
    dia_habil? : string;
};

type Props = {
    memorandumId  : string;
    open: boolean;
    formModel?: MemorandumDetalleDestinoFormModel;
    onComplete: () => void;
};

export const MemorandumDetalleDestinoFormDialog = ({ open, formModel,memorandumId, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();

    const vehiculoOPOptions: SelectOption[] = ENUM_TIPO_TRANSPORTE_OP;
    const [showTipoVehiculo, setTipoVehiculo] = useState<string>('');
     const [showOtroDestino, setOtroDestino] = useState<string>('');
     const [showOtraProvincia, setOtraProvincia] = useState<string>('');
    const [showHayViaje, setHayViaje] = useState<string>('');
    const [showDiaHabil, setDiaHabil] = useState<string>('');
    const [vehiculos, setVehiculos] = useState<OptionsFormModel[]>([]);
    const [tipoPCP, setTipoPCP] = useState<string>('');
    const provinciasOptions: SelectOption[] = ENUM_PROVINCIAS;
    const departamentosOptions: SelectOption[] = ENUM_DEPARTAMENTOS;
    const [paises, setPaises] = useState<OptionsFormModel[]>([]);
    const [comunidades, setComunidades] = useState<OptionsFormModel[]>([]);
    const [fechas, setFechas] = useState<OptionsFormModelFecha[]>([]);
    const pernocteOptions: SelectOption[] = ENUM_PERNOCTE;
    const hayViajeOptions: SelectOption[] = ENUM_HAY_VIAJE;
    const horaInicio: SelectOption[] = ENUM_HORA_INICIO;
    const horaFin: SelectOption[] = ENUM_HORA_FIN;

    const vehiculosOptions: SelectOption[] = vehiculos.map((item: Options2FormModel) => ({ value: item.id || '', label: item.nombre, caption: item.concepto }));
    const paisesOptions: SelectOption[] = paises.map((item: OptionsFormModel) => ({ value: item.id || '', label: item.nombre }));
    const comunidadesOptions: SelectOption[] = comunidades.map((item: OptionsFormModel) => ({ value: item.id || '', label: item.nombre }));
    const fechasOptions: SelectOptionFecha[] = fechas.map((item: OptionsFormModelFecha) => ({ value: item.id || '', label:item.caption!.concat(' - ').concat(item.nombre) }));


     // Inicializa el estado del formulario basado en formModel o valores predeterminados
     const [formValues, setFormValues] = useState<MemorandumDetalleDestinoFormModel>(() => ({
        ...{
            tipo_vehiculo_op        : '',
            objetivo_viaje          : '',
            destino_reg             : '',
            fecha_dia               : null,//new Date(),
            hora_inicio             : '',
            hora_fin                : '',
            pernocte                : 'SIN PERNOCTE',
            pasaje_ida              : 0,
            pasaje_retorno          : 0,
            total_pasaje_dia        : 0,
            tipo_vehiculo_opvida    : '',
            tipo_vehiculo_opvuelta  : '',
            estado                  : 'PENDIENTE',
            modificacion            : false,
            observacion             :'',
            estado_observacion      : "SIN_OBSERVACION",
            memorandum_id           : memorandumId,
            tipo_pcp                : '',
            hay_viaje               : '',
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
            setTipoVehiculo(formModel.tipo_vehiculo_op);
            setHayViaje(formModel.hay_viaje!);
            setOtroDestino(formModel.destino_reg);
            setOtraProvincia(formModel.provincia!);

        }
    }, [formModel]);

    const formLayout: FormGroup<MemorandumDetalleDestinoFormModel>[] = [
        {
            title: 'Datos Día',
            grid: [
                (showDiaHabil === "INHABILES")?
                [
                    { name: 'hay_viaje', label: 'Especificar si el día a seleccionar se viajara', type: 'radio-group', options: hayViajeOptions, inlineDisplay: true,
                        onChange: (value, formik) => {
                            formik.setFieldValue('hay_viaje', value);
                            setHayViaje(String(value));
                        },
                     },
                ]:[],
                [
                    { name: 'fecha_dia', label: 'Fecha registro por día', type: 'select', options: fechasOptions, } ,
                    (showHayViaje ==='CON_VIAJE' || showDiaHabil === 'HABILES')?
                    { name: 'pernocte', label: 'Marque si hay pernocte', type: 'radio-group', options: pernocteOptions, inlineDisplay: true }:
                    { type: 'empty'},
                ],
            ]
        },
        (showHayViaje ==='CON_VIAJE'|| showDiaHabil === 'HABILES')?
        {
            title: 'Datos del Vehiculo',
            grid: [
                [
                   {  label: 'Tipo de Comision es:  ' , type: 'label' },
                   { name: 'tipo_pcp', label: tipoPCP , type: 'text', disabled:true}
                ],
                [
                    {
                        name: 'tipo_vehiculo_op',
                        label: 'Tipo de vehiculo Oficial o Publico',
                        type: 'select',
                        options: vehiculoOPOptions,
                        onChange: (value, formik) => {
                            formik.setFieldValue('tipo_vehiculo_op', value);
                            setTipoVehiculo(String(value));
                        },
                    }
                  ],
                    [
                    (showTipoVehiculo ==='OFICIAL')?
                        { name: 'vehiculo_id', label: 'Placa del vehiculo ', type: 'autocomplete', options: vehiculosOptions }
                        :{ type: 'empty'},
                    ],
            ]
        }:{
            title: '',
            grid: [[{ type: 'empty'}] ]
        },
        (showHayViaje ==='CON_VIAJE'|| showDiaHabil === 'HABILES')?
        {
            title: 'Datos del Viaje',
            grid: [
                    [{ name: 'objetivo_viaje', label: 'Describa el objetivo de viaje', type: 'textarea', rows: 3, infoText: 'Descripcion del viaje'}],
                    [
                        (tipoPCP ==='INTERNACIONAL')?
                        { name:'destino_reg', label: 'Ingrese Pais de Destino', type: 'select', options: paisesOptions ,
                            onChange: (value, formik) => {
                            formik.setFieldValue('destino_reg', value);
                            setOtroDestino(String(value));
                        },
                        }: //seleccion
                        (tipoPCP ==='NACIONAL')?
                        { name:'destino_reg', label: 'Seleccione el Departamento', type: 'select', options: departamentosOptions, 
                           onChange: (value, formik) => {
                            formik.setFieldValue('destino_reg', value);
                            setOtroDestino(String(value));
                           },
                        }:
                        { name:'provincia', label: 'Seleccione el Provincia', type: 'select', options: provinciasOptions,
                            onChange: (value, formik) => {
                            formik.setFieldValue('provincia', value);
                            setOtraProvincia(String(value));
                        },

                        },
                    ],
                    [
                        (tipoPCP ==='PROVINCIAL' && (showHayViaje === 'CON_VIAJE'|| showDiaHabil === 'HABILES') && showOtraProvincia != "OTRO")?
                        {name:'destino_reg', label: 'Seleccione Comunidad',  type: 'select', options: comunidadesOptions,
                        }:{type:'empty'},
                    ],
                    [
                         (showOtroDestino === "OTRO" ||showOtraProvincia === "OTRO")?
                        { name:'destino_reg', label: 'Ingrese Lugar de Destino', type: 'text'}:
                        { type: 'empty'},
                    ],
                    [
                        { name: 'hora_inicio', label: 'Hora inicio', type: 'select', options:horaInicio},
                        { name: 'hora_fin', label: 'Hora fin', type: 'select', options:horaFin },
                    ],
            ]
        }:{
            title: '',
            grid: [[{ type: 'empty'}] ]
        },
    ];

    const isDateUnique = async (nro: Date, memorandum_id:string) => {
        const formModelDate = formModel && formModel.fecha_dia ? new Date(formModel.fecha_dia) : new Date();

        if(formModelDate && formModelDate.getTime() !== nro.getTime()){
            const result = await DetalleDestinoModuleService.getFechaData(nro, memorandum_id);
            const exists = Boolean(result.data.nro);
            return !exists;
        }
        return true;
    };

const requiereDatosViaje = showDiaHabil === 'HABILES' || showHayViaje === 'CON_VIAJE';
    const validationSchema = yup
        .object({
        hay_viaje: showDiaHabil === 'INHABILES'? yup.string().required(): yup.string(),
        tipo_vehiculo_op: requiereDatosViaje? yup.string().required(): yup.string(),
        objetivo_viaje: requiereDatosViaje? yup.string().required().test(
                  'len','El objetivo de viaje debe ser mayor a 35 caracteres',(val) => (val ?? '').length > 35): yup.string(),
        destino_reg: requiereDatosViaje ? yup.string().required(): yup.string(),
        fecha_dia: yup.date().nullable().required('La fecha debe seleccionarse obligatoriamente')
        .test('is-unique','La fecha ingresada ya se encuentra registrada con un destino',async (value) => {
                if (!value) return false;
                return await isDateUnique(value, memorandumId);
            }),
        hora_inicio: requiereDatosViaje? yup.string().required(): yup.string(),
        hora_fin: requiereDatosViaje? yup.string().required(): yup.string(),
        pernocte: requiereDatosViaje? yup.string().required(): yup.string(),
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {

        const result = await DetalleDestinoModuleService.createOrUpdateDetalleDestino(formData as unknown as MemorandumDetalleDestinoFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        limpiarFormulario();
        return onComplete();

    };

    const handleCancel = () => {
        limpiarFormulario();
        onComplete();
    };

    // Función para limpiar el formulario
  const limpiarFormulario = () => {
    setFormValues(zeroValues); // Restablece el estado a su valor inicial
  };

    //enviamos el id de memorandum al cargar valores
    const zeroValues: MemorandumDetalleDestinoFormModel = {
        tipo_vehiculo_op        : '',
        objetivo_viaje          : '',
        destino_reg             : '',
        fecha_dia               : null, //new Date(),
        hora_inicio             : '',
        hora_fin                : '',
        pernocte                : 'SIN PERNOCTE',
        pasaje_ida              : 0,
        pasaje_retorno          : 0,
        total_pasaje_dia        : 0,
        tipo_vehiculo_opvida    : '',
        tipo_vehiculo_opvuelta  : '',
        estado                  : 'PENDIENTE',

        modificacion            : false,
        observacion             :'',
        estado_observacion      : "SIN_OBSERVACION",
        memorandum_id           : memorandumId,
        tipo_pcp                : tipoPCP,
        hay_viaje               : '',
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!isMounted()) return;
            const resultVehiculo = await VehiculoModuleService.getAllVehiculos();
            if (!resultVehiculo || !resultVehiculo.success) return;
            const newVehiculo = resultVehiculo.rows || [];

            //Memorandum
            const resultMemorandum = await MemorandumModuleService.getTipoPCP(memorandumId);
            if (!resultMemorandum || !resultMemorandum.success) return;
            const nombre = String(resultMemorandum.data?.nombre);

            const resultMemorandumDia = await MemorandumModuleService.getDiaHabil(memorandumId);
            if (!resultMemorandumDia || !resultMemorandumDia.success) return;
            const diaHabil = String(resultMemorandumDia.data?.nombre);

            //Listado de paises
            const resultPaises = await EscalaDestinoModuleService.getAllPaises();
            if (!resultPaises || !resultPaises.success) return;
            const newPaises = resultPaises.rows || [];
            // listado de comunidades
            const resultComunidades = await EscalaDestinoModuleService.getAllComunidades();
            if (!resultComunidades || !resultComunidades.success) return;
            const newComunidades = resultComunidades.rows || [];

              // listado de fechas
              const resultListaFechas = await DetalleDestinoModuleService.getRangoFechas(memorandumId);
              if (!resultListaFechas || !resultListaFechas.success) return;
              const newListaFechas = resultListaFechas.rows || [];


        if (isMounted())
           setVehiculos(newVehiculo);
           setTipoPCP(nombre);
           setPaises(newPaises);
           setComunidades(newComunidades);
           setFechas(newListaFechas);
           setDiaHabil(diaHabil);
        };
        if (open) {
            fetchData();
        }
    }, [open, isMounted, formModel]);




    return (
        <FormDialog
            addTitle="Agregar Detalle Destino"
            editTitle="Editar Detalle Destino"
            open={open}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialValues={formValues}
           // initialValues={newFormModel || zeroValues}
            formLayout={formLayout}
            validationSchema={validationSchema}
           // debug
            isEdit={typeof formModel !== 'undefined'}
        />
    );
};
