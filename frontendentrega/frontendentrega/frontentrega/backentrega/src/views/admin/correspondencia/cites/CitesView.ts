import { Result } from "../../../../base/types/Result";
import { findAndCountResult } from "../../../../tools/util";
import  CitesService  from "../../../../core/admin/correspondencia/cites";
import  AreaService  from "../../../../core/rrhh/area";
import moment from "moment";
import TipoCitesService  from "../../../../core/admin/correspondencia/tipo_cites";
import  PersonalService  from "../../../../core/rrhh/personal";
import  UsuarioService from "../../../../core/system/autenticacion/usuario";
import { AuthUser } from "../../../../base/types/AuthUser";
import { queryStringToArray, } from "../../../../tools/util";
import { ENUM_TECNICO_CITES } from "../../../../base/constants/enum";

type CitesTableModel = {  
    id?: string;    
    fecha_registro           : string;
    fecha_registro_format?   : Date;
    nombre_usuario           : string; //VERIFICAR   
    nombre_area_solicitante  : string;
    nombre_area_destino      : string;
    cite_completo            : string;
    referencia               : string;
    tipo_documento           : string;
    dias                     : number;
    gestion                  : string;    
    actividad                : string;            
    nombre_proceso           : string;
    cuce                     : string;
    empresa_adjudicada       : string;
    observacion              : string;    
    estado                   : string; 
    estado_activo            : boolean;  
    numero_paginas?          : number;	
    usuario_creador?         : string;
	modifica_estado?         : string;   
    usuario_id?              : string;
    tipo_cite_id?            : string;
};

export type GetCitessTableResponse = {
    rows: CitesTableModel[];
    count: number;
};

export type CitesFormDataResponse = {
     id?: string;    
    fecha_registro            : Date;
    nombre_usuario?           : string; //Verificar    
    nombre_area_solicitante   : string;
    nombre_area_destino       : string;
    cite_completo             : string;
    referencia                : string;
    tipo_documento            : string;
    dias                      : number;
    gestion                   : string;    
    actividad                 : string;            
    nombre_proceso            : string;
    cuce                      : string;
    empresa_adjudicada        : string;
    observacion               : string;    
    hoja_ruta                 : string;
    fecha_cierre              : Date;
    estado                    : string; 
    estado_activo             : boolean;   
    numero_paginas?           : number;	
	modifica_estado?          : string;   
    usuario_id?               : string;
    tipo_cite_id?             : string;

    //Para ver 
    fecha_registro_format?    : string;
    fecha_cierre_format?    : string;
    nombre_origen_string?     : string;
    nombre_destino_string?    : string;
    nombre_usuario_registro?  : string;
    nombre_usuario_documento? : string;

};

export type PresupuestoTableModel = {
    id                        : string;
    presupuesto_inicial       : number;
    presupuesto_restante      : number;
};

export type TipoCitesOptionsFormModel = {
    id                        : string;
    nombre                    : string;
    concepto                  : string;   
    usuarioId?                : string | null;
};

export type TipoCitesOptionsFormModel2 = {
    id                        : string;
    nombre                    : string;
    concepto                  : number;   
};

export type CitesPropsResponse = {
    id?                       : string;    
    fecha_registro            : Date;
    nombre_usuario ?          : string;//VERIFICAR
    //area_padre           : string; 
    nombre_area_solicitante   : string;
    nombre_area_destino       : string;
    cite_completo             : string;
    referencia                : string;
    tipo_documento            : string;
    dias                      : number;
    gestion                   : string;    
    actividad                 : string;            
    nombre_proceso            : string;
    cuce                      : string;
    empresa_adjudicada        : string;
    observacion               : string;
    hoja_ruta                 : string;
    fecha_cierre              : Date;    
    estado                    : string; 
    estado_activo             : boolean;   	
	modifica_estado?          : string; 
    usuario_id?              : string;
    tipo_cite_id?             : string;  
};

export type ReportFilters = {
    tipo?       : string;
    nombre?     : string;
    telefono?   : string;
    direccion?  : string;
    _limit?     : string;
    _page?      : string;
    q?          : string;
};

