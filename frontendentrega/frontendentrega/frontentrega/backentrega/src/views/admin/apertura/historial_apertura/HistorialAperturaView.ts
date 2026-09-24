import { Result } from "../../../../base/types/Result";
import { findAndCountResult } from "../../../../tools/util";
//import  HistorialAperturaService  from "../../../../core/admin/apertura/historial_apertura;
import  AreaService  from "../../../../core/rrhh/area";
import moment from "moment";
import  ObjetoGastoService  from "../../../../core/admin/apertura/objeto_gasto";
import HistorialAperturaService from "../../../../core/admin/apertura/historial_apertura";
import AperturaGeneralService from "../../../../core/admin/apertura/apertura_general";
import HistorialGastoService  from "../../../../core/admin/apertura/historial_gasto";
import { AuthUser } from "../../../../base/types/AuthUser";
import  UsuarioService  from "../../../../core/system/autenticacion/usuario";

type HistorialAperturaTableModel = {  
    id                             : string;
    /**Se agrega segun la relacion con la tabla */
    nombre_area                   : string;
    sigla_area?                   :string; 
    /** Tabla original de la BDD*/   
    apertura_programatica        : string;
    cod_fte                       : number;
    cod_org                       : number;
   
    descripcion_objeto_gasto      : string;   
    presupuesto_inicial           : number;
    presupuesto_restante          : number;
    estado                         : string;
    sisin                          : string;
    area_id                        : string;
    objeto_id                        : string;

   
};

type HistorialAperturaDetalleTableModel = {     

    id                            : string; 
    titulo                        : string;
    descripcion                   : string;
    gasto                         : number;
    debe_haber                    : string;
    estado                        : string;
    fecha                         : Date;
    fecha_format?                  : string;
    apertura_id                    : string;

    apertura_programatica?         : string;
    descripcion_apertura?          : string;
    saldo?                         : number; 
};

export type GetHistorialAperturasTableResponse = {
    rows: HistorialAperturaDetalleTableModel[];
    count: number;
};

export type HistorialAperturaFormDataResponse = {
    id: string;  
    apertura_programatica          : string;
    cod_fte                        : number;
    cod_org                        : number;
  
   // descripcion_objeto_gasto       : string;   
    presupuesto_inicial            : number;
    presupuesto_restante           : number;
    estado                         : string;
    sisin                          : string;
    gestion                        : Date;
    area_id                        : string;
    objeto_id                      : string;
    // Campos adicionales

};

type HistorialGastoTableModel = {     
    index                         :number;
    id                            : string; 
    fecha                         : Date;
    fecha_format?                 : string;
    descripcion                   : string;
    debe                          : number;
    haber                         : number;
    saldo                         : number;
	estado                        : string;
    historial_apertura_id         : string;
    apertura_id                   : string;	
};

export type GetHistorialGastoTableModel = {
    rows: HistorialGastoTableModel[];
    count: number;
};


export type HistorialAperturasOptionsFormModel = {
    id: string;
    nombre: string;
    concepto: string;
};

export type ReporteAperturaGeneralTableModel = {
   // id: string;
    ue?                             : number;
    nombre_area?                    : string;
    sigla_area?                     : string;        
    apertura_programatica?          : string;
    cod_fte?                        : number;
    cod_org?                        : number;
   
    descripcion_objeto_gasto?       : string;    
    presupuesto_inicial?            : number;
    presupuesto_restante?           : number;
    mod_aprobada?                   : number;
    presupuesto_vigente?            : number;
    pagado?                         : number;
    saldo_ejecutar?                 : number;
    estado?                         : string;
    sisin?                          : string;
    gestion?                        : string;
    areaId?                         : string; 
    estado_activo?                  : boolean;
    fecha_reporte?                  : string;
    objeto_id?                         : string;
    tipo_area? : string;
    area_hijo_id? : string;
    nombre_usuario? :string;
    codigoQR?                       : string;
};

export type HistorialAperturaItem = {
    id                       : string;
    //Detalle
    titulo                   : string;
    descripcion              : string;
    gasto                    : number;
    estado_detalle?          : string;
    fecha                    : Date;
    fecha_format?            : string;
    aperturaId               : string; 
    //gasto  
    debe?                    : number;
    haber?                   : number;
    saldo?                   : number;
};

