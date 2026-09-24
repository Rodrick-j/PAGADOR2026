import { ValeRepositoryInMemory } from "./_in_memory/ValeRepositoryInMemory";
import { IValeRepository } from "./IValeRepository";
import { ValeRepositorySQL } from "./_sql/ValeRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const ValeRepository: IValeRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new ValeRepositorySQL(db.models.vale)
        : new ValeRepositoryInMemory();

export { ValeRepository };
