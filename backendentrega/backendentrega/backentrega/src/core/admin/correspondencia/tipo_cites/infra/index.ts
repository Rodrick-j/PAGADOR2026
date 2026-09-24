import { TipoCitesRepositoryInMemory } from "./_in_memory/TipoCitesRepositoryInMemory";
import { ITipoCitesRepository } from "./ITipoCitesRepository";
import { TipoCitesRepositorySQL } from "./_sql/TipoCitesRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const TipoCitesRepository: ITipoCitesRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new TipoCitesRepositorySQL(db.models.tipo_cites)
        : new TipoCitesRepositoryInMemory();

export { TipoCitesRepository };