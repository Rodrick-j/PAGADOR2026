import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { DeudaTableModel } from './components/DeudaTable';
import { DeudaFormModel } from './components/DeudaFormDialog';
import { DetalleDeudaFormModel, PagoDeudaFormModel } from './components/PagoDeudaFormDialog';
import { HistorialTableModel } from './components/HistorialTable';

const getTableDeuda = async (queryParams?: QueryParams): Promise<BaseResponse<DeudaTableModel>> => {
    return BaseService.findAll<DeudaTableModel>('/deuda/deuda_table', queryParams);
};

const getTableHistorial = async (queryParams?: QueryParams): Promise<BaseResponse<HistorialTableModel>> => {
    return BaseService.findAll<HistorialTableModel>('/deuda/historial_table', queryParams);
};

const setEstadoDeuda = async (id_deuda: string, estado: string): Promise<BaseResponse<DeudaFormModel>> => {
    const data = { estado };
    return BaseService.request('post', `/deuda/deuda_table/${id_deuda}`, data);
};

const createOrUpdateDeuda = async (data: DeudaFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/deuda/deuda_form`, data);
};

const getDeudaFormData = async (id: string): Promise<BaseResponse<DeudaFormModel>> => {
    return BaseService.request('get', `/deuda/deuda_form/${id}`);
};

const destroyDeuda = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/deuda/deuda_item/${id}`);
};

const destroyHistorial = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/deuda/historial_item/${id}`);
};

const setActiveDeuda = async (id_deuda: string, estado: boolean): Promise<BaseResponse<DeudaFormModel>> => {
    const data = { estado };
    return BaseService.request('post', `/deuda/deuda_table/${id_deuda}`, data);
};

const setDeudaHistorial = async (id_cuenta: string, data1: any, data2: PagoDeudaFormModel ): Promise<BaseResponse<PagoDeudaFormModel>> => {
    const data = { data1, data2 };
    return BaseService.request('post', `/deuda/deuda_historial/${id_cuenta}`, data);
};

const setActiveCuenta = async (id_cuenta: string, activo: boolean): Promise<BaseResponse<DeudaFormModel>> => {
    const data = { activo };
    return BaseService.request('post', `/deuda/deuda_table/${id_cuenta}`, data);
};

const getDeudaDetalle = async (ids: string[]): Promise<BaseResponse<DetalleDeudaFormModel>> => {
    return BaseService.request('get', `/deuda/deuda_detalle/${ids}`);
};

export const DeudaModuleService = {
    getTableDeuda,
    getTableHistorial,
    createOrUpdateDeuda,
    getDeudaFormData,
    setEstadoDeuda,
    setActiveDeuda,
    setDeudaHistorial,
    destroyDeuda,
    setActiveCuenta,
    destroyHistorial,
    getDeudaDetalle
};
