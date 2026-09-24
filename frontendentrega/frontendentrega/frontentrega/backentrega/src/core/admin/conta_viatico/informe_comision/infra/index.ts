import { InformeComisionRepositoryInMemory } from "./_in_memory/InformeComisionRepositoryInMemory";
import { IInformeComisionRepository } from "./IInformeComisionRepository";
import { InformeComisionRepositorySQL } from "./_sql/InformeComisionRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const InformeComisionRepository: IInformeComisionRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new InformeComisionRepositorySQL(db.models.informe_comision)
        : new InformeComisionRepositoryInMemory();

export { InformeComisionRepository };