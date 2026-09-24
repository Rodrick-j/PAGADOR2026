import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { ReporteViaticoTableModel } from './components/ReporteViaticoTable';
import { ReporteViaticoFormModel } from './components/ReporteViaticoFormDialog';
import { getFileName } from 'utils';
import { ViaticoTableModel } from '../viatico/components/ViaticoTable';

const getTableReporteViatico = async (queryParams?: QueryParams): Promise<BaseResponse<ReporteViaticoTableModel>> => {    	
    return BaseService.findAll<ReporteViaticoTableModel>('/descargo/descargo_table', queryParams);

};
const getTableReporteViaticoRRHH = async (queryParams?: QueryParams): Promise<BaseResponse<ReporteViaticoTableModel>> => {	
    return BaseService.findAll<ReporteViaticoTableModel>('/viatico/viatico_table', queryParams);
};

const createOrUpdateReporteViatico = async (data: ReporteViaticoFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/viatico/viatico_form`, data);
};

const getReporteViaticoFormData = async (id: string): Promise<BaseResponse<ReporteViaticoFormModel>> => {
    return BaseService.request('get', `/viatico/viatico_form/${id}`);
};

const destroyReporteViatico = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/viatico/viatico_table/${id}`);
};

const setActiveReporteViatico = async (id_viatico: string, activo: boolean): Promise<BaseResponse<ReporteViaticoFormModel>> => {
    const data = { activo };
    return BaseService.request('post', `/viatico/viatico_table/${id_viatico}`, data);
};

const getAllReporteViatico = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/viatico/viatico', queryParams);
};

const getDestinoFormData = async (id: string |undefined): Promise<BaseResponse<ReporteViaticoFormModel>> => {   
    return BaseService.request('get', `/viatico/viatico_form_destino/${id}`);
};
const getNroReciboData = async (nro: number): Promise<BaseResponse<any>> => {
    return BaseService.request('get', `/viatico/viatico_nro/${nro}`);
};

const setAprobadoReporteViatico = async (id_viatico: string, aprobado: string): Promise<BaseResponse<ReporteViaticoFormModel>> => {
    const data = { aprobado };
    return BaseService.request('post', `/viatico/viatico_table_approve/${id_viatico}`, data);
};

 //impresion
const getReportReporteViaticoPDF = async (id: string, recibo: number): Promise<BaseResponse<unknown>> => {
    const filename = getFileName('ReciboReporte',`${recibo}`);
    const result = await  BaseService.download('post', `/viatico/pdf_reporte`, { id }, filename);
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
    return BaseService.sendSuccess();
};

const getReportPDF = async (queryParams?: QueryParams,fechaInicio?:string, fechaFin?: string, tipoFecha?: number,): Promise<BaseResponse<unknown>> => {
	const queryString = BaseService.buildQueryParamsText(queryParams);		
    const idsFiltrosReporte= queryParams?.rows?.map(row => row.id);
    const idBeneficiario = queryParams?.rows?.[0].id;	
	
    const tipoReporte = queryString.includes("REPORTE_POR_BENEFICIARIO");
    const filename = getFileName('Viaticos');
    let result;
    if(tipoReporte){
         result = await  BaseService.download('post', `/descargo/pdf_viatico/${idBeneficiario}`, { qs: queryString ,data: { ids: idsFiltrosReporte, fechaInicio: fechaInicio, fechaFin: fechaFin, tipoFecha: tipoFecha } }, filename);
    }else{
         result = await  BaseService.download('post', `/descargo/pdf_viatico`, { qs: queryString ,data: { ids: idsFiltrosReporte, fechaInicio: fechaInicio, fechaFin: fechaFin, tipoFecha: tipoFecha}}, filename);
    }   // const result = await  BaseService.download('post', `/descargo/pdf_viatico`, queryParams, filename);
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
    return BaseService.sendSuccess();
};

const getFechaFiltro = async (fechaInicio: string, fechaFin :string,queryParams?: QueryParams): Promise<BaseResponse<ReporteViaticoTableModel>> => { 
   return BaseService.findAll( `/descargo/descargo_fecha_filtro/${fechaInicio}/${fechaFin}`,queryParams);
};

const getFechaFiltroRRHH = async (fechaInicio: string, fechaFin :string,queryParams?: QueryParams): Promise<BaseResponse<ReporteViaticoTableModel>> => { 
   return BaseService.findAll( `/viatico/viatico_fecha_filtro/${fechaInicio}/${fechaFin}`,queryParams);
};

