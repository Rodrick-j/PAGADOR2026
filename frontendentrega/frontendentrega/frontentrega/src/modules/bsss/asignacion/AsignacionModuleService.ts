import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { AsignacionTableModel } from './components/AsignacionTable';
import { AsignacionFormModel } from './components/AsignacionFormDialog';

const getTableAsignacion = async (queryParams?: QueryParams): Promise<BaseResponse<AsignacionTableModel>> => {
    return BaseService.findAll<AsignacionTableModel>('/asignacion/asignacion_table', queryParams);
};

const createOrUpdateAsignacion = async (data: AsignacionFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/asignacion/asignacion_form`, data);
};

const getAsignacionFormData = async (id: string): Promise<BaseResponse<AsignacionFormModel>> => {
    return BaseService.request('get', `/asignacion/asignacion_form/${id}`);
};

const destroyAsignacion = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/asignacion/asignacion_table/${id}`);
};

const setActiveAsignacion = async (id_asignacion: string, estado: boolean): Promise<BaseResponse<AsignacionFormModel>> => {
    const data = { estado };
    return BaseService.request('post', `/asignacion/asignacion_table/${id_asignacion}`, data);
};

const getAllAperturaGeneral = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/apertura_general/apertura_general_vale', queryParams);
};

export const AsignacionModuleService = {
    getTableAsignacion,
    createOrUpdateAsignacion,
    getAsignacionFormData,
    getAllAperturaGeneral,
    setActiveAsignacion,
    destroyAsignacion
};
