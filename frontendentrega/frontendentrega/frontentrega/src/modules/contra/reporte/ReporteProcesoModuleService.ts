import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { getFileName } from 'utils';
import { ReporteProcesoTableModel } from './components/ReporteProcesoTable';
import { ReporteProceso500TableModel } from './components/ReporteProceso500Table';


const getTableReporteProceso = async (queryParams?: QueryParams): Promise<BaseResponse<ReporteProcesoTableModel>> => {
    return BaseService.findAll<ReporteProcesoTableModel>('/proceso/reporte_proceso_table', queryParams);
};

const getTableReporteProceso500 = async (queryParams?: QueryParams): Promise<BaseResponse<ReporteProceso500TableModel>> => {
    return BaseService.findAll<ReporteProceso500TableModel>('/proceso/reporte_proceso_table_500', queryParams);
};

const getProcesoDetalleReportPDF = async (id: string, cod: string): Promise<BaseResponse<unknown>> => {
    const filename = getFileName('ProcesoDetalleReporte',`${cod}`);
    const result = await  BaseService.download('post', `/proceso/pdf_proceso_detalle_reporte`, { id }, filename);
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
    return BaseService.sendSuccess();
};

const getReportProcesoPDF = async (queryParams?: QueryParams): Promise<BaseResponse<unknown>> => {
    const queryString = BaseService.buildQueryParamsText(queryParams);
    const filename = getFileName('ReporteProceso');
    const result = await  BaseService.download('post', `/proceso/pdf_proceso`, { qs: queryString }, filename);
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
    return BaseService.sendSuccess();
};

const getReportProcesoPDF1 = async (queryParams?: QueryParams): Promise<BaseResponse<unknown>> => {
    const queryString = BaseService.buildQueryParamsText(queryParams);
    const filename = getFileName('ReporteProcesoGeneral');
    const result = await  BaseService.download('post', `/proceso/pdf_proceso_general`, { qs: queryString }, filename);
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
    return BaseService.sendSuccess();
};

export const ReporteProcesoModuleService = {
    getTableReporteProceso,
    getReportProcesoPDF,
    getReportProcesoPDF1,
    getTableReporteProceso500,
    getProcesoDetalleReportPDF,
};
