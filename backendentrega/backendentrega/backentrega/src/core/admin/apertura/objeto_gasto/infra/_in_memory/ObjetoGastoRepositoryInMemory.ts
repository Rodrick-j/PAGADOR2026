import { IObjetoGastoRepository } from "../IObjetoGastoRepository";
import { ObjetoGastoEntity } from "../../ObjetoGastoEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class ObjetoGastoRepositoryInMemory extends BaseInMemoryRepository<ObjetoGastoEntity> implements IObjetoGastoRepository {}

