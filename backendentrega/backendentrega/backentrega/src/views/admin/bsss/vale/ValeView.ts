import { Result } from "../../../../base/types/Result";
import { findAndCountResult, formatearNumero, numberToString, queryStringToArray } from "../../../../tools/util";


import AreaService from "../../../../core/rrhh/area";
import VehiculoService from "../../../../core/admin/bsss/vehiculo";
import PersonalService from "../../../../core/rrhh/personal";
import CargoService from "../../../../core/rrhh/cargo";
import ValeService from "../../../../core/admin/bsss/vale";
import UsuarioService from "../../../../core/system/autenticacion/usuario";
import DestinoService from "../../../../core/admin/bsss/destino";
import RoleService from "../../../../core/system/autenticacion/role";
import AsignacionService from "../../../../core/admin/bsss/asignacion";
import AperturaGeneralService from "../../../../core/admin/apertura/apertura_general";
import { AuthUser } from "../../../../base/types/AuthUser";
import moment from "moment";
import { ENUM_EJECUTADO, ENUM_GENERAL, ENUM_REPORTE_FINAL, ENUM_REPORTE_POR_APERTURA, ENUM_REPORTE_POR_PROYECTO, ENUM_REPORTE_POR_TIPO, ENUM_TECNICO_COMPLETO, ENUM_TECNICO_VALE_VIATICOS } from "../../../../base/constants/enum";
import { Column } from "exceljs";

export type ReportFilters = {
    tipo        ?: string;
    nombre      ?: string;
    telefono    ?: string;
    direccion   ?: string;

    _limit?: string;
    _page?: string;
    q?: string;
};

export type VehiculoAperturaResponse = {
    nombre       : string,
    placa        : string,
    area         : string,
    asignacion   : string,
    inicial      : string,
    restante     : string,
    vehiculo_id  : string,
    asignacion_id: string,
};

export type ValeTableModel = {
    id?             : string;
    cod_vale        : string;
    litros          : string;
    observaciones   : string;
    fecha_emision   : string;
    fecha_validez   : string;
    concepto        : string;
    distancia       : string;
    precio_unitario : string;
    precio_total    : string;
    destino         : string;
    destinos        : string;
    otro_vehiculo   : string;
    num_apertura    : string;
    placa           : string;
    estado          : string;
    gestion         : string;
    numero_recibo?  : number;
    tipo            : string;
    combustible     : string;
    usuario_nombre? : string;
    area?           : string;     

    litros_reales?  : number;
    precio_real?    : number;
    numero_factura? : number;
    fecha_factura?  : string;
    estado_ejecutado?: string,
    nombre_chofer?   : string,
    contrato?        : string,

    total_litros_reales?   : number;
    total_precio_real?     : number;   
    apertura_programatica? : string
    pre_asignacion?  : number; 
//Reporte final
   
};

export type ValeFormDataResponse = {
    id              : string;
    cod_vale        : string;
    fecha_emision   : Date;
    fecha_validez   : Date;
    litros          : number;
    concepto        : string;
    distancia       : number;
    precio_unitario : number;
    precio_total    : number;
    observaciones   : string;
    destino         : string;
    destinos        : string;
    otro_vehiculo   : boolean;
    usuario_id?     : string | null;
    vehiculo_id?    : string | null;
    asignacion_id?  : string | null;


    placa?           : string;
    tipo?            : string;
    combustible?     : string;
    usuario_nombre?  : string;
    area?            : string;   
    num_apertura?    : string;
    numero_recibo?   : number; 
    litros_reales?   : number;
    precio_real?     : number;
    numero_factura?  : number;
    fecha_factura?   : Date;
    estado_ejecutado?: string,
    apertura_nombre? : string,
    vehiculo_nombre? : string,
    destino_nombre?  : string,
    pre_asignacion?  : number,
};

export type ValeOptionsFormModel = {
    id: string;
    nombre: string;
};

export type InfoReporteModel = {
    gestion      : string;
    codigo       : string;
    nombre       : string;
    cargo        : string;
    fecha        : string;
    is_superadmin: boolean;
};

export type ValeReporteItem = {
    id         : string;
    cod_vale   : string;
    apertura   : string;
    fecha_carga: string;
    destino    : string;
    placa      : string;
    combustible: string;
    litros     : string;
    precio     : string;
    observacion: string;
};

export type ReporteData = {
    rows: ValeReporteItem[];
};

export type ReporteDataResponse = {
    info?: InfoReporteModel;
    cuentas?: ReporteData;
};
// Reporte General
export type ReporteValeDataResponse = {
    info?: InfoReporteValeModel;
    data?: ReporteValeDataR;
};

export type InfoReporteValeModel = {
    codigo    : string;
    nombre    : string;
    fecha     : string;
    email     : string;
    codigoQR?  : string;
};
export type ReporteValeDataR = {
    tipo_reporte            : string;
    lista_areas             : AreaFormModel[];
 //   lista_ffof     : string[]; 
    idApertura              : ReporteValeItem[];
    rows                    : ReporteValeItem[];
    fecha_inicio?    : string;
    fecha_fin?       : string;
    tipo_fecha?      : number;
    semestre?        : string;
    gestion?         : string;
    mes?             : string;
    reporte_final?   : ReportFinalSalida[];
};

export type ReporteValeItem = { //cambiar
    id                     : string;
    /** Se agregan tablas de conexion con memorandum */
    usuario_nombre         : string;   
    usuario_area?          : string;
    ci?                    : string;
    tipo_usuario?          : string;
    num_placa?             : string;
    fecha_emision_date?     : Date;

    /**Tabla original de la BDD */
   
    cod_vale            : string;
    litros              : string;
    observaciones       : string;
    fecha_emision       : string;
    fecha_validez       : string;
    concepto            : string;
    distancia           : string;
    precio_unitario     : string;
    precio_total        : string;
    destino             : string;
    destinos            : string;
    otro_vehiculo       : string;
    num_apertura        : string;
    placa               : string;
    estado              : string;
    gestion             : string;
    numero_recibo?      : number;
    tipo                : string;
    combustible         : string;

    litros_reales?      : number;
    precio_real?        : number;
    numero_factura?     : number;
    fecha_factura?      : string;
    estado_ejecutado?   : string,

    area?           : string; 
    area_id?        : string;
    apertura_id?    : string;
   
   //      
    sigla?          : string;  
    fecha_inicio?   : string;
    fecha_fin?      : string;             
    semestre?       : string;
    tipo_fecha?     : number;
    mes?            : string;

    contrato?       : string;
    nombre_chofer?  : string;
};
export type AreaFormModel = {
    id                      : string;
    nombre                  : string;
    partida_presupuestaria? : string;
    sigla?                  : string;
    total_litros?           : number;
    total_precio?            : number;
};

export type ReportGeneral = {
    numero?                  : number,
     id ?                    : string;
    /** Se agregan tablas de conexion con memorandum */
    usuario_nombre ?         : string;   
    usuario_area?            : string;
    ci?                      : string;
    tipo_usuario?            : string;
    num_placa?               : string;
    fecha_emision_date?      : Date;

    /**Tabla original de la BDD */
   
    cod_vale?                 : string;
    litros?                   : number;
    observaciones?            : string;
    fecha_emision?           : string;
    fecha_validez ?          : string;
    concepto    ?            : string;
    distancia?                : number;
    precio_unitario?         : number;
    precio_total?             : number;
    destino?                  : string;
    destinos   ?             : string;
    otro_vehiculo?           : string;
    num_apertura?             : string;
    placa ?                   : string;
    estado?                   : string;
    gestion       ?          : string;
    numero_recibo?           : number;
    tipo           ?         : string;
    combustible     ?        : string;

    litros_reales?           : number;
    precio_real?             : number;
    numero_factura?          : number;
    fecha_factura?           : string;
    estado_ejecutado?        : string,

    area?                    : string; 
    area_id?                 : string;
    apertura_id?             : string;

    nombre_chofer?            : string;
    total_litros_reales?     : number;
    total_precio_real?       : number;

              
   
}
export type ReportFinal = {
    id                    : string;
    cod_vale              : string;    
    litros_reales         : number;
    precio_real           : number;           
    combustible           : string;
    fecha_factura         : Date;
    asignacion_id         : string;
    contrato              : string;
    apertura_general_id   : string;
    apertura_programatica : string;
    estado_vale           : string;
    
}
export type ReportFinalSalida = {
    total_litros_reales   : number;
    total_precio_real     : number;   
    apertura_programatica : string;
 
    
}
export class ValeView {
    public async getTableVale(query: any, authUser: AuthUser ): Promise<Result<{ rows: ValeTableModel[] }>> {
        const ID_USUARIO = authUser.uid;

        const reporteVale = await ValeService.getAll();
        if (reporteVale.isFailure) return Result.fail("Falló al obtener el vale");
     //  const reporteValeResult = reporteVale.getValue();
        
        const vehiculos = await VehiculoService.getAll();
        if (vehiculos.isFailure) return Result.fail("Falló al obtener la vehiculos");
        const vehiculosResult = vehiculos.getValue();
        
        const asignacion = await AsignacionService.getAll();
        if (asignacion.isFailure) return Result.fail("Falló al obtener la asignacion");
        let asignacionResult = asignacion.getValue().filter((a) => a.props.estado);
        if (authUser.superadministrador) asignacionResult = asignacion.getValue();
        if (!asignacionResult) return Result.fail("Error no existe apertura asignada.");

        const asignacionResult2 = asignacionResult.filter((a) => a.props.usuarioId === ID_USUARIO);

        const apertura = await AperturaGeneralService.getAll();
        if (apertura.isFailure) return Result.fail("Falló al obtener la apertura");
        const aperturaResult = apertura.getValue().filter((a) => a.props.estadoActivo);

        const destinos = await DestinoService.getAll();
        if (destinos.isFailure) return Result.fail("Falló al obtener la destinos");
        const destinosResult = destinos.getValue();

        const personas = await PersonalService.getAll();
        if (personas.isFailure) return Result.fail("Falló al obtener la personas");
        const personasResult = personas.getValue();

        const area = await AreaService.getAll();
        if (area.isFailure) return Result.fail("Falló al obtener la area");
        const areaResult = area.getValue();


        /* listado de vale */
        const vale = await ValeService.getAll();
        if (vale.isFailure) return Result.fail("Falló al obtener la vale");
        let valeResult = vale.getValue()
                            .filter((v) => v.props.asignacionId && asignacionResult2.map((a) => a.id)
                            .includes(v.props.asignacionId));
        
        const usuarioResult = await UsuarioService.getById(ID_USUARIO);
        if (usuarioResult.isFailure) return Result.fail("Falló al obtener la usuario");
        const ID_ROLE = usuarioResult.getValue().props.roleId;
        const rolesResult = await RoleService.getById(ID_ROLE);
        const permisos = JSON.parse(rolesResult.getValue().props.permisos);
        let is_approve = typeof permisos.approve !== 'undefined'? permisos.approve: false;		
        // Se establece esta linea de codigo ya que para el modulo de viaticos se necesita de la aprobacion sin embargo en vales no se 
        // requiere para que el filtrado suceda de manera normal se establece que si estos 2  roles se identifiquen considere como falsa la aprobacion para pasar con normalidad
        authUser.roles === ENUM_TECNICO_VALE_VIATICOS || authUser.roles === ENUM_TECNICO_COMPLETO ? is_approve = false: is_approve; 	
        if (authUser.superadministrador || is_approve) valeResult = vale.getValue();
        // Filtro Final
      
        /* listado general de la tabla vehiculo ordenados */
        const result: ValeTableModel[] = valeResult.map((item) => {
            const vehiculoR             = vehiculosResult.find((v) => v.id===item.props.vehiculoId);
            const aperturaGeneralID     = asignacionResult.find((as) => as.id===item.props.asignacionId)?.props.partidaGeneralId || "";
            const aperturaGeneralResult = aperturaResult.find((v) => v.id===aperturaGeneralID)?.props.aperturaProgramatica || "";
            const nombreConductor       = personasResult.find((p) => p.id===vehiculoR?.props.personalId)?.getNombreCompleto() || "";
            const nombreDestino         = destinosResult.find((d) => d.id===item.props.destino)?.props.nombre || "";
            const aperturaGeneralId = asignacionResult.find((c) => c.id === item.props.asignacionId)?.props.partidaGeneralId||"-"; 
            const areaId   = aperturaResult.find((c) => c.id === aperturaGeneralId)?.props.areaId||"-";       
            const area  = areaResult.find((c)=>c.id === areaId)?.props.nombre||"-"; 
            const contrato  = asignacionResult.find((c) => c.id === item.props.asignacionId)?.props.contrato||"-"; 
         
            return {
                id             : String(item.id),
                cod_vale       : item.props.codVale,
                nombre         : nombreConductor,
                fecha_emision  : moment(item.props.fechaEmision).format("DD/MM/YYYY HH:mm").toString(),
                fecha_emision_ : item.props.fechaEmision,
                fecha_validez  : moment(item.props.fechaValidez).format("DD/MM/YYYY").toString(),
                litros         : formatearNumero(Number(item.props.litros),'en-US'),
                concepto       : item.props.concepto,
                distancia      : formatearNumero(Number(item.props.distancia),'en-US'),
                precio_unitario: formatearNumero(Number(item.props.precioUnitario),'en-US'),
                precio_total   : formatearNumero(Number(item.props.precioTotal),'en-US'),
                observaciones  : item.props.observaciones,
                destinos       : item.props.destinos,
                destino        : nombreDestino,
                estado         : item.props.estado || "PENDIENTE",
                otro_vehiculo  : item.props.otroVehiculo?"Otro Vehiculo":"Propio",
                num_apertura   : aperturaGeneralResult,
                placa          : vehiculoR?.props.numPlaca || "",
                gestion        : item?.props.gestion || "",
                tipo           : vehiculoR?.props.tipo || "",
                combustible    : vehiculoR?.props.carga || "",                
                numero_recibo  : item.props.numeroRecibo, 
                litros_reales   : item.props.litrosReales,
                precio_real     : item.props.precioReal,
                numero_factura  : item.props.numeroFactura,
                fecha_factura   : item.props.fechaFactura?moment(item.props.fechaFactura).format("DD/MM/YYYY").toString(): '',
                estado_ejecutado: item.props.estadoEjecutado,  
                nombre_chofer   : nombreConductor,
                area            : area,
                contrato        : contrato,
                
            };
        }).sort((a, b) => moment(a.fecha_emision_).toDate() < moment(b.fecha_emision_).toDate() ? 1 : -1);
            
        const response = findAndCountResult(result, query);

        return Result.ok(response);
    }


