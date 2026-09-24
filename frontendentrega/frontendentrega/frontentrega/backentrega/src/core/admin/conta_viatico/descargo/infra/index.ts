import { DescargoRepositoryInMemory } from "./_in_memory/DescargoRepositoryInMemory";
import { IDescargoRepository } from "./IDescargoRepository";
import { DescargoRepositorySQL } from "./_sql/DescargoRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const DescargoRepository: IDescargoRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new DescargoRepositorySQL(db.models.descargo)
        : new DescargoRepositoryInMemory();

export { DescargoRepository };