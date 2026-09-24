import { IAperturaGeneralRepository } from "../IAperturaGeneralRepository";
import { AperturaGeneralEntity } from "../../AperturaGeneralEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class AperturaGeneralRepositoryInMemory extends BaseInMemoryRepository<AperturaGeneralEntity> implements IAperturaGeneralRepository {}

