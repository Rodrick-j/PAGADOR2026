import { Result } from "../../../../base/types/Result";

import { findAndCountResult, formatearNumero } from "../../../../tools/util";
import moment from "moment";
import DeudaService from "../../../../core/admin/conta/deuda";
import HistorialService from "../../../../core/admin/conta/historial";
import CuentaService from "../../../../core/admin/conta/cuenta";
import { ENUM_DEUDA } from "../../../../base/constants/enum";

type DeudaTableModel = {
    index        : number;
    id           : string;
    cod_activo   : string;
    titulo       : string;
    descripcion  : string;
    gestion_deuda: string;
    monto_deuda  : number;
    estado       : boolean;
};

type HistorialTableModel = {
    index      : number;
    id         : string;
    fecha      : string;
    descripcion: string;
    debe       : string;
    haber      : string;
    saldo      : string;   
    estado     : boolean;
    concepto_deuda : string;
    //id_deuda   : string;
};

export type GetDeudasTableResponse = {
    rows: DeudaTableModel[];
    count: number;
};

export type GetHistorialTableResponse = {
    rows: HistorialTableModel[];
    count: number;
};

export type DeudaFormDataResponse = {
    id           : string;
    cod_activo   : string;
    titulo       : string;
    descripcion  : string;
    estado       : boolean;
    gestion_deuda: string;
    monto_deuda  : number;
    cuenta_id?   : string | null;
};

export type DetalleDeudaDataResponse ={
    id?          : string;
    cod_activo   : string;
    titulo       : string;
    descripcion  : string;
    gestion_deuda: string;
    monto_deuda  : string;
    cuenta_id    : string;
}
export class DeudaView {
    public async getDeudasTable(query: any): Promise<Result<GetDeudasTableResponse>> { 

        const ID_CUENTA = query.cuenta_id || "";
        if ('cuenta_id' in query) delete query.cuenta_id;
        const deuda = await DeudaService.getAll();
        if (deuda.isFailure) return Result.fail("Falló al obtener la deuda");
        const deudaResult = deuda.getValue().filter((d) => d.props.cuentaId === ID_CUENTA);

        let INDEX_ = 0;
        const result: DeudaTableModel[] = deudaResult.map((item) => {
            if(!item.props.titulo.includes('INICIAL')) INDEX_ +=1; else INDEX_=0;
            return {
                index: INDEX_,
                id         : String(item.id),
                cod_activo : item.props.codActivo,
                titulo     : item.props.titulo,
                descripcion: item.props.descripcion,
                estado     : item.props.estado,
                gestion_deuda : item.props.gestionDeuda,
                monto_deuda : item.props.montoDeuda,
                cuenta_id  : item.props.cuentaId,
            };
        }).sort((a, b) => a.index > b.index ? 1 : -1);
        
        const response = findAndCountResult(result, query);
       
        return Result.ok(response);
    }

    public async getHistorialTable(query: any): Promise<Result<GetHistorialTableResponse>> {
            
        const ID_CUENTA = query.cuenta_id || ""; 

        const historial = await HistorialService.getAll();
        if (historial.isFailure) return Result.fail("Falló al obtener la historial");        
        const historialResult = historial.getValue().filter((h) => h.props.cuentaId === ID_CUENTA);    

        const originalArray  = historialResult.filter((h) => h.props.descripcion.includes('INICIAL'));
        const newElements = historialResult.filter((h) => !h.props.descripcion.includes('INICIAL'))
                                           .sort((a, b) => moment(a.props.fecha).toDate() < moment(b.props.fecha).toDate() ? 1 : -1);
        const resultArray = [...originalArray, ...newElements];
        let INDEX_ = 0;          
        const result: HistorialTableModel[] = resultArray
                                                .map((item) => {
                                                    const debe = item.props.debe?formatearNumero(item.props.debe,'en-US'):"0";
                                                    const haber = item.props.haber?formatearNumero(item.props.haber,'en-US'):"0";
                                                    if(!item.props.descripcion.includes('INICIAL')) INDEX_ +=1; else INDEX_=0;            

                                                    return {
                                                        index      : INDEX_,
                                                        id         : String(item.id),
                                                        fecha      : item.props.fecha?moment(item.props.fecha).format("DD/MM/YYYY").toString(): '',                                                        fecha_     : item.props.fecha,
                                                        descripcion: item.props.descripcion,
                                                        debe,
                                                        haber,
                                                        saldo         : formatearNumero(item.props.saldo,'en-US'),
                                                        estado        : item.props.estado,
                                                        adjuntos      : `${JSON.stringify(item.props.adjuntos)}`,
                                                        concepto_deuda: '',
                                                    };
                                                });
        
        const response = findAndCountResult(result);        
		
        return Result.ok(response);
    } 

    

