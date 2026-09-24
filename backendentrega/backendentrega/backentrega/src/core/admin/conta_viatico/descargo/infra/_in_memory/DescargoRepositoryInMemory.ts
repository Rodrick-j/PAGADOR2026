import { IDescargoRepository } from "../IDescargoRepository";
import { DescargoEntity } from "../../DescargoEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class DescargoRepositoryInMemory extends BaseInMemoryRepository<DescargoEntity> implements IDescargoRepository {}