     public async getFechaFiltroReporteFinal(fechaInicio : string, fechaFin: string, query: any, authUser: AuthUser ): Promise<Result<{ rows: ReportFinalSalida[] }>> { ///ELIMINAR
        const ID_USUARIO = authUser.uid;
         const reporteVale = await ValeService.getAll();
        if (reporteVale.isFailure) return Result.fail("Falló al obtener el vale");
       const reporteValeResult = reporteVale.getValue();

        const vehiculos = await VehiculoService.getAll();
        if (vehiculos.isFailure) return Result.fail("Falló al obtener la vehiculos");
        const vehiculoResult = vehiculos.getValue();
        
        const asignacion = await AsignacionService.getAll();
        if (asignacion.isFailure) return Result.fail("Falló al obtener la asignacion");
        let asignacionResult = asignacion.getValue().filter((a) => a.props.estado);
        if (authUser.superadministrador) asignacionResult = asignacion.getValue();
        if (!asignacionResult) return Result.fail("Error no existe apertura asignada.");

        const asignacionResult2 = asignacionResult.filter((a) => a.props.usuarioId === ID_USUARIO);

        const apertura = await AperturaGeneralService.getAll();
        if (apertura.isFailure) return Result.fail("Falló al obtener la apertura");
        const aperturaResult = apertura.getValue().filter((a) => a.props.estadoActivo);

        /* listado de vale */
        const vale = await ValeService.getAll();
        if (vale.isFailure) return Result.fail("Falló al obtener la vale");
        let valeResult = vale.getValue()
                            .filter((v) => v.props.asignacionId && asignacionResult2.map((a) => a.id)
                            .includes(v.props.asignacionId));
        
        const usuarioResult = await UsuarioService.getById(ID_USUARIO);
        if (usuarioResult.isFailure) return Result.fail("Falló al obtener la usuario");
        const ID_ROLE = usuarioResult.getValue().props.roleId;
        const rolesResult = await RoleService.getById(ID_ROLE);
        const permisos = JSON.parse(rolesResult.getValue().props.permisos);
        let is_approve = typeof permisos.approve !== 'undefined'? permisos.approve: false;		
        // Se establece esta linea de codigo ya que para el modulo de viaticos se necesita de la aprobacion sin embargo en vales no se 
        // requiere para que el filtrado suceda de manera normal se establece que si estos 2  roles se identifiquen considere como falsa la aprobacion para pasar con normalidad
        authUser.roles === ENUM_TECNICO_VALE_VIATICOS || authUser.roles === ENUM_TECNICO_COMPLETO ? is_approve = false: is_approve; 	
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        if (authUser.superadministrador || is_approve) valeResult = vale.getValue();
        // Filtro Final
        
        /* listado general de la tabla vehiculo ordenados */
       const datosReporteFinal : ReportFinal[]= reporteValeResult.map((item)  => {               
               
                const aperturaGeneralId = asignacionResult.find((c) => c.id === item.props.asignacionId)?.props.partidaGeneralId||"-"; 
                const aperturaProgramatica       = aperturaResult.find((c) => c.id === aperturaGeneralId)?.props.aperturaProgramatica||"-"; 
               // const fechaFactura   = aperturaResult.find((c) => c.id === aperturaGeneralId)?.props.areaId||"-"; 
                const combustible   = vehiculoResult.find((c)=>c.id === item.props.vehiculoId )?.props.carga||"-"; 
               
                const contrato  = asignacionResult.find((c) => c.id === item.props.asignacionId)?.props.contrato||"-"; 
               
            return{
                    id                    : String(item.id),    
                    cod_vale              : item.props.codVale,  
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    litros_reales         : item.props.litrosReales!,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    precio_real           : item.props.precioReal!,
                    combustible           : combustible,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    fecha_factura         : item.props.fechaFactura!,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    asignacion_id         : item.props.asignacionId!,
                    contrato              : contrato,
                    apertura_general_id   : aperturaGeneralId,
                    apertura_programatica : aperturaProgramatica,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    estado_vale           : item.props.estadoEjecutado!,
            }

         })      
         

         const resultado:ReportFinalSalida [] = [];
         const inicio = new Date(fechaInicio);
         const fin = new Date(fechaFin);
        // Ajustar fin para incluir la fecha completa (23:59:59)
        fin.setHours(23, 59, 59);
        const filtrados = datosReporteFinal.filter(item => {
            if (!item.fecha_factura) return false; // ignorar sin fecha      
            if (item.estado_vale != ENUM_EJECUTADO) return false; // solo los ejecutados      
            const fechaItem = new Date(item.fecha_factura);
            return fechaItem >= inicio && fechaItem <= fin;
        });
      
            filtrados.forEach(item => {			
            const key = item.apertura_programatica;
            let grupo = resultado.find((r) => r.apertura_programatica === key );//cambiar

            if (!grupo) {
                grupo = {
                apertura_programatica : key,
                total_litros_reales: 0,
                total_precio_real: 0,
               
                };
                resultado.push(grupo);
            }

            grupo.total_litros_reales += Number(item.litros_reales) || 0;
            grupo.total_precio_real += Number(item.precio_real) || 0;
            });

                     
        const response = findAndCountResult(resultado, query);

        return Result.ok(response);
    }

    public async getValeFormDataView(id_vale: string): Promise<Result<ValeFormDataResponse>> {

        
        const vale = await ValeService.getById(id_vale);
        if (vale.isFailure) return Result.fail<ValeFormDataResponse>("Vale no encontrado");
       // verificacion de datos asignacion, vehiculo
        const vehiculos = await VehiculoService.getAll();
        if (vehiculos.isFailure) return Result.fail("Falló al obtener la vehiculos");
        const vehiculosResult = vehiculos.getValue();
        
        const asignacion = await AsignacionService.getAll();
        if (asignacion.isFailure) return Result.fail("Falló al obtener la asignacion");
        const  asignacionResult = asignacion.getValue();

        const area = await AreaService.getAll();
        if (area.isFailure) return Result.fail("Falló al obtener la area");
        const areaResult = area.getValue();
        
        const personal = await PersonalService.getAll();
        if (personal.isFailure) return Result.fail("Falló al obtener la personal");
        const personalResult = personal.getValue();

        const apertura = await AperturaGeneralService.getAll();
        if (apertura.isFailure) return Result.fail("Falló al obtener la apertura");
        const aperturaResult = apertura.getValue().filter((a) => a.props.estadoActivo);

        const destino = await DestinoService.getAll();
        if (destino.isFailure) return Result.fail("Falló al obtener la destino");
        const destinoResult = destino.getValue();

      //fin
        const props = vale.getValue().props;
     // verificando apertura
      const aperturaGeneralID     = asignacionResult.find((as) => as.id===props.asignacionId)?.props.partidaGeneralId || "";
      const numeroApertura     = aperturaResult.find((a) => a.id===aperturaGeneralID)?.props.aperturaProgramatica || "";
      const areaID     = aperturaResult.find((a) => a.id===aperturaGeneralID)?.props.areaId || "";
      const nombreArea     = areaResult.find((a) => a.id===areaID)?.props.nombre || "";
      const aperturaNombre = nombreArea.concat("- Nº Apertura: ").concat(numeroApertura);
     // datos vehiculo
      const placa     = vehiculosResult.find((v) => v.id===props.vehiculoId)?.props.numPlaca || "";
      const tipo     = vehiculosResult.find((v) => v.id===props.vehiculoId)?.props.tipo || "";
      const marca     = vehiculosResult.find((v) => v.id===props.vehiculoId)?.props.marca || "";
      const sigla     = areaResult.find((a) => a.id===areaID)?.props.sigla || "";
      const choferID     = vehiculosResult.find((v) => v.id===props.vehiculoId)?.props.personalId || "";
      const chofer     = personalResult.find((p) => p.id===choferID)?.getNombreCompleto() || "";
      const vehiculoNombre = "Placa: ".concat(placa).concat("-").concat(tipo).concat("-").concat(marca).concat("- Sigla: ").concat(sigla).concat("- Chofer: ").concat(chofer);
      const combustible     = vehiculosResult.find((v) => v.id===props.vehiculoId)?.props.carga || "";
    // destino
      const destinoNombre     = destinoResult.find((d) => d.id=== props.destino)?.props.nombre|| "";

     //
        const result: ValeFormDataResponse = {
            id             : vale.getValue().id,
            cod_vale       : props.codVale,
            fecha_emision  : props.fechaEmision,
            fecha_validez  : props.fechaValidez,
            litros         : props.litros,
            concepto       : props.concepto,
            distancia      : props.distancia,
            precio_unitario: props.precioUnitario,
            precio_total   : props.precioTotal,
            observaciones  : props.observaciones,
            destino        : props.destino,
            destinos       : props.destinos,
            otro_vehiculo  : props.otroVehiculo,
            usuario_id     : props.usuarioId || null,
            vehiculo_id    : props.vehiculoId || null,
            asignacion_id  : props.asignacionId || null,
            numero_recibo  : props.numeroRecibo, 
            litros_reales  : props.litrosReales,
            precio_real    : props.precioReal,
            numero_factura : props.numeroFactura,
            fecha_factura  : props.fechaFactura,
           estado_ejecutado: props.estadoEjecutado,  
           apertura_nombre : aperturaNombre,
           vehiculo_nombre : vehiculoNombre,
           combustible     : combustible,   
           destino_nombre  : destinoNombre,
        };
  
        return Result.ok(result);
		
		
    }

