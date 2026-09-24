import { IDetalleDestinorrhhRepository } from "../IDetalleDestinorrhhRepository";
import { DetalleDestinorrhhEntity } from "../../DetalleDestinorrhhEntity";
import { BaseInMemoryRepository } from "../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class DetalleDestinorrhhRepositoryInMemory extends BaseInMemoryRepository<DetalleDestinorrhhEntity> implements IDetalleDestinorrhhRepository {}

