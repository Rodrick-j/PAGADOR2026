import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
import { SelectOption, FormGroup, FormDialog, FormValue } from 'components/core/FormDialog';
import { ValeModuleService } from '../ValeAdminModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';
import { LinearProgress, Stack } from '@mui/material';
import Cardify from 'components/Cardify';
import { isNumberValidTest } from 'components/core/FormDialog/yup-tests';
import { Options2FormModel } from 'modules/Types';
import { ENUM_TIPO_VEHICULO, PENDIENTE } from 'constants/enums';

export type ValeFormModel = {
    id             ?: string;
    fecha_emision   : Date | null;
    fecha_validez   : Date | null;
    litros          : number | string;
    distancia       : number | string;
    concepto        : string;
    precio_unitario : number;
    precio_total    : number;
    observaciones   : string;
    destino         : string;
    otro_vehiculo?   : string;
    destinos        : string;

    cod_vale?       : string;
    otros?          : boolean;
    vehiculo_id?    : string;
    asignacion_id?  : string;
    usuario_id?     : string;

    numero_recibo?  : number;
    litros_reales?  : number;
    precio_real?    : number;
    numero_factura? : number;
    fecha_factura?  : Date;
    estado_ejecutado?: string;
    apertura_nombre? :string;
    vehiculo_nombre? :string;
    combustible?     :string;
    destino_nombre?  : string;    
    pre_asignacion?  : number;
};

