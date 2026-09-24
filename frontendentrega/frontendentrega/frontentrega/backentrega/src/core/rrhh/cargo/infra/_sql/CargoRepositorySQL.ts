import BaseSQLRepository from "../../../../../base/infra/_sql/BaseSQLRepository";
import { CargoEntity } from "../../CargoEntity";
import { ICargoRepository } from "../ICargoRepository";
import { Result } from "../../../../../base/types/Result";
import { CargoSQLModelData } from "./CargoSQLModel";

export class CargoRepositorySQL extends BaseSQLRepository<CargoEntity, CargoSQLModelData> implements ICargoRepository {
    fromSQLModelData(data: CargoSQLModelData, id: string): Result<CargoEntity> {
        return CargoEntity.create(
            {
                nombre: data.nombre,
                item: data.item,
                gestionCreacion: data.gestion_creacion,
                tipo: data.tipo,
                salario: data.salario,
                privilegio: data.privilegio,
                libre: data.libre,
                nivel: data.nivel,
                activo: data.activo,
            },
            id,
        );
    }
    toSQLModelData(entity: CargoEntity): CargoSQLModelData {
        return {
            nombre: entity.props.nombre,
            item: entity.props.item,
            gestion_creacion: entity.props.gestionCreacion,
            tipo: entity.props.tipo,
            salario: entity.props.salario,
            privilegio: entity.props.privilegio,
            libre: entity.props.libre,
            nivel: entity.props.nivel,
            activo: entity.props.activo,
        };
    }
}
