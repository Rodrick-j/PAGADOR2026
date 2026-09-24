import { ActividadRepositoryInMemory } from "./_in_memory/ActividadRepositoryInMemory";
import { IActividadRepository } from "./IActividadRepository";
import { ActividadRepositorySQL } from "./_sql/ActividadRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const ActividadRepository: IActividadRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new ActividadRepositorySQL(db.models.actividad)
        : new ActividadRepositoryInMemory();

export { ActividadRepository };
