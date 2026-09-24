import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { RutaTableModel } from './components/RutaTable';
import { RutaFormModel } from './components/RutaFormDialog';

const getTableRutas = async (queryParams?: QueryParams): Promise<BaseResponse<RutaTableModel>> => {
    return BaseService.findAll('/rutas/ruta_table', queryParams);
};

const setActiveRuta = async (id_usuario: string, activo: boolean): Promise<BaseResponse<RutaFormModel>> => {
    const data = { activo };
    return BaseService.request('post', `/rutas/ruta_table/${id_usuario}`, data);
};

const createRuta = async (data: RutaFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/rutas/ruta_form`, data);
};

const updateRuta = async (data: RutaFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/rutas/ruta_form`, data);
};

const getRutaFormData = async (id: string): Promise<BaseResponse<RutaFormModel>> => {
    return BaseService.request('get', `/rutas/ruta_form/${id}`);
};

const destroyRuta = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/rutas/ruta_table/${id}`);
};

const getAllRutas= async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/rutas/rutas', queryParams);
};

export const RutasModuleService = {
    getTableRutas,
    setActiveRuta,
    updateRuta,
    createRuta,
    getRutaFormData,
    destroyRuta,
    getAllRutas
};
