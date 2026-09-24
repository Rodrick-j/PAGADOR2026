import { VacacionRepositoryInMemory } from "./_in_memory/VacacionRepositoryInMemory";
import { IVacacionRepository } from "./IVacacionRepository";
import { VacacionRepositorySQL } from "./_sql/VacacionRepositorySQL";
import { Database } from "../../../../Database";

const db = Database.getInstance();
const VacacionRepository: IVacacionRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new VacacionRepositorySQL(db.models.vacacion)
        : new VacacionRepositoryInMemory();

export { VacacionRepository };
