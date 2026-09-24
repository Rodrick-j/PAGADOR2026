import { HistorialRepositoryInMemory } from "./_in_memory/HistorialRepositoryInMemory";
import { IHistorialRepository } from "./IHistorialRepository";
import { HistorialRepositorySQL } from "./_sql/HistorialRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const HistorialRepository: IHistorialRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new HistorialRepositorySQL(db.models.historial)
        : new HistorialRepositoryInMemory();

export { HistorialRepository };
