import { ICitesRepository } from "../ICitesRepository";
import { CitesEntity } from "../../CitesEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class CitesRepositoryInMemory extends BaseInMemoryRepository<CitesEntity> implements ICitesRepository {}

