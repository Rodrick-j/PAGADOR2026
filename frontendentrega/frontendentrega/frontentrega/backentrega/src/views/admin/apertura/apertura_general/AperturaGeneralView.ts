import { Result } from "../../../../base/types/Result";
import { eliminaRepetidosPorClave, findAndCountResult, formatearNumero } from "../../../../tools/util";
import  AperturaGeneralService  from "../../../../core/admin/apertura/apertura_general";
import  AreaService  from "../../../../core/rrhh/area";
import moment from "moment";
import ObjetoGastoService  from "../../../../core/admin/apertura/objeto_gasto";
import { ENUM_COMBUSTIBLE, ENUM_ENCARGADO_COMBUSTIBLE, ENUM_ENCARGADO_VIATICOS, ENUM_OBJETO_GASTO_VALE, ENUM_PASAJE_EX, ENUM_PASAJE_IN, ENUM_VIATICO_EX, ENUM_VIATICO_IN } from "../../../../base/constants/enum";
import { AuthUser } from "../../../../base/types/AuthUser";

type AperturaGeneralTableModel = {  
    id                             : string;
    /**Se agrega segun la relacion con la tabla */
    nombre_area: string;
    sigla_area:string; 
    /** Tabla original de la BDD*/
    ue                      : number;
    apertura_programatica   : string;
    cod_fte                 : number;
    cod_org                 : number;
    descripcion_objeto_gasto: string;
    presupuesto_inicial     : number;
    presupuesto_inicial_    : string;
    presupuesto_restante    : number;
    presupuesto_restante_   : string;
    estado                  : string;
    estado_activo           : boolean;
    sisin                   : string;
    gestion                 : string;
    mod_aprobada            : string;
    presupuesto_vigente     : string;
    pagado                  : string;
    saldo_ejecutar          : string;
    objeto_id               : string;
    tipo_area               : string;
    area_hijo_id            : string;
    nombre_area_hijo_id     : string;
    area_id                 : string;
};

export type GetAperturaGeneralsTableResponse = {
    rows: AperturaGeneralTableModel[];
    count: number;
};

export type AperturaGeneralFormDataResponse = {
    id: string;  
    apertura_programatica          : string;
    cod_fte                        : number;
    cod_org                        : number;
   
    descripcion_objeto_gasto       : string;   
    presupuesto_inicial            : number;
    presupuesto_restante           : number;
    estado                         : string;
    sisin                          : string;
    gestion                        : Date;
    tipo_area                  : string;
    area_hijo_id               : string;
    objeto_id                         : string;
    area_id                        : string;
    nombre_area_hijo_id : string;
    

     /**Se agrega segun la relacion con la tabla */
     nombre_area?: string;
     sigla_area?:string; 
     objeto_gasto?:string;
    // Campos adicionales

};

export type PresupuestoTableModel = {
    id                    : string;
    presupuesto_inicial   : number;
    presupuesto_restante   : number;
};

export type AperturaGeneralsOptionsFormModel = {
    id: string;
    nombre: string;
    concepto: string;
};

export type AperturaGeneralPropsResponse = {
    id                             : string;
    /**Se agrega segun la relacion con la tabla */
    nombre_area: string;
    sigla_area:string; 
    /** Tabla original de la BDD*/
    ue                      : number;
    apertura_programatica   : string;
    cod_fte                 : number;
    cod_org                 : number;
    descripcion_objeto_gasto: string;
    presupuesto_inicial     : number;
    presupuesto_restante    : number;
    estado                  : string;
    estado_activo           : boolean;
    sisin                   : string;
    gestion                 : string;
    mod_aprobada            : number;
    presupuesto_vigente     : number;
    pagado                  : number;
    saldo_ejecutar          : number;
    nombre_objeto           : string;
    objeto_id               : string;
    tipo_area               : string;
    area_hijo_id            : string;
    nombre_area_hijo_id     : string;
    area_id                 : string;
};

