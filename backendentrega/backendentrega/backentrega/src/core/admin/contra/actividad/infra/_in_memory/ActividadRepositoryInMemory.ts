import { IActividadRepository } from "../IActividadRepository";
import { ActividadEntity } from "../../ActividadEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class ActividadRepositoryInMemory extends BaseInMemoryRepository<ActividadEntity> implements IActividadRepository {}
