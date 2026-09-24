import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { EscalaDestinoTableModel } from './components/EscalaDestinoTable';
import { EscalaDestinoFormModel, EscalaDestinoPasajeFormModel } from './components/EscalaDestinoFormDialog';

const getTableEscalaDestino = async (queryParams?: QueryParams): Promise<BaseResponse<EscalaDestinoTableModel>> => {
    return BaseService.findAll<EscalaDestinoTableModel>('/escala_destino/escala_destino_table', queryParams);
};

const createOrUpdateEscalaDestino = async (data: EscalaDestinoFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/escala_destino/escala_destino_form`, data);
};

const getEscalaDestinoFormData = async (id: string): Promise<BaseResponse<EscalaDestinoFormModel>> => {
    return BaseService.request('get', `/escala_destino/escala_destino_form/${id}`);
};

const destroyEscalaDestino = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/escala_destino/escala_destino_table/${id}`);
};

const setActiveEscalaDestino = async (id_escala_destino: string, activo: boolean): Promise<BaseResponse<EscalaDestinoFormModel>> => {
    const data = { activo };
    return BaseService.request('post', `/escala_destino/escala_destino_table/${id_escala_destino}`, data);
};

const getAllEscalaDestino = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/escala_destino/escala_destino', queryParams);
};

const getAllPaises= async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/escala_destino/escala_destino_pais', queryParams);
};
const getAllComunidades= async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/escala_destino/escala_destino_comunidad', queryParams);
};

const getAllModalidades= async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/escala_destino/escala_destino_modalidad', queryParams);
};

const getAllPasajes = async (destino: string,): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll(`/escala_destino/escala_destino_pasaje/${destino}`);
};
export const EscalaDestinoModuleService = {
    getTableEscalaDestino,
    createOrUpdateEscalaDestino,
    getEscalaDestinoFormData,
    setActiveEscalaDestino,
    getAllEscalaDestino,
    destroyEscalaDestino,
    getAllPaises,
    getAllComunidades,
    getAllModalidades,    
    getAllPasajes,
};
