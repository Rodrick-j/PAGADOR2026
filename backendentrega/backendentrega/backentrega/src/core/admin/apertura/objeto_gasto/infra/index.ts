import { ObjetoGastoRepositoryInMemory } from "./_in_memory/ObjetoGastoRepositoryInMemory";
import { IObjetoGastoRepository } from "./IObjetoGastoRepository";
import { ObjetoGastoRepositorySQL } from "./_sql/ObjetoGastoRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const ObjetoGastoRepository: IObjetoGastoRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new ObjetoGastoRepositorySQL(db.models.objeto_gasto)
        : new ObjetoGastoRepositoryInMemory();

export { ObjetoGastoRepository };