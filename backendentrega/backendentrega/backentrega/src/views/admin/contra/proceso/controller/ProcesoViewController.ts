import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../../base/types/Result";

import ProcesoView from "..";
import { ProcesoDetalleProps, ProcesoFormDataResponse } from "../ProcesoView";
import ProcesoService from "../../../../../core/admin/contra/proceso";
import ActividadService from "../../../../../core/admin/contra/actividad";

import { ProcesoReport } from '../../../../../tools/ProcesoReport';

import { compararFechas } from "../../../../../tools/util";
import { AuthUser } from "../../../../../base/types/AuthUser";
import moment from 'moment';
import 'moment-timezone';
import { ProcesoProps } from "../../../../../core/admin/contra/proceso/ProcesoEntity";
import { ActividadFormDataResponse } from "../../actividad/ActividadView";
import  UsuarioService  from "../../../../../core/system/autenticacion/usuario";

export class ProcesoViewController extends BaseHttpController {
    public async getProcesosTable(req: Request, res: Response): Promise<Response<any>> {
        const authUser: AuthUser = req.authUser;
        const proceso = await ProcesoView.getProcesosTable(req.query, authUser);
        if (proceso.isFailure) return this.fail(res, "Falló al obtener la tabla de proceso");
        return this.ok<any>(res, proceso.getValue());
    }
    
    public async getReporteProcesosTable(req: Request, res: Response): Promise<Response<any>> {
        const authUser: AuthUser = req.authUser;
        const proceso = await ProcesoView.getReporteProcesosTable(req.query, authUser);
        if (proceso.isFailure) return this.fail(res, "Falló al obtener la tabla de proceso");
        return this.ok<any>(res, proceso.getValue());
    }
    
    public async getReporteProcesosTable500(req: Request, res: Response): Promise<Response<any>> {        
        const proceso = await ProcesoView.getReporteProcesosTable500(req.query);
        if (proceso.isFailure) return this.fail(res, "Falló al obtener la tabla de proceso");
        return this.ok<any>(res, proceso.getValue());
    }

