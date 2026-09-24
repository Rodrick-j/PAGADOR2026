import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';
import { SelectOption, FormGroup, FormDialog, FormValue } from 'components/core/FormDialog';
import { MemorandumModuleService } from '../MemorandumModuleService';
import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';

import { APERTURA_GABINETE, CON_PRESUPUESTO, ENUM_DIAS_HABILES, ENUM_SINO_2, ENUM_TIPO_COMISION, ENUM_TIPO_MEMORANDUM, ENUM_TIPO_TRANSPORTE, ENUM_TIPO_TRANSPORTE_OP, GABINETE_DESPACHO, GABINETE_DESPACHO_SECRETARIOS, ID_SIN_APERTURA, PASAJES, SIN_PRESUPUESTO, TECNICO_GENERAL_VIATICOS, VIATICOS } from 'constants/enums';
import { Options2FormModel, OptionsFormModel } from 'modules/Types';
import { UsersModuleService } from 'modules/system/users';
import { CargoModuleService } from 'modules/rrhh/cargo';
import { VehiculoModuleService } from 'modules/bsss/vehiculo';
import { useSession } from 'hooks/session';
import { AperturaViaticoModuleService } from 'modules/viatico/apertura_viatico';
import { AreaModuleService } from 'modules/rrhh/area';
import { VIATICO } from 'constants/routes';
import { ConfirmDialog } from 'components/core/ConfirmDialog';

export type MemorandumFormModel = {

    //Tabla original de meorandum
    id?                         : string;
    cod_depart_memo        : string;
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
    apertura_viatico_id   : string | null;
    apertura_pasaje_id   : string | null;
    usuario_id            : string | null;
    vehiculo_id           : string | null;
    cargo_id              : string | null;

    modificacion          :boolean;
    obs_modificacion      :string;
    fecha_cambio          :string;
    estado_modificacion   :string;
    justificacion   :string;
//campos que se aumentan
    nombre_usuario : string;
    ci: string;
    cargo_usuario : string
    nume_celular:string;
    dias_habiles : string;

    presupuesto_viatico?           : number;
    estado_presupuesto_viatico?    : string;
    presupuesto_pasaje?           : number;
    estado_presupuesto_pasaje?    : string;

    aprobacion_rrhh_conta?  : string[];
    tiempo_aprobacion_usuario? : string[];

//Fechas de actualizacion
    _createdBy?: string;
    _createdAt?: string;
    _updatedBy?: string;
    _updatedAt?: string;
};

export type MemorandumFormModelDetalle = {
    id?                    : string;
    cod_depart_memo        : string;
    fecha_inicio_viaje     : Date;
    fecha_fin_viaje        : Date;
    cantidad_dias          : number;
};

export type MemorandumFormModelDetalle2 = {
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
    formModel?: MemorandumFormModel;
    formModel2?:MemorandumFormModelDetalle;
    onComplete: () => void;
};

