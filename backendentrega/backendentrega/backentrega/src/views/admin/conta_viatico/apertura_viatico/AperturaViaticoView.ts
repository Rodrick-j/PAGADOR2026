import { Result } from "../../../../base/types/Result";
import { findAndCountResult } from "../../../../tools/util";
import  AperturaViaticoService  from "../../../../core/admin/conta_viatico/apertura_viatico";
import  AreaService  from "../../../../core/rrhh/area";
import moment from "moment";
import PersonalService  from "../../../../core/rrhh/personal";
import  AperturaGeneralService  from "../../../../core/admin/apertura/apertura_general";
import  ObjetoGastoService  from "../../../../core/admin/apertura/objeto_gasto";
import { ENUM_DEPENDENCIA, ENUM_PRINCIPAL } from "../../../../base/constants/enum";


type AperturaViaticoTableModel = {  
    id                             : string;
    /**Se agrega segun la relacion con la tabla */
    nombre_area: string;
    sigla_area:string; 
    /** Tabla original de la BDD*/
    apertura_programatica          : string;
    cod_fte                        : string;
    cod_org                        : string;
   // objeto                         : string;
    descripcion_objeto_gasto       : string;   
    presupuesto_inicial            : number;
    presupuesto_restante           : number;
    estado                         : string;
    sisin                          : string;
    gestion                        : string;
    area_id                        : string;
    apertura_general_id?            : string;
    //aumentar
    objeto_id? : string;
    area_hijo_id? : string;
    nombre_area_hijo? : string;
    sigla_area_hijo?  : string;
    tipo_area?        : string;
    ue?:number;
    estado_activo?     : boolean;
};

type AperturaGeneralTableModel = {  
    apertura_programatica          : string;
    ue                            : number;
    cod_fte                        : number;
    cod_org                        : number;     
    presupuesto_inicial            : number;
    presupuesto_restante           : number;
    mod_aprobada                   : number;
    presupuesto_vigente            : number;
    pagado                        : number;
    saldo_ejecutar                 : number;
    estado_activo                  : boolean;
    estado                        : string;
    sisin                         : string;
    gestion                       : Date;
    objeto_id                      : string;
    tipo_area                      : string;
    area_hijo_id                    : string;
    area_id                        : string; 
    apertura_general_id?            : string;  
    
    nombre_area_hijo               : string,                      
    nombre_area                    : string,
    sigla_area                     : string,                   
    descripcion_objeto_gasto      : string,
}

export type GetAperturaViaticosTableResponse = {
    rows: AperturaViaticoTableModel[];
    count: number;
};

export type AperturaViaticoFormDataResponse = {
    id: string;  
    apertura_programatica          : string;
    cod_fte                        : string;
    cod_org                        : string;
    objeto                         : string;
    descripcion_objeto_gasto       : string;   
    presupuesto_inicial            : number;
    presupuesto_restante           : number;
    estado                         : string;
    sisin                          : string;
    gestion                        : Date;
    area_id                        : string;
    estado_activo?                  : boolean;
    apertura_general_id?           : string;
    // Campos adicionales

};

export type AperturaViaticosOptionsFormModel = {
    id: string;
    nombre: string;
    concepto: string;
    presupuesto: number;
    estadoActivo? : boolean;
};
export type AperturaViaticosOptionsFormModel2 = {
    id: string;
    nombre: string;
    id_usuario: string;
    presupuesto: number;
};

export type FormatoAperturasHijoPadre = {
    id_apertura: string;
    nombre: string;
    id_area: string;
    apertura_programatica: string;
    area_padre : string; // si es hijo sino vacio
    descripcion_objeto_gasto : string;
    estadoActivo? : boolean;
};



