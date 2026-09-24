import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { HistorialAperturaTableModel } from './components/HistorialAperturaTable';
import { HistorialAperturaFormModel } from './components/HistorialAperturaFormDialog';
import { getFileName } from 'utils';

const getTableHistorialApertura = async (queryParams?: QueryParams): Promise<BaseResponse<HistorialAperturaTableModel>> => {
    return BaseService.findAll<HistorialAperturaTableModel>('/historial_apertura/historial_apertura_table', queryParams);
};

const createOrUpdateHistorialApertura = async (data: HistorialAperturaFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/historial_apertura/historial_apertura_form`, data);
};

const getHistorialAperturaFormData = async (id: string): Promise<BaseResponse<HistorialAperturaFormModel>> => {
    return BaseService.request('get', `/historial_apertura/historial_apertura_form/${id}`);
};

const destroyHistorialApertura = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/historial_apertura/historial_apertura_table/${id}`);
};

const setActiveHistorialApertura = async (id_historial_apertura: string, estado_activo: boolean): Promise<BaseResponse<HistorialAperturaFormModel>> => {
    const data = { estado_activo };
	return BaseService.request('post', `/historial_apertura/historial_apertura_table/${id_historial_apertura}`, data);
};

const getAllHistorialApertura = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/historial_apertura/historial_apertura', queryParams);
};

//impresion
const getReportHistorialAperturaPDF = async (id: string, apertura:string): Promise<BaseResponse<unknown>> => {
    const filename = getFileName('HistorialAperturaReporte',`${apertura}`);
    const result = await  BaseService.download('post', `/historial_apertura/pdf_reporte`, { id }, filename);
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
    return BaseService.sendSuccess();
};

export const HistorialAperturaModuleService = {
    getTableHistorialApertura,
    createOrUpdateHistorialApertura,
    getHistorialAperturaFormData,
    setActiveHistorialApertura,
    getAllHistorialApertura,
    destroyHistorialApertura,
    getReportHistorialAperturaPDF,
};