type Props = {
    open: boolean;
    formModel?: ValeFormModel;
    onComplete: () => void;
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

export const ValeFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();

    const sinoOptions: SelectOption[] = ENUM_TIPO_VEHICULO;

    const [loading, setLoading] = useState<boolean>(false);
    const [option, setOption] = useState<boolean>(false);

    const [datosVehiculo, setDatosVehiculo] = useState<datosVehiculoProps | null>(null);
    const [datosApertura, setDatosApertura] = useState<datosAperturaProps | null>(null);
    const [vehiculoId, setVehiculoId] = useState<string>(formModel?.vehiculo_id || "");
    const [asignacionId, setAsignacionId] = useState<string>(formModel?.asignacion_id || "");

    const [vehiculos, setVehiculos] = useState<Options2FormModel[]>([]);
    const vehiculosOptions: SelectOption[] = vehiculos.map((item: Options2FormModel) => ({ value: item.id || '', label: item.nombre, caption: item.concepto }));
    const [asignacions, setAperturas] = useState<Options2FormModel[]>([]);
    const asignacionsOptions: SelectOption[] = asignacions.map((item: Options2FormModel) => ({ value: item.id || '', label: item.nombre, caption: item.concepto }));
    const [destinos, setDestinos] = useState<Options2FormModel[]>([]);
    const destinosOptions: SelectOption[] = destinos.map((item: Options2FormModel) => ({ value: item.id || '', label: item.nombre, caption: item.concepto }));

    const formLayout: FormGroup<ValeFormModel>[] = [
        {
            title: 'Datos Generales',
            grid: [

                [
                    {
                        name: 'apertura_nombre',
                        label: 'Apertura Programatica',
                        type: 'textarea',rows: 2, disabled  : true,

                    }
                ],
                 [
                    {
                        name: 'vehiculo_nombre',
                        label: 'Vehiculo',
                        type: 'textarea',rows: 2,disabled  : true,

                    }
                ],
                [
                    {
                        name: 'combustible',
                        label: 'Tu vehiculo es:',
                        type: 'text',disabled  : true,
                    },
                    {
                        name: 'numero_recibo',
                        label: 'El numero de Recibo es:',
                        type: 'text',disabled  : true,
                    }
                ]
            ]
        },
        {
            title: 'Vale Aprobado',
            grid: [

                [ { name: 'destinos', label: 'Ingrese los destinos:', type: 'textarea', disabled: true,  } ],
                [ { name: 'observaciones', label: 'Observaciones:', type: 'textarea', rows: 2, disabled: true, } ],
                  [
                  { name: 'fecha_emision', label: 'Fecha de Carga', type: 'datetime', disabled: true,},
                  { name: 'fecha_validez', label: 'Fecha de Emision', type: 'datetime', disabled: true, }
                ],
                [
                  { name: 'destino_nombre', label: 'Especifique el destino:', type: 'text', disabled: true, },
                  { name: 'distancia', label: 'Distancia en Km.', type: 'text', disabled: true, }
                ],
                [
                    { name: 'litros', label: 'Cantidad en Litros', type: 'text', disabled: true, },
                    { name: 'precio_total', label: 'El precio Inicial', type: 'text', disabled: true, },
                ],
            ]
        },
         {
            title: 'Ingresar Datos Reales Vales de Combustible',
            grid: [
                [
                    { name: 'litros_reales', label: 'Litros Reales', type: 'text', },
                    { name: 'precio_real', label: 'Precio Real', type: 'text',  }
                ],
                [
                    { name: 'numero_factura', label: 'Numero de factura', type: 'text',  },
                    { name: 'fecha_factura', label: 'Fecha Factura', type: 'datetime',  }
                ],

            ]
        },
    ];

    const validationSchema = yup
        .object({

            litros_reales   : yup.number().required().test(isNumberValidTest()),
            precio_real     : yup.number().required().test(isNumberValidTest()),
            numero_factura  : yup.number().required().test(isNumberValidTest()),
            fecha_factura   : yup.string().required(),
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await ValeModuleService.createOrUpdateVale(formData as unknown as ValeFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        return onComplete();
    };

    const handleCancel = () => {
        onComplete();
    };

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            if (!isMounted()) return;
        /*    const resultVehiculo = await ValeModuleService.getAllVehiculos({ id: option });
            if (!resultVehiculo || !resultVehiculo.success) return;
            const vehiculosRows = resultVehiculo.rows || [];
            const resultApertura = await ValeModuleService.getAllAperturas();
            if (!resultApertura || !resultApertura.success) return;
            const asignacionsRows = resultApertura.rows || [];
            const resultDestino = await ValeModuleService.getAllDestinos();
            if (!resultDestino || !resultDestino.success) return;
            const destinosRows = resultDestino.rows || [];*/

           /* const vehiculoAperturaResponse = await ValeModuleService.obtenerDatosVehiculoApertura(String(formModel?.id) || "");
            if (!vehiculoAperturaResponse.success) {setLoading(false); return notify.error(vehiculoAperturaResponse.msg);}
            const newVehiculoApertura = vehiculoAperturaResponse.data;*/

           if (isMounted()) {
              /*  setVehiculos(vehiculosRows);
                setAperturas(asignacionsRows);
                setDestinos(destinosRows);
                setLoading(false);*/
                /*setDatosVehiculo({
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
                setVehiculoId(newVehiculoApertura.vehiculo_id);
                setAsignacionId(newVehiculoApertura.asignacion_id);*/
            };
        };
        if (open || option) {
            fetchData();
        }
    }, [open, isMounted, formModel, option]);

    const zeroValues: ValeFormModel = {
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
        litros_reales   : 0,
        precio_real     : 0,
        numero_factura  : 0,
        fecha_factura   : new Date(),
        estado_ejecutado: PENDIENTE,  
        pre_asignacion  : 0,
    };

    /*const newFormModel = formModel && {
        id: formModel.id,
    };*/
     const newFormModel = formModel && {
      
        id              : formModel.id,
        fecha_emision   : formModel.fecha_emision,
        fecha_validez   : formModel.fecha_validez,
        litros          : formModel.litros,
        distancia       : formModel.distancia,
        destino         : formModel.destino,
        otro_vehiculo   : formModel.otro_vehiculo?'1':'0',
        observaciones   : formModel.observaciones,
        destinos        : formModel.destinos,
        cod_vale        : formModel.cod_vale,
        vehiculo_id     : formModel.vehiculo_id,//vehiculoId,
        asignacion_id   : formModel.asignacion_id,//asignacionId,
        numero_recibo   : formModel.numero_recibo,
        litros_reales   : formModel.litros_reales,
        precio_real     : formModel.precio_real,
        numero_factura  : formModel.numero_factura,
        fecha_factura   : formModel.fecha_factura,
        estado_ejecutado: formModel.estado_ejecutado,
        combustible     : formModel.combustible,
        apertura_nombre : formModel.apertura_nombre,
        vehiculo_nombre : formModel.vehiculo_nombre,
        destino_nombre  : formModel.destino_nombre,
        precio_total    : formModel.precio_total,
        pre_asignacion  : formModel.pre_asignacion,
    };     

    function renderHeaderComponent(): ReactElement {
        if(loading) return <LinearProgress />
        else
        return (
            <Stack direction="row" spacing={1} mb={1}>
                <Cardify
                    title={datosVehiculo?.nombre || ""}
                    subtitle={datosVehiculo?.placa || ""}
                    description={datosVehiculo?.area || ""}
                    color={"info"}
                    icon={"tabler:car"}
                />
                <Cardify
                    title={datosApertura?.inicial || ""}
                    subtitle={datosApertura?.restante || ""}
                    description={datosApertura?.asignacion || ""}
                    color={"success"}
                    icon={"bi:cash-coin"}
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
                //debug
               // headerComponent={renderHeaderComponent}
            />
        </>
    );
};
