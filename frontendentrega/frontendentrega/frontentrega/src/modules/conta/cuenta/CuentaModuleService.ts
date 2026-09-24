import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { CuentaTableModel } from './components/CuentaTable';
import { CuentaFormModel } from './components/CuentaFormDialog';
import { getFileName } from 'utils';
import { SeguimientoTableModel } from '../seguimiento/components/SeguimientoTable';

const getTableCuenta = async (queryParams?: QueryParams): Promise<BaseResponse<CuentaTableModel>> => {
    return BaseService.findAll<CuentaTableModel>('/cuenta/cuenta_table', queryParams);
};

const getTableSeguimiento = async (queryParams?: QueryParams): Promise<BaseResponse<SeguimientoTableModel>> => {
    return BaseService.findAll<SeguimientoTableModel>('/cuenta/seguimiento_table', queryParams);
};

const createOrUpdateCuenta = async (data: CuentaFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/cuenta/cuenta_form`, data);
};

const getCuentaFormData = async (id: string): Promise<BaseResponse<CuentaFormModel>> => {
    return BaseService.request('get', `/cuenta/cuenta_form/${id}`);
};

const getHistorialFormData = async (id: string): Promise<BaseResponse<CuentaFormModel>> => {
    return BaseService.request('get', `/deuda/historial_form/${id}`);
};

const destroyCuenta = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/cuenta/cuenta_table/${id}`);
};

const setActiveCuenta = async (id_cuenta: string, estado: boolean): Promise<BaseResponse<CuentaFormModel>> => {
    const data = { estado };
    return BaseService.request('post', `/cuenta/cuenta_table/${id_cuenta}`, data);
};

const getReportPDF = async (queryParams?: QueryParams): Promise<BaseResponse<unknown>> => {
    const queryString = BaseService.buildQueryParamsText(queryParams);
    const filename = getFileName('Cuentas');
    const result = await  BaseService.download('post', `/cuenta/pdf_cuenta`, { qs: queryString }, filename);
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
    return BaseService.sendSuccess();
};

const getReportDeudaPDF = async (id: string): Promise<BaseResponse<unknown>> => {
    const filename = getFileName('ReporteIndividualDeudor');
    const result = await  BaseService.download('post', `/deuda/pdf_deudor`, { id }, filename);
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
    return BaseService.sendSuccess();
};

export const CuentaModuleService = {
    getTableCuenta,
    getTableSeguimiento,
    createOrUpdateCuenta,
    getCuentaFormData,
    getHistorialFormData,
    getReportPDF,
    getReportDeudaPDF,
    setActiveCuenta,
    destroyCuenta
};
