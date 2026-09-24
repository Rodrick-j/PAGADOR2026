import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';

import { SelectOption, FormGroup, FormDialog, FormValue } from 'components/core/FormDialog';
import { HistorialAperturaModuleService } from '../HistorialAperturaModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';

import { ENUM_SINO_2 } from 'constants/enums';
import { Options2FormModel, OptionsFormModel } from 'modules/Types';
import { AreaModuleService } from 'modules/rrhh/area';
import Autocomplete from 'theme/overrides/Autocomplete';
import { ObjetoGastoModule, ObjetoGastoModuleService } from 'modules/apertura/objeto_gasto';

export type HistorialAperturaFormModel = {
    id?                         : number;
    //nombre_area                 : string;
    ue                            : number;
    sigla_area                  : string;
    apertura_programatica       : string;
    cod_fte                     : string;
    cod_org                     : string;
    objeto                      : string;
    descripcion_objeto_gasto    : string;  
    presupuesto_inicial         : number;
    presupuesto_restante        : number;
    estado                      : string;
    sisin                       : string;
    gestion                     : string;
    mod_aprobada                : number;
    presupuesto_vigente         : number;
    pagado                      : number;
    saldo_ejecutar              : number;
    area_id?                    : string | null;
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
    formModel?: HistorialAperturaFormModel;
    onComplete: () => void;
};

export const HistorialAperturaFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();

    const padreOptions: SelectOption[] = ENUM_SINO_2;
    const [areas, setAreas] = useState<OptionsFormModel[]>([]);
    const areasOptions: SelectOption[] = areas.map((item: OptionsFormModel) => ({ value: item.id || '', label: item.nombre }));
    const [objetos, setObjetos] = useState<OptionsFormModel[]>([]);
    const objetosOptions: SelectOption[] = objetos.map((item: Options2FormModel) => ({ value: item.id || '', label: item.nombre , caption: item.concepto }));
    const gestionActual = new Date().getFullYear(); 

  
    //const siglaAuto :FormValue = it
    const formLayout: FormGroup<HistorialAperturaFormModel>[] = [
        {
            title: '',
            grid: [
                [{ name: 'area_id', label: 'Nombre del Area/Proyecto/etc.', type: 'autocomplete', options:areasOptions }],//, type: 'autocomplete', options: aperturaGeneralsOptions
                [
                  //  { name: 'sigla_area', label: 'Sigla del Area/Proyecto', type: 'text' }, 
                    { name: 'apertura_programatica', label: 'Apertura Programatica', type: 'text', infoText: 'ej. 000 0 001' },
                    { name: 'gestion', label:'Gestion' , type: 'text', disabled:true },
                ],
                [                
                    { name: 'cod_fte', label: 'Cod FTE', type: 'text', infoText: 'ej. 20' },
                    { name: 'cod_org', label: 'Cod ORG', type: 'text', infoText: 'ej. 230' },   
                    { name: 'ue', label: 'UE', type: 'text', infoText: 'ej. 1' },                
                ],
                [                  
                    { name: 'objeto', label: 'Objeto', type: 'autocomplete', infoText: 'ej. 2.2.1.10', options: objetosOptions}
                ],
              //  [{ name: 'descripcion_objeto_gasto', label:formValuesObjeto.descripcion_objeto_gasto, type: 'text', infoText: 'ej.Pasajes y Generals por viaje al interior ', disabled:true }],
                [
                    { name: 'presupuesto_inicial', label: 'Presupuesto Inicial', type: 'text', infoText: 'ej. 2500 Bs.' },
                    { name: 'presupuesto_restante', label: 'Presupuesto Restante', type: 'text', infoText: 'ej. 2500' }
                ],
                [
                    { name: 'mod_aprobada', label: 'Mod. Aprobada', type: 'text', infoText: 'ej. 2500 Bs.' },
                    { name: 'presupuesto_vigente', label: 'Presupuesto Vigente', type: 'text', infoText: 'ej. 2500' }
                ],
                [
                    { name: 'pagado', label: 'Pagado', type: 'text', infoText: 'ej. 2500 Bs.' },
                    { name: 'saldo_ejecutar', label: 'Saldo a ejecutar', type: 'text', infoText: 'ej. 2500' }
                ],
                [
                    { name: 'sisin', label: 'SISIN', type: 'text', infoText: 'ej. 120 09040035700000 000' },
                    //{ name: 'estado', label: 'Estado', type: 'text'}  //, type: 'radio-group', options: padreOptions,inlineDisplay: true 
                ]
            ]
        }
    ];

    const validationSchema = yup
        .object({
            area_id                     : yup.string().required(),
         //   sigla_area                  : yup.string().required(),
            apertura_programatica       : yup.string().required(),          
            cod_fte                     : yup.string().required(),
            cod_org                     : yup.string().required(),
            objeto                      : yup.string().required(),
         //   descripcion_objeto_gasto    : yup.string().required(),
            presupuesto_inicial         : yup.number().required().min(50,"El presupuesto debe ser mayor a 49"),
            presupuesto_restante        : yup.number().required().min(50,"El presupuesto debe ser mayor a 49"),
                 
        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await HistorialAperturaModuleService.createOrUpdateHistorialApertura(formData as unknown as HistorialAperturaFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        return onComplete();
    };

    const handleCancel = () => {
        onComplete();
    };

    const zeroValues: HistorialAperturaFormModel = {
        area_id                     : '',
        ue                          : 0,
        sigla_area                  : '',
        apertura_programatica       : '',       
        cod_fte                     : '',
        cod_org                     : '',
        objeto                      : '',
        descripcion_objeto_gasto    : '',
        presupuesto_inicial         : 0,
        presupuesto_restante        : 0,
        estado                      : 'CON PRESUPUESTO',
        sisin                       : '',
        gestion                     : String(new Date().getFullYear()),
        mod_aprobada                : 0,
        presupuesto_vigente         : 0,
        pagado                      : 0,
        saldo_ejecutar              : 0,
        
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!isMounted()) return;
            const resultAreas = await AreaModuleService.getAllArea();
            if (!resultAreas || !resultAreas.success) return;
            const newAreas = resultAreas.rows || [];

            const resultObjetos = await ObjetoGastoModuleService.getAllObjetoGasto();
            if (!resultObjetos || !resultObjetos.success) return;
            const newObjetos = resultObjetos.rows || [];		

            if (isMounted()) 
            setAreas(newAreas);
            setObjetos(newObjetos);
                   
            
        };
        if (open) {
            fetchData();
        }
    }, [open, isMounted, formModel]);

    const newFormModel = formModel && {
        id                          : formModel.id,
        area_id                     : formModel.area_id,
        sigla_area                  : formModel.sigla_area,
        ue                          : formModel.ue,
        apertura_programatica       : formModel.apertura_programatica,        
        cod_fte                     : formModel.cod_fte,
        cod_org                     : formModel.cod_org,
        objeto                      : formModel.objeto,
        descripcion_objeto_gasto    : formModel.descripcion_objeto_gasto,
        presupuesto_inicial         : formModel.presupuesto_inicial,
        presupuesto_restante        : formModel.presupuesto_restante,
        estado                      : formModel.estado,
        sisin                       : formModel.sisin,
        gestion                     : formModel.gestion,
        mod_aprobada                : formModel.mod_aprobada,
        presupuesto_vigente         : formModel.presupuesto_vigente,
        pagado                      : formModel.pagado,
        saldo_ejecutar              : formModel.saldo_ejecutar,
        
    };

    return (
        <FormDialog
            addTitle="Agregar Apertura Programatica"
            editTitle="Editar Apertura Programatica"
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
