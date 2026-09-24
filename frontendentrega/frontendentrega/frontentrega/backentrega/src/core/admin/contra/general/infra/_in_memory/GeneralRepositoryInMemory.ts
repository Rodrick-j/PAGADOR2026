import { IGeneralRepository } from "../IGeneralRepository";
import { GeneralEntity } from "../../GeneralEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class GeneralRepositoryInMemory extends BaseInMemoryRepository<GeneralEntity> implements IGeneralRepository {}
