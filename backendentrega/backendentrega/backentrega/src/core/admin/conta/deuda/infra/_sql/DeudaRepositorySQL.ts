import BaseSQLRepository from "../../../../../../base/infra/_sql/BaseSQLRepository";
import { DeudaEntity } from "../../DeudaEntity";
import { IDeudaRepository } from "../IDeudaRepository";
import { Result } from "../../../../../../base/types/Result";
import { DeudaSQLModelData } from "./DeudaSQLModel";

export class DeudaRepositorySQL extends BaseSQLRepository<DeudaEntity, DeudaSQLModelData> implements IDeudaRepository {
    fromSQLModelData(data: DeudaSQLModelData, id: string): Result<DeudaEntity> {
        return DeudaEntity.create(
            {
                codActivo  : data.cod_activo,
                titulo     : data.titulo,
                descripcion: data.descripcion,
                estado     : data.estado,
                cuentaId   : data.fid_cuenta,
                gestionDeuda: data.gestion_deuda,
                montoDeuda   : data.monto_deuda,
            },
            id,
        );
    }
    toSQLModelData(entity: DeudaEntity): DeudaSQLModelData {
        return {
            cod_activo : entity.props.codActivo,
            titulo     : entity.props.titulo,
            descripcion: entity.props.descripcion,
            estado     : entity.props.estado,
            gestion_deuda : entity.props.gestionDeuda,
            monto_deuda   : entity.props.montoDeuda,
            fid_cuenta : entity.props.cuentaId,
        };
    }
}
