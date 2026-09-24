import { HistorialGastoRepositoryInMemory } from "./_in_memory/HistorialGastoRepositoryInMemory";
import { IHistorialGastoRepository } from "./IHistorialGastoRepository";
import { HistorialGastoRepositorySQL } from "./_sql/HistorialGastoRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const HistorialGastoRepository: IHistorialGastoRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new HistorialGastoRepositorySQL(db.models.historial_gasto_ap)
        : new HistorialGastoRepositoryInMemory();

export { HistorialGastoRepository };