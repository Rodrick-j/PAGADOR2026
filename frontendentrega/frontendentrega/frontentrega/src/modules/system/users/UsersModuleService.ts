import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { UsuarioTableModel } from './components/UserTable';
import { UsuarioFormModel } from './components/UserFormDialog';
import { v4 as uuid } from 'uuid';

export type SetAvatarResponse = {
    avatarUrl: string;
};

const getTableUsuarios = async (queryParams?: QueryParams): Promise<BaseResponse<UsuarioTableModel>> => {
    return BaseService.findAll('/users/user_table', queryParams);
};

const setActiveUser = async (id_usuario: string, activo: boolean): Promise<BaseResponse<UsuarioFormModel>> => {
    const data = { activo };
    return BaseService.request('post', `/users/user_table/${id_usuario}`, data);
};

const setAvatarUser = async (fileItem: File): Promise<BaseResponse<SetAvatarResponse>> => {
    // Upload image
    const FILE_ID = uuid();
    const fileName = `${FILE_ID}-${fileItem.name}`;
    const formdata = new FormData();
    formdata.append('fileItem', fileItem, fileName);
    formdata.append('fileName', fileName);
    const uploadResult = await BaseService.uploadFile(fileItem, fileName);
    if (!uploadResult.success) {
        return BaseService.sendError({ msg: uploadResult.msg });
    }

    // Update avatar
    const data = { file_name: String(uploadResult.data?.name) };
    const updateResult = await BaseService.request('post', `/users/user_image`, data);
    if (!updateResult.success) {
        return BaseService.sendError({ msg: updateResult.msg });
    }

    // Build result
    const result = {
        msg: 'Imagen de perfil actualizada correctamente',
        data: { avatarUrl: String(uploadResult.data?.file) }
    };
    return BaseService.sendSuccess(result);
};

const resetPassword = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/users/user_reset/${id}`);
};

const resetPassword2 = async (password: string): Promise<BaseResponse<unknown>> => {
    const data = { password };
    return BaseService.request('post', `/users/user_reset2`, data);
};

const createUser = async (data: UsuarioFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/users/user_form`, data);
};

const updateUser = async (data: UsuarioFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('put', `/users/user_form`, data);
};

const getUserFormData = async (id: string): Promise<BaseResponse<UsuarioFormModel>> => {
    return BaseService.request('get', `/users/user_form/${id}`);
};

const destroyUser = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/users/user_table/${id}`);
};

const getAllUsuarios = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/users/usuarios', queryParams);
};

const getUsuariosArea = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; caption?:string}>> => {
    return BaseService.findAll('/users/user_area', queryParams);
};

export const UsersModuleService = {
    getTableUsuarios,
    setActiveUser,
    resetPassword,
    resetPassword2,
    updateUser,
    createUser,
    setAvatarUser,
    getUserFormData,
    getAllUsuarios,
    destroyUser,
    getUsuariosArea
};
