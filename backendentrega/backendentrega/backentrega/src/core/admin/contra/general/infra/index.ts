import { GeneralRepositoryInMemory } from "./_in_memory/GeneralRepositoryInMemory";
import { IGeneralRepository } from "./IGeneralRepository";
import { GeneralRepositorySQL } from "./_sql/GeneralRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const GeneralRepository: IGeneralRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new GeneralRepositorySQL(db.models.general)
        : new GeneralRepositoryInMemory();

export { GeneralRepository };