const getNombreApellido= async (nombre?: string, apellido? :string,queryParams?: QueryParams): Promise<BaseResponse<ReporteViaticoTableModel>> => { 
     // Construcción dinámica de la URL
     let url = '/descargo/descargo_nombre_filtro';
    
     // Agregar parámetros solo si están presentes
     if (nombre) {
         url += `/${nombre}`;
     }
     if (apellido) {
         url += `/${apellido}`;
     }
 
    return BaseService.findAll( url,queryParams);
 };

 const getDatosBeneficiario= async (fechaInicio: string, fechaFin :string,beneficiario:string,queryParams?: QueryParams): Promise<BaseResponse<ReporteViaticoTableModel>> => { 
    return BaseService.findAll( `/descargo/descargo_beneficiario_filtro/${fechaInicio}/${fechaFin}/${beneficiario}`,queryParams);
 };

 const getTipoUsuario= async (fechaInicio?: string, fechaFin? :string,tipo?: string,queryParams?: QueryParams): Promise<BaseResponse<ReporteViaticoTableModel>> => { 
    return BaseService.findAll( `/descargo/descargo_tipo_filtro/${fechaInicio}/${fechaFin}/${tipo}`,queryParams);
 };
 
 const getTipoUsuarioRRHH= async (tipo?: string,queryParams?: QueryParams): Promise<BaseResponse<ReporteViaticoTableModel>> => { 
    return BaseService.findAll( `/viatico/viatico_tipo_filtro/${tipo}`,queryParams);
 };

 const getTipoEstados= async (fechaInicio?: string, fechaFin? :string,estado?: string,queryParams?: QueryParams): Promise<BaseResponse<ReporteViaticoTableModel>> => { 
    return BaseService.findAll( `/descargo/descargo_estado_filtro/${fechaInicio}/${fechaFin}/${estado}`,queryParams);
 };

  const getEstadoPago= async (fechaInicio?: string, fechaFin? :string,estado?: string,queryParams?: QueryParams): Promise<BaseResponse<ReporteViaticoTableModel>> => { 
    return BaseService.findAll( `/descargo/descargo_estado_pago/${fechaInicio}/${fechaFin}/${estado}`,queryParams);
 };

   const getEstadoPagoRRHH= async (estado?: string,queryParams?: QueryParams): Promise<BaseResponse<ReporteViaticoTableModel>> => { 
    return BaseService.findAll( `/viatico/viatico_estado_pago/${estado}`,queryParams);
 };

   const getTipoVencimiento= async (fechaInicio?: string, fechaFin? :string,tipo?: string,queryParams?: QueryParams): Promise<BaseResponse<ReporteViaticoTableModel>> => { 
    return BaseService.findAll( `/descargo/descargo_tipo_vencimiento/${fechaInicio}/${fechaFin}/${tipo}`,queryParams);
 };

 
   const getTipoPostPagoCancelado = async (fechaInicio?: string, fechaFin? :string,tipo?: string,queryParams?: QueryParams): Promise<BaseResponse<ReporteViaticoTableModel>> => { 
    return BaseService.findAll( `/descargo/descargo_tipo_postpago_cancelado/${fechaInicio}/${fechaFin}/${tipo}`,queryParams);
 };

    const getTipoAnulado = async (fechaInicio?: string, fechaFin? :string,reciboAnulado?: string,queryParams?: QueryParams): Promise<BaseResponse<ReporteViaticoTableModel>> => { 
    return BaseService.findAll( `/descargo/descargo_tipo_anulado/${fechaInicio}/${fechaFin}/${reciboAnulado}`,queryParams);
 };

   const getEstadoModificacionRRHH= async (estado?: string,queryParams?: QueryParams): Promise<BaseResponse<ReporteViaticoTableModel>> => { 
    return BaseService.findAll( `/viatico/viatico_estado_modificacion/${estado}`,queryParams);
 };

 const getReportJSON = async (fechaInicio?:string, fechaFin?: string,queryParams?: QueryParams): Promise<BaseResponse<any>> => {
    const queryString = BaseService.buildQueryParamsText(queryParams);		
    const idsFiltrosReporte= queryParams?.rows?.map(row => row.id);	
    const idBeneficiario = queryParams?.rows?.[0]?.id ?? 0;	
	
    const tipoReporte = queryString.includes("REPORTE_POR_BENEFICIARIO");	
    const tipoReporteRRHH = queryString.includes("REPORTE_PARA_RRHH");	
    const filename = getFileName('Excel_Viaticos');
    let result;
    if(tipoReporteRRHH){
         result = await  BaseService.download('post', `/viatico/json_reporte/${idBeneficiario}`, { qs: queryString ,data: { ids: idsFiltrosReporte,fechaInicio: fechaInicio, fechaFin: fechaFin } }, filename);        
    }else{
        if(tipoReporte){
             result = await  BaseService.download('post', `/descargo/json_reporte/${idBeneficiario}`, { qs: queryString ,data: { ids: idsFiltrosReporte,fechaInicio: fechaInicio, fechaFin: fechaFin } }, filename);
        }else{
            result = await  BaseService.download('post', `/descargo/json_reporte`, { qs: queryString ,data: { ids: idsFiltrosReporte,fechaInicio: fechaInicio, fechaFin: fechaFin }}, filename);
        }   // const result = await  BaseService.download('post', `/descargo/pdf_viatico`, queryParams, filename);
    }
    
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
	
    return BaseService.sendSuccess();
    //return await BaseService.request('post', '/descargo/json_reporte', params);
  };
  

  

export const ReporteViaticoModuleService = {
    getTableReporteViatico,
    getTableReporteViaticoRRHH,
    createOrUpdateReporteViatico,
    getReporteViaticoFormData,
    setActiveReporteViatico,
    getAllReporteViatico,
    destroyReporteViatico,
    getDestinoFormData,
    getNroReciboData,
    setAprobadoReporteViatico,
    getReportReporteViaticoPDF,
    getReportPDF,
    getFechaFiltro,
    getTipoUsuarioRRHH,
    getFechaFiltroRRHH,
    getNombreApellido,
    getDatosBeneficiario,
    getTipoUsuario,
    getTipoEstados,
    getEstadoPago,
     getEstadoPagoRRHH,
     getEstadoModificacionRRHH,
     getTipoVencimiento,
     getTipoPostPagoCancelado,
    getReportJSON,
    getTipoAnulado,
};
