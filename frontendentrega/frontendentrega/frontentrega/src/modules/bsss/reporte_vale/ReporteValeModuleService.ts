import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { ReporteValeTableModel } from './components/ReporteValeTable';
import { ReporteValeFormModel } from './components/ReporteValeFormDialog';
import { getFileName } from 'utils';

const getTableReporteVale = async ( queryParams?: QueryParams): Promise<BaseResponse<ReporteValeTableModel>> => {   
   return BaseService.findAll<ReporteValeTableModel>(`/vale/vale_table`, queryParams);
};

const createOrUpdateReporteVale = async (data: ReporteValeFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/vale/vale_form`, data);
};

const getReporteValeFormData = async (id: string): Promise<BaseResponse<ReporteValeFormModel>> => {
    return BaseService.request('get', `/vale/vale_form/${id}`);
};

const destroyReporteVale = async (id: string): Promise<BaseResponse<unknown>> => {
     return BaseService.request('delete', `/vale/vale_table/${id}`);
};
const obtenerDatosVehiculoApertura = async (queryParams?: QueryParams): Promise<BaseResponse<any>> => {
    return BaseService.request('get', '/vale/vehiculo_asignacion');
};

 //impresion
/*const getReportMemorandumrrhhPDF = async (id: string, recibo: number): Promise<BaseResponse<unknown>> => {
    const filename = getFileName('MemorandumReporte',`${recibo}`);
    const result = await  BaseService.download('post', `/vale/pdf_reporte`, { id }, filename);
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
    return BaseService.sendSuccess();
};*/
//impresion
const getReportMemorandumPDF = async (id: string, cod: string): Promise<BaseResponse<unknown>> => {
    const filename = getFileName('MemorandumReporte',`${cod}`);
    const result = await  BaseService.download('post', `/vale/pdf_reporte`, { id }, filename);
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
    return BaseService.sendSuccess();
};

const getReportPDF = async (queryParams?: QueryParams,fechaInicio?:string, fechaFin?: string, tipoFecha?: number, id_vale?: string): Promise<BaseResponse<unknown>> => {
	
	const queryString = BaseService.buildQueryParamsText(queryParams);		
    const idsFiltrosReporte= queryParams?.rows?.map(row => row.id);
	const idBeneficiario = queryParams?.rows?.[0].id;	
	const tipoReporte = queryString.includes("REPORTE_POR_APERTURA");	
	const filename = getFileName('ReporteVale');
	
    let result;
  
    if(tipoReporte){
         result = await  BaseService.download('post', `/vale/pdf_reporte_vale/${idBeneficiario}`, { qs: queryString ,data: { ids: idsFiltrosReporte , id_vale:id_vale, fechaInicio: fechaInicio, fechaFin: fechaFin, tipoFecha: tipoFecha} }, filename);
    }else{
         result = await  BaseService.download('post', `/vale/pdf_reporte_vale`, { qs: queryString ,data: { ids: idsFiltrosReporte, id_vale:id_vale, fechaInicio: fechaInicio, fechaFin: fechaFin, tipoFecha: tipoFecha }}, filename);
    }   // const result = await  BaseService.download('post', `/vale/pdf_vale`, queryParams, filename);
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
    
    return BaseService.sendSuccess();
};

const getFechaFiltro = async (fechaInicio: string, fechaFin :string, queryParams?: QueryParams): Promise<BaseResponse<ReporteValeTableModel>> => {   
   return BaseService.findAll( `/vale/reporte_vale_fecha_filtro/${fechaInicio}/${fechaFin}`,queryParams);
};

//
const getFechaFiltroReporteFinal = async (fechaInicio: string, fechaFin :string, queryParams?: QueryParams): Promise<BaseResponse<ReporteValeTableModel>> => {   
   return BaseService.findAll( `/vale/reporte_vale_filtro_reporte_final/${fechaInicio}/${fechaFin}`,queryParams);
};

const getNombreApellido= async (nombre?: string, apellido? :string,queryParams?: QueryParams): Promise<BaseResponse<ReporteValeTableModel>> => { 
     // Construcción dinámica de la URL
     let url = '/vale/vale_nombre_filtro';
    
     // Agregar parámetros solo si están presentes
     if (nombre) {
         url += `/${nombre}`;
     }
     if (apellido) {
         url += `/${apellido}`;
     }
 
    return BaseService.findAll( url,queryParams);
 };

 const getDatosApertura= async (fechaInicio: string, fechaFin :string,apertura:string,queryParams?: QueryParams): Promise<BaseResponse<ReporteValeTableModel>> => { 
    return BaseService.findAll( `/vale/vale_apertura_filtro/${fechaInicio}/${fechaFin}/${apertura}`,queryParams);
 };

  const getDatosContrato= async (fechaInicio: string, fechaFin :string,contrato:string,queryParams?: QueryParams): Promise<BaseResponse<ReporteValeTableModel>> => { 
    return BaseService.findAll( `/vale/vale_contrato_filtro/${fechaInicio}/${fechaFin}/${contrato}`,queryParams);
 };

  const getDatosVehiculo= async (fechaInicio: string, fechaFin :string,placa:string,queryParams?: QueryParams): Promise<BaseResponse<ReporteValeTableModel>> => { 
    return BaseService.findAll( `/vale/vale_vehiculo_filtro/${fechaInicio}/${fechaFin}/${placa}`,queryParams);
 };


 const getTipoCombustible= async (fechaInicio: string, fechaFin :string,combustible: string ,queryParams?: QueryParams): Promise<BaseResponse<ReporteValeTableModel>> => { 
    return BaseService.findAll( `/vale/vale_combustible_filtro/${fechaInicio}/${fechaFin}/${combustible}`,queryParams);
 };

 /*const getTipoEstados= async (estado?: string,queryParams?: QueryParams): Promise<BaseResponse<ReporteValeTableModel>> => { 
    return BaseService.findAll( `/vale/vale_estado_filtro/${estado}`,queryParams);
 };*/

 const getReportJSON = async (fechaInicio?:string, fechaFin?: string,queryParams?: QueryParams): Promise<BaseResponse<any>> => {
    const queryString = BaseService.buildQueryParamsText(queryParams);		
    const idsFiltrosReporte= queryParams?.rows?.map(row => row.id);
    const idApertura = queryParams?.rows?.[0].id;	
	
    const tipoReporte = queryString.includes("REPORTE_POR_APERTURA");
    const filename = getFileName('Excel_Vale');
    let result;
    if(tipoReporte){
         result = await  BaseService.download('post', `/vale/json_reporte/${idApertura}`, { qs: queryString ,data: { ids: idsFiltrosReporte,fechaInicio: fechaInicio, fechaFin: fechaFin } }, filename);
    }else{
         result = await  BaseService.download('post', `/vale/json_reporte`, { qs: queryString ,data: { ids: idsFiltrosReporte, fechaInicio: fechaInicio, fechaFin: fechaFin }}, filename);
    }   // const result = await  BaseService.download('post', `/vale/pdf_vale`, queryParams, filename);
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
	
    return BaseService.sendSuccess();
    //return await BaseService.request('post', '/vale/json_reporte', params);
  };
  

  

export const ReporteValeModuleService = {
    getTableReporteVale,
    createOrUpdateReporteVale,
    getReporteValeFormData,
    obtenerDatosVehiculoApertura,
 
    getReportMemorandumPDF,
    getReportPDF,
    getFechaFiltro,
    getNombreApellido,
    getDatosApertura,
    getDatosContrato,
   
    getDatosVehiculo,
    getTipoCombustible,
    //getTipoEstados,
    getReportJSON,
    getFechaFiltroReporteFinal,
   
};
