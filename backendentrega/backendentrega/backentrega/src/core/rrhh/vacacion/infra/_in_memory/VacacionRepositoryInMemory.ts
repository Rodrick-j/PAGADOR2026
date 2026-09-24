import { IVacacionRepository } from "../IVacacionRepository";
import { VacacionEntity } from "../../VacacionEntity";
import { BaseInMemoryRepository } from "../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class VacacionRepositoryInMemory extends BaseInMemoryRepository<VacacionEntity> implements IVacacionRepository {}
