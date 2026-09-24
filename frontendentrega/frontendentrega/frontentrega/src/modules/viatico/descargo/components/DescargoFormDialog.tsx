import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
import { SelectOption, FormGroup, FormDialog, FormValue } from 'components/core/FormDialog';
import { DescargoModuleService } from '../DescargoModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';

import { ENUM_OBSERVACION_DESCARGO, ENUM_SINO_2 } from 'constants/enums';
import { OptionsFormModel } from 'modules/Types';
import { DetalleDestinoModuleService } from 'modules/viatico/detalle_destino';
import { EscalaModuleService } from 'modules/viatico/escala';
import { EscalaTableModel2 } from 'modules/viatico/escala/components/EscalaTable';
import { DetalleTipoVehiculoTableModel } from 'modules/viatico/detalle_destino/components/DetalleDestinoTable';
import { DetalleDestinoSumaPasajesFormModel } from 'modules/viatico/detalle_destino/components/DetalleDestinoFormDialog';

export type DescargoFormModel = {
    id?                      : string;
    fecha_descargo           : Date;
    estado_descargo          : boolean;    
    viatico_pasaje_real      : number;
    monto_despositado        : number;
    monto_descargo           : number;
    saldo_descargo           : number;
    presenta_informe         : boolean;
    prorroga                 : boolean;
    tiempo_descargo          : number;
    notificacion_descargo    : boolean;
    viatico_real             : number;
    observacion_estado     : string;   
    observacion_descargo     :string;
    
    viatico_id?              : string | null;
     //campos adicionales necesarios
   usuario_nombre?           : string;
   usuario_cargo?            : string;
   usuario_ci?               : string;
   liquido_pagable?          : number;
   fecha_inicio_viaje?       : Date;
   fecha_fin_viaje?          : Date;
   destino?                  : string;
   cod_depart_memo?                 : string; 
   cantidad_dias?            : number; 
   tipo_comision_idp?        : string; 
   escala_exterior?          : string;
   suma_pasaje_ida?          : number;
   suma_pasaje_retorno?      : number;
   total_pasajes?            : number;
   categoria_usuario?        : string;
   tipo_comision_idp_escala? : string;
   viaticos_por_dia?         : number;
   escala_id?               : string;
   fecha_memo_registro?     : Date;
   memorandum_id?           : string;
   total_viatico?           : number;
   diff_pasajes?            : number;
   diff_viaticos?            : number;

   usuario_id?              :string; // necesito que se vea desde el view de descargo
   
   //viatico_real?            : number;

    

    _createdBy?: string;
    _createdAt?: string;
    _updatedBy?: string;
    _updatedAt?: string;
};

type Props = {
    open: boolean;
    formModel?: DescargoFormModel;
    onComplete: () => void;
};

