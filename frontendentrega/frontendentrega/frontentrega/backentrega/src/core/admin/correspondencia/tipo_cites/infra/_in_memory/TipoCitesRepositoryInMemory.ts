import { ITipoCitesRepository } from "../ITipoCitesRepository";
import { TipoCitesEntity } from "../../TipoCitesEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class TipoCitesRepositoryInMemory extends BaseInMemoryRepository<TipoCitesEntity> implements ITipoCitesRepository {}

