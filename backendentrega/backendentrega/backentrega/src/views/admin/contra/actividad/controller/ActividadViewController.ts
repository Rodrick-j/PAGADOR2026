import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../../base/types/Result";
import moment from "moment";
import ActividadView from "..";
import { ActividadFormDataResponse } from "../ActividadView";
import ActividadService from "../../../../../core/admin/contra/actividad";
import { ActividadProps } from "../../../../../core/admin/contra/actividad/ActividadEntity";


export class ActividadViewController extends BaseHttpController {
    public async getActividadsTable(req: Request, res: Response): Promise<Response<any>> {
        const actividad = await ActividadView.getActividadsTable(req.query);
        if (actividad.isFailure) return this.fail(res, "Falló al obtener la tabla de actividad");
        return this.ok<any>(res, actividad.getValue());
    }

    public async getActividadFormData(req: Request, res: Response): Promise<any> {
        const formData = await ActividadView.getActividadFormDataView(req.params.actividad_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<ActividadFormDataResponse>(res, formData.getValue());
    }    

    public async createOrUpdateActividad(req: Request, res: Response): Promise<any> {
        const data = req.body;		
     
        const ID_ACTIVIDAD = data.id;			
        //const ID_PROCESO = data.proceso_id;	

        const actividad = await ActividadService.getAll();
        if (actividad.isFailure) return Result.fail("Falló al obtener la actividad");
        /* const actividadResult = actividad.getValue()	
                                            .filter((a) => a.props.procesoId === ID_PROCESO || a.id !== ID_ACTIVIDAD)
                                            .sort((a, b) => (a.props.paso > b.props.paso ? 1 : -1));  */         	
        const fechaEnvio = data.estado_actividad? new Date():data.fecha_envio;	
        const estado = data.estado_actividad? "ATENDIDO":data.estado;	           
       
        const props: ActividadProps = {
			
            titulo      : data.titulo,
            descripcion : data.descripcion,
            paso        : data.paso,
            tiempo      : data.tiempo,
            notificacion: data.notificacion,
            observacion2 : data.observacion2,
            observacion : data.observacion,
            fecha       : data.fecha,
            fechaLimite : data.fecha_limite,
            fechaEnvio  : fechaEnvio,
            estado      : estado,
            usuariosId  : data.usuarios_id,
            procesoId   : data.proceso_id,
        };
      
        let result = null;
        
        if (ID_ACTIVIDAD) {
          
            result = await ActividadService.update(ID_ACTIVIDAD, props);
            if (result.isFailure) return this.fail(res, String(result.error));

            /* const FECHA_INICIAL = actividadResult.find((p) => p.props.paso==1)?.props.fecha || null;
            const PASO          = result.getValue().props.paso; */

            return this.ok(res, result);
        }
        
        result = await ActividadService.create(props);
        
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async destroyActividad(req: Request, res: Response): Promise<any> {
        const ID_ROLE = req.params.actividad_id;
        const actividadR = await ActividadService.getById(ID_ROLE);
        if (actividadR.isFailure) return this.fail(res, String(actividadR.error));

        const result = await ActividadService.delete(ID_ROLE);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async changeState(req: Request, res: Response): Promise<any> {
        const actividadId = req.params.actividad_id;
        const estado = Boolean(req.body.estado);

        const result = await ActividadService.update(actividadId, { estado });
        if (result.isFailure) return this.fail(res, "Falló al cambiar estado");
        return this.ok(res);
    }

    public async getFechaLimiteData(req: Request, res: Response): Promise<any> {
        const nro = new Date(req.params.nro);   	
        const procesoId = req.params.proceso_id;  	
        const paso = req.params.paso;		   
        
        const actividad = await ActividadService.getAll();
        if (actividad.isFailure) return this.fail(res, "Actividad no encontrada");        
       //Lista de destinos
        const fechaLimiteResult = actividad.getValue()		
                                           .filter((d) => 
                                                           d.props.procesoId===procesoId &&                                                            
                                                           d.props.paso === Number(paso) &&
                                                            this.filtrarFechas(d.props.fechaLimite,nro)                                                         
                                                   )
                                           .map((dd) => dd.props.fechaLimite);                                          
                                                  
       return this.ok<any>(res, {nro: fechaLimiteResult.length > 0});
    }

   public filtrarFechas(item:Date, fecha:Date) { 
       const fechaItem  =item?moment(item).format("YYYY/MM/DD").toString(): '';  
        const fechaNro  =fecha?moment(fecha).format("YYYY/MM/DD").toString(): '';      
           return (fechaItem === fechaNro); 
     } 
}
