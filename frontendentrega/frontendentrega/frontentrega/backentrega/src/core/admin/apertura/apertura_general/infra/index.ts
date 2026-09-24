import { AperturaGeneralRepositoryInMemory } from "./_in_memory/AperturaGeneralRepositoryInMemory";
import { IAperturaGeneralRepository } from "./IAperturaGeneralRepository";
import { AperturaGeneralRepositorySQL } from "./_sql/AperturaGeneralRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const AperturaGeneralRepository: IAperturaGeneralRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new AperturaGeneralRepositorySQL(db.models.apertura_general)
        : new AperturaGeneralRepositoryInMemory();

export { AperturaGeneralRepository };