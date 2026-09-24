import { IAreaRepository } from "../IAreaRepository";
import { AreaEntity } from "../../AreaEntity";
import { BaseInMemoryRepository } from "../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class AreaRepositoryInMemory extends BaseInMemoryRepository<AreaEntity> implements IAreaRepository {}
