import { vehiculoPublicoRepositoryInMemory } from "./_in_memory/VehiculoPublicoRepositoryInMemory";
import { IVehiculoPublicoRepository } from "./IVehiculoPublicoRepository";
import { VehiculoPublicoRepositorySQL } from "./_sql/VehiculoPublicoRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const VehiculoPublicoRepository: IVehiculoPublicoRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new VehiculoPublicoRepositorySQL(db.models.vehiculo_publico)
        : new vehiculoPublicoRepositoryInMemory();

export { VehiculoPublicoRepository };