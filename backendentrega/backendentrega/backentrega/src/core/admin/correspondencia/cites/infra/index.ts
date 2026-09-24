import { CitesRepositoryInMemory } from "./_in_memory/CitesRepositoryInMemory";
import { ICitesRepository } from "./ICitesRepository";
import { CitesRepositorySQL } from "./_sql/CitesRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const CitesRepository: ICitesRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new CitesRepositorySQL(db.models.cites)
        : new CitesRepositoryInMemory();

export { CitesRepository };