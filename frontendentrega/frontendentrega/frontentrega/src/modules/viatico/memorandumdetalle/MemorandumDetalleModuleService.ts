import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { MemorandumDetalleTableModel } from './components/MemorandumDetalleTable';
import { MemorandumDetalleDestinoFormModel } from './components/MemorandumDetalleFormDialog';


const getTableDetalleDestino = async (queryParams?: QueryParams): Promise<BaseResponse<MemorandumDetalleTableModel>> => {
    return BaseService.findAll<MemorandumDetalleTableModel>('/detalle_destino/detalle_destino_table', queryParams);
};

const createOrUpdateDetalleDestino = async (data: MemorandumDetalleDestinoFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/detalle_destino/detalle_destino_form`, data);
};

const getDetalleDestinoFormData = async (id: string): Promise<BaseResponse<MemorandumDetalleDestinoFormModel>> => {
    return BaseService.request('get', `/detalle_destino/detalle_destino_form/${id}`);
};

const destroyDetalleDestino = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/detalle_destino/detalle_destino_table/${id}`);
};

const setActiveDetalleDestino = async (id_detalle_destino: string, activo: boolean): Promise<BaseResponse<MemorandumDetalleDestinoFormModel>> => {
    const data = { activo };
    return BaseService.request('post', `/detalle_destino/detalle_destino_table/${id_detalle_destino}`, data);
};

const getAllDetalleDestino = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/detalle_destino/detalle_destino', queryParams);
};
const getAllPaises= async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/escala_destino/escala_destino_pais', queryParams);
};


export const MemorandumDetalleModuleService = {
    getTableDetalleDestino,
    createOrUpdateDetalleDestino,
    getDetalleDestinoFormData,
    setActiveDetalleDestino,
    getAllPaises,
    destroyDetalleDestino,

};