export class AperturaGeneralView {
    public async getAperturaGeneralsTable(authUser: AuthUser,query: any): Promise<Result<{ rows: AperturaGeneralTableModel[] }>> {
            const aperturaGeneral = await AperturaGeneralService.getAll();
            if (aperturaGeneral.isFailure) return Result.fail("Falló al obtener la AperturaGeneral");
            const aperturaGeneralResult = aperturaGeneral.getValue();
            
            /*Listado de areas*/
            const area = await AreaService.getAll();
            if(area.isFailure) return Result.fail("Fallo al obtener el Area");
            const areaResult = area.getValue();

            const objeto = await ObjetoGastoService.getAll();
            if(objeto.isFailure) return Result.fail("Fallo al obtener el Objeto Gasto");
            const objetoResult = objeto.getValue();
            
            
            const result: AperturaGeneralTableModel[] = aperturaGeneralResult.map((item) => {
               /**seleccionamos del listado de area el nombre del departamento y su sigla*/
               const areaNombre = areaResult.find((c) => c.id === item.props.areaId)?.props.nombre|| "-";               
               const nombreAreaHijo = areaResult.find((c) => c.id === item.props.areaHijoId)?.props.nombre|| "-";
              
               let areaSigla = '';
               if(nombreAreaHijo=== null || nombreAreaHijo === '-'){
                 areaSigla = areaResult.find((c) => c.id === item.props.areaId)?.props.sigla|| "-";
               }else{
                areaSigla = areaResult.find((c) => c.id === item.props.areaHijoId)?.props.sigla|| "-";				
               }             
               const objeto = objetoResult.find((c)=> c.id ===item.props.objetoId)?.props.objeto|| "-";              
               const descripcionObjeto = objetoResult.find((c)=> c.id ===item.props.objetoId)?.props.descripcionObjetoGasto|| "-";
            
               return {
                    id                             : String(item.id),
                    nombre_area                    : areaNombre,
                    sigla_area                     : areaSigla,       
                    ue                             : item.props.ue,              
                    apertura_programatica          : item.props.aperturaProgramatica,
                    cod_fte                        : item.props.codFte,
                    cod_org                        : item.props.codOrg,                 
                    descripcion_objeto_gasto       : descripcionObjeto,               
                    presupuesto_inicial_           : formatearNumero(item.props.presupuestoInicial,'en-US'),
                    presupuesto_inicial            : item.props.presupuestoInicial,
                    presupuesto_restante_          : formatearNumero(item.props.presupuestoRestante,'en-US'),
                    presupuesto_restante           : item.props.presupuestoRestante,
                    estado                         : item.props.estado,
                    estado_activo                  : item.props.estadoActivo,
                    sisin                          : item.props.sisin ||'-',
                    gestion                        : item.props.gestion?moment(item.props.gestion).format("YYYY").toString(): '',
                    mod_aprobada                   : formatearNumero(item.props.modAprobada,'en-US'),
                    presupuesto_vigente            : formatearNumero(item.props.presupuestoVigente,'en-US'),
                    pagado                         : formatearNumero(item.props.pagado,'en-US'),
                    saldo_ejecutar                 : formatearNumero(item.props.saldoEjecutar,'en-US'), 
                    tipo_area                      : item.props.tipoArea,
                    area_hijo_id                   : item.props.areaHijoId, 
                    nombre_area_hijo_id            : nombreAreaHijo,                          
                    objeto_id                      : objeto,
                    area_id                        : item.props.areaId, 
                
                };
            });
             //filtrado para roles especificos
             let listafiltradaPorUsuario : AperturaGeneralTableModel[]=[]; 
            // const usuarioId = authUser.uid;		
             
            if(authUser.roles === ENUM_ENCARGADO_VIATICOS){									
                listafiltradaPorUsuario = result.filter((a)=> a.objeto_id === ENUM_PASAJE_IN || a.objeto_id === ENUM_PASAJE_EX|| a.objeto_id === ENUM_VIATICO_IN|| a.objeto_id === ENUM_VIATICO_EX );  											
            }else if(authUser.roles === ENUM_ENCARGADO_COMBUSTIBLE){
                listafiltradaPorUsuario = result.filter((a)=> a.objeto_id === ENUM_COMBUSTIBLE);             
            }else{
                listafiltradaPorUsuario = result; 				
            }
            //const response = findAndCountResult(result, query);
             const response = findAndCountResult(listafiltradaPorUsuario, query);
            return Result.ok(response);
    }

