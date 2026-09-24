import { IHistorialRepository } from "../IHistorialRepository";
import { HistorialEntity } from "../../HistorialEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class HistorialRepositoryInMemory extends BaseInMemoryRepository<HistorialEntity> implements IHistorialRepository {}