export class AperturaViaticoView {
    public async getAperturaViaticosTable(query: any): Promise<Result<{ rows: AperturaViaticoTableModel[] }>> {
            const aperturaViatico = await AperturaViaticoService.getAll();
            if (aperturaViatico.isFailure) return Result.fail("Falló al obtener la AperturaViatico");
            const aperturaViaticoResult = aperturaViatico.getValue();
           
            const aperturaGeneral = await AperturaGeneralService.getAll();
            if (aperturaGeneral.isFailure) return Result.fail("Falló al obtener la aperturaGeneral");
            const aperturaGeneralResult = aperturaGeneral.getValue();
              /*Listado de areas*/
            const area = await AreaService.getAll();
            if(area.isFailure) return Result.fail("Fallo al obtener el Area");
            const areaResult = area.getValue();

            const result: AperturaViaticoTableModel[] = aperturaViaticoResult.map((item) => {
               /**seleccionamos del listado de area el nombre del departamento y su sigla*/
               const areaNombre = areaResult.find((c) => c.id === item.props.areaId)?.props.nombre|| "-";             
               const areaSigla = areaResult.find((c) => c.id === item.props.areaId)?.props.sigla|| "-";               
               const aperturaPadreId = aperturaGeneralResult.find((c) => c.id === item.props.aperturaGeneralId)?.id|| "-";              
               const aperturaHijoId = aperturaGeneralResult.find((c) => c.id === aperturaPadreId)?.id|| "-";              
               const areaHijoID = aperturaGeneralResult.find((c) => c.id === aperturaHijoId)?.props.areaHijoId|| "-";             
               const areaNombreHijo = areaResult.find((c) => c.id === areaHijoID)?.props.nombre|| "-";               
               const areaSiglaHijo = areaResult.find((c) => c.id === areaHijoID)?.props.sigla|| "-";           
               
               return {
                    id                             : String(item.id),
                    nombre_area                    : areaNombre,
                    sigla_area                     : areaSigla,                     
                    apertura_programatica          : item.props.aperturaProgramatica,
                    cod_fte                        : item.props.codFte,
                    cod_org                        : item.props.codOrg,
                    objeto                         : item.props.objeto,
                    descripcion_objeto_gasto       : item.props.descripcionObjetoGasto,                  
                    presupuesto_inicial            : item.props.presupuestoInicial,
                    presupuesto_restante           : item.props.presupuestoRestante,
                    estado                         : item.props.estado,
                    sisin                          : item.props.sisin ||'-',
                    gestion                        : item.props.gestion?moment(item.props.gestion).format("YYYY").toString(): '',
                    area_id                        : item.props.areaId, 
                    nombre_area_hijo               : areaNombreHijo,
                    sigla_area_hijo                : areaSiglaHijo,
                    estado_activo                  : item.props.estadoActivo,
                };
            });
            
            const response = findAndCountResult(result, query);
            return Result.ok(response);
    }

    public async getAperturaViaticoFormDataView(id_apertura_viatico: string): Promise<Result<AperturaViaticoFormDataResponse>> {
        const aperturaViatico = await AperturaViaticoService.getById(id_apertura_viatico);
        if (aperturaViatico.isFailure) return Result.fail<AperturaViaticoFormDataResponse>("AperturaViatico no encontrado");
        
        const props = aperturaViatico.getValue().props;

        const result: AperturaViaticoFormDataResponse = {
                    id                             : aperturaViatico.getValue().id,
                    apertura_programatica          : props.aperturaProgramatica,
                    cod_fte                        : props.codFte,
                    cod_org                        : props.codOrg,
                    objeto                         : props.objeto,
                    descripcion_objeto_gasto       : props.descripcionObjetoGasto,                 
                    presupuesto_inicial            : props.presupuestoInicial,
                    presupuesto_restante           : props.presupuestoRestante,
                    estado                         : props.estado,
                    sisin                          : props.sisin,
                    gestion                        : props.gestion,
                    area_id                        : props.areaId || "", 
                    estado_activo                  : props.estadoActivo,
        };

        return Result.ok(result);
    }

