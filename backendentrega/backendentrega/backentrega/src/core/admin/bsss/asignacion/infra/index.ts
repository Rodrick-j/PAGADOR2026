import { AsignacionRepositoryInMemory } from "./_in_memory/AsignacionRepositoryInMemory";
import { IAsignacionRepository } from "./IAsignacionRepository";
import { AsignacionRepositorySQL } from "./_sql/AsignacionRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const AsignacionRepository: IAsignacionRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new AsignacionRepositorySQL(db.models.asignacion)
        : new AsignacionRepositoryInMemory();

export { AsignacionRepository };
