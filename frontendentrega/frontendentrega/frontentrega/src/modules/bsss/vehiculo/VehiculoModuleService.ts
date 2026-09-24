import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { VehiculoTableModel } from './components/VehiculoTable';
import { VehiculoFormModel } from './components/VehiculoFormDialog';

const getTableVehiculo = async (queryParams?: QueryParams): Promise<BaseResponse<VehiculoTableModel>> => {
    return BaseService.findAll<VehiculoTableModel>('/vehiculo/vehiculo_table', queryParams);
};

const createOrUpdateVehiculo = async (data: VehiculoFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/vehiculo/vehiculo_form`, data);
};

const getVehiculoFormData = async (id: string): Promise<BaseResponse<VehiculoFormModel>> => {
    return BaseService.request('get', `/vehiculo/vehiculo_form/${id}`);
};

const destroyVehiculo = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/vehiculo/vehiculo_item/${id}`);
};

const setActiveVehiculo = async (id_vehiculo: string, activo: boolean): Promise<BaseResponse<VehiculoFormModel>> => {
    const data = { activo };
    return BaseService.request('post', `/vehiculo/vehiculo_table/${id_vehiculo}`, data);
};

//agregando nuevo metodo get all para vehiculos
const getAllVehiculos = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/vehiculo/vehiculos', queryParams);
};


export const VehiculoModuleService = {
    getTableVehiculo,
    createOrUpdateVehiculo,
    getVehiculoFormData,
    setActiveVehiculo,
    destroyVehiculo,
    //agregando nuevo metodo
    getAllVehiculos,
};
