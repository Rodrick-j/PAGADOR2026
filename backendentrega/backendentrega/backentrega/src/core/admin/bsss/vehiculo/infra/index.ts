import { VehiculoRepositoryInMemory } from "./_in_memory/VehiculoRepositoryInMemory";
import { IVehiculoRepository } from "./IVehiculoRepository";
import { VehiculoRepositorySQL } from "./_sql/VehiculoRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const VehiculoRepository: IVehiculoRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new VehiculoRepositorySQL(db.models.vehiculo)
        : new VehiculoRepositoryInMemory();

export { VehiculoRepository };
