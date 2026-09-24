import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
import { SelectOption, FormGroup, FormDialog, FormValue } from 'components/core/FormDialog';
import { ViaticoModuleService } from '../ViaticoModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';

import { CON_RESOLUCION, ENUM_SINO_2, SIN_PRESUPUESTO } from 'constants/enums';
import { OptionsFormModel } from 'modules/Types';
import { ViaticoTableModel } from './ViaticoTable';
import { MemorandumModuleService } from 'modules/viatico/memorandum';
import { UpdateParams } from 'components/core/DataTable';
import { DetalleDestinoModuleService } from 'modules/viatico/detalle_destino';
import { DetalleDestinoSumaPasajesFormModel } from 'modules/viatico/detalle_destino/components/DetalleDestinoFormDialog';
import { MemorandumFormModelDetalle2 } from 'modules/viatico/memorandum/components/MemorandumFormDialog';
import { EscalaModuleService } from 'modules/viatico/escala';
import { EscalaTableModel, EscalaTableModel2 } from 'modules/viatico/escala/components/EscalaTable';
import { DetalleTipoVehiculoTableModel } from 'modules/viatico/detalle_destino/components/DetalleDestinoTable';


export type ViaticoFormModel = {
    id?                     : string;
    nume_recibo             : number;
    fecha_pago_viatico      : Date;
    suma_pasaje_ida         : number;
    suma_pasaje_retorno     : number;
    tipo_pasaje_gd          : string;
    total_pasajes           : number;
    total_viatico           : number;
    liquido_pagable         : number;
    estado_pago             : string;
    estado_recibo           : string;
    fecha_anulacion         : Date;
    notificacion_viatico    : string;
    memorandum_id?          : string ;
    escala_id?              : string ;

    //campos para MOSTRAR
    usuario_id?             :string;
    usuario_nombre?          : string;
    cod_depart_memo?         : string;
    ci?                      : string;
    cargo_usuario?           : string;
    fecha_memo_registro     : Date;
    tipo_comision_idp       : string;
    tipo_comision_idp_escala       : string;
    fecha_inicio_viaje      : Date;
    fecha_fin_viaje         : Date;
    categoria_usuario       : string;
    viaticos_por_dia        : number;
    cantidad_dias           : number;

    escala_exterior?         : string;
    destino?                 : string;
   // escala_trabajo?          : string;
   // campo para el control de apertura
    apertura_nombre_viatico?   : string;
    apertura_nombre_pasaje?    : string;
    apertura_prog_viatico?   : string;
    apertura_prog_pasaje?    : string;
    apertura_saldo_pasaje? : number;
    apertura_saldo_viatico? : number;
    apertura_estado_pasaje? : string;
    apertura_estado_viatico? : string;
    resolucion?              : string;

    _createdBy?             : string;
    _createdAt?             : string;
    _updatedBy?             : string;
    _updatedAt?             : string;
};

export type ViaticoAnularFormModel = {
    id_viatico?: string;
    nume_recibo: number;
    observacion_anulacion: string;
    fecha_anulacion: Date | null;
};
type Props = {    
   
    open: boolean;
    formModel?: ViaticoFormModel;
    onComplete: () => void;    
};

