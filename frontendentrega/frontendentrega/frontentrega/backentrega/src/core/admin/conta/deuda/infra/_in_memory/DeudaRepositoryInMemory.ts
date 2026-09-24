import { IDeudaRepository } from "../IDeudaRepository";
import { DeudaEntity } from "../../DeudaEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class DeudaRepositoryInMemory extends BaseInMemoryRepository<DeudaEntity> implements IDeudaRepository {}
