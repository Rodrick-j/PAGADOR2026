import { HistorialAperturaRepositoryInMemory } from "./_in_memory/HistorialAperturaRepositoryInMemory";
import { IHistorialAperturaRepository } from "./IHistorialAperturaRepository";
import { HistorialAperturaRepositorySQL } from "./_sql/HistorialAperturaRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const HistorialAperturaRepository: IHistorialAperturaRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new HistorialAperturaRepositorySQL(db.models.historial_detalle_ap)
        : new HistorialAperturaRepositoryInMemory();

export { HistorialAperturaRepository };