    public async getVehiculoApertura(authUser: AuthUser, id_vale: string): Promise<Result<VehiculoAperturaResponse>> {
        const ID_USUARIO = authUser.uid;

        const asignacion = await AsignacionService.getAll();
        if (asignacion.isFailure) return Result.fail(String(asignacion.error));
        const asignacionResult = asignacion.getValue().filter((a) => a.props.estado).find((a) => a.props.usuarioId===ID_USUARIO);
        if (!asignacionResult) return Result.fail("Error no existe apertura asignada a este usuario.");
        const ID_APERTURA = asignacionResult?.props.partidaGeneralId || "";
        
        const apertura = await AperturaGeneralService.getById(ID_APERTURA);
        if (apertura.isFailure) return Result.fail("Falló al obtener la apertura");
        const aperturaGeneralResult = apertura.getValue();

        const persona = await PersonalService.getAll();
        if (persona.isFailure) return Result.fail(String(persona.error));
        const personaResult = persona.getValue().filter((a) => a.props.activo).find((p) => p.props.usuarioId === ID_USUARIO);
        if (!personaResult) return Result.fail("Error no existe personal asignado.");            
        
        const vehiculos = await VehiculoService.getAll();
        if (vehiculos.isFailure) return Result.fail(String(vehiculos.error));
        const vehiculosResult = vehiculos.getValue().filter((v) => v.props.estado);
        if (!vehiculosResult) return Result.fail("Error no existe vehiculos asignado.");

        const areaPadre = aperturaGeneralResult?.props.areaId || null;
        const areaHijo = aperturaGeneralResult?.props.areaHijoId || null;
        
        const vehiculoPadreResult = vehiculosResult.find((v) => v.props.areaId === areaPadre) || null;
        
        let vehiculoResult = vehiculoPadreResult;
        if(areaHijo) {
            const vehiculoHijoResult = vehiculosResult.find((v) => v.props.areaId === areaHijo);
            if(vehiculoHijoResult) vehiculoResult = vehiculoHijoResult;
        }        
                   
        if (!vehiculoResult) return Result.fail("Error no existe vehiculo asignado.");        
        const personaVehiculoResult = persona.getValue().find((p) => p.id === vehiculoResult?.props.personalId);
        
        const ID_AREA = vehiculoResult.props.areaId;
        const area = await AreaService.getById(ID_AREA);
        if (area.isFailure) return Result.fail(String(area.error));
        const areaResult = area.getValue();

        let asignacionResultID = asignacionResult?.id || "";
        let vehiculoResultID = vehiculoResult?.id || "";        

        if(id_vale!=='undefined'){
            const vale = await ValeService.getById(id_vale);
            if (vale.isFailure) return Result.fail(String(vale.error));
            const valeResult = vale.getValue();
            asignacionResultID = valeResult.props.asignacionId || "";
            vehiculoResultID = valeResult.props.vehiculoId || "";
        } 
        
        const result: VehiculoAperturaResponse = {
            nombre       : personaVehiculoResult?.getNombreCompletoCon() || "",
            placa        : vehiculoResult.props.numPlaca,
            area         : areaResult.props.nombre,
            asignacion   : "Apertura Programatica: "+aperturaGeneralResult.props.aperturaProgramatica+" :: "+personaResult?.getNombreCompleto(),
            inicial      : "Presupuesto Inicial: "+numberToString(aperturaGeneralResult?.props.presupuestoInicial || 0)+" Bs." || "",
            restante     : "Presupuesto Restante: "+numberToString((asignacionResult?.props.saldo || 0))+" Bs." || "",
            asignacion_id: asignacionResultID,
            vehiculo_id  : vehiculoResultID,
        };
        
        return Result.ok(result);              
    }    


    public async getPDFVale(authUser: AuthUser, params: string): Promise<Result<any>> {    
        const ID_USUARIO = authUser.uid;
        const ID_VALE = params;
        
        const usuario = await UsuarioService.getById(ID_USUARIO);
        if (usuario.isFailure) return Result.fail(String(usuario.error));
        const usuarioProps = usuario.getValue().props;

        const vale = await ValeService.getById(ID_VALE);
        if (vale.isFailure) return Result.fail<ValeFormDataResponse>("Vale no encontrado");
        const valeProps = vale.getValue().props;

        const asignacion = await AsignacionService.getAll();
        if (asignacion.isFailure) return Result.fail(String(asignacion.error));
        const asignacionResult = asignacion.getValue().find((a) => a.id===valeProps.asignacionId);
        if (!asignacionResult) return Result.fail("Error no existe apertura asignada a este usuario.");
        const ID_APERTURA = asignacionResult?.props.partidaGeneralId || "";
        
        const apertura_general = await AperturaGeneralService.getById(ID_APERTURA);
        if (apertura_general.isFailure) return Result.fail("Falló al obtener la apertura");
        const aperturaGeneralProps = apertura_general.getValue().props;

        const vehiculo = await VehiculoService.getById(valeProps.vehiculoId || "");
        if (vehiculo.isFailure) return Result.fail(String(vehiculo.error));
        const vehiculoResult = vehiculo.getValue().props;
        
        const destino = await DestinoService.getById(valeProps.destino || "");
        if (destino.isFailure) return Result.fail(String(destino.error));
        const destinoResult = destino.getValue().props;

        const personals = await PersonalService.getAll();
        if (personals.isFailure) return Result.fail(String(personals.error));
        
        const personaResult = personals.getValue().find((p) => p.props.usuarioId === ID_USUARIO);
        const personalResult2 = personals.getValue().find((p) => p.id === vehiculoResult.personalId);        
        if (!personaResult) return Result.fail("Error no existe personal asignado.");
        
        const ID_CARGO = personaResult.props.cargoId || "";
        
        const cargo = await CargoService.getById(ID_CARGO); 
        if (cargo.isFailure) throw Result.fail(String(cargo.error));
        const cargoResult = cargo.getValue();
        if (!cargoResult) return Result.fail("Error no existe cargo asignado.");        
        
        const printDate = moment().locale('es').format('D [de] MMMM [de] YYYY HH:mm:ss');

        const result = {
            info: {
                codigo: `${valeProps.codVale}-
                         ${vehiculoResult.tipo}-
                         ${vehiculoResult.marca}-
                         ${vehiculoResult.numPlaca}-
                         ${personalResult2?.getNombreCompleto()}-
                         ${vehiculoResult.carga}-
                         ${formatearNumero(Number(valeProps.litros),'en-US')} litros-
                         ${destinoResult.nombre}-
                         ${formatearNumero(Number(valeProps.distancia),'en-US')}-
                         ${usuarioProps.fullname}`,
                userId: ID_USUARIO,
                email: usuarioProps.email,
                fecha_hora: printDate
            },
            data: {
                cod_vale         : valeProps.codVale,
                partida          : aperturaGeneralProps.aperturaProgramatica,
                fecha_validez    : moment(valeProps.fechaValidez).locale('es').format('D [de] MMMM [de] YYYY HH:mm:ss'),
                conductor        : personalResult2?.getNombreCompleto(),
                vehiculo         : vehiculoResult.tipo,
                marca            : vehiculoResult.marca,
                anulado          : valeProps.estado==='ANULADO',
                placa            : vehiculoResult.numPlaca,
                combustible      : vehiculoResult.carga,
                litros           : formatearNumero(Number(valeProps.litros),'en-US'),
                concepto         : valeProps.concepto,
                destino          : destinoResult.nombre,
                distancia        : formatearNumero(Number(valeProps.distancia),'en-US'),
                responsable      : usuarioProps.fullname,
                cargo            : cargoResult.getCargoCompleto(),
                observaciones    : valeProps.observaciones,
                destino_detallado: valeProps.destinos,
                numero_recibo    : valeProps.numeroRecibo || 0 ,
                litros_reales  : valeProps.litrosReales,
                precio_real    : valeProps.precioReal,
                numero_factura : valeProps.numeroFactura,
                fecha_factura  : valeProps.fechaFactura,
                estado_ejecutado: valeProps.estadoEjecutado,  
            }
        };
        return Result.ok(result);
    }

    public async getPDFVale2(params: string): Promise<Result<any>> {
        const ID_VALE = params;

        const vale = await ValeService.getById(ID_VALE);
        if (vale.isFailure) return Result.fail<ValeFormDataResponse>("Vale no encontrado");
        const valeProps = vale.getValue().props;

        const usuario = await UsuarioService.getAll();
        if (usuario.isFailure) return Result.fail(String(usuario.error));
        const usuarioResult = usuario.getValue().find((u) => u.id === valeProps.usuarioId)?.props;

        const vehiculo = await VehiculoService.getById(valeProps.vehiculoId || "");
        if (vehiculo.isFailure) return Result.fail(String(vehiculo.error));
        const vehiculoResult = vehiculo.getValue().props;
        
        const destino = await DestinoService.getById(valeProps.destino || "");
        if (destino.isFailure) return Result.fail(String(destino.error));
        const destinoResult = destino.getValue().props;

        const personals = await PersonalService.getAll();
        if (personals.isFailure) return Result.fail(String(personals.error));
        
        const personaResult = personals.getValue().find((p) => p.props.usuarioId === valeProps.usuarioId);
        const personalResult2 = personals.getValue().find((p) => p.id === vehiculoResult.personalId);        
        if (!personaResult) return Result.fail("Error no existe personal asignado.");
        
        const ID_CARGO = personaResult.props.cargoId || "";
        
        const cargo = await CargoService.getById(ID_CARGO); 
        if (cargo.isFailure) throw Result.fail(String(cargo.error));
        const cargoResult = cargo.getValue();
        if (!cargoResult) return Result.fail("Error no existe cargo asignado.");        
        
        const printDate = moment().locale('es').format('D [de] MMMM [de] YYYY HH:mm:ss');

        const result = {
            info: {
                codigo: `${vehiculoResult.tipo}-
                         ${vehiculoResult.marca}-
                         ${vehiculoResult.numPlaca}-
                         ${personalResult2?.getNombreCompleto()}-
                         ${vehiculoResult.carga}-
                         ${formatearNumero(Number(valeProps.litros),'en-US')} litros-
                         ${destinoResult.nombre}-
                         ${formatearNumero(Number(valeProps.distancia),'en-US')}-
                         ${usuarioResult?.fullname}`,
                userId: valeProps.usuarioId,
                email: usuarioResult?.email,
                fecha_hora: printDate
            },
            data: {
                cod_vale         : valeProps.codVale,
                fecha_validez    : moment(valeProps.fechaValidez).locale('es').format('D [de] MMMM [de] YYYY HH:mm:ss'),
                conductor        : personalResult2?.getNombreCompleto(),
                vehiculo         : vehiculoResult.tipo,
                marca            : vehiculoResult.marca,
                anulado          : valeProps.estado==='ANULADO',
                placa            : vehiculoResult.numPlaca,
                combustible      : vehiculoResult.carga,
                litros           : formatearNumero(Number(valeProps.litros),'en-US'),
                concepto         : valeProps.concepto,
                destino          : destinoResult.nombre,
                distancia        : formatearNumero(Number(valeProps.distancia),'en-US'),
                responsable      : usuarioResult?.fullname,
                cargo            : cargoResult.getCargoCompleto(),
                observaciones    : valeProps.observaciones,
                destino_detallado: valeProps.destinos,
                numero_recibo    : valeProps.numeroRecibo || 0,
                litros_reales    : valeProps.litrosReales,
                precio_real      : valeProps.precioReal,
                numero_factura   : valeProps.numeroFactura,
                fecha_factura    : valeProps.fechaFactura,
                estado_ejecutado : valeProps.estadoEjecutado,
            }
        };
        return Result.ok(result);
    }

