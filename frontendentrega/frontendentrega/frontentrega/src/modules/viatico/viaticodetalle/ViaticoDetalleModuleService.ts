import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { ViaticoDetalleDestinoTableModel } from './components/ViaticoDetalleDestino';
import { ViaticoDetalleDestinoFormModel } from './components/ViaticoDetalleFormDialog';



const getTableDetalleDestino = async (queryParams?: QueryParams): Promise<BaseResponse<ViaticoDetalleDestinoTableModel>> => {
    return BaseService.findAll<ViaticoDetalleDestinoTableModel>('/detalle_destino/detalle_destino_table', queryParams);
};

const createOrUpdateDetalleDestino = async (data: ViaticoDetalleDestinoFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/detalle_destino/detalle_destino_form`, data);
};

const getDetalleDestinoFormData = async (id: string): Promise<BaseResponse<ViaticoDetalleDestinoFormModel>> => {
    return BaseService.request('get', `/detalle_destino/detalle_destino_form/${id}`);
};

const destroyDetalleDestino = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/detalle_destino/detalle_destino_table/${id}`);
};

const setAprobadoDetalleDestino = async (id_detalle_destino: string,  aprobado: string): Promise<BaseResponse<ViaticoDetalleDestinoFormModel>> => {
    const data = { aprobado };
    return BaseService.request('post', `/detalle_destino/detalle_destino_table/${id_detalle_destino}`, data);
};


const getAllDetalleDestino = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/detalle_destino/detalle_destino', queryParams);
};

export const ViaticoDetalleModuleService = {
    getTableDetalleDestino,
    createOrUpdateDetalleDestino,
    getDetalleDestinoFormData,
    setAprobadoDetalleDestino,
    destroyDetalleDestino,
  
};
