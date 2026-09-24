import { ViaticoRepositoryInMemory } from "./_in_memory/ViaticoRepositoryInMemory";
import { IViaticoRepository } from "./IViaticoRepository";
import { ViaticoRepositorySQL } from "./_sql/ViaticoRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const ViaticoRepository: IViaticoRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new ViaticoRepositorySQL(db.models.viatico)
        : new ViaticoRepositoryInMemory();

export { ViaticoRepository };