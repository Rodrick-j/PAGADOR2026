import { BaseService } from 'services/base/BaseService';
import { BaseResponse, QueryParams } from 'services/base/Types';
import { ViaticoTableModel } from './components/ViaticoTable';
import { ViaticoAnularFormModel, ViaticoFormModel } from './components/ViaticoFormDialog';
import { getFileName } from 'utils';
import { SeguimientoHTMLData } from 'modules/conta/cuenta/CuentaModule';

const getTableViatico = async (queryParams?: QueryParams): Promise<BaseResponse<ViaticoTableModel>> => {
    return BaseService.findAll<ViaticoTableModel>('/viatico/viatico_table', queryParams);
};

const createOrUpdateViatico = async (data: ViaticoFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/viatico/viatico_form`, data);
};

const getViaticoFormData = async (id: string): Promise<BaseResponse<ViaticoFormModel>> => {
    return BaseService.request('get', `/viatico/viatico_form/${id}`);
};

const destroyViatico = async (id: string): Promise<BaseResponse<unknown>> => {
    return BaseService.request('delete', `/viatico/viatico_table/${id}`);
};

const setActiveViatico = async (id_viatico: string, activo: boolean): Promise<BaseResponse<ViaticoFormModel>> => {
    const data = { activo };
    return BaseService.request('post', `/viatico/viatico_table/${id_viatico}`, data);
};

const getAllViatico = async (queryParams?: QueryParams): Promise<BaseResponse<{ id: string; nombre: string; }>> => {
    return BaseService.findAll('/viatico/viatico', queryParams);
};

const getDestinoFormData = async (id: string |undefined): Promise<BaseResponse<ViaticoFormModel>> => {   
    return BaseService.request('get', `/viatico/viatico_form_destino/${id}`);
};
const getNroReciboData = async (nro: number): Promise<BaseResponse<any>> => {
    return BaseService.request('get', `/viatico/viatico_nro/${nro}`);
};

const setAprobadoViatico = async (id_viatico: string, aprobado: string): Promise<BaseResponse<ViaticoFormModel>> => {
    const data = { aprobado };
    return BaseService.request('post', `/viatico/viatico_table_approve/${id_viatico}`, data);
};

 //impresion
const getReportViaticoPDF = async (id: string, recibo: number): Promise<BaseResponse<unknown>> => {
    const filename = getFileName('ReciboReporte',`${recibo}`);
    const result = await  BaseService.download('post', `/viatico/pdf_reporte`, { id }, filename);
    if (!result.success) {
        return BaseService.sendError({ msg: result.msg });
    }
    return BaseService.sendSuccess();
};

const getReportViaticoImprimePDF = async (id: string,recibo : number): Promise<BaseResponse<SeguimientoHTMLData>> => {
    return BaseService.request('get', `/viatico/imprimir_viatico/${id}`);
};

const anularRecibo = async (data: ViaticoAnularFormModel): Promise<BaseResponse<unknown>> => {
    return BaseService.request('post', `/viatico/viatico_anular_recibo`, data);
};


export const ViaticoModuleService = {
    getTableViatico,
    createOrUpdateViatico,
    getViaticoFormData,
    setActiveViatico,
    getAllViatico,
    destroyViatico,
    getDestinoFormData,
    getNroReciboData,
    setAprobadoViatico,
    getReportViaticoPDF,
    getReportViaticoImprimePDF,
    anularRecibo,
};
