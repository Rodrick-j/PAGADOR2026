import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { HistorialAperturaDetalleTableModel } from './components/HistorialAperturaDetalleTable';
import { HistorialAperturaDetalleFormModel } from './components/HistorialAperturaDetalleFormDialog';
import { HistorialGastoTableModel } from './components/HistorialGastoTable';

const getTableHistorialAperturaDetalle = async (queryParams?: QueryParams): Promise<BaseResponse<HistorialAperturaDetalleTableModel>> => {
    return BaseService.findAll<HistorialAperturaDetalleTableModel>('/historial_apertura/historial_apertura_detalle_table', queryParams);
};

const createOrUpdateHistorialAperturaDetalle = async (data: HistorialAperturaDetalleFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/historial_apertura/historial_apertura_detalle_form`, data);
};

const getHistorialAperturaDetalleFormData = async (id: string): Promise<BaseResponse<HistorialAperturaDetalleFormModel>> => {
    return BaseService.request('get', `/historial_apertura/historial_apertura_detalle_form/${id}`);
};

const destroyHistorialAperturaDetalle = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/historial_apertura/historial_apertura_detalle_table/${id}`);
};

const setActiveHistorialAperturaDetalle = async (id_historial_apertura_detalle: string, estado_activo: boolean): Promise<BaseResponse<HistorialAperturaDetalleFormModel>> => {
    const data = { estado_activo };
	return BaseService.request('post', `/historial_apertura/historial_apertura_detalle_table/${id_historial_apertura_detalle}`, data);
};

const getAllHistorialAperturaDetalle = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/historial_apertura/historial_apertura_detalle', queryParams);
};

const getTableHistorialGasto = async (queryParams?: QueryParams): Promise<BaseResponse<HistorialGastoTableModel>> => {
    return BaseService.findAll<HistorialGastoTableModel>('/historial_apertura/historial_apertura_detalle_gasto', queryParams);
};

const destroyHistorialGasto = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/historial_apertura/historial_apertura_detalle_gasto/${id}`);
};


export const HistorialAperturaDetalleModuleService = {
    getTableHistorialAperturaDetalle,
    createOrUpdateHistorialAperturaDetalle,
    getHistorialAperturaDetalleFormData,
    setActiveHistorialAperturaDetalle,
    getAllHistorialAperturaDetalle,
    destroyHistorialAperturaDetalle,
    getTableHistorialGasto,
    destroyHistorialGasto,    
};