    public async getReporteView(authUser: AuthUser, queryString: string): Promise<Result<ReporteDataResponse>> {    
        
        const initialValue: any = {};
        const resultObject: any = {};
        const excludeKeys: string[] = ["_limit", "_page", "q", "_order", "_sort"];
        const query: any = String(queryString).substr(1)
                                                        .split('&')
                                                        .reduce((prev, curr) => {
                                                            const split = curr.split('=');
                                                            const key = split[0];
                                                            const value = decodeURIComponent(split[1]);
                                                            prev[key] = value;
                                                            return prev;
                                                        }, initialValue);
        for (const key in query) {
            if (!excludeKeys.includes(key)) {
                resultObject[key] = query[key];
            }
        }
        const result = {
            info: await this.getInfoReporteData(authUser),
            data: await this.getReporteData(authUser, resultObject),
        };
        return Result.ok(result);
    }

    private async getInfoReporteData(authUser: AuthUser): Promise<InfoReporteModel | undefined> {
        const ID_USUARIO = authUser.uid;
        let is_superadmin = false;
        if (authUser.superadministrador) is_superadmin = true;
        let nombre = "SUPER ADMINISTRADOR";
        let cargoN = "ADMINISTRADOR";
        if(!is_superadmin) {
            const usuario = await UsuarioService.getById(ID_USUARIO);
            if (usuario.isFailure) return undefined;
            const usuarioResult = usuario.getValue().props;

            const personals = await PersonalService.getAll();
            if (personals.isFailure) return undefined;
            
            const personaResult = personals.getValue().find((p) => p.props.usuarioId === ID_USUARIO);
            if (!personaResult) return undefined;

            const ID_CARGO = personaResult.props.cargoId || "";
            
            const cargo = await CargoService.getById(ID_CARGO); 
            if (cargo.isFailure) return undefined;
            const cargoResult = cargo.getValue();
            nombre = usuarioResult.fullname;
            cargoN = cargoResult.getCargoCompleto();
        }

        const printDate = moment().locale('es').format('D [de] MMMM [de] YYYY HH:mm:ss');
        const hoy = new Date();
        const gestion = hoy.getFullYear().toString();
        
        const codigo = 'FORMULARIO DE CUENTAS';
        return {
            gestion,
            codigo,
            nombre,
            cargo : cargoN,
            is_superadmin,
            fecha: printDate
        }
    }



    private async getReporteData(authUser: AuthUser, queryString: any): Promise<ReporteData | undefined> {
        const ID_USUARIO = authUser.uid;
        const PLACA: string | null = queryString.placa || null;
        const ESTADO: string | null = queryString.estado || null;
        let ID_VEHICULO: string | null = null;

        const vehiculos = await VehiculoService.getAll();
        if (vehiculos.isFailure) return undefined;
        let vehiculosResult = vehiculos.getValue();
        if (PLACA) {
            vehiculosResult = vehiculosResult.filter((v) => v.props.numPlaca.toLowerCase().includes(PLACA.toLowerCase())),
            ID_VEHICULO = vehiculosResult[0].id;
        }

        const vales = await ValeService.getAll();
        if (vales.isFailure) return undefined;
        let valesResult = vales.getValue().filter((v) => v.props.usuarioId === ID_USUARIO);
        if (authUser.superadministrador) valesResult = vales.getValue();
        if(ESTADO) valesResult = valesResult.filter((v) => v.props.estado===ESTADO);
        if(ID_VEHICULO) valesResult = valesResult.filter((v) => v.props.vehiculoId===ID_VEHICULO);

        const aperturaGeneral = await AperturaGeneralService.getAll();
        if (aperturaGeneral.isFailure) return undefined;
        const aperturaResult = aperturaGeneral.getValue().filter((a) => a.props.estadoActivo);

        const asignacion = await AsignacionService.getAll();
        if (asignacion.isFailure) return undefined;
        const asignacionResult = asignacion.getValue().filter((a) => a.props.estado);        
        
        const destinos = await DestinoService.getAll();
        if (destinos.isFailure) return undefined;
        const destinosResult = destinos.getValue();
                
        const valesR: ValeReporteItem[] = valesResult.map((item) => {
            const vehiculoR         = vehiculosResult.find((v) => v.id===item.props.vehiculoId);
            const aperturaGeneralID = asignacionResult.find((as) => as.id===item.props.asignacionId)?.props.partidaGeneralId || "";
            const aperturaNumero    = aperturaResult.find((v) => v.id===aperturaGeneralID)?.props.aperturaProgramatica || "";
            const nombreDestino     = destinosResult.find((d) => d.id===item.props.destino)?.props.nombre || "";
            return {
                id          : String(item.id),
                cod_vale    : item.props.codVale,
                apertura    : aperturaNumero,
                fecha_carga : moment(item.props.fechaValidez).format("DD/MM/YYYY").toString(),
                fecha_carga_: item.props.fechaValidez,
                destino     : nombreDestino,
                placa       : vehiculoR?.props.numPlaca || "",
                combustible : vehiculoR?.props.carga || "",
                litros      : formatearNumero(Number(item.props.litros),'en-US'),
                precio      : formatearNumero(Number(item.props.precioTotal),'en-US'),
                observacion : item.props.observaciones,
                estado      : item.props.estado,
            };
        }).sort((a, b) => moment(a.fecha_carga_).diff(moment(b.fecha_carga_)));
        
        const result: ReporteData = {
            rows: valesR,
        };
        
        return result;
    }    
    
