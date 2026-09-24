import { BaseHttpController } from "../../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../../base/types/Result";
import DetalleDestinoView from "..";
import moment from "moment";
import { DetalleDestinoFormDataResponse, DetalleDestinoOptionsFormModel, DetalleFechasOptionsFormModel } from "../DetalleDestinoView";
import DetalleDestinoService from "../../../../../core/admin/conta_viatico/detalle_destino/";
import { DetalleDestinoProps } from "../../../../../core/admin/conta_viatico/detalle_destino/DetalleDestinoEntity";
import  MemorandumService  from "../../../../../core/admin/conta_viatico/memorandum";



export class DetalleDestinoViewController extends BaseHttpController {
    public async getDetalleDestinosTable(req: Request, res: Response): Promise<Response<any>> {
        const detalleDestino = await DetalleDestinoView.getDetalleDestinosTable(req.query);
        if (detalleDestino.isFailure) return this.fail(res, "Falló al obtener la tabla de DetalleDestino");
        return this.ok<any>(res, detalleDestino.getValue());
    }
    public async getDetalleDestinosUnicoTable(req: Request, res: Response): Promise<Response<any>> {
        const detalleDestino = await DetalleDestinoView.getDetalleDestinosUnicoTable(req.query);
        if (detalleDestino.isFailure) return this.fail(res, "Falló al obtener la tabla de DetalleDestino");
        return this.ok<any>(res, detalleDestino.getValue());
    }

    public async getDetalleDestinoFormData(req: Request, res: Response): Promise<any> {
        const formData = await DetalleDestinoView.getDetalleDestinoFormDataView(req.params.detalle_destino_id);
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<DetalleDestinoFormDataResponse>(res, formData.getValue());
    }    

