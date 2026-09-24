import { IRutaRepository } from "../IRutaRepository";
import { RutaEntity } from "../../RutaEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class RutaRepositoryInMemory extends BaseInMemoryRepository<RutaEntity> implements IRutaRepository {}
