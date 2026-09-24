import { IActaRecepcionDetalleRepository } from "../IActaRecepcionDetalleRepository";
import { ActaRecepcionDetalleEntity } from "../../ActaRecepcionDetalleEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class ActaRecepcionDetalleRepositoryInMemory extends BaseInMemoryRepository<ActaRecepcionDetalleEntity> implements IActaRecepcionDetalleRepository {}
