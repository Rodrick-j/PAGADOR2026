import { IHistorialGastoRepository } from "../IHistorialGastoRepository";
import { HistorialGastoEntity } from "../../HistorialGastoEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class HistorialGastoRepositoryInMemory extends BaseInMemoryRepository<HistorialGastoEntity> implements IHistorialGastoRepository {}