    public async getProcesoFormData(req: Request, res: Response): Promise<any> {
        const formData = await ProcesoView.getProcesoFormDataView(req.params.proceso_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<ProcesoFormDataResponse>(res, formData.getValue());
    }    
    
    public async getTableProcesoDetalle(req: Request, res: Response): Promise<any> {
        const AUTH_USER: AuthUser = req.authUser;
        const actividads = await ProcesoView.getTableProcesoDetalle(AUTH_USER, req.query, req.params.proceso_id);
        if (actividads.isFailure) return this.fail(res, 'Falló al obtener la tabla de proceso');
        return this.ok<any>(res, actividads.getValue());
    }

    public async getAllProceso(req: Request, res: Response): Promise<any> {
        const result = await ProcesoView.getAllProceso();
        return this.ok<any>(res, result.getValue());
    }


    
    public async createOrUpdateProceso(req: Request, res: Response): Promise<any> {
        const data = req.body;
       //verificar el avnce de los dias a viajar
       const authUser: AuthUser = req.authUser;
       const ID_USUARIO = authUser.uid;        
       const SIGLA = data.modalidad_sigla;
        const ID_PROCESO = data.id;
        const props: ProcesoProps = {
            objetoContratacion   : data.objeto_contratacion,
            modalidadDescripcion : data.modalidad_descripcion,
            modalidadSigla       : SIGLA,
            codigoInternoEntidad : data.codigo_interno_entidad,
            cuce                 : data.cuce,
            fechaRegistro        : data.fecha_registro,
            gestion              : data.gestion,
            hojaRuta             : data.hoja_ruta,
            estado               : data.estado,
            usuarioId            : ID_USUARIO,
            usuarioSolicitanteId : data.usuario_solicitante_id,
            usuarioSolicitante2Id: data.usuario_solicitante2_id,
            usuarioSolicitante3Id: data.usuario_solicitante3_id,
            estadoActivo         : 'ABIERTO',
            areaId               : data.area_id,
        };
        let result = null;
        if (ID_PROCESO) {
            result = await ProcesoService.update(ID_PROCESO, props);
            if (result.isFailure) return this.fail(res, String(result.error));
            return this.ok(res, result);
        }
        result = await ProcesoService.creaProceso(props);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async createOrUpdateProcesoDetalle(req: Request, res: Response): Promise<any> {
        const data = req.body;
        
        const ID_ACTIVIDAD = data.id;
        const NOTIFICACION_SOLICITANTE = data.notificacion_solicitante;	
        const FECHA_ACTUAL_UTC = new Date();

        const actividad = await ActividadService.getById(ID_ACTIVIDAD);		
        if (actividad.isFailure) return this.fail(res, String(actividad.error));
        const actividadResult = actividad.getValue();
        const PASO_SIGUIENTE = actividadResult.props.paso + 1;		

        const ID_PROCESO = actividadResult.props.procesoId;		
        const proceso = await ProcesoService.getById(ID_PROCESO);
        if (proceso.isFailure) return this.fail(res, String(proceso.error));
        const procesoResult = proceso.getValue();        
		
        const actividads = await ActividadService.getAll();
        if (actividads.isFailure) return this.fail(res, "Actividad no encontrada");       

        const listaActividades: ActividadFormDataResponse[] = actividads.getValue()
                                                                        .map((value) => {                
                                                                                return {                
                                                                                    id: value.id.toString(),
                                                                                    titulo                   : value.props.titulo,                  
                                                                                    descripcion              : value.props.descripcion,
                                                                                    notificacion             : value.props.notificacion,
                                                                                    paso                     : value.props.paso,
                                                                                    tiempo                   : value.props.tiempo,
                                                                                    observacion              : value.props.observacion,
                                                                                    observacion2             : value.props.observacion2 || "",
                                                                                    fecha                    : value.props.fecha,
                                                                                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                                                                    notificacion_solicitante : value.props.notificacionSolicitante!, 
                                                                                    fecha_limite             : value.props.fechaLimite,                       
                                                                                    estado                   : value.props.estado,                 
                                                                                    usuarios_id              : value.props.usuariosId,
                                                                                    proceso_id               : value.props.procesoId,
                                                                                                                            
                                                                                };            
                                                                        }) ; 
        
        const filtroActividades : ActividadFormDataResponse [] = listaActividades				
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .filter((item) => this.filtrarProceso(item.proceso_id!, ID_PROCESO)).sort((a, b) => a.paso > b.paso ? 1 : -1);
               
        const filtroPasos : ActividadFormDataResponse [] = filtroActividades			
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .filter((item) => this.filtrarProceso(item.paso!.toString(), PASO_SIGUIENTE.toString()));
        
        const actividadsResult = filtroPasos[0];
        
        const usuarios = await UsuarioService.getAll(); 
        if (usuarios.isFailure) Result.fail(String(usuarios.error));
        let msjResult_estado = "TERMINADO";        		
        let msjResult_paso = "CONCLUIDO";        		
        let msjResult_descripcion = "-";        		
        let msjResult_fechaEnvio = FECHA_ACTUAL_UTC.toString();
        // actualizacion de estado ACTIVIDAD
            const FECHA_LIMITE_UTC = new Date();
            const dateA = FECHA_LIMITE_UTC;		
            const dateB = FECHA_ACTUAL_UTC;		             
            const dateEstado = compararFechas(dateA, dateB) !== -1; 		
            const props: ProcesoDetalleProps = {
                notificacionSolicitante: NOTIFICACION_SOLICITANTE,
                notificacion           : false,
                observacion            : data.observacion,
                fechaEnvio             : FECHA_ACTUAL_UTC,
                estado                 : data.suspension?"SUSPENDIDO":( dateEstado?"ATENDIDO" : "ATRASADO"),			            
            };
            
            const result1 = await ActividadService.update(ID_ACTIVIDAD, props);				
            if (result1.isFailure) return this.fail(res, String(result1.error)); 
            msjResult_estado = result1.getValue().props.estado;
            msjResult_fechaEnvio = moment(result1.getValue().props.fechaEnvio)
            .locale("es")
            .format("dddd, D MMMM YYYY");
        //       		
        if(actividadsResult){
            const ID_ACTIVIDAD_SIGUIENTE = actividadsResult.id || "";  
            const actividadSiguiente = ActividadService.getById(ID_ACTIVIDAD_SIGUIENTE);
            if ((await actividadSiguiente).isFailure) return this.fail(res, String((await actividadSiguiente).error));
            
            const FECHA_LIMITE2 = (await actividadSiguiente).getValue().props.fecha;
            const dateA2 = FECHA_LIMITE2;			
            const dateEstado2 = compararFechas(dateA2, dateB) !== -1; 
            
            const props2: any = {				
                notificacion: true,
                estado:  data.suspension?"SUSPENDIDO":( dateEstado2?"EN_PROCESO" : "ATRASADO"),			
            }
                
            const result2 = await ActividadService.update(ID_ACTIVIDAD_SIGUIENTE, props2);				
            if (result2.isFailure) return this.fail(res, String(result2.error));
            msjResult_paso = String(result2.getValue().props.paso);            
            msjResult_descripcion = String(result2.getValue().props.descripcion);            
        }
        
        if(NOTIFICACION_SOLICITANTE){
            const ID_USUARIO_TC = procesoResult.props.usuarioId|| "";		
            const ID_USUARIO_RPA_RPC = procesoResult.props.usuarioSolicitanteId || "";			
            const ID_USUARIO_TES = procesoResult.props.usuarioSolicitante2Id || "";		
            const ID_USUARIO_TJ = procesoResult.props.usuarioSolicitante3Id || "";	
			
			const procesoInfo = `
                <p><strong>Hoja de Ruta: </strong>${procesoResult.props.hojaRuta}<br/><strong>Estado: </strong>${msjResult_estado}<br/><strong>Paso siguiente: </strong>${msjResult_paso}<br/>
                <strong>Descripción: </strong>${msjResult_descripcion}<br/>
                <strong>Objeto de Contratación: </strong>${procesoResult.props.objetoContratacion}<br/>
                <strong>Fecha de Envio: </strong>${msjResult_fechaEnvio}<br/>
                </p>
            `;
            await UsuarioService.enviarCorreoUsuarios([ID_USUARIO_TC, ID_USUARIO_RPA_RPC, ID_USUARIO_TES, ID_USUARIO_TJ], "MODULO CONTRATACIONES", procesoInfo);           
        }

        return this.ok(res, {});
    }

    //filtramos por el tipo de id 
  public filtrarProceso(item:string, id:string) { 
    return (item === id); 
 } 

    public async destroyProceso(req: Request, res: Response): Promise<any> {
        const ID_PROCESO = req.params.proceso_id;
        const procesoR = await ProcesoService.getById(ID_PROCESO);
        if (procesoR.isFailure) return this.fail(res, String(procesoR.error));

        const result = await ProcesoService.eliminaProceso(ID_PROCESO);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async changeState(req: Request, res: Response): Promise<any> {
        const procesoId = req.params.proceso_id;				
        const estadoActivo = Boolean(req.body.activo);				
        const result = await ProcesoService.update(procesoId, { estadoActivo });
        if (result.isFailure) return this.fail(res, "Falló al cambiar estado");
        return this.ok(res);
    }

    public async getPDFProcesoDetalleReporte(req: Request, res: Response): Promise<any> {
        const id: string    = req.body.id;
        const procesoResult = await ProcesoView.getPDFProcesoDetalleReporte(req.authUser, id);
        if (procesoResult.isFailure) return this.fail(res, String(procesoResult.error));
    
        const result = procesoResult.getValue();
        return ProcesoReport.creaPDF(result, 'proceso', res);
    }

    public async getPDFProcesoGeneralReporte(req: Request, res: Response): Promise<any> {        
        const procesoResult = await ProcesoView.getPDFProcesoGeneralReporte();
        if (procesoResult.isFailure) return this.fail(res, String(procesoResult.error));
    
        const result = procesoResult.getValue();
        return ProcesoReport.creaPDF(result, 'procesogeneral', res);
    }
    
    

    //cambio de estado a aprobado
    public async changeApprove(req: Request, res: Response): Promise<any> {
        const ID_PROCESO = req.params.proceso_id;
        const estadoActivo = req.body.aprobado;         
        
        const result = await ProcesoService.update(ID_PROCESO, { estadoActivo });
        if (result.isFailure) return this.fail(res, "Falló al cambiar estado en memorandum");
    
        return this.ok(res);

    }


    public cargarModalidad(Modalidad : string): string []{
        const LP = ['TC','RPC-TES','RPC-TES','TC-TES','TJ','TC','RPC-TES','TC','RPC-TES','RPC-TES','TJ','TC','TC','TJ','TC','RPC-TES','RPC-TES','TC'];//17+final
        const ANPE1 = ['TC','TC','RPA-TES','RPA-TES','TC','RPA-TES','TC','RPA-TES','TJ','RPA-TES','RPA-TES','TC'];//11+final
        const ANPE2 = ['TC','TC','RPA-TES','RPA-TES','TJ','RPA-TES','RPA-TES','TC','RPA-TES','TJ','RPA-TES','RPA-TES','TC'];//12+final
        const CM = ['TC','TC','TC','TC','RPA-TES','TC','TC','TC','TC','TJ','TJ','RPA-TES','TC','RPA-TES','TC','TC-TES','TC'];//16+final
        const CD = ['TC','RPA-TES','TC','RPA-TES','TC','TJ','TC-TJ','TC','TC','TC','TC'];//10+final

        switch(Modalidad){
            case 'LP':
                return LP;
            case 'ANPE1':
                return ANPE1;
            case 'ANPE2':
                return ANPE2;
            case 'CM':
                return CM;
            case 'CD':
                return CD;
            default:
                return [];
        }
    }   
}

