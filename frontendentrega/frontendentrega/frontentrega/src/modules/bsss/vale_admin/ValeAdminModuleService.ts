import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { ValeTableModel } from './components/ValeAdminTable';
import { ValeFormModel } from './components/ValeAdminFormDialog';
import { getFileName } from 'utils';

const getTableVale = async (queryParams?: QueryParams): Promise<BaseResponse<ValeTableModel>> => {
    return BaseService.findAll<ValeTableModel>('/vale/vale_table', queryParams);
};

const createOrUpdateVale = async (data: ValeFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/vale/vale_form`, data);
};

const getValeFormData = async (id: string): Promise<BaseResponse<ValeFormModel>> => {
    return BaseService.request('get', `/vale/vale_form/${id}`);
};

const destroyVale = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/vale/vale_table/${id}`);
};

const setAprobadoVale = async (id_vale: string, aprobado: string): Promise<BaseResponse<ValeFormModel>> => {
    const data = { aprobado };
    return BaseService.request('post', `/vale/vale_table_approve/${id_vale}`, data);
};

const setEjecutadoVale = async (id_vale: string, ejecutado: string): Promise<BaseResponse<ValeFormModel>> => {
	const data = { ejecutado };
    return BaseService.request('post', `/vale/vale_table_ejecutado/${id_vale}`, data);
};

const getAllVehiculos = async (params?: any): Promise<BaseResponse<any>> => {
    return BaseService.findAll(`/vehiculo/vehiculos/${params.id}`);
};

const getAllAperturas = async (queryParams?: QueryParams): Promise<BaseResponse<any>> => {
    return BaseService.findAll('/asignacion/asignacions', queryParams);
};

const getAllDestinos = async (queryParams?: QueryParams): Promise<BaseResponse<any>> => {
    return BaseService.findAll('/destino/destinos', queryParams);
};

/*const obtenerDatosVehiculoApertura = async (queryParams?: QueryParams): Promise<BaseResponse<any>> => {
    return BaseService.request('get', '/vale/vehiculo_asignacion');
};*/
const obtenerDatosVehiculoApertura = async (id: string): Promise<BaseResponse<any>> => {
    return BaseService.request('get', `/vale/vehiculo_apertura/${id}`);
};

const getReportPDF = async (queryParams?: QueryParams): Promise<BaseResponse<unknown>> => {
    const queryString = BaseService.buildQueryParamsText(queryParams);
    const filename = getFileName('ValeReporte');
    const result = await  BaseService.download('post', `/vale/pdf_reporte`, { qs: queryString }, filename);
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
    return BaseService.sendSuccess();
};

const getReportPDFVale = async (id: string, cod: string): Promise<BaseResponse<unknown>> => {
    const filename = getFileName('Vale',`${cod}`);
    const result = await  BaseService.download('post', `/vale/pdf_vale2`, { id }, filename);
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
    return BaseService.sendSuccess();
};

export const ValeModuleService = {
    getTableVale,
    createOrUpdateVale,
    getValeFormData,
    getAllVehiculos,
    getAllAperturas,
    getAllDestinos,
    setAprobadoVale,
    getReportPDF,
    getReportPDFVale,
    obtenerDatosVehiculoApertura,
    destroyVale,
    setEjecutadoVale
};
