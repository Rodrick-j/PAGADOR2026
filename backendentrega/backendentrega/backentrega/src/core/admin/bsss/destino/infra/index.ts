import { DestinoRepositoryInMemory } from "./_in_memory/DestinoRepositoryInMemory";
import { IDestinoRepository } from "./IDestinoRepository";
import { DestinoRepositorySQL } from "./_sql/DestinoRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const DestinoRepository: IDestinoRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new DestinoRepositorySQL(db.models.destino)
        : new DestinoRepositoryInMemory();

export { DestinoRepository };
