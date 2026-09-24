import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
import { SelectOption, FormGroup, FormDialog, FormValue } from 'components/core/FormDialog';
//import { DetalleDestinoModuleServi } from '../DetalleDestinoModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';
import { parse as dateParse } from 'date-fns';

import { ENUM_DEPARTAMENTOS, ENUM_PROVINCIAS, ENUM_SIN_APERTURA, ENUM_TIPO_COMISION, ENUM_TIPO_TRANSPORTE_OP, ID_SIN_APERTURA, TIME_FORMAT } from 'constants/enums';
import { OptionsFormModel, OptionsFormModelFecha } from 'modules/Types';
import { DetalleDestinoModuleService } from 'modules/viatico/detalle_destino';
import { dateTest } from 'components/core/FormDialog/yup-tests';
import { VehiculoModuleService } from 'modules/bsss/vehiculo';
import { EscalaDestinoModuleService } from 'modules/viatico/escala_destino';
import { MemorandumModuleService } from 'modules/viatico/memorandum';
//import { EscalaDestinoPasajeFormModel } from 'modules/viatico/escala_destino/components/EscalaDestinoFormDialog';


export type ViaticoDetalleDestinoFormModel = {
    id?                    : string;
    tipo_vehiculo_op       : string;
    objetivo_viaje         : string;
    destino_reg            : string;
    fecha_dia              : Date | null;
    hora_inicio            : string;
    hora_fin               : string;
    pernocte               : string;
    pasaje_ida             : number;
    pasaje_retorno         : number;
    total_pasaje_dia       : number;
    tipo_vehiculo_opvida   : string;
    tipo_vehiculo_opvuelta : string;
    estado                 : string;
    modificacion?          : boolean;
    observacion?           : string;
    estado_observacion?    : string;
    memorandum_id?         : string | null;
     viatico_id?           : string | null;
    //vehiculo_id?: string | null;
    destino_id?            : string | null;
    destino_id2?           : string | null;
    dia_semana?            : string ;
    //aumentando campos para el calculo
   // estado?: number;
    //seleccion de destino
    tipo_pcp?              :string;
   // destino? : string;
    provincia?             : string;
    modalidad?             : string;
    precio_modalidad?      : string;
    apertura_viatico_id?   : string;
    apertura_pasaje_id?    : string;
    // campo para el control de apertura
    apertura_nombre_viatico?   : string;
    apertura_nombre_pasaje?    : string;
    apertura_prog_viatico?   : string;
    apertura_prog_pasaje?    : string;
    apertura_saldo_pasaje? : number;
    apertura_saldo_viatico? : number;

    _createdBy?: string;
    _createdAt?: string;
    _updatedBy?: string;
    _updatedAt?: string;
};

type Props = {

    memorandumId: string;
    viaticoId: string;
    open: boolean;
    formModel?: ViaticoDetalleDestinoFormModel;
    onComplete: () => void;
};

