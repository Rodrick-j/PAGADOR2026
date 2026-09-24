import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { DetalleDestinoTableModel, DetalleTipoVehiculoTableModel } from './components/DetalleDestinoTable';
import { format, formatISO, parseISO } from 'date-fns';
import { DetalleDestinoFormModel, DetalleDestinoSumaPasajesFormModel } from './components/DetalleDestinoFormDialog';

const getTableDetalleDestino = async (queryParams?: QueryParams): Promise<BaseResponse<DetalleDestinoTableModel>> => {
    return BaseService.findAll<DetalleDestinoTableModel>('/detalle_destino/detalle_destino_table', queryParams);
};

const createOrUpdateDetalleDestino = async (data: DetalleDestinoFormModel): Promise<BaseResponse<unknown>> => {
        
    //const hora_inicio = format(parseISO(formatISO(new Date(data.hora_inicio))), 'HH:mm');	
  //  const hora_fin = format(parseISO(formatISO(new Date(data.hora_fin))), 'HH:mm');	
  
    const data2 ={
		
        id                     : data.id,
        tipo_vehiculo_op       : data.tipo_vehiculo_op,
        objetivo_viaje         : data.objetivo_viaje,
        destino_reg            : data.destino_reg,
        fecha_dia              : data.fecha_dia,
        hora_inicio            : data.hora_inicio,//hora_inicio,
        hora_fin               : data.hora_fin,//hora_fin,
        pernocte               : data.pernocte,
        pasaje_ida             : data.pasaje_ida,
        pasaje_retorno         : data.pasaje_retorno,
        total_pasaje_dia       : data.total_pasaje_dia,
        tipo_vehiculo_opvida   : data.tipo_vehiculo_opvida,
        tipo_vehiculo_opvuelta : data.tipo_vehiculo_opvuelta,
        estado                 : 'PENDIENTE',
        modificacion           : data.modificacion,
        observacion            : data.observacion,
        estado_obsevacion      : data.estado_observacion,
        memorandum_id          : data.memorandum_id,
        viatico_id             : data.viatico_id,
        vehiculo_id            : data.vehiculo_id,
        destino_id             : data.destino_id,
        destino_id2            : data.destino_id2,
        hay_viaje              : data.hay_viaje,
    }
     
    //return BaseService.request('post', `/detalle_destino/detalle_destino_form`, data);
    return BaseService.request('post', `/detalle_destino/detalle_destino_form`, data2);
};

const getDetalleDestinoFormData = async (id: string): Promise<BaseResponse<DetalleDestinoFormModel>> => {
    return BaseService.request('get', `/detalle_destino/detalle_destino_form/${id}`);
};

const destroyDetalleDestino = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/detalle_destino/detalle_destino_table/${id}`);
};

const setActiveDetalleDestino = async (id_detalle_destino: string, activo: boolean): Promise<BaseResponse<DetalleDestinoFormModel>> => {
    const data = { activo };
    return BaseService.request('post', `/detalle_destino/detalle_destino_table/${id_detalle_destino}`, data);
};

const getAllDetalleDestino = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/detalle_destino/detalle_destino', queryParams);
};

//Para la busqueda de tipovehiculo
const getTipoVehiculo = async (id: string,): Promise<BaseResponse<DetalleTipoVehiculoTableModel>> => {
    return BaseService.request('get', `/detalle_destino/detalle_destino_tipo_vehiculo/${id}`);
};

const setAprobadoDetalleDestino = async (id_detalle_destino: string, aprobado: string): Promise<BaseResponse<DetalleDestinoFormModel>> => {
    const data = { aprobado };
    return BaseService.request('post', `/detalle_destino/detalle_destino_table_approve/${id_detalle_destino}`, data);
};

//Para obtener la sumatoria de pasajes
const getSumatoriaPasajes = async (id_viatico: string,): Promise<BaseResponse<DetalleDestinoSumaPasajesFormModel>> => {
    return BaseService.request('get',`/detalle_destino/detalle_destino_suma_pasaje/${id_viatico}`);
};

//Para la busqueda de destino Exterior
const getDestinoExterior = async (memorandum_id: string,): Promise<BaseResponse<DetalleTipoVehiculoTableModel>> => {
    return BaseService.request('get', `/detalle_destino/detalle_destino_exterior/${memorandum_id}`);
};

//Para la determinacion de rango fecha 
const getRangoFechas = async (memorandum_id: string,): Promise<BaseResponse<{ id: Date; nombre: string; caption:string }>> => {
    return BaseService.findAll(`/detalle_destino/detalle_destino_rango_fechas/${memorandum_id}`);
};

//Para la determinacion de cantidad de Destinos //no se usa
const getDetalleDestinoExist = async (memorandum_id: string,): Promise<BaseResponse<number>> => {
    return BaseService.request('get', `/detalle_destino/detalle_destino_exist/${memorandum_id}`);
};

const getFechaData = async (nro: Date, memorandum_id:string): Promise<BaseResponse<any>> => {
    return BaseService.request('get', `/detalle_destino/detalle_destino_nro/${nro}/${memorandum_id}`);
};

//Para la determinacion de rango fecha 
const getListaPernocte = async (memorandum_id: string,): Promise<BaseResponse<{ id: Date; nombre: string; caption:string }>> => {
    return BaseService.findAll(`/detalle_destino/detalle_destino_pernocte/${memorandum_id}`);
};

export const DetalleDestinoModuleService = {
    getTableDetalleDestino,
    createOrUpdateDetalleDestino,
    getDetalleDestinoFormData,
    setActiveDetalleDestino,
    getAllDetalleDestino,
    destroyDetalleDestino,
    getTipoVehiculo,
    setAprobadoDetalleDestino,
    getSumatoriaPasajes,
    getDestinoExterior,
    getRangoFechas,
    getFechaData,
    getDetalleDestinoExist,//revisar
    getListaPernocte
    
};
