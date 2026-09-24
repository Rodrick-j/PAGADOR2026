import moment from "moment";
import { Result } from "../../../../base/types/Result";
import { compararFechasEntre, findAndCountResult } from "../../../../tools/util";
import { AuthUser } from "../../../../base/types/AuthUser";

import UsuarioService from "../../../../core/system/autenticacion/usuario";
import RoleService from "../../../../core/system/autenticacion/role";
import ProcesoService from "../../../../core/admin/contra/proceso";
import AreaService from "../../../../core/rrhh/area";
import ActividadService from "../../../../core/admin/contra/actividad";
import PersonalService from "../../../../core/rrhh/personal";
import CargoService from "../../../../core/rrhh/cargo";
import { ActividadFormDataResponse, ActividadPaso } from "../actividad/ActividadView";

type ProcesoTableModel = {
    id                     : string;
    objeto_contratacion    : string;
    modalidad_sigla        : string;
    codigo_interno_entidad : string;
    cuce                   : string;
    imagen                 : string;
    imagen2                : string;
    imagen3                : string;
    fecha_registro         : string;
    gestion                : string;
    hoja_ruta              : string;
    solicitante            : string;
    responsable            : string;
    area                   : string;
    tipo                  ?: string;
    area2                  : string;
    area3                  : string;
    estado                 : string;
    estado_activo          : string | null;
};

type ProcesoTable500Model = {
    id                    : string;
    cuce                  : string;
    objeto_contratacion   : string;
    hoja_ruta             : string;
    codigo_interno_entidad: string;

    conclusion200         : string;
    conclusion220         : string;    
    conclusion500         : string;

    fecha_cierre          : string;
    fecha_registro        : string;
    estado                : string;
    estado_activo         : string | null;
};

export type GetProcesosTableResponse = {
    rows: ProcesoTableModel[];
    count: number;
};

export type ReportFilters = {
    tipo?: string;
    nombre?: string;
    telefono?: string;
    direccion?: string;

    _limit?: string;
    _page?: string;
    q?: string;
};

export type ProcesoFormDataResponse = {
    id: string;
    objeto_contratacion: string;
    modalidad_descripcion: string;
    modalidad_sigla: string;
    codigo_interno_entidad: string;
    cuce: string;
    fecha_registro: Date;
    gestion: string;
    hoja_ruta: string;
    estado: string;
    usuario_id: string | null;
    usuario_solicitante_id: string | null;
    usuario_solicitante2_id: string | null;
    usuario_solicitante3_id: string | null;
    estado_activo: string | null;
    area_id: string | null;
};

export type ProcesoDetalleProps = {
    id?: string;
    notificacionSolicitante: boolean;
    notificacion: boolean;
    observacion: string;
    fechaEnvio: Date | null;
    estado: string;
};

export type EstadosPasosProps = {
    id?: string;
    paso: number;
    estado: string;
};

export type ActividadTableModel = {
    id?: string;
    titulo: string;
    subtitulo: string;
    descripcion: string;
    paso: number;
    tiempo: string;
    notificacion: boolean;
    notificacion_solicitante: boolean;
    observacion: string;
    fecha: Date;
    fecha_limite: Date;
    fecha_envio2: Date | null;
    fecha_envio: string | null;
    imagen: string;
    estado: string;
    usuario_solicitante_id?: string;
    usuario_solicitante2_id?: string;
    usuario_solicitante3_id?: string;
    hoja_ruta?: string;

    usuario_id: string;
    proceso_id: string;

    usuario_habilitado?: string;
    usuario_TC_id?: string;
    usuario_RPARPC_id?: string;
    usuario_TES_id?: string;
    usuario_TJ_id?: string;
};

export type ActividadPasoResponsableTable = {
    id?: string;
    paso: number;
    fecha: Date;
    fecha_limite: Date;
    estado: string;
    usuario_solicitante_id?: string;
    usuario_solicitante2_id?: string;
    usuario_solicitante3_id?: string;
    notificacion_solicitante: boolean;
    // hoja_ruta?               : string;
    usuario_habilitado?: string;
    usuario_id: string;
    proceso_id: string;
};

export type ProcesosOptionsFormModel = {
    id: string;
    nombre: string;
    concepto: string;
};

export type InfoReporteModel = {
    objeto: string;
    modalidad: string;
    codigo: string;
    codigoQR: string;
    cuce: string;
    hoja_ruta: string;
    responsable: string;
    solicitante: string;
    gestion: string;
    fecha_inicio: string;
    email: string;
};

export type InfoReporteGeneralModel = {
    codigoQR : string;
    fecha    : string;    
};

export type procesoItem = {
    paso: number;
    titulo: string;
    fecha: string;
    responsable: string;
    fecha_envio: string;
};

export type procesoGeneralItem = {    
    objeto_contratacion: string;
    codigo_interno     : string;
    fecha              : string;
    area               : string;
    pasos_tes          : propRow[];
    pasos_tj            : propRow[];
    pasos_tc            : propRow[];
    paso_actual        : string;
    estado             : string;
};

export type lineaTemporalItem = {
    paso: number;
    total_dias: number;
    dia_inicial: number;
};

export type ProcesoReporte = {
    tasks: any;
    lineas: lineaTemporalItem[];
    rows: procesoItem[];
};

export type ProcesoGeneralReporte = {
    rows: procesoGeneralItem[];
};

export type ProcesoGeneralData = {
    info: InfoReporteGeneralModel;
    data: ProcesoGeneralReporte;
};

export type ProcesoData = {
    info: InfoReporteModel;
    data: ProcesoReporte;
};