    public async createOrUpdateDetalleDestino(req: Request, res: Response): Promise<any> {
        const data = req.body;				
        const totalPasajes = this.sumaPasajeViaticosDia(parseFloat(data.pasaje_ida), parseFloat(data.pasaje_retorno));
        
        const ID_DETALLE_DESTINO = data.id;
		const MEMORANDUM_ID = data.memorandum_id; 

        const memorandum = await MemorandumService.getById(MEMORANDUM_ID);
        if (memorandum.isFailure) return Result.fail('Falló al obtener la Memorandum');  
        const memorandumResult = memorandum.getValue();

        const detalleDestino = await DetalleDestinoService.getAll();
        if (detalleDestino.isFailure) return Result.fail("Falló al obtener la Detalle Destino");
        const detalleDestinoResult = detalleDestino.getValue(); 

        let hora_inicio = '';
        let hora_fin = '';
        if(ID_DETALLE_DESTINO){
            hora_inicio = data.hora_inicio;						
            hora_fin    = data.hora_fin;
        }else{
           // hora_inicio = data.hora_inicio?moment(data.hora_inicio).format("HH:mm").toString(): '';
           // hora_fin    = data.hora_fin?moment(data.hora_fin).format("HH:mm").toString(): '';
           hora_inicio = data.hora_inicio;						
           hora_fin    = data.hora_fin;
        } 
         
        //Actualizando cantidad de dias de  acuerdo a si existe viaje o no
        const estado = data.hay_viaje === 'SIN_VIAJE'? 'SIN_VIAJE':data.estado;
        if(data.hay_viaje === 'SIN_VIAJE'){                   
            /* listado de actividades */                   
            const numeDias = memorandumResult.props.cantidadDias;    
            const cantidadDias = numeDias - 1;   
            const resultMemo = await MemorandumService.update(MEMORANDUM_ID, {cantidadDias});          
             if (resultMemo.isFailure) return this.fail(res, String(resultMemo.error));            
          }

         //Fin de actualizacion cantidad de dias 
            const props: DetalleDestinoProps = {									
		
            tipoVehiculoOP              : data.tipo_vehiculo_op,
            objetivoViaje               : data.objetivo_viaje,
            destinoReg                  : data.destino_reg,
            fechaDia                    : data.fecha_dia, 
            horaInicio                  : hora_inicio,
            horaFin                     : hora_fin,
            pernocte                    : data.pernocte,
            pasajeIda                   : data.pasaje_ida,
            pasajeRetorno               : data.pasaje_retorno,
            totalPasajedia              : totalPasajes,
            tipoVehiculoOPIda           : data.tipo_vehiculo_opvida,
            tipoVehiculoOPVuelta        : data.tipo_vehiculo_opvuelta,
            estado                      : estado,//data.estado,  
            modificacion                : data.modificacion,
            observacion                 : data.observacion,
            estadoObservacion           : data.estado_observacion,
            memorandumId                : data.memorandum_id,
            viaticoId                   : data.viatico_id,
            vehiculoId                  : data.vehiculo_id,
            destinoId                   : data.destino_id, 
            destinoId2                  : data.destino_id2,  
        };

        // actualizando dias si existe una edicion en memorandums
         
      /*   const diasSinViaje = detalleDestinoResult.filter((c) => c.props.memorandumId === MEMORANDUM_ID && c.props.estado === "SIN_VIAJE");         
         console.log("TCL: DetalleDestinoViewController -> diasSinViaje", diasSinViaje)
         const cantidadDiasMemo = memorandumResult.props.cantidadDias;             
         console.log("TCL: DetalleDestinoViewController -> cantidadDiasMemo", cantidadDiasMemo)
         const cantidadDias = cantidadDiasMemo - diasSinViaje.length;
         console.log("TCL: DetalleDestinoViewController -> cantidadDias", cantidadDias)
         
            if(cantidadDias != cantidadDiasMemo){
                const resultMemo = await MemorandumService.update(MEMORANDUM_ID, {cantidadDias});          		
                if (resultMemo.isFailure) return this.fail(res, String(resultMemo.error));
            }*/
     
         // fin actualizar dias
        
        let result = null;
        if (ID_DETALLE_DESTINO) {
            result = await DetalleDestinoService.update(ID_DETALLE_DESTINO, props);
            if (result.isFailure) return this.fail(res, String(result.error));
            return this.ok(res, result);
        }
       

        result = await DetalleDestinoService.create(props);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    public async destroyDetalleDestino(req: Request, res: Response): Promise<any> {
        const ID_DET_DEST = req.params.detalle_destino_id;		
        const detalleDestinoR = await DetalleDestinoService.getById(ID_DET_DEST);		
        if (detalleDestinoR.isFailure) return this.fail(res, String(detalleDestinoR.error));       

         //Actualizando cantidad de dias de  acuerdo a si existe viaje o no
         
         if(detalleDestinoR.getValue().props.estado === 'SIN_VIAJE'){
             const MEMORANDUM_ID =  detalleDestinoR.getValue().props.memorandumId;                 
               /* listado de actividades */
             const memorandum = await MemorandumService.getById(MEMORANDUM_ID);
             if (memorandum.isFailure) return Result.fail('Falló al obtener la Memorandum');  
             const memorandumResult = memorandum.getValue();        
             const numeDias = memorandumResult.props.cantidadDias;    
             const cantidadDias = numeDias + 1;               
             const resultMemo = await MemorandumService.update(MEMORANDUM_ID, {cantidadDias});          
              if (resultMemo.isFailure) return this.fail(res, String(resultMemo.error));
             
           }
          //Fin de actualizacion cantidad de dias 

        const result = await DetalleDestinoService.delete(ID_DET_DEST);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    //Sumatoria de Pasajes
    public sumaPasajeViaticosDia(pasajeIda : number, pasajeRetorno : number): number{              
        return pasajeIda + pasajeRetorno;
    }
  

    //Se agrega para memorandum detalle
  public async getTipoVehiculo(req: Request, res: Response): Promise<any> {   
    const detalleDestino = await DetalleDestinoView.getTipoVehiculo( req.params.detalle_destino_id);
    if (detalleDestino.isFailure) return this.fail(res, 'Falló al obtener El tipo de comisión');
    return this.ok<DetalleDestinoOptionsFormModel>(res, detalleDestino.getValue());
  }

//cambio de estado a aprobado
public async changeApprove(req: Request, res: Response): Promise<any> {
   
    const ID_DETALLE_DESTINO = req.params.detalle_destino_id;
    const estado = req.body.aprobado;             
    const result = await DetalleDestinoService.update(ID_DETALLE_DESTINO, { estado });
    if (result.isFailure) return this.fail(res, "Falló al cambiar estado en Detalle destino");   
    return this.ok(res);
}

 //Se agrega para sumar pasajes
 public async getSumatoriaPasaje(req: Request, res: Response): Promise<any> {    
    const detalleDestino = await DetalleDestinoView.getSumatoriaPasaje( req.params.viatico_id);
    if (detalleDestino.isFailure) return this.fail(res, 'Falló al obtener El tipo de comisión');
    return this.ok<any>(res, detalleDestino.getValue());
  }

   //Se agrega para memorandum detalle
   public async getDestinoExterior(req: Request, res: Response): Promise<any> {      
    const detalleDestino = await DetalleDestinoView.getDestinoExterior( req.params.memorandum_id);
    if (detalleDestino.isFailure) return this.fail(res, 'Falló al obtener El destino Exterior');
    return this.ok<any>(res, detalleDestino.getValue());
  }

  //Se agrega para memorandum detalle
  public async getRangoFechas(req: Request, res: Response): Promise<any> {      
    const detalleDestino = await DetalleDestinoView.getRangoFechas( req.params.memorandum_id);
    if (detalleDestino.isFailure) return this.fail(res, 'Falló al obtener el numero de destinos');
    return this.ok<any>(res, detalleDestino.getValue());
  }


   //Se agrega para memorandum detalle
   public async getDetalleDestinoExist(req: Request, res: Response): Promise<any> {      
    const detalleDestino = await DetalleDestinoView.getDetalleDestinoExist( req.params.memorandum_id);
    if (detalleDestino.isFailure) return this.fail(res, 'Falló al obtener el numero de destinos');
    return this.ok<any>(res, detalleDestino.getValue());
  }

  public async getFechaData(req: Request, res: Response): Promise<any> {
    const nro = new Date(req.params.nro);   
    const memorandumId = req.params.memorandum_id;  
    const fechadia = await DetalleDestinoService.getAll();
    if (fechadia.isFailure) return this.fail(res, "Detalle destino no encontrado");      
   //Lista de destinos
   const listaDestinos: DetalleFechasOptionsFormModel[] = fechadia
   .getValue()
   .map((item) => {                   
       return {
           
           id: item.id.toString(),
           id_memorandum: item.props.memorandumId,
           destino                 : item.props.destinoReg,          
           fecha_dia               : item.props.fechaDia,                           
       };
   }) ; 

// Se filta por los destinos
    const filtroDestinos : DetalleFechasOptionsFormModel [] = listaDestinos
    .filter((item) => this.filtrarId(item.id_memorandum, memorandumId));

    // Se filta por los destinos
    const filtroFechas : DetalleFechasOptionsFormModel [] = filtroDestinos
    .filter((item) => this.filtrarFechas(item.fecha_dia, nro));    
  
    return this.ok<any>(res, {nro: filtroFechas.length > 0});
}
    //filtramos por el tipo de id 
    public filtrarId(item:string, id:string) { 
      return (item === id); 
   } 

   public filtrarFechas(item:Date, fecha:Date) { 
    const fechaItem  =item?moment(item).format("YYYY/MM/DD").toString(): '';  
    const fechaNro  =fecha?moment(fecha).format("YYYY/MM/DD").toString(): '';      
       return (fechaItem === fechaNro); 
   } 

   public async getListaPernocte(req: Request, res: Response): Promise<any> {      
    const detalleDestino = await DetalleDestinoView.getListaPernocte( req.params.memorandum_id);
    if (detalleDestino.isFailure) return this.fail(res, 'Falló al obtener el numero de destinos');
    return this.ok<any>(res, detalleDestino.getValue());
  }

}
