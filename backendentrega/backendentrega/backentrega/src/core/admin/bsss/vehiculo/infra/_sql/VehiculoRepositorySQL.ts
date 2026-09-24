import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { VehiculoEntity } from "../../VehiculoEntity";
import { IVehiculoRepository } from "../IVehiculoRepository";
import { Result } from "../../../../../../base/types/Result";
import { VehiculoSQLModelData } from "./VehiculoSQLModel";

export class VehiculoRepositorySQL extends BaseSQLRepository<VehiculoEntity, VehiculoSQLModelData> implements IVehiculoRepository {
    fromSQLModelData(data: VehiculoSQLModelData, id: string): Result<VehiculoEntity> {
        return VehiculoEntity.create(
            {
                codActivo  : data.cod_activo,
                numPlaca   : data.num_placa,
                tipo       : data.tipo,
                marca      : data.marca,
                carga      : data.carga,
                observacion: data.observacion,
                estado     : data.estado,
                personalId : data.fid_personal,
                areaId     : data.fid_area,
            },
            id,
        );
    }
    toSQLModelData(entity: VehiculoEntity): VehiculoSQLModelData {
        return {
            cod_activo  : entity.props.codActivo,
            num_placa   : entity.props.numPlaca,
            tipo        : entity.props.tipo,
            marca       : entity.props.marca,
            carga       : entity.props.carga,
            observacion : entity.props.observacion,
            estado      : entity.props.estado,
            fid_personal: entity.props.personalId,
            fid_area    : entity.props.areaId,
        };
    }
}
