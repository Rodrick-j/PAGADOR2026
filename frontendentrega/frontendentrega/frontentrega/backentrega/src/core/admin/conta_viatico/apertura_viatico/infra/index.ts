import { AperturaViaticoRepositoryInMemory } from "./_in_memory/AperturaViaticoRepositoryInMemory";
import { IAperturaViaticoRepository } from "./IAperturaViaticoRepository";
import { AperturaViaticoRepositorySQL } from "./_sql/AperturaViaticoRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const AperturaViaticoRepository: IAperturaViaticoRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new AperturaViaticoRepositorySQL(db.models.apertura_viatico)
        : new AperturaViaticoRepositoryInMemory();

export { AperturaViaticoRepository };