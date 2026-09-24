import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { ActividadFormModel } from './components/ActividadFormDialog';
import { ActividadDetalleTableModel } from './components/ActividadDetalleTable';

const getTableActividadDetalle = async (queryParams?: QueryParams): Promise<BaseResponse<ActividadDetalleTableModel>> => {
    return BaseService.findAll<ActividadDetalleTableModel>('/actividad/actividad_table', queryParams);
};

const createOrUpdateActividad = async (data: ActividadFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/actividad/actividad_form`, data);
};

const getActividadFormData = async (id: string): Promise<BaseResponse<ActividadFormModel>> => {
    return BaseService.request('get', `/actividad/actividad_form/${id}`);
};

const destroyActividad = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/actividad/actividad_table/${id}`);
};

const setActiveActividad = async (id_actividad: string, activo: boolean): Promise<BaseResponse<ActividadFormModel>> => {
    const data = { activo };
    return BaseService.request('post', `/actividad/actividad_table/${id_actividad}`, data);
};
const getFechaLimiteData = async (nro: Date, proceso_id:string,paso:number): Promise<BaseResponse<any>> => {
    return BaseService.request('get', `/actividad/actividad_nro/${nro}/${proceso_id}/${paso}`);
};

export const ActividadModuleService = {
    getTableActividadDetalle,
    createOrUpdateActividad,
    getActividadFormData,
    setActiveActividad,
    destroyActividad,
    getFechaLimiteData
};
