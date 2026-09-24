import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { ObjetoGastoTableModel } from './components/ObjetoGastoTable';
import { ObjetoGastoFormModel } from './components/ObjetoGastoFormDialog';

const getTableObjetoGasto = async (queryParams?: QueryParams): Promise<BaseResponse<ObjetoGastoTableModel>> => {
    return BaseService.findAll<ObjetoGastoTableModel>('/objeto_gasto/objeto_gasto_table', queryParams);
};

const createOrUpdateObjetoGasto = async (data: ObjetoGastoFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/objeto_gasto/objeto_gasto_form`, data);
};

const getObjetoGastoFormData = async (id: string): Promise<BaseResponse<ObjetoGastoFormModel>> => {
    return BaseService.request('get', `/objeto_gasto/objeto_gasto_form/${id}`);
};

const destroyObjetoGasto = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/objeto_gasto/objeto_gasto_table/${id}`);
};

const setActiveObjetoGasto = async (id_objeto_gasto: string, activo: boolean): Promise<BaseResponse<ObjetoGastoFormModel>> => {
    const data = { activo };
    return BaseService.request('post', `/objeto_gasto/objeto_gasto_table/${id_objeto_gasto}`, data);
};

const getAllObjetoGasto = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/objeto_gasto/objeto_gasto', queryParams);
};
const getObjetoGastoData = async (codigo: string): Promise<BaseResponse<any>> => {
    return BaseService.request('get', `/objeto_gasto/objeto_gasto_codigo/${codigo}`);
};

const getFindObjetoGastoData = async (id: string): Promise<BaseResponse<any>> => {
    return BaseService.request('get', `/objeto_gasto/objeto_gasto_id/${id}`);
};

const setActiveObjeto = async (id_objeto_gasto: string, estado: boolean): Promise<BaseResponse<ObjetoGastoTableModel>> => {
    const data = { estado };
    return BaseService.request('post', `/objeto_gasto/objeto_gasto_table/${id_objeto_gasto}`, data);
};

export const ObjetoGastoModuleService = {
    getTableObjetoGasto,
    createOrUpdateObjetoGasto,
    getObjetoGastoFormData,
    setActiveObjetoGasto,
    getAllObjetoGasto,
    destroyObjetoGasto,
    getObjetoGastoData,
    getFindObjetoGastoData,
    setActiveObjeto
};
