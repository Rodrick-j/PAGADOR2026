import { IAccesoRepository } from "../IAccesoRepository";
import { AccesoEntity } from "../../AccesoEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class AccesoRepositoryInMemory extends BaseInMemoryRepository<AccesoEntity> implements IAccesoRepository {}