export type CitesItem = { //cambiar
    id                        : string;    
    fecha_registro            : string;
    nombre_usuario            : string;//VERIFICAR    
    nombre_area_solicitante   : string;
    nombre_area_destino       : string;
    cite_completo             : string;
    referencia                : string;
    tipo_documento            : string;
    dias                      : number;
    gestion                   : string;    
    actividad                 : string;            
    nombre_proceso            : string;
    cuce                      : string;
    empresa_adjudicada        : string;
    observacion               : string;
    hoja_ruta                 : string;
    fecha_cierre              : string;    
    estado                    : string; 
    estado_activo             : boolean;
    numero_paginas?           : number;   
	
	modifica_estado?          : string; 
     usuario_id?              : string;
    tipo_cite_id?             : string; 
    
};
export type CitesData = {
    info: InfoCitesModel;
    data: CitesReporte;
};

export type CitesData2 = {
    info: InfoReporteModel;
    data: CitesReporte;
    iniciales?: listaAbrevaturas[];
};

type InfoReporteModel = {
   id?                       : string;    
    fecha_registro            : Date;
    nombre_usuario ?          : string;//VERIFICAR    
    nombre_area_solicitante   : string;
    nombre_area_destino       : string;
    cite_completo             : string;
    referencia                : string;
    tipo_documento            : string;
    dias                      : number;
    gestion                   : string;    
    actividad                 : string;            
    nombre_proceso            : string;
    cuce                      : string;
    empresa_adjudicada        : string;
    observacion               : string;
    hoja_ruta                 : string;
    fecha_cierre              : Date;    
    estado                    : string; 
    estado_activo             : boolean;   	
    numero_paginas?           : number;   
	modifica_estado?          : string; 
    usuario_id?              : string;
    tipo_cite_id?             : string; 
    
    //activo                : boolean;
    codigoQR                  : string;
    area_nombre_hijo          : string;
    area_nombre_padre          : string;
    usuario_imprime?          : string;
};

export type CitesReporte = {
    //tasks: any;
    //lineas: lineaTemporalItem[];
  //  rows  : InfoReporteModel[];   //RevisaViatico 
};

export type CitesDataR = {
   
    rows: CitesItem[];
   
};
export type InfoCitesModel = {
    codigo    : string;
    nombre    : string;
    fecha     : string;
    email     : string;
    area_usuario_padre? : string;
    area_usuario_hijo? : string;
    codigoQR? : string;
    usuario_imprime?: string;
};
export type CitesDataResponse = {
    info?: InfoCitesModel;
    data?: CitesDataR;
};

export type listaAbrevaturas = {
   id_cite : string,
   abreviatura:string, 
   fecha_registro:string,
   estado : string;
};