     // se aumenta el metodo get all para la busqueda de apertura 
     public async getAllAperturaViatico(): Promise<Result<{ rows: AperturaViaticosOptionsFormModel[]; count: number }>> {
        const apertura = await AperturaViaticoService.getAll();        
		
        const area = await AreaService.getAll();
        if(area.isFailure) return Result.fail("Fallo al obtener el Area");
        const areaResult = area.getValue();
           
       const aperturaGeneral = await AperturaGeneralService.getAll();
       if (aperturaGeneral.isFailure) return Result.fail("Falló al obtener la aperturaGeneral");
       const aperturaGeneralResult = aperturaGeneral.getValue();
           
        const listaAperturas: AperturaViaticosOptionsFormModel[] = apertura
		
            .getValue()
            .map((item) => {     //Que llenen los valores de apertura programatica y sisin al mismo tiempo
                

               const areaNombre = areaResult.find((c) => c.id === item.props.areaId)?.props.nombre|| "-";                           
               const aperturaPadreId = aperturaGeneralResult.find((c) => c.id === item.props.aperturaGeneralId)?.id|| "-";              
               const aperturaHijoId = aperturaGeneralResult.find((c) => c.id === aperturaPadreId)?.id|| "-";              
               const areaHijoID = aperturaGeneralResult.find((c) => c.id === aperturaHijoId)?.props.areaHijoId|| "-";             
               const areaNombreHijo = areaResult.find((c) => c.id === areaHijoID)?.props.nombre|| "-"; 
               let estadoActivo;
               const esActivoValor = (v: any) => !!v; 
               if (!aperturaHijoId){
                   estadoActivo = esActivoValor(aperturaGeneralResult.find((c) => c.id === aperturaHijoId)?.props.estadoActivo);                        
               }else{
                   estadoActivo = esActivoValor(aperturaGeneralResult.find((c) => c.id === aperturaPadreId)?.props.estadoActivo);                       
               }   
               
                const seleccion = ('Apertura: ').concat(item.props.aperturaProgramatica)
                .concat(' -  FTE: ').concat(item.props.codFte)
                .concat(' -  CodOrg: ').concat(item.props.codOrg)
                .concat(' - Objeto: ').concat(item.props.descripcionObjetoGasto)
                .concat(' - Estado: ').concat(item.props.estado)
                .concat(' - Presupuesto: ').concat(String(item.props.presupuestoRestante))
                .concat(' - Area Principal:: ').concat(areaNombre)
                .concat(' - Area Dependencia:: ').concat(areaNombreHijo);
                return {
                    id: item.id.toString(),
                    nombre: seleccion,
                    concepto: item.props.estado,
                    presupuesto : item.props.presupuestoRestante,
                    estadoActivo: estadoActivo,
                };
            })
            .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));            
             // filtramos por el tipo de nombre es decir eliminara repetidos
             
             const elementosUnicos = new Map(listaAperturas.map(item => [item.nombre, item]));               

             const elementosUnicosActivos = Array.from(elementosUnicos.values()).filter(item => item.estadoActivo === true);            
             
             // Asigna el resultado al filtro
            const result: AperturaViaticosOptionsFormModel[] = Array.from(elementosUnicosActivos.values());
			

        return Result.ok({ rows: result, count: result.length });
    }


    //Se envia
