import { InformeGeneralRepositoryInMemory } from "./_in_memory/InformeGeneralRepositoryInMemory";
import { IInformeGeneralRepository } from "./IInformeGeneralRepository";
import { InformeGeneralRepositorySQL } from "./_sql/InformeGeneralRepositorySQL";
import { Database } from "../../../../../Database";

const db = Database.getInstance();
const InformeGeneralRepository: IInformeGeneralRepository =
    process.env.NODE_ENV !== "test" || process.env.INTEGRATION_TEST === "y"
        ? new InformeGeneralRepositorySQL(db.models.informe_general)
        : new InformeGeneralRepositoryInMemory();

export { InformeGeneralRepository };