export type AperturaReporte = {
    //tasks: any;
    //lineas: lineaTemporalItem[];
    rows  : HistorialAperturaItem[];
    
};


export type AperturaData = {
    info: ReporteAperturaGeneralTableModel;
    data: AperturaReporte;
};


export class HistorialAperturaView {
    public async getHistorialAperturasTable(query: any): Promise<Result<{ rows: HistorialAperturaTableModel[] }>> {
            const aperturaGeneral = await AperturaGeneralService.getAll();
            if (aperturaGeneral.isFailure) return Result.fail("Falló al obtener la HistorialApertura");
            const aperturaGeneralResult = aperturaGeneral.getValue();
            
            /*Listado de areas*/
            const area = await AreaService.getAll();
            if(area.isFailure) return Result.fail("Fallo al obtener el Area");
            const areaResult = area.getValue();
            /*Listado de Objetos */
            const objeto = await ObjetoGastoService.getAll();
            if(objeto.isFailure) return Result.fail("Fallo al obtener el Objeto Gasto");
            const objetoResult = objeto.getValue();
            
            const result: HistorialAperturaTableModel[] = aperturaGeneralResult.map((item) => {
               /**seleccionamos del listado de area el nombre del departamento y su sigla*/
               const areaNombre = areaResult.find((c) => c.id === item.props.areaId)?.props.nombre|| "-";
               const areaSigla = areaResult.find((c) => c.id === item.props.areaId)?.props.sigla|| "-";
               const objeto = objetoResult.find((c)=> c.id ===item.props.objetoId)?.props.objeto|| "-";
               const descripcionObjeto = objetoResult.find((c)=> c.id ===item.props.objetoId)?.props.descripcionObjetoGasto|| "-";
               
               return {
                    id                             : String(item.id),
                    nombre_area                    : areaNombre,
                    sigla_area                     : areaSigla,                         
                    apertura_programatica          : item.props.aperturaProgramatica,
                    cod_fte                        : item.props.codFte,
                    cod_org                        : item.props.codOrg,                   
                    descripcion_objeto_gasto       : descripcionObjeto,                  
                    presupuesto_inicial            : item.props.presupuestoInicial,
                    presupuesto_restante           : item.props.presupuestoRestante,
                    estado                         : item.props.estado,
                    sisin                          : item.props.sisin ||'-',
                    gestion                        : item.props.gestion?moment(item.props.gestion).format("YYYY").toString(): '',                                
                    area_id                        : item.props.areaId, 
                    objeto_id                      : objeto,
                
                };
            });
            
            const response = findAndCountResult(result, query);
            return Result.ok(response);
    }

    public async getHistorialAperturaFormDataView(id_apertura_General: string): Promise<Result<HistorialAperturaFormDataResponse>> {
        const aperturaGeneral = await AperturaGeneralService.getById(id_apertura_General);
        if (aperturaGeneral.isFailure) return Result.fail<HistorialAperturaFormDataResponse>("HistorialApertura no encontrado");
        
        const props = aperturaGeneral.getValue().props;

        const result: HistorialAperturaFormDataResponse = {
                    id                             : aperturaGeneral.getValue().id,
                    apertura_programatica          : props.aperturaProgramatica,
                    cod_fte                        : props.codFte,
                    cod_org                        : props.codOrg,                  
                  //  descripcion_objeto_gasto       : props.descripcionObjetoGasto,                 
                    presupuesto_inicial            : props.presupuestoInicial,
                    presupuesto_restante           : props.presupuestoRestante,
                    estado                         : props.estado,
                    sisin                          : props.sisin,
                    gestion                        : props.gestion,
                    area_id                        : props.areaId || "",
                    objeto_id                         : props.objetoId || "", 
        };

        return Result.ok(result);
    }

