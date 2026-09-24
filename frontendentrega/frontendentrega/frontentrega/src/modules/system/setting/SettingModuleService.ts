import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';

/* const getPersonalData = async (): Promise<BaseResponse<unknown>> => {
    return BaseService.request('get', `/setting/personal`);
};

const getCargoData = async (): Promise<BaseResponse<unknown>> => {
    return BaseService.request('get', `/setting/cargos`);
};

const getAreaData = async (): Promise<BaseResponse<unknown>> => {
    return BaseService.request('get', `/setting/area`);
};

const getAsignarData = async (): Promise<BaseResponse<unknown>> => {
    return BaseService.request('get', `/setting/asignar`);
};

const getVacacionData = async (): Promise<BaseResponse<unknown>> => {
    return BaseService.request('get', `/setting/vacacion`);
};

const getRevisionHorario = async (): Promise<BaseResponse<unknown>> => {
    return BaseService.request('get', `/setting/revision_horario`);
};
 */
const getCierreGestion = async (): Promise<BaseResponse<unknown>> => {
    return BaseService.request('get', `/setting/purgar_all`);
};
/* const getUserPasswordAll = async (): Promise<BaseResponse<unknown>> => {
    return BaseService.request('get', `/setting/user_all`);
}; */

export const SettingModuleService = {
    getCierreGestion,
    //getUserPasswordAll
    /* getRevisionHorario,
    getPersonalData,
    getCargoData,
    getAreaData,
    getVacacionData */
};
