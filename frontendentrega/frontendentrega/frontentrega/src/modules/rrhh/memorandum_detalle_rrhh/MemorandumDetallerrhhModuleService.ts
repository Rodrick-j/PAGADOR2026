import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { MemorandumDetallerrhhTableModel } from './components/MemorandumDetallerrhhTable';
import { MemorandumDetalleDestinorrhhFormModel } from './components/MemorandumDetallerrhhFormDialog';


const getTableDetalleDestino = async (queryParams?: QueryParams): Promise<BaseResponse<MemorandumDetallerrhhTableModel>> => {
    return BaseService.findAll<MemorandumDetallerrhhTableModel>('/detalle_destino_rrhh/detalle_destino_rrhh_table', queryParams);
};

const createOrUpdateDetalleDestino = async (data: MemorandumDetalleDestinorrhhFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/detalle_destino_rrhh/detalle_destino_rrhh_form`, data);
};

const getDetalleDestinoFormData = async (id: string): Promise<BaseResponse<MemorandumDetalleDestinorrhhFormModel>> => {
    return BaseService.request('get', `/detalle_destino_rrhh/detalle_destino_rrhh_form/${id}`);
};

const destroyDetalleDestino = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/detalle_destino_rrhh/detalle_destino_rrhh_table/${id}`);
};

const setActiveDetalleDestino = async (id_detalle_destino_rrhh: string, activo: boolean): Promise<BaseResponse<MemorandumDetalleDestinorrhhFormModel>> => {
    const data = { activo };
    return BaseService.request('post', `/detalle_destino_rrhh/detalle_destino_rrhh_table/${id_detalle_destino_rrhh}`, data);
};

const getAllDetalleDestino = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/detalle_destino_rrhh/detalle_destino_rrhh', queryParams);
};
const getAllPaises= async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/detalle_destino_rrhh/escala_destino_pais', queryParams);
};

//Para la determinacion de rango fecha 
const getRangoFechas = async (memorandum_id: string,): Promise<BaseResponse<{ id: Date; nombre: string; caption:string }>> => {
    return BaseService.findAll(`/detalle_destino_rrhh/detalle_destino_rrhh_rango_fechas/${memorandum_id}`);
};

//Para la determinacion de cantidad de Destinos //no se usa
const getDetalleDestinoExist = async (memorandum_id: string,): Promise<BaseResponse<number>> => {
    return BaseService.request('get', `/detalle_destino_rrhh/detalle_destino_rrhh_exist/${memorandum_id}`);
};

const getFechaData = async (nro: Date, memorandum_id:string): Promise<BaseResponse<any>> => {
    return BaseService.request('get', `/detalle_destino_rrhh/detalle_destino_rrhh_nro/${nro}/${memorandum_id}`);
};

//Para la determinacion de rango fecha 
const getListaPernocte = async (memorandum_id: string,): Promise<BaseResponse<{ id: Date; nombre: string; caption:string }>> => {
    return BaseService.findAll(`/detalle_destino_rrhh/detalle_destino_rrhh_pernocte/${memorandum_id}`);
};



export const MemorandumDetallerrhhModuleService = {
    getTableDetalleDestino,
    createOrUpdateDetalleDestino,
    getDetalleDestinoFormData,
    setActiveDetalleDestino,
    getAllPaises,
    destroyDetalleDestino,
    getRangoFechas,
    getDetalleDestinoExist,
    getFechaData,
    getListaPernocte
};
