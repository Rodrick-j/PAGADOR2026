import { Result } from "../../../../base/types/Result";
import { findAndCountResult } from "../../../../tools/util";
import  EscalaDestinoService  from "../../../../core/admin/conta_viatico/escala_destino";


type EscalaDestinoTableModel = {
    /**Se agrega segun la relacion con la tabla */
    
    id                    : string;
    destino               : string;  
    tipo_pcp              : string;
    escala_exterior       : string;   
    provincia            : string;
    modalidad            : string;
    pasaje_minimo         : number;
    pasaje_maximo         : number;
 

};

export type GetEscalaDestinosTableResponse = {
    rows: EscalaDestinoTableModel[];
    count: number;
};

export type EscalaDestinoFormDataResponse = {
    id                    : string;
    destino               : string;  
    tipo_pcp              : string;  
    escala_exterior       : string; 
    provincia            : string;
    modalidad            : string;
    pasaje_minimo         : number;
    pasaje_maximo         : number;
    

};
export type EscalaDestinoOptionsFormModel = {
    id: string;
    nombre: string;
    tipo_pcp: string;

};

export type ModalidadOptionsFormModel = {
    id: string;  
    nombre: string;

};
export type EscalaDestinoPasajeOptionsFormModel = {
    id: string;
    nombre: string; 
    modalidad: string;
    pasajeMinimo: number;
    pasajeMaximo: number;  
};
export type EscalaPasajeConcatOptionsFormModel = {
    id: string;
    nombre: string;    
};
export type ListaPasajesOptionsFormModel = {
    pasaje : number [];
};

export class EscalaDestinoView {



    public async getEscalaDestinosTable(query: any): Promise<Result<{ rows: EscalaDestinoTableModel[] }>> {
            const escalaDestino = await EscalaDestinoService.getAll();
            if (escalaDestino.isFailure) return Result.fail("Falló al obtener la EscalaDestino");
            const EscalaDestinoResult = escalaDestino.getValue();
                              
            const result: EscalaDestinoTableModel[] = EscalaDestinoResult.map((item) => {
         
                return {
                    id                    : String(item.id),    
                    tipo_pcp              : item.props.tipoPCP,   
                    escala_exterior       : item.props.escalaExterior||"-",
                    destino               : item.props.destino,   
                    provincia             : item.props.provincia|| "-",
                    modalidad             : item.props.modalidad,
                    pasaje_minimo         : item.props.pasajeMinimo,
                    pasaje_maximo         : item.props.pasajeMaximo,
                                 
                };
            });
            
            const response = findAndCountResult(result, query);
            return Result.ok(response);
    }

    public async getEscalaDestinoFormDataView(id_escalaDestino: string): Promise<Result<EscalaDestinoFormDataResponse>> {
        const escalaDestino = await EscalaDestinoService.getById(id_escalaDestino);
        if (escalaDestino.isFailure) return Result.fail<EscalaDestinoFormDataResponse>("EscalaDestino no encontrado");
        
        const props = escalaDestino.getValue().props;

        const result: EscalaDestinoFormDataResponse = {
            id                    : escalaDestino.getValue().id,                            
            tipo_pcp              : props.tipoPCP,   
            escala_exterior       : props.escalaExterior,
            destino               : props.destino,
            provincia             : props.provincia,
            modalidad             : props.modalidad,
            pasaje_minimo         : props.pasajeMinimo,
            pasaje_maximo         : props.pasajeMaximo,
           
            
        };

        return Result.ok(result);
    }

    // se aumenta el metodo get all para la busqueda de destinos //aun no se esta utilizando 
    public async getAllEscalaDestino(): Promise<Result<{ rows: EscalaDestinoOptionsFormModel[]; count: number }>> {
        const escalaDestino = await EscalaDestinoService.getAll();      
        
        const result: EscalaDestinoOptionsFormModel[] = escalaDestino
            .getValue()
            .map((item) => {
             
                return {
                    id: item.id.toString(),
                    nombre: item.props.destino,
                    tipo_pcp: item.props.tipoPCP,
                };
            })
            .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));
        return Result.ok({ rows: result, count: result.length });
    }


      // se aumenta el metodo get all para la busqueda de paises //aun no se esta utilizando 
      public async getAllPaises(): Promise<Result<{ rows: EscalaDestinoOptionsFormModel[]; count: number }>> {
        const escalaDestino = await EscalaDestinoService.getAll();    
        const INTERNACIONAL = 'INTERNACIONAL'; 
        
        const result: EscalaDestinoOptionsFormModel[] = escalaDestino
            .getValue()
            .map((item) => {                   
                return {
                    
                    id: item.id.toString(),
                    nombre: item.props.destino,
                    tipo_pcp: item.props.tipoPCP,
                };
            })
            .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));

            const filtro: EscalaDestinoOptionsFormModel[] = result
            .filter((item) => this.filtrarTipoPCP(item.tipo_pcp, INTERNACIONAL));                     
          

        return Result.ok({ rows: filtro, count: filtro.length });
    }


