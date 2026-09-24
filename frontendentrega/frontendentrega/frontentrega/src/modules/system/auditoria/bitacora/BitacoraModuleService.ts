import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { BitacoraTableModel } from './components/BitacoraTable';
import { BitacoraFormModel } from './components/BitacoraDialog';
import { getFileName } from 'utils';

const getTableBitacoras = async (queryParams?: QueryParams): Promise<BaseResponse<BitacoraTableModel>> => {
    return BaseService.findAll('/bitacora/bitacora_table', queryParams);
};

const getBitacoraFormData = async (id: string): Promise<BaseResponse<BitacoraFormModel>> => {
    return BaseService.request('get', `/bitacora/bitacora_form/${id}`);
};

const getReportBitacoraPDF = async (queryParams?: QueryParams): Promise<BaseResponse<unknown>> => {
    const queryString = BaseService.buildQueryParamsText(queryParams);
    const filename = getFileName('ReporteDocumentos');
    const result = await  BaseService.download('post', `/bitacora/pdf_bitacora`, { qs: queryString }, filename);
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
    return BaseService.sendSuccess();
};

export const BitacoraModuleService = {
    getTableBitacoras,
    getReportBitacoraPDF,
    getBitacoraFormData
};
