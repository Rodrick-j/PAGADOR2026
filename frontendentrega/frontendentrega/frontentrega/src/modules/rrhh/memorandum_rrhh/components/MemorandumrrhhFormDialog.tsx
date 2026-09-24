import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
import { SelectOption, FormGroup, FormDialog, FormValue } from 'components/core/FormDialog';
import { MemorandumrrhhModuleService } from '../MemorandumrrhhModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';

import { ENUM_DIAS_HABILES, ENUM_SINO_2, ENUM_TIPO_COMISION, ENUM_TIPO_MEMORANDUM, ENUM_TIPO_MEMORANDUM_RRHH, ENUM_TIPO_TRANSPORTE, ENUM_TIPO_TRANSPORTE_OP, ID_SIN_APERTURA, MEMORANDUM_FUNCIONES, MEMORANDUM_SIN_COBRO } from 'constants/enums';
import { Options2FormModel, OptionsFormModel } from 'modules/Types';
import { UsersModuleService } from 'modules/system/users';
import { CargoModuleService } from 'modules/rrhh/cargo';
import { VehiculoModuleService } from 'modules/bsss/vehiculo';
import { useSession } from 'hooks/session';
//import { AperturaViaticoModuleService } from 'modules/viatico/apertura_viatico';
import { AreaModuleService } from 'modules/rrhh/area';

export type MemorandumrrhhFormModel = {

    //Tabla original de meorandum
    id?                         : string;
    cod_depart_memo        : string;
    tipo_memorandum        : string;
    autorizado_por         : string[];
   // cargo_jefe_unidad      : string;
    fecha_memo_registro    : Date;
    tipo_comision_idp      : string;
    fecha_inicio_viaje     : Date;
    fecha_fin_viaje        : Date;
    cantidad_dias          : number;
    tipo_memo_repo         : string;
    tipo_transporte        : string;
    observacion            : string;
    estado_memorandum      : string;
    notificacion_memo      : string;
   // apertura_viatico_id  : string | null;
   // apertura_pasaje_id   : string | null;
    usuario_id            : string | null;
    vehiculo_id           : string | null;
    cargo_id              : string | null;

    modificacion          :boolean;
    obs_modificacion      :string;
    fecha_cambio          :string;
    estado_modificacion   :string;
//campos que se aumentan
    nombre_usuario        : string;
    ci                    : string;
    cargo_usuario         : string
    nume_celular          : string;
    dias_habiles          : string;
    area?                 : string;

//Fechas de actualizacion
    _createdBy?: string;
    _createdAt?: string;
    _updatedBy?: string;
    _updatedAt?: string;

  // nuevos campos memorandum

};

export type MemorandumrrhhFormModelDetalle = {
    id?                    : string;
    cod_depart_memo        : string;
    fecha_inicio_viaje     : Date;
    fecha_fin_viaje        : Date;
    cantidad_dias          : number;
};

export type MemorandumrrhhFormModelDetalle2 = {
    id?                    : string;
    nombre_usuario : string;
    ci: string;
    cargo_usuario : string
    tipo_comision_idp      : string;
    fecha_inicio_viaje     : string;
    fecha_fin_viaje        : string;
    cantidad_dias          : string;
};
export type MemorandumTipoPCPModel = {
    id: string;
    nombre: string;
    caption?: string;
};

export type MemorandumConteoDiasModel = {
    id: string;
    nombre: boolean;
    caption?: number;
};

type Props = {
    open: boolean;
    formModel?: MemorandumrrhhFormModel;
    formModel2?:MemorandumrrhhFormModelDetalle;
    onComplete: () => void;
};

