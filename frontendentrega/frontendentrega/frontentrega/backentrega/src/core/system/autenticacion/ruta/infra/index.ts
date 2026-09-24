import { RutaRepositoryInMemory } from "./_in_memory/RutaRepositoryInMemory";
import { IRutaRepository } from "./IRutaRepository";
import { RutaRepositorySQL } from "./_sql/RutaRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const RutaRepository: IRutaRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new RutaRepositorySQL(db.models.ruta)
        : new RutaRepositoryInMemory();

export { RutaRepository };
