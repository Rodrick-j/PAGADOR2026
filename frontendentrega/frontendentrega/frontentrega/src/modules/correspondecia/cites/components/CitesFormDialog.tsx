import React, { ReactElement, useEffect, useState } from 'react';
import * as yup from 'yup';

import { SelectOption, FormGroup, FormDialog, FormValue } from 'components/core/FormDialog';

import { useNotify } from 'services/notify';
import { useIsMounted } from 'hooks/useIsMounted';
import { ACTA_DE_RECEPCION, ACTAS_DE_COMPROMISO, ACTAS_DE_ENTREGA, AUTO_DE_APERTURA, CIRCULARES, COMUNICADOS, ENUM_SINO_2, ENUM_TIPO_AREA, GRUPO_GENERAL, GRUPO_MEMORANDUM_PERSONAL, GRUPO_RESOLUCIONES, GRUPO_VACIO, INFORME_DE_CONFORMIDAD, INFORME_DE_DISCONFORMIDAD, INFORME_DE_INFRACCIÓN, INFORME_DE_VIAJE_EN_COMISIÓN, INFORME_LEGAL, INFORME_TÉCNICO, INSTRUCTIVO, MEMORÁNDUM_DE_ASIGNACIÓN, MEMORÁNDUM_DE_DESIGNACIÓN, MEMORÁNDUM_DE_FELICITACIÓN, MEMORÁNDUM_DE_LLAMADA_DE_ATENCIÓN, MEMORÁNDUM_OFICIAL, NOTA_EXTERNA, NOTA_INTERNA, RESOLUCION_ADMINISTRATIVA_DE_ADJUDICACIÓN, RESOLUCION_ADMINISTRATIVA_DE_ANULACIÓN } from 'constants/enums';
import { Options2FormModel, OptionsFormModel } from 'modules/Types';
import { AreaModuleService } from 'modules/rrhh/area';
import { CitesModuleService } from '../CitesModuleService';
import { UsersModuleService } from 'modules/system/users';
import { useSession } from 'hooks/session';
import { SelectOption2 } from 'components/core/FormDialog/Types';
//import { ObjetoGastoModule, ObjetoGastoModuleService } from 'modules/apertura/objeto_gasto';

export type CitesFormModel = {
    id?                      : string;    
    fecha_registro           : Date;
    nombre_usuario           : string;
    area_padre               : string; 
    nombre_area_solicitante  : string;
    nombre_area_destino      : string;
    cite_completo            : string;
    tipo_documento           : string;
    referencia               : string;
    dias                     : number;
    gestion                  : string;    
     actividad?              : string;            
    nombre_proceso           : string;
    cuce                     : string;
    empresa_adjudicada       : string;
    observacion              : string;
    hoja_ruta                : string;
    fecha_cierre             : Date | null;
    numero_paginas?          : number;
    modifica_estado?         : string;     
    estado?                  : string; 
    estado_activo?           : boolean; 
    usuario_id?              : string;
    tipo_cite_id             : string;  
    // para las columnas especiales
    activo?                   : boolean;
    // options?             : unknown;
    // actions: unknown;
    tipo_area?                : string;
    // para VER
    fecha_registro_format?    : string;
    nombre_origen_string?     : string;
    nombre_destino_string?    : string;
    nombre_usuario_registro?  : string;
    nombre_usuario_documento? : string;
    fecha_cierre_format?    : string;



    _createdBy?: string;
    _createdAt?: string;
    _updatedBy?: string;
    _updatedAt?: string;
};

type Props = {
    open: boolean;
    formModel?: CitesFormModel;
    onComplete: () => void;
};

