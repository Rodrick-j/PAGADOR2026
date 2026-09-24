import { IDestinoRepository } from "../IDestinoRepository";
import { DestinoEntity } from "../../DestinoEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class DestinoRepositoryInMemory extends BaseInMemoryRepository<DestinoEntity> implements IDestinoRepository {}
