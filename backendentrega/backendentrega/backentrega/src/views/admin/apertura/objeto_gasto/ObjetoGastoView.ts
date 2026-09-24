import { Result } from "../../../../base/types/Result";
import { findAndCountResult } from "../../../../tools/util";
import  ObjetoGastoService  from "../../../../core/admin/apertura/objeto_gasto";
import  AreaService  from "../../../../core/rrhh/area";


type ObjetoGastoTableModel = {  
    id                             : string;
    /**Se agrega segun la relacion con la tabla */
    nombre_area?: string;
    sigla_area?:string; 
    /** Tabla original de la BDD*/
   
    objeto                         : string;
    descripcion_objeto_gasto       : string;   
    observacion                    : string;   
    estado                         : boolean; 
};

export type GetObjetoGastosTableResponse = {
    rows: ObjetoGastoTableModel[];
    count: number;
};

export type ObjetoGastoFormDataResponse = {
    id: string;     
    objeto                         : string;
    descripcion_objeto_gasto       : string;      
    observacion                    : string; 
    estado                         : boolean;  // Campos adicionales
    // Campos adicionales

};

export type ObjetoGastosOptionsFormModel = {
    id: string;
    nombre: string;
    concepto: string;
};

export class ObjetoGastoView {
    public async getObjetoGastosTable(query: any): Promise<Result<{ rows: ObjetoGastoTableModel[] }>> {
            const objetoGasto = await ObjetoGastoService.getAll();
            if (objetoGasto.isFailure) return Result.fail("Falló al obtener la ObjetoGasto");
            const objetoGastoResult = objetoGasto.getValue();
            
            /*Listado de areas*/
            const area = await AreaService.getAll();
            if(area.isFailure) return Result.fail("Fallo al obtener el Area");
          //  const areaResult = area.getValue();
            
            const result: ObjetoGastoTableModel[] = objetoGastoResult.map((item) => {
               /**seleccionamos del listado de area el nombre del departamento y su sigla*/
           //    const areaNombre = areaResult.find((c) => c.id === item.props.objeto)?.props.nombre|| "-";
           //    const areaSigla = areaResult.find((c) => c.id === item.props.objeto)?.props.sigla|| "-";

            
               return {
                    id                             : String(item.id),                   
                    objeto                         : item.props.objeto,
                    descripcion_objeto_gasto       : item.props.descripcionObjetoGasto,                   
                    observacion                    : item.props.observacion,
                    estado                         : item.props.estado,
                
                };
            });
            
            const response = findAndCountResult(result, query);
            return Result.ok(response);
    }

    public async getObjetoGastoFormDataView(id_objeto_gasto: string): Promise<Result<ObjetoGastoFormDataResponse>> {
        const objetoGasto = await ObjetoGastoService.getById(id_objeto_gasto);		
        if (objetoGasto.isFailure) return Result.fail<ObjetoGastoFormDataResponse>("Objeto Gasto no encontrado");
        
        const props = objetoGasto.getValue().props;

        const result: ObjetoGastoFormDataResponse = {					
                    id                             : objetoGasto.getValue().id,                  
                    objeto                         : props.objeto,
                    descripcion_objeto_gasto       : props.descripcionObjetoGasto,            
                    observacion                    : props.observacion,
                    estado                         : props.estado,                 
        };       
        return Result.ok(result);
    }
    
    public async getObjetoGastoDataView(id_objeto_gasto: string): Promise<Result<ObjetoGastoFormDataResponse>> {
        const objetoGasto = await ObjetoGastoService.getById(id_objeto_gasto);		
        if (objetoGasto.isFailure) return Result.fail<ObjetoGastoFormDataResponse>("Objeto Gasto no encontrado");
        
        const props = objetoGasto.getValue().props;

        const result: ObjetoGastoFormDataResponse = {					
                    id                             : objetoGasto.getValue().id,                  
                    objeto                         : props.objeto,
                    descripcion_objeto_gasto       : props.descripcionObjetoGasto,            
                    observacion                    : props.observacion,
                    estado                         : props.estado,                 
        };       
        return Result.ok(result);
    }

     // se aumenta el metodo get all para la busqueda de apertura 
     public async getAllObjetoGasto(): Promise<Result<{ rows: ObjetoGastosOptionsFormModel[]; count: number }>> { // corregir objeto
        const objeto = await ObjetoGastoService.getAll();      
     
        const listaAperturas: ObjetoGastosOptionsFormModel[] = objeto
            .getValue()
            .map((item) => {     //Que llenen los valores de apertura programatica y sisin al mismo tiempo
               if(!item.props.estado){
                 return undefined; // 
               }
               return {
                id: item.id.toString(),
                nombre: item.props.objeto,
                concepto: item.props.descripcionObjetoGasto,
               };
            }).filter((item): item is ObjetoGastosOptionsFormModel => item !== undefined) 
            listaAperturas.sort((a, b) => (a.nombre > b.nombre ? 1 : -1));

             // filtramos por el tipo de nombre es decir eliminara repetidos
          //   const elementosUnicos = new Map(listaAperturas.map(item => [item.nombre, item]));          
             // Asigna el resultado al filtro
            const result: ObjetoGastosOptionsFormModel[] = Array.from(listaAperturas.values());			

        return Result.ok({ rows: result, count: result.length });
    }
}