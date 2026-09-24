import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { DescargoTableModel } from './components/DescargoTable';
import { DescargoFormModel } from './components/DescargoFormDialog';

const getTableDescargo = async (queryParams?: QueryParams): Promise<BaseResponse<DescargoTableModel>> => {
    return BaseService.findAll<DescargoTableModel>('/descargo/descargo_table', queryParams);
};

const createOrUpdateDescargo = async (data: DescargoFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/descargo/descargo_form`, data);
};

const getDescargoFormData = async (id: string): Promise<BaseResponse<DescargoFormModel>> => {
    return BaseService.request('get', `/descargo/descargo_form/${id}`);
};

const destroyDescargo = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/descargo/descargo_table/${id}`);
};

const setActiveDescargo = async (id_descargo: string, activo: boolean): Promise<BaseResponse<DescargoFormModel>> => {
    const data = { activo };
    return BaseService.request('post', `/descargo/descargo_table/${id_descargo}`, data);
};

const setAprobadoDescargo = async (id_descargo: string, aprobado: string): Promise<BaseResponse<DescargoFormModel>> => {
    const data = { aprobado };
    return BaseService.request('post', `/descargo/descargo_table_approve/${id_descargo}`, data);
};

const setAprobadoInforme = async (id_descargo: string, aprobado: string): Promise<BaseResponse<DescargoFormModel>> => {
    const data = { aprobado };
    return BaseService.request('post', `/descargo/informe_table_approve/${id_descargo}`, data);
};

const getAllDescargo = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/descargo/descargo', queryParams);
};

export const DescargoModuleService = {
    getTableDescargo,
    createOrUpdateDescargo,
    getDescargoFormData,
    setActiveDescargo,
    getAllDescargo,
    destroyDescargo,
    setAprobadoDescargo,
    setAprobadoInforme,
};
