import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { MemorandumrrhhTableModel } from './components/MemorandumrrhhTable';
import { MemorandumConteoDiasModel, MemorandumrrhhFormModel, MemorandumrrhhFormModelDetalle2, MemorandumTipoPCPModel } from './components/MemorandumrrhhFormDialog';
import { getFileName } from 'utils';
//import { MemorandumDetalleTableModel } from './components/MemorandumDetalleTable';

//import { MemorandumDetalleTableModel } from './components/MemorandumDetalleTable';


const getTableMemorandum = async (queryParams?: QueryParams): Promise<BaseResponse<MemorandumrrhhTableModel>> => {
    return BaseService.findAll<MemorandumrrhhTableModel>('/memorandum_rrhh/memorandum_rrhh_table', queryParams);
};

const createOrUpdateMemorandum = async (data: MemorandumrrhhFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/memorandum_rrhh/memorandum_rrhh_form`, data);
};

const getMemorandumFormData = async (id: string): Promise<BaseResponse<MemorandumrrhhFormModel>> => {
    return BaseService.request('get', `/memorandum_rrhh/memorandum_rrhh_form/${id}`);
};

const destroyMemorandum = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/memorandum_rrhh/memorandum_rrhh_table/${id}`);
};

const setActiveMemorandum = async (id_memorandum_rrhh: string, modificacion: boolean, fecha: {id:Date, nombre:string, caption:string}[], observacion:  {a:string, b:string}[], estadoModif:{a:string, b:string}[]): Promise<BaseResponse<MemorandumrrhhFormModel>> => {
    const data = { modificacion, fecha, observacion, estadoModif };	
    return BaseService.request('post', `/memorandum_rrhh/memorandum_rrhh_table/${id_memorandum_rrhh}`, data);
};

const getAllMemorandum = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/memorandum_rrhh/memorandum_rrhh', queryParams);
};

const setAprobadoMemorandum = async (id_memorandum_rrhh: string, aprobado: string): Promise<BaseResponse<MemorandumrrhhFormModel>> => {
    const data = { aprobado };
    return BaseService.request('post', `/memorandum_rrhh/memorandum_rrhh_table_approve/${id_memorandum_rrhh}`, data);
};

//impresion
const getReportMemorandumPDF = async (id: string, cod: string): Promise<BaseResponse<unknown>> => {
    const filename = getFileName('MemorandumReporte',`${cod}`);
    const result = await  BaseService.download('post', `/memorandum_rrhh/pdf_reporte`, { id }, filename);
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
    return BaseService.sendSuccess();
};

//Para la busqueda de tipoPCP
const getTipoPCP = async (id: string): Promise<BaseResponse<MemorandumTipoPCPModel>> => {
    return BaseService.request('get', `/memorandum_rrhh/memorandum_rrhh_tipo_pcp/${id}`);
};

//Para la busqueda de tipoPCP
const getDiaHabil = async (id: string): Promise<BaseResponse<MemorandumTipoPCPModel>> => {
    return BaseService.request('get', `/memorandum_rrhh/memorandum_rrhh_dia_habil/${id}`);
};

//Para la busqueda de tipovehiculo
const getDatosMemorandum = async (memorandum_rrhh_id: string,): Promise<BaseResponse<MemorandumrrhhFormModelDetalle2>> => {
    return BaseService.request('get',`/memorandum_rrhh/memorandum_rrhh_detalle_dias/${memorandum_rrhh_id}`);
};

const getCodMemoData = async (nro: string): Promise<BaseResponse<any>> => {
    return BaseService.request('get', `/memorandum_rrhh/memorandum_rrhh_nro/${nro}`);
};
//getControlCountDias
//Para la busqueda de tipoPCP
const getControlCountDias = async (id: string): Promise<BaseResponse<MemorandumConteoDiasModel>> => {
    return BaseService.request('get', `/memorandum_rrhh/memorandum_rrhh_control_dias/${id}`);
};
//Para obtener todas las cites
const getAllCites = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; caption:string }>> => {
    return BaseService.findAll('/memorandum_rrhh/memorandum_rrhh_all_cites', queryParams);
};
export const MemorandumrrhhModuleService = {
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
   
};
