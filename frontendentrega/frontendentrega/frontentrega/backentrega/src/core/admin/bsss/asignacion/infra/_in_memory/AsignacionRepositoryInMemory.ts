import { IAsignacionRepository } from "../IAsignacionRepository";
import { AsignacionEntity } from "../../AsignacionEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class AsignacionRepositoryInMemory extends BaseInMemoryRepository<AsignacionEntity> implements IAsignacionRepository {}