export const ViaticoFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {	
	
    const notify = useNotify();
    const isMounted = useIsMounted();

    const padreOptions: SelectOption[] = ENUM_SINO_2;
   
    const [categoria, setCategoria] = useState<EscalaTableModel2>();
    const [destinoExterior, setDestinoExterior] = useState<DetalleTipoVehiculoTableModel>();
    const [sumaPasajes, setSumaPasajes] = useState<DetalleDestinoSumaPasajesFormModel>(); 
    const [detalleMemorandum, setDetalleMemorandum] = useState<MemorandumFormModelDetalle2>();   
     
   	const formLayout: FormGroup<ViaticoFormModel>[] = [
        {
            title: 'Datos del Usuario',
            grid: [
                [
                    { name: 'usuario_nombre', label: formModel?.usuario_nombre, type: 'text',infoText:'Nombre Usuario', disabled:true },    				
                ], 
                [                   
                    { name: 'cargo_usuario', label: formModel?.cargo_usuario, type: 'text',infoText:'Cargo del Usuario', disabled:true },                   
                ], 
                [
                    { name: 'ci', label: formModel?.ci, type: 'text' ,infoText:'C.I.', disabled:true},
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
            title: 'Datos de la Apertura',
            grid: [

                [   { name: 'apertura_nombre_viatico', label:  String(formModel?.apertura_nombre_viatico), type: 'textarea',infoText:'Nombre Area Apertura', disabled: true }] ,        
                [   { name: 'apertura_prog_viatico', label:  String(formModel?.apertura_prog_viatico), type: 'text', infoText:'Apertura Programatica',disabled: true },
                    { name: 'apertura_saldo_viatico',label:  String(formModel?.apertura_saldo_viatico), type: 'text', infoText:'Saldo Restante Apertura Viaticos (Bs.)',disabled: true},
                    { name: 'apertura_saldo_pasaje',label:  String(formModel?.apertura_saldo_pasaje), type: 'text', infoText:'Saldo Restante Apertura Pasajes (Bs.)',disabled: true}
                ] ,                                  

                (formModel?.apertura_estado_viatico === SIN_PRESUPUESTO)?				
                 [ { name: 'apertura_estado_viatico', label: "LA APERTURA DE VIATICO SE ENCUENTRA SIN PRESUPUESTO", type: 'label' , color: 'red'}]:[],
                 (formModel?.apertura_estado_pasaje === SIN_PRESUPUESTO)?
                 [ { name: 'apertura_estado_pasaje', label: "LA APERTURA DE PASAJE SE ENCUENTRA SIN PRESUPUESTO", type: 'label' , color: 'red'}]:[],

                 (formModel?.resolucion === CON_RESOLUCION)?
                 [ { name: 'resolucion', label: "EL MEMORANDUM DEBE TENER RESOLUCION PARA SU CANCELACION", type: 'label' , color: 'blue'}]:[],                
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
                 //   (formModel?.tipo_comision_idp ==="NACIONAL" || formModel?.tipo_comision_idp ==="PROVINCIAL" )?
                    { name: 'suma_pasaje_ida', label: String(formModel?.suma_pasaje_ida)  , type: 'text',infoText:'Suma Psjes Ida (Bs.)', disabled:true },//:
                 //   { name: 'suma_pasaje_ida', label: String(formModel?.suma_pasaje_ida)  , type: 'text',infoText:'Suma Psjes Ida ($)', disabled:true },
                 //   (formModel?.tipo_comision_idp ==="NACIONAL" || formModel?.tipo_comision_idp ==="PROVINCIAL" )?
                    { name: 'suma_pasaje_retorno', label: String(formModel?.suma_pasaje_retorno), type: 'text',infoText:'Suma Psjes Retorno (Bs.)', disabled:true },//:
                 //    { name: 'suma_pasaje_retorno', label: String(formModel?.suma_pasaje_retorno), type: 'text',infoText:'Suma Psjes Retorno ($)', disabled:true },
                //    (formModel?.tipo_comision_idp ==="NACIONAL" || formModel?.tipo_comision_idp ==="PROVINCIAL" )?
                    { name: 'total_pasajes', label: String(formModel?.total_pasajes), type: 'text',infoText:'Suma Total Pasajes (Bs.)', disabled:true },//:
                 //   { name: 'total_pasajes', label: String(formModel?.total_pasajes), type: 'text',infoText:'Suma Total Pasajes ($)', disabled:true },
                ],               
            ]
        },
        {
            title: 'Datos del Viatico',
            grid: [                             
                [  
                    { name: 'categoria_usuario', label: categoria?.categoria, type: 'text' ,infoText:'Categoria del Cargo', disabled:true},
                    { name: 'tipo_comision_idp_escala', label: categoria?.tipo_comision_idp, type: 'text' ,infoText:'Tipo Comision', disabled:true},
                 //   (formModel?.tipo_comision_idp ==="NACIONAL" || formModel?.tipo_comision_idp ==="PROVINCIAL" )?
                    { name: 'viaticos_por_dia', label: String(formModel?.viaticos_por_dia), type: 'text' ,infoText:'Viatico Asignado (Bs.)', disabled:true},//: 
                  //  { name: 'viaticos_por_dia', label: String(formModel?.viaticos_por_dia), type: 'text' ,infoText:'Viatico Asignado ($)', disabled:true},
                ], 
                [                    
                    { name: 'escala_id', label: formModel?.escala_id, type: 'text' , hidden:true},                   
                ],                  
            ]
        },
        {
            title: 'Datos del Recibo de Pago',
            grid: [
                [
                    { name: 'nume_recibo', label: 'Numero de Recibo', type: 'text', infoText: 'Ingresar Numero de Recibo' },
                    { name: 'fecha_pago_viatico', label: 'Fecha de Pago Viatico', type: 'datetime', infoText: 'ej. 20/02/2024' }
                ], 
                [                    
                    //{ name: 'tipo_pasaje_gd', label: 'Tipo Pasaje General/Detallado', type: 'text', infoText: 'ej. Pasaje General/Detallado' },
                   // (formModel?.tipo_comision_idp ==="NACIONAL" || formModel?.tipo_comision_idp ==="PROVINCIAL" )?
                    { name: 'total_pasajes', label:  String(formModel?.total_pasajes), type: 'text', infoText: 'Total suma pasajes (Bs.)' },//:
                 //   { name: 'total_pasajes', label:  String(formModel?.total_pasajes), type: 'text', infoText: 'Total suma pasajes ($)' },
                  //  (formModel?.tipo_comision_idp ==="NACIONAL" || formModel?.tipo_comision_idp ==="PROVINCIAL" )?
                    { name: 'total_viatico', label: String(formModel?.total_viatico), type: 'text', infoText: 'Total Viaticos(Bs)' },//:
                   // { name: 'total_viatico', label: String(formModel?.total_viatico), type: 'text', infoText: 'Total Viaticos($)' },
                  //  (formModel?.tipo_comision_idp ==="NACIONAL" || formModel?.tipo_comision_idp ==="PROVINCIAL" )?
                    { name: 'liquido_pagable', label: String(formModel?.liquido_pagable), type: 'text', infoText: 'Liquido Pagable(Bs.)' },//:
                  //  { name: 'liquido_pagable', label: String(formModel?.liquido_pagable), type: 'text', infoText: 'Liquido Pagable($)' }, 
                ],
             
                [
                //    { name: 'fecha_anulacion', label: 'Fecha de Anulacion', type: 'datetime', infoText: 'ej. 20/02/2024' },
                    //{ name: 'notificacion_viatico', label: 'Notificacion de Viatico', type: 'text', infoText: 'ej. SI, NO' }
                ] 
            ]
        }
    ];
 
    const isNumberUnique = async (nro: number) => {
        const n = Number(formModel && formModel.nume_recibo);
        if(n!==nro){
            const result = await ViaticoModuleService.getNroReciboData(nro);
            const exists = Boolean(result.data.nro);
            return !exists;
        }
        return true;
    };
 
    const validationSchema = yup
        .object({
            nume_recibo             : yup.number().required().test('is-unique', 'El número de recibo se encuentra ya registrado', async (value, context) => {
                                    if (value !== undefined) {
                                            return await isNumberUnique(value);
                                        }
                                        return true;
                                    }),
            fecha_pago_viatico      : yup.date().required().min(new Date(),'Debe actualizar la Fecha'),
            suma_pasaje_ida         : yup.number().required(),
            suma_pasaje_retorno     : yup.number().required(),
         // tipo_pasaje_gd          : yup.string().required(),
            total_pasajes           : yup.number().required(),
            total_viatico           : yup.number().required(),
            liquido_pagable         : yup.number().required(),
            escala_id               : yup.string().required(),
         
        })
        .defined();

   

    const handleSubmit = async (formData: FormValue) => {
               
        const result = await ViaticoModuleService.createOrUpdateViatico(formData as unknown as ViaticoFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        return onComplete();        
    };

    const handleCancel = () => {
        onComplete();
    };

    const zeroValues: ViaticoFormModel = {
        nume_recibo             : 0,
        fecha_pago_viatico      : new Date(),
        suma_pasaje_ida         : 0,
        suma_pasaje_retorno     : 0,
        tipo_pasaje_gd          : '',
        total_pasajes           : 0,
        total_viatico           : 0,
        liquido_pagable         : 0,
        estado_pago             : '',
        estado_recibo           : '',
        fecha_anulacion         : new Date(),
        notificacion_viatico    : '',

        usuario_nombre          : '',
        cod_depart_memo         : '',
        ci                      : '',
        cargo_usuario           : '',
        fecha_memo_registro     :  new Date(),
        tipo_comision_idp       : '',
        tipo_comision_idp_escala       : '',
        fecha_inicio_viaje      :  new Date(),
        fecha_fin_viaje         :  new Date(),
        categoria_usuario       : '',
        viaticos_por_dia        : 0,
        cantidad_dias           : 0,
          
        destino  : '',  
        usuario_id              : "",        
    };

    useEffect(() => {
        const fetchData = async () => {           
             const resultDetalleDestino = await DetalleDestinoModuleService.getSumatoriaPasajes(formModel?.id!);
            if (!resultDetalleDestino || !resultDetalleDestino.success) return;
            const newDetalleDestino = resultDetalleDestino.data;        

           const resultdestinoExterior = await DetalleDestinoModuleService.getDestinoExterior(formModel?.memorandum_id!);
            if (!resultdestinoExterior || !resultdestinoExterior.success) return;
            const newDestinoExterior = resultdestinoExterior.data;   
           
            const resultEscala = await EscalaModuleService.getEscalaCategoriaIDP(formModel?.cargo_usuario!, formModel?.tipo_comision_idp!, formModel?.usuario_id!);
            if (!resultEscala || !resultEscala.success) return;
            const newEscala = resultEscala.data;     

            if (isMounted())
                setSumaPasajes(newDetalleDestino); 
             //   setDetalleMemorandum(newMemorandum); 
                setDestinoExterior(newDestinoExterior);  
                setCategoria(newEscala);        
           
        };
        if (open) {
            fetchData();
        }
    }, [open, isMounted, formModel]);
 
    const newFormModel = formModel && {
		
        id                      : formModel.id,
        nume_recibo             : formModel.nume_recibo,
        fecha_pago_viatico      : formModel.fecha_pago_viatico,
        suma_pasaje_ida         : formModel.suma_pasaje_ida,
        suma_pasaje_retorno     : formModel.suma_pasaje_retorno,
        tipo_pasaje_gd          : formModel.tipo_pasaje_gd,
        total_pasajes           : formModel.total_pasajes,
        total_viatico           : formModel.total_viatico,
        liquido_pagable         : formModel.liquido_pagable,
        estado_pago             : formModel.estado_pago,
        estado_recibo           : formModel.estado_recibo,
        fecha_anulacion         : formModel.fecha_anulacion,
        notificacion_viatico    : formModel.notificacion_viatico,
        memorandum_id           : formModel.memorandum_id,
        escala_id               : formModel.escala_id,
        usuario_id              : formModel.usuario_id,
        tipo_comision_idp       : formModel.tipo_comision_idp,
    };

   

    return (
        <FormDialog
            addTitle="Agregar Viatico"
            editTitle="Editar Viatico"
            open={open}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialValues={newFormModel || zeroValues}
            formLayout={formLayout}
            validationSchema={validationSchema}  
           // debug          
            isEdit={typeof formModel !== 'undefined'}
        />
    );
};

