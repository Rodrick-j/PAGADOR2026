import { BitacoraViajeRepositoryInMemory } from "./_in_memory/BitacoraViajeRepositoryInMemory";
import { IBitacoraViajeRepository } from "./IBitacoraViajeRepository";
import { BitacoraViajeRepositorySQL } from "./_sql/BitacoraViajeRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const BitacoraViajeRepository: IBitacoraViajeRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new BitacoraViajeRepositorySQL(db.models.bitacora_viaje)
        : new BitacoraViajeRepositoryInMemory();

export { BitacoraViajeRepository };
