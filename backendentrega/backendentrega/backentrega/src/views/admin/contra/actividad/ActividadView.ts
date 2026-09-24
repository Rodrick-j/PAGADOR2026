import { Result } from "../../../../base/types/Result";

import { findAndCountResult } from "../../../../tools/util";

import ActividadService from "../../../../core/admin/contra/actividad";
import UsuarioService from "../../../../core/system/autenticacion/usuario";

import moment from "moment";
import  ProcesoService from "../../../../core/admin/contra/proceso";

type ActividadTableModel = {
    id          : string;
    titulo      : string;
    descripcion : string;
    paso        : number;
    tiempo      : string;
    notificacion: boolean;
    observacion : string;
    observacion2: string;
    fecha       : string;
    fecha_envio : string;
    estado      : string;
   
};

export type GetActividadsTableResponse = {
    rows: ActividadTableModel[];
    count: number;
};

export type ActividadFormDataResponse = {
    id                      : string;
    titulo                  : string;
    descripcion             : string;
    paso                    : number;
    tiempo                  : string;
    notificacion            : boolean;
    notificacion_solicitante: boolean;
    observacion             : string;
    observacion2            : string;
    fecha                   : Date;
    fecha_limite            : Date;
    estado                  : string;
    usuarios_id             : string[] | null;
    proceso_id              : string | null;
};

export type ActividadsOptionsFormModel = {
    id: string;
    nombre: string;
    concepto: string;
};

export type ActividadPaso = {
    notificacion: boolean;
}

export class ActividadView {
    public async getActividadsTable(query: any): Promise<Result<{ rows: ActividadTableModel[] }>> {
            const ID_PROCESO = query.proceso_id || "";
            if ('proceso_id' in query) delete query.proceso_id;

            const actividad = await ActividadService.getAll();
            if (actividad.isFailure) return Result.fail("Falló al obtener la actividad");
            const actividadResult = actividad.getValue().filter((d) => d.props.procesoId === ID_PROCESO);
            
            const usuarios = await UsuarioService.getAll(); 
            if (usuarios.isFailure) Result.fail(String(usuarios.error));

            const proceso = await ProcesoService.getAll();
            if (proceso.isFailure) return Result.fail("Falló al obtener la Proceso");
            const procesoResult = proceso.getValue();

            const sigla = procesoResult.find((u) => u.id === ID_PROCESO)?.props.modalidadSigla;           
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const tipoModalidad = this.cargarModalidad(sigla!);
			
            let count = 0;
            const result: ActividadTableModel[] = actividadResult.sort((a, b) => a.props.paso - b.props.paso).map((item) => {
                
                let nombre = "";               
				
				if( !tipoModalidad[count].includes('-')) {				
                    const userFind = usuarios.getValue().find((u: any) => item.props.usuariosId.includes(u.id));
                    nombre = userFind?.getNombreConApellido() || "";					
                    count ++;
                }else {
                  //   const jsonObject = JSON.parse(item.props.usuariosId);
                    const responsables: string[] = item.props.usuariosId;					
                    const nombreRes1 =  usuarios.getValue().find((u: any) => u.id===responsables[0]);					
                    const nombre1 = nombreRes1?.getNombreConApellido() || "";									
                    const nombreRes2 =  usuarios.getValue().find((u: any) => u.id===responsables[1]);					
                    const nombre2 = nombreRes2?.getNombreConApellido() || "";						
                    const siglaResp: string[] = tipoModalidad[count].split("-").map(part => part.trim());
                    nombre = siglaResp[0].concat(': ').concat(nombre1).concat('\n').concat(siglaResp[1]).concat(': ').concat(nombre2);				
				
                    count ++; 
                }
                
                return {
                    id          : String(item.id),
                    titulo      : item.props.titulo,
                    descripcion : item.props.descripcion,
                    paso        : item.props.paso,
                    tiempo      : item.props.tiempo,
                    notificacion: item.props.notificacion,
                    observacion : item.props.observacion,
                    observacion2: item.props.observacion2 || "",
                    responsable : nombre,
                    fecha       : moment(item.props.fecha).format("DD/MM/YYYY HH:mm").toString(),
                    fecha_envio : item.props.fechaEnvio && moment(item.props.fechaEnvio).format("DD/MM/YYYY HH:mm").toString() || "",
                    estado      : item.props.estado,
                };
            }).sort((a:any, b:any) => a.paso > b.paso ? 1 : -1);
            
            const response = findAndCountResult(result, query);	
            
            return Result.ok(response);
    }

    public async getActividadFormDataView(id_actividad: string): Promise<Result<ActividadFormDataResponse>> {
        const actividad = await ActividadService.getById(id_actividad);
        if (actividad.isFailure) return Result.fail<ActividadFormDataResponse>("Actividad no encontrado");
        const props = actividad.getValue().props; 
        

        /* const usuarios = await UsuarioService.getAll(); 
        if (usuarios.isFailure) Result.fail(String(usuarios.error));
        
        const userFind = usuarios.getValue().find((u: any) => props.usuariosId && props.usuariosId.includes(u.id));
        const imagen = userFind?.props.avatar || ""; */

        const result: ActividadFormDataResponse = {			
            id                      : actividad.getValue().id,
            titulo                  : props.titulo,
            descripcion             : props.descripcion,
            paso                    : props.paso,
            tiempo                  : props.tiempo,
            notificacion            : props.notificacion,
            notificacion_solicitante: props.notificacionSolicitante||false,
            observacion             : props.observacion,
            observacion2            : props.observacion2 || "",
            fecha                   : props.fecha,
            fecha_limite            : props.fechaLimite,
            estado                  : props.estado,
            usuarios_id             : props.usuariosId,
            proceso_id              : props.procesoId
        };
      
       
        return Result.ok(result);
		
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