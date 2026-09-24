import { ProcesoRepositoryInMemory } from "./_in_memory/ProcesoRepositoryInMemory";
import { IProcesoRepository } from "./IProcesoRepository";
import { ProcesoRepositorySQL } from "./_sql/ProcesoRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const ProcesoRepository: IProcesoRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new ProcesoRepositorySQL(db.models.proceso)
        : new ProcesoRepositoryInMemory();

export { ProcesoRepository };
