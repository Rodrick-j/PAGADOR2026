import { ActaRepositoryInMemory } from "./_in_memory/ActaRepositoryInMemory";
import { IActaRepository } from "./IActaRepository";
import { ActaRepositorySQL } from "./_sql/ActaRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const ActaRepository: IActaRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new ActaRepositorySQL(db.models.acta)
        : new ActaRepositoryInMemory();

export { ActaRepository };
