import { EscalaDestinoRepositoryInMemory } from "./_in_memory/EscalaDestinoRepositoryInMemory";
import { IEscalaDestinoRepository } from "./IEscalaDestinoRepository";
import { EscalaDestinoRepositorySQL } from "./_sql/EscalaDestinoRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const EscalaDestinoRepository: IEscalaDestinoRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new EscalaDestinoRepositorySQL(db.models.escala_destino)
        : new EscalaDestinoRepositoryInMemory();

export { EscalaDestinoRepository };