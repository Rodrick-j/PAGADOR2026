import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { MemorandumTableModel } from './components/MemorandumTable';
import { MemorandumConteoDiasModel, MemorandumFormModel, MemorandumFormModelDetalle2, MemorandumTipoPCPModel } from './components/MemorandumFormDialog';
import { getFileName } from 'utils';

const getTableMemorandum = async (queryParams?: QueryParams): Promise<BaseResponse<MemorandumTableModel>> => {
    return BaseService.findAll<MemorandumTableModel>('/memorandum/memorandum_table', queryParams);
};

const createOrUpdateMemorandum = async (data: MemorandumFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/memorandum/memorandum_form`, data);
};

const getMemorandumFormData = async (id: string): Promise<BaseResponse<MemorandumFormModel>> => {
    return BaseService.request('get', `/memorandum/memorandum_form/${id}`);
};

const destroyMemorandum = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/memorandum/memorandum_table/${id}`);
};

const setActiveMemorandum = async (id_memorandum: string, modificacion: boolean, fecha: {id:Date, nombre:string, caption:string}[], observacion:  {a:string, b:string}[], estadoModif:{a:string, b:string}[]): Promise<BaseResponse<MemorandumFormModel>> => {
    const data = { modificacion, fecha, observacion, estadoModif };	
    return BaseService.request('post', `/memorandum/memorandum_table/${id_memorandum}`, data);
};

const getAllMemorandum = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/memorandum/memorandum', queryParams);
};

const setAprobadoMemorandum = async (id_memorandum: string, aprobado: string, justificacion?: string): Promise<BaseResponse<MemorandumFormModel>> => {
    const data = { aprobado, justificacion };	
    return BaseService.request('post', `/memorandum/memorandum_table_approve/${id_memorandum}`, data);
};

//impresion
const getReportMemorandumPDF = async (id: string, cod: string): Promise<BaseResponse<unknown>> => {
    const filename = getFileName('MemorandumReporte',`${cod}`);
    const result = await  BaseService.download('post', `/memorandum/pdf_reporte`, { id }, filename);
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
    return BaseService.sendSuccess();
};

//Para la busqueda de tipoPCP
const getTipoPCP = async (id: string): Promise<BaseResponse<MemorandumTipoPCPModel>> => {
    return BaseService.request('get', `/memorandum/memorandum_tipo_pcp/${id}`);
};

//Para la busqueda de tipoPCP
const getDiaHabil = async (id: string): Promise<BaseResponse<MemorandumTipoPCPModel>> => {
    return BaseService.request('get', `/memorandum/memorandum_dia_habil/${id}`);
};

//Para la busqueda de tipovehiculo
const getDatosMemorandum = async (memorandum_id: string,): Promise<BaseResponse<MemorandumFormModelDetalle2>> => {
    return BaseService.request('get',`/memorandum/memorandum_detalle_dias/${memorandum_id}`);
};

const getCodMemoData = async (nro: string): Promise<BaseResponse<any>> => {
    return BaseService.request('get', `/memorandum/memorandum_nro/${nro}`);
};
//getControlCountDias
//Para la busqueda de tipoPCP
const getControlCountDias = async (id: string): Promise<BaseResponse<MemorandumConteoDiasModel>> => {
    return BaseService.request('get', `/memorandum/memorandum_control_dias/${id}`);
};
//Para obtener todas las cites
const getAllCites = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; caption:string }>> => {
    return BaseService.findAll('/memorandum/memorandum_all_cites', queryParams);
};

//Para obtener un cite unico
const getCiteServer = async (id_usuario: string): Promise<BaseResponse<{ rows: string[]; count: number }>> => {
    return BaseService.request('get', `/memorandum/memorandum_cite_server/${id_usuario}`);
};

const setCambioMemoRepo = async (id_memorandum: string, tipo: string): Promise<BaseResponse<MemorandumTableModel>> => {
    const data = { tipo };
    return BaseService.request('post', `/memorandum/memorandum_table_changeMemoRepo/${id_memorandum}`, data);
};
export const MemorandumModuleService = {
    getTableMemorandum,
    createOrUpdateMemorandum,
    getMemorandumFormData,
    setActiveMemorandum,
    getAllMemorandum,
    destroyMemorandum,
    setAprobadoMemorandum,
    getReportMemorandumPDF,
    getTipoPCP,
    getDatosMemorandum,
    getCodMemoData,
    getControlCountDias,
    getDiaHabil,
    getAllCites,
    getCiteServer,
    setCambioMemoRepo,
};
