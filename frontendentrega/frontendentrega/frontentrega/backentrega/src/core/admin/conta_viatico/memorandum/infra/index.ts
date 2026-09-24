import { MemorandumRepositoryInMemory } from "./_in_memory/MemorandumRepositoryInMemory";
import { IMemorandumRepository } from "./IMemorandumRepository";
import { MemorandumRepositorySQL } from "./_sql/MemorandumRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const MemorandumRepository: IMemorandumRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new MemorandumRepositorySQL(db.models.memorandum)
        : new MemorandumRepositoryInMemory();

export { MemorandumRepository };