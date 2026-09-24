import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { v4 as uuid } from 'uuid';

export type SetAvatarResponse = {
    avatarUrl: string;
    name: string;
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
    const data = { file_name: String(uploadResult.data?.name), file: String(uploadResult.data?.path) };
    const updateResult = await BaseService.request('post', `/users/user_image`, data);
    if (!updateResult.success) {
        return BaseService.sendError({ msg: updateResult.msg });
    }

    // Build result
    const result = {
        msg: 'Imagen de perfil actualizada correctamente',
        data: { avatarUrl: String(data.file), name: String(uploadResult.data?.name) },
    };
    return BaseService.sendSuccess(result);
};

const resetPassword2 = async (password: string): Promise<BaseResponse<unknown>> => {
    const data = { password };
    return BaseService.request('post', `/users/user_reset2`, data);
};


export const ProfileModuleService = {
    setAvatarUser,
    resetPassword2
};