    public async getFechaFiltro(fechaInicio: string, fechaFin: string, query:any): Promise<Result<{ rows: ValeTableModel[]  }>> {
			
        const reporteVale = await ValeService.getAll();
        if (reporteVale.isFailure) return Result.fail("Falló al obtener la Vale");
        const reporteValeResult = reporteVale.getValue();
        //AperturaGeneral
       const apertura = await AperturaGeneralService.getAll();
       if(apertura.isFailure) return Result.fail("Fallo al obtener el apertura");
       const aperturaResult = apertura.getValue();
        // Destino
       const destino = await DestinoService.getAll();
       if(destino.isFailure) return Result.fail("Fallo al obtener el destino");
       const destinoResult = destino.getValue();
        //Usuario
        const usuario = await UsuarioService.getAll();
        if(usuario.isFailure) return Result.fail("Fallo al obtener el Usuario");
        const usuarioResult = usuario.getValue();
        //Vehiculo
        const vehiculo = await VehiculoService.getAll();
       if(vehiculo.isFailure) return Result.fail("Fallo al obtener el vehiculo");
       const vehiculoResult = vehiculo.getValue();
        //ASignacion
       const asignacion = await AsignacionService.getAll();
       if(asignacion.isFailure) return Result.fail("Fallo al obtener el asignacion");
       const asignacionResult = asignacion.getValue();
       // area
        const area =await AreaService.getAll();
        if(area.isFailure) return Result.fail("Fallo al obtener el area");
        const areaResult = area.getValue();
       
        const personas = await PersonalService.getAll();
        if (personas.isFailure) return Result.fail("Falló al obtener la personas");
        const personasResult = personas.getValue();

        const result: ValeTableModel[] = reporteValeResult.map((item) => {
            const aperturaGeneralId = asignacionResult.find((c) => c.id === item.props.asignacionId)?.props.partidaGeneralId||"-"; 
            const aperturaProgramatica       = aperturaResult.find((c) => c.id === aperturaGeneralId)?.props.aperturaProgramatica||"-"; 
            const areaId   = aperturaResult.find((c) => c.id === aperturaGeneralId)?.props.areaId||"-"; 
            const placa   = vehiculoResult.find((c)=>c.id === item.props.vehiculoId )?.props.numPlaca||"-"; 
            const tipo    = vehiculoResult.find((c)=>c.id === item.props.vehiculoId)?.props.tipo||"-"; 
            const combustible   = vehiculoResult.find((c)=>c.id === item.props.vehiculoId )?.props.carga||"-"; 
            const destino   = destinoResult.find((c)=>c.id === item.props.destino )?.props.nombre||"-"; 
            const usuarioNombre = usuarioResult.find((c)=>c.id === item.props.usuarioId)?.props.fullname||"-"; 
            const area  = areaResult.find((c)=>c.id === areaId)?.props.nombre||"-"; 
            const vehiculoR             = vehiculoResult.find((v) => v.id===item.props.vehiculoId);           
            const nombreConductor       = personasResult.find((p) => p.id===vehiculoR?.props.personalId)?.getNombreCompleto() || "";
            const contrato  = asignacionResult.find((c) => c.id === item.props.asignacionId)?.props.contrato||"-"; 
            //Actualizando Fechas 
            return {
                    id               : String(item.id),     
                    cod_vale        : item.props.codVale,
                    litros          : String(item.props.litros),
                    observaciones   : item.props.observaciones,
                    fecha_emision   : item.props.fechaEmision?moment(item.props.fechaEmision).format("DD/MM/YYYY").toString(): '',
                    fecha_validez   : item.props.fechaValidez?moment(item.props.fechaValidez).format("DD/MM/YYYY").toString(): '',
                    concepto        : item.props.concepto,
                    distancia       : String(item.props.distancia),
                    precio_unitario : String(item.props.precioUnitario),
                    precio_total    : String(item.props.precioTotal),
                    destino         : destino,
                    destinos        : item.props.destinos,
                    otro_vehiculo   : String(item.props.otroVehiculo),
                    num_apertura    : aperturaProgramatica,
                    placa           : placa,
                    estado          : String(item.props.estado),
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    gestion         : item.props.gestion!,
                    tipo            : tipo,
                    combustible     : combustible,   
                    usuario_nombre  : usuarioNombre,
                    area            : area,         
                    fecha_emision_date : item.props.fechaEmision,
                    numero_recibo   : item.props.numeroRecibo,
                    litros_reales   : item.props.litrosReales,
                    precio_real     : item.props.precioReal,
                    numero_factura  : item.props.numeroFactura,
                    fecha_factura   : item.props.fechaFactura?moment(item.props.fechaFactura).format("DD/MM/YYYY").toString(): '',
                    estado_ejecutado: item.props.estadoEjecutado,  
                    nombre_chofer   : nombreConductor,
                    contrato        : contrato,
            };
        }).sort((a, b) =>a.fecha_emision_date > b.fecha_emision_date ? 1 : -1);
         
          const filtrarFecha : ValeTableModel[] = this.filtrarPorFecha(result, fechaInicio, fechaFin);         
    
          const response = findAndCountResult(filtrarFecha, query); 
          return Result.ok(response);
        
    }
      
// Filtrar por fechas
public filtrarPorFecha = (datos: any[], fechaInicio:string, fechaFin: string) => {
        
    if (!fechaInicio || !fechaFin) return datos; // Si no hay fechas seleccionadas, no filtramos
                
    const inicio = this.convertirFecha(fechaInicio); 	

    const fin = this.convertirFecha(fechaFin);

                  
    // Filtrar los datos por fechas
   const filteredByDate = datos.filter(item => {						
       const fechaFormat = this.convertirFecha(item.fecha_emision);
       const itemDate = fechaFormat; 		
       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
       return  itemDate! >= inicio! && itemDate! <= fin!;			
   });         

   return filteredByDate;
  
};
public convertirFecha = (fecha : any )=> {     
       
       let fechaFormateada;
       let partes;
        // Dividir la fecha en día, mes y año
       if (fecha.includes("/")){
           partes = fecha.split("/");
           fechaFormateada = new Date(partes[2], partes[1] - 1, partes[0]);	
       }else if(fecha.includes("-")){
           partes = fecha.split("-");
           fechaFormateada = new Date(partes[0], partes[1]-1, partes[2]);	
          
       }                  
       return fechaFormateada;
   }



//impresion reporte general
public async getPDFValeReport(authUser: AuthUser, queryString: any, id?:string, listaIds? : string[], fechaInicio?: string, fechaFin?: string, tipoFecha?: number): Promise<Result<ReporteValeDataResponse>> {
     
    const resultObject = queryStringToArray(queryString);    
    const result = {
        info: await this.getInfoReporteValeData(authUser, resultObject),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        data: await this.getReporteValeData(resultObject, id, listaIds, fechaInicio!, fechaFin!, tipoFecha!)
    };

    return Result.ok(result);
	
} 

private async getInfoReporteValeData(authUser: AuthUser, queryString: ReportFilters): Promise<InfoReporteValeModel | undefined> {

    const ID_USUARIO = authUser.uid;
        const usuario = await UsuarioService.getById(ID_USUARIO);		
        if (usuario.isFailure) throw new Error(String(usuario.error));
        const NOMBRE_USUARIO = usuario.getValue().getNombreCompleto();	
        const EMAIL_USUARIO = usuario.getValue().props.email;
        
        const inputObj: any = queryString;
		
		const hoy = new Date();
        const gestion = hoy.getFullYear().toString();
        const tipo = inputObj.tipo_reporte || null;		

        const FECHA_REGISTRO = moment(hoy).locale('es').format('dddd D [de] MMMM [de] YYYY hh:mm:ss a').toString();	
        const codigo = `${gestion}-|-${tipo}-|-${FECHA_REGISTRO}`;

        // INICIO QR
        /* const reporteVale = await ValeService.getById(id_vale!)
         if (reporteVale.isFailure)  Result.fail<ReporteValeDataResponse>("Falló al obtener Vale de combustible");
         const props = reporteVale.getValue().props;
          const codValeQR = "CodVale ".concat(String(props.codVale));     
          const fechaEmisionQR = "Fecha Emision: ".concat(String(props.fechaEmision.getTime()));      
          const fechaValidezQr = "Fecha Validez: ".concat(String(props.fechaValidez.getTime()));      
          const litroQr = "Litros: ".concat(String(props.litros)); 
          const distanciaQr = "Distancia: ".concat(String(props.distancia));
          const PrecioTotalQr = "Precio Total: ".concat(String(props.precioTotal));*/
        //FIN QR
        return {
            codigo    : codigo,
            nombre    : NOMBRE_USUARIO,
            fecha     : FECHA_REGISTRO,
            email     : EMAIL_USUARIO,
            /*codigoQR  : `${codValeQR}-               
            ${fechaEmisionQR}-   
            ${fechaValidezQr}- 
            ${litroQr}-                     
            ${distanciaQr}-
            ${PrecioTotalQr}-`*/
        }
}

private async getReporteValeData(queryString: ReportFilters, id?:string, listaIds?:string[], fechaInicio?: string, fechaFin?: string, tipoFecha?: number): Promise<ReporteValeDataR | undefined> {
	
    const inputObj: any = queryString;	
    const tipo = inputObj.tipo_reporte || null;	

    const hoy = new Date();
    const gestion = hoy.getFullYear().toString();
    const reporteVale = await ValeService.getAll();
    if (reporteVale.isFailure) return undefined;
    const reporteValeResult = reporteVale.getValue();

    //personal
     const personal = await PersonalService.getAll();
     if (personal.isFailure) return undefined;
     const personalResult = personal.getValue();
    //area
    const area = await AreaService.getAll();
    if (area.isFailure) return undefined;
    const areaResult = area.getValue();
    //usuario
    const usuario = await UsuarioService.getAll();
    if (usuario.isFailure) return undefined;
    const usuarioResult = usuario.getValue();
    //cargo
    /* const cargo = await CargoService.getAll();
    if (cargo.isFailure) return undefined;
    const cargoResult = cargo.getValue(); */

    //AperturaGeneral
    const apertura = await AperturaGeneralService.getAll();
    if(apertura.isFailure) return undefined;
    const aperturaResult = apertura.getValue();
    // Destino
    const destino = await DestinoService.getAll();
    if(destino.isFailure) return undefined;
    const destinoResult = destino.getValue();
        
    //Vehiculo
    const vehiculo = await VehiculoService.getAll();
    if(vehiculo.isFailure) return undefined;
    const vehiculoResult = vehiculo.getValue();
    //ASignacion
    const asignacion = await AsignacionService.getAll();
    if(asignacion.isFailure)return undefined;
    const asignacionResult = asignacion.getValue();

    // SALIDA de MES
         // Extraer el mes (en formato numérico)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const mesNumero = parseInt(fechaInicio!.split("-")[1], 10); // Ej: "2025-03-15" → 3
    // Arreglo con los nombres de los meses
    const nombresMeses = [
       "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
        "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
    ];
    const mesIndex = mesNumero - 1; // Restamos 1 porque los meses del arreglo empiezan en 0
    // Retornar el nombre del mes o vacío si no corresponde
    const mes = nombresMeses[mesIndex] || "";
    //FIN SALIDA DE MES
    const listaFiltradaAreas:AreaFormModel[] =[]; 
    const listaAreasEncontradas:string[] =[]; 

    //FILTRADO DE AREA          
     //if(tipo === "REPORTE_POR_PROYECTO"){
    const listaAreas: AreaFormModel[] = areaResult.map((item) => {                 
        return {                
            id: item.id.toString(),
            nombre: item.props.nombre,
            // partida_presupuestaria : item.props.partidaPresupuestaria,
            sigla: item.props.sigla,                                             
            };            
    }) ;  
     
     //FINAL FILTRADO DE AREA  
       
        const reporteValeR: ReporteValeItem[] = reporteValeResult.map((item) => {
        const aperturaGeneralId = asignacionResult.find((c) => c.id === item.props.asignacionId)?.props.partidaGeneralId||"-"; 
        const aperturaProgramatica       = aperturaResult.find((c) => c.id === aperturaGeneralId)?.props.aperturaProgramatica||"-"; 
        const areaId   = aperturaResult.find((c) => c.id === aperturaGeneralId)?.props.areaId||"-"; 
        const placa   = vehiculoResult.find((c)=>c.id === item.props.vehiculoId )?.props.numPlaca||"-"; 
        const choferID   = vehiculoResult.find((c)=>c.id === item.props.vehiculoId )?.props.personalId||"-"; 
        const nombreChofer   = personalResult.find((c)=>c.id === choferID )?.getNombreCompleto()||"-"; 
        const tipo    = vehiculoResult.find((c)=>c.id === item.props.vehiculoId)?.props.tipo||"-"; 
        const combustible   = vehiculoResult.find((c)=>c.id === item.props.vehiculoId )?.props.carga||"-"; 
        const destino   = destinoResult.find((c)=>c.id === item.props.destino )?.props.nombre||"-"; 
        const usuarioNombre = usuarioResult.find((c)=>c.id === item.props.usuarioId)?.props.fullname||"-"; 
        const area  = areaResult.find((c)=>c.id === areaId)?.props.nombre||"-"; 
        const contrato  = asignacionResult.find((c) => c.id === item.props.asignacionId)?.props.contrato||"-"; 
       
    //Actualizando Fechas 
    //Filtro de Areas por proyecto
        listaAreasEncontradas.push(areaId); // verificar si se deben ingresar todas las areas
			
            return {
                    id                  : String(item.id),     
                    cod_vale            : item.props.codVale,
                    litros              : String(item.props.litros),
                    observaciones       : item.props.observaciones,
                    fecha_emision       : item.props.fechaEmision?moment(item.props.fechaEmision).format("DD/MM/YYYY").toString(): '',
                    fecha_validez       : item.props.fechaValidez?moment(item.props.fechaValidez).format("DD/MM/YYYY").toString(): '',
                    concepto            : item.props.concepto,
                    distancia           : String(item.props.distancia),
                    precio_unitario     : String(item.props.precioUnitario),
                    precio_total        : String(item.props.precioTotal),
                    destino             : destino,
                    destinos            : item.props.destinos,
                    otro_vehiculo       : String(item.props.otroVehiculo),
                    num_apertura        : aperturaProgramatica,
                    placa               : placa,
                    estado              : String(item.props.estado),
                    gestion             : item.props.gestion!,
                    tipo                : tipo,
                    combustible         : combustible,   
                    usuario_nombre      : usuarioNombre,
                    area                : area,         
                    area_id             : areaId,
                    fecha_emision_date  : item.props.fechaEmision,
                    numero_recibo       : item.props.numeroRecibo,
                    litros_reales       : item.props.litrosReales,
                    precio_real         : item.props.precioReal,
                    numero_factura      : item.props.numeroFactura,
                    fecha_factura       : item.props.fechaFactura?moment(item.props.fechaFactura).format("DD/MM/YYYY").toString(): '',
                    estado_ejecutado    : item.props.estadoEjecutado,     
                    
                    fecha_inicio        : fechaInicio,
                    fecha_fin           : fechaFin,
                    tipo_fecha          : tipoFecha,  // 1 es para se selecciona mes 0 para cuando es un rango de fecha
                    semestre            : "PRIMER", //PRIMER //SEGUNDO cambiarlo segun lo requiera 
                    mes                 : mes,
                    nombre_chofer       : nombreChofer,
                     contrato         : contrato,
                    
            };
        }).sort((a, b) =>a.fecha_emision_date > b.fecha_emision_date ? 1 : -1);
           
        
        //FILTRADO POR PROYECTO        
        for(let i = 0 ; i < listaAreasEncontradas.length ; i++){
            const filtroAreas =  listaAreas 			
            .filter((value) => this.filtrarId(value.id,listaAreasEncontradas[i]));             
            if(filtroAreas.length >0 && filtroAreas != undefined){ 
                listaFiltradaAreas.push(filtroAreas[0])			
            }
        }           
       const listaFiltradaProyecto : AreaFormModel [] = [...new Set(listaFiltradaAreas)];       
      
        // FIN FILTRADO POR PROYECTO 
       
       //FILTRADO POR APERTURA
       let filtroGeneral : ReporteValeItem [] = [];
       let filtroFecha : string[] = [] ;
       let filtroSinRepetidosBen: ReporteValeItem [] = [];     
              
       if(tipo === ENUM_REPORTE_POR_APERTURA){      
             
                listaIds!.forEach((idG, key) => {     
                    const resultadoFiltro = reporteValeR.filter((value) => this.filtrarId(value.id, idG));           
                    filtroGeneral = [...filtroGeneral, ...resultadoFiltro];  // Acumulamos los resultados
                    filtroFecha = this.getfechafirstLast(filtroGeneral);    			
					
                });  
                
                filtroSinRepetidosBen = filtroGeneral.filter((valor, index, self) => {								
                    return self.findIndex((item) => item.num_apertura === valor.num_apertura) === index;
                });                  
         }else if(listaIds != undefined){
      //FILTRO GENERAL        
            
                listaIds!.forEach((idG, key) => {        
                    const resultadoFiltro = reporteValeR.filter((value) => this.filtrarId(value.id, idG));           
                    filtroGeneral = [...filtroGeneral, ...resultadoFiltro];  // Acumulamos los resultados				
				
                    filtroFecha = this.getfechafirstLast(filtroGeneral);                    
					
                });       
       //FIN FILTRO GENERAL
          }         
        //FILTRO REPORTE FINAL
          const datosReporteFinal : ReportFinal[]= reporteValeResult.map((item)  => {               
                
                const aperturaGeneralId = asignacionResult.find((c) => c.id === item.props.asignacionId)?.props.partidaGeneralId||"-"; 
                const aperturaProgramatica       = aperturaResult.find((c) => c.id === aperturaGeneralId)?.props.aperturaProgramatica||"-"; 
               // const fechaFactura   = aperturaResult.find((c) => c.id === aperturaGeneralId)?.props.areaId||"-"; 
                const combustible   = vehiculoResult.find((c)=>c.id === item.props.vehiculoId )?.props.carga||"-"; 
               
                const contrato  = asignacionResult.find((c) => c.id === item.props.asignacionId)?.props.contrato||"-"; 
               
            return{
                    id                    : String(item.id),    
                    cod_vale              : item.props.codVale,  
                    litros_reales         : item.props.litrosReales!,
                    precio_real           : item.props.precioReal!,
                    combustible           : combustible,
                    fecha_factura         : item.props.fechaFactura!,
                    asignacion_id         : item.props.asignacionId!,
                    contrato              : contrato,
                    apertura_general_id   : aperturaGeneralId,
                    apertura_programatica : aperturaProgramatica,
                    estado_vale           : item.props.estadoEjecutado!,
            }

         })      

           const resultado:ReportFinalSalida [] = [];

         const inicio = new Date(fechaInicio!);
         const fin = new Date(fechaFin!);
        // Ajustar fin para incluir la fecha completa (23:59:59)
        fin.setHours(23, 59, 59);
        const filtrados = datosReporteFinal.filter(item => {
            if (!item.fecha_factura) return false; // ignorar sin fecha      
            if (item.estado_vale != ENUM_EJECUTADO) return false; // solo los ejecutados      
            const fechaItem = new Date(item.fecha_factura);
            return fechaItem >= inicio && fechaItem <= fin;
        });
      
            filtrados.forEach(item => {			
            const key = item.apertura_programatica;
            let grupo = resultado.find((r) => r.apertura_programatica === key );//cambiar

            if (!grupo) {
                grupo = {
                apertura_programatica : key,
                total_litros_reales: 0,
                total_precio_real: 0,
              /*  combustible: item.combustible,
                fecha_factura : item.fecha_factura,
                contrato : item.contrato,
                estado_vale: item.estado_vale,*/
                };
                resultado.push(grupo);
            }

            grupo.total_litros_reales += Number(item.litros_reales) || 0;
            grupo.total_precio_real += Number(item.precio_real) || 0;
            });

        resultado.sort((a, b) =>a.apertura_programatica > b.apertura_programatica ? -1 : 1);
        
        // FIN FILTRO REPORTE FINAL
        const result1: ReporteValeDataR = {
            tipo_reporte: tipo,
            rows: filtroGeneral,
            lista_areas: listaFiltradaProyecto,
          //  lista_ffof : listaSinRepetidos,	
            idApertura : filtroSinRepetidosBen,//response.rows,//listaIdBeneficiario,
            fecha_inicio : fechaInicio?moment(fechaInicio).format("DD/MM/YYYY").toString(): '',   
            fecha_fin : fechaFin?moment(fechaFin).format("DD/MM/YYYY").toString(): '',   
            tipo_fecha: tipoFecha,
            mes: mes,
            semestre: "SEGUNDO", // cambiar segun requerimiento
            gestion: gestion, 
            reporte_final: resultado,
        };        
      
	
        return result1;
		
}

