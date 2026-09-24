import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
import { SelectOption, FormGroup, FormDialog, FormValue } from 'components/core/FormDialog';
import { EscalaDestinoModuleService } from '../EscalaDestinoModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';

import { ENUM_DEPARTAMENTOS, ENUM_ESCALA_VIATICOS, ENUM_PROVINCIAS, ENUM_SINO_2, ENUM_TIPO_COMISION, ENUM_TIPO_MODALIDAD } from 'constants/enums';
import { OptionsFormModel } from 'modules/Types';
import { DestinoModuleService } from 'modules/bsss/destino';

export type EscalaDestinoFormModel = {
    id?                 : string;  
    tipo_pcp              : string; 
    escala_exterior       : string;
    destino             : string;  
    provincia            : string;
    modalidad            : string;
    pasaje_minimo         : number;
    pasaje_maximo         : number;
  
    _createdBy?: string;
    _createdAt?: string;
    _updatedBy?: string;
    _updatedAt?: string;
};

export type DestinoRangoPasajeViatico = {
    id?                 : string;     
    destino             : string;    
    modalidad            : string;
    pasaje_minimo         : number;
    pasaje_maximo         : number;  
};
export type EscalaDestinoPasajeFormModel = {
    id?                  : string;     
    destino              : string;    
    modalidad            : string;
    pasaje_minimo         : number;
    pasaje_maximo         : number;  
    rango                : number[];
};

type Props = {
    open: boolean;
    formModel?: EscalaDestinoFormModel;
    onComplete: () => void;
};

