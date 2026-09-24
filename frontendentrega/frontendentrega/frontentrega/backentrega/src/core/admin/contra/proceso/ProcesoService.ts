import { BaseService } from "../../../../base/domain/BaseService";
import { Result } from "../../../../base/types/Result";
import { v4 as uuid } from "uuid";

import { esFeriado, esFinDeSemana, obtenerFeriadosBolivia } from "../../../../tools/util";

import { ActividadProps } from "../actividad/ActividadEntity";
import ActividadService from "../actividad";
import { ProcesoEntity, ProcesoProps } from "./ProcesoEntity";
import { GeneralEntity } from "../general/GeneralEntity";
import GeneralService from "../general";


export type CrearEditarAdministradorParams = {
    id                   ?: string;
    objetoContratacion    : string;
    modalidadDescripcion  : string;
    modalidadSigla        : string;
    codigoInternoEntidad  : string;
    cuce                  : string;
    fechaRegistro         : Date;
    gestion               : string;
    hojaRuta              : string;
    estado                : string;
    usuarioId             : string;
    usuarioSolicitanteId  : string | null;
    usuarioSolicitante2Id : string | null;
    usuarioSolicitante3Id : string | null;
    estadoActivo          :string | null;
    areaId                : string | null;
};

type JsonProps ={
    paso: number;
    fechaInicio: Date;
    fechaFin: Date;
}

export class ProcesoService extends BaseService<ProcesoEntity, ProcesoProps> {
    public async factory(props: ProcesoProps, id?: string): Promise<Result<ProcesoEntity>> {
        return ProcesoEntity.create(props, id);
    }