export type fechaLimiteOptionsFormModel = {
    id: string;
    id_proceso: string;
    fecha_inicio: Date;
    fecha_limite: Date;
};

type propRow = {
    paso: number;
    estado: string;
}

export class ProcesoView {
    public async getProcesosTable(query: any, authUser: AuthUser ): Promise<Result<{ rows: ProcesoTableModel[] }>> {
        const ID_USUARIO = authUser.uid;

        const proceso = await ProcesoService.getAll();
        if (proceso.isFailure) return Result.fail("Falló al obtener la proceso");
        let procesoResult = proceso.getValue();
        
        const usuarios = await UsuarioService.getAll();
        if (usuarios.isFailure) Result.fail(String(usuarios.error));
        const usuarioResult = usuarios.getValue();

        const ID_ROLE = usuarioResult.find((u) => u.id ===ID_USUARIO)?.props.roleId || "";
        const rolesResult = await RoleService.getById(ID_ROLE);
        const permisos = JSON.parse(rolesResult.getValue().props.permisos);
        const is_approve = typeof permisos.approve !== 'undefined'? permisos.approve: false;

        /*filtrado*/
        if (!authUser.superadministrador){  
            if(!is_approve) {          
                procesoResult = procesoResult.filter((a) => a.props.usuarioId === ID_USUARIO 
                                                    || a.props.usuarioSolicitanteId === ID_USUARIO || a.props.usuarioSolicitante2Id === ID_USUARIO
                                                    || a.props.usuarioSolicitante3Id === ID_USUARIO
                                                );
            }                                                
        }    

        if (!procesoResult) return Result.fail("Error no existe Proceso ");
        
        /*fin Filtrado*/
        
        const persona = await PersonalService.getAll();
        if (persona.isFailure) Result.fail(String(persona.error));

        const cargo = await CargoService.getAll();
        if (cargo.isFailure) Result.fail(String(cargo.error));

        const area = await AreaService.getAll();
        if (area.isFailure) return Result.fail("Falló al obtener la area");
        const areaResult = area.getValue();

        const result: ProcesoTableModel[] = procesoResult
            .sort((a, b) => (a.props.fechaRegistro < b.props.fechaRegistro ? 1 : -1))
            .map((item) => {
                //Responsable
                const usuario  = usuarioResult.find((u) => u.id === item.props.usuarioSolicitanteId);
                const usuario2 = usuarioResult.find((u) => u.id === item.props.usuarioSolicitante2Id);
                const usuario3 = usuarioResult.find((u) => u.id === item.props.usuarioSolicitante3Id);

                const personaResult = persona
                    .getValue()
                    .find((p) => p.props.usuarioId === item.props.usuarioSolicitanteId);
                const ID_AREA = personaResult?.props.areaId || "";
                const areaNombre = areaResult.find((a) => a.id === ID_AREA)?.props.nombre || "";

                const persona2Result = persona
                    .getValue()
                    .find((p) => p.props.usuarioId === item.props.usuarioSolicitante2Id);
                const ID_AREA2 = persona2Result?.props.areaId || "";
                const areaNombre2 = areaResult.find((a) => a.id === ID_AREA2)?.props.nombre || "";

                const persona3Result = persona
                    .getValue()
                    .find((p) => p.props.usuarioId === item.props.usuarioSolicitante3Id);
                const ID_AREA3 = persona3Result?.props.areaId || "";
                const areaNombre3 = areaResult.find((a) => a.id === ID_AREA3)?.props.nombre || "";

                return {
                    id                    : String(item.id),
                    objeto_contratacion   : item.props.objetoContratacion,
                    modalidad_sigla       : item.props.modalidadSigla,
                    modalidad_descripcion : item.props.modalidadDescripcion,
                    codigo_interno_entidad: item.props.codigoInternoEntidad,
                    cuce                  : item.props.cuce,
                    imagen                : usuario2?.props.avatar || "",
                    imagen2               : usuario?.props.avatar || "",
                    imagen3               : usuario3?.props.avatar || "",
                    solicitante           : usuario2?.getNombreCompleto() || "",
                    responsable           : usuario?.getNombreCompleto() || "",
                    juridica              : usuario3?.getNombreCompleto() || "",
                    area                  : areaNombre2,
                    area2                 : areaNombre,
                    area3                 : areaNombre3,
                    hoja_ruta             : item.props.hojaRuta,
                    fecha_registro        : moment(item.props.fechaRegistro).format("DD/MM/YYYY HH:mm").toString(),
                    fecha_registro_       : item.props.fechaRegistro,
                    gestion               : item.props.gestion,
                    estado                : item.props.estado,
                    estado_activo         : item.props.estadoActivo,
                };
            })
            .sort((a, b) => (moment(a.fecha_registro_).toDate() < moment(b.fecha_registro_).toDate() ? 1 : -1));

        const response = findAndCountResult(result, query);
        return Result.ok(response);
    }

