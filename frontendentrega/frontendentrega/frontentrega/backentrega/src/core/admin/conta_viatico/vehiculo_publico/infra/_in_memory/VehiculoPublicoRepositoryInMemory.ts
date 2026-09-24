import { IVehiculoPublicoRepository } from "../IVehiculoPublicoRepository";
import { VehiculoPublicoEntity } from "../../VehiculoPublicoEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class vehiculoPublicoRepositoryInMemory extends BaseInMemoryRepository<VehiculoPublicoEntity> implements IVehiculoPublicoRepository{}