    public async getDeudaFormDataView(id_deuda: string): Promise<Result<DeudaFormDataResponse>> {
        const deuda = await DeudaService.getById(id_deuda);
        if (deuda.isFailure) {
            return Result.fail<DeudaFormDataResponse>("Deuda no encontrado");
        }

        const props = deuda.getValue().props;
        const result: DeudaFormDataResponse = {
            id: deuda.getValue().id,
            cod_activo  : props.codActivo,
            titulo: props.titulo,
            descripcion: props.descripcion,
            estado     : props.estado,
            gestion_deuda:props.gestionDeuda,
            monto_deuda: props.montoDeuda,           
            cuenta_id   : props.cuentaId,
        };

        return Result.ok(result);
    }


    public async getDeudaDetalleView(id_deuda: string): Promise<Result<DetalleDeudaDataResponse>> {
        const deuda = await DeudaService.getById(id_deuda);	
        if (deuda.isFailure) {
            return Result.fail<DetalleDeudaDataResponse>("Deuda no encontrado");
        }
        const props = deuda.getValue().props;	
        const result: DetalleDeudaDataResponse = {		
            id           : deuda.getValue().id,
            cod_activo   : props.codActivo,
            titulo       : props.titulo,
            descripcion  : props.descripcion,
            gestion_deuda: props.gestionDeuda,
            monto_deuda  : formatearNumero(Number(props.montoDeuda),'en-US'),
            cuenta_id    : props.cuentaId
        };   
        return Result.ok(result);
    }


    public async getPDFDeudor(params: string): Promise<Result<any>> {
        const ID_CUENTA = params;
        const cuenta = await CuentaService.getById(ID_CUENTA);
        if (cuenta.isFailure) return Result.fail("Cuenta no encontrado");
        const cuentaProps = cuenta.getValue().props;
        
        const deuda = await DeudaService.getAll();
        if (deuda.isFailure) return Result.fail("Falló al obtener la deuda");
        const deudaResult = deuda.getValue().filter((d) => d.props.cuentaId===ID_CUENTA);

        const cantidadActivos = deudaResult.length - 1;

        const historial = await HistorialService.getAll();
        if (historial.isFailure) return Result.fail("Falló al obtener la deuda");
        const historialResult = historial.getValue();
        
        const detalleDeuda =  deudaResult                                
                                .filter((d) => !d.props.titulo.includes('INICIAL'))
                                .map((item, index)=> {                 
                                    const historialItem =  historialResult.find((d) => d.props.deudasId && d.props.deudasId.includes(item.id));
                                    const ESTADO = item.props.estado? ENUM_DEUDA[0]:ENUM_DEUDA[1];
                                    return {
                                        index,
                                        titulo_deuda     : item.props.titulo || "",
                                        concepto_deuda   : item.props.descripcion || "",
                                        descripcion_deuda: item.props.descripcion || "",
                                        saldo            : historialItem?formatearNumero(historialItem.props.haber || historialItem.props.debe ,'en-US'):"",
                                        estado           : ESTADO || "",
                                    }                        
                                }).sort((a, b) => a.index > b.index ? 1 : -1);
        
        const printDate = moment().locale('es').format('D [de] MMMM [de] YYYY HH:mm:ss');
        const result = {
            info: {
                codigo: `${cuentaProps.nombreDeudor}-
                        ${cuentaProps.ci}-                         
                        ${cuentaProps.gestionGeneracionDeuda}-                         
                        ${cuentaProps.saldo}-                         
                        ${cantidadActivos}`,
                fecha_hora: printDate
            },
            data: {
                nombre_deudor           : cuentaProps.nombreDeudor,
                ci                      : cuentaProps.ci,
                gestion_generacion_deuda: cuentaProps.gestionGeneracionDeuda,
                tipo_cuenta             : cuentaProps.tipoCuenta,
                cantidad_registros      : cantidadActivos,
                saldo_real              : formatearNumero(Number(cuentaProps.saldo),'en-US'),
                doc_adjuntos            : cuentaProps.adjuntos?cuentaProps.adjuntos.length+" archivo(s) digital(es)": "-",
                rows                    : detalleDeuda,
            }
        };
        return Result.ok(result);
    }

}
