import { BaseService } from 'services/base/BaseService';
import { BaseResponse } from 'services/base/Types';

const getCallBack = async (code: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/users/callback`, { code });
};

export const CallBackModuleService = {
    getCallBack,
};
