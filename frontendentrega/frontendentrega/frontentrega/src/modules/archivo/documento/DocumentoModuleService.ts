import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { DocumentoTableModel } from './components/DocumentoTable';
import { DocumentoFormModel } from './components/DocumentoFormDialog';

const getTableDocumento = async (queryParams?: QueryParams): Promise<BaseResponse<DocumentoTableModel>> => {
    return BaseService.findAll<DocumentoTableModel>('/documento/documento_table', queryParams);
};

const createOrUpdateDocumento = async (data: DocumentoFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/documento/documento_form`, data);
};

const getDocumentoFormData = async (id: string): Promise<BaseResponse<DocumentoFormModel>> => {
    return BaseService.request('get', `/documento/documento_form/${id}`);
};

const getNroDocumentoData = async (nro: number, gestion: string, tipo: string): Promise<BaseResponse<any>> => {
    return BaseService.request('get', `/documento/documento_nro/${nro}/${gestion}/${tipo}`);
};

const getNroDocumentoData2 = async (nro: string, gestion: string, tipo: string): Promise<BaseResponse<any>> => {
    const data = { nro, gestion, tipo };
    return BaseService.request('post', `/documento/documento_nro2`, data);
};

const destroyDocumento = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/documento/documento_table/${id}`);
};

const setActiveDocumento = async (id_documento: string, estado: boolean): Promise<BaseResponse<DocumentoFormModel>> => {
    const data = { estado };
    return BaseService.request('post', `/documento/documento_table/${id_documento}`, data);
};

const setCambiarPermiso = async (id_documento: string, permiso: string): Promise<BaseResponse<DocumentoFormModel>> => {
    const data = { permiso };
    return BaseService.request('post', `/documento/documento_table_permiso/${id_documento}`, data);
};



const getAllDocumento = async (param?: string, queryParams?: QueryParams): Promise<BaseResponse<any>> => {
    return BaseService.findAll(`/documento/documentos/${param}`, queryParams);
};

const getAllDocumento2 = async (queryParams?: QueryParams): Promise<BaseResponse<any>> => {
    return BaseService.findAll(`/documento/documentos2`, queryParams);
};


export const DocumentoModuleService = {
    getTableDocumento,
    createOrUpdateDocumento,
    getDocumentoFormData,
    getNroDocumentoData,
    getNroDocumentoData2,
    getAllDocumento,
    getAllDocumento2,
    setCambiarPermiso,
    setActiveDocumento,
    destroyDocumento
};