  //filtramos por el tipo de id 
  public filtrarId(item:string, id:string) { 
    return (item === id); 
 } 

// Identificar la primera y ultima de las fechas dentro del filtro
public  getfechafirstLast (listaGeneral : ReporteValeItem[]):string[]{	
    const filtroFechas : string []= [];
    const filtroFechasFirstLast : string []= [];
            
    listaGeneral.forEach((value,key)=>{
         filtroFechas.push(value.fecha_emision!)
	})
             
    // Función para convertir las fechas en formato 'dd/MM/yyyy' a objetos Date
    const parseDate = (dateString: string): Date => {
      const [day, month, year] = dateString.split('/').map(Number);
      return new Date(year, month - 1, day); // Mes en JavaScript es 0-indexado
    };    
    // Ordenar las fechas en orden ascendente
    const fechasOrdenadas = filtroFechas.sort((a, b) => {
      const dateA = parseDate(a);
      const dateB = parseDate(b);
      return dateA.getTime() - dateB.getTime(); // Comparar las fechas en milisegundos
    });
    filtroFechasFirstLast.push( fechasOrdenadas[0]);	
    filtroFechasFirstLast.push(fechasOrdenadas[fechasOrdenadas.length-1]);
    return filtroFechasFirstLast;	
 }   


 public async getDatosApertura(fechaInicio: string, fechaFin: string, apertura:string, query:any): Promise<Result<{ rows: ValeTableModel[]  }>> {
               
    const reporteVale = await ValeService.getAll();
    if (reporteVale.isFailure) return Result.fail("Falló al obtener la vale");
    const reporteValeResult = reporteVale.getValue(); 
    /*Listado de apertura*/
    const aperturaProg = await AperturaGeneralService.getAll();
    if(aperturaProg.isFailure) return Result.fail("Fallo al obtener el aperturaProg");
    const aperturaResult = aperturaProg.getValue();
    /*Listado de area*/
    const area =await AreaService.getAll();
    if(area.isFailure) return Result.fail("Fallo al obtener el area");
    const areaResult = area.getValue();
   // Destino
    const destino = await DestinoService.getAll();
    if(destino.isFailure) return Result.fail("Fallo al obtener el destino");
    const destinoResult = destino.getValue();
    //usuario
    const usuario = await UsuarioService.getAll();
    if (usuario.isFailure) return Result.fail("Fallo al obtener el usuario");
    const usuarioResult = usuario.getValue();
     //Vehiculo
    const vehiculo = await VehiculoService.getAll();
    if(vehiculo.isFailure) return Result.fail("Fallo al obtener el vehiculo");
    const vehiculoResult = vehiculo.getValue();
    //ASignacion
    const asignacion = await AsignacionService.getAll();
    if(asignacion.isFailure) return Result.fail("Fallo al obtener el asignacion");
    const asignacionResult = asignacion.getValue();

    const personas = await PersonalService.getAll();
    if (personas.isFailure) return Result.fail("Falló al obtener la personas");
    const personasResult = personas.getValue();

                    
      const reporteValeR: ReporteValeItem[] = reporteValeResult.map((item) => {
            const aperturaGeneralId = asignacionResult.find((c) => c.id === item.props.asignacionId)?.props.partidaGeneralId||"-"; 
            const aperturaProgramatica       = aperturaResult.find((c) => c.id === aperturaGeneralId)?.props.aperturaProgramatica||"-"; 
            const areaId   = aperturaResult.find((c) => c.id === aperturaGeneralId)?.props.areaId||"-"; 
            const placa   = vehiculoResult.find((c)=>c.id === item.props.vehiculoId )?.props.numPlaca||"-"; 
            const tipo    = vehiculoResult.find((c)=>c.id === item.props.vehiculoId)?.props.tipo||"-"; 
            const combustible   = vehiculoResult.find((c)=>c.id === item.props.vehiculoId )?.props.carga||"-"; 
            const destino   = destinoResult.find((c)=>c.id === item.props.destino )?.props.nombre||"-"; 
            const usuarioNombre = usuarioResult.find((c)=>c.id === item.props.usuarioId)?.props.fullname||"-"; 
            const area  = areaResult.find((c)=>c.id === areaId)?.props.nombre||"-"; 
            const vehiculoR             = vehiculoResult.find((v) => v.id===item.props.vehiculoId);           
            const nombreConductor       = personasResult.find((p) => p.id===vehiculoR?.props.personalId)?.getNombreCompleto() || "";
            const contrato  = asignacionResult.find((c) => c.id === item.props.asignacionId)?.props.contrato||"-"; 
            //Actualizando Fechas 
		
            return {
                    id               : String(item.id),     
                    cod_vale        : item.props.codVale,
                    litros          : String(item.props.litros),
                    observaciones   : item.props.observaciones,
                    fecha_emision   : item.props.fechaEmision?moment(item.props.fechaEmision).format("DD/MM/YYYY").toString(): '',
                    fecha_validez   : item.props.fechaValidez?moment(item.props.fechaValidez).format("DD/MM/YYYY").toString(): '',
                    concepto        : item.props.concepto,
                    distancia       : String(item.props.distancia),
                    precio_unitario : String(item.props.precioUnitario),
                    precio_total    : String(item.props.precioTotal),
                    destino         : destino,
                    destinos        : item.props.destinos,
                    otro_vehiculo   : String(item.props.otroVehiculo),
                    num_apertura    : aperturaProgramatica,
                    placa           : placa,
                    estado          : String(item.props.estado),
                    gestion         : item.props.gestion!,
                    tipo            : tipo,
                    combustible     : combustible,   
                    usuario_nombre  : usuarioNombre,
                    area            : area,         
                    area_id         : areaId,
                    apertura_id     :aperturaGeneralId,
                    fecha_emision_date :  item.props.fechaEmision,
                    numero_recibo   : item.props.numeroRecibo,
                    litros_reales  : item.props.litrosReales,
                    precio_real    : item.props.precioReal,
                    numero_factura : item.props.numeroFactura,
                    fecha_factura  : item.props.fechaFactura?moment(item.props.fechaFactura).format("DD/MM/YYYY").toString(): '',
                    estado_ejecutado: item.props.estadoEjecutado,  
                    nombre_chofer   : nombreConductor,
                    contrato        : contrato,
                    
            };
        }).sort((a, b) =>a.fecha_emision_date > b.fecha_emision_date ? 1 : -1);  

        const filtroApertura : ValeTableModel [] = reporteValeR	
        .filter((value) => this.filtrarApertura(value.num_apertura!, apertura )); 
        const filtrarFecha : ValeTableModel[] = this.filtrarPorFecha(filtroApertura, fechaInicio, fechaFin);	        
        const response = findAndCountResult(filtrarFecha, query); 
    
        return Result.ok(response);    
   }

  public filtrarApertura(item:string, apertura:string) {       
        return (item === apertura);     
   }  

