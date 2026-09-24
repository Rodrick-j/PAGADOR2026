import { BitacoraEntity } from "../../BitacoraEntity";
import { IBitacoraRepository } from "../IBitacoraRepository";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class BitacoraRepositoryInMemory
    extends BaseInMemoryRepository<BitacoraEntity>
    implements IBitacoraRepository {}
