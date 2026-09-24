import { IActaRepository } from "../IActaRepository";
import { ActaEntity } from "../../ActaEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class ActaRepositoryInMemory extends BaseInMemoryRepository<ActaEntity> implements IActaRepository {}
