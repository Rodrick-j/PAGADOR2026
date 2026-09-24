import { IInformeComisionRepository } from "../IInformeComisionRepository";
import { InformeComisionEntity } from "../../InformeComisionEntity";

import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class InformeComisionRepositoryInMemory extends BaseInMemoryRepository<InformeComisionEntity> implements IInformeComisionRepository{}