export class CitesView {
    public async getCitesTable(authUser: AuthUser,query: any): Promise<Result<{ rows: CitesTableModel[] }>> {
            const cites = await CitesService.getAll();
            if (cites.isFailure) return Result.fail("Falló al obtener la Cites");
            const citesResult = cites.getValue();

             const tipoCites = await TipoCitesService.getAll();
            if (tipoCites.isFailure) return Result.fail("Falló al obtener la Cites");
            //const tipoCitesResult = tipoCites.getValue();            
            
            /*Listado de areas*/
            const area = await AreaService.getAll();
            if(area.isFailure) return Result.fail("Fallo al obtener el Area");
            const areaResult = area.getValue();

            /*Listado de areas*/
            const personal = await PersonalService.getAll();
            if(personal.isFailure) return Result.fail("Fallo al obtener el Personal");
            const personalResult = personal.getValue();
            
            
           /*Listado de areas*/
            const usuario = await UsuarioService.getAll();
            if(usuario.isFailure) return Result.fail("Fallo al obtener el usuarios");
            const usuarioResult = usuario.getValue();
                     
            const result: CitesTableModel[] = citesResult.map((item) => {
               /**seleccionamos del listado de area el nombre del departamento y su sigla*/            

            const areaNombreOrigen = areaResult.find((c) => c.id === item.props.nombreAreaSolicitante)?.props.nombre|| "-";                  
            const areaNombreDestino = areaResult.find((c) => c.id === item.props.nombreAreaDestino)?.props.nombre|| "-";               
            const usuarioNombre = usuarioResult.find((c) => c.id=== item.props.nombreUsuario)?.props.fullname|| "-";     
              /**Usuario que genera el documento */        
            const usuarioCreador = usuarioResult.find((c) => c.id=== item.props.usuarioId)?.props.fullname|| "-";       			
               /*control y actualizacion de dias */
            if(item.props.estado === "ACTIVO"){
                const numeroDias = this.contadorDias(item.props.fechaRegistro);
                this.actualizaDias(item.id, numeroDias);
            }
               
               /*Fin control de dias */
              
               return {
                    id                             : String(item.id),
                    fecha_registro                 :  item.props.fechaRegistro?moment(item.props.fechaRegistro).format("DD/MM/YYYY").toString(): '',                          
                    fecha_registro_format          : new Date (item.props.fechaRegistro),
                    nombre_usuario                 : usuarioNombre,
                    nombre_area_solicitante        : areaNombreOrigen,
                    nombre_area_destino            : areaNombreDestino,               
                    cite_completo                  : item.props.citeCompleto,
                    referencia                     : item.props.referencia,
                    tipo_documento                 : item.props.tipoDocumento,//tipoDocumentoNombre,
                    dias                           : item.props.dias,
                    gestion                        : item.props.gestion,
                    actividad                      : item.props.actividad,
                    nombre_proceso                 : item.props.nombreProceso,
                    cuce                           : item.props.cuce,
                    empresa_adjudicada             : item.props.empresaAdjudicada,
                    observacion                    : item.props.observacion,  /*fecha de la gestión*/ 
                    hoja_ruta                      : item.props.hojaRuta,
                    fecha_cierre                   : item.props.fechaCierre?moment(item.props.fechaCierre).format("DD/MM/YYYY").toString(): '-',  
                    estado                         : item.props.estado,
                    estado_activo                  : item.props.estadoActivo,
                    numero_paginas                 : item.props.numeroPaginas,
                    usuario_creador                : usuarioCreador,
                    usuario_id                     : item.props.usuarioId,
                    tipo_cite_id                   : item.props.tipoCiteId,
                   // nombre_usuario                 : usuarioNombre,
                   
                
                };
            }).sort((a, b) => (a.fecha_registro_format > b.fecha_registro_format ? -1 : 1));    
            let listaFiltradaPorUsuario : CitesTableModel[]=[]; 
            const usuarioCreadorAreaID = personalResult.find((c) => c.props.usuarioId=== authUser.uid)?.props.areaId|| "-"; 			
            const usuarioAreaNombreID= areaResult.find((c) => c.id=== usuarioCreadorAreaID)?.props.nombre|| "-"; 
			
             if(authUser.roles === ENUM_TECNICO_CITES ){	         							              
                            listaFiltradaPorUsuario = result.filter((memo) => memo.nombre_area_solicitante === usuarioAreaNombreID);			
            }else{
                listaFiltradaPorUsuario = result;
            }                
            const response = findAndCountResult(listaFiltradaPorUsuario, query);
            return Result.ok(response);
			
    }

    /**
     * Actulizar numero de dias
     */
    public async actualizaDias(idCite:string, dias: number) {
        const ID_CITES = idCite;		       
        const result = await CitesService.update(ID_CITES, { dias });
        if (result.isFailure) return ( "Falló al cambiar estado");
        return result;
    }

    /**
     * Calculo de fechas
     */
   public contadorDias(fechaRegistro: Date): number {
    const hoy = new Date();
  
    const fechaCeroHoras = new Date(fechaRegistro);
    fechaCeroHoras.setHours(0, 0, 0, 0);
    const diffMs = hoy.getTime() - fechaCeroHoras.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDias;
   }

    //Cite - API
    public async getCitesApi(): Promise<Result<CitesPropsResponse[]>> {
        
        const Cites = await CitesService.getAll();
        if (Cites.isFailure) return Result.fail("Falló al obtener la Cites");
        const CitesResult = Cites.getValue();
        
        /*Listado de areas*/
        const area = await AreaService.getAll();
        if(area.isFailure) return Result.fail("Fallo al obtener el Area");
      // const areaResult = area.getValue();

        const result: CitesPropsResponse[] = CitesResult.map((item) => {
           
         
            return {
                    id                             : String(item.id),
                    fecha_registro                 : item.props.fechaRegistro,                          
                   // area_padre                     : item.props.areaPadre,
                    nombre_usuario                 : item.props.nombreUsuario,
                    nombre_area_solicitante        : item.props.nombreAreaSolicitante,
                    nombre_area_destino            : item.props.nombreAreaDestino,               
                    cite_completo                  : item.props.citeCompleto,
                    referencia                     : item.props.referencia,
                    tipo_documento                 : item.props.tipoDocumento,
                    dias                           : item.props.dias,
                    gestion                        : item.props.gestion,
                    actividad                      : item.props.actividad,
                    nombre_proceso                 : item.props.nombreProceso,
                    cuce                           : item.props.cuce,
                    empresa_adjudicada             : item.props.empresaAdjudicada,
                    observacion                    : item.props.observacion,  /*fecha de la gestión*/ 
                    hoja_ruta                      : item.props.hojaRuta,
                    fecha_cierre                   : item.props.fechaCierre,
                    estado                         : item.props.estado,
                    numero_paginas                 : item.props.numeroPaginas,
                    estado_activo                  : item.props.estadoActivo,
                    usuario_id                     : item.props.usuarioId,
                    tipo_cite_id                   : item.props.tipoCiteId,
             
             };
         });         
        
        return Result.ok<CitesPropsResponse[]>(result);
    }

