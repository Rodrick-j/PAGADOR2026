import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { ActaRecepcionTableModel } from './components/ActaRecepcionTable';
import { ActaRecepcionFormModel } from './components/ActaRecepcionFormDialog';
import { getFileName } from 'utils';

const getTableActaRecepcion = async (queryParams?: QueryParams): Promise<BaseResponse<ActaRecepcionTableModel>> => {
    return BaseService.findAll<ActaRecepcionTableModel>('/acta_recepcion/acta_table', queryParams);
};

const setEstadoActaRecepcion = async (id_acta: string, estado: string): Promise<BaseResponse<ActaRecepcionFormModel>> => {
    const data = { estado };
    return BaseService.request('post', `/acta_recepcion/acta_table/${id_acta}`, data);
};

const createOrUpdateActaRecepcion = async (data: ActaRecepcionFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/acta_recepcion/acta_form`, data);
};

const getActaRecepcionFormData = async (id: string): Promise<BaseResponse<ActaRecepcionFormModel>> => {
    return BaseService.request('get', `/acta_recepcion/acta_form/${id}`);
};

const getActaRecepcionSellar = async (id: string): Promise<BaseResponse<ActaRecepcionFormModel>> => {
    return BaseService.request('post', `/acta_recepcion/acta_sellar/${id}`);
};

const destroyActaRecepcion = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/acta_recepcion/acta_table/${id}`);
};

const destroyHistorial = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/acta_recepcion/historial_item/${id}`);
};

const setActiveActaRecepcion = async (id_acta: string, estado: boolean): Promise<BaseResponse<ActaRecepcionFormModel>> => {
    const data = { estado };
    return BaseService.request('post', `/acta_recepcion/acta_table/${id_acta}`, data);
};

const setActiveDocumento = async (id_documento: string, activo: boolean): Promise<BaseResponse<ActaRecepcionFormModel>> => {
    const data = { activo };
    return BaseService.request('post', `/acta_recepcion/acta_table/${id_documento}`, data);
};

const getReportPDF = async (id: string, cod: string): Promise<BaseResponse<unknown>> => {
    const filename = getFileName('ActaRecepcion',`${cod}`);
    const result = await  BaseService.download('post', `/acta_recepcion/pdf_acta`, { id }, filename);
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
    return BaseService.sendSuccess();
};

export const ActaRecepcionModuleService = {
    getTableActaRecepcion,
    createOrUpdateActaRecepcion,
    getActaRecepcionFormData,
    setEstadoActaRecepcion,
    setActiveActaRecepcion,
    destroyActaRecepcion,
    getActaRecepcionSellar,
    getReportPDF,
    setActiveDocumento,
    destroyHistorial
};
