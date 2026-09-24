import { Result } from "../../../../base/types/Result";

import { findAndCountResult } from "../../../../tools/util";

import BitacoraDetalleService from "../../../../core/admin/bsss/bitacora_detalle";
import moment from "moment";
import DestinoService  from "../../../../core/admin/bsss/destino";

type BitacoraDetalleTableModel = {
    id                : string;
    fecha_salida      : string;
    fecha_retorno     : string;
    hora_salida       : string;
    hora_retorno      : string;
    destino_salida    : string;
    destino_llegada   : string;
    km_salida         : number;
    km_llegada        : number;
    km_estimados      : number;
    cantidad_personas : number;
    estado            : string;
    fid_bitacora_viaje: string;
};

export type GetBitacoraDetallesTableResponse = {
    rows: BitacoraDetalleTableModel[];
    count: number;
};

export type BitacoraDetalleFormDataResponse = {
    id: string;
    fecha_salida      : string;
    fecha_retorno     : string;
    hora_salida       : string;
    hora_retorno      : string;
    destino_salida    : string;
    destino_llegada   : string;
    km_salida         : number;
    km_llegada        : number;
    km_estimados      : number;
    cantidad_personas : number;
    estado           : string;
    fid_bitacora_viaje: string;
};

export type BitacoraDetallesOptionsFormModel = {
    id: string;
    nombre?: string;
    concepto?: string;
};

export class BitacoraDetalleView {
    public async getBitacoraDetallesTable(query: any): Promise<Result<GetBitacoraDetallesTableResponse>> {
       const bitacoraDetalle = await BitacoraDetalleService.getAll();
       if (bitacoraDetalle.isFailure) return Result.fail("Falló al obtener la bitacoraDetalle");
        const bitacoraDetalleResult = bitacoraDetalle.getValue();
        /*Listado de vehiculos*/
         const destino = await DestinoService.getAll();
         if(destino.isFailure) return Result.fail("Fallo al obtener el destino");
         const destinoResult = destino.getValue();      
                           
            const result: BitacoraDetalleTableModel[] = bitacoraDetalleResult.map((item) => {

            const destinoNombreSalida =  destinoResult.find((c) => c.id === item.props.destinoSalida)?.props.nombre|| "-";// revisar sesta parte      
            const destinoNombreLlegada =  destinoResult.find((c) => c.id === item.props.destinoLlegada)?.props.nombre|| "-";// revisar sesta parte      
                return {
                    id                     : String(item.id),                     
                    fecha_salida      :  item.props.fechaSalida?moment(item.props.fechaSalida).format("DD/MM/YYYY").toString(): '',
                    fecha_retorno     :  item.props.fechaRetorno?moment(item.props.fechaRetorno).format("DD/MM/YYYY").toString(): '',
                    hora_salida       :  item.props.horaSalida?moment(item.props.horaSalida).format("HH:mm").toString(): '',
                    hora_retorno      :  item.props.horaRetorno?moment(item.props.horaRetorno).format("HH:mm").toString(): '',
                    destino_salida    :  destinoNombreSalida,
                    destino_llegada   :  destinoNombreLlegada,
                    km_salida         :  item.props.kmSalida,
                    km_llegada        :  item.props.kmLlegada,
                    km_estimados      :  item.props.kmEstimados,
                    cantidad_personas :  item.props.cantidadPersonas,
                    estado            :  item.props.estado,
                    fid_bitacora_viaje:  item.props.bitacoraViajeId,
                };
            });
            const response = findAndCountResult(result, query);
            return Result.ok(response);
    }

    public async getBitacoraDetalleFormDataView(id_bitacora_detalle: string): Promise<Result<BitacoraDetalleFormDataResponse>> {
        const bitacoraDetalle = await BitacoraDetalleService.getById(id_bitacora_detalle);
        if (bitacoraDetalle.isFailure) {
            return Result.fail<BitacoraDetalleFormDataResponse>("BitacoraDetalle no encontrado");
        }

        const props = bitacoraDetalle.getValue().props;
        const result: BitacoraDetalleFormDataResponse = {
            id                : bitacoraDetalle.getValue().id,
            fecha_salida      : props.fechaSalida?moment(props.fechaSalida).format("MM/DD/YYYY").toString(): '',
            fecha_retorno     : props.fechaRetorno?moment(props.fechaRetorno).format("MM/DD/YYYY").toString(): '',
            hora_salida       : props.horaSalida,
            hora_retorno      : props.horaRetorno,
            destino_salida    : props.destinoSalida,
            destino_llegada   : props.destinoLlegada,
            km_salida         : props.kmSalida,
            km_llegada        : props.kmLlegada,
            km_estimados      : props.kmEstimados,
            cantidad_personas : props.cantidadPersonas,
            estado            : props.estado,
            fid_bitacora_viaje: props.bitacoraViajeId,
        };

        return Result.ok(result);
    }

    public async getAllBitacoraDetalles(): Promise<Result<{ rows: BitacoraDetallesOptionsFormModel[]; count: number }>> {
        const aperturas = await BitacoraDetalleService.getAll();
        if (aperturas.isFailure) return Result.fail("Falló al obtener la aperturas");        
        const aperturaResult = aperturas.getValue().filter((a) => a.props.estado);
        if (!aperturaResult) return Result.fail("Error no existe apertura asignada.");

        const result: BitacoraDetallesOptionsFormModel[] = aperturas.getValue().map((item) => {
            return {
                id: item.id.toString(),
            };
        })

        return Result.ok({ rows: result, count: result.length });
    }

   
}
