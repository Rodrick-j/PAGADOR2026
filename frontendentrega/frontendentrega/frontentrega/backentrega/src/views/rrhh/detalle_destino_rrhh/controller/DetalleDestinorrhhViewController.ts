import { BaseHttpController } from "../../../../base/infra/BaseHttpController";
import { Request, Response } from "express";
import { Result } from "../../../../base/types/Result";
import DetalleDestinorrhhView from "..";
import moment from "moment";
import { DetalleDestinorrhhFormDataResponse, DetalleDestinorrhhOptionsFormModel, DetalleFechasOptionsFormModel } from "../DetalleDestinorrhhView";


import  MemorandumrrhhService  from "../../../../core/rrhh/memorandum_rrhh";
import { DetalleDestinorrhhProps } from "../../../../core/rrhh/detalle_destino_rrhh/DetalleDestinorrhhEntity";
import  DetalleDestinorrhhService  from "../../../../core/rrhh/detalle_destino_rrhh";



export class DetalleDestinorrhhViewController extends BaseHttpController {
    public async getDetalleDestinosTable(req: Request, res: Response): Promise<Response<any>> {     
     
        const detalleDestino = await DetalleDestinorrhhView.getDetalleDestinosTable(req.query);							
        if (detalleDestino.isFailure) return this.fail(res, "Falló al obtener la tabla de DetalleDestino");
        return this.ok<any>(res, detalleDestino.getValue());
    }
    public async getDetalleDestinosUnicoTable(req: Request, res: Response): Promise<Response<any>> {
        const detalleDestino = await DetalleDestinorrhhView.getDetalleDestinosUnicoTable(req.query);
        if (detalleDestino.isFailure) return this.fail(res, "Falló al obtener la tabla de DetalleDestino");
        return this.ok<any>(res, detalleDestino.getValue());
    }

    public async getDetalleDestinoFormData(req: Request, res: Response): Promise<any> {
   
        const formData = await DetalleDestinorrhhView.getDetalleDestinoFormDataView(req.params.detalle_destino_rrhh_id);				
        if (formData.isFailure) return this.fail(res, "Falló al obtener los datos del formulario");
        return this.ok<DetalleDestinorrhhFormDataResponse>(res, formData.getValue());
    }    

    public async createOrUpdateDetalleDestino(req: Request, res: Response): Promise<any> {
        const data = req.body;								
          // const totalPasajes = this.sumaPasajeViaticosDia(parseFloat(data.pasaje_ida), parseFloat(data.pasaje_retorno));
        
        const ID_DETALLE_DESTINO = data.id;
		

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
            const MEMORANDUM_ID = data.memorandumrrhh_id;        
              /* listado de actividades */
            const memorandum = await MemorandumrrhhService.getById(MEMORANDUM_ID);
            if (memorandum.isFailure) return Result.fail('Falló al obtener la Memorandum');  
            const memorandumResult = memorandum.getValue();        
            const numeDias = memorandumResult.props.cantidadDias;    
            const cantidadDias = numeDias - 1;   
            const resultMemo = await MemorandumrrhhService.update(MEMORANDUM_ID, {cantidadDias});          
             if (resultMemo.isFailure) return this.fail(res, String(resultMemo.error));
            
          }
         //Fin de actualizacion cantidad de dias 
            const props: DetalleDestinorrhhProps = {									
		
            tipoVehiculoOP              : data.tipo_vehiculo_op,
            objetivoViaje               : data.objetivo_viaje,
            destinoReg                  : data.destino_reg,
            fechaDia                    : data.fecha_dia, 
            horaInicio                  : hora_inicio,
            horaFin                     : hora_fin,
            pernocte                    : data.pernocte,
            estado                      : estado,//data.estado,  
            modificacion                : data.modificacion,
            observacion                 : data.observacion,
            estadoObservacion           : data.estado_observacion,
            memorandumrrhhId            : data.memorandum_rrhh_id,            
            vehiculoId                  : data.vehiculo_id,
            destinoId                   : data.destino_id, 
            destinoId2                  : data.destino_id2,  
        };
        
