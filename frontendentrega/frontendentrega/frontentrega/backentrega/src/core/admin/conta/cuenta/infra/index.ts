import { CuentaRepositoryInMemory } from "./_in_memory/CuentaRepositoryInMemory";
import { ICuentaRepository } from "./ICuentaRepository";
import { CuentaRepositorySQL } from "./_sql/CuentaRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const CuentaRepository: ICuentaRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new CuentaRepositorySQL(db.models.cuenta)
        : new CuentaRepositoryInMemory();

export { CuentaRepository };