    public async getCitesFormDataView(id_cite: string): Promise<Result<CitesFormDataResponse>> {
		
        const Cites = await CitesService.getById(id_cite);
        if (Cites.isFailure) return Result.fail<CitesFormDataResponse>("Cites no encontrado");
        const props = Cites.getValue().props;

       /*Listado de areas*/
       const area = await AreaService.getAll();
       if(area.isFailure) return Result.fail("Fallo al obtener el Area");
       const areaResult = area.getValue();

       /*Listado de areas*/
        const usuario = await UsuarioService.getAll();
        if(usuario.isFailure) return Result.fail("Fallo al obtener el usuarios");
        const usuarioResult = usuario.getValue();

        const areaNombreOrigen = areaResult.find((c) => c.id === props.nombreAreaSolicitante)?.props.nombre|| "-";                  
        const areaNombreDestino = areaResult.find((c) => c.id === props.nombreAreaDestino)?.props.nombre|| "-";           
        const usuarioNombreRegistro = usuarioResult.find((c) => c.id=== props.usuarioId)?.props.fullname|| "-";   
        const usuarioNombreDocumento = usuarioResult.find((c) => c.id=== props.nombreUsuario)?.props.fullname|| "-";   


       const result: CitesFormDataResponse = {					
                 
                  
                    id                             : Cites.getValue().id,                    
                    fecha_registro                 : props.fechaRegistro,                                             
                    nombre_usuario                 : props.nombreUsuario,
                    nombre_area_solicitante        : props.nombreAreaSolicitante,
                    nombre_area_destino            : props.nombreAreaDestino,               
                    cite_completo                  : props.citeCompleto,
                    referencia                     : props.referencia,
                    tipo_documento                 : props.tipoDocumento,
                    dias                           : props.dias,
                    gestion                        : props.gestion,
                    actividad                      : props.actividad,
                    nombre_proceso                 : props.nombreProceso,
                    cuce                           : props.cuce,
                    empresa_adjudicada             : props.empresaAdjudicada,
                    observacion                    : props.observacion,  /*fecha de la gestión*/ 
                    hoja_ruta                      : props.hojaRuta,
                    fecha_cierre                   : props.fechaCierre,
                    estado                         : props.estado,
                    numero_paginas                 : props.numeroPaginas,
                    estado_activo                  : props.estadoActivo,
                    usuario_id                     : props.usuarioId,
                    tipo_cite_id                   : props.tipoCiteId, 
                    fecha_registro_format          : props.fechaRegistro?moment(props.fechaRegistro).format("DD/MM/YYYY").toString(): '-', 
                    nombre_origen_string           : areaNombreOrigen,
                    nombre_destino_string          : areaNombreDestino,
                    nombre_usuario_registro        : usuarioNombreRegistro,
                    nombre_usuario_documento       : usuarioNombreDocumento,    
                    fecha_cierre_format            : props.fechaCierre?moment(props.fechaCierre).format("DD/MM/YYYY").toString(): '-',     
                                
        };      
        return Result.ok(result);
    }