        let result = null;
        if (ID_DETALLE_DESTINO) {
            result = await DetalleDestinorrhhService.update(ID_DETALLE_DESTINO, props);
            if (result.isFailure) return this.fail(res, String(result.error));
              return this.ok(res, result);
        }
        result = await DetalleDestinorrhhService.create(props);
        if (result.isFailure) return Result.fail(result.error);
          return this.ok<any>(res, result);
    }

    public async destroyDetalleDestino(req: Request, res: Response): Promise<any> {
        const ID_DET_DEST = req.params.detalle_destino_rrhh_id;		
        const detalleDestinoR = await DetalleDestinorrhhService.getById(ID_DET_DEST);		
        if (detalleDestinoR.isFailure) return this.fail(res, String(detalleDestinoR.error));       

         //Actualizando cantidad de dias de  acuerdo a si existe viaje o no
         
         if(detalleDestinoR.getValue().props.estado === 'SIN_VIAJE'){
             const MEMORANDUM_ID =  detalleDestinoR.getValue().props.memorandumrrhhId;                 
               /* listado de actividades */
             const memorandum = await MemorandumrrhhService.getById(MEMORANDUM_ID);
             if (memorandum.isFailure) return Result.fail('Falló al obtener la Memorandum');  
             const memorandumResult = memorandum.getValue();        
             const numeDias = memorandumResult.props.cantidadDias;    
             const cantidadDias = numeDias + 1;               
             const resultMemo = await MemorandumrrhhService.update(MEMORANDUM_ID, {cantidadDias});          
              if (resultMemo.isFailure) return this.fail(res, String(resultMemo.error));
             
           }
          //Fin de actualizacion cantidad de dias 

        const result = await DetalleDestinorrhhService.delete(ID_DET_DEST);
        if (result.isFailure) return Result.fail(result.error);
        return this.ok<any>(res, result);
    }

    //Sumatoria de Pasajes
    public sumaPasajeViaticosDia(pasajeIda : number, pasajeRetorno : number): number{              
        return pasajeIda + pasajeRetorno;
    }
  

    //Se agrega para memorandum detalle
  public async getTipoVehiculo(req: Request, res: Response): Promise<any> {   
    const detalleDestino = await DetalleDestinorrhhView.getTipoVehiculo( req.params.detalle_destino_rrhh_id);
    if (detalleDestino.isFailure) return this.fail(res, 'Falló al obtener El tipo de comisión');
    return this.ok<DetalleDestinorrhhOptionsFormModel>(res, detalleDestino.getValue());
  }

//cambio de estado a aprobado
public async changeApprove(req: Request, res: Response): Promise<any> {
   
    const ID_DETALLE_DESTINO = req.params.detalle_destino_rrhh_id;
    const estado = req.body.aprobado;             
    const result = await DetalleDestinorrhhService.update(ID_DETALLE_DESTINO, { estado });
    if (result.isFailure) return this.fail(res, "Falló al cambiar estado en Detalle destino");   
    return this.ok(res);
}

 //Se agrega para sumar pasajes
 

   //Se agrega para memorandum detalle
   public async getDestinoExterior(req: Request, res: Response): Promise<any> {      
    const detalleDestino = await DetalleDestinorrhhView.getDestinoExterior( req.params.memorandum_id);
    if (detalleDestino.isFailure) return this.fail(res, 'Falló al obtener El destino Exterior');
    return this.ok<any>(res, detalleDestino.getValue());
  }

  //Se agrega para memorandum detalle
  public async getRangoFechas(req: Request, res: Response): Promise<any> {      
    const detalleDestino = await DetalleDestinorrhhView.getRangoFechas( req.params.memorandum_id);
    if (detalleDestino.isFailure) return this.fail(res, 'Falló al obtener el numero de destinos');
    return this.ok<any>(res, detalleDestino.getValue());
  }


   //Se agrega para memorandum detalle
   public async getDetalleDestinoExist(req: Request, res: Response): Promise<any> {      
    const detalleDestino = await DetalleDestinorrhhView.getDetalleDestinoExist( req.params.memorandum_id);
    if (detalleDestino.isFailure) return this.fail(res, 'Falló al obtener el numero de destinos');
    return this.ok<any>(res, detalleDestino.getValue());
  }

  public async getFechaData(req: Request, res: Response): Promise<any> {
    const nro = new Date(req.params.nro);   
    const memorandumId = req.params.memorandum_id;  
    const fechadia = await DetalleDestinorrhhService.getAll();
    if (fechadia.isFailure) return this.fail(res, "Detalle destino no encontrado");      
   //Lista de destinos
   const listaDestinos: DetalleFechasOptionsFormModel[] = fechadia
   .getValue()
   .map((item) => {                   
       return {
           
           id: item.id.toString(),
           id_memorandum: item.props.memorandumrrhhId,
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
    const detalleDestino = await DetalleDestinorrhhView.getListaPernocte( req.params.memorandum_id);
    if (detalleDestino.isFailure) return this.fail(res, 'Falló al obtener el numero de destinos');
    return this.ok<any>(res, detalleDestino.getValue());
  }

}
