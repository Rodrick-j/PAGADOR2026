import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
import { SelectOption, FormGroup, FormDialog, FormValue } from 'components/core/FormDialog';
import { EscalaModuleService } from '../EscalaModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';

import { ENUM_CATEGORIA_VIATICO, ENUM_ESCALA_VIATICOS, ENUM_SINO_2, ENUM_TIPO_COMISION, ENUM_TIPO_MONEDA } from 'constants/enums';
import { OptionsFormModel } from 'modules/Types';
import { CargoModuleService } from 'modules/rrhh/cargo';

export type EscalaFormModel = {
    id?                 : string;
    categoria           : string;    
    tipo_comision_idp   : string;
    escala              : string; // cambiar el
    viatico_por_dia     : number;
    moneda              : string;
    bolivianos          : number;
    cargo_id?           : string  | null;

    _createdBy?: string;
    _createdAt?: string;
    _updatedBy?: string;
    _updatedAt?: string;
};

type Props = {
    open: boolean;
    formModel?: EscalaFormModel;
    onComplete: () => void;
};

export const EscalaFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();

    const padreOptions: SelectOption[] = ENUM_SINO_2;
    const categoriaOptions: SelectOption[] = ENUM_CATEGORIA_VIATICO;
    const escalaOptions: SelectOption[] = ENUM_ESCALA_VIATICOS;
    const tipoComisionOptions: SelectOption[] = ENUM_TIPO_COMISION;
    const tipoMonedaOptions: SelectOption[] = ENUM_TIPO_MONEDA;

    const [cargos, setCargos] = useState<OptionsFormModel[]>([]);
    const cargosOptions: SelectOption[] = cargos.map((item: OptionsFormModel) => ({ value: item.id || '', label: item.nombre }));
    const [showEscala, setEscala]=useState<string>('');
    const [showTipoComision, setTipoComision]=useState<string>('');

 // Inicializa el estado del formulario basado en formModel o valores predeterminados
 const [formValues, setFormValues] = useState<EscalaFormModel>(() => ({
    ...{
        categoria           : '',
        tipo_comision_idp   : '',
        escala              : '',
        viatico_por_dia     : 0,
        moneda             : '',
        bolivianos          : 0,
        cargo_id            : '',
        //activo se puede colocar
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
        setEscala(formModel.escala);
        setTipoComision(formModel.tipo_comision_idp);
    }
}, [formModel]);

    const formLayout: FormGroup<EscalaFormModel>[] = [
        {
            title: '',
            grid: [
               
                 [{ name: 'tipo_comision_idp', label: 'Tipo de Comision', 
                    type: 'autocomplete', options: tipoComisionOptions, 
                    onChange:(value,formik)=>{
                        formik.setFieldValue('tipo_comision_idp', value);
                        setTipoComision(String(value));
                          },
                    }],
                 [{ name: 'categoria', label: 'Categoria de Personal', type: 'select', options:categoriaOptions}],
                 [{ name: 'cargo_id', label: 'Cargo', type: 'autocomplete', options: cargosOptions }], //type: 'autocomplete', options: cargosOptions 
                
                [
                    { name: 'viatico_por_dia', label: 'Viaticos por dia', type: 'text', infoText: 'ej. 50' },
                    { name: 'moneda', label: 'Tipo de Moneda', type: 'radio-group', options:tipoMonedaOptions, inlineDisplay:true },
                  //  { name: 'bolivianos', label: 'Bolivianos', type: 'text', infoText: 'ej. 50' } // type: 'radio-group', options: padreOptions, inlineDisplay: true
                ],
                 [  (showTipoComision === 'INTERNACIONAL')?
                    { 
                    name: 'escala',
                    label: 'Tipo de Escala',
                    type: 'select', 
                    options:escalaOptions,
                    infoText:'* Tipo de Escala: Seleccionar en caso de que los viaticos sean para el exterior del pais',
                    onChange:(value,formik)=>{
                     formik.setFieldValue('escala', value);
                     setEscala(String(value));
                       },
                     }:{type: 'empty'},
                     (showTipoComision === 'INTERNACIONAL' && showEscala ==='ESCALA1')?
                          { label: '*Viaticos en dolares Exterior ESCALA(1):Paises comprendidos en Norte America, Europa, Asia, Africa y Oceania.', type: 'label' }
                         :(showTipoComision === 'INTERNACIONAL' && showEscala ==='ESCALA1')?
                         { label: '*Viaticos en dolares Exterior ESCALA(2):Paises comprendidos en Centro y Sud America y el Caribe', type: 'label' }: {type: 'empty'}
                 ], //infoText:'Seleccionar en caso de Viatico Internacional  ' type: 'autocomplete', options: areasOptions
            ]
        }
    ];

    const validationSchema = yup
        .object({
            tipo_comision_idp   : yup.string().required(),
            cargo_id            : yup.string().required(), // para el autocomplete
            categoria           : yup.string().required(),           
          //  escala              : yup.string(),
            viatico_por_dia     : yup.number().required(),
            moneda             : yup.string(),
          //  bolivianos          : yup.number(),
            
            
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await EscalaModuleService.createOrUpdateEscala(formData as unknown as EscalaFormModel);
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

    const zeroValues: EscalaFormModel = {
        categoria           : '',
        tipo_comision_idp   : '',
        escala              : '',
        viatico_por_dia     : 0,
        moneda              : '',
        bolivianos          : 0,
        cargo_id            : '',
        //activo se puede colocar
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!isMounted()) return;
            const resultCargos = await CargoModuleService.getAllCargos();
            if (!resultCargos || !resultCargos.success) return;
            const newCargos = resultCargos.rows || [];
            if (isMounted()) 
                setCargos(newCargos);                  
            
        };
        if (open) {
            fetchData();
        }
    }, [open, isMounted, formModel]);

  
    return (
        <FormDialog
            addTitle="Agregar Escala"
            editTitle="Editar Escala"
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
