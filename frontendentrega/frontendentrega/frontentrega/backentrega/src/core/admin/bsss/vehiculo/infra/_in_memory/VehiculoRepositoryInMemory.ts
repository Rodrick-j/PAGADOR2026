import { IVehiculoRepository } from "../IVehiculoRepository";
import { VehiculoEntity } from "../../VehiculoEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class VehiculoRepositoryInMemory extends BaseInMemoryRepository<VehiculoEntity> implements IVehiculoRepository {}
