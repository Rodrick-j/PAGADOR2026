import { IMemorandumRepository } from "../IMemorandumRepository";
import { MemorandumEntity } from "../../MemorandumEntity";
import { BaseInMemoryRepository } from "../../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class MemorandumRepositoryInMemory extends BaseInMemoryRepository<MemorandumEntity> implements IMemorandumRepository{}

