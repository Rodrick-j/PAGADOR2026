import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { ProcesoDetalleFormModel } from './components/ProcesoDetalleFormDialog';


const createOrUpdateProcesoDetalle = async (data: ProcesoDetalleFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/proceso/procesodetalle_form`, data);
};

export const ProcesoDetalleModuleService = {
    createOrUpdateProcesoDetalle,
};
