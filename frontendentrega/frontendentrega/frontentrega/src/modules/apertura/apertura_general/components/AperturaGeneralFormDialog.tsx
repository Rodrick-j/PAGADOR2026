import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';

import { SelectOption, FormGroup, FormDialog, FormValue } from 'components/core/FormDialog';
import { AperturaGeneralModuleService } from '../AperturaGeneralModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';

import { ENUM_SINO_2, ENUM_TIPO_AREA } from 'constants/enums';
import { Options2FormModel, OptionsFormModel } from 'modules/Types';
import { AreaModuleService } from 'modules/rrhh/area';
import Autocomplete from 'theme/overrides/Autocomplete';
import { ObjetoGastoModule, ObjetoGastoModuleService } from 'modules/apertura/objeto_gasto';

export type AperturaGeneralFormModel = {
    id?                         : number;
    nombre_area?                 : string;
    objeto_gasto?                 :string;
    ue                           : number;
    sigla_area                  : string;
    apertura_programatica       : string;
    cod_fte                     : string;
    cod_org                     : string;
    objeto_id                      : string;
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
    tipo_area                   : string;
    area_hijo_id                : string;
 //   sigla_area_hijo?            :string;
    nombre_area_hijo_id?           :string;
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
    formModel?: AperturaGeneralFormModel;
    onComplete: () => void;
};

