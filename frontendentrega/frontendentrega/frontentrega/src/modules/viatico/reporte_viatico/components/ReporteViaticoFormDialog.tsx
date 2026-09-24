import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
import { SelectOption, FormGroup, FormDialog, FormValue } from 'components/core/FormDialog';
import { ReporteViaticoModuleService } from '../ReporteViaticoModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';

import { ENUM_SINO_2 } from 'constants/enums';
import { OptionsFormModel } from 'modules/Types';
import { ReporteViaticoTableModel } from './ReporteViaticoTable';
import { MemorandumModuleService } from 'modules/viatico/memorandum';
import { UpdateParams } from 'components/core/DataTable';
import { DetalleDestinoModuleService } from 'modules/viatico/detalle_destino';
import { DetalleDestinoSumaPasajesFormModel } from 'modules/viatico/detalle_destino/components/DetalleDestinoFormDialog';
import { MemorandumFormModelDetalle2 } from 'modules/viatico/memorandum/components/MemorandumFormDialog';
import { EscalaModuleService } from 'modules/viatico/escala';
import { EscalaTableModel, EscalaTableModel2 } from 'modules/viatico/escala/components/EscalaTable';
import { DetalleTipoVehiculoTableModel } from 'modules/viatico/detalle_destino/components/DetalleDestinoTable';


export type ReporteViaticoFormModel = {
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
    usuario_id?             : string;

    escala_exterior?         : string;
    destino?                 : string;
   // escala_trabajo?          : string;

    _createdBy?             : string;
    _createdAt?             : string;
    _updatedBy?             : string;
    _updatedAt?             : string;
};


type Props = {    
   
    open: boolean;
    formModel?: ReporteViaticoFormModel;
    onComplete: () => void;    
};

export const ReporteViaticoFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();

    const padreOptions: SelectOption[] = ENUM_SINO_2;
   
    const [categoria, setCategoria] = useState<EscalaTableModel2>();
    const [destinoExterior, setDestinoExterior] = useState<DetalleTipoVehiculoTableModel>();
    const [sumaPasajes, setSumaPasajes] = useState<DetalleDestinoSumaPasajesFormModel>(); 
    const [detalleMemorandum, setDetalleMemorandum] = useState<MemorandumFormModelDetalle2>();   
    
   // const [params,setTableParams] = useState<ReporteViaticoFormModel>();       
  //SE LLENAN DATOs
  //  const [destinoData, setReporteViaticoData] = useState<ReporteViaticoFormModel>();
   // const categoriaOptions: SelectOption[] = categoria.map((item: OptionsFormModel) => ({ value: item.id || '', label: item.nombre }));
   