    private async setFechasActividadCreate(entity: any[], proceso_id: string, fecha_registro: Date): Promise<Result<any>>
    {
        /* Fechas totales */
        const PARAM_FECHAS = 25; //Es un parametro alternativo para alargar la lista de fechas
        const fechaInicio = new Date ();
        const feriados = await obtenerFeriadosBolivia();

        const lista = [];
        const num_ceros = entity.reduce((count: number, item) => {
            const num = parseInt((item.props.tiempo.match(/\d+/) || ['NaN'])[0], 10);
            return num === 0 ? count + 1 : count;
        },0);
        const lista_total = entity.reduce((a: number, item) => a + parseInt((item.props.tiempo.match(/\d+/) || ['NaN'])[0], 10),0)+num_ceros+PARAM_FECHAS;

        for(let c = 0; lista.length <= lista_total; c++){
            fechaInicio.setFullYear(fecha_registro.getFullYear());
            fechaInicio.setMonth(fecha_registro.getMonth());
            fechaInicio.setDate(fecha_registro.getDate() + c);                
            if(!esFeriado(fechaInicio, feriados))
                if(!esFinDeSemana(fechaInicio))                   
                    lista.push(new Date (fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate()));       
					
        }
      
        /* //Fechas totales */
        //Busqueda de PRocesos
        const proceso = await this.getAll();
        if (proceso.isFailure) return Result.fail(proceso.error);
        const procesoResult = proceso.getValue() || [];        
        
        const modalidad = procesoResult.find((c) => c.id === proceso_id)?.props.modalidadSigla|| '';// revisar sesta parte
		const responsableTC = procesoResult.find((c) => c.id === proceso_id)?.props.usuarioId|| '';// revisar sesta parte
		const responsableRPA = procesoResult.find((c) => c.id === proceso_id)?.props.usuarioSolicitanteId|| '';// revisar sesta parte
		const responsableRPC = procesoResult.find((c) => c.id === proceso_id)?.props.usuarioSolicitante2Id|| '';// revisar sesta parte
		const responsableTJ = procesoResult.find((c) => c.id === proceso_id)?.props.usuarioSolicitante3Id|| '';// revisar sesta parte
		
        //cargando responsables 
        const listaResponsables = [responsableTC, responsableRPA, responsableRPC, responsableTJ];		
		const listaModalidad =  this.cargarModalidad(modalidad);		
		const listaFinalResponsables = this.cargarResponsables(listaResponsables,listaModalidad);	
		
        let count = 0;
        let indice = 0;
        const listaDias: number[] = [];       
        //LLENAMOS LISTA TIEMPOS 
        for( const item of entity ){
            const TIEMPO = parseInt((item.props.tiempo.match(/\d+/) || ['NaN'])[0], 10); 
            listaDias.push(TIEMPO);
			
        } 
        
        const listaFiltroFechas = this.getListaFechas(listaDias,lista, modalidad);
     
        //LLENAMOS LISTA ACTIVIDADES
        for( const item of entity ){          
            
            const TIEMPO = parseInt((item.props.tiempo.match(/\d+/) || ['NaN'])[0], 10);            
                     
            // INSERCION DE RESPONSABLES
            let arrayUsuarios : string[] = [];
            if(listaFinalResponsables.length > 0){   
                const valor = listaFinalResponsables[count++];
                if(valor.split(',').length >0){
                    arrayUsuarios = valor.split(',');
                }else{
                    arrayUsuarios.push(valor);
                }
            }
            //

            const propsActividad: ActividadProps = {				
                titulo      : item.props.nombre,
                descripcion : item.props.tipo+" | "+item.props.tiempo,
                paso        : item.props.paso,
                tiempo      : TIEMPO+" dias",
                notificacion: item.props.paso===1,
                observacion : '',
                fecha       : listaFiltroFechas[indice].fechaInicio,
                fechaLimite : listaFiltroFechas[indice].fechaFin,//FECHA_LIMITE,
                fechaEnvio  : null,
                estado      : 'PENDIENTE',
                usuariosId   : arrayUsuarios,
                procesoId   : proceso_id,
            };
             indice++;
            const resultActividad = await ActividadService.create(propsActividad);
            if (resultActividad.isFailure) return Result.fail(String(resultActividad.error));       
         
        }
        
        return Result.ok("Completado");
    }

    
    // Se obtiene la lista de las fechas por los tiempos de cada paso
    public getListaFechas (listaTiempos: number[], listaFechas : Date[], modalidad:string) : JsonProps[]{
        const lista : JsonProps[] = [];
      
        let aux0 = 0;
        let aux1 = 0;
      //  let aux2 = 0 ; 
    
        for (let i = 0; i < listaTiempos.length; i++) {           
            //Modalidad ANPE 1  //Modalidad ANPE 2 //Modalidad LP 
             if (modalidad === "ANPE1" && i == 2 || modalidad === "ANPE1" && i == 8 
                ||modalidad === "ANPE2" && i == 2 || modalidad === "ANPE2" && i == 9
                ||modalidad === "LP" && i == 12 || modalidad === "CM" && i == 12){                            
                        lista.push({paso : i+1,fechaInicio :listaFechas[aux1 + 1],fechaFin :listaFechas[aux1+listaTiempos[i]+1] });                                      
                        aux0 =  aux1+listaTiempos[i]+1;
                        
                        if(listaTiempos[i+1]===0){
                            aux1 =  aux1+listaTiempos[i]+1; 
                        }else{                        
                            aux1 =  aux1+listaTiempos[i]; 
                        }     
                    
             }  else{      
                  if(listaTiempos[i] === 0){
                        lista.push({paso : i+1,fechaInicio :listaFechas[aux0],fechaFin :listaFechas[aux0] });
                  }else if(i === 0 && listaTiempos[i] !== 0){ //Condicion cuando el primer parametro no es 0
                    lista.push({paso : i+1,fechaInicio :listaFechas[aux1],fechaFin :listaFechas[aux1+listaTiempos[i]] });                                      
                        aux0 =  aux1+listaTiempos[i]+1;                        
                        if(listaTiempos[i+1]===0){
                            aux1 =  aux1+listaTiempos[i]+1; 
                        }else{                        
                            aux1 =  aux1+listaTiempos[i]; 
                        }  
                  }else{                    
                       // aux2 = aux1 + 1;                        
                        lista.push({paso : i+1,fechaInicio :listaFechas[aux1 + 1],fechaFin :listaFechas[aux1+listaTiempos[i]] });                                      
                        aux0 =  aux1+listaTiempos[i]+1;
                        
                        if(listaTiempos[i+1]===0){
                            aux1 =  aux1+listaTiempos[i]+1; 
                        }else{                        
                            aux1 =  aux1+listaTiempos[i]; 
                        }      
                  }                     
            }
        }         
        return lista;
    }