export const AperturaGeneralFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();

    const padreOptions: SelectOption[] = ENUM_SINO_2;
    const tipoAreaOptions: SelectOption[] = ENUM_TIPO_AREA;
  //  const [areas, setAreas] = useState<OptionsFormModel[]>([]);
  //  const areasOptions: SelectOption[] = areas.map((item: OptionsFormModel) => ({ value: item.id || '', label: item.nombre }));
    const [objetos, setObjetos] = useState<OptionsFormModel[]>([]);
    const objetosOptions: SelectOption[] = objetos.map((item: Options2FormModel) => ({ value: item.id || '', label: item.nombre , caption: item.concepto }));
    const gestionActual = new Date().getFullYear();
    const [showTipoArea, setTipoArea] = useState<string>('');
    const [areas, setAreas] = useState<{id: string; nombre: string;}[]>([]);
    const [areaHijos, setAreaHijos] = useState<{id: string; nombre: string;area_id:string}[]>([]);

   // Inicializa el estado del formulario basado en formModel o valores predeterminados
   const [formValues, setFormValues] = useState<AperturaGeneralFormModel>(() => ({
    ...{
        area_id                     : '',
        ue                          : 0,
        sigla_area                  : '',
        apertura_programatica       : '',
        cod_fte                     : '',
        cod_org                     : '',
        objeto_id                   : '',
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
        tipo_area                   : '',
        area_hijo_id                   : '',

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
        setTipoArea(formModel.tipo_area);
    }
}, [formModel]);



const areasOptions = (formValue: FormValue): SelectOption[] => {
    return areas
        .map((a: any) => ({
            value: a.id || '',
            label: a.nombre
        }));
};

const areaHijosOptions =  (formValue: FormValue): SelectOption[] => {
    const areaId = formValue.area_id;
    return areaHijos.filter((item) => areaId===item.area_id)

        .map((a: any) => ({
            value: a.id || '',
            label: a.nombre,
          //  id_usuario : a.id_usuario,
        }));
};


    //const siglaAuto :FormValue = it
    const formLayout: FormGroup<AperturaGeneralFormModel>[] = [
        {
            title: '',
            grid: [
                [{ name: 'tipo_area', label: 'Debe marcar si el area es PRINCIPAL O DEPENDENCIA', type: 'radio-group',
                    options: tipoAreaOptions, inlineDisplay: true,
                    onChange: (value, formik) => {
                        formik.setFieldValue('tipo_area', value);
                        setTipoArea(String(value));
                    }, },],

                [
                    { name: 'area_id', label: 'Nombre del Area/Proyecto/etc.', type: 'autocomplete', options:areasOptions,
                        onChange: (value, formik) => {
                            formik.setFieldValue('area_id', value);
                            formik.setFieldValue('area_hijo_id', "");
                     }}
                ],//, type: 'autocomplete', options: aperturaGeneralsOptions

                [  (showTipoArea === 'DEPENDENCIA')?
                    { name: 'area_hijo_id', label: 'Nombre del Area/Proyecto/etc. DEPENDENCIA', type: 'autocomplete', options:areaHijosOptions,fieldRequired: 'area_id' }:
                    {type: 'empty'}

                ],
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
                    { name: 'objeto_id', label: 'Objeto', type: 'autocomplete', infoText: 'ej. 2.2.1.10', options: objetosOptions}
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


    const isAperturaUnique = async (apertura: string,  codFte: string,codOrg: number, objeto: string, area: string, areaHijo:string) => {

        const n = formModel && formModel.apertura_programatica;
        //const areaHijoId = areaHijo === undefined ? '-': areaHijo;
        if(n!==apertura){
            const result = await AperturaGeneralModuleService.getAperturaData(apertura, codFte, codOrg, objeto, area, areaHijo);
            const exists = Boolean(result.data.apertura_programatica);
            return !exists;
        }
        return true;
    };

    const validationSchema = yup
        .object({
            area_id                     : yup.string().required(),
         //   sigla_area                  : yup.string().required(),
            apertura_programatica       : yup.string().required().required('La apertura es requerida')
                                        .test('is-unique', 'La apertura ya fue creada', async (value, context) => {
                                            const codFteValue = context.parent.cod_fte;
                                            const codOrgValue = context.parent.cod_org;
                                            const objetoValue = context.parent.objeto_id;
                                            const areaValue = context.parent.area_id;

                                            let areaHijoValue = String(context.parent.area_hijo_id).length === 0?'-':context.parent.area_hijo_id;

                                            if (value !== undefined && codFteValue!== undefined
                                                && codOrgValue !== undefined && objetoValue!== undefined && areaValue!== undefined
                                                && areaHijoValue !== undefined) {
                                                return await isAperturaUnique(value,  codFteValue,codOrgValue,objetoValue,areaValue,areaHijoValue);
                                            }
                                            return true;
                                        }),
            cod_fte                     : yup.string().required().matches(/^[0-9]+$/, "El campo debe ser numerico"),
            cod_org                     : yup.string().required().matches(/^[0-9]+$/, "El campo debe ser numerico"),
            objeto_id                   : yup.string().required(),
         //   descripcion_objeto_gasto    : yup.string().required(),
            presupuesto_inicial         : yup.number().required().min(50,"El presupuesto debe ser mayor a 49"),
            presupuesto_restante        : yup.number().required().min(50,"El presupuesto debe ser mayor a 49"),

        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await AperturaGeneralModuleService.createOrUpdateAperturaGeneral(formData as unknown as AperturaGeneralFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        limpiarFormulario();
        return onComplete();
    };

    const handleCancel = () => {
        limpiarFormulario();
        onComplete();
    };

    const zeroValues: AperturaGeneralFormModel = {
        area_id                     : '',
        ue                          : 0,
        sigla_area                  : '',
        objeto_gasto                : '',
        apertura_programatica       : '',
        cod_fte                     : '',
        cod_org                     : '',
        objeto_id                      : '',
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
        tipo_area                   :'',
        area_hijo_id                   : '',

    };

    // Función para limpiar el formulario
  const limpiarFormulario = () => {
    setFormValues(zeroValues); // Restablece el estado a su valor inicial
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

            const resultAreaHijos = await AreaModuleService.getAreaHijos();
            if (!resultAreaHijos || !resultAreaHijos.success) return;
            const newAreaHijos = resultAreaHijos.rows || [];

            if (isMounted())
            setAreas(newAreas);
            setObjetos(newObjetos);
            setAreaHijos(newAreaHijos);

        };
        if (open) {
            fetchData();
        }
    }, [open, isMounted, formModel]);

    const newFormModel = formModel && {
        id                          : formModel.id,
        area_id                     : formModel.area_id,
        sigla_area                  : formModel.sigla_area,
        objeto_gasto                : formModel.objeto_gasto,
        ue                          : formModel.ue,
        apertura_programatica       : formModel.apertura_programatica,
        cod_fte                     : formModel.cod_fte,
        cod_org                     : formModel.cod_org,
        objeto_id                      : formModel.objeto_id,
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
            //initialValues={newFormModel || zeroValues}
            initialValues={formValues}
            formLayout={formLayout}
            validationSchema={validationSchema}
          // debug
            isEdit={typeof formModel !== 'undefined'}
        />
    );
};
