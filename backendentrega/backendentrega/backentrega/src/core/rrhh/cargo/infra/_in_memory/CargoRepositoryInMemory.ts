import { ICargoRepository } from "../ICargoRepository";
import { CargoEntity } from "../../CargoEntity";
import { BaseInMemoryRepository } from "../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class CargoRepositoryInMemory extends BaseInMemoryRepository<CargoEntity> implements ICargoRepository {}
