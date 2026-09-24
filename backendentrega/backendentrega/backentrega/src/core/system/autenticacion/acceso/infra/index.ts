import { AccesoRepositoryInMemory } from "./_in_memory/AccesoRepositoryInMemory";
import { IAccesoRepository } from "./IAccesoRepository";
import { AccesoRepositorySQL } from "./_sql/AccesoRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const AccesoRepository: IAccesoRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new AccesoRepositorySQL(db.models.acceso)
        : new AccesoRepositoryInMemory();

export { AccesoRepository };
