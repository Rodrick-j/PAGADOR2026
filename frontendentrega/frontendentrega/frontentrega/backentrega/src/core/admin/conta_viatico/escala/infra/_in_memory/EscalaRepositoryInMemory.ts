import { IEscalaRepository } from "../IEscalaRepository";
import { EscalaEntity } from "../../EscalaEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class EscalaRepositoryInMemory extends BaseInMemoryRepository<EscalaEntity> implements IEscalaRepository {}

