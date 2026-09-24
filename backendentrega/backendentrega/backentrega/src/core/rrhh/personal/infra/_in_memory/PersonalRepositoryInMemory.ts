import { IPersonalRepository } from "../IPersonalRepository";
import { PersonalEntity } from "../../PersonalEntity";
import { BaseInMemoryRepository } from "../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class PersonalRepositoryInMemory extends BaseInMemoryRepository<PersonalEntity> implements IPersonalRepository {}
