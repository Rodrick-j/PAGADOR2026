import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { BitacoraDetalleTableModel } from './components/BitacoraDetalleTable';
import { BitacoraDetalleFormModel } from './components/BitacoraDetalleFormDialog';

const getTableBitacoraDetalle = async (queryParams?: QueryParams): Promise<BaseResponse<BitacoraDetalleTableModel>> => {
    return BaseService.findAll<BitacoraDetalleTableModel>('/bitacora_detalle/bitacora_detalle_table', queryParams);
};

const createOrUpdateBitacoraDetalle = async (data: BitacoraDetalleFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/bitacora_detalle/bitacora_detalle_form`, data);
};

const getBitacoraDetalleFormData = async (id: string): Promise<BaseResponse<BitacoraDetalleFormModel>> => {
    return BaseService.request('get', `/bitacora_detalle/bitacora_detalle_form/${id}`);
};

const destroyBitacoraDetalle = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/bitacora_detalle/bitacora_detalle_table/${id}`);
};

const setActiveBitacoraDetalle = async (id_bitacora_detalle: string, activo: boolean): Promise<BaseResponse<BitacoraDetalleFormModel>> => {
    const data = { activo };
    return BaseService.request('post', `/bitacora_detalle/bitacora_detalle_table/${id_bitacora_detalle}`, data);
};

//agregando nuevo metodo get all para bitacora_detalleS
const getAllBitacoraDetalles = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/bitacora_detalle/bitacora_detalles', queryParams);
};


export const BitacoraDetalleModuleService = {
    getTableBitacoraDetalle,
    createOrUpdateBitacoraDetalle,
    getBitacoraDetalleFormData,
    setActiveBitacoraDetalle,
    destroyBitacoraDetalle,
    getAllBitacoraDetalles
};
