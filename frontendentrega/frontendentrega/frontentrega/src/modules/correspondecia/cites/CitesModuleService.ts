import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { CitesTableModel } from './components/CitesTable';
import { CitesFormModel } from './components/CitesFormDialog';
import { getFileName } from 'utils';


const getTableCites = async (queryParams?: QueryParams): Promise<BaseResponse<CitesTableModel>> => {	
    return BaseService.findAll<CitesTableModel>('/cites/cites_table', queryParams);
};

const createOrUpdateCites = async (data: CitesFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/cites/cites_form`, data);
};

const getCitesFormData = async (id: string): Promise<BaseResponse<CitesFormModel>> => {
    return BaseService.request('get', `/cites/cites_form/${id}`);
};

const destroyCites = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/cites/cites_table/${id}`);
};

const setActiveCites = async (id_cites: string, estado_activo: boolean): Promise<BaseResponse<CitesFormModel>> => {
    const data = { estado_activo };
	return BaseService.request('post', `/cites/cites_table/${id_cites}`, data);
};

const getAllDocumentos = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; concepto:string }>> => {
    return BaseService.findAll('/cites/cites_all_documentos', queryParams);
};

const getTipoCites = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; concepto:string; usuarioId?:string }>> => {
    return BaseService.findAll('/cites/tipo_cites', queryParams);
};


const getAllCitesRutas = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; concepto:string }>> => {
    return BaseService.findAll('/cites/cites_all_rutas', queryParams);
};

const setChangeEstado = async (cites_id: string, estado: string, fecha_cierre?: Date): Promise<BaseResponse<CitesFormModel>> => {	
    let data = {};
    if(fecha_cierre != null){
        data = { estado, fecha_cierre };
    }else{
         data = { estado };
    }
    
    return BaseService.request('post', `/cites/cites_table_estado/${cites_id}`, data);
};

const getReporteCitesPDF = async (queryParams?: QueryParams): Promise<BaseResponse<unknown>> => {
     const queryString = BaseService.buildQueryParamsText(queryParams);
     const idsFiltrosReporte= queryParams?.rows?.map(row => row.id);
     const numeroResultados = queryParams?.count;
     const filename = getFileName('Cites');
        const result = await  BaseService.download('post', `/cites/pdf_cites`, { qs: queryString , data: { ids: idsFiltrosReporte, count:numeroResultados } }, filename);
        if (!result.success) {
            return BaseService.sendError({ msg: result.msg });
        }
        return BaseService.sendSuccess();
};

//impresion
const getAllCitesPDF = async (id: string, citeCompleto: string): Promise<BaseResponse<unknown>> => {
    const filename = getFileName('CitesReporteTabla',`${citeCompleto}`);
    const result = await  BaseService.download('post', `/cites/pdf_cites_tabla`, { id }, filename);
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
    return BaseService.sendSuccess();
};


export const CitesModuleService = {
    getTableCites,
    createOrUpdateCites,
    getCitesFormData,
    setActiveCites,
    getAllDocumentos,
    destroyCites,
    getTipoCites,
    getAllCitesRutas,
    setChangeEstado,
    getReporteCitesPDF,
    getAllCitesPDF
   
};