    public async getReporteProcesosTable(query: any, authUser: AuthUser ): Promise<Result<{ rows: ProcesoTableModel[] }>> {
        const proceso = await ProcesoService.getAll();
        if (proceso.isFailure) return Result.fail("Falló al obtener la proceso");
        let procesoResult = proceso.getValue();

        const usuarios = await UsuarioService.getAll();
        if (usuarios.isFailure) Result.fail(String(usuarios.error));
        const usuarioResult = usuarios.getValue();

        const persona = await PersonalService.getAll();
        if (persona.isFailure) Result.fail(String(persona.error));

        const cargo = await CargoService.getAll();
        if (cargo.isFailure) Result.fail(String(cargo.error));

        const areas = await AreaService.getAll();
        if (areas.isFailure) return Result.fail("Falló al obtener la area");
        const areaResult = areas.getValue();        

         /*filtrado*/
         const ID_USUARIO = authUser.uid;
         if (authUser.superadministrador) {
              procesoResult = proceso.getValue();
         } 
         else if(authUser.permisos && authUser.permisos.approve){
                procesoResult = proceso.getValue();
         }
         else{
             procesoResult = procesoResult.filter((a) => a.props.usuarioId === ID_USUARIO 
             || a.props.usuarioSolicitanteId === ID_USUARIO || a.props.usuarioSolicitante2Id === ID_USUARIO
             || a.props.usuarioSolicitante3Id === ID_USUARIO); 
         }

         if (!procesoResult) return Result.fail("Error no existe Proceso ");
         
              /*fin Filtrado*/

              const result: ProcesoTableModel[] = procesoResult              
              .map((item) => {
                  //Responsable
                  const usuario  = usuarioResult.find((u) => u.id === item.props.usuarioSolicitanteId);
                  const usuario2 = usuarioResult.find((u) => u.id === item.props.usuarioSolicitante2Id);
                  const usuario3 = usuarioResult.find((u) => u.id === item.props.usuarioSolicitante3Id);
  
                  const personaResult = persona
                      .getValue()
                      .find((p) => p.props.usuarioId === item.props.usuarioSolicitanteId);
                  const ID_AREA = personaResult?.props.areaId || "";
                  const areaNombre = areaResult.find((a) => a.id === ID_AREA)?.props.nombre || "";
  
                  const persona2Result = persona
                      .getValue()
                      .find((p) => p.props.usuarioId === item.props.usuarioSolicitante2Id);
                  const ID_AREA2 = persona2Result?.props.areaId || "";
                  const areaNombre2 = areaResult.find((a) => a.id === ID_AREA2)?.props.nombre || "";
  
                  const persona3Result = persona
                      .getValue()
                      .find((p) => p.props.usuarioId === item.props.usuarioSolicitante3Id);
                  const ID_AREA3 = persona3Result?.props.areaId || "";
                  const areaNombre3 = areaResult.find((a) => a.id === ID_AREA3)?.props.nombre || "";

                  const secretaria = areaResult.find((a) => a.id === item.props.areaId)?.props.nombre || "";
  
                  return {
                      id                    : String(item.id),
                      objeto_contratacion   : item.props.objetoContratacion,
                      modalidad_sigla       : item.props.modalidadSigla,
                      modalidad_descripcion : item.props.modalidadDescripcion,
                      codigo_interno_entidad: item.props.codigoInternoEntidad,
                      cuce                  : item.props.cuce,
                      imagen                : usuario2?.props.avatar || "",
                      imagen2               : usuario?.props.avatar || "",
                      imagen3               : usuario3?.props.avatar || "",
                      solicitante           : usuario2?.getNombreCompleto() || "",
                      responsable           : usuario?.getNombreCompleto() || "",
                      juridica              : usuario3?.getNombreCompleto() || "",
                      area                  : areaNombre2,
                      tipo                  : item.props.modalidadSigla,
                      secretaria            : secretaria,
                      area2                 : areaNombre,
                      area3                 : areaNombre3,
                      hoja_ruta             : item.props.hojaRuta,
                      fecha_registro        : moment(item.props.fechaRegistro).format("DD/MM/YYYY HH:mm").toString(),
                      fecha_registro_       : item.props.fechaRegistro,
                      gestion               : item.props.gestion,
                      estado                : item.props.estado,
                      estado_activo         : item.props.estadoActivo,
                  };
              })
              .sort((a, b) => (moment(a.fecha_registro_).toDate() < moment(b.fecha_registro_).toDate() ? 1 : -1));
  
          const response = findAndCountResult(result, query);
          return Result.ok(response);
    }

