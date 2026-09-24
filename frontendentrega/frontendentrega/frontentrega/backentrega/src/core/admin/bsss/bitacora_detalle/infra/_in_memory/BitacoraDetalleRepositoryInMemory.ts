import { IBitacoraDetalleRepository } from "../IBitacoraDetalleRepository";
import { BitacoraDetalleEntity } from "../../BitacoraDetalleEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class BitacoraDetalleRepositoryInMemory extends BaseInMemoryRepository<BitacoraDetalleEntity> implements IBitacoraDetalleRepository {}
