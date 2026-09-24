import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { VehiculoPublicoEntity } from "../../VehiculoPublicoEntity";
import { IVehiculoPublicoRepository } from "../IVehiculoPublicoRepository";
import { Result } from "../../../../../../base/types/Result";
import { VehiculoPublicoSQLModelData } from "./VehiculoPublicoSQLModel";

export class VehiculoPublicoRepositorySQL extends BaseSQLRepository<VehiculoPublicoEntity, VehiculoPublicoSQLModelData> implements IVehiculoPublicoRepository {
    fromSQLModelData(data: VehiculoPublicoSQLModelData, id: string): Result<VehiculoPublicoEntity> {
        return VehiculoPublicoEntity.create(
            {
                razonSocial          : data.razon_social,
                numBoleto            : data.num_boleto,
                placa                : data.placa,
                tipoVehiculo         : data.tipo_vehiculo,
                precioBoleto         : data.precio_boleto,
            },
            id,
        );
    }
    toSQLModelData(entity: VehiculoPublicoEntity): VehiculoPublicoSQLModelData {
        return {
            razon_social          : entity.props.razonSocial,
            num_boleto            : entity.props.numBoleto,
            placa                 : entity.props.placa,
            tipo_vehiculo         : entity.props.tipoVehiculo,
            precio_boleto         : entity.props.precioBoleto,
        };
    }
}
