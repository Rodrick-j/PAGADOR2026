import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { EscalaTableModel, EscalaTableModel2 } from './components/EscalaTable';
import { EscalaFormModel } from './components/EscalaFormDialog';

const getTableEscala = async (queryParams?: QueryParams): Promise<BaseResponse<EscalaTableModel>> => {
    return BaseService.findAll<EscalaTableModel>('/escala/escala_table', queryParams);
};

const createOrUpdateEscala = async (data: EscalaFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/escala/escala_form`, data);
};

const getEscalaFormData = async (id: string): Promise<BaseResponse<EscalaFormModel>> => {
    return BaseService.request('get', `/escala/escala_form/${id}`);
};

const destroyEscala = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/escala/escala_table/${id}`);
};

const setActiveEscala = async (id_escala: string, activo: boolean): Promise<BaseResponse<EscalaFormModel>> => {
    const data = { activo };
    return BaseService.request('post', `/escala/escala_table/${id_escala}`, data);
};

const getAllEscala = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/escala/escala', queryParams);
};

//Para la busqueda de categoria y idp
const getEscalaCategoriaIDP = async (cargo: string,tipo_comision_idp:string, usuario_id: string): Promise<BaseResponse<EscalaTableModel2>> => {	
    return BaseService.request('get',`/escala/escala_categoria_tipo/${cargo}/${tipo_comision_idp}/${usuario_id}`);
};



export const EscalaModuleService = {
    getTableEscala,
    createOrUpdateEscala,
    getEscalaFormData,
    setActiveEscala,
    getAllEscala,
    destroyEscala,
    getEscalaCategoriaIDP,
};
