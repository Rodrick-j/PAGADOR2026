import { IMemorandumrrhhRepository } from "../IMemorandumrrhhRepository";
import { MemorandumrrhhEntity } from "../../MemorandumrrhhEntity";
import { BaseInMemoryRepository } from "../../../../../base/infra/_in_memory/BaseInMemoryRepository";

export class MemorandumrrhhRepositoryInMemory extends BaseInMemoryRepository<MemorandumrrhhEntity> implements IMemorandumrrhhRepository{}

