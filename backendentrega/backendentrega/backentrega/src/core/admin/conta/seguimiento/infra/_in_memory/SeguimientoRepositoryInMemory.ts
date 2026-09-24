import { ISeguimientoRepository } from "../ISeguimientoRepository";
import { SeguimientoEntity } from "../../SeguimientoEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class SeguimientoRepositoryInMemory extends BaseInMemoryRepository<SeguimientoEntity> implements ISeguimientoRepository {}