    public async getReporteProcesosTable500(query: any): Promise<Result<{ rows: ProcesoTable500Model[] }>> {
        const proceso = await ProcesoService.getAll();
        if (proceso.isFailure) return Result.fail("Falló al obtener la proceso");
        const procesoResult = proceso.getValue();

        const actividad = await ActividadService.getAll();
        if (actividad.isFailure) return Result.fail("Falló al obtener la actividad");
        const actividadResult = actividad.getValue();

        const regex500 = /\b500\b/;
        const regex200 = /\b200\b/;
        const regex220 = /\b220\b/;
        const regexCierre = /\bFin\b/;

        const result: ProcesoTable500Model[] = procesoResult
                                                        .map((item) => {
                                                            //500
                                                            const act500 = actividadResult.find((a) => a.props.procesoId===item.id && regex500.test(a.props.titulo));                                                            
                                                            const act500Paso = actividadResult.find((a) => a.props.paso===1 && a.props.procesoId===item.id);                                                            
                                                            const fechaInicio500 = moment(act500?.props.fecha);
                                                            const fechaFin500    = moment(act500?.props.fechaLimite);
                                                            const diffDays500    = fechaFin500.diff(fechaInicio500, 'days');
                                                            const fechaInicio500Paso = moment(act500Paso?.props.fecha);
                                                            const diffDays500Paso    = fechaFin500.diff(fechaInicio500Paso, 'days');
                                                            const diffDays500Total = diffDays500Paso - diffDays500;
                                                            const conclusion500=diffDays500Total+" dias";                                                            
                                                            //200
                                                            const act200 = actividadResult.find((a) => a.props.procesoId===item.id && regex200.test(a.props.titulo));                                                            
                                                            const act200Paso = actividadResult.find((a) => a.props.paso===1 && a.props.procesoId===item.id);                                                            
                                                            const fechaInicio200 = moment(act200?.props.fecha);
                                                            const fechaFin200    = moment(act200?.props.fechaLimite);
                                                            const diffDays200    = fechaFin200.diff(fechaInicio200, 'days');
                                                            const fechaInicio200Paso = moment(act200Paso?.props.fecha);
                                                            const diffDays200Paso    = fechaFin200.diff(fechaInicio200Paso, 'days');
                                                            const diffDays200Total = diffDays200Paso - diffDays200;
                                                            //220
                                                            const act220 = actividadResult.find((a) => a.props.procesoId===item.id && regex220.test(a.props.titulo));                                                            
                                                            const act220Paso = actividadResult.find((a) => a.props.paso===1 && a.props.procesoId===item.id);                                                            
                                                            const fechaInicio220 = moment(act220?.props.fecha);
                                                            const fechaFin220    = moment(act220?.props.fechaLimite);
                                                            const diffDays220    = fechaFin220.diff(fechaInicio220, 'days');
                                                            const fechaInicio220Paso = moment(act220Paso?.props.fecha);
                                                            const diffDays220Paso    = fechaFin220.diff(fechaInicio220Paso, 'days');
                                                            const diffDays220Total = diffDays220Paso - diffDays220;
                                                            
                                                            const conclusion200=diffDays200Total>0?diffDays200Total+" dias":diffDays220Total+" dias";
                                                            const conclusion220=diffDays200Total>0?diffDays200Total+" dias":diffDays220Total+" dias";
                                                            
                                                            const cierre = actividadResult.find((a) => a.props.procesoId===item.id && regexCierre.test(a.props.titulo));
                                                            const fechaCierre = cierre?.props.fechaLimite;
                                                            return {
                                                                id                    : String(item.id),
                                                                objeto_contratacion   : item.props.objetoContratacion,
                                                                modalidad_sigla       : item.props.modalidadSigla,
                                                                modalidad_descripcion : item.props.modalidadDescripcion,
                                                                codigo_interno_entidad: item.props.codigoInternoEntidad,
                                                                cuce                  : item.props.cuce,
                                                                hoja_ruta             : item.props.hojaRuta,
                                                                conclusion200         : conclusion200,
                                                                conclusion220         : conclusion220,
                                                                conclusion500         : conclusion500,
                                                                gestion               : item.props.gestion,
                                                                estado                : item.props.estado,
                                                                estado_activo         : item.props.estadoActivo,
                                                                fecha_registro        : moment(item.props.fechaRegistro).locale('es').format('dddd D [de] MMMM [de] YYYY hh:mm a').toString(),
                                                                fecha_cierre          : moment(fechaCierre).locale('es').format('dddd D [de] MMMM [de] YYYY hh:mm a').toString(),
                                                                fecha_registro_       : item.props.fechaRegistro,
                                                            };
                                                        })
                                                        .sort((a, b) => (moment(a.fecha_registro_).toDate() < moment(b.fecha_registro_).toDate() ? 1 : -1));

        const response = findAndCountResult(result, query);
        return Result.ok(response);
    }

    public async getProcesoFormDataView(id_proceso: string): Promise<Result<ProcesoFormDataResponse>> {
        const proceso = await ProcesoService.getById(id_proceso);
        if (proceso.isFailure) return Result.fail<ProcesoFormDataResponse>("Proceso no encontrado");

        const props = proceso.getValue().props;

        const result: ProcesoFormDataResponse = {
            id: proceso.getValue().id,
            objeto_contratacion: props.objetoContratacion,
            modalidad_descripcion: props.modalidadDescripcion,
            modalidad_sigla: props.modalidadSigla,
            codigo_interno_entidad: props.codigoInternoEntidad,
            cuce: props.cuce,
            fecha_registro: props.fechaRegistro,
            gestion: props.gestion,
            estado: props.estado,
            hoja_ruta: props.hojaRuta,
            usuario_id: props.usuarioId,
            usuario_solicitante_id: props.usuarioSolicitanteId,
            usuario_solicitante2_id: props.usuarioSolicitante2Id,
            usuario_solicitante3_id: props.usuarioSolicitante3Id,
            estado_activo: props.estadoActivo,
            area_id: props.areaId,
        };

        return Result.ok(result);
    }

