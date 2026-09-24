import { IHistorialAperturaRepository } from "../IHistorialAperturaRepository";
import { HistorialAperturaEntity } from "../../HistorialAperturaEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class HistorialAperturaRepositoryInMemory extends BaseInMemoryRepository<HistorialAperturaEntity> implements IHistorialAperturaRepository {}

