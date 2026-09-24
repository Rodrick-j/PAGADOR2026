import { IAperturaViaticoRepository } from "../IAperturaViaticoRepository";
import { AperturaViaticoEntity } from "../../AperturaViaticoEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class AperturaViaticoRepositoryInMemory extends BaseInMemoryRepository<AperturaViaticoEntity> implements IAperturaViaticoRepository {}

