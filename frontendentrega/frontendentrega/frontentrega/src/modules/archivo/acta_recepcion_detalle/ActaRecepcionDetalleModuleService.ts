import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { ActaRecepcionDetalleFormModel } from './components/ActaRecepcionDetalleFormDialog';
import { ActaRecepcionDetalleTableModel } from './components/ActaRecepcionDetalleTable';


const getTableActaRecepcionDetalle = async (queryParams?: QueryParams): Promise<BaseResponse<ActaRecepcionDetalleTableModel>> => {
    return BaseService.findAll<ActaRecepcionDetalleTableModel>('/acta_recepcion/acta_recepcion_detalle_table', queryParams);
};

const createOrUpdateActaRecepcionDetalle = async (data: ActaRecepcionDetalleFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/acta_recepcion/acta_recepcion_detalle_form`, data);
};

const destroyActaRecepcionDetalle = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/acta_recepcion/acta_recepcion_detalle_table/${id}`);
};

const getActaRecepcionDetalleFormData = async (id: string): Promise<BaseResponse<ActaRecepcionDetalleFormModel>> => {
    return BaseService.request('get', `/acta_recepcion/acta_recepcion_detalle_form/${id}`);
};

export const ActaRecepcionDetalleModuleService = {
    createOrUpdateActaRecepcionDetalle,
    getTableActaRecepcionDetalle,
    getActaRecepcionDetalleFormData,
    destroyActaRecepcionDetalle
};
