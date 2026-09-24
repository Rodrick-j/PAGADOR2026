import { AuthUser } from "../../../base/types/AuthUser";
import { Result } from "../../../base/types/Result";
import { findAndCountResult } from "../../../tools/util";

import AreaService from "../../../core/rrhh/area";
import PersonalService from "../../../core/rrhh/personal";


export type AreaTableModel = {
    id        ?: string;
    sigla      : string;
    nombre     : string;
    areaNombre?: string;
    indice     : string;
    activo     : boolean;
};

export type AreaFormDataResponse = {
    id      : string;
    sigla   : string;
    nombre  : string;
    padre   : string;
    area_id?: string | null;
    indice  : string;
    activo  : boolean;
};

export type AreaOptionsFormModel = {
    id      : string;
    nombre  : string;
    concepto: string;
};

export type AreaHijosOptionsFormModel = {
    id      : string;
    nombre  : string;
    concepto: boolean;
};
export type AreaHijosOptionsFormModel2 = {
    id     : string;
    nombre : string;
    area_id: string;
};
export type areaCite = {
    id      : string;
    nombre  : string;
    caption?: string;
};

export type MemorandumCite = {
    id      : string;
    nombre  : string;
    caption?: string;
};

export class AreaView {
    public async getTableArea(query: any): Promise<Result<{ rows: AreaTableModel[] }>> {
        /* listado de area */
        const area = await AreaService.getAll();
        if (area.isFailure) return Result.fail("Falló al obtener la area");
        const areaResult = area.getValue();        

        /* listado general de la tabla area ordenados */
        const result: AreaTableModel[] = await Promise.all(
            areaResult.map(async (item) => {           
              const areaNombre = await AreaService.getIndicePorSigla(item.props.indice, areaResult);
              return {
                id        : String(item.id),
                sigla     : item.props.sigla,
                nombre    : item.props.nombre,
                areaNombre: areaNombre.getValue(),
                indice    : item.props.indice,
                padre     : item.props.padre,
                activo    : item.props.activo,
              };
            })
          );

        const response = findAndCountResult(result, query);
        return Result.ok(response);
    }

    public async getAreaFormDataView(id_area: string): Promise<Result<AreaFormDataResponse>> {
        const area = await AreaService.getById(id_area);
        if (area.isFailure) {
            return Result.fail<AreaFormDataResponse>("Area no encontrado");
        }

        const props = area.getValue().props;
        const PADRE_VALUE = props.padre ? "si" : "no";
        const result: AreaFormDataResponse = {
            id     : area.getValue().id,
            sigla  : props.sigla,
            nombre : props.nombre,
            padre  : PADRE_VALUE,
            area_id: props.areaId || null,
            indice  : props.indice,
            activo : props.activo,
        };

        return Result.ok(result);
    }

    public async getAllArea(): Promise<Result<{ rows: AreaOptionsFormModel[]; count: number }>> {
        const areas = await AreaService.getAll();
        const result: AreaOptionsFormModel[] = areas
            .getValue().filter((a) => a.props.activo)
            .map((item) => {
                return {
                    id: item.id.toString(),
                    nombre: item.props.nombre,
                    concepto: item.props.indice,
                };
            })
            .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));
        return Result.ok({ rows: result, count: result.length });
    }

    public async getAllAreaCliente(authUser: AuthUser): Promise<Result<{ rows: AreaOptionsFormModel[]; count: number }>> {
        const ID_USUARIO = authUser.uid;

        const personal = await PersonalService.getAll();
        if (personal.isFailure) return Result.fail("Falló al obtener la personal");
        const personalResult = personal.getValue().find((p) => p.props.usuarioId === ID_USUARIO);
        
        const areas = await AreaService.getAll();
        if (areas.isFailure) return Result.fail("Areas no encontrado");
        const areasResult = areas.getValue().filter((a) => a.props.activo);
        
        const result: AreaOptionsFormModel[] = areasResult
            .filter((a) => a.props.areaId === personalResult?.props.areaId)
            .map((item) => {
                return {
                    id: item.id.toString(),
                    nombre: item.props.nombre,
                    concepto: item.props.indice,
                };
            })
            .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));

        return Result.ok({ rows: result, count: result.length });
    }
       


    //Se envia
public async getAreaHijos(): Promise<Result<{ rows: AreaHijosOptionsFormModel2[]; count: number }>> {
    /*Listado de areas*/
    const area = await AreaService.getAll();
    if(area.isFailure) return Result.fail("Fallo al obtener el Area");
    const areaResult = area.getValue();

      
    //filtramos y eliminamos repetidos de CodFte y codOrg
    const listaAreas: AreaHijosOptionsFormModel[] = areaResult
    .map((item) => {     //Que llenen los valores de apertura programatica y sisin al mismo tiempo
        const seleccion = ('Area: ').concat(item.props.nombre)
        .concat(' -  SIGLA: ').concat(item.props.sigla);
        return {
            id: item.id.toString(),
            nombre: seleccion,
            concepto: item.props.padre,
        };
    })
    .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));   

    const listaAreaHijos: AreaHijosOptionsFormModel2[] = [];   

    for (let i = 0; i < listaAreas.length; i++) {
      if(listaAreas[i].concepto){//si es padre
        areaResult
        .map((item) => { 
            if(item.props.areaId === listaAreas[i].id ){
               listaAreaHijos.push({id: item.id,nombre:item.props.nombre.concat(' - SIGLA: ').concat(item.props.sigla),area_id:listaAreas[i].id});   
            }          
            
        // listaUsuarioApertura.push({id:item.id, nombre:nombre!,id_usuario:item.props.usuarioId!})     
        /* return {
                id: item.id.toString(),
                nombre:nombre, //
                id_usuario: item.props.usuarioId!,
            };              */
        });
      }        
    }
        listaAreaHijos.sort((a, b) => (a.nombre > b.nombre ? 1 : -1));        
	
        return Result.ok({ rows: listaAreaHijos, count: listaAreaHijos.length });
}

public async getCite(): Promise<Result<{ rows: MemorandumCite[]; count: number }>> {
      /*Listado de areas*/
      const area = await AreaService.getAll();
      if(area.isFailure) return Result.fail("Fallo al obtener el Area");
      const areaResult = area.getValue();
       
      /* listado general de la tabla area ordenados */
      const result: MemorandumCite[] = await Promise.all(
        areaResult.map(async (item) => {                 
          const cite = await AreaService.getIndicePorSigla(item.props.indice, areaResult);       
       
          return {
            id        : item.id.toString(), 
            nombre    : cite.getValue(),
           // caption: item.props.areaId,
          };
        })
      );
    
    return Result.ok({ rows: result, count: result.length });
} 

    
}
