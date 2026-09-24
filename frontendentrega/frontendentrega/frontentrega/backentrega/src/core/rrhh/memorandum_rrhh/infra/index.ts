import { MemorandumrrhhRepositoryInMemory } from "./_in_memory/MemorandumrrhhRepositoryInMemory";
import { IMemorandumrrhhRepository } from "./IMemorandumrrhhRepository";
import { MemorandumrrhhRepositorySQL } from "./_sql/MemorandumrrhhRepositorySQL";
import { Database } from "../../../../Database";

const db = Database.getInstance();
const MemorandumrrhhRepository: IMemorandumrrhhRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new MemorandumrrhhRepositorySQL(db.models.memorandum_rrhh)
        : new MemorandumrrhhRepositoryInMemory();

export { MemorandumrrhhRepository };