     // se aumenta el metodo get all para la busqueda de apertura 
     public async getAllHistorialApertura(): Promise<Result<{ rows: HistorialAperturasOptionsFormModel[]; count: number }>> {
        const apertura = await AperturaGeneralService.getAll();      
     
        const listaAperturas: HistorialAperturasOptionsFormModel[] = apertura
            .getValue()
            .map((item) => {     //Que llenen los valores de apertura programatica y sisin al mismo tiempo
                const seleccion = ('Apertura: ').concat(item.props.aperturaProgramatica)
                .concat(' -  FTE: ').concat(String(item.props.codFte))
                .concat(' -  CodOrg: ').concat(String(item.props.codOrg));
                return {
                    id: item.id.toString(),
                    nombre: seleccion,
                    concepto: item.props.estado,
                };
            })
            .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));

             // filtramos por el tipo de nombre es decir eliminara repetidos
             const elementosUnicos = new Map(listaAperturas.map(item => [item.nombre, item]));          
             // Asigna el resultado al filtro
            const result: HistorialAperturasOptionsFormModel[] = Array.from(elementosUnicos.values());

        return Result.ok({ rows: result, count: result.length });
    }

    public async getTableHistorialAperturaDetalle(query: any): Promise<Result<GetHistorialAperturasTableResponse>> { 

        const ID_APERTURA = query.apertura_id || "";

        const historialDetalle = await HistorialAperturaService.getAll();
        if (historialDetalle.isFailure) return Result.fail("Falló al obtener la Historial Detalle");
        const historialDetalleResult = historialDetalle.getValue().filter((d) => d.props.aperturaId === ID_APERTURA);
		
        let INDEX_ = 0;
        const result: HistorialAperturaDetalleTableModel[] = historialDetalleResult.map((item) => {
			
            if(!item.props.titulo.includes('INICIAL')) INDEX_ +=1; else INDEX_=0;
            return {
                index: INDEX_,
                id         : String(item.id),           
                titulo     : item.props.titulo,
                descripcion: item.props.descripcion,
                gasto      : item.props.gasto,
                debe_haber :item.props.debeHaber,
                estado     : item.props.estado,
                fecha      : item.props.fecha,
                fecha_format: item.props.fecha?moment(item.props.fecha).format("DD/MM/YYYY HH:mm").toString(): '',
                apertura_id  : item.props.aperturaId,
            };
        }).sort((a, b) => a.fecha > b.fecha ? 1 : -1);
      
        const response = findAndCountResult(result, query);			
        return Result.ok(response);
    }

    
    public async getHistorialAperturaDetalleFormData(historial_apertura_id: string): Promise<Result<HistorialAperturaDetalleTableModel>> {
        const historialApertura = await HistorialAperturaService.getById(historial_apertura_id);
        if (historialApertura.isFailure) {
            return Result.fail<HistorialAperturaDetalleTableModel>("Historial Apertura  no encontrado");
        }

        // Busqueda de apertura general
         const aperturaGeneral = await AperturaGeneralService.getById(historialApertura.getValue().props.aperturaId);
        if (aperturaGeneral.isFailure) return Result.fail("Falló al obtener la HistorialApertura del ID");
        const aperturaGeneralResult = aperturaGeneral.getValue();		
        const objetoGastoID = aperturaGeneralResult.props.objetoId;
         
        const objeto = await ObjetoGastoService.getById(objetoGastoID);
        if(objeto.isFailure) return Result.fail("Fallo al obtener el Objeto Gasto");
        const objetoResult = objeto.getValue();
        
        const objetoDescripcion = objetoResult.props.descripcionObjetoGasto;

        const props = historialApertura.getValue().props;
        const result: HistorialAperturaDetalleTableModel = {
            id: historialApertura.getValue().id,           
            titulo           : props.titulo,
            descripcion      : props.descripcion,
            gasto            : props.gasto,
            debe_haber       : props.debeHaber,
            estado           : props.estado,
            fecha            : props.fecha,
            fecha_format     : props.fecha?moment(props.fecha).format("DD/MM/YYYY HH:mm").toString(): '',
            apertura_id      : props.aperturaId,
            apertura_programatica : aperturaGeneralResult.props.aperturaProgramatica,
            descripcion_apertura  : objetoDescripcion,
            saldo            : aperturaGeneralResult.props.presupuestoRestante,
        };

        return Result.ok(result);
    }


    public async getTableHistorialGasto(query: any): Promise<Result<GetHistorialGastoTableModel>> {
            
        const ID_APERTURA = query.apertura_id || ""; 		

        const historial = await HistorialGastoService.getAll();
        if (historial.isFailure) return Result.fail("Falló al obtener la historial");
        const historialResult = historial.getValue().filter((h) => h.props.aperturaId === ID_APERTURA);	

        let INDEX_ = 0;
        const result: HistorialGastoTableModel[] = historialResult.map((item) => {
         //   const debe = item.props.debe?formatearNumero(item.props.debe,'en-US'):"0";
         //   const haber = item.props.haber?formatearNumero(item.props.haber,'en-US'):"0";
         //   const saldo = item.props.saldo?formatearNumero(item.props.saldo,'en-US'):"0";
            if(!item.props.descripcion.includes('INICIAL')) INDEX_ +=1; else INDEX_=0;
            return {
                index: INDEX_,
                id                : String(item.id),
                fecha             : item.props.fecha,
                fecha_format      : item.props.fecha?moment(item.props.fecha).format("DD/MM/YYYY HH:mm").toString(): '',
                descripcion       : item.props.descripcion,
                debe              : item.props.debe,
                haber             : item.props.haber,
                saldo             : item.props.saldo,
                estado            : item.props.estado,
                historial_apertura_id   : item.props.historialAperturaId,
                apertura_id       : item.props.aperturaId,
            };
        }).sort((a, b) => a.fecha > b.fecha ? 1 : -1);       

        const response = findAndCountResult(result);        
	
        return Result.ok(response);
    }


    //impresion