export const DescargoFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();

    const padreOptions: SelectOption[] = ENUM_SINO_2;

    const [areas, setDescargos] = useState<OptionsFormModel[]>([]);
    //corregir lo de areas
    const areasOptions: SelectOption[] = areas.map((item: OptionsFormModel) => ({ value: item.id || '', label: item.nombre }));
    const [categoria, setCategoria] = useState<EscalaTableModel2>();
    const [destinoExterior, setDestinoExterior] = useState<DetalleTipoVehiculoTableModel>();
    const [sumaPasajes, setSumaPasajes] = useState<DetalleDestinoSumaPasajesFormModel>(); 
    const [showPasajeReal, setPasajeReal] = useState<number>(0);
    const [showViaticoReal, setViaticoReal] = useState<number>(0);
    const [showMontoDescargo, setMontoDescargo] = useState<string>("");
    const [showSaldoDescargo, setSaldoDescargo] = useState<string>("");
    const [showObservacionEstado, setObservacionEstado] = useState<string>('');
    const observacionOptions: SelectOption[] = ENUM_OBSERVACION_DESCARGO;

     // Inicializa el estado del formulario basado en formModel o valores predeterminados
     const [formValues, setFormValues] = useState<DescargoFormModel>(() => ({
        ...{
            fecha_descargo          : new Date(),
            estado_descargo         : true,
            viatico_pasaje_real     : 0,
            monto_despositado       : 0,
            monto_descargo          : -1,
            saldo_descargo          : -1,
            presenta_informe        : true,
            prorroga                : true,
            tiempo_descargo         : 0,
            notificacion_descargo   : true,
            viatico_real            :0,
            observacion_estado    : '',
            observacion_descargo  :'',
    
            usuario_nombre          : '',
            cod_depart_memo         : '',
            usuario_ci                   : '',
            usuario_cargo           : '',
            fecha_memo_registro     :  new Date(),
            tipo_comision_idp       : '',
            tipo_comision_idp_escala       : '',
            fecha_inicio_viaje      :  new Date(),
            fecha_fin_viaje         :  new Date(),
            categoria_usuario       : '',
            viaticos_por_dia        : 0,
            cantidad_dias           : 0,
            memorandum_id           : '',
    
            destino  : '',  
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
            setPasajeReal(formModel.viatico_pasaje_real);
            setViaticoReal(formModel.monto_descargo);                
        }
    }, [formModel]);

    const montoDescargo = String(Number(showViaticoReal+showPasajeReal));
    const saldoDescargo= String(Number(formModel?.liquido_pagable)-showViaticoReal-showPasajeReal);

    const formLayout: FormGroup<DescargoFormModel>[] = [
        {
            title: 'Datos del Usuario',
            grid: [
                [
                    { name: 'usuario_nombre', label: formModel?.usuario_nombre, type: 'text',infoText:'Nombre Usuario', disabled:true },                                     
                ], 
                [                   
                    { name: 'usuario_cargo', label: formModel?.usuario_cargo, type: 'text',infoText:'Cargo del Usuario', disabled:true },                   
                ], 
                [
                    { name: 'usuario_ci', label: formModel?.usuario_ci, type: 'text' ,infoText:'C.I.', disabled:true},
                    { name: 'tipo_comision_idp', label: formModel?.tipo_comision_idp, type: 'text' ,infoText:'Tipo de Comision', disabled:true},
                   // { name: 'destino', label: destinoExterior?.nombre, type: 'text',infoText:'Destino Exterior', disabled:true },
                    
                ],    
                [
                   
                    (formModel?.tipo_comision_idp === "INTERNACIONAL")?                
                    { name: 'destino', label: destinoExterior?.nombre, type: 'text',infoText:'Destino Exterior', disabled:true }:{type:'empty'},                   
                    (formModel?.tipo_comision_idp === "INTERNACIONAL")? 
                    { name: 'escala_exterior', label: destinoExterior?.caption, type: 'text',infoText:'tipo de Escala', disabled:true }:{type:'empty'}, 
                ],   
                     
              ]
        },        
        {
            title: 'Datos de los Pasajes',
            grid: [
                [
                    { name: 'fecha_inicio_viaje', label: String(formModel?.fecha_inicio_viaje), type: 'text',infoText:'Fecha Inicio Viaje', disabled:true },
                    { name: 'fecha_fin_viaje', label: String(formModel?.fecha_fin_viaje), type: 'text',infoText:'Fecha fin Viaje', disabled:true },
                    { name: 'cantidad_dias', label: String(formModel?.cantidad_dias), type: 'text' ,infoText:'Cantidad de Dias', disabled:true}
                ], //type: 'autocomplete', options: areasOptions
                [
                  //  (formModel?.tipo_comision_idp ==="NACIONAL" || formModel?.tipo_comision_idp ==="PROVINCIAL" )?
                    { name: 'suma_pasaje_ida', label: String(formModel?.suma_pasaje_ida)  , type: 'text',infoText:'Suma Psjes Ida (Bs.)', disabled:true },//:
                   // { name: 'suma_pasaje_ida', label: String(formModel?.suma_pasaje_ida)  , type: 'text',infoText:'Suma Psjes Ida ($)', disabled:true },
                   // (formModel?.tipo_comision_idp ==="NACIONAL" || formModel?.tipo_comision_idp ==="PROVINCIAL" )?
                    { name: 'suma_pasaje_retorno', label: String(formModel?.suma_pasaje_retorno), type: 'text',infoText:'Suma Psjes Retorno (Bs.)', disabled:true },//:
                  //   { name: 'suma_pasaje_retorno', label: String(formModel?.suma_pasaje_retorno), type: 'text',infoText:'Suma Psjes Retorno ($)', disabled:true },
                   // (formModel?.tipo_comision_idp ==="NACIONAL" || formModel?.tipo_comision_idp ==="PROVINCIAL" )?
                    { name: 'total_pasajes', label: String(formModel?.total_pasajes), type: 'text',infoText:'Suma Total Pasajes (Bs.)', disabled:true },//:
                  //  { name: 'total_pasajes', label: String(formModel?.total_pasajes), type: 'text',infoText:'Suma Total Pasajes ($)', disabled:true },
                ],               
            ]
        },
        {
            title: 'Datos del Viatico',
            grid: [                             
                [  
                    { name: 'categoria_usuario', label: categoria?.categoria, type: 'text' ,infoText:'Categoria del Cargo', disabled:true},
                    { name: 'tipo_comision_idp_escala', label: categoria?.tipo_comision_idp, type: 'text' ,infoText:'Tipo Comision', disabled:true},
                    //(formModel?.tipo_comision_idp ==="NACIONAL" || formModel?.tipo_comision_idp ==="PROVINCIAL" )?
                    { name: 'viaticos_por_dia', label: String(formModel?.viaticos_por_dia), type: 'text' ,infoText:'Viatico Asignado dia(Bs.)', disabled:true},//: 
                   // { name: 'viaticos_por_dia', label: String(formModel?.viaticos_por_dia), type: 'text' ,infoText:'Viatico Asignado dia($)', disabled:true},
                ], 
                [  
                    //(formModel?.tipo_comision_idp ==="NACIONAL" || formModel?.tipo_comision_idp ==="PROVINCIAL" )?
                    { name: 'total_pasajes', label: String(formModel?.total_pasajes), type: 'text',infoText:'Suma Total Pasajes (Bs.)', disabled:true },//:
                  //  { name: 'total_pasajes', label: String(formModel?.total_pasajes), type: 'text',infoText:'Suma Total Pasajes ($)', disabled:true },
                  //  (formModel?.tipo_comision_idp ==="NACIONAL" || formModel?.tipo_comision_idp ==="PROVINCIAL" )?
                    { name: 'total_viatico', label: String(formModel?.total_viatico), type: 'text' ,infoText:'Total Viaticos (Bs.)', disabled:true},//:
                   // { name: 'total_viatico', label: String(formModel?.total_viatico), type: 'text' ,infoText:'Total Viaticos ($)', disabled:true},
                   // (formModel?.tipo_comision_idp ==="NACIONAL" || formModel?.tipo_comision_idp ==="PROVINCIAL" )?
                    { name: 'liquido_pagable', label: String(formModel?.liquido_pagable), type: 'text' ,infoText:'Liquido Pagable (Bs.)', disabled:true},//: 
                   // { name: 'liquido_pagable', label: String(formModel?.liquido_pagable), type: 'text' ,infoText:'Liquido Pagable ($)', disabled:true},
                ], 
                [                    
                    { name: 'escala_id', label: formModel?.escala_id, type: 'text' , hidden:true},                   
                ],                  
            ]
        },
        {
            title: 'Datos Descargo',
            grid: [
                [
                    { name: 'fecha_descargo', label: 'Fecha de Descargo', type: 'datetime', infoText: 'ej. 10/02/2024' },
                    { name:'observacion_estado', label:'Existe alguna observacion', type: 'radio-group', options: observacionOptions, inlineDisplay: true,
                        onChange: (value, formik) => {
                            formik.setFieldValue('observacion_estado', value);
                            setObservacionEstado(String(value));
                        },
                     },
                   // { name: 'estado_descargo', label: 'No Descargo/Si Descargo', type: 'text' }
                ], 
                [   (showObservacionEstado === 'CON OBSERVACION') ?
                    { name: 'observacion_descargo', label: 'Observacion', type: 'textarea', infoText: 'Especificarl el tipo de Observacio', rows:3 }:
                    { type:'empty'}
                ],
                [    { name: 'total_pasajes', label: String(formModel?.total_pasajes), type: 'text',infoText:'Suma Total Pasajes (Bs.)', disabled:true },
                    { name: 'viatico_pasaje_real', label: 'Pasaje Real', type: 'text', infoText: 'ej. 20', 
                        onChange: (value, formik) => {
                        formik.setFieldValue('viatico_pasaje_real', value);
                        setPasajeReal(Number(value));
                    },  },
                   
                    { name: 'diff_pasajes', label: String(Number(formModel?.total_pasajes)-showPasajeReal), type: 'text', infoText: 'diferencia Pasajes'},
                ],
                [
                    { name: 'total_viatico', label: String(formModel?.total_viatico), type: 'text' ,infoText:'Total Viaticos (Bs.)', disabled:true},
                    { name: 'viatico_real', label: 'Viatico Real', type: 'text',infoText:'Viatico Real',
                        onChange: (value, formik) => {
                            formik.setFieldValue('viatico_real', value);
                            setViaticoReal(Number(value));
                        }, 
                    },
                               
                    { name: 'diff_viaticos', label: String(Number(formModel?.total_viatico)-showViaticoReal), type: 'text', infoText: 'diferencia Viaticos'},
                ],
                
                [   
                    { name: 'monto_descargo', label: montoDescargo, type: 'text', infoText: 'Descargo Real'},
                    { name: 'saldo_descargo', label: saldoDescargo, type: 'text', infoText: 'Saldo a Depositar' },
                    { name: 'monto_despositado', label: 'Monto Depositado', type: 'text', infoText: 'ej. 20' },  
                  
                ],
                
            ]
        }
    ];

    const validationSchema = yup
        .object({
            fecha_descargo      : yup.date().required().min(new Date(),'Debe actualizar la Fecha'),
           // estado_descargo     : yup.string().required(),
            viatico_pasaje_real : yup.number().required(),
            monto_despositado   : yup.number().required(),
            monto_descargo      : yup.number().required().required('El monto debe de ingresarse').min(0, 'El monto debe ser 0 o mayor'),
            saldo_descargo      : yup.number().required().required('El monto debe de ingresarse').min(0, 'El monto debe ser 0 o mayor'),
            observacion_estado  : yup.string().required(),
            viatico_real        : yup.number().required(),
         
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await DescargoModuleService.createOrUpdateDescargo(formData as unknown as DescargoFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        limpiarFormulario();
        return onComplete();
    };

    const handleCancel = () => {
        limpiarFormulario();
        onComplete();
    };

    const zeroValues: DescargoFormModel = {
        fecha_descargo          : new Date(),
        estado_descargo         : true,
        viatico_pasaje_real     : 0,
        monto_despositado       : 0,
        monto_descargo          : -1,
        saldo_descargo          : -1,
        presenta_informe        : true,
        prorroga                : true,
        tiempo_descargo         : 0,
        notificacion_descargo   : true,
        viatico_real            :0,
        observacion_estado    : '',
        observacion_descargo  :'',

        usuario_nombre          : '',
        cod_depart_memo         : '',
        usuario_ci                   : '',
        usuario_cargo           : '',
        fecha_memo_registro     :  new Date(),
        tipo_comision_idp       : '',
        tipo_comision_idp_escala       : '',
        fecha_inicio_viaje      :  new Date(),
        fecha_fin_viaje         :  new Date(),
        categoria_usuario       : '',
        viaticos_por_dia        : 0,
        cantidad_dias           : 0,
        memorandum_id           : '',

        destino  : '',  
  
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!isMounted()) return;
             

            const resultDetalleDestino = await DetalleDestinoModuleService.getSumatoriaPasajes(formModel?.id!);
            if (!resultDetalleDestino || !resultDetalleDestino.success) return;
            const newDetalleDestino = resultDetalleDestino.data;            
   

           const resultdestinoExterior = await DetalleDestinoModuleService.getDestinoExterior(formModel?.memorandum_id!);
            if (!resultdestinoExterior || !resultdestinoExterior.success) return;
            const newDestinoExterior = resultdestinoExterior.data;   
           
            const resultEscala = await EscalaModuleService.getEscalaCategoriaIDP(formModel?.usuario_cargo!, formModel?.tipo_comision_idp!, formModel?.usuario_id!);			
            if (!resultEscala || !resultEscala.success) return;
            const newEscala = resultEscala.data;              

            
            if (isMounted())
              //  setDescargos(newDescargos);
                setSumaPasajes(newDetalleDestino); 
             //   setDetalleMemorandum(newMemorandum); 
                setDestinoExterior(newDestinoExterior);  
                setCategoria(newEscala); 
        };
        if (open) {
            fetchData();
        }
    }, [open, isMounted, formModel]);

    // Función para limpiar el formulario
  const limpiarFormulario = () => {
    setFormValues(zeroValues); // Restablece el estado a su valor inicial
  };

   return (
        <FormDialog
            addTitle="Agregar Descargo"
            editTitle="Editar Descargo"
            open={open}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            //initialValues={newFormModel || zeroValues}
            initialValues={formValues}
            formLayout={formLayout}
            validationSchema={validationSchema}
            // debug
            isEdit={typeof formModel !== 'undefined'}
        />
    );
};