export const MemorandumrrhhFormDialog = ({ open, formModel,formModel2, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();
    const authUser = useSession();

   const tipoMemorandumRRHH: SelectOption[] = ENUM_TIPO_MEMORANDUM_RRHH;
    const comisionOptions: SelectOption[] = ENUM_TIPO_COMISION;
    const tipoMemoOptions: SelectOption[] = ENUM_TIPO_MEMORANDUM;
    const diasHabilesOptions: SelectOption[] = ENUM_DIAS_HABILES;
    const transporteOptions: SelectOption[] = ENUM_TIPO_TRANSPORTE;
    const vehiculoOPOptions: SelectOption[] = ENUM_TIPO_TRANSPORTE_OP;

    const [areas, setAreas] = useState<OptionsFormModel[]>([]);
    const areasOptions: SelectOption[] = areas.map((item: OptionsFormModel) => ({ value: item.id || '', label: item.nombre }));
   //genracion de listas cargo, usuarios
     const [cargos, setCargos] = useState<OptionsFormModel[]>([]);
     const [vehiculos, setVehiculos] = useState<OptionsFormModel[]>([]);

     //sacamos CI
     
     const [usuarios, setUsuarios] = useState<{id: string; nombre: string;}[]>([]);
     const [cite, setCite] = useState<{id: string; nombre: string;caption:string}[]>([]);    
     const [usuarioArea, setUsuarioArea] = useState<{id: string; nombre: string; caption?:string}[]>([]);
     const [allCites, setAllCites] = useState<{id: string; nombre: string; caption?:string}[]>([]);
     const [tipoMemo, setTipoMemo] = useState<string>("");

const usuariosOptions = (formValue: FormValue): SelectOption[] => {
    return usuarios
        .map((a: any) => ({
            value: a.id || '',
            label: a.nombre
        }));
};

const citesOptions =   (formValue: FormValue): SelectOption[] => {

    //resolver usuario tecnico de viaticos en lugar de usuario
    const usuarioId = authUser.id_usuario;
    const findUsuario : SelectOption[] = usuarioArea.filter((item) => item.id === usuarioId )
    .map((a:any)=>({
        value: a.id || '',
        label: a.nombre,
        caption : a.caption,
    }))

    let findCite:SelectOption[]= [];
    if(findUsuario.length >0 || findUsuario != null || findUsuario != undefined){
        for( let i =0; i < usuarioArea.length;i++ ){
           if(findUsuario[i] != null || findUsuario[i] != undefined){
            findCite = cite.filter((item)=> item.id === findUsuario[i].caption )
            .map((a:any)=>({
                value : a.id || '',
                label : a.nombre,
            }))
           }
        }
    }
    //Verificando el Cite mayor
    let auxMayor = 0;
    let citeMayor = "";
    let nuevoCodigo = "";

    if(findCite.length > 0 ){

        for(let i=0; i < allCites.length; i++){
			const regex = /([^\n]+?) Nº \d+\/\d{4}/g;
            const matches = allCites[i].nombre.match(regex) || [];

            const filtered = matches.filter(match => {
                const [path] = match.split(' Nº');
                return path.trim() === findCite[0].label;
              });

            if(filtered.length > 0){

                if(Number(allCites[i].caption) > auxMayor){
                  auxMayor = Number(allCites[i].caption);
                  citeMayor = allCites[i].nombre;

                }
            }
         }

         // generando el cite
         const fechaActual = new Date();
         const anioActual = fechaActual.getFullYear();
         const nuevoNumero = (auxMayor + 1).toString().padStart(3, '0'); // Formato con ceros a la izquierda

         nuevoCodigo = `${findCite[0].label} Nº ${nuevoNumero}/${anioActual}`;
    }else{
         nuevoCodigo = "No exite Cite para este Usuario, debe registrarse correctamente";

    }

    const listaCites = [
        { value: nuevoCodigo, label: nuevoCodigo },

      ];

       return listaCites;
};

 // Inicializa el estado del formulario basado en formModel o valores predeterminados
 const [formValues, setFormValues] = useState<MemorandumrrhhFormModel>(() => ({
    ...{
        nombre_usuario      : '',
        ci                  : '',
        cargo_usuario       : '',
        nume_celular        :'',
//datos originales memorandum
        cod_depart_memo     : '',
        tipo_memorandum     : '',
        autorizado_por      : [],
      //  cargo_jefe_unidad   : '',
        fecha_memo_registro : new Date(),
        tipo_comision_idp   : '',
        fecha_inicio_viaje  : new Date(),
        fecha_fin_viaje     : new Date(),
        cantidad_dias       : 0,
        tipo_memo_repo      : '',
        tipo_transporte     : '',
        observacion         : '',
        estado_memorandum   : 'PENDIENTE',
        notificacion_memo   : 'SI', //podemos utilizar este campos para otro control
        apertura_viatico_id : '',
        apertura_pasaje_id  : '',
        usuario_id          : '',
        vehiculo_id         : '',
        cargo_id            : '',
        dias_habiles       : 'HABILES',
        modificacion       : false,
        obs_modificacion   : '',
        fecha_cambio       :'',
        estado_modificacion: 'SIN_OBSERVACION',

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
      //  setUsuarioId(formModel.usuario_id!);
    }
}, [formModel]);


    const formLayout: FormGroup<MemorandumrrhhFormModel>[] = [
        {
            title: 'Tipo de Memorandum',

                grid: [
                    [{ name: 'tipo_memorandum', label:'Tipo de Memorandum a registrar' ,  type: 'autocomplete', options: tipoMemorandumRRHH, onChange: (value, formik) => {
                        formik.setFieldValue('tipo_memorandum', value)
                        setTipoMemo(String(value));
                      }}],
                  ]
        },
        (tipoMemo === MEMORANDUM_SIN_COBRO|| tipoMemo == MEMORANDUM_FUNCIONES)?

        {
            title: 'Datos Usuario Memorandum',

                grid: [
                    [{ name: 'usuario_id', label:'Nombre del Usuario' ,  type: 'autocomplete', options: usuariosOptions, onChange: (value, formik) => {
                        formik.setFieldValue('usuario_id', value)
                     //   setUsuarioId(String(value));
                      }}],
                  ]
        }:{
            title: '',
            grid: [[{ type: 'empty'}] ]},

      (tipoMemo === MEMORANDUM_SIN_COBRO|| tipoMemo == MEMORANDUM_FUNCIONES)?
        {
            title: 'Autorización del Memorandum',
            grid: [
                (formModel?.cod_depart_memo === null || formModel?.cod_depart_memo === undefined)?
                [{ name: 'cod_depart_memo', label: 'Codificacion Numero de CITE', type: 'autocomplete', options: citesOptions, infoText: 'Cite Designado' }]:
                [{ name: 'cod_depart_memo', label: formModel?.cod_depart_memo, type: 'text', disabled: true }],
               // [{ name: 'cod_depart_memo', label: 'Codificacion Numero de CITE', type: 'autocomplete', options: citesOptions, infoText: 'ej. G.A.D. ORU/SDOP/UNASVI/PROMONSA Nº 032/2024' }],
                [{ name: 'autorizado_por', label: 'Autorizado por', type: 'multiselect2', options: usuariosOptions, infoText: 'Seleccione segun jerarquia de inmediato superior a Secretario Ej. Secretario/encargado/jefe' }], //type: 'autocomplete', options: areasOptions  usuario_id
              //  [{ name: 'cargo_jefe_unidad', label: 'Cargo del jefe de Unidad',type: 'autocomplete', options: cargosOptions }] // type: 'autocomplete', options: cargosOptions cargo_id
              ]
        }:{
            title: '',
            grid: [[{ type: 'empty'}] ]},

        (tipoMemo === MEMORANDUM_SIN_COBRO)?
        {
            title: 'Datos del Memorandum',
            grid: [
                [
                    { name: 'fecha_memo_registro', label: 'Fecha Registro', type: 'datetime' , disabled:true},
                    { name: 'tipo_comision_idp', label: 'Tipo de Comision', type: 'select', options:comisionOptions },
                ],
                [
                    { name: 'fecha_inicio_viaje', label: 'Fecha Inicio Viaje', type: 'datetime' },
                    { name: 'fecha_fin_viaje', label: 'Fecha Fin Viaje', type: 'datetime' },
                ],
                [

                    { name: 'dias_habiles', label: 'El rango de fechas (Inicio-Fin) contempla:', type: 'radio-group', options:diasHabilesOptions, inlineDisplay: true }
                ],
                [
              //      { name: 'cantidad_dias', label: 'Cantidad de Dias', type: 'text', infoText: 'ej. 1' }, //type: 'radio-group', options: padreOptions, inlineDisplay: true
                    { name: 'tipo_memo_repo', label: 'Tipo de Memorandum/Reposicion', type: 'radio-group', options:tipoMemoOptions, inlineDisplay: true }
                ],
                [
                    { name: 'tipo_transporte', label: 'Tipo de Transporte', type: 'select', options:transporteOptions}
                ],
                [   { name: 'observacion', label: 'Observacion', type: 'text', infoText: 'ej. Observaciones  del Viaje, puede describir si se trata de una Reposicion' }], // type: 'autocomplete', options: areasOptions

            ]
        }:
        (tipoMemo === MEMORANDUM_FUNCIONES)?
        {
            title: 'Datos del Memorandum',
            grid: [
                [
                    { name: 'fecha_memo_registro', label: 'Fecha Registro', type: 'datetime' , disabled:true},
                ],

                [   { name: 'observacion', label: 'Asunto', type: 'textarea', rows:3, infoText: 'Debe ingresar el asunto Ejemplo. Miembro de la comisión de recepción y verificación ADQUISICION DE TONER Y TINTAS PARA EL SERVICIO DEPARTAMENTAL AGROPECUARIO - SEDAG que se llevara a cabo en la sección de almacenes - bodega I del Gobierno Autónomo Departamental de Oruro conforme orden de compra N.º 001/2025.' }], // type: 'autocomplete', options: areasOptions
                [
                    { name: 'fecha_inicio_viaje', label: 'Fecha y Hora de la Comision, Actividad, etc.', type: 'datetime' },
                   // { name: 'fecha_fin_viaje', label: 'Fecha Fin Viaje', type: 'datetime' },
                ],
            ]
        }
        :{
            title: '',
            grid: [[{ type: 'empty'}] ]},

    ];



    const validationSchema = yup
        .object({

            usuario_id          : yup.string().required(),
            autorizado_por      : yup.array().of(yup.string().required())
                                        .required('Los nombres del secretario, encargados, inmediatos y/o jefes deben seleccionarse')
                                        .test('is-empty', 'El campo no debe estar vacío', (value) => {
                                            return Array.isArray(value) && value.length > 0;
                                        }),//yup.string().required(),
           
             fecha_memo_registro : yup.date().required(),         
             fecha_inicio_viaje  : yup.date().required(),          
             observacion         : yup.string().required(),
           //  dias_habiles        : yup.string().required(),
            cod_depart_memo   : yup.string().required(),

        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await MemorandumrrhhModuleService.createOrUpdateMemorandum(formData as unknown as MemorandumrrhhFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        limpiarFormulario();
        return onComplete();
    };

    const handleCancel = () => {
        limpiarFormulario();
        onComplete();
    };

    const zeroValues: MemorandumrrhhFormModel = {

        nombre_usuario      : '',
        ci                  : '',
        cargo_usuario       : '',
        nume_celular        :'',
//datos originales memorandum
        cod_depart_memo     : '',
        tipo_memorandum     : '',
        autorizado_por      : [],
      //  cargo_jefe_unidad   : '',
        fecha_memo_registro : new Date(),
        tipo_comision_idp   : '',
        fecha_inicio_viaje  : new Date(),
        fecha_fin_viaje     : new Date(),
        cantidad_dias       : 0,
        tipo_memo_repo      : '',
        tipo_transporte     : '',
        observacion         : '',
        estado_memorandum   : 'PENDIENTE',
        notificacion_memo   : 'SI', //podemos utilizar este campos para otro control
      //  apertura_viatico_id : '',
//apertura_pasaje_id  : '',
        usuario_id          : '',
        vehiculo_id         : '',
        cargo_id            : '',
        dias_habiles       : 'HABILES',
        modificacion       : false,
        obs_modificacion   : '',
        fecha_cambio       :'',
        estado_modificacion: 'SIN_OBSERVACION',

    };

     // Función para limpiar el formulario
  const limpiarFormulario = () => {
    setFormValues(zeroValues); // Restablece el estado a su valor inicial
  };


    useEffect(() => {
        const fetchData = async () => {
            if (!isMounted()) return;
         
            const resultUsuario = await UsersModuleService.getAllUsuarios();
            if (!resultUsuario || !resultUsuario.success) return;
            const newUsuario = resultUsuario.rows || [];

           const resultCargo = await CargoModuleService.getAllCargos();
            if (!resultCargo || !resultCargo.success) return;
            const newCargo = resultCargo.rows || [];

           const resultVehiculo = await VehiculoModuleService.getAllVehiculos();
            if (!resultVehiculo || !resultVehiculo.success) return;
            const newVehiculo = resultVehiculo.rows || [];

            //lista de CITE
            const resultCite  = await AreaModuleService.getCite();
            if (!resultCite || !resultCite.success) return;
            const newCite= resultCite.rows || [];
             // lista de usuarios y areas
             const resultUsuarios  = await UsersModuleService.getUsuariosArea();
             if (!resultUsuarios || !resultUsuarios.success) return;
             const newUsuarioArea= resultUsuarios.rows || [];

            // lista de cites
             const resultallCites  = await MemorandumrrhhModuleService.getAllCites();
             if (!resultallCites || !resultallCites.success) return;
             const newAllCites = resultallCites.rows || [];

             if (isMounted())
              //  setAreas(newAreas);
              setUsuarios(newUsuario);
              setCargos(newCargo);
              setVehiculos(newVehiculo);          
              setCite(newCite);
              setUsuarioArea(newUsuarioArea);
              setAllCites(newAllCites);
        };

        if (open) {
            fetchData();
        }
    }, [open, isMounted, formModel,formModel2]);
     const newFormModel = formModel && {
        id                    : formModel.id,
        cod_depart_memo       : formModel.cod_depart_memo,
        autorizado_por        : formModel.autorizado_por,
        tipo_memorandum       : formModel.tipo_memorandum, 
        fecha_memo_registro   : formModel.fecha_memo_registro,
        tipo_comision_idp     : formModel.tipo_comision_idp,
        fecha_inicio_viaje    : formModel.fecha_inicio_viaje,
        fecha_fin_viaje       : formModel.fecha_fin_viaje,
        cantidad_dias         : formModel.cantidad_dias,
        tipo_memo_repo        : formModel.tipo_memo_repo,
        tipo_transporte       : formModel.tipo_transporte,
        observacion           : formModel.observacion,
        estado_memorandum     : formModel.estado_memorandum,
        notificacion_memo     : formModel.notificacion_memo,     
        usuario_id            : formModel.usuario_id,
        vehiculo_id           : formModel.vehiculo_id,
        cargo_id              : formModel.cargo_id,
        dias_habiles          : formModel.dias_habiles,


    };



    const newFormModel2 = formModel2 && {
        id                    : formModel2.id,
        cod_depart_memo       : formModel2.cod_depart_memo,
        fecha_inicio_viaje    : formModel2.fecha_inicio_viaje,
        fecha_fin_viaje       : formModel2.fecha_fin_viaje,
        cantidad_dias         : formModel2.cantidad_dias,

    };

      return (
        <FormDialog
            addTitle="Agregar Memorandum"
            editTitle="Editar Memorandum"
            open={open}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialValues={formValues}
            formLayout={formLayout}
            validationSchema={validationSchema}
           // debug
            isEdit={typeof formModel !== 'undefined' && typeof formModel2 !== 'undefined'}
        />
    );
};
