import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { ValeTableModel } from './components/ValeTable';
import { ValeFormModel } from './components/ValeFormDialog';
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

const setActiveVale = async (id_vale: string, activo: boolean): Promise<BaseResponse<ValeFormModel>> => {
    const data = { activo };
    return BaseService.request('post', `/vale/vale_table/${id_vale}`, data);
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

const obtenerDatosVehiculoApertura = async (id: string): Promise<BaseResponse<any>> => {
    return BaseService.request('get', `/vale/vehiculo_apertura/${id}`);
};

const getEstadoVale = async (): Promise<BaseResponse<any>> => {
    return BaseService.request('get', '/vale/vale_estado');
};

const getByIdVehiculo = async (id: string | null): Promise<BaseResponse<any>> => {
    return BaseService.request('get', `/vehiculo/vehiculo_id/${id}`);
};

const getByIdApertura = async (id: string): Promise<BaseResponse<any>> => {
    return BaseService.request('get', `/asignacion/asignacion_id/${id}`);
};

const getSinPresupuestoData = async (litros: number, idAsignacion: string, idVehiculo: string): Promise<BaseResponse<any>> => {
    return BaseService.request('get', `/vale/sin_presupuesto/${litros}/${idAsignacion}/${idVehiculo}`);
};

const getReportPDF = async (id: string, cod: string): Promise<BaseResponse<unknown>> => {
    const filename = getFileName('Vale',`${cod}`);
    const result = await  BaseService.download('post', `/vale/pdf_vale`, { id }, filename);
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
    setActiveVale,
    getReportPDF,
    getByIdVehiculo,
    getByIdApertura,
    getSinPresupuestoData,
    getEstadoVale,
    obtenerDatosVehiculoApertura,
    destroyVale
};
