import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { GeneralTableModel } from './components/GeneralTable';
import { GeneralFormModel } from './components/GeneralFormDialog';

const getTableGeneral = async (queryParams?: QueryParams): Promise<BaseResponse<GeneralTableModel>> => {
    return BaseService.findAll<GeneralTableModel>('/general/general_table', queryParams);
};

const createOrUpdateGeneral = async (data: GeneralFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/general/general_form`, data);
};

const getGeneralFormData = async (id: string): Promise<BaseResponse<GeneralFormModel>> => {
    return BaseService.request('get', `/general/general_form/${id}`);
};

const destroyGeneral = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/general/general_table/${id}`);
};

const setActiveGeneral = async (id_general: string, activo: boolean): Promise<BaseResponse<GeneralFormModel>> => {
    const data = { activo };
    return BaseService.request('post', `/general/general_table/${id_general}`, data);
};

export const GeneralModuleService = {
    getTableGeneral,
    createOrUpdateGeneral,
    getGeneralFormData,
    setActiveGeneral,
    destroyGeneral
};