    //Apertura General - API
    public async getAperturaGeneralApi(): Promise<Result<AperturaGeneralPropsResponse[]>> {
        
        const aperturaGeneral = await AperturaGeneralService.getAll();
        if (aperturaGeneral.isFailure) return Result.fail("Falló al obtener la AperturaGeneral");
        const aperturaGeneralResult = aperturaGeneral.getValue();
        
        /*Listado de areas*/
        const area = await AreaService.getAll();
        if(area.isFailure) return Result.fail("Fallo al obtener el Area");
        const areaResult = area.getValue();

        const objeto = await ObjetoGastoService.getAll();
        if(objeto.isFailure) return Result.fail("Fallo al obtener el Objeto Gasto");
        const objetoResult = objeto.getValue();

        const result: AperturaGeneralPropsResponse[] = aperturaGeneralResult.map((item) => {
            /**seleccionamos del listado de area el nombre del departamento y su sigla*/
            const areaNombre = areaResult.find((c) => c.id === item.props.areaId)?.props.nombre|| "-";               
            const nombreAreaHijo = areaResult.find((c) => c.id === item.props.areaHijoId)?.props.nombre|| "-";
           
            let areaSigla = '';
            if(nombreAreaHijo=== null || nombreAreaHijo === '-'){
              areaSigla = areaResult.find((c) => c.id === item.props.areaId)?.props.sigla|| "-";
            }else{
             areaSigla = areaResult.find((c) => c.id === item.props.areaHijoId)?.props.sigla|| "-";				
            }             
            const objeto = objetoResult.find((c)=> c.id ===item.props.objetoId)?.props.objeto|| "-";              
            const descripcionObjeto = objetoResult.find((c)=> c.id ===item.props.objetoId)?.props.descripcionObjetoGasto|| "-";
         
            return {
                 id                             : String(item.id),
                 nombre_area                    : areaNombre,
                 sigla_area                     : areaSigla,       
                 ue                             : item.props.ue,              
                 apertura_programatica          : item.props.aperturaProgramatica,
                 cod_fte                        : item.props.codFte,
                 cod_org                        : item.props.codOrg,                 
                 descripcion_objeto_gasto       : descripcionObjeto,               
                 presupuesto_inicial            : item.props.presupuestoInicial,
                 presupuesto_restante           : item.props.presupuestoRestante,
                 estado                         : item.props.estado,
                 estado_activo                  :item.props.estadoActivo,
                 sisin                          : item.props.sisin ||'-',
                 gestion                        : item.props.gestion?moment(item.props.gestion).format("YYYY").toString(): '',
                 mod_aprobada                   : item.props.modAprobada,
                 presupuesto_vigente            : item.props.presupuestoVigente,
                 pagado                         : item.props.pagado,
                 saldo_ejecutar                 : item.props.saldoEjecutar, 
                 tipo_area                      : item.props.tipoArea,
                 area_hijo_id                   : item.props.areaHijoId, 
                 nombre_area_hijo_id            : nombreAreaHijo,                          
                 nombre_objeto                  : objeto,                          
                 objeto_id                      : item.props.objetoId,
                 area_id                        : item.props.areaId, 
             
             };
         });         
        
        return Result.ok<AperturaGeneralPropsResponse[]>(result);
    }

