import { IActaRecepcionRepository } from "../IActaRecepcionRepository";
import { ActaRecepcionEntity } from "../../ActaRecepcionEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class ActaRecepcionRepositoryInMemory extends BaseInMemoryRepository<ActaRecepcionEntity> implements IActaRecepcionRepository {}