    public async getAllDocumentos(): Promise<Result<{ rows: TipoCitesOptionsFormModel[]; count: number }>> {
        const tipoCites = await TipoCitesService.getAll();
        if(tipoCites.isFailure) return Result.fail("Fallo al obtener el tipo Cites");
        const tipoCitesResult = tipoCites.getValue();
                        
        const result: TipoCitesOptionsFormModel[] = tipoCitesResult		
            .map((item) => {                
                return {
                    id: item.id.toString(),
                    nombre: item.props.nombreDocumento,
                    concepto: item.props.siglaDocumento,
                };
            })
            .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));       
        return Result.ok({ rows: result, count: result.length });
    }

     public async getTipoCites(): Promise<Result<{ rows: TipoCitesOptionsFormModel[]; count: number }>> {
        /* Listado de Documentos */        
        const tipoCites = await TipoCitesService.getAll();
        if(tipoCites.isFailure) return Result.fail("Fallo al obtener el tipo Cites");
        const tipoCitesResult = tipoCites.getValue();

         /*Listado de areas*/
       const area = await AreaService.getAll();
       if(area.isFailure) return Result.fail("Fallo al obtener el Area");
       const areaResult = area.getValue();
        /*Listado de usuarios*/
       const personal = await PersonalService.getAll();
       if(personal.isFailure) return Result.fail("Fallo al obtener el personal");
       const personalResult = personal.getValue();


        /* salida de indice area */
       const citeAreas: TipoCitesOptionsFormModel[] = await Promise.all(         
                           areaResult.map(async (item) => {                 
                const cite = await AreaService.getIndicePorSigla(item.props.indice, areaResult);          
                let areaPadre = areaResult.find((c)=>c.id === item.id)?.props.areaId;		          
                    if(areaPadre == null){
                    areaPadre = item.id;              
                    } 
            return {
                    id        : item.id.toString(),
                    nombre    : cite.getValue(),
                    concepto   : areaPadre, // Area padre
                };
        })
      );
       /*Salida de documentacion */
        const citesDocumentos: TipoCitesOptionsFormModel[] = tipoCitesResult			
            .map((item) => {                
                return {
                    id: item.id.toString(),
                    nombre: item.props.nombreDocumento,
                    concepto: item.props.siglaDocumento,
                };
            })
            .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));     

        //filtramos todas las rutas 
        
        // fin filtro 
        const citesGeneral :TipoCitesOptionsFormModel[] = [];		
        for (let i = 0; i < citeAreas.length; i++) {
          for (let j = 0; j < citesDocumentos.length; j++) {
                const citeCompleto = citeAreas[i].nombre.concat("/").concat(citesDocumentos[j].concepto);                 
                citesGeneral.push({id:citeAreas[i].id, nombre: citeCompleto, concepto: citesDocumentos[j].id});          
          }            
        }
        const citesGeneralCompleto :TipoCitesOptionsFormModel[] = [];	
	
		
        for (let i = 0; i < citesGeneral.length; i++) {
            for (let j = 0; j < personalResult.length; j++) {
               // const findUsuario = personalResult.find((c)=>c.props.areaId === citesGeneral[i].id)?.props.usuarioId;	         
                 if (personalResult[j].props.areaId === citesGeneral[i].id){     
                    if(personalResult[j].props.usuarioId != null || personalResult[j].props.usuarioId != undefined){
                        citesGeneralCompleto.push({id:citesGeneral[i].id, nombre: citesGeneral[i].nombre, concepto: citesGeneral[i].concepto, usuarioId: personalResult[j].props.usuarioId});
                    }               
                    
                    
                 }                    
                
            }       
        }
	
        return Result.ok({ rows: citesGeneralCompleto, count: citesGeneralCompleto.length });
    }

public async getAllCitesRutas(): Promise<Result<{ rows: TipoCitesOptionsFormModel2[]; count: number }>> {
    /*Listado de areas*/
    const cite = await CitesService.getAll();
    if(cite.isFailure) return Result.fail("Fallo al obtener el cite");
    const citeResult = cite.getValue();
     
    /* listado general de la tabla area ordenados */
    const result: TipoCitesOptionsFormModel2[] = await Promise.all(
        citeResult.map(async (item) => {                 
        const numeroCite = this.extraerNumero(item.props.citeCompleto);     
     
        return {
          id        : item.id.toString(),
          nombre    : item.props.citeCompleto,
          concepto   : numeroCite ,
        };
      })
    );
    result.sort((a, b) => a.nombre > b.nombre ? 1 : -1);  
  return Result.ok({ rows: result, count: result.length });
} 

