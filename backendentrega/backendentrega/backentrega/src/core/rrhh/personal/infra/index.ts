import { PersonalRepositoryInMemory } from "./_in_memory/PersonalRepositoryInMemory";
import { IPersonalRepository } from "./IPersonalRepository";
import { PersonalRepositorySQL } from "./_sql/PersonalRepositorySQL";
import { Database } from "../../../../Database";

const db = Database.getInstance();
const PersonalRepository: IPersonalRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new PersonalRepositorySQL(db.models.personal)
        : new PersonalRepositoryInMemory();

export { PersonalRepository };