//FIN LLENAR DATOS
    const formLayout: FormGroup<ReporteViaticoFormModel>[] = [
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
                    //{ name: 'suma_pasaje_ida', label: String(formModel?.suma_pasaje_ida)  , type: 'text',infoText:'Suma Psjes Ida ($)', disabled:true },
                   // (formModel?.tipo_comision_idp ==="NACIONAL" || formModel?.tipo_comision_idp ==="PROVINCIAL" )?
                    { name: 'suma_pasaje_retorno', label: String(formModel?.suma_pasaje_retorno), type: 'text',infoText:'Suma Psjes Retorno (Bs.)', disabled:true },//:
                   //  { name: 'suma_pasaje_retorno', label: String(formModel?.suma_pasaje_retorno), type: 'text',infoText:'Suma Psjes Retorno ($)', disabled:true },
                    //(formModel?.tipo_comision_idp ==="NACIONAL" || formModel?.tipo_comision_idp ==="PROVINCIAL" )?
                    { name: 'total_pasajes', label: String(formModel?.total_pasajes), type: 'text',infoText:'Suma Total Pasajes (Bs.)', disabled:true },//:
                   // { name: 'total_pasajes', label: String(formModel?.total_pasajes), type: 'text',infoText:'Suma Total Pasajes ($)', disabled:true },
                ],               
            ]
        },
        {
            title: 'Datos del ReporteViatico',
            grid: [                             
                [  
                    { name: 'categoria_usuario', label: categoria?.categoria, type: 'text' ,infoText:'Categoria del Cargo', disabled:true},
                    { name: 'tipo_comision_idp_escala', label: categoria?.tipo_comision_idp, type: 'text' ,infoText:'Tipo Comision', disabled:true},
                   // (formModel?.tipo_comision_idp ==="NACIONAL" || formModel?.tipo_comision_idp ==="PROVINCIAL" )?
                    { name: 'viaticos_por_dia', label: String(formModel?.viaticos_por_dia), type: 'text' ,infoText:'ReporteViatico Asignado (Bs.)', disabled:true},//: 
                    //{ name: 'viaticos_por_dia', label: String(formModel?.viaticos_por_dia), type: 'text' ,infoText:'ReporteViatico Asignado ($)', disabled:true},
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
                    { name: 'fecha_pago_viatico', label: 'Fecha de Pago ReporteViatico', type: 'datetime', infoText: 'ej. 20/02/2024' }
                ], 
                [
                    
                    //{ name: 'tipo_pasaje_gd', label: 'Tipo Pasaje General/Detallado', type: 'text', infoText: 'ej. Pasaje General/Detallado' },
                   // (formModel?.tipo_comision_idp ==="NACIONAL" || formModel?.tipo_comision_idp ==="PROVINCIAL" )?
                    { name: 'total_pasajes', label:  String(formModel?.total_pasajes), type: 'text', infoText: 'Total suma pasajes (Bs.)' },//:
                    //{ name: 'total_pasajes', label:  String(formModel?.total_pasajes), type: 'text', infoText: 'Total suma pasajes ($)' },
                   // (formModel?.tipo_comision_idp ==="NACIONAL" || formModel?.tipo_comision_idp ==="PROVINCIAL" )?
                    { name: 'total_viatico', label: String(formModel?.total_viatico), type: 'text', infoText: 'Total ReporteViaticos(Bs)' },//:
                    //{ name: 'total_viatico', label: String(formModel?.total_viatico), type: 'text', infoText: 'Total ReporteViaticos($)' },
                    //(formModel?.tipo_comision_idp ==="NACIONAL" || formModel?.tipo_comision_idp ==="PROVINCIAL" )?
                    { name: 'liquido_pagable', label: String(formModel?.liquido_pagable), type: 'text', infoText: 'Liquido Pagable(Bs.)' },//:
                    //{ name: 'liquido_pagable', label: String(formModel?.liquido_pagable), type: 'text', infoText: 'Liquido Pagable($)' }, 
                ],
              /*  [                  
                    { name: 'estado_pago', label: 'Estado Pago', type: 'text', infoText: 'ej. pagado, No pagado' },
                    { name: 'estado_recibo', label: 'Estado Recibo', type: 'text', infoText: 'ej. Correcto, anulado' } //type: 'radio-group', options: padreOptions, inlineDisplay: true
                ],*/
                [
                //    { name: 'fecha_anulacion', label: 'Fecha de Anulacion', type: 'datetime', infoText: 'ej. 20/02/2024' },
                    //{ name: 'notificacion_viatico', label: 'Notificacion de ReporteViatico', type: 'text', infoText: 'ej. SI, NO' }
                ] //type: 'autocomplete', options: areasOptions
            ]
        }
    ];

    const isNumberUnique = async (nro: number) => {
        const n = Number(formModel && formModel.nume_recibo);
        if(n!==nro){
            const result = await ReporteViaticoModuleService.getNroReciboData(nro);
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
          // estado_pago             : yup.boolean().required(),
          //  estado_recibo           : yup.string().required(),
           // fecha_anulacion         : yup.date().required(),
           // notificacion_viatico    : yup.string().required()
        })
        .defined();

   

    const handleSubmit = async (formData: FormValue) => {
         
        const result = await ReporteViaticoModuleService.createOrUpdateReporteViatico(formData as unknown as ReporteViaticoFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        return onComplete();
        
    };

    const handleCancel = () => {
        onComplete();
    };

    const zeroValues: ReporteViaticoFormModel = {
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
    };

    useEffect(() => {
        const fetchData = async () => {           
             const resultDetalleDestino = await DetalleDestinoModuleService.getSumatoriaPasajes(formModel?.id!);
            if (!resultDetalleDestino || !resultDetalleDestino.success) return;
            const newDetalleDestino = resultDetalleDestino.data; 
            
           /* const resultMemorandum = await MemorandumModuleService.getDatosMemorandum(formModel?.memorandum_id!);
            if (!resultMemorandum || !resultMemorandum.success) return;
            const newMemorandum = resultMemorandum.data;*/

           const resultdestinoExterior = await DetalleDestinoModuleService.getDestinoExterior(formModel?.memorandum_id!);
            if (!resultdestinoExterior || !resultdestinoExterior.success) return;
            const newDestinoExterior = resultdestinoExterior.data;   
           
            const resultEscala = await EscalaModuleService.getEscalaCategoriaIDP(formModel?.cargo_usuario!, formModel?.tipo_comision_idp!, formModel?.usuario_id!);
            if (!resultEscala || !resultEscala.success) return;
            const newEscala = resultEscala.data;            
           

           /* const resultReporteViaticoTotal = await EscalaModuleService.getReporteViaticoTotal();
            if (!resultReporteViaticoTotal || !resultReporteViaticoTotal.success) return;
            const newReporteViaticoTotal = resultReporteViaticoTotal.data;*/
            
            if (isMounted())
                setSumaPasajes(newDetalleDestino); 
             //   setDetalleMemorandum(newMemorandum); 
                setDestinoExterior(newDestinoExterior);  
                setCategoria(newEscala); 

                
            /*const resultReporteViatico = await ReporteViaticoModuleService.getAllReporteViatico();
            if (!resultReporteViatico || !resultReporteViatico.success) return;
            const newReporteViaticos = resultReporteViatico.rows || [];
            if (isMounted()) setReporteViaticos(newReporteViaticos);*/
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
        escala_id               : formModel.escala_id
    };

    

    return (
        <FormDialog
            addTitle="Agregar ReporteViatico"
            editTitle="Editar ReporteViatico"
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

