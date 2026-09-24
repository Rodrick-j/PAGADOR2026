import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { CargoTableModel } from './components/CargoTable';
import { CargoFormModel } from './components/CargoFormDialog';

const getTableCargo = async (queryParams?: QueryParams): Promise<BaseResponse<CargoTableModel>> => {
    return BaseService.findAll<CargoTableModel>('/cargo/cargo_table', queryParams);
};

const createOrUpdateCargo = async (data: CargoFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/cargo/cargo_form`, data);
};

const getCargoFormData = async (id: string): Promise<BaseResponse<CargoFormModel>> => {
    return BaseService.request('get', `/cargo/cargo_form/${id}`);
};

const destroyCargo = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/cargo/cargo_table/${id}`);
};

const setActiveCargo = async (id_cargo: string, activo: boolean): Promise<BaseResponse<CargoFormModel>> => {
    const data = { activo };
    return BaseService.request('post', `/cargo/cargo_table/${id_cargo}`, data);
};

const getAllCargos = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/cargo/cargos', queryParams);
};

export const CargoModuleService = {
    getTableCargo,
    createOrUpdateCargo,
    getCargoFormData,
    setActiveCargo,
    getAllCargos,
    destroyCargo
};
