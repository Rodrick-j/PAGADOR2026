import { SeguimientoRepositoryInMemory } from "./_in_memory/SeguimientoRepositoryInMemory";
import { ISeguimientoRepository } from "./ISeguimientoRepository";
import { SeguimientoRepositorySQL } from "./_sql/SeguimientoRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const SeguimientoRepository: ISeguimientoRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new SeguimientoRepositorySQL(db.models.seguimiento)
        : new SeguimientoRepositoryInMemory();

export { SeguimientoRepository };