    public async creaProceso(params: CrearEditarAdministradorParams): Promise<Result<ProcesoEntity>> {
                
        const result = await super.create(params);        
        if (result.isFailure) return Result.fail(result.error);
        const resultProceso = result.getValue();
        
        const ID_PROCESO = resultProceso.id;
        const FECHA_REGISTRO = new Date(params.fechaRegistro);

        const ID_USUARIO = params.usuarioId;
        const SIGLA = params.modalidadSigla;
        
        if (result.isSuccess) {            

            const generals = await GeneralService.getAll();
            if (generals.isFailure) return Result.fail(generals.error);
            const generalResults = generals.getValue()
                                        .filter((g) => g.props.tipo === params.modalidadSigla)
                                        .sort((a, b) => (a.props.paso > b.props.paso ? 1 : -1));
            const nuevoObjeto = {
                nombre      : 'Fin del Proceso',
                tiempo      : '0d',
                tipo        : SIGLA,
                paso        : generalResults[generalResults.length-1].props.paso+1,
                usuarioId   : ID_USUARIO
            };

            const nuevaGeneralEntity = new GeneralEntity(nuevoObjeto, uuid());
            generalResults.push(nuevaGeneralEntity);
            
            const result = await this.setFechasActividadCreate(generalResults, ID_PROCESO, FECHA_REGISTRO);
            if (result.isFailure) return Result.fail(result.error);
            console.log("🚀 ~ ProcesoService ~ creaProceso ~ r:", result.getValue())           
        }           

        return Result.ok(resultProceso);
    }

    public async editaProceso(params: CrearEditarAdministradorParams): Promise<Result<ProcesoEntity>> {
        
        const ID_PROCESO = params.id || "";
                
        return super.update(ID_PROCESO, {
            objeto_contratacion    : params.objetoContratacion,
            modalidad_descripcion  : params.modalidadDescripcion,
            modalidad_sigla        : params.modalidadSigla,
            codigo_interno_entidad : params.codigoInternoEntidad,
            cuce                   : params.cuce,
            fecha_registro         : params.fechaRegistro,
            gestion                : params.gestion,
            hoja_ruta              : params.hojaRuta,
            estado                 : params.estado,
            usuario_id             : params.usuarioId,
            usuario_solicitante_id : params.usuarioSolicitanteId,
            usuario_solicitante2_id: params.usuarioSolicitante2Id,
            usuario_solicitante3_id: params.usuarioSolicitante3Id,    
            estado_activo          : params.estadoActivo,                  
            areaId                 : params.areaId
        });
    }

    public async eliminaProceso(procesoId: string): Promise<Result<boolean>> {
        
        const actividadResult = await ActividadService.getAll();
        if (actividadResult.isFailure) return Result.fail(actividadResult.error);
        const actividadesR = actividadResult.getValue().filter((item) => item.props.procesoId === procesoId);
        for (const i in actividadesR) {
            const actividadDelete = actividadesR[i];
            const eliminaR = await ActividadService.delete(actividadDelete.id);
            if (eliminaR.isFailure) return Result.fail(eliminaR.error);
        }    
        return super.delete(procesoId);
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

    public cargarResponsables(listaResponsables:string[], listaModalidad:string []): string []{
        
        //lista responsables esta acomodado de la siguiente forma[0:TC,1:RPA-RPC, 2:TES,3:TJ]
        const listaCargadaResponsables : string[] = [];
        for (let i = 0; i < listaModalidad.length; i++) {
            
            switch(listaModalidad[i]){
                case 'TC':
                    listaCargadaResponsables.push(listaResponsables[0]);
                    break;
                case 'RPA-TES':                   
                    listaCargadaResponsables.push(listaResponsables[1].concat(",").concat(listaResponsables[2]));                  
                    break;
                case 'RPC-TES':                   
                    listaCargadaResponsables.push(listaResponsables[1].concat(",").concat(listaResponsables[2]));                  
                    break;
                case 'TC-TES':    
                    listaCargadaResponsables.push(listaResponsables[0].concat(",").concat(listaResponsables[2]));                     
                    break;
                case 'TC-TJ':    
                    listaCargadaResponsables.push(listaResponsables[0].concat(",").concat(listaResponsables[3]));                     
                    break;
                case 'TJ':
                    listaCargadaResponsables.push(listaResponsables[3]);
                    break;
                default:
                    listaCargadaResponsables.push("");					
                    break;
           }          
        }                     
        return listaCargadaResponsables;
		
    }    
      
       

}