export const ViaticoDetalleDestinoFormDialog = ({ open, formModel, memorandumId, viaticoId, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();

    const vehiculoOPOptions: SelectOption[] = ENUM_TIPO_TRANSPORTE_OP;
    const vehiculoOPOptionsSin :SelectOption[]= ENUM_SIN_APERTURA;
    const [tipoVehiculoIda, setTipoVehiculoIda] = useState<string>('');
    const [tipoVehiculoVuelta, setTipoVehiculoVuelta] = useState<string>('');
   
    const [showDestino, setDestino] = useState<string>('');
    const [tipoPCP, setTipoPCP] = useState<string>('');
    const [vehiculos, setVehiculos] = useState<OptionsFormModel[]>([]);      
 
    //const padreOptions: SelectOption[] = ENUM_SINO_2;
    const [paises, setPaises] = useState<OptionsFormModel[]>([]);
    const [comunidades, setComunidades] = useState<OptionsFormModel[]>([]);
    const [modalidades, setModalidades] = useState<OptionsFormModel[]>([]);
    const [pasajes, setPasajes] = useState<OptionsFormModel[]>([]);
    const [pernocte, setPernocte] = useState<OptionsFormModelFecha[]>([]);
    const [valorPernocte, setValorPernocte] = useState<string>('');
   // const [escalaDestinos, setEscalaDestinos] = useState<OptionsFormModel[]>([]);
    //llenar destinos     
    const ModalidadesOptions: SelectOption[] = modalidades.map((item: OptionsFormModel) => ({ value: item.id || '', label: item.nombre }));
    const pasajesOptions: SelectOption[] = pasajes.map((item: OptionsFormModel) => ({ value: item.id || '', label: item.nombre }));
    
    const valorPernoctePasaje = (pernocte: OptionsFormModelFecha[]) => {
	
		
        for(let i = 0; i < pernocte.length; i++)
            {
                if(pernocte[i].id === formModel?.fecha_dia)				
                {
                    setValorPernocte(pernocte[i].nombre);                    
                }
            } // Restablece el estado a su valor inicial
      };
   
 // Inicializa el estado del formulario basado en formModel o valores predeterminados
 const [formValues, setFormValues] = useState<ViaticoDetalleDestinoFormModel>(() => ({
    ...{
        tipo_vehiculo_op    : '',
        objetivo_viaje      : '',
        destino_reg         : '',
        fecha_dia           : new Date(),
        hora_inicio         : '',
        hora_fin            : '',
        pernocte            :  '',
        pasaje_ida          : 0,
        pasaje_retorno      : 0,
        total_pasaje_dia    : 0,
        tipo_vehiculo_opvida   :'',
        tipo_vehiculo_opvuelta :'',
        estado              :'PENDIENTE',
        viatico_id          : viaticoId, 
        memorandum_id       : memorandumId,           
        tipo_pcp            : '',
  //      destino             : '',
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
        setTipoVehiculoIda(formModel.tipo_vehiculo_opvida);
        setTipoVehiculoVuelta(formModel.tipo_vehiculo_opvuelta)
    }
}, [formModel]);
    

    const formLayout: FormGroup<ViaticoDetalleDestinoFormModel>[] = [
        {
            title: 'Datos del Vehiculo y Viaje',
            grid: [
               /* [
                    { name: 'tipo_vehiculo_op',label: 'Vehiculo Oficial o Publico Memorandum',type: 'select',disabled: true,options: vehiculoOPOptions},
                    { name: 'fecha_dia', label: 'Fecha dia', type: 'datetime', disabled: true }
                ],     */        
                [   { name: 'destino_reg', label: 'Destino de viaje', type: 'text', disabled: true },
                    { name: 'tipo_pcp',label: tipoPCP, type: 'text', disabled: true}] ,  
                [   { name: 'hora_inicio', label: 'Hora Inicio', type: 'text', disabled: true },
                    { name: 'hora_fin',label: 'Hora Fin', type: 'text', disabled: true}] ,  
                [   { name: 'objetivo_viaje', label: 'Objetivo de viaje', type: 'textarea', disabled: true }], //type: 'autocomplete', options: areasOptions
                [
                    { name: 'tipo_vehiculo_op',label: 'Vehiculo Oficial o Publico Memorandum',type: 'select',disabled: true,options: vehiculoOPOptions},
                    { name: 'fecha_dia', label: 'Fecha dia', type: 'datetime', disabled: true }
                ],  

                [   { name: 'pernocte', label: 'Pernocte', type: 'text', disabled: true },
                    { name: 'dia_semana',label: 'Dia Semana', type: 'text', disabled: true}] ,  
                                 

            ]
        },

         {
            title: 'Datos de la Apertura',
            grid: [

                [   { name: 'apertura_nombre_pasaje', label: 'Nombre Area Apertura', type: 'textarea', disabled: true }] ,        
                [   { name: 'apertura_prog_pasaje', label: 'Apertura Programatica', type: 'text', disabled: true },
                    { name: 'apertura_saldo_pasaje',label: "Saldo Restante Apertura Pasaje (Bs)", type: 'text', disabled: true}] ,                                  

            ]
        },
        (formModel?.apertura_pasaje_id != ID_SIN_APERTURA)?		
        {
            title: 'Datos de los viaticos Ida viaje',
            grid: [
                
                [   
                    { name: 'tipo_vehiculo_opvida',label: 'Vehiculo Oficial o Publico',type: 'select',options: vehiculoOPOptions,
                        onChange: (value, formik) => {
                            formik.setFieldValue('tipo_vehiculo_opvida', value);
                            setTipoVehiculoIda(String(value));
                        },
                    },     
                    (tipoVehiculoIda ==='PUBLICO' && (valorPernocte === '0'|| valorPernocte === '1'))?
                    { name: 'precio_modalidad', label: 'Precios Establecidos Pasaje',type: 'select', options:pasajesOptions}:
                    (tipoVehiculoIda ==='OFICIAL')?
                    {label:'Como el Vehiculo es oficial, NO existe Costo pasaje de Ida, Pasaje = 0 ',type:'label',disabled:true}:
                    (tipoVehiculoIda ==='PUBLICO'&& valorPernocte === '2' )?  
                    {label:'Como el viaje viene CON PERNOCTE NO existe costo de pasaje de Ida, Pasaje = 0',type:'label',disabled:true}:
                    (tipoVehiculoIda ==='PUBLICO'&& valorPernocte === '3')?  
                    {label:'Como el viaje viene CON PERNOCTE desde el dia Anterior NO existe costo de pasaje de Ida, Pasaje = 0',type:'label',disabled:true}:
                     {type:'empty'},                                                                             
                ], 
              
                [       
                    (tipoVehiculoIda ==='PUBLICO'  && (valorPernocte === '0'|| valorPernocte === '1'))?
                    { name: 'destino_id', label: 'Modalidad de Viaje',type: 'select', options:ModalidadesOptions}:{type:'empty'},
                    (tipoVehiculoIda ==='PUBLICO' && (valorPernocte === '0'|| valorPernocte === '1'))?                              
                    { name: 'pasaje_ida', label: 'Pasaje de Ida',type: 'text'}:{type:'empty'},// options : pasajesOptions2                   
                ],
            ]
        }:{
            
            title: 'Datos de los viaticos Ida viaje',
            grid: [ [
               
                    { name: 'tipo_vehiculo_opvida',label: 'Vehiculo Oficial o Publico',type: 'select',options: vehiculoOPOptionsSin,
                        onChange: (value, formik) => {
                            formik.setFieldValue('tipo_vehiculo_opvida', value);
                            setTipoVehiculoIda(String(value));
                        },
                    },     
                  //  (tipoVehiculoIda ==="SIN_APERTURA")?                  
                    {label:'El usuario no cuenta con Apertura Programatica para pasajes, Pasaje = 0',type:'label',disabled:true}//:                 
                  //  {type:'empty'},                                                                             
             
            ]]},
        
        (formModel?.apertura_pasaje_id != ID_SIN_APERTURA)?		

        {
            title: 'Datos de los viaticos Retorno Viaje',
            grid: [
                [
                    { name: 'tipo_vehiculo_opvuelta',label: 'Vehiculo Oficial o Publico',type: 'select',options: vehiculoOPOptions,
                        onChange: (value, formik) => {
                            formik.setFieldValue('tipo_vehiculo_opvuelta', value);
                            setTipoVehiculoVuelta(String(value));
                        },
                    },    
                    (tipoVehiculoVuelta ==='PUBLICO' && (valorPernocte === '0'|| valorPernocte === '3'))?
                    { name: 'precio_modalidad', label: 'Precios Establecidos Pasaje',type: 'select', options:pasajesOptions}:
                    (tipoVehiculoVuelta ==='OFICIAL')?
                    {label:'Como el Vehiculo es oficial, NO existe Costo pasaje de Vuelta, Pasaje = 0 ',type:'label',disabled:true}:  //seleccion                                                                                 
                    (tipoVehiculoVuelta ==='PUBLICO'&& valorPernocte === '1' )?  
                    {label:'Como el viaje viene CON PERNOCTE NO existe costo de pasaje de Vuelta, Pasaje = 0',type:'label',disabled:true}:                     
                    (tipoVehiculoVuelta ==='PUBLICO'&& valorPernocte === '2')?  
                    {label:'Como el viaje viene CON PERNOCTE desde el dia Anterior NO existe costo de pasaje de Vuelta, Pasaje = 0',type:'label',disabled:true}:                    
                    {type:'empty'},
                ], 
            
                [       
                    
                    (tipoVehiculoVuelta ==='PUBLICO'&& (valorPernocte === '0'|| valorPernocte === '3'))?                    
                    { name: 'destino_id2', label: 'Modalidad de Viaje',type: 'select', options:ModalidadesOptions}:{type:'empty'},
                    (tipoVehiculoVuelta ==='PUBLICO'&& (valorPernocte === '0'|| valorPernocte === '3'))?    
                    { name: 'pasaje_retorno', label: 'Pasaje de Vuelta',type: 'text' }:                    
                    {type:'empty'}, // , options : pasajesOptions2 type: 'radio-group', options: padreOptions, inlineDisplay: true
                ],                
               
            ]
        }:{
            
            title: 'Datos de los viaticos Retorno viaje',
            grid: [ [
                 { name: 'tipo_vehiculo_opvuelta',label: 'Vehiculo Oficial o Publico',type: 'select',options: vehiculoOPOptionsSin,
                    onChange: (value, formik) => {
                        formik.setFieldValue('tipo_vehiculo_opvuelta', value);
                        setTipoVehiculoVuelta(String(value));
                    },
                },
                  //  (tipoVehiculoIda ==="SIN_APERTURA")?                  
                  {label:'El usuario no cuenta con Apertura Programatica para pasajes,  Pasaje = 0',type:'label',disabled:true}//:                 
                  //  {type:'empty'},               
            ]]},
    ];
    
   
    const validationSchema = yup
        .object({
        
            tipo_vehiculo_opvida  : yup.string().required(),
            tipo_vehiculo_opvuelta  : yup.string().required(),  
            //viatico_id : yup.string().required(),       
          
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
      		  
        const result = await DetalleDestinoModuleService.createOrUpdateDetalleDestino(formData as unknown as ViaticoDetalleDestinoFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        limpiarFormulario();
        return onComplete();
    };

    const handleCancel = () => {
        limpiarFormulario();
        onComplete();
    };

    //enviamos el id de memorandum al cargar valores
    const zeroValues: ViaticoDetalleDestinoFormModel = {
        tipo_vehiculo_op    : '',
        objetivo_viaje      : '',
        destino_reg         : '',
        fecha_dia           : new Date(),
        hora_inicio         : '',
        hora_fin            : '',
        pernocte            :      '',
        pasaje_ida          : 0,
        pasaje_retorno      : 0,
        total_pasaje_dia    : 0,
        tipo_vehiculo_opvida   :'',
        tipo_vehiculo_opvuelta :'',
        estado              :'PENDIENTE',
        memorandum_id       : memorandumId,
        viatico_id          : viaticoId,    
        tipo_pcp            : '',
  //      destino             : '',      
       
    };

    // Función para limpiar el formulario
  const limpiarFormulario = () => {
    setFormValues(zeroValues); // Restablece el estado a su valor inicial
  };

    useEffect(() => {
        const fetchData = async () => {
            if (!isMounted()) return;           
            const resultVehiculo = await VehiculoModuleService.getAllVehiculos();
            if (!resultVehiculo || !resultVehiculo.success) return;
            const newVehiculo = resultVehiculo.rows || [];
            //Listado de paises 
            const resultPaises = await EscalaDestinoModuleService.getAllPaises();
            if (!resultPaises || !resultPaises.success) return;
            const newPaises = resultPaises.rows || [];
            // listado de comunidades
            const resultComunidades = await EscalaDestinoModuleService.getAllComunidades();
            if (!resultComunidades || !resultComunidades.success) return;
            const newComunidades = resultComunidades.rows || [];
            // listado de Modalidades
            const resultModalidades = await EscalaDestinoModuleService.getAllModalidades();
             if (!resultModalidades || !resultModalidades.success) return;
             const newModalidades = resultModalidades.rows || [];
            //Valor del tipo de Comision
            const resultMemorandum = await MemorandumModuleService.getTipoPCP(memorandumId);
            if (!resultMemorandum || !resultMemorandum.success) return;
            const nombre = String(resultMemorandum.data?.nombre); 
            
             //Valor del tipo de vehiculo
             const DetalleDestinoId = String(formModel?.id);
             const resultTipoVehiculo = await DetalleDestinoModuleService.getTipoVehiculo(DetalleDestinoId);
             if (!resultTipoVehiculo || !resultTipoVehiculo.success) return;
             //  const tipoVehiculo = String(resultTipoVehiculo.data?.nombre);      
             const destino = String(resultTipoVehiculo.data?.caption);                         
             // listado de Pasajes            
            
              const resultPasajes = await EscalaDestinoModuleService.getAllPasajes(destino);
             if (!resultPasajes || !resultPasajes.success) return;
             const newPasajes = resultPasajes.rows || [];   
             
             //Listado de pernocte 
             const resultDetallePernocte = await DetalleDestinoModuleService.getListaPernocte(memorandumId);
            if (!resultDetallePernocte || !resultDetallePernocte.success) return;
            const newPernocte = resultDetallePernocte.rows || [];
            valorPernoctePasaje(newPernocte);			     
           
            if (isMounted())
                 setVehiculos(newVehiculo);
                // setDestinos(newEscalaDestinos);
                 setPaises(newPaises);
                 setComunidades(newComunidades);
                 setModalidades(newModalidades);
                 setTipoPCP(nombre); 
                // setTipoVehiculo(tipoVehiculo);
                 setDestino(destino);                       
                 setPasajes(newPasajes);
                 setPernocte(newPernocte);   
                      
                 
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
          //initialValues={newFormModel || zeroValues}
            initialValues={formValues }
            formLayout={formLayout}
            validationSchema={validationSchema} 
          //  debug        
            isEdit={typeof formModel !== 'undefined'}

        />
    );
};