    public async getAperturaGeneralFormDataView(id_apertura_General: string): Promise<Result<AperturaGeneralFormDataResponse>> {
        const aperturaGeneral = await AperturaGeneralService.getById(id_apertura_General);
        if (aperturaGeneral.isFailure) return Result.fail<AperturaGeneralFormDataResponse>("AperturaGeneral no encontrado");
        const props = aperturaGeneral.getValue().props;

       /*Listado de areas*/
       const area = await AreaService.getAll();
       if(area.isFailure) return Result.fail("Fallo al obtener el Area");
       const areaResult = area.getValue();

       const objetoGasto = await ObjetoGastoService.getAll();
       if(objetoGasto.isFailure) return Result.fail("Fallo al obtener el Objeto Gasto");
       const objetoResult = objetoGasto.getValue();
       
       const areaNombre = areaResult.find((c) => c.id === props.areaId)?.props.nombre|| "-"; 
       //const areaSigla = areaResult.find((c) => c.id === props.areaId)?.props.sigla|| "-";

       const objeto = objetoResult.find((c)=> c.id ===props.objetoId)?.props.objeto|| "-";       
       const descripcionObjeto = objetoResult.find((c)=> c.id ===props.objetoId)?.props.descripcionObjetoGasto|| "-";
           
       const nombreAreaHijo = areaResult.find((c) => c.id === props.areaHijoId)?.props.nombre|| "-";
       let areaSigla = '';
       if(props.areaHijoId.length <= 0){        
         areaSigla = areaResult.find((c) => c.id === props.areaId)?.props.sigla|| "-";
       }else{
        areaSigla = areaResult.find((c) => c.id === props.areaHijoId)?.props.sigla|| "-";		
       }
     
        const result: AperturaGeneralFormDataResponse = {
                    id                             : aperturaGeneral.getValue().id,
                    apertura_programatica          : props.aperturaProgramatica,
                    cod_fte                        : props.codFte,
                    cod_org                        : props.codOrg,                  
                    descripcion_objeto_gasto       : descripcionObjeto,                 
                    presupuesto_inicial            : props.presupuestoInicial,
                    presupuesto_restante           : props.presupuestoRestante,
                    estado                         : props.estado,
                    sisin                          : props.sisin,
                    gestion                        : props.gestion,
                    area_id                        : props.areaId || "", 
                    sigla_area                     : areaSigla,
                    nombre_area                    : areaNombre,
                    objeto_gasto                   : objeto, 
                    objeto_id                      : props.objetoId,
                    tipo_area                      : props.tipoArea,
                    area_hijo_id                   : props.areaHijoId,  
                    nombre_area_hijo_id            : nombreAreaHijo,           
                                
        };

        return Result.ok(result);
    }