public async getAperturaByUser(): Promise<Result<{ rows: AperturaViaticosOptionsFormModel2[]; count: number }>> {
        /*Listado de areas*/
        const area = await AreaService.getAll();
        if(area.isFailure) return Result.fail("Fallo al obtener el Area");
        const areaResult = area.getValue();

        /*Listado de personal */
        const personal = await PersonalService.getAll();
        if(personal.isFailure) return Result.fail("Fallo al obtener el Personal");
        // const personalResult = personal.getValue();   
        
        /*Listado de apertura */
        const apertura = await AperturaViaticoService.getAll();
        if(apertura.isFailure) return Result.fail("Fallo al obtener el Apertura");
        const aperturaResult = apertura.getValue();
               
        /*Listado apertura generla*/
        const aperturaGeneral = await AperturaGeneralService.getAll();
        if(aperturaGeneral.isFailure) return Result.fail("Fallo al obtener el Apertura General");
        const aperturaGeneralResult = aperturaGeneral.getValue();

        /*Listado objeto de gasto*/
        const objetoGasto = await ObjetoGastoService.getAll();
        if(objetoGasto.isFailure) return Result.fail("Fallo al obtener el Apertura General");
        const objetoGastoResult = objetoGasto.getValue();
        
        //filtramos y eliminamos repetidos de CodFte y codOrg
        const listaAperturas: AperturaViaticosOptionsFormModel[] = apertura
        .getValue()
        .map((item) => {     //Que llenen los valores de apertura programatica y sisin al mismo tiempo

            
              let areaID = aperturaGeneralResult.find((c) => c.props.aperturaProgramatica === item.props.aperturaProgramatica)?.props.areaHijoId|| "-";			
            if (areaID === "-"){
                  areaID = aperturaGeneralResult.find((c) => c.props.aperturaProgramatica === item.props.aperturaProgramatica)?.props.areaId|| "-";
            }       

               const aperturaPadreId = aperturaGeneralResult.find((c) => c.id === item.props.aperturaGeneralId)?.id|| "-";              
               const aperturaHijoId = aperturaGeneralResult.find((c) => c.id === aperturaPadreId)?.id|| "-";              
              
               let estadoActivo;
               const esActivoValor = (v: any) => !!v; 
               if (!aperturaHijoId){
                   estadoActivo = esActivoValor(aperturaGeneralResult.find((c) => c.id === aperturaHijoId)?.props.estadoActivo);                        
               }else{
                   estadoActivo = esActivoValor(aperturaGeneralResult.find((c) => c.id === aperturaPadreId)?.props.estadoActivo);                       
               } 

            const areaNombre = areaResult.find((c) => c.id === areaID)?.props.nombre|| "-";		
            const seleccion = ('Apertura: ').concat(item.props.aperturaProgramatica)
            .concat(' -  FTE: ').concat(item.props.codFte)
            .concat(' -  CodOrg: ').concat(item.props.codOrg)
            .concat(' :: ').concat(item.props.estado).concat(' :: ').concat(String(item.props.presupuestoRestante)).concat(' Bs.')
            .concat(' :: ').concat(item.props.descripcionObjetoGasto).concat(' :: ').concat(areaNombre);
            return {
                id: item.id.toString(),
                nombre: seleccion,
                concepto: item.props.aperturaProgramatica,
                presupuesto : item.props.presupuestoRestante,
                estadoActivo : estadoActivo,
            };
        })
        .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));
        
	
            // filtramos por el tipo de nombre es decir eliminara repetidos
        const elementosUnicos = new Map(listaAperturas.map(item => [item.nombre, item]));		
        const elementosUnicosActivos = Array.from(elementosUnicos.values()).filter(item => item.estadoActivo === true);                 
            // Asigna el resultado al filtro
        const filtroAperturas: AperturaViaticosOptionsFormModel[] = Array.from(elementosUnicosActivos.values());
	
		let result: any[] = [];
        const listaUsuarioApertura: AperturaViaticosOptionsFormModel2[] = [];
        
        //Creacion de listas hijo en apertura general
      const listaAperturasHijos: FormatoAperturasHijoPadre[] = [];

            aperturaGeneral.getValue().forEach((item) => {

                if (item.props.areaHijoId == null) return; // salta al siguiente
                 
                if(item.props.tipoArea === ENUM_DEPENDENCIA){
                    const areaNombre = areaResult.find((c) => c.id === item.props.areaHijoId)?.props.nombre || "-";
                    const descripcionObjetoGasto = objetoGastoResult.find((c) => c.id === item.props.objetoId)?.props.descripcionObjetoGasto || "-";
                    listaAperturasHijos.push({
                        id_apertura: item.id.toString(),
                        nombre: areaNombre,
                        id_area: item.props.areaHijoId,
                        apertura_programatica: item.props.aperturaProgramatica,
                        area_padre: item.props.areaId,
                        descripcion_objeto_gasto: descripcionObjetoGasto,
                    });
                }           
            });

            listaAperturasHijos.sort((a, b) =>a.apertura_programatica > b.apertura_programatica ? 1 : -1);         

        // Fin Creacion de listas hijo 

        //Creacion de listas padre en apertura general
      const listaAperturasPadres: FormatoAperturasHijoPadre[] = [];

            aperturaGeneral.getValue().forEach((item) => {

                if (item.props.areaId == null) return; //  salta al siguiente
                 
                if(item.props.tipoArea === ENUM_PRINCIPAL ){
                    const areaNombre = areaResult.find((c) => c.id === item.props.areaId)?.props.nombre || "-";
                    const descripcionObjetoGasto = objetoGastoResult.find((c) => c.id === item.props.objetoId)?.props.descripcionObjetoGasto || "-";
                    listaAperturasPadres.push({
                        id_apertura: item.id.toString(),
                        nombre: areaNombre,
                        id_area: item.props.areaId, //area del padre
                        apertura_programatica: item.props.aperturaProgramatica,
                        area_padre: item.props.areaHijoId,
                        descripcion_objeto_gasto: descripcionObjetoGasto,
                    });
                }           
            });

            listaAperturasPadres.sort((a, b) =>a.apertura_programatica > b.apertura_programatica ? 1 : -1);
           
        // Fin Creacion de listas padre

        for (let i = 0; i < filtroAperturas.length; i++) {
			
            result = personal
                .getValue()
                .map((item) => {          
                    const areaId =item.props.areaId;	             
				
                    let aperturaProgramatica = "-";
                    // 🔹 1 Verificar si el areaId es hijo
                    const esHijo = aperturaGeneralResult.find((c) => c.props.areaHijoId === areaId);
				
                    if (esHijo) {
                        // Si es hijo → usar SOLO su apertura
                        aperturaProgramatica = listaAperturasHijos.find((c)=> c.id_area === areaId)?.apertura_programatica || "-";
						

                    } else {

                        // 🔹 2 Si NO es hijo → buscar como padre
                        const esPadre = aperturaGeneralResult.find((c) => c.props.areaId === areaId);                   
                        if (esPadre) {
                            //  Tomar SOLO la apertura del padre
                            aperturaProgramatica = listaAperturasPadres.find((c)=> c.id_area === areaId)?.apertura_programatica || "-";				
                        }
                    }    

                           
                    let nombre ;                
                    if (filtroAperturas[i].concepto === aperturaProgramatica){             
                        nombre = filtroAperturas[i].nombre; // 
                        if(nombre.includes("Viaticos")){
                            listaUsuarioApertura.push({id:filtroAperturas[i].id, nombre:nombre!,id_usuario:item.props.usuarioId!, presupuesto: filtroAperturas[i].presupuesto})    
							
                        }                         
                    }	               
                });
        }
        
            listaUsuarioApertura.sort((a, b) => (a.nombre>b.nombre ? 1 : 1));           			
			return Result.ok({ rows: listaUsuarioApertura, count: listaUsuarioApertura.length });
    }

    public async getAperturaByUserPasaje(): Promise<Result<{ rows: AperturaViaticosOptionsFormModel2[]; count: number }>> {
        /*Listado de areas*/
        const area = await AreaService.getAll();
        if(area.isFailure) return Result.fail("Fallo al obtener el Area");
        const areaResult = area.getValue();

        /*Listado de personal */
        const personal = await PersonalService.getAll();
        if(personal.isFailure) return Result.fail("Fallo al obtener el Personal");
        // const personalResult = personal.getValue();   
        
        /*Listado de apertura */
        const apertura = await AperturaViaticoService.getAll();
        if(apertura.isFailure) return Result.fail("Fallo al obtener el Apertura");
        const aperturaResult = apertura.getValue();
        /*Listado apertura generla*/
        const aperturaGeneral = await AperturaGeneralService.getAll();
        if(aperturaGeneral.isFailure) return Result.fail("Fallo al obtener el Apertura General");
        const aperturaGeneralResult = aperturaGeneral.getValue();

        /*Listado objeto de gasto*/
        const objetoGasto = await ObjetoGastoService.getAll();
        if(objetoGasto.isFailure) return Result.fail("Fallo al obtener el Apertura General");
        const objetoGastoResult = objetoGasto.getValue();
        
        //filtramos y eliminamos repetidos de CodFte y codOrg
        const listaAperturas: AperturaViaticosOptionsFormModel[] = apertura
        .getValue()
        .map((item) => {     //Que llenen los valores de apertura programatica y sisin al mismo tiempo
             
              let areaID = aperturaGeneralResult.find((c) => c.props.aperturaProgramatica === item.props.aperturaProgramatica)?.props.areaHijoId|| "-";			
            if (areaID === "-"){
                  areaID = aperturaGeneralResult.find((c) => c.props.aperturaProgramatica === item.props.aperturaProgramatica)?.props.areaId|| "-";
            }       
            const areaNombre = areaResult.find((c) => c.id === areaID)?.props.nombre|| "-";		
               const aperturaPadreId = aperturaGeneralResult.find((c) => c.id === item.props.aperturaGeneralId)?.id|| "-";              
               const aperturaHijoId = aperturaGeneralResult.find((c) => c.id === aperturaPadreId)?.id|| "-";              
              
               let estadoActivo;
               const esActivoValor = (v: any) => !!v; 
               if (!aperturaHijoId){
                   estadoActivo = esActivoValor(aperturaGeneralResult.find((c) => c.id === aperturaHijoId)?.props.estadoActivo);                        
               }else{
                   estadoActivo = esActivoValor(aperturaGeneralResult.find((c) => c.id === aperturaPadreId)?.props.estadoActivo);                       
               } 

            const seleccion = ('Apertura: ').concat(item.props.aperturaProgramatica)
            .concat(' -  FTE: ').concat(item.props.codFte)
            .concat(' -  CodOrg: ').concat(item.props.codOrg)
            .concat(' :: ').concat(item.props.estado).concat(' :: ').concat(String(item.props.presupuestoRestante)).concat(' Bs.')
            .concat(' :: ').concat(item.props.descripcionObjetoGasto).concat(' :: ').concat(areaNombre);
            return {
                id: item.id.toString(),
                nombre: seleccion,
                concepto: item.props.aperturaProgramatica,
                presupuesto : item.props.presupuestoRestante,
                estadoActivo : estadoActivo,
            };
        })
        .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));

            // filtramos por el tipo de nombre es decir eliminara repetidos
            const elementosUnicos = new Map(listaAperturas.map(item => [item.nombre, item]));
			const elementosUnicosActivos = Array.from(elementosUnicos.values()).filter(item => item.estadoActivo === true);       
            
            // Asigna el resultado al filtro
        const filtroAperturas: AperturaViaticosOptionsFormModel[] = Array.from(elementosUnicosActivos.values());
        let result: any[] = [];
        const listaUsuarioApertura: AperturaViaticosOptionsFormModel2[] = [];
        
        //Creacion de listas hijo en apertura general
      const listaAperturasHijos: FormatoAperturasHijoPadre[] = [];

            aperturaGeneral.getValue().forEach((item) => {

                if (item.props.areaHijoId == null) return; // salta al siguiente
                 
                if(item.props.tipoArea === ENUM_DEPENDENCIA){
                    const areaNombre = areaResult.find((c) => c.id === item.props.areaHijoId)?.props.nombre || "-";
                    const descripcionObjetoGasto = objetoGastoResult.find((c) => c.id === item.props.objetoId)?.props.descripcionObjetoGasto || "-";
                    listaAperturasHijos.push({
                        id_apertura: item.id.toString(),
                        nombre: areaNombre,
                        id_area: item.props.areaHijoId,
                        apertura_programatica: item.props.aperturaProgramatica,
                        area_padre: item.props.areaId,
                        descripcion_objeto_gasto: descripcionObjetoGasto,
                    });
                }           
            });

            listaAperturasHijos.sort((a, b) =>a.apertura_programatica > b.apertura_programatica ? 1 : -1);         

        // Fin Creacion de listas hijo 

        //Creacion de listas padre en apertura general
      const listaAperturasPadres: FormatoAperturasHijoPadre[] = [];

            aperturaGeneral.getValue().forEach((item) => {

                if (item.props.areaId == null) return; // salta al siguiente
                 
                if(item.props.tipoArea === ENUM_PRINCIPAL ){
                    const areaNombre = areaResult.find((c) => c.id === item.props.areaId)?.props.nombre || "-";
                    const descripcionObjetoGasto = objetoGastoResult.find((c) => c.id === item.props.objetoId)?.props.descripcionObjetoGasto || "-";
                    listaAperturasPadres.push({
                        id_apertura: item.id.toString(),
                        nombre: areaNombre,
                        id_area: item.props.areaId, //area del padre
                        apertura_programatica: item.props.aperturaProgramatica,
                        area_padre: item.props.areaHijoId,
                        descripcion_objeto_gasto: descripcionObjetoGasto,
                    });
                }           
            });

            listaAperturasPadres.sort((a, b) =>a.apertura_programatica > b.apertura_programatica ? 1 : -1);
           
        // Fin Creacion de listas padre

        for (let i = 0; i < filtroAperturas.length; i++) {
            result = personal
                .getValue()
                .map((item) => {          
                     const areaId = item.props.areaId;	  

                    let aperturaProgramatica = "-";
                    // 🔹 1 Verificar si el areaId es hijo
                    const esHijo = aperturaGeneralResult.find((c) => c.props.areaHijoId === areaId);
				
                    if (esHijo) {
                        // Si es hijo → usar SOLO su apertura
                        aperturaProgramatica = listaAperturasHijos.find((c)=> c.id_area === areaId)?.apertura_programatica || "-";
						

                    } else {

                        // 🔹 2 Si NO es hijo → buscar como padre
                        const esPadre = aperturaGeneralResult.find((c) => c.props.areaId === areaId);                   
                        if (esPadre) {
                            //  Tomar SOLO la apertura del padre
                            aperturaProgramatica = listaAperturasPadres.find((c)=> c.id_area === areaId)?.apertura_programatica || "-";				
							
                        }
                    }                  		
                
                    let nombre ;
                
                    if (filtroAperturas[i].concepto === aperturaProgramatica){             
                        nombre = filtroAperturas[i].nombre; // 
                        if(nombre.includes("Pasajes")){
                            listaUsuarioApertura.push({id:filtroAperturas[i].id, nombre:nombre!,id_usuario:item.props.usuarioId!, presupuesto: filtroAperturas[i].presupuesto})   
                        }                         
                    }         
                });
        }

            listaUsuarioApertura.sort((a, b) => (a.nombre>b.nombre ? 1 : 1));           		
            return Result.ok({ rows: listaUsuarioApertura, count: listaUsuarioApertura.length });
    }



}