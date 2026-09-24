import { Result } from "../../../base/types/Result";
import { findAndCountResult } from "../../../tools/util";
import { SigapoTableModel, SigapoTableDetalleModel } from "./controller/SettingViewController";

export class SettingView {  
  
  
    public async getTableSigapo(query: any, result: SigapoTableModel[]): Promise<Result<{ rows: SigapoTableModel[] }>> { 
        if ('_limit' in query) delete query._limit;
        
        const response = findAndCountResult(result, query);

        return Result.ok(response);
    }

    public async getTableDetalleSigapo(query: any): Promise<Result<{ rows: SigapoTableDetalleModel[] }>> { 
        if ('_limit' in query) delete query._limit;
        const result:SigapoTableDetalleModel [] = [
            {
                hoja_de_ruta   : "ATI-309/2024",
                nro            : "1",                
                destino        : "HENRY RONALD HEREDIA MONTERO",
                lugar          : "SECRETARIA DEPARTAMENTAL DE ADMINISTRACION Y FINANZAS PUBLICAS",
                instruccion    : "-",
                objeto         : "-",
                fecha_recepcion: "03 de Mayo de 2024 - 04:44 pm",
                fecha_salida   : "07 de Mayo de 2024 - 09:29 am",
                permanencia    : "4 dias",
            },
            {
                hoja_de_ruta   : "ATI-309/2024",
                nro            : "2",                
                destino        : "LISBETH JACQUELIN TITO GARCIA",
                lugar          : "AREA DE PRESUPUESTOS",
                instruccion    : "PREVIA REVISION",
                objeto         : "URGENTE",
                fecha_recepcion: "-",
                fecha_salida   : "08 de Mayo de 2024 - 10:19 am",
                permanencia    : "1 dias",
            },
            {
                hoja_de_ruta   : "ATI-309/2024",
                nro            : "3",                
                destino        : "JEANNETH ANGELICA CHAMBI CHINC",
                lugar          : "AREA DE PRESUPUESTOS",
                instruccion    : "PARA SU PROCESO SEGUN NORMATICA VIGENTE",
                objeto         : "URGENTE",
                fecha_recepcion: "-",
                fecha_salida   : "08 de Mayo de 2024 - 05:06 pm",
                permanencia    : "0 dias",
            },
            {
                hoja_de_ruta   : "ATI-309/2024",
                nro            : "3",                
                destino        : "JEANNETH ANGELICA CHAMBI CHINC",
                lugar          : "AREA DE PRESUPUESTOS",
                instruccion    : "PARA SU PROCESO SEGUN NORMATICA VIGENTE",
                objeto         : "URGENTE",
                fecha_recepcion: "-",
                fecha_salida   : "08 de Mayo de 2024 - 05:06 pm",
                permanencia    : "0 dias",
            },
            {
                hoja_de_ruta   : "ATI-309/2024",
                nro            : "3",                
                destino        : "JEANNETH ANGELICA CHAMBI CHINC",
                lugar          : "AREA DE PRESUPUESTOS",
                instruccion    : "PARA SU PROCESO SEGUN NORMATICA VIGENTE",
                objeto         : "URGENTE",
                fecha_recepcion: "-",
                fecha_salida   : "08 de Mayo de 2024 - 05:06 pm",
                permanencia    : "0 dias",
            },
            {
                hoja_de_ruta   : "ATI-309/2024",
                nro            : "3",                
                destino        : "JEANNETH ANGELICA CHAMBI CHINC",
                lugar          : "AREA DE PRESUPUESTOS",
                instruccion    : "PARA SU PROCESO SEGUN NORMATICA VIGENTE",
                objeto         : "URGENTE",
                fecha_recepcion: "-",
                fecha_salida   : "08 de Mayo de 2024 - 05:06 pm",
                permanencia    : "0 dias",
            },
            
        ];

        const response = findAndCountResult(result, query);

        return Result.ok(response);
    }

    public async getTableDetalleSigapoV2(query: any, data: any, data2: any): Promise<Result<{ rows: SigapoTableDetalleModel[] }>> { 
        if ('_limit' in query) delete query._limit;
        const DATA_ALL = data2;
        if(data.length > 0) {            
            DATA_ALL.unshift({ 
                hojaruta_cod: data[0].cod,
                nro_destino: "1",
                fun_destino: data[0].primerfun_destino,
                dep_destino: data[0].primer_destino,
                mensaje: data[0].ref,
                proveido: data[0].estado,
                fecha_derivacion: data[0].fecha_creacion,
                fecha_recepcion: data[0].fecha_creacion,
            });
        } 
        const result:SigapoTableDetalleModel [] = DATA_ALL.map((d: any) => {
            return ({
                hoja_de_ruta   : d.hojaruta_cod,
                nro            : d.nro_destino,                
                destino        : d.fun_destino,
                lugar          : d.dep_destino,
                instruccion    : d.mensaje,
                objeto         : d.proveido,
                fecha_recepcion: d.fecha_recepcion?d.fecha_recepcion:"-",
                fecha_salida   : d.fecha_derivacion,
                permanencia    : "-",
            });
        });

        const response = findAndCountResult(result, query);

        return Result.ok(response);
    }
}