    public async getTableProcesoDetalle(
        authUser: AuthUser,
        query: any,
        proceso_id: string,
    ): Promise<Result<{ rows: ActividadTableModel[] }>> {
        const ID_USUARIO = authUser.uid;
        const usuario = await UsuarioService.getById(ID_USUARIO);
        if (usuario.isFailure) throw new Error(String(usuario.error));
        //Proceso
        const proceso = await ProcesoService.getAll();
        if (proceso.isFailure) Result.fail(String(proceso.error));
        const procesoResult = proceso.getValue();

        const usuarios = await UsuarioService.getAll();
        if (usuarios.isFailure) Result.fail(String(usuarios.error));
        const usuarioResult = usuarios.getValue();
        //

        const usuarioSolicitante1 = procesoResult.find((a) => a.id === proceso_id)?.props.usuarioSolicitanteId || ""; //RPARPC
        const usuarioSolicitante2 = procesoResult.find((a) => a.id === proceso_id)?.props.usuarioSolicitante2Id || ""; //TES
        const usuarioSolicitante3 = procesoResult.find((a) => a.id === proceso_id)?.props.usuarioSolicitante3Id || ""; //TJ
        const nombreResponsable1 =
            usuarioResult.find((a) => a.id === usuarioSolicitante1)?.getNombreConApellido() || "";
        const nombreResponsable2 =
            usuarioResult.find((a) => a.id === usuarioSolicitante2)?.getNombreConApellido() || "";
        const nombreResponsable3 =
            usuarioResult.find((a) => a.id === usuarioSolicitante3)?.getNombreConApellido() || "";
        const hojaRuta = procesoResult.find((a) => a.id === proceso_id)?.props.hojaRuta || "";
        const usuarioContrataciones = procesoResult.find((a) => a.id === proceso_id)?.props.usuarioId || ""; //TC
        const nombreContrataciones =
            usuarioResult.find((a) => a.id === usuarioContrataciones)?.getNombreConApellido() || "";
        //Estado
        const estadoActivo = procesoResult.find((a) => a.id === proceso_id)?.props.estadoActivo || "";

        /* listado de actividades */
        const actividad = await ActividadService.getAll();
        if (actividad.isFailure) return Result.fail("Falló al obtener la actividad");
        const actividadResult = actividad.getValue().filter((a) => a.props.procesoId === proceso_id);
        // Verificacion de Responsables

        /*Salida de la modalidad*/
        const sigla = procesoResult.find((u) => u.id === proceso_id)?.props.modalidadSigla;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const tipoModalidad = this.cargarModalidad(sigla!);

        //Modalidad

        let count = 0;
        let count2 = 0;
        /* listado general de la tabla actividades ordenados */
        const result: ActividadTableModel[] = actividadResult
            .sort((a, b) => (a.props.paso > b.props.paso ? 1 : -1))
            .map((item) => {
                const IMAGEN = usuarioResult.find((a) => item.props.usuariosId.includes(a.id))?.props.avatar || "";
                const FECHA_ENVIO = item.props.fechaEnvio
                    ? moment(item.props.fechaEnvio).format("DD/MM/YYYY HH:mm").toString()
                    : null;
                
                //ASIGNACION DE RESPONSABLES
                let responsableTC = "";
                let responsableRPARPC = "";
                let responsableTES = "";
                let responsableTJ = "";

                switch (tipoModalidad[count2]) {
                    case "TC":
                        responsableTC = usuarioContrataciones;
                        count2++;
                        break;
                    case "RPA-TES":
                        responsableRPARPC = usuarioSolicitante1;
                        responsableTES = usuarioSolicitante2;
                        count2++;
                        break;
                    case "RPC-TES":
                        responsableRPARPC = usuarioSolicitante1;
                        responsableTES = usuarioSolicitante2;
                        count2++;
                        break;
                    case "TC-TES":
                        responsableTC = usuarioContrataciones;
                        responsableTES = usuarioSolicitante2;
                        count2++;
                        break;
                    case "TJ":
                        responsableTJ = usuarioSolicitante3;
                        count2++;
                        break;
                    default:
                        responsableTC = "";
                        responsableRPARPC = "";
                        responsableTES = "";
                        responsableTJ = "";
                        count2++;
                        break;
                }

                /*VERIFICACION DE FECHAS Y notificacion a Responsables*/

                let nombre = "";

                if ((tipoModalidad.length > 0 ) && !tipoModalidad[count].includes("-")) {
                    const userFind = usuarios.getValue().find((u: any) => item.props.usuariosId.includes(u.id));
                    nombre = userFind?.getNombreConApellido() || "";
                    count++;
                } else 
                   {
                        const responsables: string[] = item.props.usuariosId;
                        const nombreRes1 = usuarios.getValue().find((u: any) => u.id === responsables[0]);
                        const nombre1 = nombreRes1?.getNombreConApellido() || "";
                        const nombreRes2 = usuarios.getValue().find((u: any) => u.id === responsables[1]);
                        const nombre2 = nombreRes2?.getNombreConApellido() || "";
                        if(tipoModalidad.length > 0){
                            const siglaResp: string[] = tipoModalidad[count].split("-").map((part) => part.trim());
                            nombre = siglaResp[0]
                                .concat(": ")
                                .concat(nombre1)
                                .concat("\n")
                                .concat(siglaResp[1])
                                .concat(": ")
                                .concat(nombre2);
                        }
                        count++;
                    }

                return {
                    id: String(item.id),
                    titulo: item.props.titulo,
                    subtitulo: item.props.estado,
                    descripcion: item.props.descripcion,
                    paso: item.props.paso,
                    tiempo: item.props.tiempo + " | " + nombre,
                    notificacion: item.props.notificacion,
                    notificacion_solicitante: item.props.notificacionSolicitante || false,//activaResponsable, 
                    observacion: item.props.observacion,
                    fecha: item.props.fecha,
                    fecha_limite: item.props.fechaLimite,
                    fecha_envio2: item.props.fechaEnvio ? item.props.fechaEnvio : null,
                    fecha_envio: FECHA_ENVIO,
                    imagen: IMAGEN,
                    estado: item.props.estado,
                    usuario_id: nombreContrataciones,
                    proceso_id: item.props.procesoId,
                    usuario_solicitante_id: nombreResponsable1,
                    usuario_solicitante2_id: nombreResponsable2,
                    usuario_solicitante3_id: nombreResponsable3,
                    hoja_ruta: hojaRuta,
                    estado_activo: estadoActivo,
                    usuario_TC_id: responsableTC,
                    usuario_RPARPC_id: responsableRPARPC,
                    usuario_TES_id: responsableTES,
                    usuario_TJ_id: responsableTJ,
                };
            });

        //Actualizacion de Notificaciones por Fecha

        const actividadGen = await ActividadService.getAll();
        if (actividadGen.isFailure) return Result.fail("Falló al obtener la actividad");
        
        const actividadResultFecha = actividadGen
                                                .getValue()
                                                .filter((a) => a.props.procesoId === proceso_id)
                                                .sort((a, b) => (a.props.paso > b.props.paso ? 1 : -1));

        const fechaActual = new Date();	       	
        
        actividadResultFecha.forEach(async (actividad) => {
            
            const fechaInicio = actividad.props.fecha;					
            const fechaLimite = actividad.props.fechaLimite;						
         //   if(!(actividad.props.estado === "ATENDIDO" || actividad.props.estado === "ATRASADO") ){	
            if(actividad.props.estado === "EN_PROCESO" ){	  			
               /* if (
                    fechaActual.getFullYear() >= fechaInicio.getFullYear() &&
                    fechaActual.getMonth() >= fechaInicio.getMonth() &&
                    fechaActual.getDate() >= fechaInicio.getDate() &&
                    fechaActual.getFullYear() <= fechaLimite.getFullYear() &&
                    fechaActual.getMonth() <= fechaLimite.getMonth() &&
                    fechaActual.getDate() <= fechaLimite.getDate()		
                ) */
               if(fechaActual >= fechaInicio && fechaActual <= fechaLimite)
                {    
                    const props3: ActividadPaso = {						
                        notificacion: true,
                    };                 
                    const resultActua = await ActividadService.update(actividad.id, props3);
                    if (resultActua.isFailure)
                        return Result.fail<ActividadFormDataResponse>("Error al actualizar la actividad");
                }             
            }          
        });

        //Actualizacion de notificaciones por fecha

        
        /* CRON PARA ACTUALIZAR LA TABLA */
        let findSuspender = false;
        for (const row of result) {
            const ID_ACTIVIDAD = row.id;
            const FECHA_INICIO = row.fecha;
            const FECHA_ENVIO  = row.fecha_envio2;
            const FECHA_LIMITE = row.fecha_limite;
            let dateEstado = row.estado;
            if (dateEstado === "SUSPENDIDO" || findSuspender) {
                dateEstado    = "SUSPENDIDO";
                findSuspender = true;
            } else {
                if (FECHA_ENVIO) {
                    if (compararFechasEntre(FECHA_INICIO, FECHA_ENVIO, FECHA_LIMITE) == 0) {
                        dateEstado = "ATENDIDO";
                    }

                    if (compararFechasEntre(FECHA_INICIO, FECHA_ENVIO, FECHA_LIMITE) == 1) {
                        dateEstado = "ATENDIDO_CON_RETRASO";
                    }
                } else {
                    const fe = new Date();

                    if (compararFechasEntre(FECHA_INICIO, fe, FECHA_LIMITE) == 0) {
                        dateEstado = "EN_PROCESO";
                    }

                    if (compararFechasEntre(FECHA_INICIO, fe, FECHA_LIMITE) == 1) {
                        dateEstado = "ATRASADO";
                    }
                }
            }
            const props: any = {
                estado: dateEstado,
            };

            if (ID_ACTIVIDAD) {
                const result = await ActividadService.update(ID_ACTIVIDAD, props);
                if (result.isFailure) Result.fail(String(result.error));
            }
        }

        const response = findAndCountResult(result, query);
        return Result.ok(response);
    }

