import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { VehiculoPublicoTableModel } from './components/VehiculoPublicoTable';
import { VehiculoPublicoFormModel } from './components/VehiculoPublicoFormDialog';

const getTableVehiculoPublico = async (queryParams?: QueryParams): Promise<BaseResponse<VehiculoPublicoTableModel>> => {
    return BaseService.findAll<VehiculoPublicoTableModel>('/vehiculo_publico/vehiculo_publico_table', queryParams);
};

const createOrUpdateVehiculoPublico = async (data: VehiculoPublicoFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/vehiculo_publico/vehiculo_publico_form`, data);
};

const getVehiculoPublicoFormData = async (id: string): Promise<BaseResponse<VehiculoPublicoFormModel>> => {
    return BaseService.request('get', `/vehiculo_publico/vehiculo_publico_form/${id}`);
};

const destroyVehiculoPublico = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/vehiculo_publico/vehiculo_publico_table/${id}`);
};

const setActiveVehiculoPublico = async (id_vehiculo_publico: string, activo: boolean): Promise<BaseResponse<VehiculoPublicoFormModel>> => {
    const data = { activo };
    return BaseService.request('post', `/vehiculo_publico/vehiculo_publico_table/${id_vehiculo_publico}`, data);
};

const getAllVehiculoPublico = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/vehiculo_publico/vehiculo_publico', queryParams);
};

export const VehiculoPublicoModuleService = {
    getTableVehiculoPublico,
    createOrUpdateVehiculoPublico,
    getVehiculoPublicoFormData,
    setActiveVehiculoPublico,
    getAllVehiculoPublico,
    destroyVehiculoPublico
};
