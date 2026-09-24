import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { ProcesoTableModel } from './components/ProcesoTable';
import { ProcesoFormModel } from './components/ProcesoFormDialog';


export type ProcesoDetalleTableModel = {
    id    : string;
    titulo      : string;
    subtitulo   : string;
    descripcion : string;
    tiempo      : string;
    notificacion: boolean;
    observacion : string;
    fecha       : Date;
    imagen      : string;
    estado      : string;

    usuario_id  : string;
    proceso_id  : string;
};

const getTableProceso = async (queryParams?: QueryParams): Promise<BaseResponse<ProcesoTableModel>> => {
    return BaseService.findAll<ProcesoTableModel>('/proceso/proceso_table', queryParams);
};

const createOrUpdateProceso = async (data: ProcesoFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/proceso/proceso_form`, data);
};

const getProcesoFormData = async (id: string): Promise<BaseResponse<ProcesoFormModel>> => {
    return BaseService.request('get', `/proceso/proceso_form/${id}`);
};

const destroyProceso = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/proceso/proceso_table/${id}`);
};

const setActiveProceso = async (id_proceso: string, activo: boolean): Promise<BaseResponse<ProcesoFormModel>> => {
    const data = { activo };
    return BaseService.request('post', `/proceso/proceso_table/${id_proceso}`, data);
};

const getTableProcesoDetalle = async (id_proceso: string, queryParams?: QueryParams): Promise<BaseResponse<ProcesoDetalleTableModel>> => {
    return BaseService.findAll<ProcesoDetalleTableModel>(`/proceso/proceso_table_timeline/${id_proceso}`, queryParams);
};

const getAllProceso = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; concepto: string }>> => {
    return BaseService.findAll('/proceso/procesos', queryParams);
};

const setAbiertoProceso = async (id_proceso: string, aprobado: string): Promise<BaseResponse<ProcesoFormModel>> => {
    const data = { aprobado };
    return BaseService.request('post', `/proceso/proceso_table_approve/${id_proceso}`, data);
};



export const ProcesoModuleService = {
    getTableProceso,
    createOrUpdateProceso,
    getProcesoFormData,
    getTableProcesoDetalle,
    setActiveProceso,
    getAllProceso,
    destroyProceso,
    setAbiertoProceso,
    
};
