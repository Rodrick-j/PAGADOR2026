import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { AperturaGeneralTableModel } from './components/AperturaGeneralTable';
import { AperturaGeneralFormModel } from './components/AperturaGeneralFormDialog';
import { PresupuestoTableModel } from '../historial_apertura_detalle/components/HistorialAperturaDetalleFormDialog';

const getTableAperturaGeneral = async (queryParams?: QueryParams): Promise<BaseResponse<AperturaGeneralTableModel>> => {
    return BaseService.findAll<AperturaGeneralTableModel>('/apertura_general/apertura_general_table', queryParams);
};

const createOrUpdateAperturaGeneral = async (data: AperturaGeneralFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/apertura_general/apertura_general_form`, data);
};

const getAperturaGeneralFormData = async (id: string): Promise<BaseResponse<AperturaGeneralFormModel>> => {
    return BaseService.request('get', `/apertura_general/apertura_general_form/${id}`);
};

const destroyAperturaGeneral = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/apertura_general/apertura_general_table/${id}`);
};

const setActiveAperturaGeneral = async (id_apertura_general: string, estado_activo: boolean): Promise<BaseResponse<AperturaGeneralFormModel>> => {
    const data = { estado_activo };
	return BaseService.request('post', `/apertura_general/apertura_general_table/${id_apertura_general}`, data);
};

const getAllAperturaGeneral = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/apertura_general/apertura_general2', queryParams);
};

//Para obtener la sumatoria de pasajes
const getPresupuesto = async (id_apertura: string,): Promise<BaseResponse<PresupuestoTableModel>> => {
    return BaseService.request('get',`/apertura_general/apertura_general_presupuesto/${id_apertura}`);
};

const getVerificaPresupuesto = async (nro: number, apertura_id: string, debe_haber:string): Promise<BaseResponse<any>> => {
    return BaseService.request('get', `/apertura_general/apertura_general_presupuesto_gasto/${nro}/${apertura_id}/${debe_haber}`);
};

const getAperturaData = async (apertura: string,  cod_fte: string,cod_org: number, objeto: string, area: string, area_hijo:string): Promise<BaseResponse<any>> => {
    return BaseService.request('get', `/apertura_general/apertura_verificacion/${apertura}/${cod_fte}/${cod_org}/${objeto}/${area}/${area_hijo}`);
};


export const AperturaGeneralModuleService = {
    getTableAperturaGeneral,
    createOrUpdateAperturaGeneral,
    getAperturaGeneralFormData,
    setActiveAperturaGeneral,
    getAllAperturaGeneral,
    destroyAperturaGeneral,
    getPresupuesto,
    getVerificaPresupuesto,
    getAperturaData
};
