import { EscalaRepositoryInMemory } from "./_in_memory/EscalaRepositoryInMemory";
import { IEscalaRepository } from "./IEscalaRepository";
import { EscalaRepositorySQL } from "./_sql/EscalaRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const EscalaRepository: IEscalaRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new EscalaRepositorySQL(db.models.escala)
        : new EscalaRepositoryInMemory();

export { EscalaRepository };