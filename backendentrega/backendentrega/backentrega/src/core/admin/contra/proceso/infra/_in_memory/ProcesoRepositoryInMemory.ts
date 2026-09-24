import { IProcesoRepository } from "../IProcesoRepository";
import { ProcesoEntity } from "../../ProcesoEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class ProcesoRepositoryInMemory extends BaseInMemoryRepository<ProcesoEntity> implements IProcesoRepository {}
