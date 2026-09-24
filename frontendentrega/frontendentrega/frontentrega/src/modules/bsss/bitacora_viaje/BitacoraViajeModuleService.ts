import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { BitacoraViajeTableModel } from './components/BitacoraViajeTable';
import { BitacoraViajeFormModel } from './components/BitacoraViajeFormDialog';

const getTableBitacoraViaje = async (queryParams?: QueryParams): Promise<BaseResponse<BitacoraViajeTableModel>> => {
    return BaseService.findAll<BitacoraViajeTableModel>('/bitacora_viaje/bitacora_viaje_table', queryParams);
};

const createOrUpdateBitacoraViaje = async (data: BitacoraViajeFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/bitacora_viaje/bitacora_viaje_form`, data);
};

const getBitacoraViajeFormData = async (id: string): Promise<BaseResponse<BitacoraViajeFormModel>> => {
    return BaseService.request('get', `/bitacora_viaje/bitacora_viaje_form/${id}`);
};

const destroyBitacoraViaje = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/bitacora_viaje/bitacora_viaje_table/${id}`);
};

const setActiveBitacoraViaje = async (bitacora_viaje_id: string, activo: boolean): Promise<BaseResponse<BitacoraViajeFormModel>> => {
    const data = { activo };
    return BaseService.request('post', `/bitacora_viaje/bitacora_viaje_table/${bitacora_viaje_id}`, data);
};

//agregando nuevo metodo get all para BitacoraViajeS
const getAllBitacoraViajes = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/bitacora_viaje/bitacora_viajes', queryParams);
};


export const BitacoraViajeModuleService = {
    getTableBitacoraViaje,
    createOrUpdateBitacoraViaje,
    getBitacoraViajeFormData,
    setActiveBitacoraViaje,
    destroyBitacoraViaje,
    getAllBitacoraViajes
};
