import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { RoleTableModel } from './components/RoleTable';
import { RoleFormModel } from './components/RoleFormDialog';

const getTableRoles = async (queryParams?: QueryParams): Promise<BaseResponse<RoleTableModel>> => {
    return BaseService.findAll('/roles/role_table', queryParams);
};

const setActiveRole = async (id_usuario: string, activo: boolean): Promise<BaseResponse<RoleFormModel>> => {
    const data = { activo };
    return BaseService.request('post', `/roles/role_table/${id_usuario}`, data);
};

const createRole = async (data: RoleFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/roles/role_form`, data);
};

const updateRole = async (data: RoleFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/roles/role_form`, data);
};

const getRoleFormData = async (id: string): Promise<BaseResponse<RoleFormModel>> => {
    return BaseService.request('get', `/roles/role_form/${id}`);
};

const destroyRole = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/roles/role_table/${id}`);
};

const getAllRoles= async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/roles/roles', queryParams);
};

const getAllRutas= async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/rutas/rutas', queryParams);
};

export const RolesModuleService = {
    getTableRoles,
    setActiveRole,
    updateRole,
    createRole,
    getRoleFormData,
    destroyRole,
    getAllRoles,
    getAllRutas
};