    public async getAllProceso(): Promise<Result<{ rows: ProcesosOptionsFormModel[]; count: number }>> {
        const areas = await ProcesoService.getAll();
        const result: ProcesosOptionsFormModel[] = areas
            .getValue()
            .map((item) => {
                return {
                    id: item.id.toString(),
                    nombre: item.props.objetoContratacion,
                    concepto: item.props.cuce,
                };
            })
            .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));
        return Result.ok({ rows: result, count: result.length });
    }

    public async getPDFProcesoDetalleReporte(authUser: AuthUser, params: string): Promise<Result<any>> {
        const ID_USUARIO = authUser.uid;
        const id_proceso = params;

        const usuario = await UsuarioService.getById(ID_USUARIO);
        if (usuario.isFailure) return Result.fail(String(usuario.error));
        const usuarioResult = usuario.getValue().props;

        const usuarios = await UsuarioService.getAll();
        if (usuarios.isFailure) Result.fail(String(usuarios.error));
        
        const proceso = await ProcesoService.getById(id_proceso);
        if (proceso.isFailure) return Result.fail<ProcesoFormDataResponse>("Proceso no encontrado");
        const props = proceso.getValue().props;

        const persona = await PersonalService.getAll();
        if (persona.isFailure) Result.fail(String(persona.error));
        const personaResult = persona.getValue().find((p) => p.props.usuarioId === props.usuarioSolicitante2Id);
        const personaResult2 = persona.getValue().find((p) => p.props.usuarioId === props.usuarioSolicitanteId);

        const actividad = await ActividadService.getAll();
        if (actividad.isFailure) return Result.fail("Falló al obtener la actividad");
        const actividadResult = actividad.getValue().filter((a) => a.props.procesoId === proceso.getValue().id);
        const result: ProcesoData = {
            info: {
                objeto      : props.objetoContratacion,
                modalidad   : props.modalidadSigla,
                codigo      : props.codigoInternoEntidad,
                cuce        : props.cuce,
                hoja_ruta   : props.hojaRuta,
                responsable : personaResult?.getNombreCompleto() || "",
                solicitante : personaResult2?.getNombreCompleto() || "",
                gestion     : props.gestion,
                fecha_inicio: moment(props.fechaRegistro).format("DD/MM/YYYY HH:mm").toString(),
                codigoQR    : `${props.objetoContratacion}\n${props.modalidadSigla}\n${
                    props.codigoInternoEntidad
                }\n${personaResult?.getNombreCompleto()}\n${props.cuce}`,
                email: usuarioResult.email,
            },
            data: {
                lineas: actividadResult
                    .filter((a) => a.props.paso !== 0)
                    .map((item) => {
                        const fecha = item.props.fecha;
                        const fechaObjeto = new Date(fecha);
                        const dia = fechaObjeto.getDate();
                        return {
                            paso: item.props.paso,
                            total_dias: parseInt(item.props.tiempo),
                            dia_inicial: dia,
                        };
                    })
                    .sort((a, b) => (a.paso > b.paso ? 1 : -1)),
                rows: actividadResult
                    .map((item) => {                        
                        const responsables: string[] = item.props.usuariosId;                        			
                        const nombreRes1 =  usuarios.getValue().find((u: any) => u.id===responsables[0]);
                        const nombre1 = nombreRes1?.getNombreConApellido() || "";					
                        const nombreRes2 =  usuarios.getValue().find((u: any) => u.id===responsables[1]);
                        const nombre2 = nombreRes2?.getNombreConApellido() || "";					
                        return {
                            paso        : item.props.paso,
                            titulo      : item.props.titulo,
                            responsable : nombre1,
                            responsable2: nombre2,
                            estado      : item.props.estado,
                            fecha_envio : item.props.fechaEnvio
                                ? moment(item.props.fechaEnvio).format("DD/MM/YYYY HH:mm").toString()
                                 :  "",
                            fecha: item.props.fecha
                                ? moment(item.props.fecha).format("DD/MM/YYYY").toString()
                                :  "",
                        };
                    })
                    .sort((a, b) => (a.paso > b.paso ? 1 : -1)),
                tasks: actividadResult
                    .filter((a) => a.props.paso !== 0)
                    .map((item) => {
                        const fecha = item.props.fecha;
                        const fechaObjeto = new Date(fecha);
                        const dia = fechaObjeto.getDate();
                        return {
                            id         : item.props.paso,
                            name       : item.props.titulo,
                            days       : parseInt(item.props.tiempo),
                            fecha_envio: item.props.fechaEnvio
                                ? moment(item.props.fechaEnvio).format("DD/MM/YYYY HH:mm").toString()
                                     :  "No enviado",
                            estado   : item.props.estado,
                            startDate: dia,
                        };
                    })
                    .sort((a, b) => (a.id > b.id ? 1 : -1)),
            },
        };

        return Result.ok(result);
    }

    public async getPDFProcesoGeneralReporte(): Promise<Result<any>> {

        const usuarios = await UsuarioService.getAll();
        if (usuarios.isFailure) Result.fail(String(usuarios.error));
        
        const areas = await AreaService.getAll();
        if (areas.isFailure) Result.fail(String(areas.error));
        const areasResult = areas.getValue();
        
        const proceso = await ProcesoService.getAll();
        if (proceso.isFailure) return Result.fail<ProcesoFormDataResponse>("Proceso no encontrado");
        const procesoResult = proceso.getValue();

        const actividad = await ActividadService.getAll();
        if (actividad.isFailure) return Result.fail("Falló al obtener la actividad");
        const actividadResult = actividad.getValue();
        
        const resultProcesoRows = procesoResult.map((item) => {                        
                                                    const area = areasResult.find((ar: any) => ar.id===item.props.areaId)?.props.nombre || "";
                                                    const tesId = item.props.usuarioSolicitante2Id || "";
                                                    const tjId = item.props.usuarioSolicitante3Id || "";
                                                    const tcId = item.props.usuarioId || "";
                                                    const rowTes: propRow[] = [];
                                                    const rowTj: propRow[] = [];
                                                    const rowTc: propRow[] = [];
                                                    actividadResult.filter((act) => act.props.procesoId===item.id)
                                                                                        .forEach((af) =>{
                                                                                            const obj =  {paso:af.props.paso, estado: af.props.estado};                                                                                           
                                                                                           af.props.usuariosId.includes(tesId)?rowTes.push(obj):"";
                                                                                           af.props.usuariosId.includes(tjId)?rowTj.push(obj):"";
                                                                                           af.props.usuariosId.includes(tcId)?rowTc.push(obj):"";                                                                                                                                                                                        
                                                                                        });
                                                    return {
                                                        objeto_contratacion: item.props.objetoContratacion,
                                                        codigo_interno     : item.props.codigoInternoEntidad,
                                                        fecha              : item.props.fechaRegistro? moment(item.props.fechaRegistro).format("DD/MM/YYYY").toString(): "",
                                                        area               : area,
                                                        pasos_tes          : rowTes.sort((a, b) => (a.paso > b.paso ? 1 : -1)),
                                                        pasos_tj            : rowTj.sort((a, b) => (a.paso > b.paso ? 1 : -1)),
                                                        pasos_tc            : rowTc.sort((a, b) => (a.paso > b.paso ? 1 : -1)),
                                                        paso_actual        : "",
                                                        estado             : item.props.estadoActivo || "",
                                                    };
                                                });
        const hoy = new Date();
        const gestion = hoy.getFullYear().toString();
        const FECHA_REGISTRO = moment(hoy).locale('es').format('dddd D [de] MMMM [de] YYYY hh:mm:ss a').toString();
        const codigo = `${gestion}-|-${FECHA_REGISTRO}`;
        const result: ProcesoGeneralData = {
            info: {                
                codigoQR: codigo,
                fecha   : FECHA_REGISTRO
            },
            data: {                
                rows:resultProcesoRows, 
            },
        };        
        return Result.ok(result);
    }

    public cargarModalidad(Modalidad: string): string[] {
        const LP = ['TC','RPC-TES','RPC-TES','TC-TES','TJ','TC','RPC-TES','TC','RPC-TES','RPC-TES','TJ','TC','TC','TJ','TC','RPC-TES','RPC-TES','TC'];//17+final
        const ANPE1 = [
            "TC",
            "TC",
            "RPA-TES",
            "RPA-TES",
            "TC",
            "RPA-TES",
            "TC",
            "RPA-TES",
            "TJ",
            "RPA-TES",
            "RPA-TES",
            "TC",
        ]; //11+final
        const ANPE2 = [
            "TC",
            "TC",
            "RPA-TES",
            "RPA-TES",
            "TJ",
            "RPA-TES",
            "RPA-TES",
            "TC",
            "RPA-TES",
            "TJ",
            "RPA-TES",
            "RPA-TES",
            "TC",
        ]; //12+final
        const CM = ['TC','TC','TC','TC','RPA-TES','TC','TC','TC','TC','TJ','TJ','RPA-TES','TC','RPA-TES','TC','TC-TES','TC'];//16+final
        const CD = ['TC','RPA-TES','TC','RPA-TES','TC','TJ','TC-TJ','TC','TC','TC','TC'];//10+final

        switch (Modalidad) {
            case "LP":
                return LP;
            case "ANPE1":
                return ANPE1;
            case "ANPE2":
                return ANPE2;
            case "CM":
                return CM;
            case "CD":
                return CD;
            default:
                return [];
        }
    }

    public async verificacionHabilitados(proceso_id: string): Promise<Result<ActividadPasoResponsableTable[]>> {
        //Proceso
        const proceso = await ProcesoService.getAll();
        if (proceso.isFailure) Result.fail(String(proceso.error));
        const procesoResult = proceso.getValue();

        const usuarioContrataciones     = procesoResult.find((a) => a.id === proceso_id)?.props.usuarioId || "";
        const usuarioSolicitante1RPARPC = procesoResult.find((a) => a.id === proceso_id)?.props.usuarioSolicitanteId || "";
        const usuarioSolicitante2TES    = procesoResult.find((a) => a.id === proceso_id)?.props.usuarioSolicitante2Id || "";
        const usuarioSolicitante3TJ     = procesoResult.find((a) => a.id === proceso_id)?.props.usuarioSolicitante3Id || "";

        //Modalidad
        const sigla = procesoResult.find((a) => a.id === proceso_id)?.props.modalidadSigla || "";
        const listaModalidad = this.cargarModalidad(sigla);

        const actividad = await ActividadService.getAll();
        if (actividad.isFailure) Result.fail("Falló al obtener la actividad");
        const actividadResult = actividad.getValue().filter((a) => a.props.procesoId === proceso_id);
        //Valores de los respondables
        let count = 0;
        /* listado general de la tabla actividades ordenados */
        const result: ActividadPasoResponsableTable[] = actividadResult
            .sort((a, b) => (a.props.paso > b.props.paso ? 1 : -1))
            .map((item) => {
                const FECHA_INICIO = item.props.fecha;
                const FECHA_ACTUAL = new Date();

                let activaResponsable = false;
                //VERIFICACION DE FECHAS
                if (FECHA_ACTUAL >= FECHA_INICIO) {
                    activaResponsable = true;
                }

                //ASIGNACION DE RESPONSABLES
                let responsableTC = "";
                let responsableRPARPC = "";
                let responsableTES = "";
                let responsableTJ = "";

                switch (listaModalidad[count]) {
                    case "TC":
                        responsableTC = usuarioContrataciones;
                        count++;
                        break;
                    case "RPA-TES":
                        responsableRPARPC = usuarioSolicitante1RPARPC;
                        responsableTES = usuarioSolicitante2TES;
                        count++;
                        break;
                    case "RPC-TES":
                        responsableRPARPC = usuarioSolicitante1RPARPC;
                        responsableTES = usuarioSolicitante2TES;
                        count++;
                        break;
                    case "TC-TES":
                        responsableTC = usuarioContrataciones;
                        responsableTES = usuarioSolicitante2TES;
                        count++;
                        break;
                    case "TC-TJ":
                            responsableTC = usuarioContrataciones;
                            responsableTJ = usuarioSolicitante3TJ;
                            count++;
                            break;
                    case "TJ":
                        responsableTJ = usuarioSolicitante3TJ;
                        count++;
                        break;
                    default:
                        responsableTC = "";
                        responsableRPARPC = "";
                        responsableTES = "";
                        responsableTJ = "";
                        count++;
                        break;
                }

                return {
                    id: String(item.id),
                    paso: item.props.paso,
                    fecha: item.props.fecha,
                    fecha_limite: item.props.fechaLimite,
                    estado: item.props.estado,
                    usuario_id: responsableTC,
                    proceso_id: item.props.procesoId,
                    usuario_solicitante_id: responsableRPARPC,
                    usuario_solicitante2_id: responsableTES,
                    usuario_solicitante3_id: responsableTJ,
                    notificacion_solicitante: activaResponsable,
                    usuario_habilitado: "",
                };
            });

        return Result.ok(result);
    }
}
