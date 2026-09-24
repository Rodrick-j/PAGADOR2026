import { IDetalleDestinoRepository } from "../IDetalleDestinoRepository";
import { DetalleDestinoEntity } from "../../DetalleDestinoEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class DetalleDestinoRepositoryInMemory extends BaseInMemoryRepository<DetalleDestinoEntity> implements IDetalleDestinoRepository {}

