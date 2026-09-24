import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { getFileName } from 'utils';
import { SeguimientoTableModel } from './components/SeguimientoTable';
import { SeguimientoFormModel } from './components/SeguimientoFormDialog';
import { SeguimientoHTMLData } from '../cuenta/CuentaModule';

const getTableSeguimiento = async (queryParams?: QueryParams): Promise<BaseResponse<SeguimientoTableModel>> => {
    return BaseService.findAll<SeguimientoTableModel>('/cuenta/seguimiento_table', queryParams);
};

const createOrUpdateSeguimiento = async (data: SeguimientoFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/cuenta/seguimiento_form`, data);
};

const getSeguimientoFormData = async (id: string): Promise<BaseResponse<SeguimientoFormModel>> => {
    return BaseService.request('get', `/cuenta/seguimiento_form/${id}`);
};

const destroySeguimiento = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/cuenta/seguimiento_table/${id}`);
};

const setActiveSeguimiento = async (id_cuenta: string, estado: boolean): Promise<BaseResponse<SeguimientoFormModel>> => {
    const data = { estado };
    return BaseService.request('post', `/cuenta/seguimiento_table/${id_cuenta}`, data);
};

const getReportPDF = async (queryParams?: QueryParams): Promise<BaseResponse<unknown>> => {
    const queryString = BaseService.buildQueryParamsText(queryParams);
    const filename = getFileName('Seguimiento');
    const result = await  BaseService.download('post', `/cuenta/pdf_seguimiento`, { qs: queryString }, filename);
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
    return BaseService.sendSuccess();
};

const getReportSeguimientoPDF = async (id: string, input: string): Promise<BaseResponse<SeguimientoHTMLData>> => {
    return BaseService.request('get', `/cuenta/imprimir_seguimiento/${id}/${input}`);
};

export const SeguimientoModuleService = {
    getTableSeguimiento,
    createOrUpdateSeguimiento,
    getSeguimientoFormData,
    getReportPDF,
    getReportSeguimientoPDF,
    setActiveSeguimiento,
    destroySeguimiento
};
