import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { DestinoTableModel } from './components/DestinoTable';
import { DestinoFormModel } from './components/DestinoFormDialog';

const getTableDestino = async (queryParams?: QueryParams): Promise<BaseResponse<DestinoTableModel>> => {
    return BaseService.findAll<DestinoTableModel>('/destino/destino_table', queryParams);
};

const createOrUpdateDestino = async (data: DestinoFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/destino/destino_form`, data);
};

const getDestinoFormData = async (id: string): Promise<BaseResponse<DestinoFormModel>> => {
    return BaseService.request('get', `/destino/destino_form/${id}`);
};

const destroyDestino = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/destino/destino_table/${id}`);
};

const setActiveDestino = async (id_destino: string, activo: boolean): Promise<BaseResponse<DestinoFormModel>> => {
    const data = { activo };
    return BaseService.request('post', `/destino/destino_table/${id_destino}`, data);
};

//agregando nuevo metodo get all para dESTINOS
const getAllDestinos = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/destino/destinos', queryParams);
};


export const DestinoModuleService = {
    getTableDestino,
    createOrUpdateDestino,
    getDestinoFormData,
    setActiveDestino,
    destroyDestino,
    getAllDestinos
};
