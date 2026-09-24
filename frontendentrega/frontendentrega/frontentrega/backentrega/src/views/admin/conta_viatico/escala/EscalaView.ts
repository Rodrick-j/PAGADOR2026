import { Result } from "../../../../base/types/Result";
import { findAndCountResult } from "../../../../tools/util";
import  EscalaService  from "../../../../core/admin/conta_viatico/escala";
import  CargoService  from "../../../../core/rrhh/cargo";
import  PersonalService  from "../../../../core/rrhh/personal";

type EscalaTableModel = {
    /**Se agrega segun la relacion con la tabla */
    
    id                    : string;
    categoria             : string;
    tipo_comision_idp     : string;
    escala                : string;
    viatico_por_dia       : number;
    moneda                : string;
    bolivianos            : number; 
    cargo_id              : string;
    item_contrato?         : string;

};

export type GetEscalasTableResponse = {
    rows: EscalaTableModel[];
    count: number;
};

export type EscalaFormDataResponse = {
    id                    : string;
    categoria             : string;
    tipo_comision_idp     : string;
    escala                : string;
    viatico_por_dia       : number;
    moneda                : string;
    bolivianos            : number; 
    cargo_id              : string;
    
};

export type EscalasOptionsFormModel = {
    id: string;
    nombre: string;
    concepto?: string;
};

export class EscalaView {
    public async getEscalasTable(query: any): Promise<Result<{ rows: EscalaTableModel[] }>> {
            const escala = await EscalaService.getAll();
            if (escala.isFailure) return Result.fail("Falló al obtener la Escala");
            const EscalaResult = escala.getValue();
            /*Listado de cargos*/
            const cargo = await CargoService.getAll();
            if(cargo.isFailure) return Result.fail("Fallo al obtener el Cargo");
            const cargoResult = cargo.getValue();
                    
            const result: EscalaTableModel[] = EscalaResult.map((item) => {
            const cargoNombre = cargoResult.find((c) => c.id === item.props.cargoId)?.props.nombre|| "-";
            const itemContrato = cargoResult.find((c) => c.id === item.props.cargoId)?.props.item|| "-";  
                return {
                    id                     : String(item.id),                     
                    categoria              : item.props.categoria,    
                    tipo_comision_idp      :item.props.tipoComisionIdp,              
                    escala                 : item.props.escala,
                    viatico_por_dia        : item.props.viaticoPorDia,
                    moneda                : item.props.moneda,
                    bolivianos             : item.props.bolivianos,
                    cargo_id               : cargoNombre,
                    item_contrato          : itemContrato,
                };
            });
            
            const response = findAndCountResult(result, query);
            return Result.ok(response);
    }

    public async getEscalaFormDataView(id_escala: string): Promise<Result<EscalaFormDataResponse>> {
        const escala = await EscalaService.getById(id_escala);
        if (escala.isFailure) return Result.fail<EscalaFormDataResponse>("Escala no encontrado");
        
        const props = escala.getValue().props;

        const result: EscalaFormDataResponse = {
            id                     : escala.getValue().id,                            
            categoria              : props.categoria,   
            tipo_comision_idp      : props.tipoComisionIdp,      
            escala                 : props.escala,
            viatico_por_dia        : props.viaticoPorDia,
            moneda                 : props.moneda,
            bolivianos             : props.bolivianos,
            cargo_id               : props.cargoId || "",
        };

        return Result.ok(result);
    }

     // se aumenta el metodo get all para la busqueda de destinos //aun no se esta utilizando 
     public async getAllEscala(): Promise<Result<{ rows: EscalasOptionsFormModel[]; count: number }>> {
        const escala = await EscalaService.getAll();      
        
        const result: EscalasOptionsFormModel[] = escala
            .getValue()
            .map((item) => {
             
                return {
                    id: item.id.toString(),
                    nombre             : item.props.categoria,
                    concepto           : item.props.escala,
                  
                };
            })
           // .sort((a, b) => (a.nombre > b.nombre ? 1 : -1));
        return Result.ok({ rows: result, count: result.length });
    }

    //Se envia datos requeridos del memorandum
 public async getEscalaCategoriaIDP(cargo: string, tipo_comision_idp:string, usuario_id: string): Promise<Result<EscalaTableModel>> {
 
    //Listado de Escalas
    const escala = await EscalaService.getAll();
    if(escala.isFailure) return Result.fail("Fallo al obtener el Cargo");
    const escalaResult = escala.getValue();
    //Listado de Cargos 
    const cargoList = await CargoService.getAll();
    if(cargoList.isFailure) return Result.fail("Fallo al obtener el Cargo");
    const cargoListResult = cargoList.getValue();
    
    /*Listado de personal*/
     const personal =await PersonalService.getAll();
    if(personal.isFailure) return Result.fail("Fallo al obtener el Personal");
     const personalResult = personal.getValue();
    //seleccionamos del listado de area el nombre del departamento y su sigla
    const cargoID = personalResult.find((c) => c.props.usuarioId === usuario_id)?.props.cargoId|| "-";//Revisar
   // const cargoID = cargoListResult.find((c) => c.props.nombre === cargo)?.id|| "-";//Revisar
     
    const listaEscala: EscalaTableModel[] = escalaResult.map((item) => {        
            return {
                id                     : String(item.id),                     
                categoria              : item.props.categoria,    
                tipo_comision_idp      : item.props.tipoComisionIdp,              
                escala                 : item.props.escala,
                viatico_por_dia        : item.props.viaticoPorDia,
                moneda                : item.props.moneda,
                bolivianos             : item.props.bolivianos,
                cargo_id               : item.props.cargoId,
            };
        });
      // Se filta por los destinos
    const listaPorCargo : EscalaTableModel [] = listaEscala
    .filter((item) => this.filtrarCargoIdp(item.cargo_id, cargoID));
   
    const listaPorComision : EscalaTableModel [] = listaPorCargo
    .filter((item) => this.filtrarCargoIdp(item.tipo_comision_idp, tipo_comision_idp));
    
    if(listaPorComision.length > 0){
    const result: EscalaTableModel = {
        id                     : listaPorComision[0].id,                          
        categoria              : listaPorComision[0].categoria,   
        tipo_comision_idp      : listaPorComision[0].tipo_comision_idp,      
        escala                 : listaPorComision[0].escala,
        viatico_por_dia        : listaPorComision[0].viatico_por_dia,
        moneda                : listaPorComision[0].moneda,
        bolivianos             : listaPorComision[0].bolivianos,
        cargo_id               : listaPorComision[0].cargo_id,
    };
    
    return Result.ok(result);
   } else {
    const result: EscalaTableModel = {
        id                     : '',                          
        categoria              : '',   
        tipo_comision_idp      : '',      
        escala                 : '',
        viatico_por_dia        : 0,
        moneda                 : '',
        bolivianos             : 0,
        cargo_id               : '',
    };
    
    return Result.ok(result);
	
    }  
    
}

   //filtramos por el tipo de id 
   public filtrarCargoIdp(item:string, cargoIdp:string) {       
    return (item === cargoIdp); 
 } 

}