import { AreaRepositoryInMemory } from "./_in_memory/AreaRepositoryInMemory";
import { IAreaRepository } from "./IAreaRepository";
import { AreaRepositorySQL } from "./_sql/AreaRepositorySQL";
import { Database } from "../../../../Database";

const db = Database.getInstance();
const AreaRepository: IAreaRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new AreaRepositorySQL(db.models.area)
        : new AreaRepositoryInMemory();

export { AreaRepository };