 public async getDatosContrato(fechaInicio: string, fechaFin: string, contrato:string, query:any): Promise<Result<{ rows: ValeTableModel[]  }>> {
               
    const reporteVale = await ValeService.getAll();
    if (reporteVale.isFailure) return Result.fail("Falló al obtener la vale");
    const reporteValeResult = reporteVale.getValue(); 
    /*Listado de apertura*/
    const aperturaProg = await AperturaGeneralService.getAll();
    if(aperturaProg.isFailure) return Result.fail("Fallo al obtener el aperturaProg");
    const aperturaResult = aperturaProg.getValue();
    /*Listado de area*/
    const area =await AreaService.getAll();
    if(area.isFailure) return Result.fail("Fallo al obtener el area");
    const areaResult = area.getValue();
   // Destino
    const destino = await DestinoService.getAll();
    if(destino.isFailure) return Result.fail("Fallo al obtener el destino");
    const destinoResult = destino.getValue();
    //usuario
    const usuario = await UsuarioService.getAll();
    if (usuario.isFailure) return Result.fail("Fallo al obtener el usuario");
    const usuarioResult = usuario.getValue();
     //Vehiculo
    const vehiculo = await VehiculoService.getAll();
    if(vehiculo.isFailure) return Result.fail("Fallo al obtener el vehiculo");
    const vehiculoResult = vehiculo.getValue();
    //ASignacion
    const asignacion = await AsignacionService.getAll();
    if(asignacion.isFailure) return Result.fail("Fallo al obtener el asignacion");
    const asignacionResult = asignacion.getValue();

      const personas = await PersonalService.getAll();
    if (personas.isFailure) return Result.fail("Falló al obtener la personas");
    const personasResult = personas.getValue();
                    
      const reporteValeR: ReporteValeItem[] = reporteValeResult.map((item) => {
            const aperturaGeneralId = asignacionResult.find((c) => c.id === item.props.asignacionId)?.props.partidaGeneralId||"-"; 
            const aperturaProgramatica       = aperturaResult.find((c) => c.id === aperturaGeneralId)?.props.aperturaProgramatica||"-"; 
            const areaId   = aperturaResult.find((c) => c.id === aperturaGeneralId)?.props.areaId||"-"; 
            const placa   = vehiculoResult.find((c)=>c.id === item.props.vehiculoId )?.props.numPlaca||"-"; 
            const tipo    = vehiculoResult.find((c)=>c.id === item.props.vehiculoId)?.props.tipo||"-"; 
            const combustible   = vehiculoResult.find((c)=>c.id === item.props.vehiculoId )?.props.carga||"-"; 
            const destino   = destinoResult.find((c)=>c.id === item.props.destino )?.props.nombre||"-"; 
            const usuarioNombre = usuarioResult.find((c)=>c.id === item.props.usuarioId)?.props.fullname||"-"; 
            const area  = areaResult.find((c)=>c.id === areaId)?.props.nombre||"-"; 
            const contrato  = asignacionResult.find((c) => c.id === item.props.asignacionId)?.props.contrato||"-"; 
            const vehiculoR             = vehiculoResult.find((v) => v.id===item.props.vehiculoId);           
            const nombreConductor       = personasResult.find((p) => p.id===vehiculoR?.props.personalId)?.getNombreCompleto() || "";
			
            //Actualizando Fechas 		
            return {
                    id               : String(item.id),     
                    cod_vale        : item.props.codVale,
                    litros          : String(item.props.litros),
                    observaciones   : item.props.observaciones,
                    fecha_emision   : item.props.fechaEmision?moment(item.props.fechaEmision).format("DD/MM/YYYY").toString(): '',
                    fecha_validez   : item.props.fechaValidez?moment(item.props.fechaValidez).format("DD/MM/YYYY").toString(): '',
                    concepto        : item.props.concepto,
                    distancia       : String(item.props.distancia),
                    precio_unitario : String(item.props.precioUnitario),
                    precio_total    : String(item.props.precioTotal),
                    destino         : destino,
                    destinos        : item.props.destinos,
                    otro_vehiculo   : String(item.props.otroVehiculo),
                    num_apertura    : aperturaProgramatica,
                    placa           : placa,
                    estado          : String(item.props.estado),
                    gestion         : item.props.gestion!,
                    tipo            : tipo,
                    combustible     : combustible,   
                    usuario_nombre  : usuarioNombre,
                    area            : area,         
                    area_id         : areaId,
                    apertura_id     :aperturaGeneralId,
                    fecha_emision_date :  item.props.fechaEmision,
                    numero_recibo   : item.props.numeroRecibo,
                    litros_reales  : item.props.litrosReales,
                    precio_real    : item.props.precioReal,
                    numero_factura : item.props.numeroFactura,
                    fecha_factura  : item.props.fechaFactura?moment(item.props.fechaFactura).format("DD/MM/YYYY").toString(): '',
                    estado_ejecutado: item.props.estadoEjecutado,  
                    contrato         : contrato,
                    nombre_chofer    : nombreConductor,
                    
            };
        }).sort((a, b) =>a.fecha_emision_date > b.fecha_emision_date ? 1 : -1);  

        const filtroApertura : ValeTableModel [] = reporteValeR			
        .filter((value) => this.filtrarContrato(value.contrato!, contrato )); 
      
        const filtrarFecha : ValeTableModel[] = this.filtrarPorFecha(filtroApertura, fechaInicio, fechaFin);	        
        const response = findAndCountResult(filtrarFecha, query); 
    
        return Result.ok(response);    
   }

   
  public filtrarContrato(item:string, contrato:string) {       
        return (item.includes(contrato));     
   }  

    public async getTipoCombustible(fechaInicio: string, fechaFin: string, combustible:string, query:any): Promise<Result<{ rows: ValeTableModel[]  }>> {
               
    const reporteVale = await ValeService.getAll();
    if (reporteVale.isFailure) return Result.fail("Falló al obtener la vale");
    const reporteValeResult = reporteVale.getValue(); 
    /*Listado de apertura*/
    const aperturaProg = await AperturaGeneralService.getAll();
    if(aperturaProg.isFailure) return Result.fail("Fallo al obtener el aperturaProg");
    const aperturaResult = aperturaProg.getValue();
    /*Listado de area*/
    const area =await AreaService.getAll();
    if(area.isFailure) return Result.fail("Fallo al obtener el area");
    const areaResult = area.getValue();
   // Destino
    const destino = await DestinoService.getAll();
    if(destino.isFailure) return Result.fail("Fallo al obtener el destino");
    const destinoResult = destino.getValue();
    //usuario
    const usuario = await UsuarioService.getAll();
    if (usuario.isFailure) return Result.fail("Fallo al obtener el usuario");
    const usuarioResult = usuario.getValue();
     //Vehiculo
    const vehiculo = await VehiculoService.getAll();
    if(vehiculo.isFailure) return Result.fail("Fallo al obtener el vehiculo");
    const vehiculoResult = vehiculo.getValue();
    //ASignacion
    const asignacion = await AsignacionService.getAll();
    if(asignacion.isFailure) return Result.fail("Fallo al obtener el asignacion");
    const asignacionResult = asignacion.getValue();

    const personas = await PersonalService.getAll();
    if (personas.isFailure) return Result.fail("Falló al obtener la personas");
    const personasResult = personas.getValue();
                    
      const reporteValeR: ReporteValeItem[] = reporteValeResult.map((item) => {
            const aperturaGeneralId = asignacionResult.find((c) => c.id === item.props.asignacionId)?.props.partidaGeneralId||"-"; 
            const aperturaProgramatica       = aperturaResult.find((c) => c.id === aperturaGeneralId)?.props.aperturaProgramatica||"-"; 
            const areaId   = aperturaResult.find((c) => c.id === aperturaGeneralId)?.props.areaId||"-"; 
            const placa   = vehiculoResult.find((c)=>c.id === item.props.vehiculoId )?.props.numPlaca||"-"; 
            const tipo    = vehiculoResult.find((c)=>c.id === item.props.vehiculoId)?.props.tipo||"-"; 
            const combustible   = vehiculoResult.find((c)=>c.id === item.props.vehiculoId )?.props.carga||"-"; 
            const destino   = destinoResult.find((c)=>c.id === item.props.destino )?.props.nombre||"-"; 
            const usuarioNombre = usuarioResult.find((c)=>c.id === item.props.usuarioId)?.props.fullname||"-"; 
            const area  = areaResult.find((c)=>c.id === areaId)?.props.nombre||"-"; 
            const vehiculoR             = vehiculoResult.find((v) => v.id===item.props.vehiculoId);           
            const nombreConductor       = personasResult.find((p) => p.id===vehiculoR?.props.personalId)?.getNombreCompleto() || "";
            const contrato  = asignacionResult.find((c) => c.id === item.props.asignacionId)?.props.contrato||"-"; 
            //Actualizando Fechas 
		
            return {
                    id               : String(item.id),     
                    cod_vale        : item.props.codVale,
                    litros          : String(item.props.litros),
                    observaciones   : item.props.observaciones,
                    fecha_emision   : item.props.fechaEmision?moment(item.props.fechaEmision).format("DD/MM/YYYY").toString(): '',
                    fecha_validez   : item.props.fechaValidez?moment(item.props.fechaValidez).format("DD/MM/YYYY").toString(): '',
                    concepto        : item.props.concepto,
                    distancia       : String(item.props.distancia),
                    precio_unitario : String(item.props.precioUnitario),
                    precio_total    : String(item.props.precioTotal),
                    destino         : destino,
                    destinos        : item.props.destinos,
                    otro_vehiculo   : String(item.props.otroVehiculo),
                    num_apertura    : aperturaProgramatica,
                    placa           : placa,
                    estado          : String(item.props.estado),
                    gestion         : item.props.gestion!,
                    tipo            : tipo,
                    combustible     : combustible,   
                    usuario_nombre  : usuarioNombre,
                    area            : area,         
                    area_id         : areaId,
                    apertura_id     :aperturaGeneralId,
                    fecha_emision_date :  item.props.fechaEmision,
                    numero_recibo   : item.props.numeroRecibo,
                    litros_reales  : item.props.litrosReales,
                    precio_real    : item.props.precioReal,
                    numero_factura : item.props.numeroFactura,
                    fecha_factura  : item.props.fechaFactura?moment(item.props.fechaFactura).format("DD/MM/YYYY").toString(): '',
                    estado_ejecutado: item.props.estadoEjecutado,  
                    nombre_chofer   : nombreConductor,
                    contrato        : contrato,
                    
            };
        }).sort((a, b) =>a.fecha_emision_date > b.fecha_emision_date ? 1 : -1);  

        const filtroApertura : ValeTableModel [] = reporteValeR	
        .filter((value) => this.filtrarApertura(value.combustible!, combustible )); 
        const filtrarFecha : ValeTableModel[] = this.filtrarPorFecha(filtroApertura, fechaInicio, fechaFin);	        
        const response = findAndCountResult(filtrarFecha, query); 
    
        return Result.ok(response);    
   }
  

    public async getDatosVehiculo(fechaInicio: string, fechaFin: string, placa:string, query:any): Promise<Result<{ rows: ValeTableModel[]  }>> {
               
    const reporteVale = await ValeService.getAll();
    if (reporteVale.isFailure) return Result.fail("Falló al obtener la vale");
    const reporteValeResult = reporteVale.getValue(); 
    /*Listado de apertura*/
    const aperturaProg = await AperturaGeneralService.getAll();
    if(aperturaProg.isFailure) return Result.fail("Fallo al obtener el aperturaProg");
    const aperturaResult = aperturaProg.getValue();
    /*Listado de area*/
    const area =await AreaService.getAll();
    if(area.isFailure) return Result.fail("Fallo al obtener el area");
    const areaResult = area.getValue();
   // Destino
    const destino = await DestinoService.getAll();
    if(destino.isFailure) return Result.fail("Fallo al obtener el destino");
    const destinoResult = destino.getValue();
    //usuario
    const usuario = await UsuarioService.getAll();
    if (usuario.isFailure) return Result.fail("Fallo al obtener el usuario");
    const usuarioResult = usuario.getValue();
     //Vehiculo
    const vehiculo = await VehiculoService.getAll();
    if(vehiculo.isFailure) return Result.fail("Fallo al obtener el vehiculo");
    const vehiculoResult = vehiculo.getValue();
    //ASignacion
    const asignacion = await AsignacionService.getAll();
    if(asignacion.isFailure) return Result.fail("Fallo al obtener el asignacion");
    const asignacionResult = asignacion.getValue();

    const personas = await PersonalService.getAll();
    if (personas.isFailure) return Result.fail("Falló al obtener la personas");
    const personasResult = personas.getValue();
                    
      const reporteValeR: ReporteValeItem[] = reporteValeResult.map((item) => {
            const aperturaGeneralId = asignacionResult.find((c) => c.id === item.props.asignacionId)?.props.partidaGeneralId||"-"; 
            const aperturaProgramatica       = aperturaResult.find((c) => c.id === aperturaGeneralId)?.props.aperturaProgramatica||"-"; 
            const areaId   = aperturaResult.find((c) => c.id === aperturaGeneralId)?.props.areaId||"-"; 
            const placa   = vehiculoResult.find((c)=>c.id === item.props.vehiculoId )?.props.numPlaca||"-"; 
            const tipo    = vehiculoResult.find((c)=>c.id === item.props.vehiculoId)?.props.tipo||"-"; 
            const combustible   = vehiculoResult.find((c)=>c.id === item.props.vehiculoId )?.props.carga||"-"; 
            const destino   = destinoResult.find((c)=>c.id === item.props.destino )?.props.nombre||"-"; 
            const usuarioNombre = usuarioResult.find((c)=>c.id === item.props.usuarioId)?.props.fullname||"-"; 
            const area  = areaResult.find((c)=>c.id === areaId)?.props.nombre||"-"; 
            const vehiculoR             = vehiculoResult.find((v) => v.id===item.props.vehiculoId);           
            const nombreConductor       = personasResult.find((p) => p.id===vehiculoR?.props.personalId)?.getNombreCompleto() || "";
            const contrato  = asignacionResult.find((c) => c.id === item.props.asignacionId)?.props.contrato||"-"; 
            //Actualizando Fechas 
		
            return {
                    id               : String(item.id),     
                    cod_vale        : item.props.codVale,
                    litros          : String(item.props.litros),
                    observaciones   : item.props.observaciones,
                    fecha_emision   : item.props.fechaEmision?moment(item.props.fechaEmision).format("DD/MM/YYYY").toString(): '',
                    fecha_validez   : item.props.fechaValidez?moment(item.props.fechaValidez).format("DD/MM/YYYY").toString(): '',
                    concepto        : item.props.concepto,
                    distancia       : String(item.props.distancia),
                    precio_unitario : String(item.props.precioUnitario),
                    precio_total    : String(item.props.precioTotal),
                    destino         : destino,
                    destinos        : item.props.destinos,
                    otro_vehiculo   : String(item.props.otroVehiculo),
                    num_apertura    : aperturaProgramatica,
                    placa           : placa,
                    estado          : String(item.props.estado),
                    gestion         : item.props.gestion!,
                    tipo            : tipo,
                    combustible     : combustible,   
                    usuario_nombre  : usuarioNombre,
                    area            : area,         
                    area_id         : areaId,
                    apertura_id     :aperturaGeneralId,
                    fecha_emision_date :  item.props.fechaEmision,
                    numero_recibo   : item.props.numeroRecibo,
                    litros_reales  : item.props.litrosReales,
                    precio_real    : item.props.precioReal,
                    numero_factura : item.props.numeroFactura,
                    fecha_factura  : item.props.fechaFactura?moment(item.props.fechaFactura).format("DD/MM/YYYY").toString(): '',
                    estado_ejecutado: item.props.estadoEjecutado,  
                    nombre_chofer   : nombreConductor,
                    contrato        : contrato,
                    
            };
        }).sort((a, b) =>a.fecha_emision_date > b.fecha_emision_date ? 1 : -1);  

        const filtroApertura : ValeTableModel [] = reporteValeR	
        .filter((value) => this.filtrarPlaca(value.placa!, placa )); 
        const filtrarFecha : ValeTableModel[] = this.filtrarPorFecha(filtroApertura, fechaInicio, fechaFin);	        
        const response = findAndCountResult(filtrarFecha, query); 
    
        return Result.ok(response);    
   }
 public filtrarPlaca(item:string, placa:string) {       
        return (item.includes(placa));     
   }  

