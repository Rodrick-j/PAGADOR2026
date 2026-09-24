import { ActaRecepcionRepositoryInMemory } from "./_in_memory/ActaRecepcionRepositoryInMemory";
import { IActaRecepcionRepository } from "./IActaRecepcionRepository";
import { ActaRecepcionRepositorySQL } from "./_sql/ActaRecepcionRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const ActaRecepcionRepository: IActaRecepcionRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new ActaRecepcionRepositorySQL(db.models.acta_recepcion)
        : new ActaRecepcionRepositoryInMemory();

export { ActaRecepcionRepository };
