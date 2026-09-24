import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { VacacionTableModel } from './components/VacacionTable';
import { VacacionFormModel } from './components/VacacionFormDialog';

const getTableVacacion = async (queryParams?: QueryParams): Promise<BaseResponse<VacacionTableModel>> => {
    return BaseService.findAll<VacacionTableModel>('/vacacion/vacacion_table', queryParams);
};

const createOrUpdateVacacion = async (data: VacacionFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/vacacion/vacacion_form`, data);
};

const getVacacionFormData = async (id: string): Promise<BaseResponse<VacacionFormModel>> => {
    return BaseService.request('get', `/vacacion/vacacion_form/${id}`);
};

const destroyVacacion = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/vacacion/vacacion_table/${id}`);
};

const setActiveVacacion = async (id_vacacion: string, activo: boolean): Promise<BaseResponse<VacacionFormModel>> => {
    const data = { activo };
    return BaseService.request('post', `/vacacion/vacacion_table/${id_vacacion}`, data);
};

const getAllUsuarioArea = async (params?: any): Promise<BaseResponse<any>> => {
    return BaseService.findAll(`/users/usuario_area/${params}`);
};

export const VacacionModuleService = {
    getTableVacacion,
    createOrUpdateVacacion,
    getVacacionFormData,
    getAllUsuarioArea,
    setActiveVacacion,
    destroyVacacion
};