public extraerNumero(texto: string): number {
    const match = texto.match(/Nº\s+0*(\d+)\//);
    return match ? parseInt(match[1], 10) : -1; // Usa -1 si no se encuentra número
  }
  

public async getReporteCitesPDF(authUser: AuthUser, queryString: string,  listaIds? : string[], count?:number): Promise<Result<any>> {    

    const ID_USUARIO = authUser.uid;     
    const resultObject = queryStringToArray(queryString);    
		
    const result = {
		
        info: await this.getInfoCitesData(authUser, resultObject),
        data: await this.getCitesData(resultObject, listaIds, count)
    };
    
    return Result.ok(result);
  }

private async getInfoCitesData(authUser: AuthUser, queryString: ReportFilters): Promise<InfoCitesModel | undefined> {

    const ID_USUARIO = authUser.uid;
        const usuario = await UsuarioService.getById(ID_USUARIO);		
		
        if (usuario.isFailure) throw new Error(String(usuario.error));

         const personal = await PersonalService.getAll();
         if(personal.isFailure)  Result.fail("Fallo al obtener el Area");
         const personalResult = personal.getValue();

        const area = await AreaService.getAll();
        if (area.isFailure) return undefined;
        const areaResult = area.getValue();
        const areaID = personalResult.find((a) => a.props.usuarioId=== ID_USUARIO)?.props.areaId||""; 		
        const nombreArea = areaResult.find((a) => a.id=== areaID)?.props.nombre||""; 	//hijo o padre usuario

            const areaPadreID = areaResult.find((c) => c.id === areaID)?.props.areaId|| "-";               
            let areaNombrePadre = "";
            if(areaPadreID != null || areaPadreID != '-'){
              areaNombrePadre = areaResult.find((c) => c.id === areaPadreID)?.props.nombre|| "-";
            }else{
              areaNombrePadre = 	nombreArea;		
            }             


        const NOMBRE_USUARIO = usuario.getValue().getNombreCompleto();			
        const EMAIL_USUARIO = usuario.getValue().props.email;	
        
        const inputObj: any = queryString;
		
		const hoy = new Date();
        const gestion = hoy.getFullYear().toString();
        const tipo = inputObj.tipo_reporte || null;		

        const FECHA_REGISTRO = moment(hoy).locale('es').format('dddd D [de] MMMM [de] YYYY hh:mm:ss a').toString();	
        const codigo = `${gestion}-|-${tipo}-|-${FECHA_REGISTRO}`;
	
        return {
            codigo    : codigo,
            nombre    : NOMBRE_USUARIO,
            fecha     : FECHA_REGISTRO,
            email     : EMAIL_USUARIO,
            area_usuario_hijo : nombreArea,
            area_usuario_padre: areaNombrePadre,
            
        }
}

private async getCitesData(queryString: ReportFilters, listaIds?:string[], count?: number){//: Promise<CitesDataR | undefined> {
	
	//filtros del front end
    const inputObj: any = queryString;		
    const hoy = new Date();
    const gestion = hoy.getFullYear().toString();
   
    //cites 
    const cites = await CitesService.getAll();
     if (cites.isFailure) return undefined;
     const citesResult = cites.getValue();
    //tipocites
     const tipoCites = await TipoCitesService.getAll();
     if (tipoCites.isFailure) return undefined;
     const tipoCitesResult =tipoCites.getValue();
     //area
     const area = await AreaService.getAll();
     if (area.isFailure) return undefined;
     const areaResult = area.getValue();
     //usuario
     const usuario = await UsuarioService.getAll();
     if (usuario.isFailure) return undefined;
     const usuarioResult = usuario.getValue();

     const personal = await PersonalService.getAll();
     if (personal.isFailure) return undefined;
      //const personalResult = personal.getValue();

    const citesList: CitesItem[] = citesResult.map((item) => {
        const ID_CITES = String(item.id);       
        const usuarioID = citesResult.find((a) => a.id === ID_CITES)?.props.usuarioId||""; 
      //  const usuarioAreaID = personalResult.find((a) => a.id === usuarioID)?.props.areaId||""; 
        //const usuarioAreaNombre = areaResult.find((a) => a.id === usuarioAreaID)?.props.nombre||""; 
        const tipoCiteID = citesResult.find((a) => a.id === ID_CITES)?.props.tipoCiteId||""; 
        const tipoCiteNombre = tipoCitesResult.find((a) => a.id === tipoCiteID)?.props.nombreDocumento||""; 
        //const tipoCiteDocumento = tipoCitesResult.find((a) => a.id === tipoCiteID)?.props.tipoDocumento||""; 
        //const dias = citesResult.find((a) => a.id === ID_CITES)?.props.dias||"";
        //const estado = citesResult.find((a) => a.id === ID_CITES)?.props.estado||"";
        const areaOrigenID = citesResult.find((a) => a.id === ID_CITES)?.props.nombreAreaSolicitante||"";
		const areaOrigenNombre = areaResult.find((a) => a.id === areaOrigenID)?.props.nombre||"";
		const areaDestinoID = citesResult.find((a) => a.id === ID_CITES)?.props.nombreAreaDestino||"";
		const areaDestinoNombre = areaResult.find((a) => a.id === areaDestinoID)?.props.nombre||"";
        //const usuarioCI = usuarioResult.find((a) => a.id === usuarioID)?.props.ci||"";
        const usuarioNombre = usuarioResult.find((a) => a.id === usuarioID)?.props.fullname||"";
        const citeCompleto = citesResult.find((a) => a.id === ID_CITES)?.props.citeCompleto||"";		
        const referencia = citesResult.find((a) => a.id === ID_CITES)?.props.referencia||"";	
        //const fechaCierre = citesResult.find((a)=>a.id === ID_CITES)?.props.fechaCierre||"";
      
        return {

               id                         : String(item.id),  
                fecha_registro            : item.props.fechaRegistro?moment(item.props.fechaRegistro).format("DD/MM/YYYY HH:mm:ss").toString(): '-', 
                nombre_usuario            : usuarioNombre,              
                nombre_area_solicitante   : areaOrigenNombre, 
                nombre_area_destino       : areaDestinoNombre, 
                cite_completo             : citeCompleto, 
                referencia                : referencia, 
                tipo_documento            : tipoCiteNombre, 
                dias                      : item.props.dias, 
                gestion                   : gestion, 
                actividad                 : item.props.actividad,             
                nombre_proceso            : item.props.nombreProceso, 
                cuce                      : item.props.cuce, 
                empresa_adjudicada        : item.props.empresaAdjudicada, 
                observacion               : item.props.observacion, 
                estado                    : item.props.estado,           
                hoja_ruta                 : item.props.hojaRuta, 
                fecha_cierre              : item.props.fechaCierre?moment(item.props.fechaCierre).format("DD/MM/YYYY").toString(): '-', 
                
                estado_activo             : item.props.estadoActivo,    
                numero_paginas            : item.props.numeroPaginas,
                modifica_estado           : item.props.nombreAreaSolicitante,  
                usuario_id                : item.props.nombreAreaSolicitante, 
                tipo_cite_id              : item.props.nombreAreaSolicitante,  
  
         };
    }).sort((a, b) =>a.fecha_registro > b.fecha_registro ? 1 : -1);
  
   
     let filtroGeneral : CitesItem [] = [];
    
      if(listaIds != undefined){            
        listaIds!.forEach((idC, key) => {        
        const resultadoFiltro = citesList.filter((value) => this.filtrarId(value.id, idC));           
        filtroGeneral = [...filtroGeneral, ...resultadoFiltro];  // Acumulamos los resultados            
		});
    }         
       /* const response = findAndCountResult(filtroGeneral);
           */   
        
          const result1: CitesDataR = {          
            rows: citesList,    //filtroGeneral,          
        }; 
       return result1;
	
}
  
public filtrarId(item:string, id:string) { 		
        return (item === id); 
 }

 //impresion
public async getAllCitesPDF(authUser: AuthUser, params: string): Promise<Result<any>> {    
    const ID_USUARIO = authUser.uid;
	
    const id_cites = params;    
    
    const usuarioaCargo = await UsuarioService.getById(ID_USUARIO);
    if (usuarioaCargo.isFailure) return Result.fail(String(usuarioaCargo.error));
    const usuarioaCargoResult = usuarioaCargo.getValue().props;
    
    const cites = await CitesService.getById(id_cites)
    if (cites.isFailure) return Result.fail<CitesFormDataResponse>("Falló al obtener la Cites");
    const props = cites.getValue().props;
    
    //cites 
    const citesLista = await CitesService.getAll();
     if (citesLista.isFailure) Result.fail(String(citesLista.error));
     const citesListaResult = citesLista.getValue();
    

   /*Listado de usuarios*/
    const usuario = await UsuarioService.getAll();
    if(usuario.isFailure) return Result.fail("Fallo al obtener el Usuario");
    const usuarioResult = usuario.getValue();
  
     const personal =await PersonalService.getAll();
    if(personal.isFailure) return Result.fail("Fallo al obtener el Personal");
    const personalResult = personal.getValue();
     
    const area = await AreaService.getAll();
    if (area.isFailure) return Result.fail("Falló al obtener la Memorandum");
    const areaResult = area.getValue();
    
    //seleccionamos del listado de area el nombre del departamento y su sigla
    const usuarioNombre = usuarioResult.find((c) => c.id === props.usuarioId)?.props.fullname|| "-";//Revisar
    const usuarioImprime = usuarioResult.find((c) => c.id === ID_USUARIO)?.props.fullname|| "-";//Revisar
	const nombreAreaHijo = areaResult.find((a) => a.id=== props.nombreAreaSolicitante)?.props.nombre||""; 	//hijo o padre usuario
	const areaPadreID = areaResult.find((c) => c.id === props.nombreAreaSolicitante)?.props.areaId|| "-";               
	let areaNombrePadre = "";
    if(areaPadreID != null && areaPadreID != '-'){
        areaNombrePadre = areaResult.find((c) => c.id === areaPadreID)?.props.nombre|| "-";    
    }else{
        areaNombrePadre = nombreAreaHijo;		            
    }   
    
      //Sacar lista de abreviaturas
    const listaOrdenaPorCites = citesListaResult.sort((a, b) =>a.props.citeCompleto> b.props.citeCompleto ? 1 : -1);	
    const listaOrdenaTipoDocumento = listaOrdenaPorCites.filter((value)=> value.props.tipoDocumento === props.tipoDocumento) ;	
	
     //lista de abreviaturas
     const listaAbreviaturas: listaAbrevaturas[] = listaOrdenaTipoDocumento.map((item) => {
                    
           const nombreUsuarioId = usuarioResult.find((c) => c.id === item.props.usuarioId)?.props.fullname|| "-";//Revisar
           const iniciales = this.obtenerIniciales(nombreUsuarioId); 
         
           return {
                id_cite: String(item.id),
                abreviatura: iniciales,
                fecha_registro: item.props.fechaRegistro?moment(item.props.fechaRegistro).format("DD/MM/YYYY").toString(): '-' , // se puede agregar hora
                estado : item.props.estado,
           }
     }) 
 
    //fin lista de abreviaturas

    const result: CitesData2 = {
        info: {
            
            fecha_registro            : props.fechaRegistro,
            nombre_usuario            : props.nombreUsuario,//VERIFICAR            
            nombre_area_solicitante   : props.nombreAreaSolicitante,
            nombre_area_destino       : props.nombreAreaDestino,
            cite_completo             : props.citeCompleto,
            referencia                : props.referencia,
            tipo_documento            : props.tipoDocumento,
            dias                      : props.dias,
            gestion                   : props.gestion,            
            actividad                 : props.actividad,            
            nombre_proceso            : props.nombreProceso,
            cuce                      : props.cuce,
            empresa_adjudicada        : props.empresaAdjudicada,
            observacion               : props.observacion,
            hoja_ruta                 : props.hojaRuta,
            fecha_cierre              : props.fechaCierre,            
            estado                    : props.estado,
            estado_activo             : props.estadoActivo,          
            numero_paginas             : props.numeroPaginas,
            usuario_id                : usuarioNombre,//verificar
            tipo_cite_id              : props.tipoCiteId, //verificar            
            area_nombre_hijo          : nombreAreaHijo,
            area_nombre_padre         : areaNombrePadre,
            usuario_imprime           : usuarioImprime,
         
            codigoQR    : `
            ${id_cites}-  
            ${props.fechaRegistro}-       
            ${props.nombreUsuario}-        
            ${props.nombreAreaSolicitante}-   
            ${props.nombreAreaDestino}-     
            ${props.citeCompleto}-    
            ${props.referencia}-       
            ${props.tipoDocumento}-                  
            ${props.dias}-      
            ${props.observacion}-         
            ${props.hojaRuta}-    
            ${props.fechaCierre}-            
            ${props.estado}`,
           // email     : usuarioResult.email,
           
        },
        data: {            
               
        }, 
        
        iniciales: listaAbreviaturas,
  } 
    
    return Result.ok(result);
	

}

/**
 * Metodo para la obtencion de iniciales del nombre completo
 */
public obtenerIniciales(nombreCompleto:string) {
  return nombreCompleto
    .split(/\s+/)               // separa por espacios
    .map(palabra => palabra[0]) // toma la primera letra
    .join('')                   // une las letras
    .toUpperCase();             // convierte a mayúsculas
}





 
}