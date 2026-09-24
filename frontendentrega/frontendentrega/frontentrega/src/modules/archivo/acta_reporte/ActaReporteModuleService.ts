import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { ActaReporteDocumentoTableModel } from './components/ActaReporteDocumentoTable';
import { ActaReporteActaTableModel } from './components/ActaReporteActaTable';
import { getFileName } from 'utils';

const getTableActaReporteDocumento = async (queryParams?: QueryParams): Promise<BaseResponse<ActaReporteDocumentoTableModel>> => {
    return BaseService.findAll<ActaReporteDocumentoTableModel>('/documento/documento_table2', queryParams);
};

const getTableActaReporteActa = async (queryParams?: QueryParams): Promise<BaseResponse<ActaReporteActaTableModel>> => {
    return BaseService.findAll<ActaReporteActaTableModel>('/acta/acta_table_reporte', queryParams);
};

const getReportDocumentoPDF = async (queryParams?: QueryParams): Promise<BaseResponse<unknown>> => {
    const queryString = BaseService.buildQueryParamsText(queryParams);
    const filename = getFileName('ReporteDocumentos');
    const result = await BaseService.download('post', `/documento/pdf_documento`, { qs: queryString }, filename);
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
    return BaseService.sendSuccess();
};

const getReportDocumentoJSON = async (queryParams?: QueryParams): Promise<BaseResponse<any>> => {
    const queryString = BaseService.buildQueryParamsText(queryParams);
    const filename = getFileName('Excel_Documentos');
    const result = await BaseService.download('post', `/documento/json_reporte`, { qs: queryString }, filename);
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
    return BaseService.sendSuccess();
};

const getReportActaPDF = async (queryParams?: QueryParams): Promise<BaseResponse<unknown>> => {
    const queryString = BaseService.buildQueryParamsText(queryParams);
    const filename = getFileName('ReporteActa');
    const result = await BaseService.download('post', `/acta/pdf_acta2`, { qs: queryString }, filename);
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
    return BaseService.sendSuccess();
};

export const ActaReporteModuleService = {
    getTableActaReporteActa,
    getReportDocumentoPDF,
    getReportActaPDF,
    getReportDocumentoJSON,
    getTableActaReporteDocumento
};
