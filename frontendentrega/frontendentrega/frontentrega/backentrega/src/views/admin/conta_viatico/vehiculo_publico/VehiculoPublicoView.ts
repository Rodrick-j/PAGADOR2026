import { Result } from "../../../../base/types/Result";
import { findAndCountResult } from "../../../../tools/util";
import  VehiculoPublicoService from "../../../../core/admin/conta_viatico/vehiculo_publico";

type VehiculoPublicoTableModel = {
    id                    : string;
    razon_social          : string;
    num_boleto            : number;
    placa                 : string;
    tipo_vehiculo         : string;
    precio_boleto         : number;
};

export type GetVehiculoPublicosTableResponse = {
    rows: VehiculoPublicoTableModel[];
    count: number;
};

export type VehiculoPublicoFormDataResponse = {
    id                    : string;
    razon_social          : string;
    num_boleto            : number;
    placa                 : string;
    tipo_vehiculo         : string;
    precio_boleto         : number;
};

export class VehiculoPublicoView {
    public async getVehiculoPublicosTable(query: any): Promise<Result<{ rows: VehiculoPublicoTableModel[] }>> {
            const vehiculoPublico = await VehiculoPublicoService.getAll();
            if (vehiculoPublico.isFailure) return Result.fail("Falló al obtener la VehiculoPublico");
            const VehiculoPublicoResult = vehiculoPublico.getValue();
          
            const result: VehiculoPublicoTableModel[] = VehiculoPublicoResult.map((item) => {
               
                return {
                    id                    : String(item.id),
                    razon_social          : item.props.razonSocial,
                    num_boleto            : item.props.numBoleto,
                    placa                 : item.props.placa,
                    tipo_vehiculo         : item.props.tipoVehiculo,
                    precio_boleto         : item.props.precioBoleto,
                };
            });
            
            const response = findAndCountResult(result, query);
            return Result.ok(response);
    }

    public async getVehiculoPublicoFormDataView(id_vehiculo_publico: string): Promise<Result<VehiculoPublicoFormDataResponse>> {
        const vehiculoPublico = await VehiculoPublicoService.getById(id_vehiculo_publico);
        if (vehiculoPublico.isFailure) return Result.fail<VehiculoPublicoFormDataResponse>("VehiculoPublico no encontrado");
        
        const props = vehiculoPublico.getValue().props;

        const result: VehiculoPublicoFormDataResponse = {
            id                    : vehiculoPublico.getValue().id, 
            razon_social          : props.razonSocial,
            num_boleto            : props.numBoleto,
            placa                 : props.placa,
            tipo_vehiculo         : props.tipoVehiculo,
            precio_boleto         : props.precioBoleto,
        };

        return Result.ok(result);
    }
}