export const MemorandumFormDialog = ({ open, formModel,formModel2, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();
    const authUser = useSession();

    const padreOptions: SelectOption[] = ENUM_SINO_2;
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
     const [aperturaViaticos, setAperturaViaticos] = useState<{id: string; nombre: string;id_usuario?:string; presupuesto?: number }[]>([]);//useState<Options2FormModel[]>([]);
     const [usuarios, setUsuarios] = useState<{id: string; nombre: string;}[]>([]);
     const [aperturaUsuarios, setAperturaUsuarios] = useState<{id: string; nombre: string;id_usuario:string; presupuesto: number }[]>([]);
     const [aperturaPasajes, setAperturaPasajes] = useState<{id: string; nombre: string;id_usuario:string}[]>([]);
     const [cite, setCite] = useState<{id: string; nombre: string;caption:string}[]>([]);
    // const [usuarioId, setUsuarioId] = useState<string>('');
     const [usuarioArea, setUsuarioArea] = useState<{id: string; nombre: string; caption?:string}[]>([]);
     const [allCites, setAllCites] = useState<{id: string; nombre: string; caption?:string}[]>([]);
      const [citeUnique, setCiteUnique] = useState<string[]>([]);

const usuariosOptions = (formValue: FormValue): SelectOption[] => {
    return usuarios
        .map((a: any) => ({
            value: a.id || '',
            label: a.nombre
        }));
};

const aperturaUsuariosOptions =  (formValue: FormValue): SelectOption[] => {
    const usuarioId = authUser.id_usuario;
    
     const listaAperturaViaticos = aperturaUsuarios.filter((item) => usuarioId===item.id_usuario)
        .map((a: any) => ({
            value: a.id || '',
           // label: a.nombre,
            label: a.nombre.includes(CON_PRESUPUESTO) 
            ? `🟢 ${a.nombre}`
            : `🔴 ${a.nombre}`,
            presupuesto: a.presupuesto,
          //  id_usuario : a.id_usuario,
        }));
// SI El AREA ES GABINETE con apertura de direccion superior
        if (authUser.area.includes(GABINETE_DESPACHO) && !authUser.area.includes(GABINETE_DESPACHO_SECRETARIOS) ){
       
			const  listaGeneralViaticosGabinete = aperturaViaticos.filter((item)=> item.nombre.includes(VIATICOS) && item.nombre.includes(APERTURA_GABINETE) ) .map((a: any) => ({
                value: a.id || '',
               // label: a.nombre,
                label: a.nombre.includes(CON_PRESUPUESTO) 
                ? `🟢 ${a.nombre}`
                : `🔴 ${a.nombre}`,
                presupuesto: a.presupuesto,
            //  id_usuario : a.id_usuario,
            }));
      
            return listaGeneralViaticosGabinete;
             
        }

    //SI el ROL TECNICO GENERAL DE VIATICOS   quitar  && item.nombre.includes('Area Dependencia:: -') si necesitas de las demas dependencias
    if(authUser.roles === TECNICO_GENERAL_VIATICOS){
      const  listaGeneralviaticos = aperturaViaticos.filter((item)=> item.nombre.includes(VIATICOS) && item.nombre.includes('Area Dependencia:: -')) .map((a: any) => ({
            value: a.id || '',
           // label: a.nombre,
            label: a.nombre.includes(CON_PRESUPUESTO) 
            ? `🟢 ${a.nombre}`
            : `🔴 ${a.nombre}`,
            presupuesto: a.presupuesto,
          //  id_usuario : a.id_usuario,
        }));
    
	  return listaGeneralviaticos;
    }else{
         const valorDefault = {
                value: ID_SIN_APERTURA,
                label: "No existe Apertura de Viaticos para este usuario",
                presupuesto: 0
            };

            if (!listaAperturaViaticos?.length || listaAperturaViaticos[0].presupuesto <= 0 ) {
                return [...listaAperturaViaticos, valorDefault];
            }
              return listaAperturaViaticos;
        
    }   
          

};
const aperturaUsuariosPasajesOptions =  (formValue: FormValue): SelectOption[] => {
    const usuarioId = authUser.id_usuario;  //formValue.usuario_id; 
    const listaAperturaPasajes = aperturaPasajes.filter((item) => usuarioId===item.id_usuario)	
        .map((a: any) => ({
            value: a.id || '',
            //label: a.nombre,
             label: a.nombre.includes(CON_PRESUPUESTO) 
            ? `🟢 ${a.nombre}`
            : `🔴 ${a.nombre}`,
            presupuesto: a.presupuesto,
          //  id_usuario : a.id_usuario,
        }));
       
        // SI El AREA ES GABINETE con apertura de direccion superior
       
        if (authUser.area.includes(GABINETE_DESPACHO)  && !authUser.area.includes(GABINETE_DESPACHO_SECRETARIOS)){
       
			const  listaGeneralpasajesGabinete = aperturaViaticos.filter((item)=> item.nombre.includes(PASAJES) && item.nombre.includes(APERTURA_GABINETE) ) .map((a: any) => ({
            value: a.id || '',
            //label: a.nombre,
             label: a.nombre.includes(CON_PRESUPUESTO) 
            ? `🟢 ${a.nombre}`
            : `🔴 ${a.nombre}`,
            presupuesto: a.presupuesto,
          //  id_usuario : a.id_usuario,
        }));
      
        return listaGeneralpasajesGabinete;
             
        }

        //fin Area gabinete
         //SI el ROL TECNICO GENERAL DE VIATICOS    
    if(authUser.roles === TECNICO_GENERAL_VIATICOS){
      const  listaGeneralpasajes = aperturaViaticos.filter((item)=> item.nombre.includes(PASAJES)&& item.nombre.includes('Area Dependencia:: -')) .map((a: any) => ({
            value: a.id || '',
            //label: a.nombre,
             label: a.nombre.includes(CON_PRESUPUESTO) 
            ? `🟢 ${a.nombre}`
            : `🔴 ${a.nombre}`,
            presupuesto: a.presupuesto,
          //  id_usuario : a.id_usuario,
        }));
    
	  return listaGeneralpasajes;
    }else{
         const valorDefault = {
                value: ID_SIN_APERTURA,
                label: "No existe Apertura de Pasajes para este usuario",
                presupuesto: 0
            };

            if (!listaAperturaPasajes?.length || listaAperturaPasajes[0].presupuesto <= 0 ) {			
                return [...listaAperturaPasajes, valorDefault];
            }
              return listaAperturaPasajes;
        
    }
    

       
};
const citesOptions =   (formValue: FormValue): SelectOption[] => {
    
      const listaCites = [     
        { value: citeUnique[0], label: citeUnique[0] },
      ]; 
       return listaCites;
}
/*const citesOptions =   (formValue: FormValue): SelectOption[] => {

    //resolver usuario tecnico de viaticos en lugar de usuario
    const usuarioId = authUser.id_usuario;
    const findUsuario : SelectOption[] = usuarioArea.filter((item) => item.id === usuarioId )	
    .map((a:any)=>({
        value: a.id || '',
        label: a.nombre,
        caption : a.caption,
    }    
))


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
};*/

 // Inicializa el estado del formulario basado en formModel o valores predeterminados
 const [formValues, setFormValues] = useState<MemorandumFormModel>(() => ({
    ...{
        nombre_usuario      : '',
        ci                  : '',
        cargo_usuario       : '',
        nume_celular        :'',
//datos originales memorandum
        cod_depart_memo     : '',
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
        justificacion      :'', 
        aprobacion_rrhh_conta  :  [],
        tiempo_aprobacion_usuario :  [],

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


    const formLayout: FormGroup<MemorandumFormModel>[] = [

        {
            title: 'Datos Usuario Memorandum',

                grid: [
                    [{ name: 'usuario_id', label:'Nombre del Usuario' ,  type: 'autocomplete', options: usuariosOptions, onChange: (value, formik) => {
                        formik.setFieldValue('usuario_id', value)
                     //   setUsuarioId(String(value));
                      }}],

                    [{ name: 'apertura_viatico_id', label:'Apertura Programatica Objeto Viatico' ,  type: 'autocomplete', options: aperturaUsuariosOptions },],
                    [{ name: 'apertura_pasaje_id', label:'Apertura Programatica Objeto Pasajes' ,  type: 'autocomplete', options: aperturaUsuariosPasajesOptions},],
                  ]
        },
        {
            title: 'Autorización del Memorandum',
            grid: [
                 (formModel?.cod_depart_memo === null || formModel?.cod_depart_memo === undefined)?
                [{ name: 'cod_depart_memo', label: 'Codificacion Numero de CITE', type: 'autocomplete', options: citesOptions, infoText: 'Cite Designado' }]:
                [{ name: 'cod_depart_memo', label: formModel?.cod_depart_memo, type: 'text', disabled: true }],
                
                [{ name: 'autorizado_por', label: 'Autorizado por', type: 'multiselect2', options: usuariosOptions, infoText: 'Seleccione segun jerarquia de inmediato superior a Secretario Ej. Secretario/encargado/jefe' }], 
              //  [{ name: 'cargo_jefe_unidad', label: 'Cargo del jefe de Unidad',type: 'autocomplete', options: cargosOptions }] // type: 'autocomplete', options: cargosOptions cargo_id
              ]
        },

        {
            title: 'Datos del Memorandum',
            grid: [
                [
                    { name: 'fecha_memo_registro', label: 'Fecha Registro', type: 'datetime' , disabled:true},
                    { name: 'tipo_comision_idp', label: 'Tipo de Comision', type: 'select', options:comisionOptions },
                ],
                [
              //      { name: 'cantidad_dias', label: 'Cantidad de Dias', type: 'text', infoText: 'ej. 1' }, //type: 'radio-group', options: padreOptions, inlineDisplay: true
                    { name: 'tipo_memo_repo', label: 'Tipo de Memorandum/Reposicion', type: 'radio-group', options:tipoMemoOptions, inlineDisplay: true }
                ],
                [
                    { name: 'fecha_inicio_viaje', label: 'Fecha Inicio Viaje', type: 'datetime' },
                    { name: 'fecha_fin_viaje', label: 'Fecha Fin Viaje', type: 'datetime' },
                ],
                [

                    { name: 'dias_habiles', label: 'El rango de fechas (Inicio-Fin) contempla:', type: 'radio-group', options:diasHabilesOptions, inlineDisplay: true }
                ],
               
                [
                    { name: 'tipo_transporte', label: 'Tipo de Transporte', type: 'select', options:transporteOptions}
                ],
                [   { name: 'observacion', label: 'Observacion', type: 'text', infoText: 'ej. Observaciones  del Viaje, puede describir si se trata de una Reposicion' }], // type: 'autocomplete', options: areasOptions

            ]
        },

    ];



    const isNumberUnique = async (nro: string) => {
        const n = String(formModel && formModel.cod_depart_memo);
        if(n.toLowerCase()!==nro.toLowerCase()){
            const result = await MemorandumModuleService.getCodMemoData(nro);
            const exists = Boolean(result.data.nro);
            return !exists;
        }
        return true;
    };
    // fecha si es memorandum o reposicion
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
	    
    const validationSchema = yup
        .object({

            apertura_viatico_id : yup.string().required(),
            apertura_pasaje_id  : yup.string().required().test('not-equal','Debe ingresar al menos una apertura valida y existente',function(value) {
                  const { apertura_viatico_id } = this.parent;
                  return value !== apertura_viatico_id; }),

            usuario_id          : yup.string().required(),
            autorizado_por      : yup.array().of(yup.string().required())
                                        .required('Los nombres del secretario, encargados, inmediatos y/o jefes deben seleccionarse')
                                        .test('is-empty', 'El campo no debe estar vacío', (value) => {
                                            return Array.isArray(value) && value.length > 0;
                                        }),//yup.string().required(),
            // cargo_jefe_unidad   : yup.string().required(),
             fecha_memo_registro : yup.date().required(),
             tipo_comision_idp   : yup.string().required(),
             tipo_memo_repo      : yup.string().required('Debe seleccionar el tipo'),
             fecha_inicio_viaje  : yup.date().required('La fecha inicio es obligatoria').min(hoy,'Para memorándum o reposicion no se permiten fechas pasadas'),
             fecha_fin_viaje     : yup.date().required('La fecha fin es obligatoria').min(hoy,'Para memorándum o reposicion no se permiten fechas pasadas'),
            // cantidad_dias       : yup.number().required(),           
             tipo_transporte     : yup.string().required(),
           //  observacion         : yup.string().required(),
             dias_habiles        : yup.string().required(),
             cod_depart_memo   : yup.string().required(),

        })
        .defined();

    //Verificacion de presupuesto 
    const [abrirConfirmar, setAbrirConfirmar] = useState(false);
    const [pendienteValores, setPendienteValores] = useState<any>(null);
    const [listaAperturaForm, setListaAperturaForm] = useState<any>();


    /*const handleSubmit = async (formData: FormValue) => {
        const result = await MemorandumModuleService.createOrUpdateMemorandum(formData as unknown as MemorandumFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        limpiarFormulario();
        return onComplete();
    };*/

    const handleSubmit = async (formData: FormValue) => {
	
    const ids = [ formData.apertura_viatico_id, formData.apertura_pasaje_id ];
	const listaAperturaViaticos = aperturaViaticos
        .filter(item => ids.includes(item.id))
        .map((a: any) => ({
            value: a.id || '',
            label: a.nombre.includes(CON_PRESUPUESTO)
                ? `🟢 ${a.nombre}`
                : `🔴 ${a.nombre}`,
            presupuesto: a.presupuesto,
        })); 
     setListaAperturaForm(listaAperturaViaticos) ;    
    const existeSinPresupuesto = listaAperturaViaticos.some(item => item.label.includes(SIN_PRESUPUESTO));     
	if (existeSinPresupuesto) {
            setPendienteValores(formData);
            setAbrirConfirmar(true);
            return; //  NO envía aún
    }
         guardar(formData);        
    };

    const guardar = async (formData: FormValue) => {
        const result = await MemorandumModuleService.createOrUpdateMemorandum(formData as unknown as MemorandumFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        limpiarFormulario();
        return onComplete();
    };
    
   


    const handleCancel = () => {
        limpiarFormulario();
        onComplete();
    };

    const zeroValues: MemorandumFormModel = {

        nombre_usuario      : '',
        ci                  : '',
        cargo_usuario       : '',
        nume_celular        :'',
//datos originales memorandum
        cod_depart_memo     : '',
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
        justificacion      :'', 
        aprobacion_rrhh_conta  :  [],
        tiempo_aprobacion_usuario :  [],

    };

     // Función para limpiar el formulario
  const limpiarFormulario = () => {
    setFormValues(zeroValues); // Restablece el estado a su valor inicial
  };


    useEffect(() => {
        const fetchData = async () => {
            if (!isMounted()) return;
          /*  const resultAreas = await AreaModuleService.getAllArea();
            if (!resultAreas || !resultAreas.success) return;
            const newAreas = resultAreas.rows || [];*/

            const resultUsuario = await UsersModuleService.getAllUsuarios();
            if (!resultUsuario || !resultUsuario.success) return;
            const newUsuario = resultUsuario.rows || [];

           const resultCargo = await CargoModuleService.getAllCargos();
            if (!resultCargo || !resultCargo.success) return;
            const newCargo = resultCargo.rows || [];

           const resultVehiculo = await VehiculoModuleService.getAllVehiculos();
            if (!resultVehiculo || !resultVehiculo.success) return;
            const newVehiculo = resultVehiculo.rows || [];

           const resultAperturaViatico = await AperturaViaticoModuleService.getAllAperturaViatico();
            if (!resultAperturaViatico || !resultAperturaViatico.success) return;
            const newAperturaViatico = resultAperturaViatico.rows || [];
            //apertura viaticos
            const resultAperturaUsuario = await AperturaViaticoModuleService.getAperturaByUser();
            if (!resultAperturaUsuario || !resultAperturaUsuario.success) return;
            const newAperturausuario = resultAperturaUsuario.rows || [];
            //apertura pasajes
            const resultAperturaPasaje = await AperturaViaticoModuleService.getAperturaByUserPasaje();
            if (!resultAperturaPasaje || !resultAperturaPasaje.success) return;
            const newAperturaPasajes= resultAperturaPasaje.rows || [];
            //lista de CITE
            const resultCite  = await AreaModuleService.getCite();
            if (!resultCite || !resultCite.success) return;
            const newCite= resultCite.rows || [];
             // lista de usuarios y areas
             const resultUsuarios  = await UsersModuleService.getUsuariosArea();
             if (!resultUsuarios || !resultUsuarios.success) return;
             const newUsuarioArea= resultUsuarios.rows || [];

            // lista de cites
             const resultallCites  = await MemorandumModuleService.getAllCites();
             if (!resultallCites || !resultallCites.success) return;
             const newAllCites = resultallCites.rows || [];

             const resultCiteServer  = await MemorandumModuleService.getCiteServer(authUser.id_usuario);                        
             if (!resultCiteServer || !resultCiteServer.success) return;              
             const newCiteServer = resultCiteServer.data?.rows || [];                                       

             if (isMounted())
              //  setAreas(newAreas);
              setUsuarios(newUsuario);
              setCargos(newCargo);
              setVehiculos(newVehiculo);
              setAperturaViaticos(newAperturaViatico);
              setAperturaUsuarios(newAperturausuario);
              setAperturaPasajes(newAperturaPasajes);
              setCite(newCite);
              setUsuarioArea(newUsuarioArea);
              setAllCites(newAllCites);
             setCiteUnique(newCiteServer);
        };

        if (open) {
            fetchData();
        }
    }, [open, isMounted, formModel,formModel2]);
     const newFormModel = formModel && {
        id                    : formModel.id,
        cod_depart_memo       : formModel.cod_depart_memo,
        autorizado_por        : formModel.autorizado_por,
      //  cargo_jefe_unidad     : formModel.cargo_jefe_unidad,
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
        apertura_viatico_id   : formModel.apertura_viatico_id,
        apertura_pasaje_id   : formModel.apertura_pasaje_id,
        usuario_id            : formModel.usuario_id,
        vehiculo_id           : formModel.vehiculo_id,
        cargo_id              : formModel.cargo_id,
        dias_habiles          : formModel.dias_habiles,
        aprobacion_rrhh_conta  :  formModel.aprobacion_rrhh_conta,
        tiempo_aprobacion_usuario : formModel.tiempo_aprobacion_usuario,

    };



    const newFormModel2 = formModel2 && {
        id                    : formModel2.id,
        cod_depart_memo       : formModel2.cod_depart_memo,
        fecha_inicio_viaje    : formModel2.fecha_inicio_viaje,
        fecha_fin_viaje       : formModel2.fecha_fin_viaje,
        cantidad_dias         : formModel2.cantidad_dias,

    };

      return (
         <>
                <FormDialog
                    addTitle="Agregar Memorandum"
                    editTitle="Editar Memorandum"
                    open={open}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    initialValues={formValues}
                    formLayout={formLayout}
                    validationSchema={validationSchema}
                    //debug
                    isEdit={typeof formModel !== 'undefined' && typeof formModel2 !== 'undefined'}
                />

                <ConfirmDialog
                title="Confirmar"
                message={
                     <span>
                               <br />
                                    {listaAperturaForm?.map((item: any, index: number) => {                            
                                        const esSinPresupuesto = item.label.includes(SIN_PRESUPUESTO);
                                        return (
                                        <div key={index}  style={{ color: esSinPresupuesto ? 'red' : 'green' }} >                                                                                           
                                        {item.label}
                                        <br />
                                        <b>Presupuesto Restante: {item.presupuesto}</b>                                                
                                        </div>
                                        );
                                    })}
                              <br />
                                   <b> Debe recargar presupuesto en su apertura, NO se podra realizar el cobro del memorandum. </b>
                                   <br></br>
                                   <br></br>
                                   <b> Confirma Generar el memorandum SIN PRESUPUESTO ¿Desea continuar? </b>
                     </span>
                }
                open={abrirConfirmar}
                onAccept={async () => {
                    setAbrirConfirmar(false);
                    await guardar(pendienteValores); // ahora sí guarda
                }}
                onCancel={() => {
                    setAbrirConfirmar(false);
                    setPendienteValores(null);
                }}
            />
         </>
        

    );
};