     // se aumenta el metodo get all para la busqueda de apertura 
     public async getAllAperturaGeneral(): Promise<Result<{ rows: AperturaGeneralsOptionsFormModel[]; count: number }>> {
        const apertura = await AperturaGeneralService.getAll();
        if(apertura.isFailure) return Result.fail("Fallo al obtener el Apertura");
        const aperturaResult = apertura.getValue();
        
        const objeto = await ObjetoGastoService.getAll();
        if(objeto.isFailure) return Result.fail("Fallo al obtener el objeto");
        const objetoResult = objeto.getValue();
        
        const area = await AreaService.getAll();
        if(area.isFailure) return Result.fail("Fallo al obtener el area");
        const areaResult = area.getValue();
     
        const result: AperturaGeneralsOptionsFormModel[] = aperturaResult
            .map((item) => {
                const nombreObjeto = objetoResult.find((o) => o.id === item.props.objetoId)?.props.descripcionObjetoGasto || "";     
                const seleccion = ('AP: ').concat(item.props.aperturaProgramatica)
                                                .concat(' | ').concat(String(item.props.codFte))
                                                .concat(' | ').concat(String(item.props.codOrg))
                                                .concat(' | ').concat(String(nombreObjeto));
                const areaNombre = areaResult.find((a) => a.id === item.props.areaId)?.props.nombre || "";
                const area = areaNombre;
                return {
                    id: item.id.toString(),
                    nombre: area,
                    concepto: seleccion,
                };
            })
            .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));
        return Result.ok({ rows: result, count: result.length });
    }

    public async getAllAperturaGeneral2(): Promise<Result<{ rows: AperturaGeneralsOptionsFormModel[]; count: number }>> {
        const apertura = await AperturaGeneralService.getAll();
        if(apertura.isFailure) return Result.fail("Fallo al obtener el Apertura");
        const aperturaResult = apertura.getValue();
        
        const area = await AreaService.getAll();
        if(area.isFailure) return Result.fail("Fallo al obtener el Apertura");
        const areaResult = area.getValue();
        const result: AperturaGeneralsOptionsFormModel[] = eliminaRepetidosPorClave(
                                                                        aperturaResult
                                                                        .filter((a) => a.props.tipoArea==='PRINCIPAL')
                                                                        .map((item) => {   
                                                                            const nombreArea = areaResult.find((a) => a.id === item.props.areaId)?.props.nombre || "";             
                                                                            return {
                                                                                id: item.id.toString(),
                                                                                nombre: nombreArea,
                                                                                concepto: item.props.aperturaProgramatica,
                                                                            };
                                                                        })
                                                            , "nombre");
        return Result.ok({ rows: result, count: result.length });
    }

    public async getAllAperturaGeneralVale(): Promise<Result<{ rows: AperturaGeneralsOptionsFormModel[]; count: number }>> {
        const apertura = await AperturaGeneralService.getAll();
        if(apertura.isFailure) return Result.fail("Fallo al obtener el Apertura");
        const aperturaResult = apertura.getValue().filter((a) => a.props.estadoActivo);
        
        const objeto = await ObjetoGastoService.getAll();
        if(objeto.isFailure) return Result.fail("Fallo al obtener el objeto");
        const objetoResult = objeto.getValue().find((o) => o.props.objeto === ENUM_OBJETO_GASTO_VALE);
        if(!objetoResult) return Result.fail("Fallo al obtener el objeto");

        const nombreObjeto = objetoResult.props.descripcionObjetoGasto;
        const objetoId = objetoResult.id;

        const area = await AreaService.getAll();
        if(area.isFailure) return Result.fail("Fallo al obtener el area");
        const areaResult = area.getValue();
        
        const result: AperturaGeneralsOptionsFormModel[] = aperturaResult
            .filter((a) => a.props.objetoId === objetoId)
            .map((item) => {
                const seleccion = ('AP: ').concat(item.props.aperturaProgramatica)
                                                .concat(' | ').concat(String(item.props.codFte))
                                                .concat(' | ').concat(String(item.props.codOrg))
                                                .concat(' | ').concat(String(nombreObjeto));
                const areaNombre = areaResult.find((a) => a.id === item.props.areaId)?.props.nombre || "";
                const areaHijo = areaResult.find((a) => a.id === item.props.areaHijoId)?.props.nombre || null;
                let area = areaNombre;
                if(areaHijo)  area = areaHijo +" ::: "+ areaNombre;

                return {
                    id: item.id.toString(),
                    nombre: area,
                    concepto: seleccion,
                };
            })
            .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));
        return Result.ok({ rows: result, count: result.length });
    }

//Se envia
public async getPresupuesto(apertura_id: string): Promise<Result<PresupuestoTableModel>> {
    /* listado de actividades */
    const aperturaPresupuesto = await AperturaGeneralService.getById(apertura_id);
    if (aperturaPresupuesto.isFailure) return Result.fail('Falló al obtener la Apertura Presupuesto');  
    const resultPresupuesto = aperturaPresupuesto.getValue(); 

       // Se realiza la sumatoria del campo pasajes 
       const result: PresupuestoTableModel= {        
        id                     : apertura_id,  
        presupuesto_inicial     : resultPresupuesto.props.presupuestoInicial,
        presupuesto_restante    : resultPresupuesto.props.presupuestoRestante,
        
    };     
    return Result.ok(result);
}



}