export const EscalaDestinoFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();

    const padreOptions: SelectOption[] = ENUM_SINO_2;
    const tipoPCPOptions: SelectOption[] = ENUM_TIPO_COMISION;
    const modalidadOptions: SelectOption[] = ENUM_TIPO_MODALIDAD;
    const provinciasOptions: SelectOption[] = ENUM_PROVINCIAS;
    const departamentosOptions: SelectOption[] = ENUM_DEPARTAMENTOS;
    const escalaOptions: SelectOption[] = ENUM_ESCALA_VIATICOS;

    const [destinos, setDestinos] = useState<OptionsFormModel[]>([]);
   // const destinosOptions: SelectOption[] = destinos.map((item: OptionsFormModel) => ({ value: item.id || '', label: item.nombre }));
    const [showEscalaDestino, setEscalaDestino]=useState<string>('');
    const [showTipoPCP, setTipoPCP]=useState<string>('');
    const [showDestinoNacional, setDestinoNacional]=useState<string>('');
    

 // Inicializa el estado del formulario basado en formModel o valores predeterminados
 const [formValues, setFormValues] = useState<EscalaDestinoFormModel>(() => ({
    ...{
        tipo_pcp      : '',
        escala_exterior : '',  //se puede colocar
        destino       : '',
        provincia     : '',
        modalidad     : '', 
        pasaje_minimo : 0,
        pasaje_maximo : 0,
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
        setEscalaDestino(formModel.modalidad);
        setTipoPCP(formModel.tipo_pcp);
        setDestinoNacional(formModel.destino);
    }
}, [formModel]);


    
    const formLayout: FormGroup<EscalaDestinoFormModel>[] = [
        {
            title: '',
            grid: [
                [{ name: 'modalidad',
                    label: 'Modalidad de Viaje', 
                    type: 'select', 
                    options: modalidadOptions,
                    infoText:'*Si selecciona OTRO debe especificar el tipo de Vehiculo',
                    onChange:(value,formik)=>{                       
                     formik.setFieldValue('modalidad', value);
                     setEscalaDestino(String(value));                     
                    },
                 },
                 (showEscalaDestino ==='OTRO')?
                 { name:'modalidad', label: 'Ingrese nuevo vehiculo', type: 'text' }:{type:'empty'},
                 ],
                
                [{ name: 'tipo_pcp', label: 'Seleccione el tipo de Viaje', 
                   type: 'select', options:tipoPCPOptions,
                   onChange:(value,formik)=>{                       
                    formik.setFieldValue('tipo_pcp', value);
                    setTipoPCP(String(value));                     
                   },
                },                
                ],
                [   (showTipoPCP ==='INTERNACIONAL')?
                    { name:'destino', label: 'Ingrese Pais de Destino', type: 'text' }:
                    (showTipoPCP ==='NACIONAL')?
                    { name:'destino', label: 'Seleccione el Departamento', type: 'select', options: departamentosOptions, 
                        onChange:(value,formik)=>{                       
                            formik.setFieldValue('destino', value);
                            setDestinoNacional(String(value));                     
                           },

                    }://selecion departamentos
                    { name: 'provincia', label: 'Seleccione el Provincia', type: 'select', options: provinciasOptions},     //seleccion provincias       
                    
                ],
                [
                    (showDestinoNacional ==='OTRO')?
                    { name:'destino', label: 'Ingrese nuevo destino Nacional', type: 'text' }:{type:'empty'},

                ],
                [   (showTipoPCP ==='PROVINCIAL')?
                    { name:'destino', label: 'Ingrese Comunidad o Municipio', type: 'text' }://seleccione comunidad
                    {type:'empty'},     //seleccion provincias        
                    
                ],
                [   (showTipoPCP ==='INTERNACIONAL')?
                    { name:'escala_exterior', label: 'Escala del Pais',  type: 'select', options:escalaOptions, infoText:'*Exterior ESCALA(1):Paises comprendidos en Norte America, Europa, Asia, Africa y Oceania.\n *Exterior ESCALA(2):Paises comprendidos en Centro y Sud America y el Caribe' }:{ type:'empty'},     //seleccion provincias                         
                ],              

                [   //(showTipoPCP ==='INTERNACIONAL')?
                    //{ name: 'pasaje_minimo', label: 'Pasaje Minimo ($)', type: 'text', infoText: 'ej. 5 ($)' }:
                    { name: 'pasaje_minimo', label: 'Pasaje Minimo (Bs.)', type: 'text', infoText: 'ej. 5 (Bs.)' },//:{type:'empty'},//,
                    //(showTipoPCP ==='INTERNACIONAL')?
                   // { name: 'pasaje_maximo', label: 'Pasaje Maximo ($)', type: 'text', infoText: 'ej. 50 ($)' }:
                    { name: 'pasaje_maximo', label: 'Pasaje Maximo (Bs.)', type: 'text', infoText: 'ej. 50 (Bs.)' },//:{type:'empty'},//,
                   
                ]
            ]
        }
    ];

    const validationSchema = yup
        .object({

            tipo_pcp      : yup.string().required(), 
            destino       : yup.string().required(),
          //  escala_exterior : yup.string(),   
            provincia     : yup.string(), 
            modalidad     : yup.string().required(), 
            pasaje_minimo  : yup.number().required(),
            pasaje_maximo  : yup.number().required(),
                    
            
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
      
        const result = await EscalaDestinoModuleService.createOrUpdateEscalaDestino(formData as unknown as EscalaDestinoFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        limpiarFormulario();
        return onComplete();
    };

    const handleCancel = () => {
        onComplete();
    };

    const zeroValues: EscalaDestinoFormModel = {

        tipo_pcp      : showTipoPCP,
        escala_exterior : '',  //se puede colocar
        destino       : '',
        provincia     : '',
        modalidad     : showEscalaDestino, 
        pasaje_minimo : 0,
        pasaje_maximo : 0,
    

           //activo se puede colocar
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!isMounted()) return;
            const resultDestinos = await DestinoModuleService.getAllDestinos();
            if (!resultDestinos || !resultDestinos.success) return;
            const newDestinos = resultDestinos.rows || [];
            if (isMounted()) 
                setDestinos(newDestinos);                  
            
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
            addTitle="Agregar Escala Destino"
            editTitle="Editar Escala Destino"
            open={open}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            //initialValues={newFormModel || zeroValues}
            initialValues={formValues}
            formLayout={formLayout}
            validationSchema={validationSchema}            
            isEdit={typeof formModel !== 'undefined'}
        />
    );
};
