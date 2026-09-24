import { BitacoraDetalleRepositoryInMemory } from "./_in_memory/BitacoraDetalleRepositoryInMemory";
import { IBitacoraDetalleRepository } from "./IBitacoraDetalleRepository";
import { BitacoraDetalleRepositorySQL } from "./_sql/BitacoraDetalleRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const BitacoraDetalleRepository: IBitacoraDetalleRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new BitacoraDetalleRepositorySQL(db.models.bitacora_detalle)
        : new BitacoraDetalleRepositoryInMemory();

export { BitacoraDetalleRepository };
