import { IInformeGeneralRepository } from "../IInformeGeneralRepository";
import { InformeGeneralEntity } from "../../InformeGeneralEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class InformeGeneralRepositoryInMemory extends BaseInMemoryRepository<InformeGeneralEntity> implements IInformeGeneralRepository{}

