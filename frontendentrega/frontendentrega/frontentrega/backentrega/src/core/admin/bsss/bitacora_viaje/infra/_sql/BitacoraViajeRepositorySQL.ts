import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { BitacoraViajeEntity } from "../../BitacoraViajeEntity";
import { IBitacoraViajeRepository } from "../IBitacoraViajeRepository";
import { Result } from "../../../../../../base/types/Result";
import { BitacoraViajeSQLModelData } from "./BitacoraViajeSQLModel";

export class BitacoraViajeRepositorySQL extends BaseSQLRepository<BitacoraViajeEntity, BitacoraViajeSQLModelData> implements IBitacoraViajeRepository {
    fromSQLModelData(data: BitacoraViajeSQLModelData, id: string): Result<BitacoraViajeEntity> {
        return BitacoraViajeEntity.create(
            {
                semana   : data.semana,
                areaId   : data.fid_area,
                vehiculoId : data.fid_vehiculo,
                usuarioId  : data.fid_usuario,

            },
            id,
        );
    }
    toSQLModelData(entity: BitacoraViajeEntity): BitacoraViajeSQLModelData {
        return {
            semana   : entity.props.semana, 
            fid_area  : entity.props.areaId,
            fid_vehiculo : entity.props.vehiculoId,           
            fid_usuario : entity.props.usuarioId,          
        };
    }
}