   public async generarFilasExcel(authUser: AuthUser, queryString: any, id?: string, listaIds?: string[], fechaInicio?: string, fechaFin?: string): Promise<Result<ReporteValeDataResponse>> {
     
       const resultObject = queryStringToArray(queryString);              
       const info = await this.getInfoReporteValeData(authUser, resultObject); // Datos generales
       const data = await this.getReporteValeData(resultObject, id, listaIds, fechaInicio, fechaFin); 
       //  Asegúrate que este `data` sea un ARRAY de objetos planos
       // con los campos que deseas mostrar en el Excel.
       return Result.ok({
           info,
           data
       });
   }
   
   public getFormatData(data: ReporteValeDataR | undefined, tipoReporte: string)  {
      
       const listaData : ReportGeneral[] = [];
       let item : ReportGeneral ;
       if(data != null && data != undefined ){
                 
            if (tipoReporte != ENUM_REPORTE_FINAL){
                for (let i = 0; i < data.rows.length; i++) {
                  item = {
                   numero              : Number(i+1),
                   fecha_factura       : String(data.rows[i].fecha_factura),     
                   fecha_emision       : String(data.rows[i].fecha_emision),     
                   nombre_chofer       : String(data.rows[i].nombre_chofer),        
                   placa               : String(data.rows[i].placa),           
                   num_apertura        : String(data.rows[i].num_apertura),
                   area                : String(data.rows[i].area),          
                   numero_factura      : Number(data.rows[i].numero_factura), // corregido de string a numero hay que aumentar lo real
                   cod_vale            : String(data.rows[i].cod_vale),
                   numero_recibo       : Number(data.rows[i].numero_recibo),             
                   destino             : String(data.rows[i].destino), 
                   distancia           : Number(data.rows[i].distancia), 
                   litros              : Number(data.rows[i].litros),
                   precio_unitario     : Number(data.rows[i].precio_unitario),  
                   precio_total        : Number(data.rows[i].precio_total),                          
                   litros_reales       : Number(data.rows[i].litros_reales),  
                   precio_real         : Number(data.rows[i].precio_real),          
                    
                   area_id              : String(data.rows[i].area_id),
                   estado               : String(data.rows[i].estado),
                   estado_ejecutado     : String(data.rows[i].estado_ejecutado),
                 }
                  listaData.push(item)           
               }
            }else{
           
                for (let i = 0; i < data.reporte_final!.length; i++) {
                    item  = {
                    numero              : Number(i+1),                  
                    num_apertura        : String(data.reporte_final![i].apertura_programatica),                 
                    total_litros_reales : Number(data.reporte_final![i].total_litros_reales), 
                    total_precio_real   : Number(data.reporte_final![i].total_precio_real), 
                        
                    //  area_id        : String(data.rows[i].area_id),
                    
                    }
                listaData.push(item)           
                }    
            
              }
               
             
              return listaData;    
            
       }
   
     }
   
public generarHeadExcel(tipo:string) {   
    
    const headList : Partial<Column>[] =  [];
   switch(tipo){
    case ENUM_GENERAL:
    headList.push( { header: 'Nº', key: 'numero', width: 8 },
        { header: 'Fecha Emision', key: 'fecha_emision', width: 15 },       
        { header: 'Fecha Factura', key: 'fecha_factura', width: 15 },    
        { header: 'Nombre chofer', key: 'nombre_chofer', width: 40 },     
        { header: 'Placa', key: 'placa', width: 15 },      
        { header: 'Apertura Programatica', key: 'num_apertura', width: 25 },    
        { header: 'Area', key: 'area', width: 70 },
        { header: 'Distancia', key: 'distancia', width: 15 },
        { header: 'Cantidad Litros', key: 'litros', width: 15 },
         { header: 'Precio Unitario', key: 'precio_unitario', width: 20 },
        { header: 'Precio Total', key: 'precio_total', width: 20 },
        { header: 'Numero Factura', key: 'numero_factura', width: 15 },
        { header: 'Codigo Vale', key: 'cod_vale', width: 15 },
        { header: 'Numero Vale Manual', key: 'numero_recibo', width: 20 },
        { header: 'Destino', key: 'destino', width: 30 },     
        { header: 'Litros Reales', key: 'litros_reales', width: 15 },  
        { header: 'Precio Real', key: 'precio_real', width: 15 }, 
        { header: 'Estado Pre Aprobado', key: 'estado', width: 20 },      
        { header: 'Estado ejecutado', key: 'estado_ejecutado', width: 20 },)      
              
        
        
        return headList;   
   
    case ENUM_REPORTE_POR_PROYECTO:
       headList.push( { header: 'Nº', key: 'numero', width: 8 },
        { header: 'Fecha Emision', key: 'fecha_emision', width: 15 },       
        { header: 'Fecha Factura', key: 'fecha_factura', width: 15 },       
        { header: 'Nombre chofer', key: 'nombre_chofer', width: 40 },     
        { header: 'Placa', key: 'placa', width: 15 },      
        { header: 'Apertura Programatica', key: 'num_apertura', width: 25 },    
        { header: 'Area', key: 'area', width: 70 },
        { header: 'Distancia', key: 'distancia', width: 15 },
        { header: 'Cantidad Litros', key: 'litros', width: 15 },
        { header: 'Precio Unitario', key: 'precio_unitario', width: 20 },
        { header: 'Precio Total', key: 'precio_total', width: 20 },
        { header: 'Numero Factura', key: 'numero_factura', width: 15 },
        { header: 'Codigo Vale', key: 'cod_vale', width: 15 },
        { header: 'Numero Vale Manual', key: 'numero_recibo', width: 20 },
        { header: 'Destino', key: 'destino', width: 30 },     
        { header: 'Litros Reales', key: 'litros_reales', width: 15 },  
        { header: 'Precio Real', key: 'precio_real', width: 15 },
        { header: 'Estado Pre Aprobado', key: 'estado', width: 20 },      
        { header: 'Estado ejecutado', key: 'estado_ejecutado', width: 20 },)      
                    
        
        return headList;  
   
   
    case ENUM_REPORTE_POR_APERTURA:
         headList.push( { header: 'Nº', key: 'numero', width: 8 },
        { header: 'Fecha Emision', key: 'fecha_emision', width: 15 },       
        { header: 'Fecha Factura', key: 'fecha_factura', width: 15 },       
        { header: 'Nombre chofer', key: 'nombre_chofer', width: 40 },     
        { header: 'Placa', key: 'placa', width: 15 },      
        { header: 'Apertura Programatica', key: 'num_apertura', width: 25 },    
        { header: 'Area', key: 'area', width: 70 },
        { header: 'Distancia', key: 'distancia', width: 15 },
        { header: 'Cantidad Litros', key: 'litros', width: 15 },
        { header: 'Precio Unitario', key: 'precio_unitario', width: 20 },
        { header: 'Precio Total', key: 'precio_total', width: 20 },
        { header: 'Numero Factura', key: 'numero_factura', width: 15 },
        { header: 'Codigo Vale', key: 'cod_vale', width: 15 },
        { header: 'Numero Vale Manual', key: 'numero_recibo', width: 20 },
        { header: 'Destino', key: 'destino', width: 30 },     
        { header: 'Litros Reales', key: 'litros_reales', width: 15 },  
        { header: 'Precio Real', key: 'precio_real', width: 15 },
        { header: 'Estado Pre Aprobado', key: 'estado', width: 20 },            
         { header: 'Estado ejecutado', key: 'estado_ejecutado', width: 20 },)      
              
        return headList;   
    
    case ENUM_REPORTE_POR_TIPO:
        headList.push( { header: 'Nº', key: 'numero', width: 8 },
        { header: 'Fecha Emision', key: 'fecha_emision', width: 15 },       
        { header: 'Fecha Factura', key: 'fecha_factura', width: 15 },       
        { header: 'Nombre chofer', key: 'nombre_chofer', width: 40 },     
        { header: 'Placa', key: 'placa', width: 15 },      
        { header: 'Apertura Programatica', key: 'num_apertura', width: 25 },    
        { header: 'Area', key: 'area', width: 70 },
        { header: 'Numero Factura', key: 'numero_factura', width: 15 },
        { header: 'Codigo Vale', key: 'cod_vale', width: 15 },
        { header: 'Numero Vale Manual', key: 'numero_recibo', width: 20 },
        { header: 'Destino', key: 'destino', width: 30 },  
        { header: 'Distancia', key: 'distancia', width: 15 },
        { header: 'Litros BB.SS.', key: 'litros', width: 15 }, 
        { header: 'Precio Unitario', key: 'precio_unitario', width: 20 }, 
        { header: 'Precio BB.SS.', key: 'precio_total', width: 15 },   
        { header: 'Litros Reales', key: 'litros_reales', width: 15 },  
        { header: 'Precio Real', key: 'precio_real', width: 15 },
        { header: 'Estado Pre Aprobado', key: 'estado', width: 20 },      
        { header: 'Estado ejecutado', key: 'estado_ejecutado', width: 20 },)      
                    
        
        return headList;  

    case ENUM_REPORTE_FINAL:
        headList.push( { header: 'Nº', key: 'numero', width: 8 },        
        { header: 'Apertura Programatica', key: 'num_apertura', width: 30 },          
        { header: 'Total Litros Reales', key: 'total_litros_reales', width: 30 },  
        { header: 'Total Precio Real', key: 'total_precio_real', width: 30 },)      
        
        return headList;   
                           
  // }
                           
   }
   
}

}