export const CitesFormDialog = ({ open, formModel, onComplete }: Props): ReactElement => {
    const notify = useNotify();
    const isMounted = useIsMounted();
    const authUser = useSession();
   
   
//    const [showTipoArea, setTipoArea] = useState<string>('');
    const [showTipoDocumento, setTipoDocumento] = useState<string>('');
    const [showTipoDocumentoID, setTipoDocumentoID] = useState<string>('');
  //  const [showAreaUser, setAreaUser] = useState<string>('');
    const [areas, setAreas] = useState<{id: string; nombre: string;}[]>([]);
    const [usuarios, setUsuarios] = useState<{id: string; nombre: string;concepto?:string}[]>([]);
    const [usuarioArea, setUsuarioArea] = useState<{id: string; nombre: string; caption?:string}[]>([]);
    const [tipoDocumentos, setTipoDocumentos] = useState<{id: string; nombre: string;concepto:string}[]>([]);
    const [tipoCites, setTipoCites] = useState<{id: string; nombre: string;concepto:string; usuarioId?:string}[]>([]);
    const [allCitesRutas, setallCitesRutas] = useState<{id: string; nombre: string; concepto?:string}[]>([]);
  
    const usuarioId = authUser.id_usuario;  

    // Inicializa el estado del formulario basado en formModel o valores predeterminados
   const [formValues, setFormValues] = useState<CitesFormModel>(() => ({
    ...{
        fecha_registro              : new Date(),       
        nombre_usuario              : '',
        area_padre                  : '',
        nombre_area_solicitante     : '',
        nombre_area_destino         : '',
        cite_completo               : '',
        tipo_documento              : '',        
        dias                        : 0,
        gestion                     : String(new Date().getFullYear()),
        
        referencia                  : '',
        actividad                   : '',           
        nombre_proceso              : '',
        cuce                        : '',
        empresa_adjudicada          : '',
        observacion                 : '',

        hoja_ruta                   :'',
        fecha_cierre                : null,
        numero_paginas              : 0,
        modifica_estado             : "ACTIVO",  //verificar
        estado                      : 'ACTIVO',
        estado_activo               : true,
        usuario_id                  : authUser.id_usuario,
        tipo_cite_id                :showTipoDocumentoID,

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
        setTipoDocumento(formModel.tipo_cite_id);
    }
}, [formModel]);

const tipoDocumentosOptions = (formValue: FormValue): SelectOption[] => {
   
         return tipoDocumentos
        .map((a: any) => ({
            value: a.id || '',
            label: a.nombre,
            concepto: a.concepto,
        }));
};

const areasOptions = (formValue: FormValue): SelectOption[] => {
    return areas
        .map((a: any) => ({
            value: a.id || '',
            label: a.nombre
        }));
};

const areaUsuarioNombre = (): SelectOption[] =>{
 
    const findAreaUsuario = usuarioArea.filter((item) => item.id === usuarioId )		
    .map((a: any) => ({
            value: a.caption || '',  //idArea el id es de usuario
            label: a.nombre,  //nombre area
            //caption : a.caption,
      })); 
    
    return findAreaUsuario;
} 


const stringDocumento = (idDocumento: string):  string => {    	
    const valor = tipoDocumentos.filter((item) => idDocumento===item.id) 	
    .map((a: any) => ({
            value: a.id || '',
            label: a.nombre
    }));
    return valor[0].label;
   
};

const usuariosOptions = (formValue: FormValue): SelectOption[] => {
    return usuarios
        .map((a: any) => ({
            value: a.id || '',
            label: a.nombre
        }));
};

const citesNumeradosOptions =   (formValue: FormValue): SelectOption[] => {
   
    //resolver usuario tecnico de viaticos en lugar de usuario 
    const usuarioId = authUser.id_usuario;  	
    const findUsuario : SelectOption[] = usuarioArea.filter((item) => item.id === usuarioId )	
	
    .map((a:any)=>({
        value: a.id || '',//usuarioid
        label: a.nombre,
        caption : a.caption,//personalid
    }))
 
    let findCite:SelectOption2[]= [];	
    if(findUsuario.length >0 || findUsuario != null || findUsuario != undefined){
        for( let i =0; i < usuarioArea.length;i++ ){
           if(findUsuario[i] != null || findUsuario[i] != undefined){
            
            findCite = tipoCites.filter((item)=> item.usuarioId === findUsuario[i].value )	
            .map((a:any)=>({
                value : a.id || '',
                label : a.nombre,
                concepto: a.concepto,
                usuarioId:a.usuarioId,
            }))
           }
        }
    }
   
    //Verificando el Cite mayor
    let auxMayor = 0; 	
    let citeMayor = "";
    let nuevoCodigo = "";
   
    if(findCite.length > 0 ){
		const documentoNombre = showTipoDocumento;     
        const documentoSigla = tipoDocumentos.find((c) => c.nombre === documentoNombre)?.concepto;		
       const regex = new RegExp(`/${documentoSigla}$`);
       const siglaDoc = findCite.find(item => regex.test(item.label));    

        for(let i=0; i < allCitesRutas.length; i++){		
			
			const regex = /([^\n]+?) Nº \d+\/\d{4}/g;
            const matches = allCitesRutas[i].nombre.match(regex) || [];			
            const filtered = matches.filter(match => {					
                const [path] = match.split(' Nº');													
                return path.trim() === siglaDoc?.label;				
              });
          
            if(filtered.length > 0){ 					
                if(Number(allCitesRutas[i].concepto) > auxMayor){
                  auxMayor = Number(allCitesRutas[i].concepto);                 
                  citeMayor = allCitesRutas[i].nombre;                      
                }          
            }
         }
       
         // generando el cite
         const fechaActual = new Date();        
         const anioActual = fechaActual.getFullYear();            
         const nuevoNumero = (auxMayor + 1).toString().padStart(3, '0'); // Formato con ceros a la izquierda          
         nuevoCodigo = `${siglaDoc?.label} Nº ${nuevoNumero}/${anioActual}`;       
    }else{
         nuevoCodigo = "No exite Cite para este Usuario, debe registrarse correctamente";       
    }	
    
    const listaCites = [
        { value: nuevoCodigo, label: nuevoCodigo },      
        
        ];

       return listaCites;
};

    //const siglaAuto :FormValue = it
     let formLayout: FormGroup<CitesFormModel>[]=[];
  
     if( formModel?.tipo_documento === undefined){

         formLayout = [

                {
                    title: 'TIPO DE DOCUMENTO',
                    grid: [               
                        [
                            { name: 'tipo_cite_id', label: 'Tipo de Documento', type: 'autocomplete', options: tipoDocumentosOptions, onChange: (value, formik) => {
                                formik.setFieldValue('tipo_cite_id', value);
                                setTipoDocumento(stringDocumento(String(value)));		                      
                            }, },                    
                        ],
                    /*[
                            { name: 'tipo_documento', label: showTipoDocumento, type: 'label', hidden:true },                    
                        ],*/
                                        
                    ]            
                },
                (GRUPO_GENERAL.has(showTipoDocumento))?

            {
                    title: 'DATOS DEL DOCUMENTO',
                    grid: [      
                        
                        [
                            { name: 'nombre_area_solicitante', label: "Area Solicitante", type: 'autocomplete', options: areaUsuarioNombre },                    
                        ],
                        
                        [
                            { name: 'cite_completo', label: 'Ruta / Cite completo', type: 'autocomplete', options: citesNumeradosOptions  },                    
                        ],    
                        [
                            { name: 'nombre_area_destino', label: 'Area Destino', type: 'autocomplete',options : areasOptions },                    
                        ],
                        [
                            { name: 'numero_paginas', label: 'Numero de Paginas', type: 'text', },                    
                        ],
                        [
                            { name: 'referencia', label: 'Referencia', type: 'textarea', rows: 2  },                    
                        ],                    
                        [
                            { name: 'hoja_ruta', label: 'Hoja de Ruta', type: 'text', infoText: "Ingresar si cuenta con Hoja de Ruta" },                    
                        ],   
                    ]
            }:     
                (GRUPO_VACIO.has(showTipoDocumento))? 

            {
                    title: 'DATOS DEL DOCUMENTO',
                    grid: [               
                    
                    ]
            }:  
                (GRUPO_MEMORANDUM_PERSONAL.has(showTipoDocumento) )?  
                {
                    title: 'DATOS DEL DOCUMENTO',
                    grid: [               
                        [
                            { name: 'nombre_area_solicitante', label: "Area Solicitante", type: 'autocomplete', options: areaUsuarioNombre },                    
                        ],
                        [
                            { name: 'cite_completo', label: 'Ruta / Cite completo', type: 'autocomplete', options: citesNumeradosOptions  },                    
                        ],
                        [
                            { name: 'nombre_usuario', label: 'Destinatario', type: 'autocomplete', options: usuariosOptions  },                    
                        ],
                        [
                            { name: 'actividad', label: 'Actividad / Motivo', type: 'textarea', rows: 2  },                    
                        ], 
                        [
                            { name: 'observacion', label: 'Observaciones', type: 'textarea', rows: 2  },                    
                        ], 
                        [
                            { name: 'hoja_ruta', label: 'Hoja de Ruta', type: 'text', infoText: "Ingresar si cuenta con Hoja de Ruta" },                    
                        ],
                    ]
            }:  
                (GRUPO_RESOLUCIONES.has(showTipoDocumento) )? 
                {
                    title: 'DATOS DEL DOCUMENTO',
                    grid: [               
                        [
                        { name: 'nombre_area_solicitante', label: "Area Solicitante", type: 'autocomplete', options: areaUsuarioNombre },                                
                        ],
                        [
                            { name: 'cite_completo', label: 'Ruta / Cite completo', type: 'autocomplete', options: citesNumeradosOptions  },                    
                        ],
                        [
                            { name: 'nombre_proceso', label: 'Nombre Proceso', type: 'text',  },                    
                        ],       
                        [
                            { name: 'cuce', label: 'C.U.C.E.', type: 'text',  },                    
                        ],
                        [
                            { name: 'empresa_adjudicada', label: 'Empresa o proponente adjudicado', type: 'text',  },                    
                        ],    
                        [
                            { name: 'observacion', label: 'Observaciones', type: 'textarea', rows: 2  },                    
                        ],     
                        [
                            { name: 'hoja_ruta', label: 'Hoja de Ruta', type: 'text', infoText: "Ingresar si cuenta con Hoja de Ruta" },                    
                        ],       
                    ]
                }:       
                {
                    title: 'DATOS DEL DOCUMENTO',
                    grid: [      
                        
                    /* [
                            { name: 'nombre_area_solicitante', label: 'Area Solicitante', type: 'autocomplete', options : areasOptions },                    
                        ],
                        [
                            { name: 'cite_completo', label: 'Ruta / Cite completo', type: 'autocomplete', options: citesOptions  },                    
                        ],    
                        [
                            { name: 'referencia', label: 'Referencia', type: 'text',  },                    
                        ],
                        [
                            { name: 'nombre_area_destino', label: 'Area Destino', type: 'autocomplete',options : areasOptions },                    
                        ],   
                        [
                            { name: 'actividad', label: 'Actividad', type: 'text',  },                    
                        ], 
                        [
                            { name: 'nombre_usuario', label: 'Destinatario', type: 'select',  },                    
                        ], 
                        [
                            { name: 'observacion', label: 'Observaciones', type: 'textarea',  },                    
                        ],  
                        [
                            { name: 'nombre_proceso', label: 'Nombre Proceso', type: 'text',  },                    
                        ],       
                        [
                            { name: 'cuce', label: 'C.U.C.E.', type: 'text',  },                    
                        ],
                        [
                            { name: 'empresa_adjudicada', label: 'Empresa o proponente adjudicado', type: 'text',  },                    
                        ],          */  
                    ]
                    
                }
        ];

    }else{
          
         formLayout = [        
               {
                title: 'TIPO DE DOCUMENTO',
                    grid: [               
                        [
                            { name: 'tipo_cite_id', label: 'Tipo de Documento', type: 'autocomplete', options: tipoDocumentosOptions, onChange: (value, formik) => {
                                formik.setFieldValue('tipo_cite_id', value);
                                setTipoDocumento(stringDocumento(String(value)));		                      
                            }, },                    
                        ],
                    /*[
                            { name: 'tipo_documento', label: showTipoDocumento, type: 'label', hidden:true },                    
                        ],*/
                                        
                    ]            
               },
               (GRUPO_GENERAL.has(formModel.tipo_documento))?

               {
                    title: 'DATOS DEL DOCUMENTO',
                    grid: [      
                        
                        [
                            { name: 'nombre_area_solicitante', label: "Area Solicitante", type: 'autocomplete', options: areaUsuarioNombre },                    
                        ],
                        
                        [
                            { name: 'cite_completo', label: formModel.cite_completo, type: 'label', infoText:"Ruta / Cite completo"  },                    
                        ],    
                        [
                            { name: 'referencia', label: 'Referencia', type: 'textarea', rows: 2  },                    
                        ],
                        [
                            { name: 'nombre_area_destino', label: 'Area Destino', type: 'autocomplete',options : areasOptions },                    
                        ],   
                        [
                            { name: 'hoja_ruta', label: 'Hoja de Ruta', type: 'text', infoText: "Ingresar si cuenta con Hoja de Ruta" },                    
                        ],
                    ]
               }:     
               (GRUPO_VACIO.has(formModel.tipo_documento))? 

               {
                    title: 'DATOS DEL DOCUMENTO',
                    grid: [               
                    
                    ]
               }:  
                (GRUPO_MEMORANDUM_PERSONAL.has(formModel.tipo_documento ))?  
               {
                    title: 'DATOS DEL DOCUMENTO',
                    grid: [               
                        [
                            { name: 'nombre_area_solicitante', label: "Area Solicitante", type: 'autocomplete', options: areaUsuarioNombre },                    
                        ],
                        [
                            { name: 'cite_completo', label: formModel.cite_completo, type: 'label', infoText:"Ruta / Cite completo"  },                    
                        ],
                        [
                            { name: 'nombre_usuario', label: 'Destinatario', type: 'autocomplete', options: usuariosOptions  },                    
                        ],
                        [
                            { name: 'actividad', label: 'Actividad / Motivo', type: 'textarea', rows: 2  },                    
                        ], 
                        [
                            { name: 'observacion', label: 'Observaciones', type: 'textarea', rows: 2  },                    
                        ],
                        [
                            { name: 'hoja_ruta', label: 'Hoja de Ruta', type: 'text', infoText: "Ingresar si cuenta con Hoja de Ruta" },                    
                        ], 
                    ]
                }:  
                (GRUPO_RESOLUCIONES.has(formModel.tipo_documento ))? 
                {
                    title: 'DATOS DEL DOCUMENTO',
                    grid: [               
                        [
                        { name: 'nombre_area_solicitante', label: "Area Solicitante", type: 'autocomplete', options: areaUsuarioNombre },                                
                        ],
                        [
                            { name: 'cite_completo', label: 'Ruta / Cite completo', type: 'autocomplete', options: citesNumeradosOptions  },                    
                        ],
                        [
                            { name: 'nombre_proceso', label: 'Nombre Proceso', type: 'text',  },                    
                        ],       
                        [
                            { name: 'cuce', label: 'C.U.C.E.', type: 'text',  },                    
                        ],
                        [
                            { name: 'empresa_adjudicada', label: 'Empresa o proponente adjudicado', type: 'text',  },                    
                        ],    
                        [
                            { name: 'observacion', label: 'Observaciones', type: 'textarea', rows: 2  },                    
                        ],      
                        [
                            { name: 'hoja_ruta', label: 'Hoja de Ruta', type: 'text', infoText: "Ingresar si cuenta con Hoja de Ruta" },                    
                        ],      
                    ]
                }:       
                {
                    title: 'DATOS DEL DOCUMENTO',
                    grid: [      
                        
                    /* [
                            { name: 'nombre_area_solicitante', label: 'Area Solicitante', type: 'autocomplete', options : areasOptions },                    
                        ],
                        [
                            { name: 'cite_completo', label: 'Ruta / Cite completo', type: 'autocomplete', options: citesOptions  },                    
                        ],    
                        [
                            { name: 'referencia', label: 'Referencia', type: 'text',  },                    
                        ],
                        [
                            { name: 'nombre_area_destino', label: 'Area Destino', type: 'autocomplete',options : areasOptions },                    
                        ],   
                        [
                            { name: 'actividad', label: 'Actividad', type: 'text',  },                    
                        ], 
                        [
                            { name: 'nombre_usuario', label: 'Destinatario', type: 'select',  },                    
                        ], 
                        [
                            { name: 'observacion', label: 'Observaciones', type: 'textarea',  },                    
                        ],  
                        [
                            { name: 'nombre_proceso', label: 'Nombre Proceso', type: 'text',  },                    
                        ],       
                        [
                            { name: 'cuce', label: 'C.U.C.E.', type: 'text',  },                    
                        ],
                        [
                            { name: 'empresa_adjudicada', label: 'Empresa o proponente adjudicado', type: 'text',  },                    
                        ],          */  
                    ]                    
               }
         ]

    }

   

    const validationSchema = yup
        .object({
         //   tipo_documento : yup.string().required(),
            cite_completo : yup.string().required(),

        })
        .defined();

    const handleSubmit = async (formData: FormValue) => {
        const result = await CitesModuleService.createOrUpdateCites(formData as unknown as CitesFormModel);
        if (!result.success) return notify.error(result.msg);
        notify.success(result.msg);
        limpiarFormulario();
        return onComplete();
    };

    const handleCancel = () => {
        limpiarFormulario();
        onComplete();
    };
   
    const zeroValues: CitesFormModel = {
        fecha_registro              : new Date(),       
        nombre_usuario              : '',
        area_padre                  : '',
        nombre_area_solicitante     : '',
        nombre_area_destino         : '',
        cite_completo               : '',
        tipo_documento              : '',
        dias                        : 0,
        gestion                     : new Date().getFullYear().toString(),
        referencia                  : '',
        actividad                   : '',           
        nombre_proceso              : '',
        cuce                        : '',
        empresa_adjudicada          : '',
        observacion                 : '',

        hoja_ruta                   :'',
        fecha_cierre                : null,
        numero_paginas              : 0,

        modifica_estado             : "ACTIVO",  //verificar
        estado                      : 'ACTIVO',
        estado_activo               : true,
        usuario_id                  : authUser.id_usuario,
        tipo_cite_id                : '',

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

           const resultTipoDocumentos= await CitesModuleService.getAllDocumentos();
            if (!resultTipoDocumentos || !resultTipoDocumentos.success) return;
            const newTipoDocumentos = resultTipoDocumentos.rows || [];

             const resultTipoCites = await CitesModuleService.getTipoCites();
            if (!resultTipoCites || !resultTipoCites.success) return;
            const newTipoCites = resultTipoCites.rows || [];

             const resultUsuarios = await UsersModuleService.getAllUsuarios();
            if (!resultUsuarios || !resultUsuarios.success) return;
            const newUsuarios = resultUsuarios.rows || [];

             // lista de usuarios y areas
            const resultUsuariosArea  = await UsersModuleService.getUsuariosArea();			
            if (!resultUsuariosArea || !resultUsuariosArea.success) return;
            const newUsuarioArea= resultUsuariosArea.rows || []; 	
            
            const resultAllCitesrutas  = await CitesModuleService.getAllCitesRutas();			
            if (!resultAllCitesrutas || !resultAllCitesrutas.success) return;
            const newAllCitesRutas= resultAllCitesrutas.rows || []; 		


            if (isMounted())
            setAreas(newAreas);
            //setObjetos(newObjetos);
            //setAreaHijos(newAreaHijos);
            setTipoDocumentos(newTipoDocumentos);
            setTipoCites(newTipoCites);
            setUsuarios(newUsuarios);
            setUsuarioArea(newUsuarioArea);
            setallCitesRutas(newAllCitesRutas);
        };
        if (open) {
            fetchData();
        }
    }, [open, isMounted, formModel]);

    const newFormModel = formModel && {
        fecha_registro              : formModel.fecha_registro,       
        nombre_usuario              : formModel.nombre_usuario,
        area_padre                  : formModel.area_padre,
        nombre_area_solicitante     : formModel.nombre_area_solicitante,
        nombre_area_destino         : formModel.nombre_area_destino,
        cite_completo               : formModel.cite_completo,
        tipo_documento              : formModel.tipo_documento,
        dias                        : formModel.dias,
        gestion                     : formModel.gestion,
        modifica_estado             : formModel.modifica_estado,  //verificar
        estado                      : formModel.estado,
        estado_activo               : formModel.estado_activo,

    };

    return (
        <FormDialog
            addTitle="Agregar Cite"
            editTitle="Editar Cite"
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
