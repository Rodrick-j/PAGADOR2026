import { IEscalaDestinoRepository } from "../IEscalaDestinoRepository";
import { EscalaDestinoEntity } from "../../EscalaDestinoEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class EscalaDestinoRepositoryInMemory extends BaseInMemoryRepository<EscalaDestinoEntity> implements IEscalaDestinoRepository {}

