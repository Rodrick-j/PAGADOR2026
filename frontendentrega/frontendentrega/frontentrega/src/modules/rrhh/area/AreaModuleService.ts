import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { AreaTableModel } from './components/AreaTable';
import { AreaFormModel } from './components/AreaFormDialog';

const getTableArea = async (queryParams?: QueryParams): Promise<BaseResponse<AreaTableModel>> => {
    return BaseService.findAll<AreaTableModel>('/area/area_table', queryParams);
};

const createOrUpdateArea = async (data: AreaFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/area/area_form`, data);
};

const getAreaFormData = async (id: string): Promise<BaseResponse<AreaFormModel>> => {
    return BaseService.request('get', `/area/area_form/${id}`);
};

const destroyArea = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/area/area_table/${id}`);
};

const setActiveArea = async (id_area: string, activo: boolean): Promise<BaseResponse<AreaFormModel>> => {
    const data = { activo };
    return BaseService.request('post', `/area/area_table/${id_area}`, data);
};

const getAllArea = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/area/areas', queryParams);
};

//Para obtener la sumatoria de pasajes
const getAreaHijos = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; area_id:string }>> => {
    return BaseService.findAll('/area/area_hijos', queryParams);
};

//Para la busqueda de tipoPCP
const getCite = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; caption:string }>> => {
    return BaseService.findAll('/area/area_cite', queryParams);
};

export const AreaModuleService = {
    getTableArea,
    createOrUpdateArea,
    getAreaFormData,
    setActiveArea,
    getAllArea,
    destroyArea,
    getAreaHijos,
    getCite,
};
