import { IViaticoRepository } from "../IViaticoRepository";
import { ViaticoEntity } from "../../ViaticoEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class ViaticoRepositoryInMemory extends BaseInMemoryRepository<ViaticoEntity> implements IViaticoRepository{}

