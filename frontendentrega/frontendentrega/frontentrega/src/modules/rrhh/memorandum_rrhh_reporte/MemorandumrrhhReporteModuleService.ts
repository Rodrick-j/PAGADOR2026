import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { MemorandumrrhhReporteTableModel } from './components/MemorandumrrhhReporteTable';
import { MemorandumrrhhReporteFormModel } from './components/MemorandumrrhhReporteFormDialog';
import { getFileName } from 'utils';

const getTableMemorandumrrhhReporte = async (queryParams?: QueryParams): Promise<BaseResponse<MemorandumrrhhReporteTableModel>> => {
   return BaseService.findAll<MemorandumrrhhReporteTableModel>('/memorandum_rrhh/memorandum_rrhh_table', queryParams);
};

const createOrUpdateMemorandumrrhhReporte = async (data: MemorandumrrhhReporteFormModel): Promise<BaseResponse<unknown>> => {
   return BaseService.request('post', `/memorandum_rrhh/memorandum_rrhh_form`, data);
};

const getMemorandumrrhhReporteFormData = async (id: string): Promise<BaseResponse<MemorandumrrhhReporteFormModel>> => {
    return BaseService.request('get', `/memorandum_rrhh/memorandum_rrhh_form/${id}`);
};

const destroyMemorandumrrhhReporte = async (id: string): Promise<BaseResponse<unknown>> => {
     return BaseService.request('delete', `/memorandum_rrhh/memorandum_rrhh_table/${id}`);
};

 //impresion
/*const getReportMemorandumrrhhPDF = async (id: string, recibo: number): Promise<BaseResponse<unknown>> => {
    const filename = getFileName('MemorandumReporte',`${recibo}`);
    const result = await  BaseService.download('post', `/memorandum_rrhh/pdf_reporte`, { id }, filename);
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
    return BaseService.sendSuccess();
};*/
//impresion
const getReportMemorandumPDF = async (id: string, cod: string): Promise<BaseResponse<unknown>> => {
    const filename = getFileName('MemorandumReporte',`${cod}`);
    const result = await  BaseService.download('post', `/memorandum_rrhh/pdf_reporte`, { id }, filename);
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
    return BaseService.sendSuccess();
};

const getReportPDF = async (queryParams?: QueryParams,fechaInicio?:string, fechaFin?: string, tipoFecha?: number, id_memorandumrrhh?:string): Promise<BaseResponse<unknown>> => {
	
	const queryString = BaseService.buildQueryParamsText(queryParams);		
    const idsFiltrosReporte= queryParams?.rows?.map(row => row.id);
	const idBeneficiario = queryParams?.rows?.[0].id;	
	const tipoReporte = queryString.includes("REPORTE_POR_BENEFICIARIO");
	const filename = getFileName('MemorandumRRHH');
	
    let result;

    if(tipoReporte){
         result = await  BaseService.download('post', `/memorandum_rrhh/pdf_memorandum_rrhh/${idBeneficiario}`, { qs: queryString ,data: { ids: idsFiltrosReporte , id_memorandumrrhh:id_memorandumrrhh, fechaInicio: fechaInicio, fechaFin: fechaFin, tipoFecha: tipoFecha} }, filename);
    }else{
         result = await  BaseService.download('post', `/memorandum_rrhh/pdf_memorandum_rrhh`, { qs: queryString ,data: { ids: idsFiltrosReporte, id_memorandumrrhh:id_memorandumrrhh , fechaInicio: fechaInicio, fechaFin: fechaFin, tipoFecha: tipoFecha}}, filename);
    }   // const result = await  BaseService.download('post', `/memorandum_rrhh/pdf_memorandum_rrhh`, queryParams, filename);
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
    
    return BaseService.sendSuccess();
};

const getFechaFiltro = async (fechaInicio: string, fechaFin :string,queryParams?: QueryParams): Promise<BaseResponse<MemorandumrrhhReporteTableModel>> => { 
   return BaseService.findAll( `/memorandum_rrhh/memorandum_rrhh_fecha_filtro/${fechaInicio}/${fechaFin}`,queryParams);
};

const getNombreApellido= async (nombre?: string, apellido? :string,queryParams?: QueryParams): Promise<BaseResponse<MemorandumrrhhReporteTableModel>> => { 
     // Construcción dinámica de la URL
     let url = '/memorandum_rrhh/memorandum_rrhh_nombre_filtro';
    
     // Agregar parámetros solo si están presentes
     if (nombre) {
         url += `/${nombre}`;
     }
     if (apellido) {
         url += `/${apellido}`;
     }
 
    return BaseService.findAll( url,queryParams);
 };

 const getDatosBeneficiario= async (fechaInicio: string, fechaFin :string,beneficiario:string,queryParams?: QueryParams): Promise<BaseResponse<MemorandumrrhhReporteTableModel>> => { 
    return BaseService.findAll( `/memorandum_rrhh/memorandum_rrhh_beneficiario_filtro/${fechaInicio}/${fechaFin}/${beneficiario}`,queryParams);
 };

 const getTipoUsuario= async (tipo?: string,queryParams?: QueryParams): Promise<BaseResponse<MemorandumrrhhReporteTableModel>> => { 
    return BaseService.findAll( `/memorandum_rrhh/memorandum_rrhh_tipo_filtro/${tipo}`,queryParams);
 };

 const getTipoEstados= async (estado?: string,queryParams?: QueryParams): Promise<BaseResponse<MemorandumrrhhReporteTableModel>> => { 
    return BaseService.findAll( `/memorandum_rrhh/memorandum_rrhh_estado_filtro/${estado}`,queryParams);
 };

 const getReportJSON = async (fechaInicio?:string, fechaFin?: string,queryParams?: QueryParams): Promise<BaseResponse<any>> => {
    const queryString = BaseService.buildQueryParamsText(queryParams);		
    const idsFiltrosReporte= queryParams?.rows?.map(row => row.id);
    const idBeneficiario = queryParams?.rows?.[0].id;	
	
    const tipoReporte = queryString.includes("REPORTE_POR_BENEFICIARIO");
    const filename = getFileName('Excel_MemorandumRRHH');
    let result;
    if(tipoReporte){
         result = await  BaseService.download('post', `/memorandum_rrhh/json_reporte/${idBeneficiario}`, { qs: queryString ,data: { ids: idsFiltrosReporte,fechaInicio: fechaInicio, fechaFin: fechaFin } }, filename);
    }else{
         result = await  BaseService.download('post', `/memorandum_rrhh/json_reporte`, { qs: queryString ,data: { ids: idsFiltrosReporte,fechaInicio: fechaInicio, fechaFin: fechaFin }}, filename);
    }   // const result = await  BaseService.download('post', `/memorandum_rrhh/pdf_memorandum_rrhh`, queryParams, filename);
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
	
    return BaseService.sendSuccess();
    //return await BaseService.request('post', '/memorandum_rrhh/json_reporte', params);
  };
  

  

export const MemorandumrrhhReporteModuleService = {
    getTableMemorandumrrhhReporte,
    createOrUpdateMemorandumrrhhReporte,
    getMemorandumrrhhReporteFormData,
    
 
    getReportMemorandumPDF,
    getReportPDF,
    getFechaFiltro,
    getNombreApellido,
    getDatosBeneficiario,
    getTipoUsuario,
    getTipoEstados,
    getReportJSON,
   
};
