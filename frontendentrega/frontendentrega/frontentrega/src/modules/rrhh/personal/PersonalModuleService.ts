import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { PersonalTableModel } from './components/PersonalTable';
import { PersonalFormModel } from './components/PersonalFormDialog';

const getTablePersonal = async (queryParams?: QueryParams): Promise<BaseResponse<PersonalTableModel>> => {
    return BaseService.findAll<PersonalTableModel>('/personal/personal_table', queryParams);
};

const createOrUpdatePersonal = async (data: PersonalFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/personal/personal_form`, data);
};

const getPersonalFormData = async (id: string): Promise<BaseResponse<PersonalFormModel>> => {
    return BaseService.request('get', `/personal/personal_form/${id}`);
};

const destroyPersonal = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/personal/personal_item/${id}`);
};

const setActivePersonal = async (id_personal: string, activo: boolean): Promise<BaseResponse<PersonalFormModel>> => {
    const data = { activo };
    return BaseService.request('post', `/personal/personal_table/${id_personal}`, data);
};

const getAllPersonal = async (queryParams?: QueryParams): Promise<BaseResponse<any>> => {
    return BaseService.findAll('/personal/personals', queryParams);
};

const getAllPersonalCI = async (queryParams?: QueryParams): Promise<BaseResponse<any>> => {
    return BaseService.findAll('/personal/personals_ci', queryParams);
};

export const PersonalModuleService = {
    getTablePersonal,
    createOrUpdatePersonal,
    getPersonalFormData,
    setActivePersonal,
    destroyPersonal,
    getAllPersonal,
    getAllPersonalCI,
};