//filtramos por el tipo Inte,nacional o provincial
    public filtrarTipoPCP(item:string, constante:string) { 
        return (item === constante); 
     } 



      // se aumenta el metodo get all para la busqueda de comunidades //aun no se esta utilizando 
      public async getAllComunidades(): Promise<Result<{ rows: EscalaDestinoOptionsFormModel[]; count: number }>> {
        const escalaDestino = await EscalaDestinoService.getAll();   
        const PROVINCIAL = 'PROVINCIAL';    
        
        const result: EscalaDestinoOptionsFormModel[] = escalaDestino
            .getValue()
            .map((item) => {
             
                return {
                    id: item.id.toString(),
                    nombre: item.props.destino,
                    tipo_pcp: item.props.tipoPCP,
                };
            })
            .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));

            const filtroTipo: EscalaDestinoOptionsFormModel[] = result
            .filter((item) => this.filtrarTipoPCP(item.tipo_pcp, PROVINCIAL));  
            // filtramos por el tipo de nombre
            const elementosUnicos = new Map(filtroTipo.map(item => [item.nombre, item]));          
             // Asigna el resultado al filtro
            const filtro: EscalaDestinoOptionsFormModel[] = Array.from(elementosUnicos.values());

        return Result.ok({ rows: filtro, count: filtro.length });
    }

 // se aumenta el metodo get all para la busqueda de comunidades //aun no se esta utilizando 
 public async getAllModalidades(): Promise<Result<{ rows: ModalidadOptionsFormModel[]; count: number }>> {
    const escalaDestino = await EscalaDestinoService.getAll();   
     
    const result: ModalidadOptionsFormModel[] = escalaDestino
        .getValue()
        .map((item) => {
         
            return {
                id: item.id.toString(),               
                nombre: item.props.modalidad,
            };
        })
        .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));
       
       //filtramos por la modalidad de viaje
        const elementosUnicos = new Map(result.map(item => [item.nombre, item]));          
         // Asigna el resultado al filtro
        const filtro: ModalidadOptionsFormModel[] = Array.from(elementosUnicos.values());       
    return Result.ok({ rows: filtro, count: filtro.length });
}


// se aumenta el metodo get all para la busqueda de destinos //aun no se esta utilizando

public async getAllPasajes(destino : string): Promise<Result<{ rows: EscalaPasajeConcatOptionsFormModel[]; count: number }>> {
    const escalaDestino = await EscalaDestinoService.getAll();      
    if (escalaDestino.isFailure) return Result.fail("Falló al obtener la escala del Destino");
    const EscalaDestinoResult = escalaDestino.getValue();   
    
    let destinoNombre = '';

    if(EscalaDestinoResult.find((c) => c.id === destino)){
        destinoNombre =EscalaDestinoResult.find((c) => c.id === destino)?.props.destino|| "-";
    }else{
        destinoNombre =  destino;
    }
     
    const listaDestinos: EscalaDestinoPasajeOptionsFormModel[] =escalaDestino
        .getValue()
        .map((item) => {                   
            return {
                
                id: item.id.toString(),
                nombre: item.props.destino, 
                modalidad: item.props.modalidad,
                pasajeMinimo:item.props.pasajeMinimo,
                pasajeMaximo:item.props.pasajeMaximo,                
            };
        })           
     // Se filta por los destinos
    const filtroDestinos : EscalaDestinoPasajeOptionsFormModel [] = listaDestinos
    .filter((item) => this.filtrarTipoPCP(item.nombre, destinoNombre));
  
    const listaFiltroDestino: EscalaPasajeConcatOptionsFormModel[] =filtroDestinos      
        .map((item) => {                   
            return {
                
                id: item.id.toString(),
                nombre: this.concatModalidad(item.modalidad,item.pasajeMinimo,item.pasajeMaximo),               
            };
        })   
       
   return Result.ok({ rows: listaFiltroDestino, count: listaFiltroDestino.length });
 
}
  
//concatenar Modalidad y pasaje Min y maximo
public  concatModalidad(modalidad:string, minValue:number, maxValue:number):string{    
  return modalidad.concat(' -').concat(' Psj.Min: ').concat(String(minValue)).concat(' -').concat(' Psj.Max: ').concat(String(maxValue));
}


//Rango de Pasaje
public  generarListaPasajes(minValue:number, maxValue:number):number[]{
    const range = [];
  for (let i = minValue; i <= maxValue; i++) {   
      range.push(i);     }
  return range;
}

   
}