import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { ActaTableModel } from './components/ActaTable';
import { ActaFormModel } from './components/ActaFormDialog';
import { getFileName } from 'utils';
import { ENUM_TIPO_ACTA } from 'constants/enums';

const getTableActa = async (queryParams?: QueryParams): Promise<BaseResponse<ActaTableModel>> => {
    return BaseService.findAll<ActaTableModel>('/acta/acta_table', queryParams);
};

const createOrUpdateActa = async (data: ActaFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/acta/acta_form`, data);
};

const getActaFormData = async (id: string): Promise<BaseResponse<ActaFormModel>> => {
    return BaseService.request('get', `/acta/acta_form/${id}`);
};

const destroyActa = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/acta/acta_table/${id}`);
};

const devolverActa = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/acta/acta_devolucion/${id}`);
};

const getReportPDF = async (id: string, tipo: string, cod: string): Promise<BaseResponse<unknown>> => {
    const NOMBRE_ACTA = ENUM_TIPO_ACTA.find((a) => a.value ===tipo)?.label || "";
    const filename = getFileName(NOMBRE_ACTA,`${cod}`);
    const result = await  BaseService.download('post', `/acta/pdf_acta`, { id, tipo }, filename);
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
    return BaseService.sendSuccess();
};

export const ActaModuleService = {
    getTableActa,
    createOrUpdateActa,
    getActaFormData,
    getReportPDF,
    destroyActa,
    devolverActa,
};
