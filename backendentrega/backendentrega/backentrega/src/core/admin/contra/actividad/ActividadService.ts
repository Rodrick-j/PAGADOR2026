import { BaseService } from "../../../../base/domain/BaseService";
import { ActividadEntity, ActividadProps } from "./ActividadEntity";
import { Result } from "../../../../base/types/Result";
import { esFeriado, esFinDeSemana, obtenerFeriadosBolivia } from "../../../../tools/util";

export class ActividadService extends BaseService<ActividadEntity, ActividadProps> {
    public async factory(props: ActividadProps, id?: string): Promise<Result<ActividadEntity>> {
        return ActividadEntity.create(props, id);
    }

    public async eliminaActividad(id: string): Promise<Result<boolean>> {
        return super.delete(id);
    }

    public async setFechasActividadUpdate(entity: any[], fecha_actualizacion: Date, fecha_inicial: Date): Promise<Result<any>>
    {
        /* Fechas totales */
        const fechaInicio = new Date ();
        const feriados = await obtenerFeriadosBolivia();

        const lista = [];
        const lista_total = entity.reduce((a: number, item) => a + parseInt((item.props.tiempo.match(/\dias+/) || ['NaN'])[0], 10),0); 
        for(let c = 0; lista.length <= lista_total; c++){
            fechaInicio.setFullYear(fecha_actualizacion.getFullYear());
            fechaInicio.setMonth(fecha_actualizacion.getMonth());
            fechaInicio.setDate(fecha_actualizacion.getDate() + c);                
            if(!esFeriado(fechaInicio, feriados))
                if(!esFinDeSemana(fechaInicio))                   
                    lista.push(new Date (fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate()));       
        } 
        /* //Fechas totales */
        let aux = 0;
        let aux1 = 0;
        let FECHA_REGISTRO2 = fecha_actualizacion;
        let FECHA_REGISTRO3 = fecha_actualizacion;

        for( const item of entity ){
            const FECHA_R2 = new Date();
            const FECHA_R3 = new Date();
            
            const TIEMPO = parseInt((item.props.tiempo.match(/\dias+/) || ['NaN'])[0], 10);
            aux1+= TIEMPO;
            const aux2 = aux1-1;
            const aux3 = TIEMPO > 0 ||aux1===1?aux2:aux1;
            FECHA_R3.setFullYear(lista[aux3].getFullYear());
            FECHA_R3.setMonth(lista[aux3].getMonth());
            FECHA_R3.setDate(lista[aux3].getDate());
                            
            FECHA_REGISTRO3 = FECHA_R3; 

            const propsActividad = {
                fecha: FECHA_REGISTRO2,
                fechaLimite : FECHA_REGISTRO3,
            }                 
            
            const resultActividad = await this.update(item.id, propsActividad);
            if (resultActividad.isFailure) return Result.fail(String(resultActividad.error));
            
            aux += TIEMPO;                
            FECHA_R2.setFullYear(lista[aux].getFullYear());
            FECHA_R2.setMonth(lista[aux].getMonth());
            FECHA_R2.setDate(lista[aux].getDate()); 
            FECHA_REGISTRO2 = FECHA_R2;               
        }
        return Result.ok("Completado");
    }
}
