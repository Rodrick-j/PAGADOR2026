import { BitacoraRepositoryInMemory } from "./_in_memory/BitacoraRepositoryInMemory";
import { IBitacoraRepository } from "./IBitacoraRepository";
import { BitacoraRepositorySQL } from "./_sql/BitacoraRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();

const BitacoraRepository: IBitacoraRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new BitacoraRepositorySQL(db.models.bitacora)
        : new BitacoraRepositoryInMemory();

export { BitacoraRepository };
