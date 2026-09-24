import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { AperturaViaticoTableModel } from './components/AperturaViaticoTable';
import { AperturaViaticoFormModel } from './components/AperturaViaticoFormDialog';
import { MemorandumTipoPCPModel } from '../memorandum/components/MemorandumFormDialog';

const getTableAperturaViatico = async (queryParams?: QueryParams): Promise<BaseResponse<AperturaViaticoTableModel>> => {
    return BaseService.findAll<AperturaViaticoTableModel>('/apertura_viatico/apertura_viatico_table', queryParams);
};

const createOrUpdateAperturaViatico = async (data: AperturaViaticoFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/apertura_viatico/apertura_viatico_form`, data);
};

const getAperturaViaticoFormData = async (id: string): Promise<BaseResponse<AperturaViaticoFormModel>> => {
    return BaseService.request('get', `/apertura_viatico/apertura_viatico_form/${id}`);
};

const destroyAperturaViatico = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/apertura_viatico/apertura_viatico_table/${id}`);
};

const setActiveAperturaViatico = async (id_apertura_viatico: string, estado_activo: boolean): Promise<BaseResponse<AperturaViaticoFormModel>> => {
    const data = { estado_activo };
    return BaseService.request('post', `/apertura_viatico/apertura_viatico_table/${id_apertura_viatico}`, data);
};

const getAllAperturaViatico = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string;  id_usuario?:string;presupuesto?: number}>> => {
    return BaseService.findAll('/apertura_viatico/apertura_viatico', queryParams);
};

//Para obtener la sumatoria de pasajes
const getAperturaByUser = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; id_usuario:string;presupuesto: number }>> => {
    return BaseService.findAll('/apertura_viatico/apertura_viatico_usuario', queryParams);
};
//Para obtener la sumatoria de pasajes
const getAperturaByUserPasaje = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; id_usuario:string;presupuesto: number }>> => {
    return BaseService.findAll('/apertura_viatico/apertura_viatico_pasaje', queryParams);
};

export const AperturaViaticoModuleService = {
    getTableAperturaViatico,
    createOrUpdateAperturaViatico,
    getAperturaViaticoFormData,
    setActiveAperturaViatico,
    getAllAperturaViatico,
    destroyAperturaViatico,
    getAperturaByUser,
    getAperturaByUserPasaje

};
