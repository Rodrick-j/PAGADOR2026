import { IValeRepository } from "../IValeRepository";
import { ValeEntity } from "../../ValeEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class ValeRepositoryInMemory extends BaseInMemoryRepository<ValeEntity> implements IValeRepository {}
