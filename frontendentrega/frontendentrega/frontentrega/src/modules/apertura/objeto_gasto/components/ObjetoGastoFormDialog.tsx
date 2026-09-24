import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';

import { SelectOption, FormGroup, FormDialog, FormValue } from 'components/core/FormDialog';
import { ObjetoGastoModuleService } from '../ObjetoGastoModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';

import { ENUM_SINO_2 } from 'constants/enums';
import { OptionsFormModel } from 'modules/Types';
import { AreaModuleService } from 'modules/rrhh/area';
import Autocomplete from 'theme/overrides/Autocomplete';

export type ObjetoGastoFormModel = {
    id?                         : number;
    //nombre_area                 : string;   
    objeto                      : string;
    descripcion_objeto_gasto    : string;     
    observacion                 : string;   
    estado                      : boolean; 
   // activo                      : boolean; //se agrega para control
    //agregar area
    // para las columnas especiales
    // actions: unknown;

    _createdBy?: string;
    _createdAt?: string;
    _updatedBy?: string;
    _updatedAt?: string;
};

type Props = {
    open: boolean;
    formModel?: ObjetoGastoFormModel;
    onComplete: () => void;
};

export const ObjetoGastoFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();

    const padreOptions: SelectOption[] = ENUM_SINO_2;
    const [areas, setAreas] = useState<OptionsFormModel[]>([]);
    const areasOptions: SelectOption[] = areas.map((item: OptionsFormModel) => ({ value: item.id || '', label: item.nombre }));
    const gestionActual = new Date().getFullYear();
   
    //const siglaAuto :FormValue = it
    const formLayout: FormGroup<ObjetoGastoFormModel>[] = [
        {
            title: '',
            grid: [                
                [                     
                    { name: 'objeto', label: 'Objeto', type: 'text', infoText: 'ej. 2.2.1.10' }
                ],
                [{ name: 'descripcion_objeto_gasto', label: 'Descripcion Objeto Gasto', type: 'text', infoText: 'ej.Pasajes y Generals por viaje al interior ' }],               
                [                  
                    { name: 'observacion', label:'Observacion' , type: 'text',infoText: 'Anotar si existe algun tipo de observacion'   },                
                   
                ],
            ]
        }
    ];

    const isCadenaUnique = async (codigo: string) => {		
        const n = formModel && formModel.objeto; //Revisar		
        if(n!==codigo){
            const result = await ObjetoGastoModuleService.getObjetoGastoData(codigo);			
            const exists = Boolean(result.data.objeto);
            return !exists;
        }
        return true;
    };

    const validationSchema = yup
        .object({           
            objeto                      : yup.string().required('El codigo es requerido').test('is-unique', 'El codigo ya existe en la base objetos', async (value) => {
                                        
                                                if (value !== undefined ) {
                                                    return await isCadenaUnique(value);
                                                }
                                                return true;
                                            }),
            descripcion_objeto_gasto    : yup.string().required(),
                 
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await ObjetoGastoModuleService.createOrUpdateObjetoGasto(formData as unknown as ObjetoGastoFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        return onComplete();
    };

    const handleCancel = () => {
        onComplete();
    };

    const zeroValues: ObjetoGastoFormModel = {
      
        objeto                      : '',
        descripcion_objeto_gasto    : '',       
        observacion                 : '',     
        estado                      : true,
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!isMounted()) return;
            const resultAreas = await AreaModuleService.getAllArea();
            if (!resultAreas || !resultAreas.success) return;
            const newAreas = resultAreas.rows || [];
            if (isMounted()) 
                setAreas(newAreas);                           
            
        };
        if (open) {
            fetchData();
        }
    }, [open, isMounted, formModel]);

    const newFormModel = formModel && {
        id                          : formModel.id,        
        objeto                      : formModel.objeto,
        descripcion_objeto_gasto    : formModel.descripcion_objeto_gasto,     
        observacion                 : formModel.observacion,    
        estado                      : formModel.estado,
         
    };

    return (
        <FormDialog
            addTitle="Agregar Objeto de Gasto"
            editTitle="Editar Objeto de Gasto"
            open={open}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialValues={newFormModel || zeroValues}
            formLayout={formLayout}
            validationSchema={validationSchema}
           //debug
            isEdit={typeof formModel !== 'undefined'}
        />
    );
};
