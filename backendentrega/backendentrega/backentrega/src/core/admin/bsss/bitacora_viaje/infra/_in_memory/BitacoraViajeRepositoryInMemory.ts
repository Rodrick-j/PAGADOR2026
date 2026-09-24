import { IBitacoraViajeRepository } from "../IBitacoraViajeRepository";
import { BitacoraViajeEntity } from "../../BitacoraViajeEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class BitacoraViajeRepositoryInMemory extends BaseInMemoryRepository<BitacoraViajeEntity> implements IBitacoraViajeRepository {}