public async getHistorialAperturaPDFReporte(authUser: AuthUser, params: string): Promise<Result<any>> {    
    // const ID_USUARIO = authUser.uid;
     const ID_APERTURA = params;           
     
     const apertura = await AperturaGeneralService.getById(ID_APERTURA)
     if (apertura.isFailure) return Result.fail<ReporteAperturaGeneralTableModel>("Falló al obtener la Apertura General");
     const props = apertura.getValue().props;
     
    /*Listado de areas*/
     const area = await AreaService.getAll();
     if(area.isFailure) return Result.fail("Fallo al obtener el Area");
     const areaResult = area.getValue();

     /*Listado de objetos*/
     const objeto = await ObjetoGastoService.getAll();
     if(objeto.isFailure) return Result.fail("Fallo al obtener el Objeto Gasto");
     const objetoResult = objeto.getValue();

    /*Listado de objetos*/
    const historialApertura = await HistorialAperturaService.getAll();
     if(historialApertura.isFailure) return Result.fail("Fallo al obtener el Historial Apertura");
     /* const historialAperturaResult = historialApertura.getValue();*/

     /*Listado de objetos*/
     const historialGasto = await HistorialGastoService.getAll();
     if(historialGasto.isFailure) return Result.fail("Fallo al obtener el Historial Gasto");
     const historialGastoResult = historialGasto.getValue();

    
     //seleccionamos del listado de area el nombre del departamento y su sigla
     const areaNombre = areaResult.find((c) => c.id === props.areaId)?.props.nombre|| "-";//Revisar
     const areaNombreHijo = areaResult.find((c) => c.id === props.areaHijoId)?.props.nombre|| "-";//Revisar
    // const areaSigla = areaResult.find((c) => c.id === props.areaId)?.props.sigla|| "-";

     //seleccionamos del listado de objetos el nombre del objeto y su descripcion
     const objetoNombre = objetoResult.find((c) => c.id === props.objetoId)?.props.objeto|| "-";
     
     const objetoDescripcion = objetoResult.find((c) => c.id === props.objetoId)?.props.descripcionObjetoGasto|| "-";
     
     //recupera datos para mostrar en la tabla del modulo
     
     const listaHistorialDetalle: HistorialAperturaItem [] = historialApertura
     .getValue()
     .map((item) => {                   
        const debe = historialGastoResult.find((c) => c.props.historialAperturaId === item.id)?.props.debe|| 0 ;
        const haber = historialGastoResult.find((c) => c.props.historialAperturaId === item.id)?.props.haber|| 0 ;
        const saldo = historialGastoResult.find((c) => c.props.historialAperturaId === item.id)?.props.saldo|| 0 ;
         return {
             
             id: item.id.toString(),
            
             titulo                   : item.props.titulo,
             descripcion              : item.props.descripcion,
             gasto                    : item.props.gasto,
             estado_detalle          : item.props.estado,
             fecha                    : item.props.fecha,
             aperturaId               : item.props.aperturaId,
             //gasto  
             debe                    : debe,
             haber                  : haber,
             saldo                   : saldo,
         };
     }) ; 

     const filtroHistorialDetalle : HistorialAperturaItem [] = listaHistorialDetalle
     .filter((item) => this.filtrarId(item.aperturaId, ID_APERTURA));
        
     let areaSigla = '';
     
     if(props.areaHijoId === null){
       areaSigla = areaResult.find((c) => c.id === props.areaId)?.props.sigla|| "-";
     }else{
      areaSigla = areaResult.find((c) => c.id === props.areaHijoId)?.props.sigla|| "-";
     }
      /*Listado de areas*/
     const usuario = await UsuarioService.getAll();
     if(usuario.isFailure) return Result.fail("Fallo al obtener el usuario");
     const usuariolResult = usuario.getValue(); 
    
     const nombre_usuario = usuariolResult.find((c)=> c.id=== authUser.uid)?.getNombreCompleto() || "-" ;

     const result: AperturaData = {
         info: {
            ue                             : props.ue,
            nombre_area                    : areaNombre,
            sigla_area                     : areaSigla,        
            apertura_programatica          : props.aperturaProgramatica,
            cod_fte                        : props.codFte,
            cod_org                        : props.codOrg,          
            descripcion_objeto_gasto       : objetoDescripcion,
            presupuesto_inicial            : props.presupuestoInicial,
            presupuesto_restante           : props.presupuestoRestante,
            mod_aprobada                   : props.modAprobada,
            presupuesto_vigente            : props.presupuestoVigente,
            pagado                         : props.pagado,
            saldo_ejecutar                 : props.saldoEjecutar,
            estado                         : props.estado,
            sisin                          : props.sisin,
            gestion                        : props.gestion?moment(props.gestion).format("YYYY").toString(): '',
            estado_activo                  : props.estadoActivo,
            fecha_reporte                  : new Date()?moment(new Date()).format("DD/MM/YYYY").toString(): '',  
            objeto_id                      : objetoNombre,  
            area_hijo_id                   : areaNombreHijo,  
            nombre_usuario                 : nombre_usuario,      
                                    
          
             codigoQR    : `${areaNombre}-       
             ${areaSigla}-        
             ${props.ue}-   
             ${props.aperturaProgramatica}-     
             ${props.codFte}-    
             ${props.codOrg}-       
             ${props.objetoId}-           
             ${props.presupuestoInicial}-      
             ${props.presupuestoRestante}-         
             ${props.sisin}-    
             ${props.gestion}-                      
             ${props.areaId}-
             ${props.areaHijoId}-
             ${props.tipoArea}`,
            // email     : usuarioResult.email,
            
         },
         data: {
                         rows:   filtroHistorialDetalle.map((item)=> {
                             //const responsable = apertura.getValue().find((p) => p.props.usuarioId === item.props.aperturaId);
                            
                             const debe = historialGastoResult.find((c) => c.props.historialAperturaId === item.id)?.props.debe|| 0 ;
                             const haber = historialGastoResult.find((c) => c.props.historialAperturaId === item.id)?.props.haber|| 0 ;
                             const saldo = historialGastoResult.find((c) => c.props.historialAperturaId === item.id)?.props.saldo|| 0 ;
                            // const codigoMemo = aperturaResult.find((c) => c.id === item.props.aperturaId)?.props.codDepartMemo|| "-";
                             return {
                                 id                       : String(item.id),                              
            
                                 titulo                   : item.titulo,
                                 descripcion              : item.descripcion,
                                 gasto                    : item.gasto,
                                 estado_detalle           : item.estado_detalle,
                                 fecha                    : item.fecha,   
                                 fecha_format             : item.fecha?moment(item.fecha).format("DD/MM/YYYY HH:mm:ss").toString(): '',
                                 aperturaId               : item.aperturaId,
                                 //gasto  
                                 debe                     : debe,
                                 haber                    : haber,
                                 saldo                    : saldo,
                            }
                     
                 }).sort((a, b) => a.fecha > b.fecha ? 1 : -1),
         },
     } 
     return Result.ok(result);
 }
 
//filtramos por el tipo de id 
    public filtrarId(item:string, id:string) { 
        return (item === id); 
    } 

}