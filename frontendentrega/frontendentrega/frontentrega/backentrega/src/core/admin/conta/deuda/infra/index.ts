import { DeudaRepositoryInMemory } from "./_in_memory/DeudaRepositoryInMemory";
import { IDeudaRepository } from "./IDeudaRepository";
import { DeudaRepositorySQL } from "./_sql/DeudaRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const DeudaRepository: IDeudaRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new DeudaRepositorySQL(db.models.deuda)
        : new DeudaRepositoryInMemory();

export { DeudaRepository };
